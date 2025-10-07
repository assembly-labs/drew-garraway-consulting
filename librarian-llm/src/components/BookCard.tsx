import React, { useState } from 'react';
import { Book } from '../types';
import {
  formatAvailability,
  getFormatIcon,
  getStatusColor,
  getRatingStars,
  formatSubjects
} from '../utils/formatters';

interface BookCardProps {
  book: Book;
  recommendation?: string; // Why this book was recommended
  onAction?: (action: 'hold' | 'details', book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  recommendation,
  onAction
}) => {
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const primaryFormat = book.formats[0];

  return (
    <article
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow
                 border-2 border-gray-100 p-4"
      aria-label={`${book.title} by ${book.author}`}
    >
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {!imageError ? (
            <img
              src={book.cover}
              alt={`Cover of ${book.title}`}
              onError={handleImageError}
              className="w-24 h-36 object-cover rounded-md shadow-sm"
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-36 bg-gradient-to-br from-primary-100 to-primary-200
                          rounded-md shadow-sm flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">by {book.author}</p>
          </div>

          {/* Formats and Availability */}
          <div className="flex flex-wrap gap-2 mb-3">
            {book.formats.map((format, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(format.status)}`}
              >
                <span className="mr-1">{getFormatIcon(format.type)}</span>
                {formatAvailability(format)}
              </span>
            ))}
          </div>

          {/* Rating */}
          {book.rating && (
            <div className="text-sm mb-2" aria-label={`Rating: ${book.rating} out of 5`}>
              {getRatingStars(book.rating)}
              <span className="ml-1 text-gray-600">({book.rating})</span>
            </div>
          )}

          {/* Recommendation reason */}
          {recommendation && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mb-3 rounded">
              <p className="text-sm text-blue-700">{recommendation}</p>
            </div>
          )}

          {/* Description */}
          <p className={`text-sm text-gray-700 mb-3 ${!expanded ? 'line-clamp-2' : ''}`}>
            {book.description}
          </p>

          {book.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-3"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Subjects/Genres */}
          <div className="text-xs text-gray-500 mb-3">
            📂 {formatSubjects(book.subjects)}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAction?.('hold', book)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       transition-colors text-sm font-medium"
              aria-label={`Place hold on ${book.title}`}
            >
              {primaryFormat.status === 'available' ? 'Check Out' : 'Place Hold'}
            </button>
            <button
              onClick={() => onAction?.('details', book)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md
                       hover:bg-gray-50 focus:outline-none focus:ring-2
                       focus:ring-primary-500 focus:ring-offset-2 transition-colors
                       text-sm font-medium"
              aria-label={`View details for ${book.title}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Metadata footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <span>Published {book.publication_year}</span>
        <span>{book.pages} pages</span>
        {book.popular && <span className="text-orange-600 font-medium">🔥 Popular</span>}
      </div>
    </article>
  );
};