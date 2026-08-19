"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function NosotrosPage() {
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
      <main className="flex-1 container mx-auto px-6 py-24 flex items-center">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="text-brand-neutral-500 font-bold tracking-[0.2em] text-xs uppercase">Sobre Nosotros</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            {textosConfig.nosotros_titulo || "Nuestra Esencia"}
          </h1>
          <div className="w-16 h-0.5 bg-brand-neutral-300 mx-auto"></div>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
            {textosConfig.nosotros_texto || "Somos una marca dedicada a ofrecer prendas excepcionales que fusionan el diseño contemporáneo con la más alta calidad. Cada pieza de nuestra colección está cuidadosamente seleccionada para brindar confort, elegancia y un estilo atemporal."}
          </p>
        </div>
      </main>
    </div>
  );
}
