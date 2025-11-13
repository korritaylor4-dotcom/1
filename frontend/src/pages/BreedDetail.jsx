import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBreed, getBreeds } from '../utils/api';
import { ArrowLeft, Heart, Info, Activity, Scissors, GraduationCap, Home } from 'lucide-react';

const BreedDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [breed, setBreed] = useState(null);
  const [relatedBreeds, setRelatedBreeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBreed();
  }, [id]);

  const loadBreed = async () => {
    try {
      const data = await getBreed(id);
      setBreed(data);
      
      // Load related breeds
      const all = await getBreeds({ species: data.species });
      setRelatedBreeds(all.filter(b => b.id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error loading breed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading breed...</p>
      </div>
    );
  }

  if (!breed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Breed not found</h2>
          <Link to="/breeds" className="text-amber-600 hover:text-amber-700 font-medium">
            Back to Breeds
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-amber-600 font-medium mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </button>

        {/* Breed Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Hero Image */}
            <div className={`h-96 md:h-auto bg-gradient-to-br ${
              breed.species === 'dog'
                ? 'from-amber-300 via-orange-300 to-amber-400'
                : 'from-orange-300 via-amber-300 to-orange-400'
            }`}></div>

            {/* Basic Info */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{breed.name}</h1>
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                  breed.species === 'dog'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {breed.species === 'dog' ? 'Dog' : 'Cat'}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-28">Origin:</span>
                  <span>{breed.origin}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-28">Size:</span>
                  <span>{breed.size}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-28">Weight:</span>
                  <span>{breed.weight}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold w-28">Lifespan:</span>
                  <span>{breed.lifespan}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Temperament</h3>
                <div className="flex flex-wrap gap-2">
                  {breed.temperament.map((trait, idx) => (
                    <span key={idx} className="px-4 py-2 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* History */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">History</h2>
            </div>
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: breed.history }}
            />
          </div>

          {/* Ideal For */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Ideal For</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{breed.idealFor}</p>
          </div>
        </div>

        {/* Care Requirements */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Care Requirements</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Exercise */}
            <div>
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 ml-3">Exercise</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{breed.careRequirements.exercise}</p>
            </div>

            {/* Grooming */}
            <div>
              <div className="flex items-center mb-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Scissors className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 ml-3">Grooming</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{breed.careRequirements.grooming}</p>
            </div>

            {/* Training */}
            <div>
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 ml-3">Training</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{breed.careRequirements.training}</p>
            </div>

            {/* Space */}
            <div>
              <div className="flex items-center mb-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Home className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 ml-3">Space</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{breed.careRequirements.space}</p>
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg border border-amber-100 p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Health Information</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{breed.healthInfo}</p>
        </div>

        {/* Related Breeds */}
        {relatedBreeds.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">More {breed.species === 'dog' ? 'Dog' : 'Cat'} Breeds</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBreeds.map((related) => (
                <Link
                  key={related.id}
                  to={`/breeds/${related.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
                >
                  <div className={`h-48 bg-gradient-to-br ${
                    related.species === 'dog'
                      ? 'from-amber-200 to-orange-200'
                      : 'from-orange-200 to-amber-200'
                  }`}></div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{related.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{related.size} • {related.lifespan}</p>
                    <div className="flex flex-wrap gap-2">
                      {related.temperament.slice(0, 2).map((trait, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedDetail;
