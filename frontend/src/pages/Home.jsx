import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, BookOpen, Search, Heart, ArrowRight } from 'lucide-react';
import { articles, dogBreeds, catBreeds } from '../mock';

const Home = () => {
  const featuredArticles = articles.slice(0, 3);
  const featuredDogs = dogBreeds.slice(0, 3);
  const featuredCats = catBreeds.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <PawPrint className="w-16 h-16 text-amber-500" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your Complete Guide to
              <span className="block mt-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Pet Care & Breeds
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover expert advice, comprehensive breed information, and everything you need to give your furry friends the best life possible.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/breeds"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Explore Breeds
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/articles"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-amber-200"
              >
                Read Articles
                <BookOpen className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Articles</h3>
            <p className="text-gray-600 leading-relaxed">
              Access professionally written guides on nutrition, training, health, and care from certified pet experts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Breed Database</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore detailed profiles of dog and cat breeds with history, care requirements, and health information.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Heart className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Care Tips</h3>
            <p className="text-gray-600 leading-relaxed">
              Learn practical tips for creating a loving, healthy environment for your pets at every life stage.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="bg-gradient-to-br from-amber-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-gray-600 text-lg">Expert advice for responsible pet ownership</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
              >
                <div className="h-48 bg-gradient-to-br from-amber-200 to-orange-200"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>
                  <div className="flex items-center text-amber-600 font-medium">
                    Read more <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/articles"
              className="inline-flex items-center px-8 py-3 bg-white text-amber-600 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-amber-200"
            >
              View All Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Breeds */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Breeds</h2>
            <p className="text-gray-600 text-lg">Discover the perfect companion for your lifestyle</p>
          </div>

          {/* Dogs */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Dogs</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredDogs.map((breed) => (
                <Link
                  key={breed.id}
                  to={`/breeds/${breed.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
                >
                  <div className="h-56 bg-gradient-to-br from-amber-200 to-orange-300"></div>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{breed.name}</h4>
                    <p className="text-gray-600 mb-4">{breed.size} • {breed.lifespan}</p>
                    <div className="flex flex-wrap gap-2">
                      {breed.temperament.slice(0, 3).map((trait, idx) => (
                        <span key={idx} className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Cats */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Cats</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredCats.map((breed) => (
                <Link
                  key={breed.id}
                  to={`/breeds/${breed.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100"
                >
                  <div className="h-56 bg-gradient-to-br from-orange-200 to-amber-300"></div>
                  <div className="p-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{breed.name}</h4>
                    <p className="text-gray-600 mb-4">{breed.size} • {breed.lifespan}</p>
                    <div className="flex flex-wrap gap-2">
                      {breed.temperament.slice(0, 3).map((trait, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/breeds"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Explore All Breeds
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
