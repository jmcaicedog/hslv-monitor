"use client";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import InstallButton from "@/components/InstallButton";

import "../styles/globals.css";

export default function RootLayout({ children }) {
  const [isPortrait, setIsPortrait] = useState(null);

  useEffect(() => {
    const updateOrientation = () => {
      setIsPortrait(window.innerWidth < 768);
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  if (isPortrait === null) return null; // Evita el desajuste de hidratación

  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <style>
          {`
            @media (max-width: 767px) and (orientation: landscape) {
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
            @media (min-width: 768px) and (orientation: portrait) {
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
          `}
        </style>
      </head>
      <body>
        <SessionProvider>
          <AuthGuard>
            <InstallButton />
            <div
              className={
                isPortrait
                  ? "content"
                  : "rotate-warning flex h-screen m-auto items-center justify-center bg-black text-white text-2xl"
              }
            >
              {isPortrait ? children : "¡Rota tu dispositivo!"}
            </div>
          </AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}
