"use client";
import { useEffect, useState } from "react";
import { fetchSensorsData } from "@/utils/api";

export default function Layout({ children, onSelectLocation }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function loadLocations() {
      try {
        const data = await fetchSensorsData();
        const uniqueLocations = [...new Set(data.map(channel => channel.description))]; // 🔹 Filtra ubicaciones duplicadas
        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Error al cargar ubicaciones:", error);
      }
    }
    loadLocations();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Ubicaciones</h2>
        <ul className="mt-4 space-y-2">
          <li 
            className="cursor-pointer hover:bg-gray-700 p-2 rounded font-bold"
            onClick={() => onSelectLocation(null)} // 🔹 Restablece el filtro
          >
            🔄 Mostrar Todos
          </li>
          {locations.map((location, index) => (
            <li 
              key={index} 
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => onSelectLocation(location)} // 🔹 Filtra por ubicación seleccionada
            >
              {location}
            </li>
          ))}
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
