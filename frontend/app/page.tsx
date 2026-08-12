"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [productos, setProductos] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { usuario, abrirLogin } = useAuth();

  const handleAgregarCarrito = (p: any) => {
    if (!usuario) {
      abrirLogin();
    } else {
      const numeroWhatsApp = "573202937619";
      const mensaje = 
        `¡Hola! 👋 Me interesa comprar una blusa de VYD Boutique 🌸\n\n` +
        `👗 *Producto:* ${p.nombre}\n` +
        `💰 *Precio:* $${p.precio}\n\n` +
        `👤 *Mi nombre:* ${usuario!.nombre}\n` +
        `✉️ *Mi correo:* ${usuario!.email}\n\n` +
        `¿Está disponible? ¡Me encantaría comprarlo! 💕`;

      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
    }
  };

  const heroImages = [
    "/images/hero_alt_1.png",
    "/images/hero_alt_2.png",
    "/images/hero_alt_3.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/productos")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo conectar con el servidor.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-20">

      {/* HERO SECTION */}
      <section className="relative h-[500px] md:h-[650px] w-full overflow-hidden group">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <Image
              src={src}
              alt={`VYD Boutique Hero ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-brand-pink-600 scale-125" : "bg-white/60 hover:bg-white"
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>

        {/* Degradado oscuro sutil solo a la izquierda para texto, sin teñir toda la imagen */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-xl space-y-6 text-white">
              <span className="inline-block px-4 py-1 bg-brand-pink-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Nueva Temporada 2024
              </span>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                Elegancia en <br /> cada detalle
              </h2>
              <p className="text-lg md:text-xl text-gray-100 font-light max-w-md">
                Blusas diseñadas con la delicadeza y el romance que resaltan tu esencia.
              </p>
              <div className="flex gap-4 pt-4">
                <Link href="#catalogo" className="bg-brand-pink-600 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-pink-700 transition-all transform hover:scale-105 shadow-lg">
                  Ver Colección
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section id="catalogo" className="container mx-auto px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Nuestras Blusas</h3>
            <p className="text-gray-500 mt-2">Encuentra la prenda perfecta para cada ocasión.</p>
            <div className="h-1.5 w-20 bg-brand-pink-500 mt-4 rounded-full"></div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {["Todas", "Seda", "Casual", "Fiesta", "Básicas"].map((cat) => (
              <button
                key={cat}
                className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:border-brand-pink-500 hover:text-brand-pink-600 hover:bg-brand-pink-50 transition-all whitespace-nowrap bg-white"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-brand-pink-200 border-t-brand-pink-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-500 font-semibold">{error}</div>
        ) : productos.length === 0 ? (
          <div className="text-center py-24 text-gray-400 font-medium">No hay productos disponibles aún.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {productos.map((p: any) => (
              <div key={p.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                  {/* TAGS */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-brand-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                      Nuevo
                    </span>
                  </div>

                  <Image
                    src={p.imagen || "/images/hero.png"}
                    alt={p.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* QUICK ADD OVERLAY */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => handleAgregarCarrito(p)}
                      disabled={p.stock === 0}
                      className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${p.stock > 0
                        ? "bg-white/95 text-gray-900 hover:bg-brand-pink-600 hover:text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {p.stock > 0 ? "Añadir al carrito" : "No disponible"}
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-brand-pink-700 transition-colors line-clamp-1">
                      {p.nombre}
                    </h4>
                    <button className="text-gray-400 hover:text-brand-pink-500 transition-colors shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-brand-pink-700">
                      ${p.precio}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${p.stock > 0 ? "text-green-600" : "text-red-400"}`}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : "Sin Existencias"}
                    </span>
                    <div className="flex gap-1 text-brand-pink-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NEWSLETTER CTA */}
      <section className="container mx-auto px-6">
        <div className="bg-brand-pink-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-brand-pink-100">
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <span className="text-brand-pink-600 font-bold tracking-widest text-xs uppercase">Newsletter</span>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900">¡Únete a nuestra boutique!</h3>
            <p className="text-gray-600 text-lg">
              Recibe un 15% de descuento en tu primera compra y sé la primera en conocer nuestras nuevas colecciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <input
                type="email"
                placeholder="Tu email aquí..."
                className="bg-white border border-brand-pink-200 px-8 py-5 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-pink-400 w-full sm:w-96 shadow-sm"
              />
              <button className="bg-brand-pink-600 text-white px-10 py-5 rounded-full font-bold hover:bg-brand-pink-700 transition-all shadow-lg hover:shadow-brand-pink-200">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}