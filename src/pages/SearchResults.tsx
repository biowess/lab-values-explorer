import { useSearchParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { Search, Filter } from 'lucide-react';
import { labs } from '../data/labs';

// Built once at module level — labs is static, Fuse index never needs to rebuild
const fuse = new Fuse(labs, {
  keys: [
    { name: 'name',              weight: 2.0 },
    { name: 'short_name',        weight: 1.8 },
    { name: 'aliases',           weight: 1.8 },
    { name: 'tags',              weight: 1.2 },
    { name: 'subcategories',     weight: 1.0 },
    { name: 'category',          weight: 1.0 },
    { name: 'description',       weight: 0.5 },
    { name: 'clinical_use',      weight: 0.4 },
  ],
  threshold: 0.35,
  includeScore: false,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

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

  const results = useMemo(() => {
    const queryMatches = query
      ? fuse.search(query).map((r) => r.item)
      : labs;

    return categoryFilter
      ? queryMatches.filter((lab) => lab.category.toLowerCase() === categoryFilter.toLowerCase())
      : queryMatches;
  }, [query, categoryFilter]);

  const allCategories = Array.from(new Set(labs.map((l) => l.category))).sort();

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
                      onChange={() => setSearchParams((prev) => {
                        const p = new URLSearchParams(prev);
                        p.set('category', cat);
                        return p;
                      })}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
                {categoryFilter && (
                  <button
                    onClick={() => setSearchParams((prev) => {
                      const p = new URLSearchParams(prev);
                      p.delete('category');
                      return p;
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
              {query && <span> for &ldquo;{query}&rdquo;</span>}
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
                      {lab.short_name && lab.short_name !== lab.name && (
                        <span className="ml-2 text-sm font-mono text-gray-400">{lab.short_name}</span>
                      )}
                    </Link>
                    <span className="text-sm text-gray-500 ml-4">{lab.category}</span>
                  </div>

                  {/* Subcategories */}
                  {lab.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {lab.subcategories.map((s) => (
                        <span key={s} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 border border-gray-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {lab.aliases.length > 0 && (
                    <div className="text-sm text-gray-500 mb-2">
                      Also known as: {lab.aliases.join(', ')}
                    </div>
                  )}

                  <p className="text-gray-700 text-sm leading-relaxed mb-2 line-clamp-2">
                    {lab.description}
                  </p>

                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Unit: <span className="font-mono">{lab.unit}</span></span>
                    <span>•</span>
                    <span>{lab.ranges.length} reference {lab.ranges.length === 1 ? 'range' : 'ranges'}</span>
                    {lab.tags.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex flex-wrap gap-1">
                          {lab.tags.slice(0, 3).map((t) => (
                            <span key={t} className="bg-gray-100 px-1.5 py-0.5 rounded-full">{t}</span>
                          ))}
                          {lab.tags.length > 3 && (
                            <span className="text-gray-400">+{lab.tags.length - 3}</span>
                          )}
                        </span>
                      </>
                    )}
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
