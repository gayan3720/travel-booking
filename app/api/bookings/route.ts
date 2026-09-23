import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendAdminAlert, sendCustomerConfirmation } from "@/lib/notifications";
import { rateLimit } from "@/lib/rateLimit";
import { createBooking, getBookings } from "@/lib/data";

const bookingSchema = z.object({
  customerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  packageId: z.string().optional(),
  vehicleId: z.string().optional(),
  travelDate: z.coerce.date(),
  paxCount: z.coerce.number().int().positive().max(50),
  message: z.string().max(1000).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const allowed = await rateLimit(ip, { max: 8, windowSeconds: 3600 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const booking = await createBooking({
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      packageId: data.packageId || undefined,
      vehicleId: data.vehicleId || undefined,
      travelDate: data.travelDate.toISOString(),
      paxCount: data.paxCount,
      message: data.message,
    });

    Promise.allSettled([sendAdminAlert(booking), sendCustomerConfirmation(booking)]).catch((err) =>
      console.error("Notification dispatch error:", err)
    );

    return NextResponse.json({ success: true, bookingId: booking._id }, { status: 201 });
  } catch (err) {
    console.error("Booking creation failed:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
