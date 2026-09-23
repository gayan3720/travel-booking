"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Compass } from "lucide-react";
import { brand } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import CurrencySwitcher from "@/components/public/CurrencySwitcher";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/planner", label: "Trip Planner" },
  { href: "/vehicles", label: "Fleet" },
  { href: "/offers", label: "Offers" },
  { href: "/reviews", label: "Stories" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="absolute inset-0 bg-[#f6f1e8]/85 backdrop-blur-xl border-b border-black/5 shadow-xs" />
      <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-4 h-20">
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <div>
            <span className="font-display text-2xl sm:text-3xl tracking-tight text-foreground font-semibold">
              {brand.name}
            </span>
            <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-medium">
              Sri Lanka · Private circuits
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-foreground/75 hover:text-foreground transition-colors",
                path.startsWith(link.href) && "text-foreground font-bold"
              )}
            >
              {link.label}
              {path.startsWith(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#c59b27] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Actions (Currency + Plan CTA + Mobile Menu Button) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <CurrencySwitcher />

          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold shadow-md shadow-primary/20 hover:bg-primary/95 hover:translate-y-px transition"
          >
            Plan a journey
          </Link>

          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden relative bg-[#f6f1e8] border-b border-black/10 px-5 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1.5 text-sm font-semibold text-foreground/85 hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-black/10">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="w-full text-center block bg-primary text-primary-foreground py-3 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md"
            >
              Plan a journey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
