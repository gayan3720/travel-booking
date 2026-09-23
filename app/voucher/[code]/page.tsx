import { getBookingById, getPackageById, getPackages, getVehicles } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { brand } from "@/lib/catalog";
import ClientVoucherActions from "@/components/public/ClientVoucherActions";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Compass,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  FileText,
  Printer,
  Sparkles,
  Luggage,
  Sun,
  Shirt,
} from "lucide-react";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { code: string } }) {
  return {
    title: `Travel Voucher ${params.code.toUpperCase()} | ${brand.name}`,
    description: "Official private travel reservation and road companion itinerary for Sri Lanka.",
  };
}

export default async function ClientVoucherPage({ params }: { params: { code: string } }) {
  const booking = await getBookingById(params.code);

  if (!booking) {
    notFound();
  }

  // Enrich with package and vehicle details if linked
  const [allPackages, allVehicles] = await Promise.all([getPackages(), getVehicles()]);
  const linkedPackage = allPackages.find(
    (p) => p._id === booking.packageId || p.slug === booking.packageId
  );
  const linkedVehicle = allVehicles.find((v) => v._id === booking.vehicleId);

  const voucherRef = `AT-${new Date(booking.createdAt).getFullYear()}-${booking._id.slice(-4).toUpperCase()}`;
  const travelDateObj = new Date(booking.travelDate);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8 print:p-0 print:m-0">
      {/* Client Companion Action Header */}
      <ClientVoucherActions
        voucherRef={voucherRef}
        customerName={booking.customerName}
        travelDate={booking.travelDate}
      />

      {/* Main Official Voucher Document (Printable) */}
      <div
        id="printable-voucher-document"
        className="bg-[#fdfbf7] rounded-[2.5rem] border-2 border-[#c59b27]/30 shadow-lg p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-4 print:bg-white"
      >
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#c59b27]/20 pb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#c59b27] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Private Travel Chamber Voucher
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-[#1a1410] font-medium mt-1">
              {brand.name} Sri Lanka
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Colombo Concierge Desk · Direct Private Circuit Reservation
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                booking.status === "confirmed"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : booking.status === "cancelled"
                  ? "bg-zinc-100 text-zinc-700 border border-zinc-300"
                  : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}
            >
              Status: {booking.status}
            </span>
            <p className="font-mono text-xs font-semibold text-foreground">
              Voucher Ref: {voucherRef}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Issued: {new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Guest & Journey Logistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-5 rounded-2xl border border-black/5 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              Lead Guest Profile
            </span>
            <p className="font-semibold text-base text-foreground">{booking.customerName}</p>
            <p className="text-foreground/80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              {booking.email}
            </p>
            <p className="text-foreground/80 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" />
              {booking.phone}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block">
              Circuit Schedule
            </span>
            <p className="text-foreground font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#c59b27]" />
              Commencement: {travelDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className="text-foreground/80 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              Party Size: <span className="font-semibold">{booking.paxCount} {booking.paxCount === 1 ? "Traveler" : "Travelers"}</span>
            </p>
            <p className="text-foreground/80 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-primary" />
              Circuit: <span className="font-semibold">{linkedPackage?.title || booking.packageId || "Custom Handcrafted Circuit"}</span>
            </p>
          </div>
        </div>

        {/* Assigned Chauffeur & Vehicle Class */}
        <div className="bg-white p-5 rounded-2xl border border-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
              <Car className="w-4 h-4 text-primary" />
              Assigned Chauffeur &amp; Road Asset
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
              Vetted &amp; Insured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-foreground text-sm">
                {linkedVehicle?.name || "Executive Chauffeur Touring Vehicle"}
              </p>
              <p className="text-muted-foreground">
                Air-conditioned luxury class with chilled bottled water, cold hand towels, and expressway electronic toll tag (ETC).
              </p>
              <p className="text-muted-foreground text-[11px] pt-1">
                • Capacity: {linkedVehicle?.capacity || "Up to 7 guests"}
              </p>
            </div>

            <div className="bg-[#fcfaf7] p-3.5 rounded-xl border border-black/5 space-y-1.5">
              <p className="font-semibold text-foreground text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Licensed Tourism Driver (SLTDA)
              </p>
              <p className="text-[11px] text-muted-foreground">
                Assigned chauffeur meets guests directly past customs at Colombo Bandaranaike International Airport (CMB) with your nameboard.
              </p>
            </div>
          </div>
        </div>

        {/* Day-by-Day Itinerary Preview if package linked */}
        {linkedPackage && linkedPackage.itinerary && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Day-by-Day Circuit Itinerary ({linkedPackage.durationDays} Days)
              </span>
              <Link
                href={`/packages/${linkedPackage.slug}`}
                className="text-[11px] text-primary hover:underline font-semibold print:hidden"
              >
                View full circuit catalog →
              </Link>
            </div>

            <div className="space-y-2.5">
              {linkedPackage.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="bg-white p-4 rounded-xl border border-black/5 text-xs flex items-start gap-3"
                >
                  <span className="w-7 h-7 rounded-full bg-[#1f4d3a] text-white font-display font-bold flex items-center justify-center shrink-0 text-sm">
                    {day.day}
                  </span>
                  <div>
                    <h4 className="font-semibold text-foreground">{day.title}</h4>
                    <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                      {day.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inclusions & Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-black/5 space-y-2">
            <span className="font-semibold text-foreground block">Guaranteed Inclusions:</span>
            <ul className="space-y-1.5 text-muted-foreground text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Private dedicated chauffeur with unlimited route fuel and parking</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Reserved chamber accommodations held under guest family name</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>Daily artisan breakfast &amp; scheduled site entrance authorizations</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>24-hour island emergency logistics dispatch support</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-black/5 space-y-2">
            <span className="font-semibold text-foreground block">Island Tips &amp; Etiquette:</span>
            <ul className="space-y-1.5 text-muted-foreground text-[11px]">
              <li className="flex items-start gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-[#c59b27] mt-0.5 shrink-0" />
                <span>Temple Attire: Shoulders and knees must be covered at sacred shrines.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#c59b27] mt-0.5 shrink-0" />
                <span>Highlands Climate: Nuwara Eliya evenings dip to 12°C (bring a light knitwear).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Luggage className="w-3.5 h-3.5 text-[#c59b27] mt-0.5 shrink-0" />
                <span>Baggage: Soft duffel bags recommended for high-altitude train transitions.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Special Instructions */}
        {booking.adminNotes && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              House Notes &amp; Special Arrangements
            </span>
            <p className="text-foreground/90 italic pl-4.5">{booking.adminNotes}</p>
          </div>
        )}

        {/* Official Voucher Footer */}
        <div className="border-t border-black/10 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <span>Aether Trails Private Limited · Colombo &amp; Galle, Sri Lanka</span>
          <span>Emergency Assistance Helpline: +94 77 123 4567</span>
        </div>
      </div>
    </main>
  );
}
