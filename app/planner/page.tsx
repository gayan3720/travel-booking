import RouteEstimator from "@/components/public/RouteEstimator";
import IslandMap from "@/components/public/IslandMap";
import { Sparkles, Shield, Clock, Award } from "lucide-react";

export const metadata = {
  title: "Trip Planner & Custom Route Estimator",
  description:
    "Tailor your private Sri Lankan itinerary in real time. Calculate instant estimates for private chauffeur tours, boutique lodges, and luxury safari expeditions.",
};

export default function PlannerPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-14 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#c59b27] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Bespoke Travel Atelier
        </span>
        <h1 className="font-display text-5xl sm:text-6xl text-foreground">
          Build Your Island Journey
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Whether you seek a quiet honeymoon in mist-laden tea estates or a wild leopard safari along the southern ocean, configure your journey with complete budget transparency.
        </p>
      </div>

      {/* Interactive Estimator Component */}
      <RouteEstimator />

      {/* Interactive Hand-Drawn Map */}
      <div className="space-y-4">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#c59b27] block">
            Regional Topography
          </span>
          <h2 className="font-display text-3xl text-foreground">
            Explore Key Waypoints
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Tap the coastal and highland waypoints to view driving times, signature lodges, and wildlife seasons.
          </p>
        </div>
        <IslandMap />
      </div>

      {/* Trust & Guarantee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-black/10">
        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-xs space-y-2">
          <Clock className="w-6 h-6 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">24-Hour Response Guarantee</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our Colombo travel directors review your customized circuit and respond with hotel room holds and verified timings within 24 hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-xs space-y-2">
          <Shield className="w-6 h-6 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">No Upfront Payment Required</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Experiment freely with the route builder. You only confirm after reviewing the final written itinerary schedule and agreeing to the terms.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-xs space-y-2">
          <Award className="w-6 h-6 text-primary" />
          <h3 className="font-display text-lg font-semibold text-foreground">Certified Chauffeur Guides</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every vehicle is piloted by a SLTDA-licensed, English-fluent chauffeur with clean driving records, cold mineral water, and onboard WiFi.
          </p>
        </div>
      </div>
    </main>
  );
}
