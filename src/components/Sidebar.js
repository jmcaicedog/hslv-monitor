import { useState } from "react";
export default function Sidebar({ locations, onSelectLocation }) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueLocations = [...new Set(locations)];

  return (
    <>
      <button
        className={`fixed top-4 right-4 z-50 bg-gray-700 text-white px-4 py-2 rounded-md sm:hidden ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>
      <aside
        className={`fixed inset-0 bg-gray-800 text-white p-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:relative sm:w-1/4 md:w-1/5 lg:w-full sm:translate-x-0 md:translate-x-0`}
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl sm:hidden"
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold">Ubicaciones</h2>
        <ul className="mt-4 space-y-2">
          <li
            className="cursor-pointer hover:bg-gray-700 p-2 rounded font-bold"
            onClick={() => {
              onSelectLocation(null);
              setIsOpen(false);
            }}
          >
            🔄 Mostrar Todos
          </li>
          {uniqueLocations.map((location, index) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => {
                onSelectLocation(location);
                setIsOpen(false);
              }}
            >
              📍 {location}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
