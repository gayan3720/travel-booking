"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "AUD" | "LKR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // 1 USD = rate
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", rateAgainstUSD: 1.0 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rateAgainstUSD: 0.92 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rateAgainstUSD: 0.78 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rateAgainstUSD: 1.52 },
  LKR: { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee", rateAgainstUSD: 305 },
};

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "USD",
  setCurrency: () => {},
  formatPrice: (amount) => `$${amount.toLocaleString()}`,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aether_preferred_currency");
      if (saved && saved in SUPPORTED_CURRENCIES) {
        setCurrencyState(saved as CurrencyCode);
      }
    } catch {
      // ignore in SSR or blocked localStorage
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem("aether_preferred_currency", code);
    } catch {}
  };

  const formatPrice = (amountInUSD: number): string => {
    const config = SUPPORTED_CURRENCIES[currency];
    const converted = amountInUSD * config.rateAgainstUSD;

    if (currency === "LKR") {
      return `${config.symbol} ${Math.round(converted).toLocaleString()}`;
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: config.code,
      maximumFractionDigits: 0,
    }).format(Math.round(converted));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
