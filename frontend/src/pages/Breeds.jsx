import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getBreeds } from '../utils/api';
import { Search, Filter } from 'lucide-react';
import Pagination from '../components/Pagination';
import SEOHead from '../components/SEOHead';

const Breeds = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState(searchParams.get('species') || 'all');
  const [selectedLetter, setSelectedLetter] = useState(searchParams.get('letter') || 'all');
  const [allBreeds, setAllBreeds] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadBreeds();
  }, [selectedSpecies, selectedLetter, searchTerm, currentPage]);

  const loadBreeds = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (selectedSpecies !== 'all') filters.species = selectedSpecies;
      if (selectedLetter !== 'all') filters.letter = selectedLetter;
      if (searchTerm) filters.search = searchTerm;
      
      const data = await getBreeds(filters, currentPage, 12);
      setAllBreeds(data.breeds || data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading breeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type, value) => {
    const newParams = {
      species: selectedSpecies,
      letter: selectedLetter,
      page: '1'
    };
    
    if (type === 'species') {
      newParams.species = value;
      newParams.letter = 'all'; // Reset letter when species changes
      setSelectedSpecies(value);
      setSelectedLetter('all');
    } else if (type === 'letter') {
      newParams.letter = value;
      setSelectedLetter(value);
    }
    
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    setSearchParams({
      species: selectedSpecies,
      letter: selectedLetter,
      page: page.toString()
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate alphabet array
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Get available first letters from breeds
  const availableLetters = useMemo(() => {
    const letters = new Set(
      allBreeds
        .filter(breed => selectedSpecies === 'all' || breed.species === selectedSpecies)
        .map(breed => breed.name.charAt(0).toUpperCase())
    );
    return Array.from(letters).sort();
  }, [selectedSpecies]);

  const filteredBreeds = allBreeds;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-orange-50">
      <SEOHead
        title={currentPage > 1 ? `Dog and Cat Breeds Directory - Page ${currentPage} | PetsLib` : 'Dog and Cat Breeds Directory | PetsLib'}
        description="Explore comprehensive information about dog and cat breeds with detailed profiles, care requirements, and temperament guides."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Breed Directory</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore comprehensive information about dog and cat breeds
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by breed name or temperament..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-amber-100 rounded-xl focus:border-amber-400 focus:outline-none transition-colors duration-200 text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Species Filter */}
          <div className="flex items-center gap-3 mb-6">
            <Filter className="text-gray-600 w-5 h-5" />
            <div className="flex gap-3">
              <button
                onClick={() => handleFilterChange('species', 'all')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedSpecies === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('species', 'dog')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedSpecies === 'dog'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                Dogs
              </button>
              <button
                onClick={() => handleFilterChange('species', 'cat')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedSpecies === 'cat'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                Cats
              </button>
            </div>
          </div>

          {/* Alphabetical Index */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Browse by Letter:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLetter('all')}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                  selectedLetter === 'all'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-600'
                }`}
              >
                All
              </button>
              {alphabet.map((letter) => {
                const isAvailable = availableLetters.includes(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => isAvailable && setSelectedLetter(letter)}
                    disabled={!isAvailable}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                      selectedLetter === letter
                        ? 'bg-amber-500 text-white shadow-md'
                        : isAvailable
                        ? 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-600'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredBreeds.length}</span> breed{filteredBreeds.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Breeds Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading breeds...</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBreeds.map((breed) => (
            <Link
              key={breed.id}
              to={`/breeds/${breed.id}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-amber-100 group"
            >
              {/* Breed Image Placeholder */}
              <div className={`h-64 bg-gradient-to-br ${
                breed.species === 'dog'
                  ? 'from-amber-200 via-orange-200 to-amber-300'
                  : 'from-orange-200 via-amber-200 to-orange-300'
              } relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
              </div>

              {/* Breed Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                    {breed.name}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    breed.species === 'dog'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {breed.species === 'dog' ? 'Dog' : 'Cat'}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {breed.size} • {breed.weight} • {breed.lifespan}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {breed.temperament.slice(0, 3).map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {breed.idealFor}
                </p>
              </div>
            </Link>
          ))}
        </div>
        )}

        {/* No Results */}
        {!loading && filteredBreeds.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No breeds found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecies('all');
                setSelectedLetter('all');
              }}
              className="mt-4 px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breeds;
