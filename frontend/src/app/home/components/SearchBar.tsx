interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="max-w-md mx-auto relative">
      <input
        type="text"
        placeholder="O que você está procurando?"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
      />
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
    </div>
  );
}

export { SearchBar };