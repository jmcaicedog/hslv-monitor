import "@/styles/globals.css"; // Importa Tailwind correctamente

export const metadata = {
  title: "HSLV - Monitor de Temperatura, humedad y presión atmosférica",
  description: "Panel de sensores de Humedad, Temperatura, Presión atmosférica y Luz ambiente",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
