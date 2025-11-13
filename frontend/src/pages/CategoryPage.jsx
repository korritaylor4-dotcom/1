import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getArticles } from '../utils/api';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import Pagination from '../components/Pagination';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

const categoryInfo = {
  nutrition: {
    title: 'Pet Nutrition Articles',
    description: 'Expert nutrition guides for your pets - balanced diets, feeding tips, and nutritional advice.',
    color: 'from-green-500 to-emerald-600'
  },
  training: {
    title: 'Pet Training Tips',
    description: 'Effective training techniques and behavioral guidance for dogs and cats.',
    color: 'from-blue-500 to-indigo-600'
  },
  health: {
    title: 'Pet Health Information',
    description: 'Comprehensive health guides, preventive care, and wellness tips for your pets.',
    color: 'from-red-500 to-rose-600'
  },
  care: {
    title: 'Pet Care Guides',
    description: 'Essential pet care information, grooming tips, and home environment advice.',
    color: 'from-purple-500 to-violet-600'
  }
};

const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentPage = parseInt(searchParams.get('page') || '1');

  const info = categoryInfo[category] || categoryInfo.nutrition;

  useEffect(() => {
    loadArticles();
  }, [category, currentPage]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles(category, currentPage, 12);
      setArticles(data.articles || data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const breadcrumbs = [
    { name: 'Articles', url: '/articles' },
    { name: info.title, url: `/articles/${category}` }
  ];

  const title = currentPage > 1 
    ? `${info.title} - Page ${currentPage} | PetsLib`
    : `${info.title} | PetsLib`;

  const shouldNoIndex = currentPage > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-orange-50">
      <SEOHead
        title={title}
        description={info.description}
        breadcrumbs={breadcrumbs}
        noindex={shouldNoIndex}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
            {info.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {info.description}
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
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

        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
