export interface ImageSource {
  platform: 'unsplash' | 'pexels' | 'pixabay';
  photographer: string;
  photographer_url: string;
  original_url: string;
  license: string;
  license_url: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageRecord {
  id: string;
  collection: 'iconography' | 'photography';
  url: string;
  thumb_url: string;
  alt: string;
  tags: string[];
  colors: string[];
  orientation: 'landscape' | 'portrait' | 'square';
  dimensions: ImageDimensions;
  source: ImageSource;
  added_at: string;
}

export interface FilterState {
  collection: 'all' | 'iconography' | 'photography';
  tags: string[];
  colors: string[];
  orientation: 'all' | 'landscape' | 'portrait' | 'square';
}

export type SortOption = 'newest' | 'oldest' | 'random';
