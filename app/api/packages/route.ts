import { NextResponse } from "next/server";
import { getPackages } from "@/lib/data";

export async function GET() {
  const packages = await getPackages();
  return NextResponse.json(packages);
}
