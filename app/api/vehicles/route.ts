import { NextResponse } from "next/server";
import { getVehicles, getAllVehiclesAdmin, createVehicle } from "@/lib/data";
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
    const all = await getAllVehiclesAdmin();
    return NextResponse.json(all);
  }

  const vehicles = await getVehicles();
  return NextResponse.json(vehicles);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }
    const created = await createVehicle(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vehicle", details: String(error) }, { status: 500 });
  }
}
