import { analytics, getBookings } from "@/lib/data";
import Link from "next/link";
import {
  CalendarRange,
  Compass,
  Car,
  Tag,
  Star,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await analytics();
  const recentInquiries = (await getBookings()).slice(0, 5);

  const cards = [
    {
      label: "Pending Inquiries",
      value: stats.pending,
      subtext: "Require concierge follow-up",
      href: "/admin/bookings",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      label: "In Progress / Contacted",
      value: stats.contacted,
      subtext: "Itinerary sent to traveler",
      href: "/admin/bookings",
      icon: CalendarRange,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      label: "Confirmed Bookings",
      value: stats.confirmed,
      subtext: "Reserved & chauffeur assigned",
      href: "/admin/bookings",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Active Circuits",
      value: stats.packages,
      subtext: "Publicly bookable packages",
      href: "/admin/packages",
      icon: Compass,
      color: "text-[#c59b27] bg-amber-50/50 border-amber-200",
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviews,
      subtext: "Guest feedback awaiting moderation",
      href: "/admin/reviews",
      icon: Star,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversion}%`,
      subtext: "Inquiry to confirmed ratio",
      href: "/admin/bookings",
      icon: TrendingUp,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1f1712] to-[#2c2119] text-[#f4ead9] p-6 sm:p-8 rounded-3xl border border-[#423326] shadow-md">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Travel Operations
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white font-medium">House Pulse & Operations</h1>
          <p className="text-xs text-[#d8cdbd] mt-1 max-w-xl">
            Live overview of guest itineraries, inquiries, chauffeur allocations, and seasonal booking conversion.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/packages"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c59b27] text-[#17120e] text-xs font-semibold hover:bg-[#d6a92d] transition shadow-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            New Circuit
          </Link>
          <Link
            href="/admin/vehicles"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition"
          >
            <Car className="w-3.5 h-3.5" />
            Fleet Hub
          </Link>
          <Link
            href="/admin/offers"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition"
          >
            <Tag className="w-3.5 h-3.5" />
            Promotions
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="bg-white border border-black/10 rounded-2xl p-5 hover:shadow-md hover:border-black/20 transition flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-display font-semibold text-foreground mt-1.5">{s.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl border ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-black/5 mt-4">
                <span>{s.subtext}</span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Split Section: Inquiries Pulse & Package Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-black/10 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-black/5">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Recent Guest Inquiries</h2>
              <p className="text-xs text-muted-foreground">Latest requests from international travelers</p>
            </div>
            <Link href="/admin/bookings" className="text-xs font-semibold text-primary hover:underline">
              View All Inquiries →
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No inquiries recorded yet.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-black/5 bg-[#fdfbf7] gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{inq.customerName}</span>
                      <span className="text-xs text-muted-foreground">({inq.email})</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>Travel: {new Date(inq.travelDate).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-primary" />
                        {inq.paxCount} guests
                      </span>
                      {inq.packageId && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-foreground">{inq.packageId}</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full border ${
                        inq.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : inq.status === "contacted"
                          ? "bg-sky-100 text-sky-900 border-sky-300"
                          : "bg-amber-100 text-amber-900 border-amber-300"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Popular Circuits & Traffic */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-xs space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Circuit Demand</h2>
            <ul className="space-y-3 text-xs">
              {stats.popular.length === 0 && (
                <li className="text-muted-foreground py-2 text-center">No inquiry history yet.</li>
              )}
              {stats.popular.map((p) => (
                <li key={p.package} className="flex justify-between items-center py-1 border-b border-black/5 last:border-0">
                  <span className="font-medium text-foreground">{p.package}</span>
                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground font-semibold">
                    {p.count} inquiries
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-black/10 shadow-xs space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Traffic Channels</h2>
            <ul className="space-y-3">
              {stats.traffic.map((t) => (
                <li key={t.source} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{t.source}</span>
                    <span className="text-muted-foreground">{t.share}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#c59b27]" style={{ width: `${t.share}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
