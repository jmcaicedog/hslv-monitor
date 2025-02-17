"use client";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import InstallButton from "@/components/InstallButton";

import "../styles/globals.css";

export default function RootLayout({ children }) {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof screen !== "undefined" &&
      screen.orientation
    ) {
      const updateOrientation = () => {
        setTimeout(() => {
          if (window.innerWidth < 768) {
            screen.orientation
              .lock("portrait")
              .catch((err) =>
                console.warn("No se pudo bloquear orientación", err)
              );
          } else {
            screen.orientation
              .lock("landscape")
              .catch((err) =>
                console.warn("No se pudo bloquear orientación", err)
              );
          }
        }, 100);
      };

      updateOrientation();
      window.addEventListener("resize", updateOrientation);

      return () => {
        window.removeEventListener("resize", updateOrientation);
      };
    }
  }, []);

  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <AuthGuard>
            <InstallButton />
            {children}
          </AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
