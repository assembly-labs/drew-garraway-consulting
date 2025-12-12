/**
 * Book Cover Utilities
 *
 * This module provides functions for fetching real book cover images from the Open Library API.
 * When real covers are not available, components should display solid color fallbacks with
 * book initials instead of relying on external placeholder services.
 *
 * Design Pattern:
 * 1. Try to fetch real cover from Open Library using ISBN
 * 2. If unavailable or fails, components render gradient backgrounds with book initials
 * 3. Each component type uses a distinct color scheme for visual context
 */

/**
 * Get book cover URL from Open Library using ISBN
 *
 * Open Library provides free book cover images based on ISBN numbers.
 * This service redirects to actual cover images hosted on archive.org.
 *
 * @param isbn - Book ISBN (10 or 13 digits)
 * @param size - Cover size: 'S' (small), 'M' (medium), 'L' (large)
 * @returns URL for the book cover image
 *
 * @example
 * getOpenLibraryCover('9781984801258', 'M')
 * // Returns: "https://covers.openlibrary.org/b/isbn/9781984801258-M.jpg"
 */
export const getOpenLibraryCover = (isbn: string, size: 'S' | 'M' | 'L' = 'M'): string => {
  // Remove any hyphens from ISBN for API compatibility
  const cleanIsbn = isbn.replace(/-/g, '');

  // Open Library Covers API endpoint
  return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-${size}.jpg`;
};

/**
 * Generate book initials for fallback display
 *
 * Creates a 1-2 character abbreviation from the book title to display
 * in the fallback gradient background when cover images are unavailable.
 *
 * @param title - The book title
 * @returns 1-2 character string in uppercase
 *
 * @example
 * getBookInitials('The Great Gatsby') // Returns: "TG"
 * getBookInitials('Dune') // Returns: "DU"
 * getBookInitials('1984') // Returns: "19"
 */
export const getBookInitials = (title: string): string => {
  const words = title.split(' ').filter(w => w.length > 0);

  if (words.length === 1) {
    // For single-word titles, use first two characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // For multi-word titles, use first letter of first two words
  return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
};

/**
 * Component Color Schemes for Fallback Covers
 *
 * Each component type uses a distinct gradient color to provide visual context
 * when displaying fallback covers. This helps users understand the status/context
 * of the book at a glance.
 *
 * Color Assignments:
 * - BookCard: Navy (primary catalog display)
 * - CheckoutCard: Coral (action required - returns)
 * - HoldCard: Sage (waiting/available status)
 * - HistoryCard: Purple (past items)
 * - ItemDetailsModal: Navy (detailed view)
 */
export const FALLBACK_GRADIENTS = {
  catalog: 'from-navy-500 to-navy-700 dark:from-navy-700 dark:to-navy-900',
  checkout: 'from-coral-400 to-coral-600 dark:from-coral-500 dark:to-coral-700',
  hold: 'from-sage-500 to-sage-700 dark:from-sage-600 dark:to-sage-800',
  history: 'from-purple-500 to-purple-700 dark:from-purple-600 dark:to-purple-800',
  detail: 'from-navy-500 to-navy-700 dark:from-navy-700 dark:to-navy-900'
} as const;

/**
 * Check if a cover URL should be considered valid
 *
 * Filters out placeholder URLs and invalid paths that shouldn't be used
 * as actual cover images.
 *
 * @param coverUrl - The cover URL to validate
 * @returns true if the URL appears to be a real cover image
 */
export const isValidCoverUrl = (coverUrl?: string): boolean => {
  if (!coverUrl) return false;

  // Reject known placeholder services and invalid patterns
  const invalidPatterns = [
    'placeholder',
    'via.placeholder.com',
    'placehold.it',
    'placekitten.com',
    'lorempixel.com',
    'dummyimage.com'
  ];

  return !invalidPatterns.some(pattern =>
    coverUrl.toLowerCase().includes(pattern)
  );
};