import { NextResponse } from "next/server";
import { getOffers } from "@/lib/data";

export async function GET() {
  const offers = await getOffers();
  return NextResponse.json(offers);
}
