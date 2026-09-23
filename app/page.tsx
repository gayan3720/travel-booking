import Hero from "@/components/public/Hero";
import PackageGrid from "@/components/public/PackageGrid";
import OfferCard from "@/components/public/OfferCard";
import TestimonialSlider from "@/components/public/TestimonialSlider";
import IslandMap from "@/components/public/IslandMap";
import { getApprovedReviews, getOffers, getPackages } from "@/lib/data";
import Link from "next/link";

export const revalidate = 300;

export default async function HomePage() {
  const [featuredPackages, activeOffers, approvedReviews] = await Promise.all([
    getPackages(),
    getOffers(),
    getApprovedReviews(),
  ]);

  return (
    <main>
      <Hero
        title="The island, privately."
        subtitle="Hand-drawn circuits, a chauffeur who knows the back roads, and a planner who answers by name — never a checkout cart."
        ctaText="Browse circuits"
        ctaHref="/packages"
      />

      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 grid lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2rem] p-8">
          <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">How booking works</p>
          <h2 className="font-display text-4xl mt-3">Inquiry, not a cart.</h2>
          <ol className="mt-6 space-y-4 text-sm text-muted-foreground">
            <li><span className="text-foreground font-medium">01.</span> Choose a circuit or tell us the month you can travel.</li>
            <li><span className="text-foreground font-medium">02.</span> We hold lodges and vehicles, then write you a confirmation.</li>
            <li><span className="text-foreground font-medium">03.</span> Pay the house directly — we never take card details here.</li>
          </ol>
        </div>
        <IslandMap />
      </section>

      {activeOffers.length > 0 && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">Timed</p>
              <h2 className="font-display text-5xl">Current offers</h2>
            </div>
            <Link href="/offers" className="text-sm underline underline-offset-4">All offers</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeOffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      <section className="py-10 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">Circuits</p>
            <h2 className="font-display text-5xl">Featured packages</h2>
          </div>
          <Link href="/packages" className="text-sm underline underline-offset-4">View all</Link>
        </div>
        <PackageGrid packages={featuredPackages.slice(0, 6)} />
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-5xl text-center mb-10">Travelers, not testimonials</h2>
        <TestimonialSlider reviews={approvedReviews} />
      </section>

      <section className="mx-4 mb-8 rounded-[2.2rem] overflow-hidden relative min-h-[340px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80)" }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative px-6 py-16">
          <h2 className="font-display text-5xl md:text-6xl">Ready when you are.</h2>
          <p className="mt-4 max-w-lg mx-auto text-white/80">Tell us dates and party size. We reply within a day — often sooner.</p>
          <Link href="/contact" className="inline-block mt-8 bg-white text-primary px-8 py-3 rounded-full font-medium">
            Send an inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}
