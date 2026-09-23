"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IPackage } from "@/schemas/types";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Compass,
  Calendar,
  DollarSign,
  Users,
  X,
  PlusCircle,
  Check,
  MapPin,
} from "lucide-react";

async function fetchAdminPackages(): Promise<IPackage[]> {
  const res = await fetch("/api/packages?admin=true");
  if (!res.ok) throw new Error("Failed to load packages");
  return res.json();
}

async function savePackage(id: string | null, data: Partial<IPackage>) {
  const url = id ? `/api/packages/${id}` : "/api/packages";
  const res = await fetch(url, {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save package");
  return res.json();
}

async function deletePackageApi(id: string) {
  const res = await fetch(`/api/packages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete package");
  return res.json();
}

export default function PackageManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: fetchAdminPackages,
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: Partial<IPackage> }) => savePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      setEditingPackage(null);
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePackageApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-packages"] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      savePackage(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-packages"] }),
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return packages;
    const term = searchTerm.toLowerCase();
    return packages.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.destination.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [packages, searchTerm]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-black/5 text-center text-sm text-muted-foreground animate-pulse">
        Loading package catalog…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-black/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search packages by name, destination…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-muted/20 focus:bg-white transition"
          />
        </div>

        <button
          onClick={() => {
            setEditingPackage(null);
            setIsCreating(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      {/* Package List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative h-44 w-full bg-muted">
                {pkg.images?.[0] ? (
                  <Image
                    src={pkg.images[0]}
                    alt={pkg.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No photo uploaded
                  </div>
                )}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-xs ${
                      pkg.isActive ? "bg-emerald-600 text-white" : "bg-zinc-700 text-white"
                    }`}
                  >
                    {pkg.isActive ? "Active" : "Draft"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-[11px] bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md font-medium uppercase tracking-wider">
                    {pkg.category}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>{pkg.destination}</span>
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground line-clamp-1">
                  {pkg.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{pkg.description}</p>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-black/5">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {pkg.durationDays} Days
                  </span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    Up to {pkg.maxPax} pax
                  </span>
                  <span className="font-display font-semibold text-sm text-foreground">
                    ${pkg.price} <span className="text-[10px] text-muted-foreground font-normal">/ pax</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-muted/20 border-t border-black/5 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleActiveMutation.mutate({ id: pkg._id, isActive: !pkg.isActive })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded-md hover:bg-white"
                title={pkg.isActive ? "Unpublish to draft" : "Publish to live site"}
              >
                {pkg.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{pkg.isActive ? "Draft" : "Publish"}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingPackage(pkg);
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition px-2.5 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Permanently delete "${pkg.title}"?`)) {
                      deleteMutation.mutate(pkg._id);
                    }
                  }}
                  className="p-1.5 text-muted-foreground hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {(isCreating || editingPackage) && (
        <PackageEditorModal
          pkg={editingPackage}
          onClose={() => {
            setIsCreating(false);
            setEditingPackage(null);
          }}
          onSave={(data) => {
            saveMutation.mutate({
              id: editingPackage?._id ?? null,
              data,
            });
          }}
          isSaving={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function PackageEditorModal({
  pkg,
  onClose,
  onSave,
  isSaving,
}: {
  pkg: IPackage | null;
  onClose: () => void;
  onSave: (data: Partial<IPackage>) => void;
  isSaving: boolean;
}) {
  const isNew = !pkg;
  const [title, setTitle] = useState(pkg?.title ?? "");
  const [slug, setSlug] = useState(pkg?.slug ?? "");
  const [destination, setDestination] = useState(pkg?.destination ?? "");
  const [category, setCategory] = useState(pkg?.category ?? "Heritage & Cultural");
  const [durationDays, setDurationDays] = useState(pkg?.durationDays ?? 7);
  const [price, setPrice] = useState(pkg?.price ?? 1450);
  const [maxPax, setMaxPax] = useState(pkg?.maxPax ?? 8);
  const [description, setDescription] = useState(pkg?.description ?? "");
  const [isActive, setIsActive] = useState(pkg?.isActive ?? true);
  const [imageUrl, setImageUrl] = useState(pkg?.images?.[0] ?? "");
  
  // Itinerary
  const [itinerary, setItinerary] = useState(
    pkg?.itinerary && pkg.itinerary.length > 0
      ? pkg.itinerary
      : [
          { day: 1, title: "Arrival & Negombo Lagoon", description: "VIP airport reception and transfer to luxury coastal retreat." },
          { day: 2, title: "Sigiriya Rock Fortress", description: "Ascend the 5th-century sky fortress before dusk." },
        ]
  );

  // Inclusions & Exclusions
  const [inclusionsStr, setInclusionsStr] = useState(
    (pkg?.included ?? ["Private air-conditioned chauffeur transport", "Handpicked boutique hotels", "Daily breakfast"]).join("\n")
  );
  const [exclusionsStr, setExclusionsStr] = useState(
    (pkg?.excluded ?? ["International flights", "Discretionary tips & gratuities"]).join("\n")
  );

  const handleTitleBlur = () => {
    if (isNew && !slug) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const handleAddDay = () => {
    const nextDayNum = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      { day: nextDayNum, title: `Day ${nextDayNum} Exploration`, description: "Scenic transit and curated cultural immersion." },
    ]);
  };

  const handleUpdateDay = (index: number, field: "title" | "description", val: string) => {
    const next = [...itinerary];
    next[index] = { ...next[index], [field]: val };
    setItinerary(next);
  };

  const handleRemoveDay = (index: number) => {
    if (itinerary.length <= 1) return;
    const next = itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }));
    setItinerary(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      destination,
      category,
      durationDays: Number(durationDays),
      price: Number(price),
      maxPax: Number(maxPax),
      description,
      isActive,
      images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80"],
      itinerary,
      included: inclusionsStr.split("\n").map((s) => s.trim()).filter(Boolean),
      excluded: exclusionsStr.split("\n").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl border border-black/10 shadow-2xl p-6 sm:p-8 my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-black/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {isNew ? "Create Curated Package" : `Edit Circuit: ${pkg.title}`}
            </h2>
            <p className="text-xs text-muted-foreground">Define itinerary, pricing, destination highlights, and fleet inclusions.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Package Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="e.g. Ceylon Grand Heritage & Tea"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">URL Slug</label>
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. ceylon-grand-heritage"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Destination Region</label>
              <input
                required
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Cultural Triangle & Hills"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Category Theme</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              >
                <option value="Heritage & Cultural">Heritage & Cultural</option>
                <option value="Wildlife Safari">Wildlife Safari</option>
                <option value="Tea Country & Scenic Rail">Tea Country & Scenic Rail</option>
                <option value="Coastal & Surf Luxury">Coastal & Surf Luxury</option>
                <option value="Honeymoon & Romantic">Honeymoon & Romantic</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Duration (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Price per Guest (USD)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Max Party Size (Pax)</label>
              <input
                type="number"
                min={1}
                max={50}
                value={maxPax}
                onChange={(e) => setMaxPax(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActiveToggle"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-primary"
              />
              <label htmlFor="isActiveToggle" className="text-xs font-medium cursor-pointer">
                Publish on Live Site
              </label>
            </div>
          </div>

          {/* Editorial Description */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Curated Narrative / Overview</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A poetic yet precise summary of what makes this private journey unforgettable…"
              className="w-full border rounded-xl p-3 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          {/* Banner Photo URL */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Hero Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          {/* Day-by-Day Itinerary Builder */}
          <div className="space-y-3 pt-3 border-t border-black/10">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Day-by-Day Journey Schedule
              </label>
              <button
                type="button"
                onClick={handleAddDay}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Itinerary Day
              </button>
            </div>

            <div className="space-y-3">
              {itinerary.map((day, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-black/10 bg-muted/10 space-y-2">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-xs text-[#c59b27] px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                      Day {day.day}
                    </span>
                    <input
                      type="text"
                      placeholder="Day Title (e.g. Kandy Temple of the Tooth & Botanical Haven)"
                      value={day.title}
                      onChange={(e) => handleUpdateDay(idx, "title", e.target.value)}
                      className="flex-1 border rounded-lg px-2.5 py-1 text-xs bg-white"
                    />
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDay(idx)}
                        className="text-muted-foreground hover:text-rose-600 transition p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Day highlights and activities…"
                    value={day.description}
                    onChange={(e) => handleUpdateDay(idx, "description", e.target.value)}
                    className="w-full border rounded-lg p-2 text-xs bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions / Exclusions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/10">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Inclusions (one item per line)
              </label>
              <textarea
                rows={3}
                value={inclusionsStr}
                onChange={(e) => setInclusionsStr(e.target.value)}
                className="w-full border rounded-xl p-2.5 text-xs bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Exclusions (one item per line)
              </label>
              <textarea
                rows={3}
                value={exclusionsStr}
                onChange={(e) => setExclusionsStr(e.target.value)}
                className="w-full border rounded-xl p-2.5 text-xs bg-muted/20 focus:bg-white"
              />
            </div>
          </div>

          {/* Action buttons */}
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
              {isSaving ? "Saving…" : isNew ? "Create Package" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
