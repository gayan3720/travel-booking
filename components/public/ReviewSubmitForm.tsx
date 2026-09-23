"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10, "Please write at least a few words"),
});

type FormValues = z.infer<typeof schema>;

export default function ReviewSubmitForm({ packageId }: { packageId?: string }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { rating: 5 } });

  const field = "w-full bg-white/70 border border-black/10 rounded-xl px-3 py-2.5 text-sm";

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, packageId }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return <p className="text-sm text-primary">Thank you. Your story appears after a planner reads it.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 max-w-md">
      <input {...register("customerName")} placeholder="Your name" className={field} />
      <select {...register("rating")} className={field}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      <textarea {...register("comment")} placeholder="Tell us about the trip…" rows={4} className={field} />
      {errors.comment && <p className="text-red-600 text-xs">{errors.comment.message}</p>}
      {status === "error" && <p className="text-red-600 text-sm">Could not submit.</p>}
      <button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm disabled:opacity-50">
        Submit story
      </button>
    </form>
  );
}
