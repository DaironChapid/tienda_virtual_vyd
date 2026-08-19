"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { usuario, abrirLogin, logout, esAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-neutral-50/90 backdrop-blur-md border-b-2 border-brand-neutral-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold bg-gradient-to-r from-brand-neutral-600 to-brand-neutral-400 bg-clip-text text-transparent group-hover:from-brand-neutral-500 group-hover:to-brand-neutral-300 transition-all">
            VYD BOUTIQUE
          </span>
          <span className="text-xl">🌸</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-brand-neutral-600 transition-colors">Inicio</Link>
          <div className="relative group">
            <button className="text-sm font-medium text-gray-600 hover:text-brand-neutral-600 transition-colors flex items-center gap-1">
              Colecciones
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-brand-neutral-50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-lg overflow-hidden">
              <Link href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-brand-neutral-50 hover:text-brand-neutral-600">Blusas de Seda</Link>
              <Link href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-brand-neutral-50 hover:text-brand-neutral-600">Tops Casuales</Link>
              <Link href="#" className="block px-4 py-2 text-sm text-gray-600 hover:bg-brand-neutral-50 hover:text-brand-neutral-600">Nuevas Llegadas</Link>
            </div>
          </div>
          <Link href="/nosotros" className="text-sm font-medium text-gray-600 hover:text-brand-neutral-600 transition-colors">Nosotros</Link>
          <Link href="/contacto" className="text-sm font-medium text-gray-600 hover:text-brand-neutral-600 transition-colors">Contáctanos</Link>
        </nav>

        {/* ICONS & ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Búsqueda */}
          <button className="p-2 text-gray-600 hover:text-brand-neutral-600 transition-colors hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>

          {/* Carrito */}
          <button className="p-2 text-gray-600 hover:text-brand-neutral-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          </button>

          {/* LOGIN / USUARIO */}
          {usuario ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-brand-neutral-50 hover:bg-brand-neutral-100 border border-brand-neutral-200 px-3 py-2 rounded-full transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-neutral-500 to-brand-neutral-700 flex items-center justify-center text-white text-xs font-bold">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">{usuario.nombre}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brand-neutral-100 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-brand-neutral-50">
                    <p className="text-xs text-gray-400 font-medium">Conectada como</p>
                    <p className="text-sm font-semibold text-gray-700 truncate">{usuario.email}</p>
                  </div>
                  {esAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-brand-neutral-50 transition-colors flex items-center gap-2 border-b border-brand-neutral-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={abrirLogin}
              id="btn-iniciar-sesion"
              className="flex items-center gap-2 bg-brand-neutral-600 hover:bg-brand-neutral-700 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md shadow-brand-neutral-200 hover:shadow-brand-neutral-300 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-brand-neutral-50 p-4 space-y-4 shadow-inner">
          <Link href="/" className="block text-base font-medium text-gray-600">Inicio</Link>
          <Link href="#" className="block text-base font-medium text-gray-600">Colecciones</Link>
          <Link href="/nosotros" className="block text-base font-medium text-gray-600">Nosotros</Link>
          <Link href="/contacto" className="block text-base font-medium text-gray-600">Contáctanos</Link>
          {!usuario && (
            <button onClick={abrirLogin} className="w-full bg-brand-neutral-600 text-white py-3 rounded-full font-semibold">
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}
