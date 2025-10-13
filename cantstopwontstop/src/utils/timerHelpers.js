/**
 * Timer utility functions
 */

/**
 * Format milliseconds to MM:SS
 */
export function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format milliseconds to minutes (rounded)
 */
export function formatMinutes(ms) {
  return Math.round(ms / 60000);
}

/**
 * Convert seconds to milliseconds
 */
export function secondsToMs(seconds) {
  return seconds * 1000;
}

/**
 * Convert minutes to milliseconds
 */
export function minutesToMs(minutes) {
  return minutes * 60 * 1000;
}

/**
 * Calculate completion percentage
 */
export function calculateCompletion(completed, total) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}
