export default function SearchBar({ value, onChange }) {
    return (
      <input
        type="text"
        placeholder="🔍 Buscar sensor..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }
  