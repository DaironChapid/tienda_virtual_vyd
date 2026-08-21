"use client";
import { useCart } from "@/context/CartContext";

export default function WhatsAppFloatingButton() {
  const { isCartOpen } = useCart();

  if (isCartOpen) return null;

  return (
    <a
      href="https://wa.me/573202937619"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 group"
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

      {/* Button */}
      <div className="relative bg-[#25D366] hover:bg-[#20b958] text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="currentColor"
        >
          <path d="M12.04 2C6.51 2 2 6.48 2 12c0 1.77.46 3.49 1.34 5L2 22l5.15-1.31A10 10 0 0012.04 22C17.57 22 22 17.52 22 12S17.57 2 12.04 2zm0 18.17c-1.5 0-2.96-.4-4.24-1.15l-.3-.18-3.06.78.82-2.98-.2-.31A8.1 8.1 0 013.93 12c0-4.47 3.64-8.1 8.11-8.1 4.46 0 8.1 3.63 8.1 8.1 0 4.47-3.64 8.17-8.1 8.17zm4.45-6.07c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-1.42-.71-2.35-1.27-3.29-2.88-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.65.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
        </svg>
      </div>

      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-gray-100">
        ¡Escríbenos! 💬
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-white border-r border-b border-gray-100 rotate-[-45deg]" />
      </span>
    </a>
  );
}
