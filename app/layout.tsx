import type { Metadata } from "next";
// @ts-expect-error Next.js resolves global CSS imports at build time.
import "./globals.css";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import AppProviders from "@/components/providers/AppProviders";
import SiteChrome from "@/components/public/SiteChrome";
import { brand } from "@/lib/catalog";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description:
    "Inquiry-based luxury travel through Sri Lanka. Handcrafted packages, private vehicles, and a planner who answers within a day.",
  openGraph: { type: "website", siteName: brand.name },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", outfit.variable, display.variable)}>
      <body className="min-h-screen flex flex-col antialiased">
        <AppProviders>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
