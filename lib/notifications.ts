import { Resend } from "resend";

export async function sendAdminAlert(booking: {
  customerName: string;
  email: string;
  phone: string;
  travelDate: string | Date;
  paxCount: number;
  message?: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_NOTIFY_EMAIL) {
    console.info("[notify] Admin alert (dev):", booking.customerName, booking.email);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Aether Trails <bookings@aethertrails.com>",
    to: process.env.ADMIN_NOTIFY_EMAIL,
    subject: `New inquiry — ${booking.customerName}`,
    html: `
      <h2>New booking request</h2>
      <p><b>Name:</b> ${booking.customerName}</p>
      <p><b>Email:</b> ${booking.email}</p>
      <p><b>Phone:</b> ${booking.phone}</p>
      <p><b>Travel Date:</b> ${new Date(booking.travelDate).toDateString()}</p>
      <p><b>Pax:</b> ${booking.paxCount}</p>
      <p><b>Message:</b> ${booking.message ?? "-"}</p>
    `,
  });
}

export async function sendCustomerConfirmation(booking: {
  customerName: string;
  email: string;
  travelDate: string | Date;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.info("[notify] Customer confirmation (dev):", booking.email);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Aether Trails <hello@aethertrails.com>",
    to: booking.email,
    subject: "We've received your travel inquiry",
    html: `
      <h2>Thank you, ${booking.customerName}.</h2>
      <p>We've received your inquiry for ${new Date(booking.travelDate).toDateString()}.
      A planner will reply within 24 hours.</p>
    `,
  });
}
