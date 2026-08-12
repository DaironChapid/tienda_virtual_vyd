"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  loginModalAbierto: boolean;
  abrirLogin: () => void;
  cerrarLogin: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  esAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loginModalAbierto, setLoginModalAbierto] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("vyd_usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
  }, []);

  const abrirLogin = () => setLoginModalAbierto(true);
  const cerrarLogin = () => setLoginModalAbierto(false);

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Correo o contraseña incorrectos.");
    }
    const data: Usuario = await res.json();
    setUsuario(data);
    localStorage.setItem("vyd_usuario", JSON.stringify(data));
    cerrarLogin();
  };

  const register = async (nombre: string, email: string, password: string) => {
    const res = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Error al registrarse.");
    }
    const data: Usuario = await res.json();
    setUsuario(data);
    localStorage.setItem("vyd_usuario", JSON.stringify(data));
    cerrarLogin();
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("vyd_usuario");
  };

  const esAdmin = usuario?.rol === "admin";

  return (
    <AuthContext.Provider value={{ usuario, loginModalAbierto, abrirLogin, cerrarLogin, login, register, logout, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
