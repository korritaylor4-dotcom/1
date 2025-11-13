import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticle, getArticles, trackPageView } from '../utils/api';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import RatingWidget from '../components/RatingWidget';
import Breadcrumbs from '../components/Breadcrumbs';
import SEOHead from '../components/SEOHead';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const data = await getArticle(id);
      setArticle(data);
      
      // Track page view
      trackPageView('article', id).catch(err => console.error('Failed to track view:', err));
      
      // Load related articles
      const response = await getArticles(data.category);
      const articlesData = response.articles || response;
      setRelatedArticles(articlesData.filter(a => a.id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
          <Link to="/articles" className="text-amber-600 hover:text-amber-700 font-medium">
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  // Prepare SEO data
  const breadcrumbs = article ? [
    { name: 'Articles', url: '/articles' },
    { name: article.title, url: `/articles/${article.id}` }
  ] : [];

  const structuredData = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.excerpt,
    'author': {
      '@type': 'Person',
      'name': article.author
    },
    'datePublished': article.date,
    'dateModified': article.updated_at || article.date,
    'publisher': {
      '@type': 'Organization',
      'name': 'PetsLib',
      'logo': {
        '@type': 'ImageObject',
        'url': `${window.location.origin}/logo.png`
      }
    }
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-orange-50">
      {article && (
        <SEOHead
          title={`${article.title} | PetsLib`}
          description={article.excerpt}
          breadcrumbs={breadcrumbs}
          structuredData={structuredData}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        {article && <Breadcrumbs items={breadcrumbs} />}

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-amber-600 font-medium mb-8 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back
        </button>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
          {/* Hero Image */}
          <div className="h-96 bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400"></div>

          {/* Article Content */}
          <div className="p-8 md:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full capitalize">
                <Tag className="w-4 h-4 mr-2" />
                {article.category}
              </span>
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                {article.readTime}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Author */}
            <div className="flex items-center mb-8 pb-8 border-b border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">{article.author}</p>
                <p className="text-sm text-gray-600">Pet Care Expert</p>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </article>

        {/* Rating Widget */}
        <div className="mt-8">
          <RatingWidget articleId={id} />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/articles/${related.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
                >
                  <div className="h-40 bg-gradient-to-br from-amber-200 to-orange-200"></div>
                  <div className="p-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full capitalize">
                      {related.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2 leading-tight">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500">{related.readTime}</p>
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

export default ArticleDetail;
