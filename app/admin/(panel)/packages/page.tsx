import PackageManager from "@/components/admin/PackageManager";

export default function AdminPackagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-foreground">Circuits & Travel Packages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Design private bespoke itineraries, manage pricing per traveler, and toggle circuit availability.
        </p>
      </div>

      <PackageManager />
    </div>
  );
}
