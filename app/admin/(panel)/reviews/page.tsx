"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IReview } from "@/schemas/types";
import { Star, CheckCircle, EyeOff, Trash2, Filter } from "lucide-react";

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "all">("pending");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews", tab],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?filter=${tab === "all" ? "all" : "pending"}`);
      if (!res.ok) throw new Error("Failed to load reviews");
      return res.json() as Promise<IReview[]>;
    },
  });

  const moderateMut = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-reviews"] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground">Guest Story Moderation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review testimonials submitted by travelers before publishing them to the public homepage.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-black/10 shadow-xs self-start">
          <button
            onClick={() => setTab("pending")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === "pending"
                ? "bg-[#c59b27] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => setTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === "all"
                ? "bg-[#c59b27] text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Stories
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl p-12 text-center text-sm text-muted-foreground border border-black/5 animate-pulse">
          Loading guest stories…
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-black/5 space-y-2">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="font-display text-xl font-medium text-foreground">Moderation queue is clear</p>
          <p className="text-xs text-muted-foreground">All guest submissions have been evaluated.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-2xl p-5 border border-black/10 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-foreground">{r.customerName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-700 ml-1">{r.rating}.0</span>
                  </div>
                </div>

                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    r.isApproved ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {r.isApproved ? "Public" : "Pending"}
                </span>
              </div>

              <p className="text-xs text-foreground/80 leading-relaxed italic bg-muted/20 p-3 rounded-xl border border-black/5">
                &ldquo;{r.comment}&rdquo;
              </p>

              {r.packageId && (
                <p className="text-[11px] text-muted-foreground">
                  Circuit Tag: <span className="font-medium text-foreground">{r.packageId}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/5">
              <button
                onClick={() => {
                  if (confirm(`Permanently remove review by ${r.customerName}?`)) {
                    deleteMut.mutate(r._id);
                  }
                }}
                className="p-1.5 text-muted-foreground hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {r.isApproved ? (
                  <button
                    onClick={() => moderateMut.mutate({ id: r._id, isApproved: false })}
                    className="flex items-center gap-1 text-xs border border-black/10 px-3 py-1.5 rounded-full hover:bg-muted font-medium transition"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Unpublish
                  </button>
                ) : (
                  <button
                    onClick={() => moderateMut.mutate({ id: r._id, isApproved: true })}
                    className="flex items-center gap-1 text-xs bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700 font-semibold transition shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve & Feature
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
