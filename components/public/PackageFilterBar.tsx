"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function PackageFilterBar({
  categories,
  destinations,
  activeCategory,
  activeDestination,
}: {
  categories: string[];
  destinations: string[];
  activeCategory?: string;
  activeDestination?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: "category" | "destination", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center glass rounded-full px-3 py-2 w-fit">
      <select
        value={activeCategory || ""}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="bg-transparent px-3 py-2 text-sm outline-none capitalize"
      >
        <option value="">All moods</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <span className="h-4 w-px bg-black/10" />
      <select
        value={activeDestination || ""}
        onChange={(e) => updateFilter("destination", e.target.value)}
        className="bg-transparent px-3 py-2 text-sm outline-none"
      >
        <option value="">All places</option>
        {destinations.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      {(activeCategory || activeDestination) && (
        <button onClick={() => router.push("/packages")} className="text-xs uppercase tracking-widest px-3">
          Reset
        </button>
      )}
    </div>
  );
}
