import React, { useEffect, useRef, useState } from 'react';
import { CatalogItem } from '../../types';
import { formatItemCreator, getRatingStars } from '../../utils/formatters';
import { getOpenLibraryCover } from '../../utils/bookCovers';

interface ItemDetailsModalProps {
  item: CatalogItem | null;
  isOpen: boolean;
  onClose: () => void;
  onHold?: (item: CatalogItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  onHold
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [imageError, setImageError] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>('');

  // Get book initials for fallback display
  const getBookInitials = () => {
    if (!item) return '';
    const words = item.title.split(' ').filter(w => w.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  // Update cover URL when item changes
  useEffect(() => {
    if (item) {
      setImageError(false);
      if ('isbn' in item && item.isbn) {
        setCoverUrl(getOpenLibraryCover(item.isbn, 'L'));
      } else if (item.cover && !item.cover.includes('placeholder')) {
        setCoverUrl(item.cover);
      } else {
        setCoverUrl('');
      }
    }
  }, [item]);

  // Focus management
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const isBook = item.itemType === 'book';
  const isThing = item.itemType === 'thing' || item.itemType === 'equipment';
  const creator = formatItemCreator(item);
  const primaryFormat = item.formats[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 z-10 bg-white dark:bg-gray-800 shadow-lg"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              {!imageError && coverUrl ? (
                <img
                  src={coverUrl}
                  alt={`Cover of ${item.title}`}
                  className="w-40 h-60 md:w-48 md:h-72 object-cover rounded-lg shadow-lg mx-auto md:mx-0"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-40 h-60 md:w-48 md:h-72 bg-gradient-to-br from-navy-500 to-navy-700
                              dark:from-navy-700 dark:to-navy-900
                              rounded-lg shadow-lg mx-auto md:mx-0 flex flex-col items-center justify-center
                              border-2 border-navy-400 dark:border-navy-600">
                  <div className="text-white text-3xl font-bold tracking-wider mb-2">
                    {getBookInitials()}
                  </div>
                  <div className="text-white/60 text-lg">
                    {item.itemType === 'book' ? '📖' : '📦'}
                  </div>
                </div>
              )}
            </div>

            {/* Title and Metadata */}
            <div className="flex-1">
              <h2 id="modal-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h2>

              {creator !== 'Unknown' && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
                  by {creator}
                </p>
              )}

              {/* Item Type Badge */}
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isBook ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  isThing ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  {isBook ? '📚 Book' : isThing ? '📦 Library of Things' : item.itemType}
                </span>
              </div>

              {/* Rating */}
              {item.rating && (
                <div className="mb-3">
                  <span className="text-lg">{getRatingStars(item.rating)}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {item.rating} / 5.0
                  </span>
                </div>
              )}

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                {'publication_year' in item && item.publication_year && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Published:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {item.publication_year}
                    </span>
                  </div>
                )}
                {'pages' in item && item.pages && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Pages:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {item.pages}
                    </span>
                  </div>
                )}
                {'isbn' in item && item.isbn && (
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">ISBN:</span>
                    <span className="ml-2 font-mono text-sm text-gray-900 dark:text-white">
                      {item.isbn}
                    </span>
                  </div>
                )}
              </div>

              {/* Formats & Availability */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Available Formats:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.formats.map((format, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        format.status === 'available'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : format.status === 'waitlist'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {format.type}
                      {format.copies_available && ` (${format.copies_available} available)`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onHold?.(item)}
                className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 font-medium shadow-md"
              >
                {primaryFormat.status === 'available' ? '✓ Check Out' : '📌 Place Hold'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200 dark:border-gray-700" />

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Extended Details - BOOK */}
          {isBook && item.details && 'extendedDescription' in item.details && (
            <div className="space-y-6">
              {/* Extended Description */}
              {item.details.extendedDescription && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    More About This Book
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.details.extendedDescription}
                  </p>
                </div>
              )}

              {/* Author Bio */}
              {item.details.authorBio && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    About the Author
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.details.authorBio}
                  </p>
                </div>
              )}

              {/* Awards */}
              {item.details.awards && item.details.awards.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    🏆 Awards & Accolades
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {item.details.awards.map((award, i) => (
                      <li key={i}>{award}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews */}
              {item.details.reviews && item.details.reviews.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    📝 Reviews
                  </h3>
                  <div className="space-y-4">
                    {item.details.reviews.map((review, i) => (
                      <div key={i} className="border-l-4 border-primary-500 pl-4 py-2">
                        <p className="text-gray-700 dark:text-gray-300 italic mb-1">
                          "{review.quote}"
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          — {review.reviewer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fun Facts */}
              {item.details.funFacts && item.details.funFacts.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    💡 Fun Facts
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {item.details.funFacts.map((fact, i) => (
                      <li key={i}>{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience */}
              {item.details.targetAudience && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    👥 Target Audience
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.details.targetAudience}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Extended Details - LIBRARY OF THINGS */}
          {isThing && item.details && 'whatsIncluded' in item.details && (
            <div className="space-y-6">
              {/* What's Included */}
              {item.details.whatsIncluded && item.details.whatsIncluded.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    📦 What's Included
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.details.whatsIncluded.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* How to Use */}
              {item.details.howToUse && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    📖 How to Use
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.details.howToUse}
                  </p>
                </div>
              )}

              {/* Philadelphia Tips */}
              {item.details.phillyTips && item.details.phillyTips.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">🏛️</span>
                    Philadelphia Tips
                  </h3>
                  <ul className="space-y-2">
                    {item.details.phillyTips.map((tip, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">→</span>
                        <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Uses */}
              {item.details.recommendedUses && item.details.recommendedUses.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    💡 Recommended Uses
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {item.details.recommendedUses.map((use, i) => (
                      <li key={i}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best Seasons */}
              {item.details.bestSeasons && item.details.bestSeasons.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    📅 Best Time to Borrow
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.details.bestSeasons.map((season, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium"
                      >
                        {season}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Instructions */}
              {item.details.careInstructions && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    🧼 Care Instructions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.details.careInstructions}
                  </p>
                </div>
              )}

              {/* Safety Info */}
              {item.details.safetyInfo && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Safety Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.details.safetyInfo}
                  </p>
                </div>
              )}

              {/* Age Recommendation */}
              {item.details.ageRecommendation && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    👶 Age Recommendation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {item.details.ageRecommendation}
                  </p>
                </div>
              )}

              {/* Deposit & Replacement Cost */}
              {(item.details.depositAmount || item.details.replacementCost) && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    💰 Financial Information
                  </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    {item.details.depositAmount && (
                      <p>
                        <span className="font-medium">Deposit Required:</span>{' '}
                        ${item.details.depositAmount.toFixed(2)}
                      </p>
                    )}
                    {item.details.replacementCost && (
                      <p>
                        <span className="font-medium">Replacement Cost:</span>{' '}
                        ${item.details.replacementCost.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subjects/Tags */}
          {'subjects' in item && item.subjects && item.subjects.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🏷️ Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.subjects.map((subject, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
