import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Susurk — Good food. Moving fast.",
  description: "Really good things from really good neighborhood kitchens. Made fresh, packed with care, and at your door in about 25 minutes.",
  applicationName: "Susurk",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
