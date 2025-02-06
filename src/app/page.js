"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { fetchSensorsData } from "@/utils/api";

export default function Home() {
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // 🔹 Estado para la ubicación seleccionada

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

  // 🔹 Filtrar sensores por ubicación seleccionada
  const filteredSensors = selectedLocation 
    ? sensors.filter(sensor => sensor.description === selectedLocation) 
    : sensors;

  return (
    <Layout onSelectLocation={setSelectedLocation}>
      <h1 className="text-2xl font-bold mb-4">Dashboard de Sensores</h1>
      <p className="mb-2">
        {selectedLocation 
          ? `📍 Mostrando sensores de: ${selectedLocation}` 
          : "🌍 Mostrando todos los sensores"}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSensors.map(sensor => (
          <Card key={sensor.id || sensor.title} {...sensor} />
        ))}
      </div>
    </Layout>
  );
}
