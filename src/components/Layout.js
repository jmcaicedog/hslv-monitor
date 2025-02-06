export default function Layout({ children }) {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold">Ubicaciones</h2>
          <ul className="mt-4 space-y-2">
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Ubicación 1</li>
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Ubicación 2</li>
            <li className="cursor-pointer hover:bg-gray-700 p-2 rounded">Ubicación 3</li>
          </ul>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          {children}
        </main>
      </div>
    );
  }
  