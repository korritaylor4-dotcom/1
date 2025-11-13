import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getBreed, createBreed, updateBreed, uploadImage } from '../../utils/api';
import { PawPrint, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const BreedEditor = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    size: '',
    weight: '',
    lifespan: '',
    temperament: [],
    origin: '',
    history: '',
    careRequirements: {
      exercise: '',
      grooming: '',
      training: '',
      space: ''
    },
    healthInfo: '',
    idealFor: '',
    image_url: ''
  });

  const [temperamentInput, setTemperamentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadBreed();
    }
  }, [id]);

  const loadBreed = async () => {
    try {
      const breed = await getBreed(id);
      setFormData(breed);
    } catch (err) {
      setError('Failed to load breed');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file, 'breeds');
      setFormData({ ...formData, image_url: result.url });
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const addTemperament = () => {
    if (temperamentInput.trim()) {
      setFormData({
        ...formData,
        temperament: [...formData.temperament, temperamentInput.trim()]
      });
      setTemperamentInput('');
    }
  };

  const removeTemperament = (index) => {
    setFormData({
      ...formData,
      temperament: formData.temperament.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await updateBreed(id, formData);
      } else {
        await createBreed(formData);
      }
      navigate('/admin/breeds');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save breed');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
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
                {isEditMode ? 'Edit Breed' : 'New Breed'}
              </h1>
            </div>
            <Link to="/admin/breeds">
              <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Breeds
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
          <div className="space-y-6">
            {/* Name and Species */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Breed name"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="species">Species *</Label>
                <Select
                  value={formData.species}
                  onValueChange={(value) => setFormData({ ...formData, species: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Size, Weight, Lifespan */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., Large"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 55-75 lbs"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="lifespan">Lifespan *</Label>
                <Input
                  id="lifespan"
                  value={formData.lifespan}
                  onChange={(e) => setFormData({ ...formData, lifespan: e.target.value })}
                  placeholder="e.g., 10-12 years"
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Origin */}
            <div>
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="Country/Region of origin"
                required
                className="mt-2"
              />
            </div>

            {/* Temperament */}
            <div>
              <Label htmlFor="temperament">Temperament</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="temperament"
                  value={temperamentInput}
                  onChange={(e) => setTemperamentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTemperament())}
                  placeholder="Add trait (e.g., Friendly)"
                  className="flex-1"
                />
                <Button type="button" onClick={addTemperament} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.temperament.map((trait, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                  >
                    {trait}
                    <button
                      type="button"
                      onClick={() => removeTemperament(index)}
                      className="hover:text-amber-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Breed Image</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="flex-1"
                />
                {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
              </div>
              {formData.image_url && (
                <div className="mt-4">
                  <img
                    src={process.env.REACT_APP_BACKEND_URL + formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-amber-200"
                  />
                </div>
              )}
            </div>

            {/* History */}
            <div>
              <Label htmlFor="history">History *</Label>
              <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.history}
                  onChange={(value) => setFormData({ ...formData, history: value })}
                  modules={modules}
                  placeholder="Write about the breed's history..."
                />
              </div>
            </div>

            {/* Care Requirements */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Requirements</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exercise">Exercise *</Label>
                  <Input
                    id="exercise"
                    value={formData.careRequirements.exercise}
                    onChange={(e) => setFormData({
                      ...formData,
                      careRequirements: { ...formData.careRequirements, exercise: e.target.value }
                    })}
                    placeholder="e.g., High - requires 1-2 hours daily"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="grooming">Grooming *</Label>
                  <Input
                    id="grooming"
                    value={formData.careRequirements.grooming}
                    onChange={(e) => setFormData({
                      ...formData,
                      careRequirements: { ...formData.careRequirements, grooming: e.target.value }
                    })}
                    placeholder="e.g., Moderate - brush 2-3 times per week"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="training">Training *</Label>
                  <Input
                    id="training"
                    value={formData.careRequirements.training}
                    onChange={(e) => setFormData({
                      ...formData,
                      careRequirements: { ...formData.careRequirements, training: e.target.value }
                    })}
                    placeholder="e.g., Easy - highly intelligent"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="space">Space *</Label>
                  <Input
                    id="space"
                    value={formData.careRequirements.space}
                    onChange={(e) => setFormData({
                      ...formData,
                      careRequirements: { ...formData.careRequirements, space: e.target.value }
                    })}
                    placeholder="e.g., Needs a yard"
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Health Info */}
            <div>
              <Label htmlFor="healthInfo">Health Information *</Label>
              <textarea
                id="healthInfo"
                value={formData.healthInfo}
                onChange={(e) => setFormData({ ...formData, healthInfo: e.target.value })}
                placeholder="Common health issues and care tips"
                required
                rows={3}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Ideal For */}
            <div>
              <Label htmlFor="idealFor">Ideal For *</Label>
              <Input
                id="idealFor"
                value={formData.idealFor}
                onChange={(e) => setFormData({ ...formData, idealFor: e.target.value })}
                placeholder="e.g., Families with children, active individuals"
                required
                className="mt-2"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Link to="/admin/breeds">
                <Button type="button" variant="outline" className="border-gray-300">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : isEditMode ? 'Update Breed' : 'Create Breed'}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default BreedEditor;
