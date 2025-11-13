import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchContent, getSearchSuggestions } from '../utils/api';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
        loadSuggestions();
      } else {
        setResults([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const data = await searchContent(query);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      const data = await getSearchSuggestions(query);
      setSuggestions(data);
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  };

  const handleResultClick = (result) => {
    const path = result.type === 'article' 
      ? `/articles/${result.id}` 
      : `/breeds/${result.id}`;
    navigate(path);
    setQuery('');
    setShowResults(false);
    if (onClose) onClose();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles and breeds..."
          className="w-full pl-12 pr-12 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-400 focus:outline-none bg-white shadow-lg"
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setSuggestions([]);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white border-2 border-amber-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <>
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="border-b border-amber-100 p-2">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">Suggestions</div>
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-amber-50 rounded-lg text-sm text-gray-700 transition-colors duration-150"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Results */}
              {results.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 px-3 py-2">Results</div>
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-4 py-3 hover:bg-amber-50 rounded-lg transition-colors duration-150 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          result.type === 'article' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {result.type}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {result.excerpt}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
