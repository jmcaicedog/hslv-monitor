"use client";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Card from "@/components/Card";
import { fetchSensorsData } from "@/utils/api";

export default function Home() {
  const [sensors, setSensors] = useState([]);

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

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard de Sensores</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sensors.map(sensor => (
          <Card key={sensor.id || sensor.title} {...sensor} /> 
        ))}
      </div>
    </Layout>
  );
}
