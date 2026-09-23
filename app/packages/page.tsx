import PackageGrid from "@/components/public/PackageGrid";
import PackageFilterBar from "@/components/public/PackageFilterBar";
import { getPackages } from "@/lib/data";
import { packages as catalog } from "@/lib/catalog";
import { Suspense } from "react";
import Link from "next/link";
import { Sparkles, Compass, SlidersHorizontal, ShieldCheck } from "lucide-react";

export const revalidate = 300;
export const metadata = {
  title: "Private Circuits & Travel Packages",
  description:
    "Explore hand-drawn Sri Lankan travel packages. Private chauffeurs, boutique heritage lodges, wildlife safaris, and high-altitude tea train journeys.",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    destination?: string;
    duration?: string;
    maxPrice?: string;
  };
}) {
  const maxPriceNum = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;

  const list = await getPackages({
    category: searchParams.category,
    destination: searchParams.destination,
    duration: searchParams.duration,
    maxPrice: maxPriceNum,
  });

  const categories = [...new Set(catalog.map((p) => p.category))];
  const destinations = [...new Set(catalog.map((p) => p.destination))];

  return (
    <main className="max-w-7xl mx-auto px-4 py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Catalog
          </span>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground">
            Travel Packages &amp; Circuits
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
            Every itinerary is executed with a dedicated English-fluent chauffeur, curated boutique lodges, and private entrance arrangements — never shared tour buses.
          </p>
        </div>

        {/* Link to Planner */}
        <Link
          href="/planner"
          className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-black/10 hover:border-black/20 shadow-xs text-xs font-semibold text-foreground hover:text-primary transition group"
        >
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <span>Launch Custom Route Builder →</span>
        </Link>
      </div>

      {/* Multi-facet Filter Bar */}
      <div>
        <Suspense fallback={<div className="h-24 bg-white rounded-3xl animate-pulse" />}>
          <PackageFilterBar
            categories={categories}
            destinations={destinations}
            activeCategory={searchParams.category}
            activeDestination={searchParams.destination}
            activeDuration={searchParams.duration}
            activeMaxPrice={searchParams.maxPrice}
          />
        </Suspense>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Showing {list.length} available {list.length === 1 ? "circuit" : "circuits"}</span>
          <span>Inquiry-based · Direct House Booking</span>
        </div>

        <PackageGrid packages={list} />
      </div>

      {/* Assurance banner */}
      <div className="bg-[#fcfaf7] rounded-3xl p-8 border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-16">
        <div className="space-y-1 text-center sm:text-left">
          <p className="font-display text-2xl font-medium text-foreground">
            Prefer a custom multi-destination circuit?
          </p>
          <p className="text-xs text-muted-foreground max-w-xl">
            Our Colombo directors create bespoke itineraries combining tea plantations, private ocean villas, and leopard safaris tailored to your specific travel window.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/planner"
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs whitespace-nowrap"
          >
            Cost Estimator
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-white border border-black/10 text-foreground text-xs font-semibold hover:bg-muted transition whitespace-nowrap"
          >
            Speak to a Planner
          </Link>
        </div>
      </div>
    </main>
  );
}
