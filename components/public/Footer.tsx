import Link from "next/link";
import { brand } from "@/lib/catalog";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-[#1a1410] text-[#f4ead9]">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-3xl">{brand.name}</p>
          <p className="text-sm text-white/60 mt-3 max-w-xs">{brand.tagline}. Inquiry-based planning — no payment gateway, no pressure.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">Explore</p>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/packages">Packages</Link></li>
            <li><Link href="/planner">Trip Planner</Link></li>
            <li><Link href="/vehicles">Fleet</Link></li>
            <li><Link href="/offers">Offers</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">House</p>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/blog">Journal</Link></li>
            <li><Link href="/reviews">Stories</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/admin/login">Planner login</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">Studio</p>
          <p className="text-sm text-white/75">{brand.email}</p>
          <p className="text-sm text-white/75">{brand.phone}</p>
          <p className="text-sm text-white/50 mt-2">{brand.city}</p>
        </div>
      </div>
      <div className="text-center text-xs text-white/35 py-5 border-t border-white/10">
        © {new Date().getFullYear()} {brand.name}. Crafted for a travel house that answers by hand.
      </div>
    </footer>
  );
}
