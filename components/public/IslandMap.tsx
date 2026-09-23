"use client";

import { destinations } from "@/lib/catalog";
import Link from "next/link";

export default function IslandMap() {
  return (
    <div className="relative glass rounded-[2rem] p-6 overflow-hidden">
      <p className="uppercase tracking-[0.25em] text-[11px] text-muted-foreground mb-4">The island, as we draw it</p>
      <svg viewBox="0 0 100 110" className="w-full max-w-md mx-auto drop-shadow-2xl">
        <defs>
          <linearGradient id="isle" x1="0" x2="1">
            <stop offset="0%" stopColor="#1f4d3a" />
            <stop offset="100%" stopColor="#3d7a5a" />
          </linearGradient>
        </defs>
        <path
          d="M48 6 C62 8 70 18 72 30 C76 42 80 50 78 62 C76 76 70 88 58 98 C48 105 40 104 32 96 C22 86 20 72 22 58 C18 44 24 28 32 16 C38 8 42 6 48 6Z"
          fill="url(#isle)"
          className="opacity-90"
        />
        {destinations.map((d) => (
          <g key={d.id}>
            <circle cx={d.x} cy={d.y} r="1.8" fill="#e8c36a" className="animate-pulse" />
            <text x={d.x + 3} y={d.y + 1} fontSize="4" fill="#f6f1e8">
              {d.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 flex flex-wrap gap-2">
        {destinations.map((d) => (
          <Link
            key={d.id}
            href={`/packages?destination=${encodeURIComponent(d.name)}`}
            className="text-xs px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20"
          >
            {d.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
