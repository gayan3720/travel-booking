"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IVehicle } from "@/schemas/types";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Car,
  Users,
  DollarSign,
  Check,
  X,
  ShieldCheck,
  Fuel,
} from "lucide-react";

async function fetchAdminVehicles(): Promise<IVehicle[]> {
  const res = await fetch("/api/vehicles?admin=true");
  if (!res.ok) throw new Error("Failed to load fleet");
  return res.json();
}

async function saveVehicle(id: string | null, data: Partial<IVehicle>) {
  const url = id ? `/api/vehicles/${id}` : "/api/vehicles";
  const res = await fetch(url, {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save vehicle");
  return res.json();
}

async function deleteVehicleApi(id: string) {
  const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete vehicle");
  return res.json();
}

export default function FleetManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVehicle, setEditingVehicle] = useState<IVehicle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: fetchAdminVehicles,
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: Partial<IVehicle> }) => saveVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      setEditingVehicle(null);
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVehicleApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => saveVehicle(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return vehicles;
    const term = searchTerm.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(term) ||
        v.type.toLowerCase().includes(term) ||
        v.features.some((f) => f.toLowerCase().includes(term))
    );
  }, [vehicles, searchTerm]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-black/5 text-center text-sm text-muted-foreground animate-pulse">
        Loading fleet assets…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-black/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search fleet by model, type, feature…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-muted/20 focus:bg-white transition"
          />
        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setIsCreating(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Fleet Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((vehicle) => (
          <div
            key={vehicle._id}
            className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="relative h-44 w-full bg-muted">
                {vehicle.images?.[0] ? (
                  <Image
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No photo uploaded
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-xs ${
                      vehicle.isActive ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
                    }`}
                  >
                    {vehicle.isActive ? "Active in Fleet" : "In Maintenance"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-[11px] bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md font-medium uppercase tracking-wider">
                    {vehicle.type}
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground">{vehicle.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Comfortably seats up to {vehicle.capacity} guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-foreground">
                      ${vehicle.ratePerDay}
                    </p>
                    <p className="text-[10px] text-muted-foreground">/ day with chauffeur</p>
                  </div>
                </div>

                {/* Features list */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {vehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#f4efe4] text-[#42392e] border border-[#e5decb]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-muted/20 border-t border-black/5 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleActiveMutation.mutate({ id: vehicle._id, isActive: !vehicle.isActive })}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded-md hover:bg-white"
              >
                {vehicle.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{vehicle.isActive ? "Set Maintenance" : "Set Active"}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setEditingVehicle(vehicle);
                  }}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition px-2.5 py-1.5 rounded-lg hover:bg-primary/10"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove "${vehicle.name}" from fleet catalog?`)) {
                      deleteMutation.mutate(vehicle._id);
                    }
                  }}
                  className="p-1.5 text-muted-foreground hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                  title="Delete Vehicle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Editor Modal */}
      {(isCreating || editingVehicle) && (
        <VehicleEditorModal
          vehicle={editingVehicle}
          onClose={() => {
            setIsCreating(false);
            setEditingVehicle(null);
          }}
          onSave={(data) => {
            saveMutation.mutate({
              id: editingVehicle?._id ?? null,
              data,
            });
          }}
          isSaving={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function VehicleEditorModal({
  vehicle,
  onClose,
  onSave,
  isSaving,
}: {
  vehicle: IVehicle | null;
  onClose: () => void;
  onSave: (data: Partial<IVehicle>) => void;
  isSaving: boolean;
}) {
  const isNew = !vehicle;
  const [name, setName] = useState(vehicle?.name ?? "");
  const [type, setType] = useState(vehicle?.type ?? "van");
  const [capacity, setCapacity] = useState(vehicle?.capacity ?? 6);
  const [ratePerDay, setRatePerDay] = useState(vehicle?.ratePerDay ?? 95);
  const [imageUrl, setImageUrl] = useState(vehicle?.images?.[0] ?? "");
  const [isActive, setIsActive] = useState(vehicle?.isActive ?? true);
  const [featuresStr, setFeaturesStr] = useState(
    (vehicle?.features ?? [
      "Air conditioning",
      "Dedicated chauffeur",
      "Complimentary Wi-Fi",
      "Bottled spring water",
      "Luggage compartment",
    ]).join("\n")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      capacity: Number(capacity),
      ratePerDay: Number(ratePerDay),
      isActive,
      images: imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=80"],
      features: featuresStr.split("\n").map((f) => f.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl border border-black/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-black/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {isNew ? "Register Fleet Vehicle" : `Edit Vehicle: ${vehicle.name}`}
            </h2>
            <p className="text-xs text-muted-foreground">Manage capacity, amenities, chauffeur inclusions, and daily rates.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Model / Fleet Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ceylon Luxury Van"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Vehicle Classification</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              >
                <option value="sedan">Executive Sedan</option>
                <option value="van">Luxury Van</option>
                <option value="SUV">4x4 Safari SUV</option>
                <option value="minicoach">Mini Coach (8-14 pax)</option>
                <option value="bus">Tour Coach (15+ pax)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Max Passenger Capacity</label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Daily Rate (USD / Day)</label>
              <input
                type="number"
                min={1}
                required
                value={ratePerDay}
                onChange={(e) => setRatePerDay(Number(e.target.value))}
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Vehicle Photo URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Amenities & Inclusions (one per line)
            </label>
            <textarea
              rows={4}
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              placeholder="Air conditioning&#10;English speaking chauffeur&#10;WiFi"
              className="w-full border rounded-xl p-3 text-xs bg-muted/20 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isVehicleActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary"
            />
            <label htmlFor="isVehicleActive" className="text-xs font-medium cursor-pointer">
              Vehicle is Active and Available for Private Assignments
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-black/10 text-xs font-medium hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Saving…" : isNew ? "Register Vehicle" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
