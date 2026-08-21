"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string; // unique string for product+size
  producto: any;
  talla: string;
  cantidad: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (producto: any, talla: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { usuario, abrirLogin } = useAuth();

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCartItems(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (producto: any, talla: string) => {
    if (!usuario) {
      abrirLogin();
      return;
    }
    const id = `${producto.id}-${talla}`;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        // limit stock
        if (existing.cantidad >= producto.stock) return prev;
        return prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { id, producto, talla, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.cantidad + delta;
        if (newQ > 0 && newQ <= item.producto.stock) {
          return { ...item, cantidad: newQ };
        }
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
