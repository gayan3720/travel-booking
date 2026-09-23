"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IBooking, BookingStatus } from "@/schemas/types";

const STATUS_COLUMNS: BookingStatus[] = ["pending", "contacted", "confirmed", "cancelled"];

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  contacted: "bg-sky-100 text-sky-900",
  confirmed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-rose-100 text-rose-900",
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

export default function BookingStatusBoard() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });
  const mutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<IBooking> }) => updateBooking(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading inquiries…</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {STATUS_COLUMNS.map((status) => {
        const items = bookings?.filter((b) => b.status === status) ?? [];
        return (
          <div key={status} className="space-y-3">
            <h3 className="font-semibold capitalize flex items-center gap-2">
              {status}
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>{items.length}</span>
            </h3>
            {items.map((booking) => (
              <BookingCard key={booking._id} booking={booking} onUpdate={mutation.mutate} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function BookingCard({
  booking,
  onUpdate,
}: {
  booking: IBooking;
  onUpdate: (args: { id: string; updates: Partial<IBooking> }) => void;
}) {
  const [notes, setNotes] = useState(booking.adminNotes ?? "");

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-black/5 space-y-2">
      <p className="font-medium">{booking.customerName}</p>
      <p className="text-sm text-muted-foreground">
        {new Date(booking.travelDate).toDateString()} · {booking.paxCount} pax
      </p>
      <p className="text-sm">{booking.phone}</p>
      <p className="text-sm text-muted-foreground">{booking.email}</p>
      <select
        value={booking.status}
        onChange={(e) => onUpdate({ id: booking._id, updates: { status: e.target.value as BookingStatus } })}
        className="w-full border rounded-lg px-2 py-1.5 text-sm"
      >
        {STATUS_COLUMNS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Internal notes…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => onUpdate({ id: booking._id, updates: { adminNotes: notes } })}
        className="w-full border rounded-lg px-2 py-1.5 text-sm min-h-[64px]"
      />
    </div>
  );
}
