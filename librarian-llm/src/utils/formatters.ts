import { BookFormat, ItemFormat, ItemFormatType, MaterialType, CatalogItem } from '../types';

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

export const formatAvailability = (format: ItemFormat | BookFormat): string => {
  switch (format.status) {
    case 'available':
      if ('booking_required' in format && format.booking_required) {
        return 'Reserve slot';
      }
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
    case 'reserved':
      return 'Reserved';
    case 'maintenance':
      return 'Under maintenance';
    default:
      return 'Status unknown';
  }
};

export const getFormatIcon = (type: ItemFormatType | BookFormat['type']): string => {
  switch (type) {
    // Book formats
    case 'physical':
      return '📕';
    case 'ebook':
      return '📱';
    case 'audiobook':
      return '🎧';
    // Media formats
    case 'dvd':
      return '📀';
    case 'bluray':
      return '💿';
    case 'cd':
      return '💽';
    case 'vinyl':
      return '⚫';
    // Game platforms
    case 'ps5':
    case 'xbox':
    case 'switch':
    case 'retro':
      return '🎮';
    case 'pc':
      return '💻';
    // Equipment
    case 'equipment':
      return '⚙️';
    case 'tool':
      return '🔨';
    case 'device':
      return '📟';
    // Comics
    case 'comic':
      return '💬';
    case 'manga':
      return '🗾';
    case 'graphic-novel':
      return '📖';
    default:
      return '📚';
  }
};

export const getStatusColor = (status: ItemFormat['status'] | BookFormat['status']): string => {
  switch (status) {
    case 'available':
      return 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50';
    case 'waitlist':
      return 'text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/50';
    case 'checked_out':
      return 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50';
    case 'reserved':
      return 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50';
    case 'maintenance':
      return 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50';
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

export const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const getFormatEmoji = (format: string): string => {
  switch (format) {
    case 'physical': return '📕';
    case 'ebook': return '📱';
    case 'audiobook': return '🎧';
    default: return '📖';
  }
};

// New helper functions for diverse materials
export const getMaterialIcon = (itemType: MaterialType): string => {
  switch (itemType) {
    case 'book':
      return '📚';
    case 'dvd':
      return '📀';
    case 'game':
      return '🎮';
    case 'equipment':
      return '🔧';
    case 'comic':
      return '📖';
    case 'audiovisual':
      return '🎬';
    case 'thing':
      return '📦';
    default:
      return '📋';
  }
};

export const formatItemCreator = (item: CatalogItem): string => {
  if ('author' in item && item.author) return item.author;
  if ('director' in item && item.director) return item.director;
  if ('developer' in item && item.developer) return item.developer;
  if ('artist' in item && item.artist) return item.artist;
  if ('manufacturer' in item && item.manufacturer) return item.manufacturer;
  return 'Unknown';
};