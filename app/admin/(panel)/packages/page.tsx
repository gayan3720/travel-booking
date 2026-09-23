import { getPackages } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPackagesPage() {
  const packages = await getPackages();
  return (
    <div>
      <h1 className="font-display text-4xl mb-2">Packages</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Content is served from the local catalog store. Connect MongoDB + Cloudinary to enable live CRUD uploads.
      </p>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Place</th>
              <th className="p-3">Days</th>
              <th className="p-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">{p.destination}</td>
                <td className="p-3">{p.durationDays}</td>
                <td className="p-3">{formatCurrency(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
