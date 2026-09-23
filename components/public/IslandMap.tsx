"use client";

import { useState } from "react";
import { destinations, packages as defaultPackages } from "@/lib/catalog";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/components/providers/CurrencyContext";
import { MapPin, ArrowRight, Sparkles, Navigation, Clock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DestinationMeta {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  tagline: string;
  highlight: string;
  circuitSlug?: string;
  circuitTitle?: string;
  circuitPrice?: number;
  circuitDuration?: number;
  image: string;
}

const enrichedDestinations: DestinationMeta[] = [
  {
    id: "sigiriya",
    name: "Sigiriya",
    x: 54,
    y: 38,
    region: "Cultural Triangle",
    tagline: "The Lion Rock Citadel & Royal Water Gardens",
    highlight: "Dawn climb before tourist heat, fifth-century cloud fresco gallery, and jungle pool villas.",
    circuitSlug: "citadel-circuit",
    circuitTitle: "Citadel Circuit",
    circuitPrice: 1890,
    circuitDuration: 4,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kandy",
    name: "Kandy",
    x: 48,
    y: 48,
    region: "Central Highlands",
    tagline: "Sacred Lake & The Sacred Relic Temple",
    highlight: "Private viewing window at the Temple of the Tooth and traditional royal court drummers.",
    circuitSlug: "hill-country-express",
    circuitTitle: "Hill Country Express",
    circuitPrice: 1640,
    circuitDuration: 5,
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    x: 52,
    y: 54,
    region: "High Tea Country (1,868m)",
    tagline: "Mist, Ceylon Estates & Colonial Fireplaces",
    highlight: "Fourth-generation single-estate tea cupping session and highland herbal spa retreats.",
    circuitSlug: "mist-and-stillness",
    circuitTitle: "Mist & Stillness",
    circuitPrice: 2100,
    circuitDuration: 5,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "ella",
    name: "Ella",
    x: 58,
    y: 58,
    region: "Ella Gap & Cloud Forests",
    tagline: "The Legendary Blue Train & Nine Arch Bridge",
    highlight: "Reserved first-class observation salon carriage across the tea viaduct and Little Adam's Peak at sunrise.",
    circuitSlug: "hill-country-express",
    circuitTitle: "Hill Country Express",
    circuitPrice: 1640,
    circuitDuration: 5,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "yala",
    name: "Yala",
    x: 62,
    y: 72,
    region: "Wild Coastal Savannah",
    tagline: "Highest Leopard Density in the World",
    highlight: "Private dawn safari with senior park tracker, sundowner cocktails on coastal sand dunes.",
    circuitSlug: "leopard-coast",
    circuitTitle: "Leopard Coast",
    circuitPrice: 2420,
    circuitDuration: 6,
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "mirissa",
    name: "Mirissa",
    x: 44,
    y: 86,
    region: "Southern Indian Ocean",
    tagline: "Blue Whale Migrations & Secret Coves",
    highlight: "Private chartered marine biologist vessel for gentle whale and dolphin spotting, coconut palm hills.",
    circuitSlug: "leopard-coast",
    circuitTitle: "Leopard Coast",
    circuitPrice: 2420,
    circuitDuration: 6,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "galle",
    name: "Galle",
    x: 38,
    y: 82,
    region: "UNESCO Fortified Coast",
    tagline: "Dutch Ramparts & Artisan Cinnamon Heritage",
    highlight: "17th-century rampart walks, boutique colonial villas, and private cooking with a southern elder.",
    circuitSlug: "southern-story",
    circuitTitle: "Southern Story",
    circuitPrice: 1280,
    circuitDuration: 7,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
  },
];

export default function IslandMap() {
  const { formatPrice } = useCurrency();
  const [selectedId, setSelectedId] = useState<string>("sigiriya");
  const selected = enrichedDestinations.find((d) => d.id === selectedId) || enrichedDestinations[0];

  return (
    <div className="relative glass rounded-[2.2rem] p-6 lg:p-7 overflow-hidden border border-black/10 shadow-lg bg-gradient-to-br from-[#fbf8f3] to-[#f4ece1]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Cartographic Discovery
          </span>
          <h3 className="font-display text-2xl lg:text-3xl text-foreground font-medium mt-0.5">
            The Island, Hand-Drawn
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tap any geographic point or circuit hub to inspect regional highlights.
          </p>
        </div>

        <Link
          href={`/packages?destination=${encodeURIComponent(selected.name)}`}
          className="text-xs font-semibold text-[#1a1410] hover:text-[#c59b27] flex items-center gap-1 self-start sm:self-auto group transition"
        >
          <span>View {selected.name} circuits</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Island Vector */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[100/115]">
            <svg viewBox="0 0 100 115" className="w-full h-full drop-shadow-xl select-none">
              <defs>
                <linearGradient id="islandOceanGlow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e4435" />
                  <stop offset="60%" stopColor="#295d48" />
                  <stop offset="100%" stopColor="#1a3b2e" />
                </linearGradient>

                <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4" />
                </filter>
              </defs>

              {/* Island Landmass Contour */}
              <path
                d="M48 6 C62 8 70 18 72 30 C76 42 80 50 78 62 C76 76 70 88 58 98 C48 105 40 104 32 96 C22 86 20 72 22 58 C18 44 24 28 32 16 C38 8 42 6 48 6Z"
                fill="url(#islandOceanGlow)"
                stroke="#d3ba7a"
                strokeWidth="0.8"
                className="transition-all duration-500"
              />

              {/* Connecting circuit path lines */}
              <path
                d="M54 38 L48 48 L52 54 L58 58 L62 72 L44 86 L38 82"
                fill="none"
                stroke="#e8c36a"
                strokeWidth="0.6"
                strokeDasharray="1.5 1.5"
                opacity="0.45"
              />

              {/* Destination Hotspots */}
              {enrichedDestinations.map((d) => {
                const isSelected = d.id === selectedId;
                return (
                  <g
                    key={d.id}
                    onClick={() => setSelectedId(d.id)}
                    className="cursor-pointer group"
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${d.name}`}
                  >
                    {/* Pulsing ring for selected item */}
                    {isSelected && (
                      <circle
                        cx={d.x}
                        cy={d.y}
                        r="4.5"
                        fill="none"
                        stroke="#e8c36a"
                        strokeWidth="0.8"
                        className="animate-ping opacity-75 origin-center"
                      />
                    )}

                    {/* Outer hover disc */}
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={isSelected ? "3" : "2"}
                      fill={isSelected ? "#e8c36a" : "#f6f1e8"}
                      stroke="#1a1410"
                      strokeWidth="0.5"
                      className="transition-all duration-200 group-hover:scale-125"
                      filter="url(#pinGlow)"
                    />

                    {/* Inner pin point */}
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r="1"
                      fill={isSelected ? "#1a1410" : "#c59b27"}
                    />

                    {/* Text Label */}
                    <text
                      x={d.x + 3.2}
                      y={d.y + 1.2}
                      fontSize="3.4"
                      fontWeight={isSelected ? "700" : "500"}
                      fill={isSelected ? "#ffffff" : "#f6f1e8"}
                      className="tracking-wide select-none drop-shadow-sm transition-all"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick pills */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3 max-w-sm">
            {enrichedDestinations.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition ${
                  selectedId === d.id
                    ? "bg-[#1f4d3a] text-white shadow-xs"
                    : "bg-white/80 text-foreground/80 hover:bg-white hover:text-foreground border border-black/5"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Hub Detail Card */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl p-5 border border-black/10 shadow-sm space-y-4"
            >
              {/* Image Preview Header */}
              <div className="relative h-36 rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-[#e8c36a]" />
                  {selected.region}
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h4 className="font-display text-2xl font-medium leading-none drop-shadow-sm">
                    {selected.name}
                  </h4>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                    {selected.tagline}
                  </p>
                </div>
              </div>

              {/* Highlight summary */}
              <div className="space-y-1.5 text-xs text-foreground/85 leading-relaxed bg-[#fbf9f5] p-3 rounded-xl border border-black/5">
                <p className="font-semibold text-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#c59b27]">
                  <Sparkles className="w-3 h-3" />
                  House Signature Experience
                </p>
                <p>{selected.highlight}</p>
              </div>

              {/* Linked Circuit Info */}
              {selected.circuitSlug && (
                <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
                      Recommended Circuit
                    </span>
                    <Link
                      href={`/packages/${selected.circuitSlug}`}
                      className="font-display text-base font-semibold text-foreground hover:text-primary transition"
                    >
                      {selected.circuitTitle}
                    </Link>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c59b27]" />
                        {selected.circuitDuration} days
                      </span>
                      <span>·</span>
                      <span className="font-bold text-foreground">
                        {formatPrice(selected.circuitPrice || 0)}
                      </span>
                      <span className="text-[10px]">/ guest</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/destinations/${selected.id}`}
                      className="px-3 py-2 rounded-xl border border-black/10 hover:bg-muted text-xs font-semibold text-foreground transition"
                      title="Read regional travel guide"
                    >
                      Guide
                    </Link>
                    <Link
                      href={`/packages/${selected.circuitSlug}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition shadow-xs"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
