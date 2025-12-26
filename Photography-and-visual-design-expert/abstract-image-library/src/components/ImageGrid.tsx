import type { ImageRecord } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: ImageRecord[];
  isLoading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onImageClick: (image: ImageRecord) => void;
}

export default function ImageGrid({
  images,
  isLoading,
  hasMore,
  sentinelRef,
  onImageClick,
}: ImageGridProps) {
  if (images.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-textSecondary">
        <svg
          className="w-16 h-16 mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg font-medium">No images found</p>
        <p className="text-sm mt-1">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="masonry-grid">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onClick={() => onImageClick(image)}
          />
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="masonry-grid mt-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="masonry-item">
              <div className="skeleton aspect-[4/3]" />
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="h-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
