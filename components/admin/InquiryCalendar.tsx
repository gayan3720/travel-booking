"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { IBooking } from "@/schemas/types";
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Calendar, Users, Car, Compass, X } from "lucide-react";

export default function InquiryCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayBookings, setSelectedDayBookings] = useState<{ day: number; bookings: IBooking[] } | null>(null);

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to load inquiries");
      return res.json() as Promise<IBooking[]>;
    },
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToday = () => setCurrentDate(new Date());

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map bookings to day number
  const dayBookingsMap = useMemo(() => {
    const map = new Map<number, IBooking[]>();
    bookings.forEach((b) => {
      const d = new Date(b.travelDate);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        map.set(day, [...(map.get(day) ?? []), b]);
      }
    });
    return map;
  }, [bookings, month, year]);

  // Conflict detection: Multiple bookings on the same day assigned to the same vehicle
  const conflictsMap = useMemo(() => {
    const conflictDays = new Set<number>();
    dayBookingsMap.forEach((dayList, day) => {
      const activeBookings = dayList.filter((b) => b.status !== "cancelled" && b.vehicleId);
      const vehicleCounts = new Map<string, number>();
      activeBookings.forEach((b) => {
        const vid = b.vehicleId!;
        vehicleCounts.set(vid, (vehicleCounts.get(vid) ?? 0) + 1);
      });
      vehicleCounts.forEach((count) => {
        if (count > 1) conflictDays.add(day);
      });
    });
    return conflictDays;
  }, [dayBookingsMap]);

  const calendarCells = Array.from({ length: firstDayOfMonth + daysInMonth }, (_, i) => {
    if (i < firstDayOfMonth) return null;
    return i - firstDayOfMonth + 1;
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-black/5 space-y-4 shadow-sm">
      {/* Header with Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c59b27]" />
            {currentDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fleet allocation & traveler arrivals schedule. Click any active date to view itinerary details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {conflictsMap.size > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              {conflictsMap.size} Vehicle Conflict{conflictsMap.size > 1 ? "s" : ""}
            </span>
          )}
          <button
            onClick={resetToday}
            className="px-3 py-1.5 rounded-xl border border-black/10 text-xs font-medium hover:bg-muted transition"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-black/10 bg-white overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-muted transition" title="Previous Month">
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <div className="w-[1px] h-4 bg-black/10" />
            <button onClick={nextMonth} className="p-2 hover:bg-muted transition" title="Next Month">
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center py-2 border-b border-black/5">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarCells.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="min-h-[90px] rounded-xl bg-muted/10" />;
          }

          const hits = dayBookingsMap.get(day) ?? [];
          const hasConflict = conflictsMap.has(day);
          const hasConfirmed = hits.some((h) => h.status === "confirmed");

          return (
            <div
              key={`day-${day}`}
              onClick={() => hits.length > 0 && setSelectedDayBookings({ day, bookings: hits })}
              className={`min-h-[90px] rounded-xl p-2 text-xs flex flex-col justify-between transition border ${
                hasConflict
                  ? "bg-rose-50/70 border-rose-300 ring-1 ring-rose-400"
                  : hits.length > 0
                  ? hasConfirmed
                    ? "bg-emerald-50/60 border-emerald-300 hover:bg-emerald-50 cursor-pointer shadow-xs"
                    : "bg-amber-50/50 border-amber-300 hover:bg-amber-50 cursor-pointer shadow-xs"
                  : "bg-muted/20 border-black/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-semibold text-xs ${hits.length > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                  {day}
                </span>
                {hasConflict && (
                  <span title="Vehicle conflict detected" className="text-rose-600">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </span>
                )}
                {!hasConflict && hasConfirmed && (
                  <span title="Confirmed guest arrivals" className="text-emerald-600">
                    <CheckCircle className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Day chips */}
              <div className="space-y-1 mt-1">
                {hits.slice(0, 2).map((h) => (
                  <div
                    key={h._id}
                    className={`truncate text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                      h.status === "confirmed"
                        ? "bg-emerald-200/70 text-emerald-900"
                        : h.status === "contacted"
                        ? "bg-sky-200/70 text-sky-900"
                        : "bg-amber-200/70 text-amber-900"
                    }`}
                  >
                    {h.customerName.split(" ")[0]} ({h.paxCount}p)
                  </div>
                ))}
                {hits.length > 2 && (
                  <div className="text-[9px] text-muted-foreground font-medium pl-1">
                    +{hits.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Bookings Detail Modal */}
      {selectedDayBookings && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg border border-black/10 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-black/10 pb-3">
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  {currentDate.toLocaleString("en-US", { month: "long" })} {selectedDayBookings.day}, {year}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedDayBookings.bookings.length} scheduled trip arrival{selectedDayBookings.bookings.length > 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedDayBookings(null)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDayBookings.bookings.map((b) => (
                <div key={b._id} className="p-4 rounded-xl border border-black/10 bg-[#fdfbf7] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.phone} · {b.email}</p>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border ${
                        b.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-foreground/80 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      {b.paxCount} Guests
                    </span>
                    {b.packageId && (
                      <span className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-primary" />
                        {b.packageId}
                      </span>
                    )}
                    {b.vehicleId && (
                      <span className="flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-primary" />
                        {b.vehicleId}
                      </span>
                    )}
                  </div>

                  {b.adminNotes && (
                    <p className="text-xs italic bg-white/70 p-2 rounded-lg border border-black/5 text-muted-foreground">
                      Notes: {b.adminNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedDayBookings(null)}
                className="px-5 py-2 rounded-full bg-primary text-white text-xs font-medium hover:bg-primary/90 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
