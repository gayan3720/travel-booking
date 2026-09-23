import Link from "next/link";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/bookings", label: "Inquiries" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/vehicles", label: "Fleet" },
  { href: "/admin/offers", label: "Offers" },
  { href: "/admin/blog", label: "Journal" },
];

export default function AdminNav() {
  return (
    <aside className="w-60 border-r bg-[#1a1410] text-[#f4ead9] p-5 flex flex-col">
      <p className="font-display text-2xl mb-8">Planner</p>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="block px-3 py-2 rounded-xl text-sm hover:bg-white/10">
            {item.label}
          </Link>
        ))}
      </nav>
      <Link href="/" className="text-xs text-white/50 px-3">
        ← Public site
      </Link>
    </aside>
  );
}
