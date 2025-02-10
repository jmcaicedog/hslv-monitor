"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const unitMap = {
  temperatura: '°C',
  humedad: '%',
  voltaje: 'V',
  presion: 'hPa',
  luz: 'lx',
};

const SensorDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dailyMinMax, setDailyMinMax] = useState({});
  const [sensorName, setSensorName] = useState("");
  const [timeRange, setTimeRange] = useState(24); // En horas

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://webapi.ubibot.com/channels/${id}/summary.json?account_key=${process.env.NEXT_PUBLIC_UBIBOT_KEY}`);
        const jsonData = response.data;
        
        if (!jsonData.feeds) return;
        
        if (jsonData.channel && jsonData.channel.name) {
          setSensorName(jsonData.channel.name);
        }

        const allData = jsonData.feeds.map(feed => {
          let entry = { timestamp: new Date(feed.created_at) };
          if (feed.field1) entry.temperatura = parseFloat(feed.field1.avg).toFixed(2);
          if (feed.field2) entry.humedad = parseFloat(feed.field2.avg).toFixed(2);
          if (feed.field3) entry.voltaje = parseFloat(feed.field3.avg).toFixed(2);
          if (feed.field9) entry.presion = parseFloat(feed.field9.avg).toFixed(2);
          if (feed.field6) entry.luz = parseFloat(feed.field6.avg).toFixed(2);
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
    setFilteredData(filtered.reverse());

    const dailyValues = {};
    
    filtered.forEach(entry => {
      const date = entry.timestamp.toISOString().split('T')[0];
      Object.keys(entry).forEach(key => {
        if (key !== "timestamp") {
          if (!dailyValues[key]) dailyValues[key] = {};
          if (!dailyValues[key][date]) {
            dailyValues[key][date] = { min: parseFloat(entry[key]).toFixed(2), max: parseFloat(entry[key]).toFixed(2) };
          } else {
            dailyValues[key][date].min = Math.min(dailyValues[key][date].min, parseFloat(entry[key])).toFixed(2);
            dailyValues[key][date].max = Math.max(dailyValues[key][date].max, parseFloat(entry[key])).toFixed(2);
          }
        }
      });
    });
    
    setDailyMinMax(dailyValues);
  }, [data, timeRange]);

  const handleDownloadPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const elements = document.querySelectorAll(".sensor-chart, .data-table");  // Captura todas las gráficas y tablas
    let yOffset = 10;

    for (let element of elements) {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * 190) / canvas.width;

        if (yOffset + imgHeight > 260) {
            doc.addPage();
            yOffset = 10;
        }

        doc.addImage(imgData, "PNG", 10, yOffset, 190, imgHeight);
        yOffset += imgHeight + 10;
    }

    doc.save(`sensor_${id}.pdf`);
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{sensorName || id}</h1>
        <div className="flex gap-4">
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={() => router.push('/')}> <FaTimes size={20} /> </button>
          <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" onClick={handleDownloadPDF}> <FaDownload size={20} /> </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="mr-2">Selecciona el periodo:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(Number(e.target.value))} className="border p-1 rounded">
          <option value={24}>Últimas 24 horas</option>
          <option value={72}>Últimos 3 días</option>
          <option value={168}>Última semana</option>
          <option value={720}>Último mes</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.length > 0 && Object.keys(dailyMinMax).map((key) => (
          <div key={key} className="sensor-chart bg-white shadow-md rounded-lg p-4 border border-gray-300">
            <h2 className="text-lg text-center font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)} ({unitMap[key]})</h2>
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
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(dailyMinMax).map((key) => (
          <div key={key} className="bg-white shadow-md rounded-lg p-4 border border-gray-300 data-table">
            <h2 className="text-lg text-center font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)} ({unitMap[key]})</h2>
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Fecha</th>
                  <th className="border border-gray-300 p-2">Mínimo</th>
                  <th className="border border-gray-300 p-2">Máximo</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(dailyMinMax[key]).slice(-30).map(date => (
                  <tr key={date}>
                    <td className="border text-center border-gray-300 p-2">{date}</td>
                    <td className="border text-center border-gray-300 p-2">{dailyMinMax[key][date].min} ({unitMap[key]})</td>
                    <td className="border text-center border-gray-300 p-2">{dailyMinMax[key][date].max} ({unitMap[key]})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorDetail;
