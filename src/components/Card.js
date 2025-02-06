export default function Card({ title, temperature, humidity, voltage }) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">🌡️ Temp: {temperature}°C</p>
        <p className="text-gray-600">💧 Humedad: {humidity}%</p>
        <p className="text-gray-600">⚡ Voltaje: {voltage}V</p>
      </div>
    );
  }
  