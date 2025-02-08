"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const unitMap = {
  temperatura: '°C',
  humedad: '%',
  voltaje: 'V',
  presion: 'hPa',
  luz: 'lx',
};

const SensorDetail = () => {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [minMax, setMinMax] = useState({});
  const [sensorName, setSensorName] = useState("");
  const [timeRange, setTimeRange] = useState(24); // En horas

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://webapi.ubibot.com/channels/${id}/summary.json?account_key=${process.env.NEXT_PUBLIC_UBIBOT_KEY}`);
        const jsonData = response.data;
        
        if (!jsonData.feeds) return;
        
        // Obtener el nombre del sensor
        if (jsonData.channel && jsonData.channel.name) {
          setSensorName(jsonData.channel.name);
        }

        // Extraer datos de los feeds solo si existen
        const allData = jsonData.feeds.map(feed => {
          let entry = { timestamp: new Date(feed.created_at) };
          if (feed.field1) entry.temperatura = feed.field1.avg;
          if (feed.field2) entry.humedad = feed.field2.avg;
          if (feed.field3) entry.voltaje = feed.field3.avg;
          if (feed.field9) entry.presion = feed.field9.avg;
          if (feed.field6) entry.luz = feed.field6.avg;
          return entry;
        }).filter(entry => Object.keys(entry).length > 1);

        setData(allData);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data.length === 0) return;
    
    const now = new Date();
    const startTime = new Date(now.getTime() - timeRange * 60 * 60 * 1000);
    
    const filtered = data.filter(entry => entry.timestamp >= startTime);
    setFilteredData(filtered);

    // Calcular valores mínimos y máximos solo de las variables presentes
    const minMaxValues = {};
    filtered.forEach(entry => {
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
    
    // Redondear valores a dos decimales
    Object.keys(minMaxValues).forEach(key => {
      minMaxValues[key].min = parseFloat(minMaxValues[key].min.toFixed(2));
      minMaxValues[key].max = parseFloat(minMaxValues[key].max.toFixed(2));
    });
    
    setMinMax(minMaxValues);
  }, [timeRange, data]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{sensorName || id}</h1>
      <div className="mb-4">
        <label className="mr-2">Selecciona el periodo:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="border p-1 rounded">
          <option value={24}>Últimas 24 horas</option>
          <option value={72}>Últimos 3 días</option>
          <option value={168}>Última semana</option>
          <option value={720}>Último mes</option>
        </select>
      </div>
      {filteredData.length > 0 ? (
        Object.keys(minMax).map((key) => (
          <div key={key} className="my-6">
            <h2 className="text-lg font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)} ({unitMap[key]})</h2>
            <p className="text-sm">Min: {minMax[key].min} {unitMap[key]} | Max: {minMax[key].max} {unitMap[key]}</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData}>
                <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleString()} />
                <YAxis />
                <Tooltip labelFormatter={(time) => new Date(time).toLocaleString()} />
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
