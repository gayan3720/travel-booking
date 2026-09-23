"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IBooking, BookingStatus } from "@/schemas/types";
import {
  MessageCircle,
  Mail,
  FileText,
  Trash2,
  Search,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Car,
  Compass,
  Printer,
  X,
  ExternalLink,
} from "lucide-react";

const STATUS_COLUMNS: BookingStatus[] = ["pending", "contacted", "confirmed", "cancelled"];

const STATUS_META: Record<BookingStatus, { label: string; badge: string; border: string }> = {
  pending: { label: "Pending Review", badge: "bg-amber-100 text-amber-900 border-amber-300", border: "border-l-amber-500" },
  contacted: { label: "Contacted / In Progress", badge: "bg-sky-100 text-sky-900 border-sky-300", border: "border-l-sky-500" },
  confirmed: { label: "Confirmed & Reserved", badge: "bg-emerald-100 text-emerald-900 border-emerald-300", border: "border-l-emerald-600" },
  cancelled: { label: "Cancelled / Archived", badge: "bg-zinc-100 text-zinc-700 border-zinc-300", border: "border-l-zinc-400" },
};

async function fetchBookings(): Promise<IBooking[]> {
  const res = await fetch("/api/bookings");
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}

async function updateBooking(id: string, updates: Partial<IBooking>) {
  const res = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update booking");
  return res.json();
}

async function deleteBookingApi(id: string) {
  const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete booking");
  return res.json();
}

