import { NextResponse } from "next/server";
import { getPackages, getAllPackagesAdmin, createPackage } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isAdmin = searchParams.get("admin") === "true";
  
  if (isAdmin) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const all = await getAllPackagesAdmin();
    return NextResponse.json(all);
  }
  
  const packages = await getPackages();
  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.destination) {
      return NextResponse.json({ error: "Title and destination are required" }, { status: 400 });
    }
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const created = await createPackage({ ...body, slug });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create package", details: String(error) }, { status: 500 });
  }
}
