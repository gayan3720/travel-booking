"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import WhatsAppFloatButton from "@/components/public/WhatsAppFloatButton";
import CursorGlow from "@/components/public/CursorGlow";
import { brand } from "@/lib/catalog";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isAdmin = path.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <CursorGlow />
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppFloatButton phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP || brand.whatsapp} />
    </>
  );
}
