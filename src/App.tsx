import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Search, Settings as SettingsIcon, BookOpen, Menu } from 'lucide-react';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import LabDetail from './pages/LabDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
        <header className="border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="font-serif text-xl font-medium tracking-tight">Lab Values Explorer</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
              <Link to="/" className="hover:text-gray-900 transition-colors">Search</Link>
              <Link to="/search?q=" className="hover:text-gray-900 transition-colors">Categories</Link>
              <a href="#" className="hover:text-gray-900 transition-colors">References</a>
              <a href="#" className="hover:text-gray-900 transition-colors">About</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/settings" className="text-gray-500 hover:text-gray-900 transition-colors">
              <SettingsIcon className="w-5 h-5" />
            </Link>
            <button className="md:hidden text-gray-500 hover:text-gray-900">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/lab/:id" element={<LabDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>

        <footer className="border-t border-gray-200 py-8 px-6 md:px-12 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Lab Values Explorer. For educational use only.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Disclaimer</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

