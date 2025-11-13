import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { rateArticle, getArticleRating } from '../utils/api';

const RatingWidget = ({ articleId }) => {
  const [rating, setRating] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRating();
  }, [articleId]);

  const loadRating = async () => {
    try {
      const data = await getArticleRating(articleId);
      setRating(data);
      // Check if user has already rated (using localStorage)
      const rated = localStorage.getItem(`rated_${articleId}`);
      setHasRated(!!rated);
    } catch (error) {
      console.error('Error loading rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (value) => {
    if (hasRated) return;

    try {
      const updatedRating = await rateArticle(articleId, value);
      setRating(updatedRating);
      setHasRated(true);
      localStorage.setItem(`rated_${articleId}`, 'true');
    } catch (error) {
      console.error('Error rating article:', error);
      alert('Failed to submit rating');
    }
  };

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading ratings...</div>;
  }

  const averageRating = rating?.average_rating || 0;
  const totalRatings = rating?.total_ratings || 0;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate this article</h3>
      
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => !hasRated && setHoveredStar(star)}
              onMouseLeave={() => !hasRated && setHoveredStar(0)}
              disabled={hasRated}
              className={`transition-all duration-200 ${
                hasRated ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'
              }`}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredStar || averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-lg text-amber-600">
            {averageRating.toFixed(1)}
          </div>
          <div>{totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}</div>
        </div>
      </div>

      {hasRated && (
        <p className="text-sm text-green-600 font-medium">
          Thank you for your rating!
        </p>
      )}
      {!hasRated && (
        <p className="text-sm text-gray-600">
          Click on a star to rate this article
        </p>
      )}
    </div>
  );
};

export default RatingWidget;
