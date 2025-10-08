import { BookFormat } from '../types';

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const formatAvailability = (format: BookFormat): string => {
  switch (format.status) {
    case 'available':
      if (format.copies_available) {
        return `${format.copies_available} available`;
      }
      return 'Available now';
    case 'waitlist':
      if (format.wait_time) {
        return `${format.wait_time} wait`;
      }
      if (format.holds) {
        return `${format.holds} holds`;
      }
      return 'On waitlist';
    case 'checked_out':
      if (format.due_date) {
        return `Due ${format.due_date}`;
      }
      return 'Checked out';
    default:
      return 'Status unknown';
  }
};

export const getFormatIcon = (type: BookFormat['type']): string => {
  switch (type) {
    case 'physical':
      return '📕';
    case 'ebook':
      return '📱';
    case 'audiobook':
      return '🎧';
    default:
      return '📚';
  }
};

export const getStatusColor = (status: BookFormat['status']): string => {
  switch (status) {
    case 'available':
      return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50';
    case 'waitlist':
      return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/50';
    case 'checked_out':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50';
    default:
      return 'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700';
  }
};

export const formatSubjects = (subjects: string[]): string => {
  return subjects
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(', ');
};

export const getRatingStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    '⭐'.repeat(fullStars) +
    (hasHalfStar ? '✨' : '') +
    '☆'.repeat(emptyStars)
  );
};