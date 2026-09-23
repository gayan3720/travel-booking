import OfferManager from "@/components/admin/OfferManager";

export default function AdminOffersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-foreground">Promotions & Seasonal Campaigns</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Launch time-limited early-bird promotions, manage voucher discount codes, and control public display countdowns.
        </p>
      </div>

      <OfferManager />
    </div>
  );
}
