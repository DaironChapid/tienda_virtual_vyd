import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-neutral-50 border-t border-brand-neutral-100 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* BRAND */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold text-brand-neutral-700">
              VYD BOUTIQUE 🌸
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dedicados a resaltar la elegancia femenina con blusas exclusivas de la más alta calidad. Moda con amor para la mujer moderna.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Nuestra Tienda</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Inicio</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Colecciones</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Lo más vendido</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Nuevas Llegadas</Link></li>
            </ul>
          </div>

          {/* CUSTOMER SERVICE */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Ayuda</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Envíos y Devoluciones</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Guía de Tallas</Link></li>
              <li><Link href="#" className="text-sm text-gray-600 hover:text-brand-neutral-600 transition-colors">Contáctanos</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">Suscríbete para recibir ofertas exclusivas.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-white border border-brand-neutral-200 px-4 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-neutral-400"
              />
              <button className="bg-brand-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-neutral-700 transition-colors">
                Unirse
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-brand-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-medium">
            © {new Date().getFullYear()} VYD Boutique. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-500 hover:text-brand-neutral-600">Privacidad</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-brand-neutral-600">Términos</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-brand-neutral-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