export default function BookingStatusBoard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState<IBooking | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<IBooking> }) => updateBooking(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBookingApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const term = searchTerm.toLowerCase();
    return bookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.phone.toLowerCase().includes(term) ||
        (b.packageId && b.packageId.toLowerCase().includes(term))
    );
  }, [bookings, searchTerm]);

  // Export inquiries to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ["ID", "Customer", "Email", "Phone", "Travel Date", "Pax", "Status", "Package ID", "Vehicle ID", "Notes", "Created At"];
    const rows = bookings.map((b) => [
      b._id,
      `"${b.customerName.replace(/"/g, '""')}"`,
      b.email,
      b.phone,
      new Date(b.travelDate).toISOString().split("T")[0],
      b.paxCount,
      b.status,
      b.packageId || "",
      b.vehicleId || "",
      `"${(b.adminNotes || "").replace(/"/g, '""')}"`,
      new Date(b.createdAt).toISOString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aether-trails-inquiries-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-black/5 text-center text-sm text-muted-foreground animate-pulse">
        Loading guest inquiries…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-black/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by guest, email, phone…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-muted/20 focus:bg-white transition"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 text-xs font-medium bg-white hover:bg-muted/40 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            Export CSV ({filteredBookings.length})
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {STATUS_COLUMNS.map((status) => {
          const items = filteredBookings.filter((b) => b.status === status);
          const meta = STATUS_META[status];

          return (
            <div key={status} className="bg-[#fcfaf7] rounded-2xl p-4 border border-black/5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/5">
                <span className="font-semibold text-sm capitalize flex items-center gap-2">
                  {meta.label}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${meta.badge}`}>
                  {items.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[140px]">
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-8">No inquiries</p>
                ) : (
                  items.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      borderClass={meta.border}
                      onUpdate={updateMutation.mutate}
                      onDelete={(id) => {
                        if (confirm(`Archive and remove inquiry from ${booking.customerName}?`)) {
                          deleteMutation.mutate(id);
                        }
                      }}
                      onOpenVoucher={() => setSelectedVoucher(booking)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Travel Voucher Modal */}
      {selectedVoucher && (
        <TravelVoucherModal booking={selectedVoucher} onClose={() => setSelectedVoucher(null)} />
      )}
    </div>
  );
}

function BookingCard({
  booking,
  borderClass,
  onUpdate,
  onDelete,
  onOpenVoucher,
}: {
  booking: IBooking;
  borderClass: string;
  onUpdate: (args: { id: string; updates: Partial<IBooking> }) => void;
  onDelete: (id: string) => void;
  onOpenVoucher: () => void;
}) {
  const [notes, setNotes] = useState(booking.adminNotes ?? "");

  // Generate clean WhatsApp link
  const cleanPhone = booking.phone.replace(/[^0-9]/g, "");
  const waMessage = encodeURIComponent(
    `Hello ${booking.customerName},\n\nGreetings from Aether Trails Sri Lanka! We have received your private travel inquiry for ${new Date(
      booking.travelDate
    ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} for a party of ${
      booking.paxCount
    }.\n\nOur chief planner has held your preliminary itinerary and private chauffeur. Could you please confirm if you have specific lodge preferences or dietary requirements?\n\nWarm regards,\nAether Trails Concierge`
  );
  const waLink = `https://wa.me/${cleanPhone}?text=${waMessage}`;

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border border-black/10 border-l-4 ${borderClass} space-y-3 transition hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-sm text-foreground">{booking.customerName}</h4>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3 h-3 text-primary" />
            {new Date(booking.travelDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            <span>·</span>
            <Users className="w-3 h-3 text-primary" />
            {booking.paxCount} {booking.paxCount === 1 ? "guest" : "guests"}
          </p>
        </div>
        <button
          onClick={() => onDelete(booking._id)}
          className="text-muted-foreground/50 hover:text-rose-600 transition p-1"
          title="Delete inquiry"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Package & Vehicle Tags */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {booking.packageId && (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
            <Compass className="w-3 h-3" />
            {booking.packageId}
          </span>
        )}
        {booking.vehicleId && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
            <Car className="w-3 h-3" />
            {booking.vehicleId}
          </span>
        )}
      </div>

      {booking.message && (
        <div className="bg-muted/30 rounded-lg p-2 text-xs text-foreground/80 italic border border-black/5">
          &ldquo;{booking.message}&rdquo;
        </div>
      )}

      {/* Contact Actions */}
      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-black/5">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-medium transition shadow-xs"
          title="Reply via WhatsApp"
        >
          <MessageCircle className="w-3 h-3" />
          WhatsApp
        </a>

        <a
          href={`mailto:${booking.email}?subject=${encodeURIComponent(
            `Aether Trails Itinerary Inquiry — ${booking.customerName}`
          )}`}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-[11px] font-medium transition"
          title="Reply via Email"
        >
          <Mail className="w-3 h-3" />
          Email
        </a>

        <button
          onClick={onOpenVoucher}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 text-[11px] font-medium transition"
          title="Generate Client Voucher"
        >
          <FileText className="w-3 h-3" />
          Voucher
        </button>
      </div>

      {/* Status Selector */}
      <div>
        <label className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-1">
          Inquiry Stage
        </label>
        <select
          value={booking.status}
          onChange={(e) => onUpdate({ id: booking._id, updates: { status: e.target.value as BookingStatus } })}
          className="w-full bg-white border border-black/10 rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground focus:ring-1 focus:ring-primary"
        >
          {STATUS_COLUMNS.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      {/* Internal Staff Notes */}
      <div>
        <label className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-1">
          Internal Planner Notes
        </label>
        <textarea
          placeholder="Held lodge names, chauffeur phone, special diet…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdate({ id: booking._id, updates: { adminNotes: notes } })}
          className="w-full bg-muted/20 border border-black/10 rounded-lg p-2 text-xs text-foreground placeholder:text-muted-foreground/60 min-h-[56px] resize-y"
        />
      </div>
    </div>
  );
}

function TravelVoucherModal({ booking, onClose }: { booking: IBooking; onClose: () => void }) {
  const refCode = `AT-${new Date(booking.createdAt).getFullYear()}-${booking._id.slice(-4).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl border border-black/10 shadow-2xl p-8 relative space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Voucher Area */}
        <div id="printable-voucher" className="p-6 border-2 border-[#c59b27]/40 rounded-2xl bg-[#fdfbf7] space-y-6">
          <div className="flex justify-between items-start border-b border-[#c59b27]/30 pb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c59b27] font-semibold">
                Official Travel Reservation Voucher
              </p>
              <h2 className="font-display text-3xl text-[#17120e] mt-0.5">Aether Trails Luxury Travel</h2>
              <p className="text-xs text-muted-foreground">Colombo & Kandy, Sri Lanka · concierge@aethertrails.com</p>
            </div>
            <div className="text-right">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300 capitalize">
                {booking.status}
              </span>
              <p className="text-xs font-mono text-muted-foreground mt-2">Ref: {refCode}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider">Primary Traveler</p>
              <p className="font-semibold text-sm text-foreground">{booking.customerName}</p>
              <p className="text-muted-foreground">{booking.email}</p>
              <p className="text-muted-foreground">{booking.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider">Travel Details</p>
              <p className="font-medium">
                Commencement: <span className="font-semibold">{new Date(booking.travelDate).toDateString()}</span>
              </p>
              <p className="font-medium">Party Size: <span className="font-semibold">{booking.paxCount} Guests</span></p>
              <p className="font-medium">Selected Circuit: <span className="font-semibold">{booking.packageId || "Custom Circuit"}</span></p>
            </div>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-black/5 text-xs space-y-2">
            <p className="font-semibold text-foreground">Assigned Services & Inclusions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dedicated English-speaking Chauffeur & Private AC Transport ({booking.vehicleId || "Designated Class"})</li>
              <li>Handpicked Boutique / Heritage Lodging Reservations</li>
              <li>Daily Breakfast & Curated Cultural Experiences</li>
              <li>24/7 Island Concierge Helpline (+94 11 234 5678)</li>
            </ul>
          </div>

          {booking.adminNotes && (
            <div className="border-t border-black/5 pt-3 text-xs">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Special Instructions / Notes:</p>
              <p className="text-foreground/80 mt-1 italic">{booking.adminNotes}</p>
            </div>
          )}

          <div className="text-[10px] text-muted-foreground text-center border-t border-[#c59b27]/20 pt-3">
            Inquiry-based luxury circuit · Issued on behalf of Aether Trails Private Limited.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
          <Link
            href={`/voucher/${booking._id}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Client Web Page →</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-medium text-xs hover:bg-primary/90 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Voucher
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-black/10 text-xs font-medium hover:bg-muted transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
