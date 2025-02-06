import "@/styles/globals.css"; // Importa Tailwind correctamente

export const metadata = {
  title: "Dashboard",
  description: "Dashboard de sensores en Next.js",
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
