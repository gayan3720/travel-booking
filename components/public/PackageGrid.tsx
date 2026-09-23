"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export default function PackageGrid({ packages }: { packages: any[] }) {
  if (packages.length === 0) {
    return <p className="text-muted-foreground">No packages in this filter — try another season.</p>;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
    >
      <Link href={`/packages/${pkg.slug}`} className="group block">
        <div className="relative h-72 overflow-hidden rounded-[1.6rem] shadow-[0_30px_60px_-40px_rgba(40,20,8,0.7)]">
          <Image
            src={pkg.images?.[0]}
            alt={pkg.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute top-4 left-4 glass text-[11px] uppercase tracking-widest px-3 py-1 rounded-full">
            {pkg.durationDays} days
          </span>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">{pkg.destination}</p>
            <h3 className="font-display text-3xl leading-tight mt-1">{pkg.title}</h3>
            <div className="flex items-end justify-between mt-3">
              <span className="text-amber-200 font-medium">{formatCurrency(pkg.price)}</span>
              <span className="text-xs capitalize bg-white/15 px-2 py-1 rounded-full">{pkg.category}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
