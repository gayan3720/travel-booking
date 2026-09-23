export default function WhatsAppFloatButton({ phoneNumber }: { phoneNumber: string }) {
  const link = `https://wa.me/${phoneNumber.replace(/\D/g, "")}`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 px-5 rounded-full bg-[#25D366] text-white flex items-center gap-2 shadow-xl shadow-emerald-700/30 hover:scale-105 transition"
      aria-label="Chat on WhatsApp"
    >
      <span className="text-lg">◎</span>
      <span className="text-sm font-medium hidden sm:inline">WhatsApp</span>
    </a>
  );
}
