"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import { fetchSensorsData } from "@/utils/api";

export default function Home() {
  const { data: session, status } = useSession();
  const [sensors, setSensors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadSensors() {
      try {
        const data = await fetchSensorsData();
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

  if (status === "loading") {
    return <p>Cargando sesión...</p>;
  }

  if (!session) {
    return <p>No estás autenticado.</p>;
  }

  return (
    <Layout>
      <div className="flex">
        <div className="w-0 sm:w-64 fixed h-full overflow-hidden bg-gray-800 text-white p-0 sm:p-4">
          <Sidebar locations={sensors.map(s => s.description)} onSelectLocation={setSelectedLocation} itemSpacing="space-y-0" />
        </div>
        <div className="flex-1 p-6 pt-16 sm:p-6 mal-0 sm:ml-64">
          <p className="mb-2">
            {selectedLocation 
              ? `📍 Mostrando sensores de: ${selectedLocation}` 
              : "🌍 Mostrando todos los sensores"}
          </p>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sensors.map(sensor => (
              <Card 
                key={sensor.id || sensor.title} 
                {...sensor} 
                showPressureAndLight={sensor.pressure !== null && sensor.light !== null} 
                layout="iconsOnly"
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
