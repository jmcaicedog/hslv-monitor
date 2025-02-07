import { FaTemperatureHigh, FaTint, FaBolt, FaCompressArrowsAlt, FaLightbulb } from "react-icons/fa";

export default function Card({ title, temperature, humidity, voltage, pressure, light, createdAt, showPressureAndLight }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex justify-around w-full">
        <div className="flex flex-col items-center">
          <FaTemperatureHigh className="text-red-500 text-2xl" />
          <p className="text-gray-600">{temperature}°C</p>
        </div>
        <div className="flex flex-col items-center">
          <FaTint className="text-blue-500 text-2xl" />
          <p className="text-gray-600">{humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <FaBolt className="text-yellow-500 text-2xl" />
          <p className="text-gray-600">{voltage}V</p>
        </div>
        {showPressureAndLight && pressure != null && (
          <div className="flex flex-col items-center">
            <FaCompressArrowsAlt className="text-purple-500 text-2xl" />
            <p className="text-gray-600">{pressure} hPa</p>
          </div>
        )}
        {showPressureAndLight && light != null && (
          <div className="flex flex-col items-center">
            <FaLightbulb className="text-yellow-300 text-2xl" />
            <p className="text-gray-600">{light} lx</p>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-sm mt-2">Última actualización: {new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}
