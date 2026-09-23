"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone number required"),
  travelDate: z.string().min(1, "Select a travel date"),
  paxCount: z.coerce.number().int().positive(),
  message: z.string().optional(),
  packageId: z.string().optional(),
  vehicleId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookingInquiryForm({
  packageId,
  vehicleId,
  packages,
  vehicles,
}: {
  packageId?: string;
  vehicleId?: string;
  packages?: { _id: string; title: string }[];
  vehicles?: { _id: string; name: string }[];
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { packageId, vehicleId, paxCount: 2 },
  });

  const onSubmit = async (data: FormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, packageId: data.packageId || packageId, vehicleId: data.vehicleId || vehicleId }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="font-display text-3xl">Request received</p>
        <p className="text-sm text-muted-foreground mt-2">A planner will write within 24 hours. Check your inbox (and spam, just in case).</p>
      </div>
    );
  }

  const field = "w-full bg-white/70 border border-black/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register("customerName")} placeholder="Full name" className={field} />
      {errors.customerName && <p className="text-red-600 text-xs">{errors.customerName.message}</p>}
      <input {...register("email")} type="email" placeholder="Email" className={field} />
      {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
      <input {...register("phone")} placeholder="Phone / WhatsApp" className={field} />
      {errors.phone && <p className="text-red-600 text-xs">{errors.phone.message}</p>}
      {packages && !packageId && (
        <select {...register("packageId")} className={field}>
          <option value="">Package (optional)</option>
          {packages.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>
      )}
      {vehicles && !vehicleId && (
        <select {...register("vehicleId")} className={field}>
          <option value="">Vehicle (optional)</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>
      )}
      <div className="grid grid-cols-2 gap-2">
        <input {...register("travelDate")} type="date" className={field} />
        <input {...register("paxCount")} type="number" min={1} placeholder="Guests" className={field} />
      </div>
      <textarea {...register("message")} placeholder="Dates are flexible? Dietary notes?" rows={3} className={field} />
      {status === "error" && <p className="text-red-600 text-sm">Could not send. Try WhatsApp or email.</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-3 rounded-full font-medium disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Request this journey"}
      </button>
    </form>
  );
}
