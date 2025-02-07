"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { fetchSensorsData } from "@/utils/api";

export default function Home() {
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadSensors() {
      try {
        const data = await fetchSensorsData();
        // Redondear valores a 2 decimales
        const formattedData = data.map(sensor => ({
          ...sensor,
          temperature: sensor.temperature ? parseFloat(sensor.temperature).toFixed(2) : "N/A",
          humidity: sensor.humidity ? parseFloat(sensor.humidity).toFixed(2) : "N/A",
          voltage: sensor.voltage ? parseFloat(sensor.voltage).toFixed(2) : "N/A",
          pressure: sensor.pressure ? parseFloat(sensor.pressure).toFixed(2) : null,
          light: sensor.light ? parseFloat(sensor.light).toFixed(2) : null,
        }));
        setSensors(formattedData);
      } catch (error) {
        console.error("Error al cargar los sensores:", error);
      }
    }
    loadSensors();
  }, []);

  // Filtrar sensores por ubicación seleccionada y término de búsqueda
  const filteredSensors = sensors.filter(sensor => 
    (!selectedLocation || sensor.description === selectedLocation) &&
    (searchTerm === "" || sensor.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="flex">
        {/* Componente de menú lateral fijo sin scrollbar visible y con menor espacio entre elementos */}
        <div className="w-64 fixed h-full overflow-hidden bg-gray-800 text-white p-4">
          <Sidebar locations={sensors.map(s => s.description)} onSelectLocation={setSelectedLocation} itemSpacing="space-y-0" />
        </div>
        <div className="flex-1 p-6 ml-64">
          <h1 className="text-2xl font-bold mb-4">Dashboard de Sensores</h1>
          <p className="mb-2">
            {selectedLocation 
              ? `📍 Mostrando sensores de: ${selectedLocation}` 
              : "🌍 Mostrando todos los sensores"}
          </p>
          {/* Componente de barra de búsqueda */}
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredSensors.map(sensor => (
              <Card 
                key={sensor.id || sensor.title} 
                {...sensor} 
                showPressureAndLight={sensor.pressure !== undefined && sensor.light !== undefined} 
                layout="iconsOnly"
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
