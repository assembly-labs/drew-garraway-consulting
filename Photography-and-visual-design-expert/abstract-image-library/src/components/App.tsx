import { useState, useCallback } from 'react';
import type { ImageRecord, SortOption } from '../types';
import { useImages } from '../hooks/useImages';
import { useSearch } from '../hooks/useSearch';
import { useFilters } from '../hooks/useFilters';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Header from './Header';
import Sidebar from './Sidebar';
import ImageGrid from './ImageGrid';
import ImageModal from './ImageModal';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [page, setPage] = useState(1);

  const { query, setQuery, debouncedQuery, clearSearch } = useSearch();
  const {
    filters,
    setCollection,
    toggleTag,
    toggleColor,
    setOrientation,
    clearFilters,
    activeFilterCount,
  } = useFilters();

  const { images, totalCount, filteredCount, isLoading, hasMore } = useImages(
    filters,
    debouncedQuery,
    sortOption,
    page
  );

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const { sentinelRef } = useInfiniteScroll(loadMore, hasMore);

  const handleImageClick = useCallback((image: ImageRecord) => {
    setSelectedImage(image);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleTagClick = useCallback(
    (tag: string) => {
      toggleTag(tag);
      setPage(1);
    },
    [toggleTag]
  );

  // Reset page when filters or search change
  const handleCollectionChange = useCallback(
    (collection: 'all' | 'iconography' | 'photography') => {
      setCollection(collection);
      setPage(1);
    },
    [setCollection]
  );

  const handleOrientationChange = useCallback(
    (orientation: 'all' | 'landscape' | 'portrait' | 'square') => {
      setOrientation(orientation);
      setPage(1);
    },
    [setOrientation]
  );

  const handleColorToggle = useCallback(
    (color: string) => {
      toggleColor(color);
      setPage(1);
    },
    [toggleColor]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setPage(1);
  }, [clearFilters]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        query={query}
        setQuery={(q) => {
          setQuery(q);
          setPage(1);
        }}
        clearSearch={() => {
          clearSearch();
          setPage(1);
        }}
        filteredCount={filteredCount}
        totalCount={totalCount}
        sortOption={sortOption}
        setSortOption={(sort) => {
          setSortOption(sort);
          setPage(1);
        }}
      />

      <div className="flex">
        <Sidebar
          filters={filters}
          setCollection={handleCollectionChange}
          toggleTag={handleTagClick}
          toggleColor={handleColorToggle}
          setOrientation={handleOrientationChange}
          clearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)]">
          <ImageGrid
            images={images}
            isLoading={isLoading}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
            onImageClick={handleImageClick}
          />
        </main>
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={handleCloseModal}
          onTagClick={handleTagClick}
        />
      )}
    </div>
  );
}
