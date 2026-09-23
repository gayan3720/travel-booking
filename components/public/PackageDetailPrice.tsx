"use client";

import { useCurrency } from "@/components/providers/CurrencyContext";

export default function PackageDetailPrice({ price }: { price: number }) {
  const { formatPrice, currency } = useCurrency();

  return (
    <div>
      <p className="font-display text-4xl text-primary font-semibold">
        {formatPrice(price)}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        per guest ({currency}) · private booking inquiry
      </p>
    </div>
  );
}
