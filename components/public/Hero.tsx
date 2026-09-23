"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const frames = [
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=80",
];

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
}: {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % frames.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[88vh] overflow-hidden text-white">
      {frames.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === i ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-kenburns"
            style={{ backgroundImage: `url(${src})` }}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#f6f1e8]" />
      <div className="absolute -top-24 -right-16 h-[28rem] w-[28rem] rounded-full bg-amber-400/20 blur-3xl animate-aurora" />
      <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="uppercase tracking-[0.35em] text-xs text-white/70"
        >
          Colombo · by inquiry
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl max-w-4xl leading-[0.95] mt-6 text-balance"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-white/80 max-w-xl"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href={ctaHref}
            className="bg-white text-[#1a1410] px-7 py-3.5 rounded-full font-medium hover:bg-amber-100 transition"
          >
            {ctaText}
          </Link>
          <Link
            href="/contact"
            className="border border-white/40 px-7 py-3.5 rounded-full font-medium hover:bg-white/10 transition"
          >
            Speak with a planner
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
