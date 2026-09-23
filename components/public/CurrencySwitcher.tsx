"use client";

import { useCurrency, SUPPORTED_CURRENCIES, type CurrencyCode } from "@/components/providers/CurrencyContext";
import { Globe } from "lucide-react";

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1.5 bg-black/5 hover:bg-black/10 transition px-2.5 py-1.5 rounded-full text-xs text-foreground font-medium">
      <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-1"
        aria-label="Select pricing currency"
      >
        {Object.values(SUPPORTED_CURRENCIES).map((c) => (
          <option key={c.code} value={c.code} className="text-foreground bg-white">
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
