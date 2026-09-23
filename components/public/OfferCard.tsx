"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function OfferCard({ offer }: { offer: any }) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="relative overflow-hidden rounded-[1.5rem] min-h-[280px] text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${offer.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410] via-[#1a1410]/50 to-transparent" />
      <div className="relative p-6 flex flex-col h-full min-h-[280px] justify-end">
        <span className="self-start text-[11px] tracking-widest uppercase bg-amber-400/90 text-[#1a1410] px-3 py-1 rounded-full mb-3">
          {offer.discountText}
        </span>
        <h3 className="font-display text-3xl">{offer.title}</h3>
        <p className="text-sm text-white/75 mt-2">{offer.description}</p>
        <div className="flex items-center justify-between mt-4 text-xs text-white/60">
          <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ends today"}</span>
          {offer.packageId && (
            <Link href="/packages" className="underline underline-offset-4">
              View packages
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
