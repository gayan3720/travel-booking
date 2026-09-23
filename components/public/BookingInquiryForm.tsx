"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, AlertCircle, Send, Sparkles } from "lucide-react";

const schema = z.object({
  customerName: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Valid phone number required"),
  travelDate: z.string().min(1, "Select a travel date"),
  paxCount: z.coerce.number().int().positive("Must be at least 1 guest"),
  message: z.string().optional(),
  packageId: z.string().optional(),
  vehicleId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BookingInquiryForm({
  packageId,
  vehicleId,
  initialPax,
  initialMessage,
  packages,
  vehicles,
}: {
  packageId?: string;
  vehicleId?: string;
  initialPax?: number;
  initialMessage?: string;
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
    defaultValues: {
      packageId: packageId || "",
      vehicleId: vehicleId || "",
      paxCount: initialPax || 2,
      message: initialMessage || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          packageId: data.packageId || packageId,
          vehicleId: data.vehicleId || vehicleId,
        }),
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
      <div className="bg-[#fcfaf7] border border-black/10 rounded-2xl p-8 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="font-display text-2xl font-medium text-foreground">
          Inquiry Logged at House Desk
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          Thank you. Our travel planners are checking room chamber holds and vehicle logistics. We will email your formal itinerary and pricing within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs uppercase tracking-widest font-semibold text-primary underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
      <div>
        <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
          Full Name *
        </label>
        <input
          {...register("customerName")}
          placeholder="e.g. Eleanor Vance"
          className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
        />
        {errors.customerName && (
          <p className="text-rose-500 text-[10px] mt-1">{errors.customerName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Email Address *
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="eleanor@example.com"
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
          />
          {errors.email && (
            <p className="text-rose-500 text-[10px] mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            WhatsApp / Phone Number *
          </label>
          <input
            {...register("phone")}
            placeholder="+44 7700 900077"
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
          />
          {errors.phone && (
            <p className="text-rose-500 text-[10px] mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Estimated Travel Date *
          </label>
          <input
            {...register("travelDate")}
            type="date"
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
          />
          {errors.travelDate && (
            <p className="text-rose-500 text-[10px] mt-1">{errors.travelDate.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Party Size (Guests) *
          </label>
          <input
            {...register("paxCount")}
            type="number"
            min={1}
            max={30}
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
          />
          {errors.paxCount && (
            <p className="text-rose-500 text-[10px] mt-1">{errors.paxCount.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Circuit Package
          </label>
          <select
            {...register("packageId")}
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
          >
            <option value="">Select a package (optional)</option>
            {packages?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
            Preferred Vehicle
          </label>
          <select
            {...register("vehicleId")}
            className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
          >
            <option value="">Select a vehicle (optional)</option>
            {vehicles?.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold text-foreground uppercase tracking-wider text-[10px] block mb-1">
          Special Notes, Dietary or Route Ideas
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Tell us if you are celebrating an anniversary, require high-speed WiFi for work, or have specific lodge preferences..."
          className="w-full bg-[#fbf9f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-primary"
        />
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Could not submit inquiry. Please verify inputs or contact us directly on WhatsApp.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl bg-[#c59b27] hover:bg-[#d9ab2d] text-[#17120e] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition active:scale-[0.99] disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{isSubmitting ? "Transmitting to Concierge Desk…" : "Send Private Travel Inquiry"}</span>
      </button>
    </form>
  );
}
