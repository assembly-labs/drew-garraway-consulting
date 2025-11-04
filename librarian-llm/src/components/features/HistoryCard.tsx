import React from 'react';
import { StarRating } from '../common/StarRating';
import { HistoryItem } from '../../types';

interface HistoryCardProps {
  item: HistoryItem;
  onRatingChange: (itemId: string, rating: number) => void;
  onReadAgain: (book: HistoryItem['book']) => void;
  onDelete: (itemId: string, bookTitle: string) => void;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onRatingChange,
  onReadAgain,
  onDelete
}) => {
  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get format emoji
  const getFormatEmoji = (format: string) => {
    switch (format) {
      case 'physical': return '📕';
      case 'ebook': return '📱';
      case 'audiobook': return '🎧';
      default: return '📖';
    }
  };

  return (
    <article
      className="bg-surface dark:bg-navy-800 border border-neutral-200 dark:border-navy-700 rounded-lg p-4 hover:shadow-md transition-shadow"
      aria-label={`${item.book.title} by ${item.book.author}, returned ${formatDate(item.returned_date)}`}
    >
      <div className="flex gap-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <img
            src={item.book.cover}
            alt={`Cover of ${item.book.title}`}
            className="w-16 h-24 object-cover rounded shadow-sm"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA2MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0yMiA0MEgyMlYzNkgyNlYzNkgzOFYzNkgzOFY0MEgzNFY0MEgzNFY0NEgzMFY0NEgzMFY0MEgyNlY0MFY0NFYNDRIMjJWNDBaIiBmaWxsPSIjOUIyQzJDIi8+CjxwYXRoIGQ9Ik0yMiA1MkgyMlY1NkgyNlY1NkgzNFY1NkgzOFY1NkgzOFY1MkgzNFY1MkgzMFY1MkgyNlY1MkgyMloiIGZpbGw9IiM2Qjc1ODAiLz4KPC9zdmc+';
            }}
          />
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          {/* Title and Author */}
          <div className="mb-2">
            <h3 className="font-semibold text-navy-900 dark:text-surface truncate">
              {item.book.title}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              by {item.book.author}
            </p>
          </div>

          {/* Format and Dates */}
          <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="flex items-center gap-1">
              {getFormatEmoji(item.format)} {item.format === 'audiobook' ? 'Audiobook' : item.format.charAt(0).toUpperCase() + item.format.slice(1)}
            </span>
            <span>
              {formatDate(item.checked_out_date)} – {formatDate(item.returned_date)}
            </span>
            <span>
              {item.days_borrowed} days
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Your rating:</span>
            <StarRating
              rating={item.user_rating}
              onRatingChange={(rating) => onRatingChange(item.id, rating)}
              size="sm"
            />
            {item.user_rating === 0 && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                Not rated yet
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onReadAgain(item.book)}
              className="px-3 py-1.5 bg-navy-600 text-white text-sm rounded-md hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500"
              aria-label={`Read ${item.book.title} again`}
            >
              Read Again
            </button>
            <button
              onClick={() => onDelete(item.id, item.book.title)}
              className="px-3 py-1.5 border border-neutral-300 dark:border-navy-600 text-neutral-700 dark:text-neutral-300 text-sm rounded-md hover:bg-neutral-50 dark:hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400"
              aria-label={`Delete ${item.book.title} from history`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};