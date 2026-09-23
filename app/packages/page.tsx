import PackageGrid from "@/components/public/PackageGrid";
import PackageFilterBar from "@/components/public/PackageFilterBar";
import { getPackages } from "@/lib/data";
import { packages as catalog } from "@/lib/catalog";
import { Suspense } from "react";

export const revalidate = 300;
export const metadata = { title: "Travel packages" };

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: { category?: string; destination?: string };
}) {
  const list = await getPackages(searchParams);
  const categories = [...new Set(catalog.map((p) => p.category))];
  const destinations = [...new Set(catalog.map((p) => p.destination))];

  return (
    <main className="max-w-7xl mx-auto px-4 py-14">
      <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">Catalog</p>
      <h1 className="font-display text-6xl mt-2">Travel packages</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl">
        Filter by mood or place. Every circuit is privately guided and priced per person, inquiry-based.
      </p>
      <div className="mt-8">
        <Suspense>
          <PackageFilterBar
            categories={categories}
            destinations={destinations}
            activeCategory={searchParams.category}
            activeDestination={searchParams.destination}
          />
        </Suspense>
      </div>
      <div className="mt-10">
        <PackageGrid packages={list} />
      </div>
    </main>
  );
}
