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
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.898-4.45 9.896-9.896-.002-5.45-4.452-9.898-9.898-9.898-5.445 0-9.896 4.448-9.896 9.896 0 1.924.511 3.605 1.5 5.228l-1.18 4.312 4.428-1.234zm-1.054-9.352l-.004-.004v-.002c-.004-.01-.01-.02-.016-.032l-.031-.059c-.02-.041-.044-.093-.075-.152-.062-.12-.14-.296-.23-.51-.176-.426-.41-1.066-.62-1.637-.215-.584-.423-1.111-.535-1.408-.127-.333-.243-.594-.287-.718l-.053-.131-.011-.026-.006-.013c-.112-.26-.226-.414-.34-.515-.116-.101-.24-.15-.37-.15h-.62c-.173 0-.395.032-.612.115-.224.085-.452.213-.655.372-.405.319-.824.776-1.096 1.258-.277.49-.413 1.025-.413 1.613 0 .736.257 1.596.764 2.531.503.926 1.261 1.942 2.128 2.873.872.936 1.83 1.761 2.658 2.378.825.614 1.5.992 1.905 1.21l.161.085.032.016c.394.195.83.292 1.306.292.483 0 .973-.105 1.411-.326.43-.217.78-.507 1.027-.811.239-.294.406-.615.485-.892l.024-.092c.038-.152.05-.285.035-.386-.015-.101-.06-.182-.137-.245l-.014-.012-.032-.023c-.11-.08-.284-.188-.503-.321l-.736-.452c-1.113-.679-2.091-1.282-2.316-1.41-.225-.127-.478-.175-.726-.051l-.101.055-.034.02-.014.009c-.198.121-.383.275-.544.444-.152.16-.282.327-.37.479l-.048.083c-.023.04-.047.086-.073.136-.07.135-.16.299-.304.381l-.012.007-.024.01c-.131.053-.299.04-.499-.028-.21-.072-.472-.2-.76-.367a7.712 7.712 0 01-1.632-1.328 7.391 7.391 0 01-1.258-1.528c-.144-.241-.249-.452-.303-.615l-.015-.045c-.046-.143-.042-.26.012-.352l.025-.039.058-.08c.067-.091.139-.186.208-.283.134-.188.261-.365.334-.52.073-.153.111-.301.077-.45l-.016-.065c-.032-.116-.109-.29-.228-.526z"/></svg>
                {textosConfig.contacto_whatsapp || "+57 300 000 0000"}
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
