import { getPackages, getVehicles } from "@/lib/data";
import BookingInquiryForm from "@/components/public/BookingInquiryForm";
import { brand } from "@/lib/catalog";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const [packages, vehicles] = await Promise.all([getPackages(), getVehicles()]);
  return (
    <main className="max-w-6xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-12">
      <div>
        <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">Studio</p>
        <h1 className="font-display text-6xl mt-2">Write to a planner</h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          No bots. No payment form. Tell us when you can travel and who is coming — we draft a circuit and hold the rooms.
        </p>
        <dl className="mt-8 space-y-3 text-sm">
          <div><dt className="text-muted-foreground">Email</dt><dd>{brand.email}</dd></div>
          <div><dt className="text-muted-foreground">Phone</dt><dd>{brand.phone}</dd></div>
          <div><dt className="text-muted-foreground">WhatsApp</dt><dd>{brand.whatsapp}</dd></div>
          <div><dt className="text-muted-foreground">Hours</dt><dd>09:00–18:00 IST · replies within 24h</dd></div>
        </dl>
      </div>
      <div className="glass rounded-[2rem] p-8">
        <BookingInquiryForm
          packages={packages.map((p) => ({ _id: p._id, title: p.title }))}
          vehicles={vehicles.map((v) => ({ _id: v._id, name: v.name }))}
        />
      </div>
    </main>
  );
}
