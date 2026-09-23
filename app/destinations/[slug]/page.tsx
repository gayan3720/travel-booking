import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DESTINATION_GUIDES } from "@/lib/destinations-data";
import { getPackages } from "@/lib/data";
import { brand } from "@/lib/catalog";
import {
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Sun,
  Car,
  Camera,
  Coffee,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";

export async function generateStaticParams() {
  return DESTINATION_GUIDES.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const dest = DESTINATION_GUIDES.find((d) => d.slug === params.slug);
  if (!dest) return {};
  return {
    title: `${dest.name} Travel Guide | ${brand.name}`,
    description: dest.overview.slice(0, 160),
    openGraph: {
      images: [dest.heroImage],
    },
  };
}

export default async function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const dest = DESTINATION_GUIDES.find((d) => d.slug === params.slug);
  if (!dest) notFound();

  const allPackages = await getPackages();
  const linkedCircuit = allPackages.find((p) => p.slug === dest.circuitSlug);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden min-h-[480px] flex flex-col justify-end p-6 sm:p-12 border border-black/10 shadow-2xl">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-3 text-white">
          <div className="flex items-center gap-2">
            <span className="backdrop-blur-md bg-white/20 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/20">
              {dest.region}
            </span>
            <span className="text-xs text-[#e8c36a] font-serif tracking-wider">
              {dest.nativeName}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-white font-medium leading-tight">
            {dest.name}
          </h1>

          <p className="text-white/80 text-sm sm:text-base font-light max-w-2xl leading-relaxed">
            {dest.tagline}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 text-xs text-white/90 border-t border-white/20">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Best Season</span>
              <strong className="font-medium text-white">{dest.bestTimeToVisit}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Recommended Duration</span>
              <strong className="font-medium text-white">{dest.idealStayDays} Days</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Elevation</span>
              <strong className="font-medium text-white">{dest.elevation}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Transfer Time</span>
              <strong className="font-medium text-white">{dest.travelTimesFromColombo}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Overview + Climate Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Overview */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-xs space-y-4">
            <h2 className="font-display text-3xl text-foreground font-medium">The Narrative &amp; Heritage</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {dest.overview}
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-3">
              <Sun className="w-4 h-4 text-[#c59b27] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Insider Climate &amp; Timing Note:</strong>
                <p className="mt-0.5 text-amber-900/90 leading-relaxed">{dest.climateTip}</p>
              </div>
            </div>
          </section>

          {/* Photo Gallery Grid */}
          {dest.gallery.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-display text-2xl text-foreground font-medium">Visual Perspectives</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {dest.gallery.map((img, idx) => (
                  <div key={idx} className="relative h-56 rounded-2xl overflow-hidden border border-black/10">
                    <Image
                      src={img}
                      alt={`${dest.name} vista ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curated Experiences */}
          <section className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] block">
                Exclusive Itinerary Highlights
              </span>
              <h3 className="font-display text-3xl text-foreground font-medium mt-1">
                Handpicked Ways to Experience {dest.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dest.curatedExperiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-black/5 shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-[#f6f1e8] text-foreground">
                        {exp.timeOfDay}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
                    </div>
                    <h4 className="font-semibold text-sm text-foreground">{exp.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Signature Lodging Partners */}
          <section className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] block">
                Boutique Sanctums
              </span>
              <h3 className="font-display text-3xl text-foreground font-medium mt-1">
                Where We Lodge Our Guests
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dest.signatureLodges.map((lodge, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-xs flex flex-col"
                >
                  <div className="relative h-44">
                    <Image
                      src={lodge.image}
                      alt={lodge.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                      {lodge.type}
                    </span>
                    <h4 className="font-semibold text-sm text-foreground">{lodge.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {lodge.highlight}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sticky Sidebar: Featured Circuit + Custom Inquiry Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Featured Circuit Card */}
          {linkedCircuit && (
            <div className="bg-[#1b1511] text-[#f7eee1] rounded-3xl p-6 sm:p-7 border border-[#423326] shadow-xl space-y-5 sticky top-28">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] block">
                Recommended Circuit
              </span>

              <div>
                <h3 className="font-display text-2xl text-white font-medium">
                  {linkedCircuit.title}
                </h3>
                <p className="text-xs text-white/70 mt-1">
                  {linkedCircuit.durationDays} Days · Private Chauffeur &amp; Handpicked Lodges
                </p>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={linkedCircuit.images[0]}
                  alt={linkedCircuit.title}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                {linkedCircuit.description}
              </p>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <Link
                  href={`/packages/${linkedCircuit.slug}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#c59b27] hover:bg-[#d8ab2e] text-[#1a1410] font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>View Itinerary &amp; Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/planner`}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>Build Custom Circuit</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
