import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBreeds, deleteBreed } from '../../utils/api';
import { PawPrint, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

const BreedsList = () => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBreeds();
  }, []);

  const loadBreeds = async () => {
    try {
      const data = await getBreeds();
      setBreeds(data);
    } catch (error) {
      console.error('Error loading breeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this breed?')) {
      return;
    }

    try {
      await deleteBreed(id);
      setBreeds(breeds.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting breed:', error);
      alert('Failed to delete breed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Manage Breeds
              </h1>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/dashboard">
                <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/breeds/new">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Breed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading breeds...</p>
          </div>
        ) : breeds.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">No breeds yet</p>
            <Link to="/admin/breeds/new">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Add Your First Breed
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {breeds.map((breed) => (
              <div
                key={breed.id}
                className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-amber-200 to-orange-200"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{breed.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      breed.species === 'dog' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {breed.species === 'dog' ? 'Dog' : 'Cat'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {breed.size} • {breed.lifespan}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/admin/breeds/edit/${breed.id}`} className="flex-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-amber-200 hover:bg-amber-50"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 hover:bg-red-50 text-red-600"
                      onClick={() => handleDelete(breed.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BreedsList;
