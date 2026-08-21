"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import ScrollReveal from "@/components/ScrollReveal";
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Home() {
  const [productos, setProductos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todas");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(true);
  const [textosConfig, setTextosConfig] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState<Record<string, string>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [quickViewTalla, setQuickViewTalla] = useState<string>("");
  const { usuario, abrirLogin } = useAuth();
  const { addToCart } = useCart();

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAgregarCarrito = (p: any, tallaOverride?: string) => {
    const tallas = p.tallas ? p.tallas.split(',').filter(Boolean) : [];
    const talla = tallaOverride || tallasSeleccionadas[p.id] || (tallas.length === 0 ? "Talla Única" : "");

    if (tallas.length > 0 && !talla) {
      showToast("Por favor selecciona una talla antes de añadir al carrito.", "error");
      return;
    }

    addToCart(p, talla);
    showToast("¡Producto añadido al carrito! 🛒", "success");
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

    // Fetch Categorias
    fetch("http://localhost:3001/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
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

  const productosFiltrados = categoriaSeleccionada === "Todas"
    ? productos
    : productos.filter((p: any) => p.categoria?.nombre === categoriaSeleccionada);

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
            <button
              onClick={() => setCategoriaSeleccionada("Todas")}
              className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${categoriaSeleccionada === "Todas" ? "bg-brand-neutral-600 text-white border-brand-neutral-600" : "bg-white text-gray-700 border-gray-200 hover:border-brand-neutral-500 hover:text-brand-neutral-600"}`}
            >
              Todas
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.nombre)}
                className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${categoriaSeleccionada === cat.nombre ? "bg-brand-neutral-600 text-white border-brand-neutral-600" : "bg-white text-gray-700 border-gray-200 hover:border-brand-neutral-500 hover:text-brand-neutral-600"}`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-500 font-semibold">{error}</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-24 text-gray-400 font-medium">No hay productos disponibles en esta categoría.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {productosFiltrados.map((p: any, index: number) => (
              <ScrollReveal key={p.id} delay={(index % 4) * 100}>
              <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div 
                  className="relative aspect-[4/5] overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => { setQuickViewProduct(p); setQuickViewTalla(""); }}
                >
                  {/* TAGS */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {p.stock > 0 && p.stock <= 3 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm animate-pulse">
                        ¡Últimas {p.stock} unidades!
                      </span>
                    )}
                    {p.stock === 0 && (
                      <span className="bg-gray-800 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                        Agotado
                      </span>
                    )}
                    {p.stock > 3 && (
                      <span className="bg-brand-neutral-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm">
                        Nuevo
                      </span>
                    )}
                    {p.categoria && (
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-sm border border-gray-200">
                        {p.categoria.nombre}
                      </span>
                    )}
                  </div>

                  {/* Quick View icon */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
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
                      onClick={(e) => { e.stopPropagation(); handleAgregarCarrito(p); }}
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
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${p.stock > 3 ? "text-green-600" : p.stock > 0 ? "text-orange-500" : "text-red-400"}`}>
                      {p.stock > 3 ? `Stock: ${p.stock}` : p.stock > 0 ? `¡Solo quedan ${p.stock}!` : "Sin Existencias"}
                    </span>
                    <div className="flex gap-1 text-brand-neutral-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setQuickViewProduct(null)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-1/2 aspect-[4/5] md:aspect-auto md:min-h-[500px] bg-gray-50 rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden">
                <Image
                  src={quickViewProduct.imagen || "/images/hero.png"}
                  alt={quickViewProduct.nombre}
                  fill
                  className="object-cover"
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {quickViewProduct.stock > 0 && quickViewProduct.stock <= 3 && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase shadow-lg animate-pulse">
                      ¡Últimas {quickViewProduct.stock} unidades!
                    </span>
                  </div>
                )}
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 p-8 flex flex-col gap-5">
                {quickViewProduct.categoria && (
                  <span className="text-xs font-bold text-brand-neutral-600 uppercase tracking-widest">
                    {quickViewProduct.categoria.nombre}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{quickViewProduct.nombre}</h2>
                <p className="text-3xl font-bold text-brand-neutral-700">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(quickViewProduct.precio)}
                </p>

                {quickViewProduct.descripcion && (
                  <p className="text-gray-500 leading-relaxed text-sm">{quickViewProduct.descripcion}</p>
                )}

                {/* Stock */}
                <div className={`inline-flex items-center gap-2 text-sm font-bold ${quickViewProduct.stock > 3 ? "text-green-600" : quickViewProduct.stock > 0 ? "text-orange-500" : "text-red-500"}`}>
                  <span className={`w-2 h-2 rounded-full ${quickViewProduct.stock > 3 ? "bg-green-500" : quickViewProduct.stock > 0 ? "bg-orange-500 animate-pulse" : "bg-red-500"}`}></span>
                  {quickViewProduct.stock > 3 ? `${quickViewProduct.stock} unidades disponibles` : quickViewProduct.stock > 0 ? `¡Solo quedan ${quickViewProduct.stock} unidades!` : "Agotado"}
                </div>

                {/* Tallas */}
                {quickViewProduct.tallas && quickViewProduct.tallas.split(',').filter(Boolean).length > 0 ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Selecciona tu talla:</p>
                    <div className="flex gap-3">
                      {quickViewProduct.tallas.split(',').filter(Boolean).map((t: string) => (
                        <button
                          key={t}
                          onClick={() => setQuickViewTalla(t)}
                          className={`w-11 h-11 rounded-xl text-sm font-bold transition-all border-2 flex items-center justify-center ${
                            quickViewTalla === t
                              ? "bg-brand-neutral-600 text-white border-brand-neutral-600 shadow-lg scale-110"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-neutral-400"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Talla Única</p>
                )}

                {/* Add to cart */}
                <button
                  onClick={() => {
                    const tallas = quickViewProduct.tallas ? quickViewProduct.tallas.split(',').filter(Boolean) : [];
                    const talla = tallas.length > 0 ? quickViewTalla : "Talla Única";
                    if (tallas.length > 0 && !quickViewTalla) {
                      showToast("Selecciona una talla primero", "error");
                      return;
                    }
                    handleAgregarCarrito(quickViewProduct, talla);
                    setQuickViewProduct(null);
                  }}
                  disabled={quickViewProduct.stock === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 mt-4 ${
                    quickViewProduct.stock > 0
                      ? "bg-brand-neutral-900 text-white hover:bg-black shadow-xl hover:shadow-brand-neutral-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  {quickViewProduct.stock > 0 ? "Añadir al Carrito" : "No Disponible"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* NEWSLETTER CTA */}
      <ScrollReveal>
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
      </ScrollReveal>

    </div>
  );
}
