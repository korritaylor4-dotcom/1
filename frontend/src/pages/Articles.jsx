import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getArticles } from '../utils/api';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import Pagination from '../components/Pagination';
import SEOHead from '../components/SEOHead';

const categories = ['all', 'nutrition', 'training', 'health', 'care'];

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, currentPage]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles(
        selectedCategory === 'all' ? null : selectedCategory,
        currentPage,
        12
      );
      setArticles(data.articles || data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({ category, page: '1' });
  };

  const handlePageChange = (page) => {
    setSearchParams({ 
      category: selectedCategory,
      page: page.toString() 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = articles;

  // SEO title and description
  const categoryTitles = {
    all: 'Pet Care Articles | PetsLib',
    nutrition: 'Pet Nutrition Articles | PetsLib',
    training: 'Pet Training Tips | PetsLib',
    health: 'Pet Health Information | PetsLib',
    care: 'Pet Care Guides | PetsLib'
  };

  const categoryDescriptions = {
    all: 'Browse all pet care articles with expert advice on nutrition, training, health, and care.',
    nutrition: 'Expert nutrition guides for your pets - balanced diets, feeding tips, and nutritional advice.',
    training: 'Effective training techniques and behavioral guidance for dogs and cats.',
    health: 'Comprehensive health guides, preventive care, and wellness tips for your pets.',
    care: 'Essential pet care information, grooming tips, and home environment advice.'
  };

  const title = currentPage > 1 
    ? `${categoryTitles[selectedCategory]} - Page ${currentPage}`
    : categoryTitles[selectedCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-orange-50">
      <SEOHead
        title={title}
        description={categoryDescriptions[selectedCategory]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Pet Care Articles</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert guidance on nutrition, training, health, and care for your beloved pets
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-amber-100 group"
            >
              {/* Article Image Placeholder */}
              <div className="h-56 bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full capitalize">
                    {article.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-amber-600 transition-colors duration-300">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>

                {/* Author and Date */}
                <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2 text-amber-500" />
                    {article.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>

                {/* Read More Link */}
                <div className="flex items-center text-amber-600 font-semibold mt-4 group-hover:text-orange-600 transition-colors duration-300">
                  Read Article
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        )}

        {/* No Results */}
        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
