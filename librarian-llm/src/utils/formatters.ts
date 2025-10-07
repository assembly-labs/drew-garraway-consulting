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
      return 'text-green-700 bg-green-100';
    case 'waitlist':
      return 'text-yellow-700 bg-yellow-100';
    case 'checked_out':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

export const generatePlaceholderCover = (title: string): string => {
  // Generate a placeholder book cover URL with the title
  const encodedTitle = encodeURIComponent(title.substring(0, 20));
  const colors = ['4F46E5', '7C3AED', 'DC2626', '059669', 'EA580C', '0891B2'];
  const colorIndex = title.length % colors.length;
  const bgColor = colors[colorIndex];

  return `https://via.placeholder.com/150x225/${bgColor}/FFFFFF?text=${encodedTitle}`;
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