"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { CurrencyProvider } from "@/components/providers/CurrencyContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <CurrencyProvider>{children}</CurrencyProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
