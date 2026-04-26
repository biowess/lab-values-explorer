import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Settings as SettingsIcon, BookOpen, Menu, Bookmark, X } from 'lucide-react';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import LabDetail from './pages/LabDetail';
import Settings from './pages/Settings';
import SavedLabs from './pages/SavedLabs';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import References from './pages/References';
import License from './pages/License';
import { LocalDataProvider } from './context/LocalDataContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col relative">
      <ScrollToTop />
      
      <header className="border-b border-gray-200 py-4 px-6 md:px-12 flex items-center justify-between relative z-50 bg-white">
        <div className="flex items-center space-x-8">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="font-serif text-xl font-medium tracking-tight">Lab Values Explorer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">Search</Link>
            <Link to="/search?q=" className="hover:text-gray-900 transition-colors">Categories</Link>
            <Link to="/saved" className="hover:text-gray-900 transition-colors flex items-center">
              <Bookmark className="w-4 h-4 mr-1" />
              Saved
            </Link>
            <Link to="/references" className="hover:text-gray-900 transition-colors">References</Link>
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/settings" onClick={closeMobileMenu} className="text-gray-500 hover:text-gray-900 transition-colors hidden md:block">
            <SettingsIcon className="w-5 h-5" />
          </Link>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <nav className="flex flex-col px-6 py-4 space-y-4 text-base font-medium text-gray-700">
            <Link to="/" onClick={closeMobileMenu} className="hover:text-gray-900">Search</Link>
            <Link to="/search?q=" onClick={closeMobileMenu} className="hover:text-gray-900">Categories</Link>
            <Link to="/saved" onClick={closeMobileMenu} className="hover:text-gray-900 flex items-center">
              <Bookmark className="w-4 h-4 mr-2" /> Saved
            </Link>
            <Link to="/references" onClick={closeMobileMenu} className="hover:text-gray-900">References</Link>
            <Link to="/about" onClick={closeMobileMenu} className="hover:text-gray-900">About</Link>
            <Link to="/settings" onClick={closeMobileMenu} className="hover:text-gray-900 flex items-center pt-4 border-t border-gray-100">
              <SettingsIcon className="w-4 h-4 mr-2" /> Settings
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/lab/:id" element={<LabDetail />} />
          <Route path="/saved" element={<SavedLabs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/references" element={<References />} />
          <Route path="/license" element={<License />} />
        </Routes>
      </main>

      <footer className="border-t border-gray-200 py-8 px-6 md:px-12 mt-12 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Lab Values Explorer. For educational use only.</p>
          <div className="flex flex-wrap justify-center space-x-4 mt-4 md:mt-0">
            <Link to="/license" className="hover:text-gray-900 transition-colors">License</Link>
            <Link to="/disclaimer" className="hover:text-gray-900 transition-colors font-medium">Disclaimer</Link>
            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
            <Link to="/references" className="hover:text-gray-900 transition-colors">References</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LocalDataProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </LocalDataProvider>
  );
}

