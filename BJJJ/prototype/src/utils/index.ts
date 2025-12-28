/**
 * Utility Functions
 *
 * Shared utility functions used across components.
 * Helps eliminate code duplication and maintain consistency.
 */

// Breakthrough Detection exports
export {
  detectBreakthroughs,
  detectPlateau,
  getMostSignificantBreakthrough,
  type Breakthrough,
  type BreakthroughType,
  type BreakthroughConfidence,
  type BreakthroughDetectionInput,
  type PlateauDetection,
} from './breakthrough-detection';

// ===========================================
// DATE UTILITIES
// ===========================================

/**
 * Format a date for display
 * @param date - Date object or ISO string
 * @param format - 'short' | 'long' | 'relative'
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    case 'relative':
      return getRelativeTime(d);
    default:
      return d.toLocaleDateString();
  }
}

/**
 * Get relative time string (e.g., "2 days ago", "just now")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  return formatDate(d, 'short');
}

/**
 * Get day of week from date
 */
export function getDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Format time (e.g., "6:30 PM")
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Get ISO date string (YYYY-MM-DD)
 */
export function toISODateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

// ===========================================
// DURATION UTILITIES
// ===========================================

/**
 * Format duration in minutes to human-readable string
 * @param minutes - Duration in minutes
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return '—';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Parse duration string to minutes
 * @param input - Duration string (e.g., "1h 30m", "90 minutes", "1.5 hours")
 */
export function parseDuration(input: string): number | null {
  const lower = input.toLowerCase().trim();

  // Try parsing "Xh Ym" or "Xh" or "Ym"
  const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*h(?:our)?s?/);
  const minMatch = lower.match(/(\d+)\s*m(?:in(?:ute)?s?)?/);

  if (hourMatch || minMatch) {
    const hours = hourMatch ? parseFloat(hourMatch[1]) : 0;
    const mins = minMatch ? parseInt(minMatch[1], 10) : 0;
    return Math.round(hours * 60 + mins);
  }

  // Try plain number (assume minutes)
  const plainNum = parseInt(lower, 10);
  if (!isNaN(plainNum)) return plainNum;

  return null;
}

// ===========================================
// COLOR UTILITIES
// ===========================================

export type BeltColor = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type TrainingType = 'gi' | 'nogi' | 'openmat' | 'open-mat' | 'drilling' | 'private' | 'competition';

/**
 * Get CSS variable for belt color
 */
export function getBeltColorVar(belt: BeltColor): string {
  return `var(--belt-${belt})`;
}

/**
 * Get CSS variable for training type color
 */
export function getTrainingTypeColorVar(type: TrainingType): string {
  const normalized = type === 'open-mat' ? 'openmat' : type;
  return `var(--color-training-${normalized})`;
}

/**
 * Get display label for training type
 */
export function getTrainingTypeLabel(type: TrainingType): string {
  const labels: Record<string, string> = {
    gi: 'Gi',
    nogi: 'No-Gi',
    'no-gi': 'No-Gi',
    openmat: 'Open Mat',
    'open-mat': 'Open Mat',
    drilling: 'Drilling',
    private: 'Private',
    competition: 'Competition',
  };
  return labels[type] || type;
}

/**
 * Get display label for belt
 */
export function getBeltLabel(belt: BeltColor): string {
  return belt.charAt(0).toUpperCase() + belt.slice(1) + ' Belt';
}

// ===========================================
// NUMBER UTILITIES
// ===========================================

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// ===========================================
// STRING UTILITIES
// ===========================================

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Pluralize a word based on count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trim() + '…';
}

// ===========================================
// VALIDATION UTILITIES
// ===========================================

/**
 * Check if value is a valid email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmpty(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

// ===========================================
// ID UTILITIES
// ===========================================

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Generate a short ID (8 characters)
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ===========================================
// ARRAY UTILITIES
// ===========================================

/**
 * Remove duplicates from array
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Group array by key
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// ===========================================
// ACCESSIBILITY UTILITIES
// ===========================================

/**
 * Generate aria-label for session card
 */
export function getSessionAriaLabel(
  date: string,
  type: string,
  duration?: number | null
): string {
  const durationStr = duration ? `, ${formatDuration(duration)}` : '';
  return `${getTrainingTypeLabel(type as TrainingType)} session on ${formatDate(date, 'long')}${durationStr}`;
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}
