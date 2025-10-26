import React from 'react';
import { CheckoutCard } from '../features/CheckoutCard';
import { useCheckouts } from '../../hooks/useCheckouts';
import { SortOption, FormatFilter } from '../../types';

interface MyCheckoutsPageProps {
  onClose: () => void;
}

export const MyCheckoutsPage: React.FC<MyCheckoutsPageProps> = ({ onClose }) => {
  const {
    checkouts,
    renewingIds,
    sortBy,
    filterBy,
    isLoading,
    renewCheckout,
    setSortBy,
    setFilterBy,
    formatCounts,
    totalCount
  } = useCheckouts();

  // Sort options
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'due_date', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'recent', label: 'Recently Checked Out' }
  ];

  // Filter options
  const filterOptions: { value: FormatFilter; label: string; count: number }[] = [
    { value: 'all', label: 'All Formats', count: formatCounts.all },
    { value: 'physical', label: 'Physical', count: formatCounts.physical },
    { value: 'ebook', label: 'eBook', count: formatCounts.ebook },
    { value: 'audiobook', label: 'Audiobook', count: formatCounts.audiobook }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Back to search"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  My Checkouts
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {totalCount === 0
                    ? 'No items checked out'
                    : `You have ${totalCount} ${totalCount === 1 ? 'item' : 'items'} checked out`}
                </p>
              </div>
            </div>

            {/* Controls */}
            {totalCount > 0 && (
              <div className="flex items-center space-x-2">
                {/* Sort dropdown */}
                <div className="relative">
                  <label htmlFor="sort-select" className="sr-only">Sort by</label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        Sort: {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Filter buttons */}
          {totalCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilterBy(option.value)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${filterBy === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}
                  `}
                  aria-pressed={filterBy === option.value}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4 bg-white dark:bg-gray-800 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : checkouts.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {filterBy === 'all' ? 'No items checked out' : `No ${filterBy} items`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {filterBy === 'all'
                ? "You don't have any items checked out right now. Start exploring our catalog to find something great to read!"
                : `You don't have any ${filterBy} items checked out. Try selecting "All Formats" or check out some ${filterBy} items.`}
            </p>
            {filterBy === 'all' && (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Browse Catalog
              </button>
            )}
          </div>
        ) : (
          // Checkout list
          <div className="space-y-4">
            {checkouts.map(checkout => (
              <CheckoutCard
                key={checkout.id}
                checkout={checkout}
                onRenew={renewCheckout}
                isRenewing={renewingIds.has(checkout.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};