import Image from "next/image";
import Link from "next/link";
import { DESTINATION_GUIDES } from "@/lib/destinations-data";
import { brand } from "@/lib/catalog";
import { MapPin, Clock, Compass, ArrowUpRight, Sparkles, Sun, Car } from "lucide-react";

export const metadata = {
  title: "Destinations & Regions of Sri Lanka",
  description: "Curated regional guides across Sri Lanka's cultural triangle, misty highlands, wild leopard reserves, and colonial ramparts.",
};

export default function DestinationsIndexPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-14 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          The Island Territories
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-foreground font-medium">
          Destinations of Sri Lanka
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          From ancient sky-citadels rising out of the central forest canopy to cloud-hung tea estates and golden leopard dunes along the Indian Ocean. Explore each province with our insider recommendations and handpicked heritage lodges.
        </p>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DESTINATION_GUIDES.map((dest) => (
          <div
            key={dest.slug}
            className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-black/10 hover:border-black/20 hover:shadow-xl transition-all duration-300"
          >
            <Link href={`/destinations/${dest.slug}`} className="block relative h-64 overflow-hidden">
              <Image
                src={dest.heroImage}
                alt={dest.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="backdrop-blur-md bg-black/50 text-white text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-white/10">
                  {dest.region}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs text-[#e8c36a] font-serif">{dest.nativeName}</p>
                <h3 className="font-display text-2xl font-medium text-white">{dest.name}</h3>
              </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {dest.overview}
              </p>

              <div className="space-y-2.5 pt-3 border-t border-black/5 text-xs text-foreground/80">
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
                  <span className="truncate">{dest.bestTimeToVisit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Recommended Stay: <strong>{dest.idealStayDays} Days</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{dest.travelTimesFromColombo}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href={`/packages/${dest.circuitSlug}`}
                  className="text-xs text-muted-foreground hover:text-foreground transition underline font-medium"
                >
                  Featured: {dest.circuitTitle}
                </Link>

                <Link
                  href={`/destinations/${dest.slug}`}
                  className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs group/btn"
                >
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
