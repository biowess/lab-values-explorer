import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const categories = [
    'Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Radiology', 'Pediatrics', 'Neonatology'
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center">
      <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4 text-center tracking-tight">
        Clinical Reference Database
      </h1>
      <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl">
        Search laboratory values, clinical indices, and reference intervals across adult, pediatric, and neonatal populations.
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-3xl relative mb-12">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lab values, clinical indices, and reference tests..."
            className="w-full pl-14 pr-6 py-5 text-lg border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm transition-shadow"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-3 px-6 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      <div className="w-full max-w-3xl">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 text-center">
          Browse by Category
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
              className="px-4 py-1.5 border border-gray-200 text-gray-600 text-sm hover:border-gray-400 hover:text-gray-900 transition-colors bg-gray-50"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
