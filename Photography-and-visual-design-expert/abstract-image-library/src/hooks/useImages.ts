import { useMemo } from 'react';
import type { ImageRecord, FilterState, SortOption } from '../types';
import { filterImages } from '../utils/filterImages';
import { searchImages, sortImages } from '../utils/searchImages';
import imagesData from '../data/images.json';

const IMAGES_PER_PAGE = 50;

export function useImages(
  filters: FilterState,
  searchQuery: string,
  sortOption: SortOption,
  page: number
) {
  const allImages = imagesData as ImageRecord[];

  const processedImages = useMemo(() => {
    let result = [...allImages];

    // Apply filters
    result = filterImages(result, filters);

    // Apply search
    result = searchImages(result, searchQuery);

    // Apply sorting
    result = sortImages(result, sortOption);

    return result;
  }, [allImages, filters, searchQuery, sortOption]);

  const paginatedImages = useMemo(() => {
    return processedImages.slice(0, page * IMAGES_PER_PAGE);
  }, [processedImages, page]);

  const hasMore = paginatedImages.length < processedImages.length;

  return {
    images: paginatedImages,
    totalCount: allImages.length,
    filteredCount: processedImages.length,
    isLoading: false,
    hasMore,
  };
}
