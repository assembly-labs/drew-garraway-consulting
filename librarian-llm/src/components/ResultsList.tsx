import React from 'react';
import { CatalogItem } from '../types';
import { BookCard } from './BookCard';

interface ResultsListProps {
  books: CatalogItem[];
  recommendations?: { [bookId: string]: string }; // Recommendation reasons by item ID
  onBookAction?: (action: 'hold' | 'details', book: CatalogItem) => void;
  title?: string;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  books,
  recommendations = {},
  onBookAction,
  title = 'Recommended Books'
}) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No books found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search or asking a different question.
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        {title} ({books.length})
      </h2>

      <div className="grid gap-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            recommendation={recommendations[book.id]}
            onAction={onBookAction}
          />
        ))}
      </div>

      {books.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Showing {books.length} book{books.length > 1 ? 's' : ''} based on your request.
          </p>
        </div>
      )}
    </div>
  );
};