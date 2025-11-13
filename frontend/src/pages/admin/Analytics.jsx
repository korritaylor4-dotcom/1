import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopularContent, getAnalyticsStats } from '../../utils/api';
import { PawPrint, ArrowLeft, TrendingUp, Eye, Star, FileText, Dog } from 'lucide-react';
import { Button } from '../../components/ui/button';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [popular, setPopular] = useState({ articles: [], breeds: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [statsData, popularData] = await Promise.all([
        getAnalyticsStats(),
        getPopularContent()
      ]);
      setStats(statsData);
      setPopular(popularData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
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
                Analytics Dashboard
              </h1>
            </div>
            <Link to="/admin/dashboard">
              <Button variant="outline" className="border-amber-200 hover:bg-amber-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Eye className="w-8 h-8 text-amber-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.total_article_views?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Article Views</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Eye className="w-8 h-8 text-orange-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.total_breed_views?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Breed Views</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-amber-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.total_ratings?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Total Ratings</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <Star className="w-8 h-8 text-orange-600 fill-orange-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats?.average_rating?.toFixed(1) || 0}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* Popular Content */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Popular Articles */}
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Most Viewed Articles</h2>
                </div>
                <div className="space-y-4">
                  {popular.articles.length > 0 ? (
                    popular.articles.map((article, idx) => (
                      <div key={article.page_id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{article.title || 'Unknown'}</div>
                            <div className="text-sm text-gray-600">{article.views} views</div>
                          </div>
                        </div>
                        <Link to={`/articles/${article.page_id}`} target="_blank">
                          <Button size="sm" variant="outline" className="border-amber-200 hover:bg-amber-50">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No article views yet</p>
                  )}
                </div>
              </div>

              {/* Popular Breeds */}
              <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Dog className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Most Viewed Breeds</h2>
                </div>
                <div className="space-y-4">
                  {popular.breeds.length > 0 ? (
                    popular.breeds.map((breed, idx) => (
                      <div key={breed.page_id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{breed.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-600">{breed.views} views</div>
                          </div>
                        </div>
                        <Link to={`/breeds/${breed.page_id}`} target="_blank">
                          <Button size="sm" variant="outline" className="border-orange-200 hover:bg-orange-50">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No breed views yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
