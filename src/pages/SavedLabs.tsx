import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight } from 'lucide-react';
import { labs } from '../data/labs';
import { useLocalData } from '../context/LocalDataContext';

export default function SavedLabs() {
  const { savedLabIds } = useLocalData();
  const savedLabs = labs.filter((lab) => savedLabIds.includes(lab.id));

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-serif text-gray-900 tracking-tight flex items-center">
          <Bookmark className="w-8 h-8 mr-3 text-gray-900" />
          Saved Labs
        </h1>
        <p className="text-gray-600 mt-2">
          Your personal collection of frequently accessed reference values.
        </p>
      </div>

      {savedLabs.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-gray-300 bg-gray-50 rounded-lg">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No saved labs yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            You haven't saved any lab values. Browse or search for labs and click the bookmark icon to save them here for quick access.
          </p>
          <Link
            to="/search"
            className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Labs <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {savedLabs.map((lab) => (
            <div key={lab.id} className="group">
              <div className="flex items-baseline justify-between mb-1">
                <Link
                  to={`/lab/${lab.id}`}
                  className="text-xl font-medium text-blue-800 hover:underline hover:text-blue-600"
                >
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
  );
}
