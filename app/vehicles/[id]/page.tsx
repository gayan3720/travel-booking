import { notFound } from "next/navigation";
import Image from "next/image";
import { getVehicleById } from "@/lib/data";
import BookingInquiryForm from "@/components/public/BookingInquiryForm";

export const revalidate = 300;

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(params.id);
  if (!vehicle) notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="relative h-80 rounded-[2rem] overflow-hidden">
          <Image src={vehicle.images[0]} alt={vehicle.name} fill className="object-cover" />
        </div>
        <h1 className="font-display text-5xl">{vehicle.name}</h1>
        <p className="text-muted-foreground capitalize">
          {vehicle.type} · {vehicle.capacity} passengers · ${vehicle.ratePerDay} per day
        </p>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {vehicle.features.map((f) => (
            <li key={f} className="glass rounded-xl px-3 py-2">
              ✓ {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="glass rounded-[1.8rem] p-6 h-fit sticky top-24">
        <p className="font-medium mb-4">Reserve this vehicle</p>
        <BookingInquiryForm vehicleId={vehicle._id} />
      </div>
    </main>
  );
}
