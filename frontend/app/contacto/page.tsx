"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function ContactoPage() {
  const [textosConfig, setTextosConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("http://localhost:3001/configuracion")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setTextosConfig(data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-brand-neutral-50 flex flex-col">
      <main className="flex-1 container mx-auto px-6 py-24 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white rounded-[3rem] p-12 md:p-16 text-center border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-100 via-brand-neutral-200 to-gray-100"></div>
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
              {textosConfig.contacto_titulo || "Estamos aquí para ti"}
            </h1>
            <p className="text-gray-600 text-lg">
              {textosConfig.contacto_texto || "Si tienes alguna pregunta sobre nuestra colección o necesitas asesoría, no dudes en escribirnos."}
            </p>
          <div className="pt-8">
  <a 
    href={`https://wa.me/${(textosConfig.contacto_whatsapp || "+573000000000").replace(/\D/g, "")}`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 bg-[#25D366] text-white px-10 py-5 rounded-full font-bold hover:bg-[#20b958] transition-all transform hover:scale-105 shadow-xl shadow-green-100"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-8 h-8"
      fill="currentColor"
    >
      <path d="M12.04 2C6.51 2 2 6.48 2 12c0 1.77.46 3.49 1.34 5L2 22l5.15-1.31A10 10 0 0012.04 22C17.57 22 22 17.52 22 12S17.57 2 12.04 2zm0 18.17c-1.5 0-2.96-.4-4.24-1.15l-.3-.18-3.06.78.82-2.98-.2-.31A8.1 8.1 0 013.93 12c0-4.47 3.64-8.1 8.11-8.1 4.46 0 8.1 3.63 8.1 8.1 0 4.47-3.64 8.17-8.1 8.17zm4.45-6.07c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-1.42-.71-2.35-1.27-3.29-2.88-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.65.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
    </svg>

    {textosConfig.contacto_whatsapp || "+57 300 000 0000"}
  </a>
</div>
          </div>
        </div>
      </main>
    </div>
  );
}
