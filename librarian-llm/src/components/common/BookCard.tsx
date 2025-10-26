import React, { useState } from 'react';
import { CatalogItem } from '../../types';
import {
  formatAvailability,
  getFormatIcon,
  getStatusColor,
  getRatingStars,
  formatSubjects,
  formatItemCreator
} from '../../utils/formatters';

interface BookCardProps {
  book: CatalogItem;
  recommendation?: string; // Why this item was recommended
  onAction?: (action: 'hold' | 'details', book: CatalogItem) => void;
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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg
                 dark:shadow-gray-900/50 transition-shadow
                 border-2 border-gray-100 dark:border-gray-700 p-4"
      aria-label={`${book.title} by ${formatItemCreator(book)}`}
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
                          dark:from-primary-900 dark:to-primary-800
                          rounded-md shadow-sm flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">by {formatItemCreator(book)}</p>
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
              <span className="ml-1 text-gray-600 dark:text-gray-400">({book.rating})</span>
            </div>
          )}

          {/* Recommendation reason */}
          {recommendation && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-2 mb-3 rounded dark:bg-blue-900/30 dark:border-blue-500">
              <p className="text-sm text-blue-700 dark:text-blue-300">{recommendation}</p>
            </div>
          )}

          {/* Description */}
          <p className={`text-sm text-gray-700 dark:text-gray-300 mb-3 ${!expanded ? 'line-clamp-2' : ''}`}>
            {book.description}
          </p>

          {book.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-3"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Subjects/Genres/Category */}
          {'subjects' in book && book.subjects && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              📂 {formatSubjects(book.subjects)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAction?.('hold', book)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       transition-colors text-sm font-medium btn-enhanced"
              aria-label={`Place hold on ${book.title}`}
            >
              {primaryFormat.status === 'available' ? 'Check Out' : 'Place Hold'}
            </button>
            <button
              onClick={() => onAction?.('details', book)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md
                       hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2
                       focus:ring-primary-500 focus:ring-offset-2 transition-colors
                       text-sm font-medium btn-enhanced"
              aria-label={`View details for ${book.title}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Metadata footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        {'publication_year' in book && (
          <span>Published {book.publication_year}</span>
        )}
        {'release_year' in book && (
          <span>Released {book.release_year}</span>
        )}
        {'pages' in book && book.pages && (
          <span>{book.pages} pages</span>
        )}
        {book.popular && <span className="text-orange-600 dark:text-orange-400 font-medium">🔥 Popular</span>}
      </div>
    </article>
  );
};