import BookingStatusBoard from "@/components/admin/BookingStatusBoard";
import InquiryCalendar from "@/components/admin/InquiryCalendar";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl">Inquiry inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">Pending → Contacted → Confirmed / Cancelled. Notes stay internal.</p>
      </div>
      <InquiryCalendar />
      <BookingStatusBoard />
    </div>
  );
}
