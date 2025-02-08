"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const SensorDetail = () => {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState([]);
  const [minMax, setMinMax] = useState({});

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://webapi.ubibot.com/channels/${id}/summary.json?account_key=${process.env.NEXT_PUBLIC_UBIBOT_KEY}`);
        const jsonData = response.data;
        
        if (!jsonData.feeds) return;
        
        // Extraer datos de los feeds solo si existen
        const formattedData = jsonData.feeds.map(feed => {
          let entry = { timestamp: feed.created_at };
          if (feed.field1) entry.temperatura = feed.field1.avg;
          if (feed.field2) entry.humedad = feed.field2.avg;
          if (feed.field3) entry.voltaje = feed.field3.avg;
          if (feed.field9) entry.presion = feed.field9.avg;
          if (feed.field6) entry.luz = feed.field6.avg;
          return entry;
        }).filter(entry => Object.keys(entry).length > 1);

        setData(formattedData);
        
        // Calcular valores mínimos y máximos solo de las variables presentes
        const minMaxValues = {};
        formattedData.forEach(entry => {
          Object.keys(entry).forEach(key => {
            if (key !== "timestamp") {
              if (!minMaxValues[key]) {
                minMaxValues[key] = { min: entry[key], max: entry[key] };
              } else {
                minMaxValues[key].min = Math.min(minMaxValues[key].min, entry[key]);
                minMaxValues[key].max = Math.max(minMaxValues[key].max, entry[key]);
              }
            }
          });
        });
        setMinMax(minMaxValues);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Detalles del Sensor {id}</h1>
      {data.length > 0 ? (
        Object.keys(minMax).map((key) => (
          <div key={key} className="my-6">
            <h2 className="text-lg font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
            <p className="text-sm">Min: {minMax[key].min} | Max: {minMax[key].max}</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="timestamp" hide />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey={key} stroke="#8884d8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default SensorDetail;
