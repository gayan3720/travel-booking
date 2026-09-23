export default function ItineraryTimeline({
  itinerary,
}: {
  itinerary: { day: number; title: string; description: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-3xl mb-6">Itinerary</h3>
      <div className="relative space-y-6 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-amber-500/80 before:to-transparent">
        {itinerary.map((item) => (
          <div key={item.day} className="flex gap-5 relative">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0 z-10 shadow-lg shadow-primary/30">
              {item.day}
            </div>
            <div className="glass rounded-2xl p-4 flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
