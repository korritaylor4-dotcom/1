import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSEOSettings, updateSEOSettings } from '../../utils/api';
import { PawPrint, ArrowLeft, Save, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

const SEOSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSEOSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await updateSEOSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-xl">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                SEO Settings
              </h1>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/dashboard">
                <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Settings saved successfully!
          </div>
        )}

        <div className="space-y-8">
          {/* Home Page */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Home Page</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="home_title">Title</Label>
                <Input
                  id="home_title"
                  value={settings.home_title}
                  onChange={(e) => handleChange('home_title', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="home_description">Description</Label>
                <Textarea
                  id="home_description"
                  value={settings.home_description}
                  onChange={(e) => handleChange('home_description', e.target.value)}
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {/* Default Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Default Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="default_author">Default Author Name</Label>
                <Input
                  id="default_author"
                  value={settings.default_author || ''}
                  onChange={(e) => handleChange('default_author', e.target.value)}
                  placeholder="PetsLib Editorial Team"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">This name will be used as the default author for new articles</p>
              </div>
            </div>
          </div>

          {/* Category Pages */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Pages</h2>
            <div className="space-y-6">
              {['nutrition', 'training', 'health', 'care'].map((category) => (
                <div key={category} className="border-b border-gray-200 pb-6 last:border-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{category}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`${category}_title`}>Title</Label>
                      <Input
                        id={`${category}_title`}
                        value={settings[`${category}_title`]}
                        onChange={(e) => handleChange(`${category}_title`, e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${category}_description`}>Description</Label>
                      <Textarea
                        id={`${category}_description`}
                        value={settings[`${category}_description`]}
                        onChange={(e) => handleChange(`${category}_description`, e.target.value)}
                        rows={2}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meta Tag Templates</h2>
            <div className="space-y-6">
              {/* Pagination Template */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pagination Pages</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pagination_title_template">Title Template</Label>
                    <Input
                      id="pagination_title_template"
                      value={settings.pagination_title_template}
                      onChange={(e) => handleChange('pagination_title_template', e.target.value)}
                      placeholder="{page_title} - Page {page_number} | PetsLib"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{page_title}'} and {'{page_number}'} as placeholders</p>
                  </div>
                  <div>
                    <Label htmlFor="pagination_description_template">Description Template</Label>
                    <Textarea
                      id="pagination_description_template"
                      value={settings.pagination_description_template}
                      onChange={(e) => handleChange('pagination_description_template', e.target.value)}
                      rows={2}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{page_description}'} and {'{page_number}'} as placeholders</p>
                  </div>
                </div>
              </div>

              {/* Article Template */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Pages</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="article_title_template">Title Template</Label>
                    <Input
                      id="article_title_template"
                      value={settings.article_title_template}
                      onChange={(e) => handleChange('article_title_template', e.target.value)}
                      placeholder="{article_title} | PetsLib"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{article_title}'} as placeholder</p>
                  </div>
                  <div>
                    <Label htmlFor="article_description_template">Description Template</Label>
                    <Input
                      id="article_description_template"
                      value={settings.article_description_template}
                      onChange={(e) => handleChange('article_description_template', e.target.value)}
                      placeholder="{article_excerpt}"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{article_excerpt}'} as placeholder</p>
                  </div>
                </div>
              </div>

              {/* Breed Template */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Breed Pages</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="breed_title_template">Title Template</Label>
                    <Input
                      id="breed_title_template"
                      value={settings.breed_title_template}
                      onChange={(e) => handleChange('breed_title_template', e.target.value)}
                      placeholder="{breed_name} - Breed Information | PetsLib"
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{breed_name}'} as placeholder</p>
                  </div>
                  <div>
                    <Label htmlFor="breed_description_template">Description Template</Label>
                    <Textarea
                      id="breed_description_template"
                      value={settings.breed_description_template}
                      onChange={(e) => handleChange('breed_description_template', e.target.value)}
                      rows={2}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{breed_name}'} as placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button (bottom) */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SEOSettings;
