"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IOffer } from "@/schemas/types";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  Calendar,
  Clock,
  Check,
  X,
  Sparkles,
} from "lucide-react";

async function fetchAdminOffers(): Promise<IOffer[]> {
  const res = await fetch("/api/offers?admin=true");
  if (!res.ok) throw new Error("Failed to load offers");
  return res.json();
}

async function saveOffer(id: string | null, data: Partial<IOffer>) {
  const url = id ? `/api/offers/${id}` : "/api/offers";
  const res = await fetch(url, {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save offer");
  return res.json();
}

async function deleteOfferApi(id: string) {
  const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete offer");
  return res.json();
}

export default function OfferManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingOffer, setEditingOffer] = useState<IOffer | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["admin-offers"],
    queryFn: fetchAdminOffers,
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: Partial<IOffer> }) => saveOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-offers"] });
      setEditingOffer(null);
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOfferApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-offers"] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => saveOffer(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-offers"] }),
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return offers;
    const term = searchTerm.toLowerCase();
    return offers.filter(
      (o) =>
        o.title.toLowerCase().includes(term) ||
        o.discountText.toLowerCase().includes(term) ||
        (o.promoCode && o.promoCode.toLowerCase().includes(term))
    );
  }, [offers, searchTerm]);

  const now = Date.now();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-black/5 text-center text-sm text-muted-foreground animate-pulse">
        Loading seasonal campaigns…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-black/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns, promo codes…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-muted/20 focus:bg-white transition"
          />
        </div>

        <button
          onClick={() => {
            setEditingOffer(null);
            setIsCreating(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Promotion
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((offer) => {
          const endDate = new Date(offer.endDate).getTime();
          const startDate = new Date(offer.startDate).getTime();
          const isExpired = endDate < now;
          const isUpcoming = startDate > now;
          const daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

          return (
            <div
              key={offer._id}
              className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full bg-muted">
                  {offer.image ? (
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No banner image
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#c59b27] text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {offer.discountText}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-xs ${
                        !offer.isActive
                          ? "bg-zinc-700 text-white"
                          : isExpired
                          ? "bg-rose-600 text-white"
                          : isUpcoming
                          ? "bg-sky-600 text-white"
                          : "bg-emerald-600 text-white"
                      }`}
                    >
                      {!offer.isActive ? "Paused" : isExpired ? "Expired" : isUpcoming ? "Scheduled" : "Live"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display text-xl font-semibold text-foreground">{offer.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{offer.description}</p>

                  <div className="pt-2 border-t border-black/5 flex flex-wrap gap-2 text-xs">
                    {offer.promoCode && (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                        CODE: {offer.promoCode}
                      </span>
                    )}
                    {offer.packageId && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground">
                        Applies to: {offer.packageId}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Ends {new Date(offer.endDate).toLocaleDateString()}
                    </span>
                    {!isExpired && offer.isActive && (
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {daysLeft} days remaining
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-muted/20 border-t border-black/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleActiveMutation.mutate({ id: offer._id, isActive: !offer.isActive })}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded-md hover:bg-white"
                >
                  {offer.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{offer.isActive ? "Deactivate" : "Activate"}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingOffer(offer);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition px-2.5 py-1.5 rounded-lg hover:bg-primary/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete promotion "${offer.title}"?`)) {
                        deleteMutation.mutate(offer._id);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Offer Editor Modal */}
      {(isCreating || editingOffer) && (
        <OfferEditorModal
          offer={editingOffer}
          onClose={() => {
            setIsCreating(false);
            setEditingOffer(null);
          }}
          onSave={(data) => {
            saveMutation.mutate({
              id: editingOffer?._id ?? null,
              data,
            });
          }}
          isSaving={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function OfferEditorModal({
  offer,
  onClose,
  onSave,
  isSaving,
}: {
  offer: IOffer | null;
  onClose: () => void;
  onSave: (data: Partial<IOffer>) => void;
  isSaving: boolean;
}) {
  const isNew = !offer;
  const [title, setTitle] = useState(offer?.title ?? "");
  const [discountText, setDiscountText] = useState(offer?.discountText ?? "15% Seasonal Savings");
  const [promoCode, setPromoCode] = useState(offer?.promoCode ?? "CEYLON2026");
  const [packageId, setPackageId] = useState(offer?.packageId ?? "");
  const [description, setDescription] = useState(offer?.description ?? "");
  const [startDate, setStartDate] = useState(
    offer?.startDate
      ? new Date(offer.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    offer?.endDate
      ? new Date(offer.endDate).toISOString().split("T")[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [image, setImage] = useState(offer?.image ?? "");
  const [isActive, setIsActive] = useState(offer?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      discountText,
      promoCode: promoCode.trim().toUpperCase(),
      packageId: packageId.trim() || undefined,
      description,
      startDate,
      endDate,
      image: image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-black/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {isNew ? "Launch Promotional Offer" : `Edit Campaign: ${offer.title}`}
            </h2>
            <p className="text-xs text-muted-foreground">Configure seasonal savings, promo codes, and duration window.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Campaign Headline</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monsoon Highlands Escape"
              className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Discount Badge Text</label>
              <input
                required
                type="text"
                value={discountText}
                onChange={(e) => setDiscountText(e.target.value)}
                placeholder="e.g. 20% Off or Free Airport Transfer"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Promo Code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. CEYLON2026"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Start Date</label>
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Expiry Date</label>
              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Linked Package ID (Optional)</label>
            <input
              type="text"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="e.g. pkg-ceylon-grand or leave blank for all circuits"
              className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Banner Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Campaign Terms & Narrative</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Valid for bookings confirmed 60 days prior to departure…"
              className="w-full border rounded-xl p-3 text-xs bg-muted/20 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOfferActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary"
            />
            <label htmlFor="isOfferActive" className="text-xs font-medium cursor-pointer">
              Promotional offer is active on public banners
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-black/10 text-xs font-medium hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Saving…" : isNew ? "Launch Campaign" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
