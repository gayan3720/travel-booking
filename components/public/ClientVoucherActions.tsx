"use client";

import { useState } from "react";
import { Printer, Share2, MessageCircle, Check, PhoneCall } from "lucide-react";

export default function ClientVoucherActions({
  voucherRef,
  customerName,
  travelDate,
}: {
  voucherRef: string;
  customerName: string;
  travelDate: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aether Trails Voucher - ${customerName}`,
          text: `Your private Sri Lanka travel itinerary voucher (${voucherRef})`,
          url,
        });
        return;
      } catch {}
    }
    // Fallback to clipboard
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const conciergeWhatsApp = `https://wa.me/94771234567?text=${encodeURIComponent(
    `Hello Aether Trails Concierge, I am viewing my travel voucher (${voucherRef}) for ${customerName} commencing ${new Date(
      travelDate
    ).toLocaleDateString()}. I have an update or inquiry regarding our journey.`
  )}`;

  return (
    <div className="bg-white rounded-2xl p-4 border border-black/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <div>
        <p className="text-xs font-semibold text-foreground">
          Digital Guest Companion &amp; Travel Voucher
        </p>
        <p className="text-[11px] text-muted-foreground">
          Save this page link to your phone home screen for offline day-by-day reference while touring.
        </p>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 text-xs font-semibold hover:bg-muted transition text-foreground"
        >
          <Printer className="w-3.5 h-3.5 text-primary" />
          <span>Print / PDF</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/10 text-xs font-semibold hover:bg-muted transition text-foreground"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-primary" />}
          <span>{copied ? "Link Copied!" : "Share Link"}</span>
        </button>

        <a
          href={conciergeWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Concierge Desk</span>
        </a>
      </div>
    </div>
  );
}
