import { getOffers } from "@/lib/data";

export default async function AdminOffersPage() {
  const offers = await getOffers();
  return (
    <div>
      <h1 className="font-display text-4xl mb-6">Offers</h1>
      <div className="space-y-3">
        {offers.map((o) => (
          <div key={o._id} className="bg-white rounded-2xl p-5 border">
            <p className="font-medium">{o.title}</p>
            <p className="text-sm text-muted-foreground">
              {o.discountText} · ends {new Date(o.endDate).toDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
