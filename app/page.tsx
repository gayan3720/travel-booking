import Hero from "@/components/public/Hero";
import PackageGrid from "@/components/public/PackageGrid";
import OfferCard from "@/components/public/OfferCard";
import TestimonialSlider from "@/components/public/TestimonialSlider";
import IslandMap from "@/components/public/IslandMap";
import RouteEstimator from "@/components/public/RouteEstimator";
import { getApprovedReviews, getOffers, getPackages } from "@/lib/data";
import Link from "next/link";
import { Sparkles, Compass, ShieldCheck, Clock, ArrowRight, HeartHandshake } from "lucide-react";

export const revalidate = 300;

export default async function HomePage() {
  const [featuredPackages, activeOffers, approvedReviews] = await Promise.all([
    getPackages(),
    getOffers(),
    getApprovedReviews(),
  ]);

  return (
    <main className="space-y-20">
      <Hero
        title="The island, privately."
        subtitle="Hand-drawn circuits, a chauffeur who knows the back roads, and a planner who answers by name — never a checkout cart."
        ctaText="Browse circuits"
        ctaHref="/packages"
      />

      {/* Cartographic Discovery & House Booking Policy */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 glass rounded-[2.2rem] p-7 border border-black/10 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              House Booking Ethos
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-foreground font-medium">
              Inquiry, not a cart.
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Every itinerary in Sri Lanka is uniquely timed to monsoon shifts, train schedules, and hotel chamber availability.
            </p>
          </div>

          <ol className="space-y-4 text-xs text-foreground/80">
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-black/5">
              <span className="font-display text-base font-bold text-primary">01.</span>
              <div>
                <strong className="text-foreground block font-semibold">Choose or custom-build</strong>
                <span className="text-muted-foreground">Select a classic package or use our Route Estimator to tailor days.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-black/5">
              <span className="font-display text-base font-bold text-primary">02.</span>
              <div>
                <strong className="text-foreground block font-semibold">We hold your chambers</strong>
                <span className="text-muted-foreground">We secure heritage lodges and assign a vetted chauffeur to your party.</span>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-black/5">
              <span className="font-display text-base font-bold text-primary">03.</span>
              <div>
                <strong className="text-foreground block font-semibold">Pay the House directly</strong>
                <span className="text-muted-foreground">No random credit card charges online. Direct bank transfer or on arrival.</span>
              </div>
            </li>
          </ol>

          <Link
            href="/planner"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs"
          >
            <span>Launch Route Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hand-Drawn Interactive Island Map */}
        <div className="lg:col-span-8">
          <IslandMap />
        </div>
      </section>

      {/* Featured Circuits */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] block">
              Curated Circuits
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground">
              Signature Island Packages
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Privately chauffeured tours with hand-picked tea estate bungalows, ancient citadels, and wildlife reserves.
            </p>
          </div>
          <Link
            href="/packages"
            className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 group transition self-start sm:self-auto"
          >
            <span>View all packages</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <PackageGrid packages={featuredPackages.slice(0, 6)} />
      </section>

      {/* Interactive Trip Planner & Cost Estimator Embedded */}
      <section className="max-w-7xl mx-auto px-4">
        <RouteEstimator />
      </section>

      {/* Active Seasonal Offers */}
      {activeOffers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] block">
                Seasonal Advantages
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground">
                Limited Privileges &amp; Offers
              </h2>
            </div>
            <Link
              href="/offers"
              className="text-xs font-semibold text-primary hover:underline"
            >
              All promotional circuits →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeOffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      {/* Traveler Feedback & Verified Reviews */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] block">
            Guest Chronicles
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground">
            Travelers, Not Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Reflections from couples, families, and solo guests who toured Sri Lanka with our house chauffeurs.
          </p>
        </div>
        <TestimonialSlider reviews={approvedReviews} />
      </section>

      {/* Direct Inquiry Hero Callout */}
      <section className="mx-4 rounded-[2.5rem] overflow-hidden relative min-h-[380px] flex items-center justify-center text-center text-white shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120e]/90 via-[#17120e]/75 to-[#17120e]/90" />
        <div className="relative px-6 py-16 max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#e8c36a] block">
            Personal Concierge Desk
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-medium leading-tight">
            Ready when you are.
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg mx-auto leading-relaxed">
            Tell us your travel window, party count, and preferred pace. We hold vehicles and lodges and reply within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <Link
              href="/contact"
              className="bg-[#c59b27] hover:bg-[#d9ab2d] text-[#17120e] px-8 py-3.5 rounded-full text-xs font-semibold shadow-lg transition active:scale-95"
            >
              Send an Inquiry
            </Link>
            <Link
              href="/planner"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-full text-xs font-medium transition"
            >
              Custom Route Estimator
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
