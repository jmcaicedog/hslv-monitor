export default function Card({ title, temperature, humidity, voltage, pressure, light, createdAt, showPressureAndLight }) {
    return (
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">🌡️ Temp: {temperature}°C</p>
        <p className="text-gray-600">💧 Humedad: {humidity}%</p>
        <p className="text-gray-600">⚡ Voltaje: {voltage}V</p>
        
        {/* Solo mostrar si el sensor tiene presión y luz */}
        {showPressureAndLight && (
          <>
            <p className="text-gray-600">🌬️ Presión: {pressure} hPa</p>
            <p className="text-gray-600">💡 Luz: {light} lx</p>
          </>
        )}
        
        <p className="text-gray-400 text-sm">Última actualización: {new Date(createdAt).toLocaleString()}</p>
      </div>
    );
  }
  