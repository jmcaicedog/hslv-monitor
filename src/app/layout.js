"use client";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import InstallButton from "@/components/InstallButton";

import "../styles/globals.css";

export default function RootLayout({ children }) {
  const [orientationState, setOrientationState] = useState(null);

  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (width < 768) {
        // Teléfonos: Solo vertical
        setOrientationState(height > width ? "allowed" : "blocked");
      } else if (width >= 768 && width < 1024) {
        // Tabletas: Solo horizontal
        setOrientationState(width > height ? "allowed" : "blocked");
      } else {
        // Computadoras: Sin restricciones
        setOrientationState("allowed");
      }
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  if (orientationState === null) return null; // Evita el desajuste de hidratación

  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <style>
          {`
            @media (max-width: 767px) and (orientation: landscape),
                   (min-width: 768px) and (max-width: 1023px) and (orientation: portrait) {
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: black;
                color: white;
                font-size: 18px;
              }
              .content {
                display: none;
              }
              .rotate-warning {
                display: block;
                text-align: center;
              }
            }
            @media (min-width: 768px) and (max-width: 1023px) and (orientation: landscape),
                   (min-width: 1024px) {
              .rotate-warning {
                display: none;
              }
              .content {
                display: block;
              }
            }
          `}
        </style>
      </head>
      <body>
        <SessionProvider>
          <AuthGuard>
            <InstallButton />
            <div
              className={
                orientationState === "blocked" ? "rotate-warning" : "content"
              }
            >
              {orientationState === "blocked"
                ? "Por favor, rota tu dispositivo para continuar."
                : children}
            </div>
          </AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
