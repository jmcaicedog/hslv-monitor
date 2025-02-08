import { FaTemperatureHigh, FaTint, FaBolt, FaCompressArrowsAlt, FaLightbulb } from "react-icons/fa";
export default function Card({ title, temperature, humidity, voltage, pressure, light, createdAt, showPressureAndLight }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg flex flex-col items-center w-full max-w-md mx-auto">
      <p className="text-sm font-semibold mb-3 text-center">{title}</p>
      <div className="flex flex-wrap justify-center w-full gap-2">
        <div className="flex flex-col items-center">
          <FaTemperatureHigh className="text-red-500 text-xl" />
          <p className="text-sm">{temperature}°C</p>
        </div>
        <div className="flex flex-col items-center">
          <FaTint className="text-blue-500 text-xl" />
          <p className="text-sm">{humidity}%</p>
        </div>
        <div className="flex flex-col items-center">
          <FaBolt className="text-yellow-500 text-xl" />
          <p className="text-sm">{voltage}V</p>
        </div>
        {showPressureAndLight && (
          <>
            <div className="flex flex-col items-center">
              <FaCompressArrowsAlt className="text-green-500 text-xl" />
              <p className="text-sm">{pressure} hPa</p>
            </div>
            <div className="flex flex-col items-center">
              <FaLightbulb className="text-yellow-400 text-xl" />
              <p className="text-sm">{light} lx</p>
            </div>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}