"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginModal() {
  const { loginModalAbierto, cerrarLogin, login, register } = useAuth();
  const [modo, setModo] = useState<"login" | "register">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loginModalAbierto) {
      setTimeout(() => setVisible(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
  }, [loginModalAbierto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") cerrarLogin(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cerrarLogin]);

  if (!loginModalAbierto) return null;

  const resetForm = () => {
    setNombre(""); setEmail(""); setPassword(""); setError("");
  };

  const cambiarModo = (m: "login" | "register") => {
    setModo(m); resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (modo === "login") {
        await login(email, password);
      } else {
        await register(nombre, email, password);
      }
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => { if (e.target === e.currentTarget) cerrarLogin(); }}
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${visible ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
      >
        {/* Franja decorativa superior */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-pink-400 via-brand-pink-600 to-brand-pink-400" />

        {/* Botón cerrar */}
        <button
          onClick={cerrarLogin}
          className="absolute top-4 right-4 text-gray-400 hover:text-brand-pink-600 transition-colors p-1 rounded-full hover:bg-brand-pink-50"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="px-8 pt-8 pb-10 flex flex-col gap-6">
          {/* Logo */}
          <div className="text-center">
            <div className="text-3xl mb-1">🌸</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-pink-600 to-brand-pink-400 bg-clip-text text-transparent">
              VYD Boutique
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {modo === "login" ? "Inicia sesión en tu cuenta" : "Crea tu cuenta gratis"}
            </p>
          </div>

          {/* Tabs login / registro */}
          <div className="flex bg-brand-pink-50 rounded-2xl p-1 gap-1">
            <button
              onClick={() => cambiarModo("login")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${modo === "login" ? "bg-white text-brand-pink-600 shadow-sm" : "text-gray-500 hover:text-brand-pink-500"}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => cambiarModo("register")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${modo === "register" ? "bg-white text-brand-pink-600 shadow-sm" : "text-gray-500 hover:text-brand-pink-500"}`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {modo === "register" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300 focus:border-brand-pink-400 transition-all placeholder:text-gray-300"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300 focus:border-brand-pink-400 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300 focus:border-brand-pink-400 transition-all placeholder:text-gray-300"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3.5 bg-gradient-to-r from-brand-pink-600 to-brand-pink-500 text-white font-bold rounded-xl hover:from-brand-pink-700 hover:to-brand-pink-600 transition-all shadow-lg shadow-brand-pink-200 hover:shadow-brand-pink-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {cargando ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                modo === "login" ? "Entrar a mi cuenta" : "Crear cuenta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
