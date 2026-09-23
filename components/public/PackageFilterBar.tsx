"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, Filter, RotateCcw, Compass, MapPin, DollarSign, Clock } from "lucide-react";

export default function PackageFilterBar({
  categories,
  destinations,
  activeCategory,
  activeDestination,
  activeDuration,
  activeMaxPrice,
}: {
  categories: string[];
  destinations: string[];
  activeCategory?: string;
  activeDestination?: string;
  activeDuration?: string;
  activeMaxPrice?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [priceVal, setPriceVal] = useState<string>(activeMaxPrice || "3000");

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    startTransition(() => {
      router.push(`/packages?${params.toString()}`);
    });
  };

  const handlePriceCommit = (val: string) => {
    updateParam("maxPrice", val === "3000" ? "" : val);
  };

  const resetAll = () => {
    setPriceVal("3000");
    startTransition(() => {
      router.push("/packages");
    });
  };

  const hasFilters = Boolean(
    activeCategory || activeDestination || activeDuration || (activeMaxPrice && activeMaxPrice !== "3000")
  );

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/10 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase font-bold tracking-wider text-foreground">
            Filter & Discover Circuits
          </span>
          {isPending && (
            <span className="text-[11px] text-muted-foreground animate-pulse">Updating…</span>
          )}
        </div>

        {hasFilters && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Category / Mood */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-primary" />
            Travel Mood / Category
          </label>
          <select
            value={activeCategory || ""}
            onChange={(e) => updateParam("category", e.target.value)}
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-primary capitalize"
          >
            <option value="">All Categories &amp; Moods</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Destination / Region */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            Destination Hub
          </label>
          <select
            value={activeDestination || ""}
            onChange={(e) => updateParam("destination", e.target.value)}
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-primary"
          >
            <option value="">All Island Locations</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Range */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            Duration
          </label>
          <select
            value={activeDuration || ""}
            onChange={(e) => updateParam("duration", e.target.value)}
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-primary"
          >
            <option value="">Any Trip Length</option>
            <option value="short">Short Sprint (1 - 3 Days)</option>
            <option value="medium">Classic Circuit (4 - 6 Days)</option>
            <option value="long">Grand Island Arc (7+ Days)</option>
          </select>
        </div>

        {/* Max Budget Range */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-primary" />
              Max Budget
            </span>
            <span className="text-foreground font-bold">
              {Number(priceVal) >= 3000 ? "No limit" : `$${priceVal}/pax`}
            </span>
          </div>
          <input
            type="range"
            min="600"
            max="3000"
            step="100"
            value={priceVal}
            onChange={(e) => setPriceVal(e.target.value)}
            onMouseUp={(e) => handlePriceCommit((e.target as HTMLInputElement).value)}
            onTouchEnd={(e) => handlePriceCommit((e.target as HTMLInputElement).value)}
            className="w-full accent-primary cursor-pointer mt-1"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>$600</span>
            <span>$1,800</span>
            <span>$3,000+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
