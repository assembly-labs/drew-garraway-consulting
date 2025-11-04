import React, { useState } from 'react';
import { HistoryCard } from '../features/HistoryCard';
import { ConfirmDialog } from '../modals/ConfirmDialog';
import { useReadingHistory } from '../../hooks/useReadingHistory';

interface MyReadingHistoryPageProps {
  onClose: () => void;
}

export const MyReadingHistoryPage: React.FC<MyReadingHistoryPageProps> = ({ onClose }) => {
  const {
    groupedHistory,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterFormat,
    setFilterFormat,
    filterRating,
    setFilterRating,
    updateRating,
    readAgain,
    deleteItem,
    deleteAllHistory,
    formats,
    stats,
    totalCount
  } = useReadingHistory();

  const [deleteItemDialog, setDeleteItemDialog] = useState<{ id: string; title: string } | null>(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  // Handle delete item confirmation
  const handleDeleteItem = (itemId: string, bookTitle: string) => {
    setDeleteItemDialog({ id: itemId, title: bookTitle });
  };

  const confirmDeleteItem = () => {
    if (deleteItemDialog) {
      deleteItem(deleteItemDialog.id);
      setDeleteItemDialog(null);
    }
  };

  // Handle delete all confirmation
  const confirmDeleteAll = () => {
    deleteAllHistory();
    setShowDeleteAllDialog(false);
  };

  return (
    <div className="min-h-screen bg-page dark:bg-navy-900">
      {/* Delete Item Dialog */}
      <ConfirmDialog
        isOpen={!!deleteItemDialog}
        title="Remove from History"
        message={`Are you sure you want to remove "${deleteItemDialog?.title}" from your reading history?`}
        confirmText="Remove"
        confirmStyle="destructive"
        onConfirm={confirmDeleteItem}
        onCancel={() => setDeleteItemDialog(null)}
      />

      {/* Delete All Dialog */}
      <ConfirmDialog
        isOpen={showDeleteAllDialog}
        title="Delete All Reading History"
        message="Are you sure you want to delete your entire reading history? This action cannot be undone."
        confirmText="Delete All History"
        confirmStyle="destructive"
        onConfirm={confirmDeleteAll}
        onCancel={() => setShowDeleteAllDialog(false)}
      />

      {/* Header */}
      <header className="bg-white dark:bg-navy-800 shadow-sm border-b border-neutral-300 dark:border-navy-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-navy-700 transition-colors focus:outline-none focus:ring-2 focus:ring-navy"
                aria-label="Back to main"
              >
                <svg className="w-6 h-6 text-neutral-text dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-navy-900 dark:text-neutral-100">
                  Reading History
                </h1>
                <p className="text-sm text-neutral-text dark:text-neutral-300">
                  {totalCount} {totalCount === 1 ? 'book' : 'books'} read • {stats.booksThisYear} this year
                </p>
              </div>
            </div>

            {/* Delete All Button */}
            {totalCount > 0 && (
              <button
                onClick={() => setShowDeleteAllDialog(true)}
                className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete All
              </button>
            )}
          </div>

          {/* Search and Filters */}
          {totalCount > 0 && (
            <div className="mt-4 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-navy-600 rounded-md bg-white dark:bg-gray-700 text-navy-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-navy"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div>
                  <label htmlFor="format-filter" className="sr-only">Filter by format</label>
                  <select
                    id="format-filter"
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="px-3 py-2 border border-neutral-300 dark:border-navy-600 rounded-md bg-white dark:bg-gray-700 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    <option value="all">All Formats</option>
                    {formats.map(format => (
                      <option key={format} value={format}>
                        {format === 'audiobook' ? 'Audiobook' : format.charAt(0).toUpperCase() + format.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="rating-filter" className="sr-only">Filter by rating</label>
                  <select
                    id="rating-filter"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-2 border border-neutral-300 dark:border-navy-600 rounded-md bg-white dark:bg-gray-700 text-sm text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-navy"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                    <option value="0">Not Rated</option>
                  </select>
                </div>

                {(searchQuery || filterFormat !== 'all' || filterRating !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterFormat('all');
                      setFilterRating('all');
                    }}
                    className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4 bg-white dark:bg-navy-800 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-24 bg-neutral-200 dark:bg-navy-700 rounded"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-neutral-200 dark:bg-navy-700 rounded w-1/3"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-navy-700 rounded w-1/4"></div>
                    <div className="h-4 bg-neutral-200 dark:bg-navy-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedHistory).length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-navy-900 dark:text-neutral-100 mb-2">
              {searchQuery || filterFormat !== 'all' || filterRating !== 'all'
                ? 'No books match your filters'
                : 'No reading history'}
            </h2>
            <p className="text-neutral-text dark:text-neutral-300 mb-6 max-w-md mx-auto">
              {searchQuery || filterFormat !== 'all' || filterRating !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : "Books you've checked out will appear here after they're returned."}
            </p>
            {(searchQuery || filterFormat !== 'all' || filterRating !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterFormat('all');
                  setFilterRating('all');
                }}
                className="px-6 py-2 bg-navy text-white rounded-md hover:bg-navy-600 transition-colors focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          // History grouped by year
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([year, items]) => (
              <section key={year}>
                <h2 className="text-lg font-semibold text-navy-900 dark:text-neutral-100 mb-4 border-b border-neutral-300 dark:border-navy-700 pb-2">
                  {year} • {items.length} {items.length === 1 ? 'book' : 'books'}
                </h2>
                <div className="space-y-4">
                  {items.map(item => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      onRatingChange={updateRating}
                      onReadAgain={readAgain}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Privacy Controls */}
        <div className="mt-12 border-t border-neutral-300 dark:border-navy-700 pt-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <button
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="flex items-center justify-between w-full text-left"
              aria-expanded={showPrivacyInfo}
            >
              <h3 className="text-lg font-semibold text-navy-900 dark:text-neutral-100">
                Privacy & Data Settings
              </h3>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${showPrivacyInfo ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showPrivacyInfo && (
              <div className="mt-4 space-y-4 text-sm text-neutral-text dark:text-neutral-300">
                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-neutral-100 mb-2">Reading History</h4>
                  <p className="mb-2">Your reading history helps us provide personalized recommendations and track your reading progress.</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>History is stored securely and never shared with third parties</li>
                    <li>You can delete individual items or your entire history at any time</li>
                    <li>Deleted items cannot be recovered</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-neutral-100 mb-2">Privacy Options</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Keep my reading history</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Use history for recommendations</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Make my reviews public</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-300 dark:border-navy-700">
                  <button
                    onClick={() => setShowDeleteAllDialog(true)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                  >
                    Delete All Reading History
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};