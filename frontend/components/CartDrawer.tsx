"use client";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { usuario } = useAuth();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const numeroWhatsApp = "573202937619"; // Same as before
    let mensaje = `¡Hola! 👋 Quisiera realizar el siguiente pedido en VYD Boutique 🌸\n\n`;
    
    cartItems.forEach((item, index) => {
      mensaje += `${index + 1}. *${item.producto.nombre}*\n`;
      mensaje += `   Talla: ${item.talla} | Cantidad: ${item.cantidad}\n`;
      mensaje += `   Subtotal: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.producto.precio * item.cantidad)}\n\n`;
    });

    mensaje += `💰 *TOTAL A PAGAR: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalPrice)}*\n\n`;
    mensaje += `👤 *Mi nombre:* ${usuario?.nombre}\n`;
    mensaje += `✉️ *Mi correo:* ${usuario?.email}\n\n`;
    mensaje += `¿Me confirman disponibilidad y métodos de pago? 💕`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
    clearCart();
    setIsCartOpen(false);
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            Mi Carrito
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <p>Tu carrito está vacío</p>
              <button onClick={() => setIsCartOpen(false)} className="mt-4 px-6 py-2 bg-brand-neutral-50 text-brand-neutral-700 rounded-full font-medium hover:bg-brand-neutral-100 transition-colors">
                Seguir Comprando
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="w-20 h-24 relative rounded-xl overflow-hidden shrink-0">
                  <img src={item.producto.imagen} alt={item.producto.nombre} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.producto.nombre}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Talla: <span className="font-bold text-gray-700">{item.talla}</span></p>
                    <p className="font-bold text-brand-neutral-700 mt-1">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.producto.precio)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Total Estimado</span>
              <span className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalPrice)}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-brand-neutral-900 text-white py-4 rounded-full font-bold text-lg hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-brand-neutral-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Comprar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
