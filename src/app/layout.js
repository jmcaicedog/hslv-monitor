"use client";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import "../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
