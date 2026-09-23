"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCurrency } from "@/components/providers/CurrencyContext";
import {
  Compass,
  Calendar,
  Users,
  Car,
  Home,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Coffee,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CircuitOption {
  id: string;
  name: string;
  baseDays: number;
  basePrice: number;
  destination: string;
  category: string;
  description: string;
}

const CIRCUIT_OPTIONS: CircuitOption[] = [
  {
    id: "citadel-circuit",
    name: "Citadel Circuit (Cultural Triangle)",
    baseDays: 4,
    basePrice: 1890,
    destination: "Sigiriya",
    category: "Cultural",
    description: "Lion Rock sunrise, Dambulla caves, and royal tank reservoir pavilions.",
  },
  {
    id: "hill-country-express",
    name: "Hill Country Express (Tea Highlands)",
    baseDays: 5,
    basePrice: 1640,
    destination: "Ella & Kandy",
    category: "Scenic & Honeymoon",
    description: "First-class blue observation train, colonial tea estates, and misty mountain gaps.",
  },
  {
    id: "leopard-coast",
    name: "Leopard Coast (Yala & Whales)",
    baseDays: 6,
    basePrice: 2420,
    destination: "Yala & Mirissa",
    category: "Wildlife & Ocean",
    description: "Private naturalist dawn game drives and gentle blue whale oceanic expedition.",
  },
  {
    id: "southern-story",
    name: "Southern Story (Galle & Beaches)",
    baseDays: 7,
    basePrice: 1280,
    destination: "Galle Fort",
    category: "Heritage & Family",
    description: "17th-century ramparts, turtle sanctuaries, and private village cooking encounters.",
  },
  {
    id: "mist-and-stillness",
    name: "Mist & Stillness (Ayurvedic Retreat)",
    baseDays: 5,
    basePrice: 2100,
    destination: "Nuwara Eliya",
    category: "Wellness & Rest",
    description: "Physician-guided herbal steam baths, forest bathing, and glasshouse suppers.",
  },
  {
    id: "colombo-after-dark",
    name: "Colombo Urban Story (Architecture & Food)",
    baseDays: 2,
    basePrice: 640,
    destination: "Colombo",
    category: "City Sprint",
    description: "Spice market walk, Geoffrey Bawa architecture trails, and seaside sunset dining.",
  },
];

const LODGE_TIERS = [
  {
    id: "signature",
    name: "Heritage & Boutique Lodges",
    multiplier: 1.0,
    description: "Curated colonial bungalows, eco-chalets with private verandas, and tea estate suites.",
    amenities: ["Artisan breakfast included", "Private gardens", "Evening fireplaces"],
  },
  {
    id: "ultra",
    name: "Ultra-Luxury Pavilions & Villas",
    multiplier: 1.35,
    description: "Architectural private plunge pools, butler service, and Relais & Châteaux properties.",
    amenities: ["Dedicated personal butler", "Private plunge pool", "Full tasting menu privileges"],
  },
];

const FLEET_CLASSES = [
  {
    id: "van",
    name: "Executive Luxury Van (Toyota HiAce / Commuter)",
    costPerDay: 75,
    recommendedFor: "Families & groups (3-7 travelers)",
    seats: "Up to 7 guests + luggage",
  },
  {
    id: "suv",
    name: "Safari & Highland SUV (Toyota Prado 4x4)",
    costPerDay: 95,
    recommendedFor: "Couples & rugged adventurers (1-3 travelers)",
    seats: "Up to 3 guests + luggage",
  },
  {
    id: "sedan",
    name: "First-Class Touring Sedan (Mercedes-Benz / Camry)",
    costPerDay: 65,
    recommendedFor: "Solo travelers & couples (1-2 travelers)",
    seats: "Up to 2 guests + luggage",
  },
];

export default function RouteEstimator() {
  const { formatPrice } = useCurrency();
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>("citadel-circuit");
  const [durationDays, setDurationDays] = useState<number>(4);
  const [travelers, setTravelers] = useState<number>(2);
  const [lodgeTierId, setLodgeTierId] = useState<string>("signature");
  const [fleetClassId, setFleetClassId] = useState<string>("van");
  const [includeHelicopter, setIncludeHelicopter] = useState<boolean>(false);
  const [includeCookingClass, setIncludeCookingClass] = useState<boolean>(true);

  // Active selections
  const currentCircuit = useMemo(
    () => CIRCUIT_OPTIONS.find((c) => c.id === selectedCircuitId) || CIRCUIT_OPTIONS[0],
    [selectedCircuitId]
  );

  const currentLodge = useMemo(
    () => LODGE_TIERS.find((l) => l.id === lodgeTierId) || LODGE_TIERS[0],
    [lodgeTierId]
  );

  const currentFleet = useMemo(
    () => FLEET_CLASSES.find((f) => f.id === fleetClassId) || FLEET_CLASSES[0],
    [fleetClassId]
  );

  // Calculation
  const calculation = useMemo(() => {
    // base per person scaled by duration compared to package baseDays
    const durationRatio = durationDays / currentCircuit.baseDays;
    const basePerPax = currentCircuit.basePrice * durationRatio * currentLodge.multiplier;

    // Total base for party
    let partyBase = basePerPax * travelers;

    // Fleet cost (per vehicle per day, split across party)
    const vehicleCostTotal = currentFleet.costPerDay * durationDays;

    // Experiences
    let experiencesTotal = 0;
    if (includeCookingClass) experiencesTotal += 65 * travelers;
    if (includeHelicopter) experiencesTotal += 680; // one helicopter segment for party

    const grandTotal = Math.round(partyBase + vehicleCostTotal + experiencesTotal);
    const perPersonTotal = Math.round(grandTotal / travelers);

    return {
      perPersonTotal,
      grandTotal,
      partyBase: Math.round(partyBase),
      vehicleCostTotal,
      experiencesTotal,
    };
  }, [
    currentCircuit,
    durationDays,
    travelers,
    currentLodge,
    currentFleet,
    includeCookingClass,
    includeHelicopter,
  ]);

  const handleCircuitSelect = (circuitId: string) => {
    setSelectedCircuitId(circuitId);
    const c = CIRCUIT_OPTIONS.find((item) => item.id === circuitId);
    if (c) {
      setDurationDays(c.baseDays);
    }
  };

  return (
    <section className="bg-white rounded-[2.5rem] border border-black/10 shadow-sm overflow-hidden p-6 sm:p-10">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Travel Atelier
        </span>
        <h2 className="font-display text-3xl sm:text-5xl text-foreground font-medium">
          Route Builder & Cost Estimator
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          Tailor your Sri Lankan journey in real time. Adjust your days, party size, lodge luxury level, and private chauffeur vehicle class to receive an immediate estimate.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-7 space-y-7">
          {/* Step 1: Select Desired Circuit / Region */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-primary" />
                1. Select Desired Circuit Base
              </span>
              <span className="text-muted-foreground font-normal text-[11px] lowercase">
                ({CIRCUIT_OPTIONS.length} signature routes)
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CIRCUIT_OPTIONS.map((c) => {
                const isSelected = c.id === selectedCircuitId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleCircuitSelect(c.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#1f4d3a] text-white border-[#1f4d3a] shadow-sm"
                        : "bg-[#fbf9f5] border-black/10 hover:border-black/20 text-foreground"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? "bg-[#e8c36a] text-[#1a1410]"
                              : "bg-black/5 text-muted-foreground"
                          }`}
                        >
                          {c.category}
                        </span>
                        <span className={`text-[11px] font-semibold ${isSelected ? "text-[#e8c36a]" : "text-primary"}`}>
                          {c.baseDays} days
                        </span>
                      </div>
                      <p className="font-display font-semibold text-sm mt-2 line-clamp-1">
                        {c.name}
                      </p>
                      <p
                        className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                          isSelected ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {c.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Sliders for Duration & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#fbf9f5] p-5 rounded-2xl border border-black/5">
            {/* Duration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Trip Duration
                </span>
                <span className="font-bold text-primary text-sm">{durationDays} Days</span>
              </div>
              <input
                type="range"
                min="2"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>2 days</span>
                <span>7 days</span>
                <span>14 days</span>
              </div>
            </div>

            {/* Travelers Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  Party Size
                </span>
                <span className="font-bold text-primary text-sm">
                  {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1 solo</span>
                <span>2 couple</span>
                <span>4-8 family/friends</span>
              </div>
            </div>
          </div>

          {/* Step 3: Lodge Style Selection */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
              <Home className="w-4 h-4 text-primary" />
              2. Lodge & Accommodation Class
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LODGE_TIERS.map((tier) => {
                const isSelected = tier.id === lodgeTierId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setLodgeTierId(tier.id)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-[#1f4d3a] text-white border-[#1f4d3a] shadow-xs"
                        : "bg-white border-black/10 hover:border-black/20 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{tier.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#e8c36a]" />}
                    </div>
                    <p
                      className={`text-[11px] mt-1.5 leading-relaxed ${
                        isSelected ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {tier.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {tier.amenities.map((a, i) => (
                        <li
                          key={i}
                          className={`text-[10px] flex items-center gap-1.5 ${
                            isSelected ? "text-white/90" : "text-foreground/75"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              isSelected ? "bg-[#e8c36a]" : "bg-primary"
                            }`}
                          />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Private Fleet Class Selection */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-1.5">
              <Car className="w-4 h-4 text-primary" />
              3. Private Chauffeur Vehicle Class
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FLEET_CLASSES.map((fleet) => {
                const isSelected = fleet.id === fleetClassId;
                return (
                  <button
                    key={fleet.id}
                    type="button"
                    onClick={() => setFleetClassId(fleet.id)}
                    className={`text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-[#1f4d3a] text-white border-[#1f4d3a] shadow-xs"
                        : "bg-white border-black/10 hover:border-black/20 text-foreground"
                    }`}
                  >
                    <p className="font-semibold text-xs leading-snug">{fleet.name}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isSelected ? "text-[#e8c36a]" : "text-muted-foreground"
                      }`}
                    >
                      +{formatPrice(fleet.costPerDay)}/day
                    </p>
                    <p
                      className={`text-[10px] mt-2 line-clamp-2 ${
                        isSelected ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {fleet.recommendedFor}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Curated Add-ons */}
          <div className="space-y-2 pt-2 border-t border-black/5">
            <label className="text-xs uppercase tracking-wider font-bold text-foreground block">
              Curated Add-on Experiences
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-black/10 bg-[#fbf9f5] cursor-pointer text-xs select-none flex-1">
                <input
                  type="checkbox"
                  checked={includeCookingClass}
                  onChange={(e) => setIncludeCookingClass(e.target.checked)}
                  className="rounded accent-primary w-4 h-4"
                />
                <div>
                  <span className="font-semibold block">Village Elder Cooking Class</span>
                  <span className="text-[11px] text-muted-foreground">
                    +$65 / guest (Hoppers, fresh coconut sambol & clay-pot curries)
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-black/10 bg-[#fbf9f5] cursor-pointer text-xs select-none flex-1">
                <input
                  type="checkbox"
                  checked={includeHelicopter}
                  onChange={(e) => setIncludeHelicopter(e.target.checked)}
                  className="rounded accent-primary w-4 h-4"
                />
                <div>
                  <span className="font-semibold block">Helicopter Aerial Transfer</span>
                  <span className="text-[11px] text-muted-foreground">
                    +$680 party flat (Sigiriya to Coast scenic charter)
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Price Breakdown & Inquiry CTA */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-gradient-to-b from-[#1b1511] to-[#261d17] text-[#f7eee1] rounded-3xl p-6 sm:p-7 border border-[#423326] shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] block">
                Estimated Private Cost
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-4xl sm:text-5xl text-white font-medium">
                  {formatPrice(calculation.perPersonTotal)}
                </span>
                <span className="text-xs text-white/60">/ guest</span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Total for party ({travelers} travelers, {durationDays} days):{" "}
                <span className="font-semibold text-white">
                  {formatPrice(calculation.grandTotal)}
                </span>
              </p>
            </div>

            {/* Inclusions summary */}
            <div className="space-y-3 text-xs">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[#c59b27]">
                Included in This Estimate:
              </p>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-white">{currentCircuit.name}</strong> ({durationDays} days)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-white">{currentLodge.name}</strong> accommodation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Private dedicated chauffeur &amp; <strong className="text-white">{currentFleet.name}</strong> with fuel &amp; expressway tolls
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>All park entry licenses, regional permits &amp; airport meet-and-greet</span>
                </li>
                {includeCookingClass && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e8c36a] mt-0.5 shrink-0" />
                    <span>Village elder culinary masterclass for {travelers} travelers</span>
                  </li>
                )}
                {includeHelicopter && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e8c36a] mt-0.5 shrink-0" />
                    <span>Private scenic helicopter jump over Sigiriya / Lion Rock</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Guarantees */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <ShieldCheck className="w-4 h-4 text-[#c59b27]" />
                House Guarantee &amp; Zero Hidden Fees
              </div>
              <p>
                No credit card charged online. We verify hotel chamber availability before issuing your official itinerary voucher.
              </p>
            </div>

            {/* Call to Action: Lock in Inquiry */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/contact?packageId=${encodeURIComponent(
                  currentCircuit.id
                )}&paxCount=${travelers}&notes=${encodeURIComponent(
                  `Custom Inquiry: ${durationDays} days for ${travelers} guests. Lodge: ${currentLodge.name}. Vehicle: ${currentFleet.name}. Estimated budget: ${formatPrice(calculation.grandTotal)}.`
                )}`}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#c59b27] hover:bg-[#d8ab2e] text-[#1a1410] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
              >
                <span>Request Itinerary With This Build</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center">
                <Link
                  href={`https://wa.me/94771234567?text=${encodeURIComponent(
                    `Hello Aether Trails Concierge, I would like to inquire about the ${currentCircuit.name} for ${travelers} guests over ${durationDays} days (Lodge: ${currentLodge.name}, Vehicle: ${currentFleet.name}). Estimated budget: ${formatPrice(calculation.grandTotal)}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-white/60 hover:text-white inline-flex items-center gap-1 transition"
                >
                  <Send className="w-3 h-3 text-emerald-400" />
                  Or send directly via WhatsApp (+94 77 123 4567)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
