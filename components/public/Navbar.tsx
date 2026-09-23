"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { brand } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const links = [
  { href: "/packages", label: "Packages" },
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
      <div className="absolute inset-0 bg-[#f6f1e8]/75 backdrop-blur-xl border-b border-black/5" />
      <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-4 h-20">
        <Link href="/" className="relative z-10">
          <span className="font-display text-2xl tracking-tight">{brand.name}</span>
          <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Sri Lanka · Private circuits
          </span>
        </Link>
        <div className="hidden lg:flex gap-7 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-foreground/70 hover:text-foreground transition-colors",
                path.startsWith(link.href) && "text-foreground"
              )}
            >
              {link.label}
              {path.startsWith(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-px gold-line" />
              )}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-primary/20 hover:translate-y-px transition"
          >
            Plan a journey
          </Link>
          <button
            className="lg:hidden p-2"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden relative bg-[#f6f1e8] border-b px-4 pb-6 space-y-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block py-1" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
