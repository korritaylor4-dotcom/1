import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../utils/auth';
import { getArticles, getBreeds } from '../../utils/api';
import { PawPrint, FileText, Dog, LogOut, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ articles: 0, breeds: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      const [articles, breeds] = await Promise.all([
        getArticles(),
        getBreeds()
      ]);

      setStats({
        articles: articles.length,
        breeds: breeds.length
      });
    } catch (error) {
      console.error('Error loading data:', error);
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
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
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  PetsLib Admin
                </h1>
                <p className="text-sm text-gray-600">{user?.full_name}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-amber-200 hover:bg-amber-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Manage your articles and breed information</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <FileText className="w-8 h-8 text-amber-600" />
              </div>
              <span className="text-4xl font-bold text-gray-900">{stats.articles}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Articles</h3>
            <p className="text-gray-600 mb-4">Pet care guides and tips</p>
            <div className="flex gap-3">
              <Link to="/admin/articles">
                <Button className="bg-amber-500 hover:bg-amber-600">
                  Manage Articles
                </Button>
              </Link>
              <Link to="/admin/articles/new">
                <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                  <Plus className="w-4 h-4 mr-2" />
                  New Article
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Dog className="w-8 h-8 text-orange-600" />
              </div>
              <span className="text-4xl font-bold text-gray-900">{stats.breeds}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Breeds</h3>
            <p className="text-gray-600 mb-4">Dog and cat breed profiles</p>
            <div className="flex gap-3">
              <Link to="/admin/breeds">
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Manage Breeds
                </Button>
              </Link>
              <Link to="/admin/breeds/new">
                <Button variant="outline" className="border-orange-200 hover:bg-orange-50">
                  <Plus className="w-4 h-4 mr-2" />
                  New Breed
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/">
              <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-50">
                View Public Site
              </Button>
            </Link>
            <Link to="/admin/articles/new">
              <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-50">
                Create New Article
              </Button>
            </Link>
            <Link to="/admin/breeds/new">
              <Button variant="outline" className="w-full border-amber-200 hover:bg-amber-50">
                Add New Breed
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
