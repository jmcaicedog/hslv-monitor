export default function Card({ title, temperature, humidity, voltage, createdAt }) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">🌡️ Temp: {temperature}°C</p>
        <p className="text-gray-600">💧 Humedad: {humidity}%</p>
        <p className="text-gray-600">⚡ Voltaje: {voltage}V</p>
        <p className="text-gray-400 text-sm">Última actualización: {new Date(createdAt).toLocaleString()}</p>
      </div>
    );
  }
  
