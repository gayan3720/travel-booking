import { notFound } from "next/navigation";
import Image from "next/image";
import { getApprovedReviews, getPackageBySlug, getPackages } from "@/lib/data";
import BookingInquiryForm from "@/components/public/BookingInquiryForm";
import ItineraryTimeline from "@/components/public/ItineraryTimeline";
import ReviewList from "@/components/public/ReviewList";
import PackageDetailPrice from "@/components/public/PackageDetailPrice";

export const revalidate = 300;

export async function generateStaticParams() {
  const list = await getPackages();
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: pkg.description.slice(0, 155),
    openGraph: { images: pkg.images?.[0] ? [pkg.images[0]] : [] },
  };
}

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = await getPackageBySlug(params.slug);
  if (!pkg) notFound();
  const reviews = await getApprovedReviews(pkg._id);

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div className="relative h-[28rem] rounded-[2rem] overflow-hidden">
          <Image src={pkg.images[0]} alt={pkg.title} fill className="object-cover" priority />
        </div>
        {pkg.images.length > 1 && (
          <div className="grid grid-cols-2 gap-3">
            {pkg.images.slice(1).map((src) => (
              <div key={src} className="relative h-40 rounded-2xl overflow-hidden">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{pkg.destination}</p>
          <h1 className="font-display text-5xl mt-2">{pkg.title}</h1>
          <p className="text-muted-foreground mt-4 leading-relaxed">{pkg.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          {[
            [String(pkg.durationDays), "Days"],
            [`${pkg.maxPax}`, "Max guests"],
            [pkg.category, "Mood"],
          ].map(([v, l]) => (
            <div key={l} className="glass rounded-2xl p-4 text-center">
              <p className="font-display text-2xl capitalize">{v}</p>
              <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1">{l}</p>
            </div>
          ))}
        </div>
        <ItineraryTimeline itinerary={pkg.itinerary} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-medium mb-2">Included</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {pkg.included.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="font-medium mb-2">Not included</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {pkg.excluded.map((item) => (
                <li key={item}>✕ {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h3 className="font-display text-3xl mb-4">Stories from this circuit</h3>
          <ReviewList reviews={reviews} />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="glass rounded-[1.8rem] p-6 sticky top-24 space-y-4">
          <PackageDetailPrice price={pkg.price} />
          <BookingInquiryForm packageId={pkg._id} />
        </div>
      </div>
    </main>
  );
}
