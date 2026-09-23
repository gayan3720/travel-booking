export default function ReviewList({ reviews }: { reviews: any[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground text-sm">No public stories yet — be the first after your trip.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium">{r.customerName}</p>
            <span className="text-sm text-amber-600">{"★".repeat(r.rating)}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
