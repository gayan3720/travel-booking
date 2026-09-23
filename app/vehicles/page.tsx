import { getVehicles } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 300;
export const metadata = { title: "Fleet" };

export default async function VehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <main className="max-w-7xl mx-auto px-4 py-14">
      <p className="uppercase tracking-[0.28em] text-[11px] text-muted-foreground">On the road</p>
      <h1 className="font-display text-6xl mt-2">The fleet</h1>
      <p className="text-muted-foreground mt-3 max-w-xl">Chauffeurs included. Child seats on request. We never double-book a vehicle against a confirmed inquiry.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {vehicles.map((v) => (
          <Link key={v._id} href={`/vehicles/${v._id}`} className="group">
            <div className="relative h-52 rounded-[1.5rem] overflow-hidden">
              <Image src={v.images[0]} alt={v.name} fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="font-display text-2xl mt-3">{v.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {v.type} · {v.capacity} seats · from ${v.ratePerDay}/day
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
