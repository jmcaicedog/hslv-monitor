export default function Sidebar({ locations, onSelectLocation }) {
    const uniqueLocations = [...new Set(locations)]; // Elimina duplicados
  
    return (
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Ubicaciones</h2>
        <ul className="mt-4 space-y-2">
          <li 
            className="cursor-pointer hover:bg-gray-700 p-2 rounded font-bold"
            onClick={() => onSelectLocation(null)}
          >
            🔄 Mostrar Todos
          </li>
          {uniqueLocations.map((location, index) => (
            <li 
              key={index} 
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => onSelectLocation(location)}
            >
              {location}
            </li>
          ))}
        </ul>
      </aside>
    );
  }
  