import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PawPrint, Menu, X, Search } from 'lucide-react';
import SearchBar from './SearchBar';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              PetsLib
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/articles"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/articles')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Articles
            </Link>
            <Link
              to="/breeds"
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive('/breeds')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Breeds
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-amber-50 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-100 bg-white">
          <nav className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive('/articles')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Articles
            </Link>
            <Link
              to="/breeds"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive('/breeds')
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
              }`}
            >
              Breeds
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
