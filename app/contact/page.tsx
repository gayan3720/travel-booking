import { getPackages, getVehicles } from "@/lib/data";
import BookingInquiryForm from "@/components/public/BookingInquiryForm";
import { brand } from "@/lib/catalog";
import { Sparkles, Mail, Phone, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Write to a Personal Travel Planner",
  description:
    "Direct inquiry desk for private Sri Lanka journeys. Tailored circuits, verified chamber holds, and personal concierge coordination.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { packageId?: string; vehicleId?: string; paxCount?: string; notes?: string };
}) {
  const [packages, vehicles] = await Promise.all([getPackages(), getVehicles()]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Concierge Desk
          </span>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground">
            Write to a Planner
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md text-sm sm:text-base leading-relaxed">
            No bots. No payment checkout. Tell us when you can travel and your party size — we hold boutique rooms and draft your itinerary timetable within 24 hours.
          </p>
        </div>

        <div className="bg-[#fcfaf7] rounded-2xl p-6 border border-black/5 space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-black/10 text-primary">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Direct Desk</p>
              <a href={`mailto:${brand.email}`} className="font-medium text-foreground hover:underline text-sm">
                {brand.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-black/10 text-primary">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Voice &amp; WhatsApp</p>
              <a href={`https://wa.me/94771234567`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:underline text-sm">
                {brand.phone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-black/10 text-primary">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Operating Hours</p>
              <p className="font-medium text-foreground">08:30 – 19:00 IST · 7 Days a Week</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-black/10 bg-white space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero Obligation Reservation
          </div>
          <p className="text-muted-foreground leading-relaxed">
            All custom circuit consultations are complimentary. We never require card details to hold dates or provide comprehensive hotel recommendations.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-md">
        <BookingInquiryForm
          packageId={searchParams.packageId}
          vehicleId={searchParams.vehicleId}
          initialPax={searchParams.paxCount ? Number(searchParams.paxCount) : undefined}
          initialMessage={searchParams.notes}
          packages={packages.map((p) => ({ _id: p._id, title: p.title }))}
          vehicles={vehicles.map((v) => ({ _id: v._id, name: v.name }))}
        />
      </div>
    </main>
  );
}
