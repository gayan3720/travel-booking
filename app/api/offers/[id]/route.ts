import { NextResponse } from "next/server";
import { updateOffer, deleteOffer, getAllOffersAdmin } from "@/lib/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const offers = await getAllOffersAdmin();
  const offer = offers.find((o) => o._id === params.id);
  if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  return NextResponse.json(offer);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateOffer(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update offer", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const success = await deleteOffer(params.id);
  if (!success) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
