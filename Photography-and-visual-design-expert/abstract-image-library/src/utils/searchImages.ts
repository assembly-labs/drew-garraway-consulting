import type { ImageRecord } from '../types';

export function searchImages(images: ImageRecord[], query: string): ImageRecord[] {
  if (!query.trim()) {
    return images;
  }

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  return images.filter((image) => {
    const searchableText = [
      image.alt,
      ...image.tags,
      image.collection,
      image.orientation,
      image.source.photographer,
    ]
      .join(' ')
      .toLowerCase();

    return searchTerms.every((term) => searchableText.includes(term));
  });
}

export function sortImages(
  images: ImageRecord[],
  sortOption: 'newest' | 'oldest' | 'random'
): ImageRecord[] {
  const sorted = [...images];

  switch (sortOption) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.added_at).getTime() - new Date(b.added_at).getTime()
      );
    case 'random':
      return shuffleArray(sorted);
    default:
      return sorted;
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
