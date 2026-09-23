import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { createReview, getPendingReviews } from "@/lib/data";

const reviewSchema = z.object({
  customerName: z.string().min(2).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
  packageId: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pending = await getPendingReviews();
  return NextResponse.json(pending);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const allowed = await rateLimit(ip, { max: 5, windowSeconds: 3600 });
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const review = await createReview(parsed.data);
  return NextResponse.json({ success: true, id: review._id }, { status: 201 });
}
