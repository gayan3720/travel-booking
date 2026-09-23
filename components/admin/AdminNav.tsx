"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarRange,
  Star,
  Compass,
  Car,
  Tag,
  BookOpen,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "House Pulse", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Inquiries & Inbox", icon: CalendarRange },
  { href: "/admin/packages", label: "Circuits & Packages", icon: Compass },
  { href: "/admin/vehicles", label: "Fleet & Drivers", icon: Car },
  { href: "/admin/offers", label: "Promotions & Offers", icon: Tag },
  { href: "/admin/reviews", label: "Guest Stories", icon: Star },
  { href: "/admin/blog", label: "Journal CMS", icon: BookOpen },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[#2d221b] bg-[#17120e] text-[#f4ead9] p-5 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c59b27] to-[#8c6b12] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-display text-xl font-medium tracking-tight text-white">Aether Trails</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#c59b27]">Planner Desk</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#c59b27] text-[#17120e] shadow-sm font-semibold"
                    : "text-[#d8cdbd] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#17120e]" : "text-[#c59b27]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account */}
      <div className="pt-6 border-t border-white/10 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Site
          </span>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">Live</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
