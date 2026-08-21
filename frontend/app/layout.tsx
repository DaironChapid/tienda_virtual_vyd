import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import LoginModal from "@/components/LoginModal";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "VYD Boutique | Blusas Exclusivas",
  description: "La mejor selección de blusas para mujer con estilo y elegancia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} font-outfit min-h-screen bg-white text-gray-900 antialiased flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <LoginModal />
            <CartDrawer />
            <WhatsAppFloatingButton />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
