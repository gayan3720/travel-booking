"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/providers/CurrencyContext";
import { Clock, MapPin, Users, ArrowUpRight, Sparkles } from "lucide-react";

export default function PackageGrid({ packages }: { packages: any[] }) {
  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-black/10 max-w-xl mx-auto space-y-3">
        <Sparkles className="w-8 h-8 text-[#c59b27] mx-auto" />
        <h3 className="font-display text-2xl text-foreground font-medium">No circuits match your criteria</h3>
        <p className="text-xs text-muted-foreground">
          Try clearing your filters, adjusting the duration, or expanding your price range.
        </p>
        <Link
          href="/packages"
          className="inline-block px-5 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition"
        >
          Reset All Filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {packages.map((pkg, i) => (
        <PackageCard key={pkg._id} pkg={pkg} index={i} />
      ))}
    </div>
  );
}

function PackageCard({ pkg, index }: { pkg: any; index: number }) {
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group flex flex-col bg-white rounded-[1.8rem] overflow-hidden border border-black/10 hover:border-black/20 hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/packages/${pkg.slug}`} className="block relative h-64 overflow-hidden">
        <Image
          src={pkg.images?.[0] || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center">
          <span className="backdrop-blur-md bg-black/50 text-white text-[11px] font-medium tracking-wide px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-[#e8c36a]" />
            {pkg.durationDays} Days / {pkg.durationDays - 1} Nights
          </span>
          <span className="backdrop-blur-md bg-white/90 text-[#1a1410] text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
            {pkg.category}
          </span>
        </div>

        {/* Bottom Destination Banner on Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#e8c36a] flex items-center gap-1 font-semibold">
            <MapPin className="w-3 h-3" />
            {pkg.destination}
          </p>
          <h3 className="font-display text-2xl font-medium leading-snug mt-0.5 line-clamp-1 group-hover:text-[#f8ecd2] transition-colors">
            {pkg.title}
          </h3>
        </div>
      </Link>

      {/* Card Content & Inclusions */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {pkg.description}
        </p>

        {/* Key Inclusions Preview */}
        {pkg.included && pkg.included.length > 0 && (
          <div className="pt-2 border-t border-black/5 flex flex-wrap gap-1.5">
            {pkg.included.slice(0, 3).map((inc: string, idx: number) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-[#f6f1e8] text-foreground/80 font-medium"
              >
                ✓ {inc}
              </span>
            ))}
            {pkg.included.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground font-semibold">
                +{pkg.included.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom Price & Link */}
        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Inquiry from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-semibold text-foreground">
                {formatPrice(pkg.price)}
              </span>
              <span className="text-[11px] text-muted-foreground">/ guest</span>
            </div>
          </div>

          <Link
            href={`/packages/${pkg.slug}`}
            className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-xs group/btn"
          >
            <span>Itinerary</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
