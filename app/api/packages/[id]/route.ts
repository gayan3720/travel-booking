import { NextResponse } from "next/server";
import { getPackages } from "@/lib/data";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const packages = await getPackages();
  const pkg = packages.find((p) => p._id === params.id);
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(pkg);
}
