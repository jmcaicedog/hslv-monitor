"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import { fetchSensorsData } from "@/utils/api";

export default function Home() {
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadSensors() {
      try {
        const data = await fetchSensorsData();
        setSensors(data);
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
    <Layout onSelectLocation={setSelectedLocation}>
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
          <Card key={sensor.id || sensor.title} {...sensor} />
        ))}
      </div>
    </Layout>
  );
}
