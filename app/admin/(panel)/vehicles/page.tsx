import FleetManager from "@/components/admin/FleetManager";

export default function AdminVehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-foreground">Fleet & Chauffeur Services</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Maintain vehicle assets, passenger capacities, daily charter rates, and active operational status.
        </p>
      </div>

      <FleetManager />
    </div>
  );
}
