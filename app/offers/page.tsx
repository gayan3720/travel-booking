import { getOffers } from "@/lib/data";
import OfferCard from "@/components/public/OfferCard";

export const revalidate = 300;
export const metadata = { title: "Offers" };

export default async function OffersPage() {
  const offers = await getOffers();
  return (
    <main className="max-w-7xl mx-auto px-4 py-14">
      <h1 className="font-display text-6xl">Current offers</h1>
      <p className="text-muted-foreground mt-3 mb-10">Admin-managed, time-bound. They vanish when they expire.</p>
      {offers.length === 0 ? (
        <p>No live offers — the regular circuits still stand.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((o) => (
            <OfferCard key={o._id} offer={o} />
          ))}
        </div>
      )}
    </main>
  );
}
