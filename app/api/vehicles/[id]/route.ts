import { NextResponse } from "next/server";
import { getVehicleById, updateVehicle, deleteVehicle } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const vehicle = await getVehicleById(params.id);
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateVehicle(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update vehicle", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const success = await deleteVehicle(params.id);
  if (!success) {
    return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
