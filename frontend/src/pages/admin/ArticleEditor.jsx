import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getArticle, createArticle, updateArticle, uploadImage } from '../../utils/api';
import { PawPrint, ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const ArticleEditor = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'nutrition',
    excerpt: '',
    content: '',
    author: '',
    readTime: '',
    image_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    try {
      const article = await getArticle(id);
      setFormData({
        title: article.title,
        category: article.category,
        excerpt: article.excerpt,
        content: article.content,
        author: article.author,
        readTime: article.readTime,
        image_url: article.image_url || ''
      });
    } catch (err) {
      setError('Failed to load article');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file, 'articles');
      setFormData({ ...formData, image_url: result.url });
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await updateArticle(id, formData);
      } else {
        await createArticle(formData);
      }
      navigate('/admin/articles');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
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
                {isEditMode ? 'Edit Article' : 'New Article'}
              </h1>
            </div>
            <Link to="/admin/articles">
              <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
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
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Article title"
                required
                className="mt-2"
              />
            </div>

            {/* Category and Read Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="care">Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="readTime">Read Time *</Label>
                <Input
                  id="readTime"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  placeholder="5 min read"
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                required
                className="mt-2"
              />
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the article"
                required
                rows={3}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Featured Image</Label>
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

            {/* Content Editor */}
            <div>
              <Label htmlFor="content">Content *</Label>
              <div className="mt-2 border border-gray-300 rounded-md overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={modules}
                  className="bg-white"
                  style={{ minHeight: '300px' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Link to="/admin/articles">
                <Button type="button" variant="outline" className="border-gray-300">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : isEditMode ? 'Update Article' : 'Create Article'}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ArticleEditor;
