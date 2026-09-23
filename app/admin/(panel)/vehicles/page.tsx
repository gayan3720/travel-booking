import { getVehicles } from "@/lib/data";

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <div>
      <h1 className="font-display text-4xl mb-6">Fleet</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <div key={v._id} className="bg-white rounded-2xl p-5 border">
            <p className="font-medium">{v.name}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {v.type} · {v.capacity} seats · ${v.ratePerDay}/day
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
