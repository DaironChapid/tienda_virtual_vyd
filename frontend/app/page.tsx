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
  const [mostrarCarrusel, setMostrarCarrusel] = useState(true);
  const [textosConfig, setTextosConfig] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState<Record<string, string>>({});
  const { usuario, abrirLogin } = useAuth();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAgregarCarrito = (p: any) => {
    if (!usuario) {
      abrirLogin();
      return;
    }

    const tallas = p.tallas ? p.tallas.split(',').filter(Boolean) : [];
    if (tallas.length > 0 && !tallasSeleccionadas[p.id]) {
      showToast("Por favor selecciona una talla antes de añadir al carrito.", "error");
      return;
    }

    const tallaSeleccionada = tallas.length > 0 ? tallasSeleccionadas[p.id] : "Talla Única";

    const numeroWhatsApp = "573202937619";
    const mensaje = 
      `¡Hola! 👋 Me interesa comprar una blusa de VYD Boutique 🌸\n\n` +
      `👗 *Producto:* ${p.nombre} (Talla: ${tallaSeleccionada})\n` +
      `💰 *Precio:* ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p.precio)}\n\n` +
      `👤 *Mi nombre:* ${usuario!.nombre}\n` +
      `✉️ *Mi correo:* ${usuario!.email}\n\n` +
      `¿Está disponible? ¡Me encantaría comprarlo! 💕`;

      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
  };

  const [heroImages, setHeroImages] = useState<string[]>([
    "/images/hero_alt_1.png",
    "/images/hero_alt_2.png",
    "/images/hero_alt_3.png",
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    // Fetch Hero Images
    fetch("http://localhost:3001/hero-images")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setHeroImages(data.map((img: any) => img.url));
        }
      })
      .catch(console.error);

    // Fetch config
    fetch("http://localhost:3001/configuracion")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setMostrarCarrusel(data.mostrar_carrusel === 'true');
          setTextosConfig(data);
        }
      })
      .catch(console.error);

    // Fetch Products
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
    <div className="flex flex-col gap-16 pb-20 relative">

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {toast.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* HERO DYNAMIC RENDERING */}
      {mostrarCarrusel ? (
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
                quality={100}
                sizes="100vw"
                unoptimized
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
                  index === currentSlide ? "bg-brand-neutral-600 scale-125" : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`Ir a la diapositiva ${index + 1}`}
              />
            ))}
          </div>

          {/* Degradado oscuro sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-xl space-y-6 text-white">
                <span className="inline-block px-4 py-1 bg-brand-neutral-600 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  {textosConfig.carrusel_etiqueta || "Nueva Temporada 2024"}
                </span>
                <h2 className="text-5xl md:text-7xl font-bold leading-tight whitespace-pre-line">
                  {textosConfig.carrusel_titulo || "Elegancia en \n cada detalle"}
                </h2>
                <p className="text-lg md:text-xl text-gray-100 font-light max-w-md">
                  {textosConfig.carrusel_descripcion || "Prendas diseñadas con la mayor dedicación y calidad para resaltar tu estilo único."}
                </p>
                <div className="flex gap-4 pt-4">
                  <Link href="#catalogo" className="bg-brand-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all transform hover:scale-105 shadow-lg">
                    Ver Colección
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative h-[500px] md:h-[650px] w-full overflow-hidden bg-gradient-to-br from-brand-neutral-50 via-white to-gray-100 flex items-center justify-center text-center">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
          <div className="relative z-10 px-6 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="inline-block px-4 py-1.5 border border-brand-neutral-200 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-brand-neutral-600 bg-white/50 backdrop-blur-sm shadow-sm">
              {textosConfig.alt_etiqueta || "Colección Exclusiva"}
            </span>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 whitespace-pre-line" style={{ fontFamily: 'Georgia, serif' }}>
              {textosConfig.alt_titulo || "La belleza de lo sutil"}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-light max-w-lg mx-auto leading-relaxed">
              {textosConfig.alt_descripcion || "Descubre nuestra nueva línea de prendas diseñadas para resaltar tu estilo natural con la mayor elegancia y comodidad."}
            </p>
            <div className="pt-6">
              <Link href="#catalogo" className="inline-block bg-brand-neutral-900 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-brand-neutral-200">
                Explorar Catálogo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CATALOG SECTION */}
      <section id="catalogo" className="container mx-auto px-6 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Nuestras Blusas</h3>
            <p className="text-gray-500 mt-2">Encuentra la prenda perfecta para cada ocasión.</p>
            <div className="h-1.5 w-20 bg-brand-neutral-500 mt-4 rounded-full"></div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {["Todas", "Seda", "Casual", "Fiesta", "Básicas"].map((cat) => (
              <button
                key={cat}
                className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-medium hover:border-brand-neutral-500 hover:text-brand-neutral-600 hover:bg-brand-neutral-50 transition-all whitespace-nowrap bg-white"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-brand-neutral-200 border-t-brand-neutral-600 rounded-full animate-spin" />
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
                    <span className="bg-brand-neutral-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                      Nuevo
                    </span>
                  </div>

                  <Image
                    src={p.imagen || "/images/hero.png"}
                    alt={p.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    quality={90}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* QUICK ADD OVERLAY */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => handleAgregarCarrito(p)}
                      disabled={p.stock === 0}
                      className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${p.stock > 0
                        ? "bg-white/95 text-gray-900 hover:bg-brand-neutral-600 hover:text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      {p.stock > 0 ? "Añadir al carrito" : "No disponible"}
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-lg font-bold text-gray-800 group-hover:text-brand-neutral-700 transition-colors line-clamp-1">
                      {p.nombre}
                    </h4>
                    <button className="text-gray-400 hover:text-brand-neutral-500 transition-colors shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-brand-neutral-700">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p.precio)}
                    </span>
                  </div>

                  {/* Size Selection */}
                  {p.tallas && p.tallas.split(',').filter(Boolean).length > 0 ? (
                    <div className="flex gap-2 mt-2">
                      {p.tallas.split(',').filter(Boolean).map((t: string) => (
                        <button
                          key={t}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTallasSeleccionadas({ ...tallasSeleccionadas, [p.id]: t });
                          }}
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-colors border flex items-center justify-center ${
                            tallasSeleccionadas[p.id] === t
                              ? "bg-brand-neutral-600 text-white border-brand-neutral-600 shadow-md"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-neutral-400"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs font-medium text-gray-500 italic">
                      Talla Única
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${p.stock > 0 ? "text-green-600" : "text-red-400"}`}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : "Sin Existencias"}
                    </span>
                    <div className="flex gap-1 text-brand-neutral-400">
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
        <div className="bg-brand-neutral-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-brand-neutral-100">
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <span className="text-brand-neutral-600 font-bold tracking-widest text-xs uppercase">Newsletter</span>
            <h3 className="text-3xl md:text-5xl font-bold text-gray-900">¡Únete a nuestra boutique!</h3>
            <p className="text-gray-600 text-lg">
              Recibe un 15% de descuento en tu primera compra y sé la primera en conocer nuestras nuevas colecciones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <input
                type="email"
                placeholder="Tu email aquí..."
                className="bg-white border border-brand-neutral-200 px-8 py-5 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-neutral-400 w-full sm:w-96 shadow-sm"
              />
              <button className="bg-brand-neutral-600 text-white px-10 py-5 rounded-full font-bold hover:bg-brand-neutral-700 transition-all shadow-lg hover:shadow-brand-neutral-200">
                Suscribirme
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
