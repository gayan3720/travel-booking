"use client";

import { useQuery } from "@tanstack/react-query";
import type { IBooking } from "@/schemas/types";

export default function InquiryCalendar() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("fail");
      return res.json() as Promise<IBooking[]>;
    },
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startDow + daysInMonth }, (_, i) => {
    if (i < startDow) return null;
    return i - startDow + 1;
  });

  const byDay = new Map<number, IBooking[]>();
  bookings.forEach((b) => {
    const d = new Date(b.travelDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      byDay.set(day, [...(byDay.get(day) ?? []), b]);
    }
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5">
      <h3 className="font-medium mb-4">
        {now.toLocaleString("en", { month: "long", year: "numeric" })} · travel dates
      </h3>
      <div className="grid grid-cols-7 gap-1 text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const hits = day ? byDay.get(day) : undefined;
          return (
            <div
              key={i}
              className={`min-h-[72px] rounded-xl p-1.5 text-xs ${hits?.length ? "bg-primary/10" : "bg-muted/40"}`}
            >
              {day && <div className="font-medium">{day}</div>}
              {hits?.map((h) => (
                <div key={h._id} className="truncate text-[10px] mt-0.5 text-primary">
                  {h.customerName.split(" ")[0]} · {h.paxCount}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
