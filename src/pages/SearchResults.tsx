import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { labs } from '../data/labs';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get('q') as string;
    setSearchParams({ q });
  };

  // Simple search logic
  const results = labs.filter((lab) => {
    const matchesQuery = query
      ? lab.name.toLowerCase().includes(query.toLowerCase()) ||
        lab.aliases.some((a) => a.toLowerCase().includes(query.toLowerCase())) ||
        lab.description.toLowerCase().includes(query.toLowerCase())
      : true;
    
    const matchesCategory = categoryFilter
      ? lab.category.toLowerCase() === categoryFilter.toLowerCase()
      : true;

    return matchesQuery && matchesCategory;
  });

  const allCategories = Array.from(new Set(labs.map(l => l.category))).sort();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <form onSubmit={handleSearch} className="w-full max-w-3xl relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search lab values..."
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
            <Filter className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Filters</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                {allCategories.map((cat) => (
                  <label key={cat} className="flex items-center space-x-2 text-sm text-gray-600">
                    <input 
                      type="radio" 
                      name="category" 
                      className="text-gray-900 focus:ring-gray-900"
                      checked={categoryFilter === cat}
                      onChange={() => setSearchParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        newParams.set('category', cat);
                        return newParams;
                      })}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
                {categoryFilter && (
                  <button 
                    onClick={() => setSearchParams(prev => {
                      const newParams = new URLSearchParams(prev);
                      newParams.delete('category');
                      return newParams;
                    })}
                    className="text-xs text-blue-600 hover:underline mt-2"
                  >
                    Clear category
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1">
          <div className="mb-6 pb-2 border-b border-gray-200 flex justify-between items-end">
            <h2 className="text-xl font-serif text-gray-900">
              {results.length} {results.length === 1 ? 'Result' : 'Results'}
              {query && <span> for "{query}"</span>}
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No results found. Try adjusting your search or filters.
            </div>
          ) : (
            <div className="space-y-8">
              {results.map((lab) => (
                <div key={lab.id} className="group">
                  <div className="flex items-baseline justify-between mb-1">
                    <Link to={`/lab/${lab.id}`} className="text-xl font-medium text-blue-800 hover:underline hover:text-blue-600">
                      {lab.name}
                    </Link>
                    <span className="text-sm text-gray-500 ml-4">{lab.category}</span>
                  </div>
                  {lab.aliases.length > 0 && (
                    <div className="text-sm text-gray-500 mb-2">
                      Also known as: {lab.aliases.join(', ')}
                    </div>
                  )}
                  <p className="text-gray-700 text-sm leading-relaxed mb-2 line-clamp-2">
                    {lab.description}
                  </p>
                  <div className="text-xs text-gray-500 flex items-center space-x-4">
                    <span>Unit: {lab.unit}</span>
                    <span>•</span>
                    <span>{lab.ranges.length} reference ranges available</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
