import { analytics } from "@/lib/data";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await analytics();
  const cards = [
    { label: "Pending inquiries", value: stats.pending, href: "/admin/bookings" },
    { label: "Contacted", value: stats.contacted, href: "/admin/bookings" },
    { label: "Confirmed", value: stats.confirmed, href: "/admin/bookings" },
    { label: "Active packages", value: stats.packages, href: "/admin/packages" },
    { label: "Reviews to moderate", value: stats.pendingReviews, href: "/admin/reviews" },
    { label: "Inquiry → confirm", value: `${stats.conversion}%`, href: "/admin/bookings" },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl mb-6">House pulse</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white border border-black/5 rounded-2xl p-5 hover:shadow-md transition">
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-5 border border-black/5">
          <h2 className="font-medium mb-4">Popular packages</h2>
          <ul className="space-y-2 text-sm">
            {stats.popular.length === 0 && <li className="text-muted-foreground">No inquiries yet.</li>}
            {stats.popular.map((p) => (
              <li key={p.package} className="flex justify-between">
                <span>{p.package}</span>
                <span className="text-muted-foreground">{p.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5">
          <h2 className="font-medium mb-4">Traffic sources (modeled)</h2>
          <ul className="space-y-3">
            {stats.traffic.map((t) => (
              <li key={t.source}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t.source}</span>
                  <span>{t.share}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${t.share}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
