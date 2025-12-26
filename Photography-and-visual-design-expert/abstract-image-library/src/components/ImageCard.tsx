import { useState } from 'react';
import type { ImageRecord } from '../types';

interface ImageCardProps {
  image: ImageRecord;
  onClick: () => void;
}

export default function ImageCard({ image, onClick }: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="masonry-item group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-surface transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1">
        {!isLoaded && !hasError && (
          <div className="skeleton aspect-[4/3]" />
        )}
        {hasError ? (
          <div className="aspect-[4/3] flex items-center justify-center bg-surface text-textSecondary text-sm">
            Failed to load
          </div>
        ) : (
          <img
            src={image.thumb_url}
            alt={image.alt}
            loading="lazy"
            className={`w-full h-auto transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
              image.collection === 'photography'
                ? 'bg-blue-500/80 text-white'
                : 'bg-purple-500/80 text-white'
            }`}>
              {image.collection}
            </span>
            <span className="ml-2 text-xs text-white/80">
              {image.tags.length} tags
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
