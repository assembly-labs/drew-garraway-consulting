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
      className="bg-surface dark:bg-navy-900 rounded-lg shadow-md hover:shadow-lg
                 dark:shadow-navy-900/50 transition-shadow
                 border-2 border-neutral-100 dark:border-navy-700 p-4"
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
            <div className="w-24 h-36 bg-gradient-to-br from-navy-100 to-navy-200
                          dark:from-navy-900 dark:to-navy-800
                          rounded-md shadow-sm flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-surface line-clamp-1">
              {book.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">by {formatItemCreator(book)}</p>
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
              <span className="ml-1 text-neutral-600 dark:text-neutral-400">({book.rating})</span>
            </div>
          )}

          {/* Recommendation reason */}
          {recommendation && (
            <div className="bg-navy-50 border-l-4 border-navy-400 p-2 mb-3 rounded dark:bg-navy-900/30 dark:border-navy-500">
              <p className="text-sm text-navy-700 dark:text-navy-300">{recommendation}</p>
            </div>
          )}

          {/* Description */}
          <p className={`text-sm text-neutral-700 dark:text-neutral-300 mb-3 ${!expanded ? 'line-clamp-2' : ''}`}>
            {book.description}
          </p>

          {book.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-navy-600 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-300 font-medium mb-3"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Subjects/Genres/Category */}
          {'subjects' in book && book.subjects && (
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              📂 {formatSubjects(book.subjects)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onAction?.('hold', book)}
              className="px-4 py-2 bg-navy-600 text-white rounded-md hover:bg-navy-700
                       focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2
                       transition-colors text-sm font-medium btn-enhanced"
              aria-label={`Place hold on ${book.title}`}
            >
              {primaryFormat.status === 'available' ? 'Check Out' : 'Place Hold'}
            </button>
            <button
              onClick={() => onAction?.('details', book)}
              className="px-4 py-2 border border-neutral-300 dark:border-navy-600 text-neutral-700 dark:text-neutral-300 rounded-md
                       hover:bg-neutral-50 dark:hover:bg-navy-700 focus:outline-none focus:ring-2
                       focus:ring-navy-500 focus:ring-offset-2 transition-colors
                       text-sm font-medium btn-enhanced"
              aria-label={`View details for ${book.title}`}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Metadata footer */}
      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-navy-700 flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        {'publication_year' in book && (
          <span>Published {book.publication_year}</span>
        )}
        {'release_year' in book && (
          <span>Released {book.release_year}</span>
        )}
        {'pages' in book && book.pages && (
          <span>{book.pages} pages</span>
        )}
        {book.popular && <span className="text-coral-600 dark:text-coral-400 font-medium">🔥 Popular</span>}
      </div>
    </article>
  );
};