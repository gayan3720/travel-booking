"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Review = {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
};

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error();
      return res.json() as Promise<Review[]>;
    },
  });
  const mut = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      if (!res.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pending-reviews"] }),
  });

  return (
    <div>
      <h1 className="font-display text-4xl mb-2">Review moderation</h1>
      <p className="text-sm text-muted-foreground mb-6">Approve before a story goes public.</p>
      {isLoading && <p>Loading…</p>}
      {data.length === 0 && !isLoading && <p className="text-muted-foreground">Queue is clear.</p>}
      <div className="space-y-3">
        {data.map((r) => (
          <div key={r._id} className="bg-white rounded-2xl p-4 border border-black/5">
            <div className="flex justify-between">
              <p className="font-medium">{r.customerName}</p>
              <p className="text-amber-600 text-sm">{"★".repeat(r.rating)}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => mut.mutate({ id: r._id, isApproved: true })}
                className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-full"
              >
                Approve
              </button>
              <button
                onClick={() => mut.mutate({ id: r._id, isApproved: false })}
                className="text-sm border px-3 py-1.5 rounded-full"
              >
                Keep hidden
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
