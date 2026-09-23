"use client";

import { motion } from "framer-motion";

export default function TestimonialSlider({ reviews }: { reviews: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.slice(0, 6).map((r, i) => (
        <motion.blockquote
          key={r._id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-[1.4rem] p-6"
        >
          <p className="text-amber-600 text-sm mb-3">{"★".repeat(r.rating)}</p>
          <p className="font-display text-2xl leading-snug text-foreground/90">“{r.comment}”</p>
          <p className="text-sm mt-4 text-muted-foreground">— {r.customerName}</p>
        </motion.blockquote>
      ))}
    </div>
  );
}
