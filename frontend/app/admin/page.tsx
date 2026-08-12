"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Tab = "dashboard" | "productos" | "usuarios";

interface Product {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  imagen: string;
}

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { usuario, esAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [productos, setProductos] = useState<Product[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [productModal, setProductModal] = useState<{ isOpen: boolean; data: Partial<Product> | null }>({ isOpen: false, data: null });
  const [userModal, setUserModal] = useState<{ isOpen: boolean; data: Partial<User> | null }>({ isOpen: false, data: null });

  // Delete confirmations
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; type: "product" | "user" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProductos, resUsuarios] = await Promise.all([
        fetch("http://localhost:3001/productos"),
        fetch("http://localhost:3001/usuarios"),
      ]);
      const dataProductos = await resProductos.json();
      const dataUsuarios = await resUsuarios.json();
      setProductos(dataProductos);
      setUsuarios(dataUsuarios);
    } catch (error) {
      showToast("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (esAdmin) {
      fetchData();
    }
  }, [esAdmin]);

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      nombre: formData.get("nombre"),
      precio: Number(formData.get("precio")),
      stock: Number(formData.get("stock")),
      imagen: formData.get("imagen") || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
    };

    const isEditing = !!productModal.data?.id;
    const url = isEditing
      ? `http://localhost:3001/productos/${productModal.data.id}`
      : "http://localhost:3001/productos";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Error saving product");
      
      showToast(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito`, "success");
      setProductModal({ isOpen: false, data: null });
      fetchData();
    } catch (error) {
      showToast("Error al guardar producto", "error");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/productos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting product");
      showToast("Producto eliminado con éxito", "success");
      fetchData();
    } catch (error) {
      showToast("Error al eliminar producto", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  // User CRUD
  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      rol: formData.get("rol"),
      ...(formData.get("password") ? { password: formData.get("password") } : {})
    };

    const isEditing = !!userModal.data?.id;
    const url = isEditing
      ? `http://localhost:3001/usuarios/${userModal.data.id}`
      : "http://localhost:3001/usuarios";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Error saving user");
      
      showToast(`Usuario ${isEditing ? 'actualizado' : 'creado'} con éxito`, "success");
      setUserModal({ isOpen: false, data: null });
      fetchData();
    } catch (error) {
      showToast("Error al guardar usuario", "error");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error deleting user");
      showToast("Usuario eliminado con éxito", "success");
      fetchData();
    } catch (error) {
      showToast("Error al eliminar usuario", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (esAdmin === undefined) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-brand-pink-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!esAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-500 mb-8">No tienes permisos de administrador para ver esta página.</p>
          <Link href="/" className="inline-flex items-center justify-center w-full bg-brand-pink-600 hover:bg-brand-pink-700 text-white font-medium py-3 px-6 rounded-full transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2 fade-in duration-300 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {toast.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="font-bold text-lg flex items-center gap-2">
          <span className="text-brand-pink-500">VYD</span> BOUTIQUE
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-900 text-gray-300 flex-shrink-0 flex flex-col md:min-h-screen sticky top-0`}>
        <div className="p-6 hidden md:block">
          <Link href="/" className="font-bold text-xl flex items-center gap-2 text-white hover:text-brand-pink-400 transition-colors">
            <span className="text-brand-pink-500">VYD</span> ADMIN
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 md:py-0 space-y-2">
          <button
            onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "dashboard" ? "bg-brand-pink-600/10 text-brand-pink-400 border border-brand-pink-500/20" : "hover:bg-gray-800 hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Dashboard
          </button>
          <button
            onClick={() => { setActiveTab("productos"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "productos" ? "bg-brand-pink-600/10 text-brand-pink-400 border border-brand-pink-500/20" : "hover:bg-gray-800 hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Productos
          </button>
          <button
            onClick={() => { setActiveTab("usuarios"); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "usuarios" ? "bg-brand-pink-600/10 text-brand-pink-400 border border-brand-pink-500/20" : "hover:bg-gray-800 hover:text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Usuarios
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="mb-4 px-4">
            <p className="text-xs text-gray-500">Conectado como</p>
            <p className="text-sm font-medium text-white truncate">{usuario?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[calc(100vh-4rem)] md:min-h-full p-6 md:p-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Resumen General</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-brand-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Products Card */}
                  <div className="bg-gradient-to-br from-brand-pink-500 to-brand-pink-700 rounded-2xl p-6 text-white shadow-lg shadow-brand-pink-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-brand-pink-100 font-medium mb-1">Total Productos</p>
                        <h3 className="text-4xl font-bold">{productos.length}</h3>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Total Users Card */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-blue-100 font-medium mb-1">Total Usuarios</p>
                        <h3 className="text-4xl font-bold">{usuarios.length}</h3>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Total Stock Card */}
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-emerald-100 font-medium mb-1">Stock Total</p>
                        <h3 className="text-4xl font-bold">{productos.reduce((acc, curr) => acc + curr.stock, 0)}</h3>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PRODUCTOS TAB */}
          {activeTab === "productos" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
                <button 
                  onClick={() => setProductModal({ isOpen: true, data: null })}
                  className="bg-brand-pink-600 hover:bg-brand-pink-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm shadow-brand-pink-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  Agregar Producto
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-brand-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-2xl">ID</th>
                        <th className="px-6 py-4">Imagen</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Precio</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right rounded-tr-2xl">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {productos.map((prod) => (
                        <tr key={prod.id} className="hover:bg-brand-pink-50/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-400">{prod.id}</td>
                          <td className="px-6 py-4">
                            <img src={prod.imagen} alt={prod.nombre} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">{prod.nombre}</td>
                          <td className="px-6 py-4">${prod.precio.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prod.stock > 10 ? 'bg-green-100 text-green-800' : prod.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                              {prod.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setProductModal({ isOpen: true, data: prod })}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm({ isOpen: true, id: prod.id, type: "product" })}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {productos.length === 0 && (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No hay productos registrados.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* USUARIOS TAB */}
          {activeTab === "usuarios" && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <button 
                  onClick={() => setUserModal({ isOpen: true, data: null })}
                  className="bg-brand-pink-600 hover:bg-brand-pink-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm shadow-brand-pink-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                  Agregar Usuario
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-brand-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                      <tr>
                        <th className="px-6 py-4 rounded-tl-2xl">ID</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4 text-right rounded-tr-2xl">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {usuarios.map((user) => (
                        <tr key={user.id} className="hover:bg-brand-pink-50/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-400">{user.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{user.nombre}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                              {user.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setUserModal({ isOpen: true, data: user })}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm({ isOpen: true, id: user.id, type: "user" })}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar"
                                disabled={user.id === usuario?.id}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {usuarios.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay usuarios registrados.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* PRODUCT MODAL */}
      {productModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{productModal.data?.id ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required name="nombre" defaultValue={productModal.data?.nombre} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <input required name="precio" defaultValue={productModal.data?.precio} type="number" step="0.01" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input required name="stock" defaultValue={productModal.data?.stock} type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (opcional)</label>
                <input name="imagen" defaultValue={productModal.data?.imagen} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setProductModal({ isOpen: false, data: null })} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-pink-600 text-white rounded-xl font-medium hover:bg-brand-pink-700 transition-colors">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {userModal.isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{userModal.data?.id ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input required name="nombre" defaultValue={userModal.data?.nombre} type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required name="email" defaultValue={userModal.data?.email} type="email" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña {userModal.data?.id && <span className="text-gray-400 font-normal">(dejar en blanco para mantener)</span>}</label>
                <input required={!userModal.data?.id} name="password" type="password" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select required name="rol" defaultValue={userModal.data?.rol || 'usuario'} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink-500 outline-none transition-all bg-white">
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setUserModal({ isOpen: false, data: null })} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-pink-600 text-white rounded-xl font-medium hover:bg-brand-pink-700 transition-colors">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Estás seguro?</h3>
            <p className="text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button 
                onClick={() => deleteConfirm.type === 'product' ? handleDeleteProduct(deleteConfirm.id) : handleDeleteUser(deleteConfirm.id)} 
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
