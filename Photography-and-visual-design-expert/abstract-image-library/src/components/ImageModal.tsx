import { useEffect } from 'react';
import type { ImageRecord } from '../types';
import CopyButton from './CopyButton';
import TagPill from './TagPill';

interface ImageModalProps {
  image: ImageRecord;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

export default function ImageModal({ image, onClose, onTagClick }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Modal content */}
      <div
        className="flex flex-col lg:flex-row gap-6 max-w-7xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <img
            src={image.url}
            alt={image.alt}
            className="max-w-full max-h-[70vh] lg:max-h-[85vh] object-contain rounded-lg"
          />
        </div>

        {/* Metadata panel */}
        <div className="lg:w-80 flex-shrink-0 bg-surface rounded-lg p-6 overflow-y-auto max-h-[50vh] lg:max-h-[85vh]">
          {/* Collection badge */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              image.collection === 'photography'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-purple-500/20 text-purple-400'
            }`}>
              {image.collection}
            </span>
          </div>

          {/* Alt text */}
          <p className="text-textPrimary text-sm mb-4">{image.alt}</p>

          {/* Dimensions */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-1">
              Dimensions
            </h3>
            <p className="text-textPrimary text-sm">
              {image.dimensions.width} × {image.dimensions.height} • {image.orientation}
            </p>
          </div>

          {/* Tags */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {image.tags.map((tag) => (
                <TagPill
                  key={tag}
                  tag={tag}
                  isActive={false}
                  onClick={() => {
                    onTagClick(tag);
                    onClose();
                  }}
                />
              ))}
            </div>
          </div>

          {/* Color palette */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-2">
              Color Palette
            </h3>
            <div className="flex gap-2">
              {image.colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded-md border border-border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] text-textSecondary font-mono">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source attribution */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-2">
              Source
            </h3>
            <div className="text-sm space-y-1">
              <p className="text-textPrimary">
                Photo by{' '}
                <a
                  href={image.source.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {image.source.photographer}
                </a>
              </p>
              <p className="text-textSecondary">
                via{' '}
                <a
                  href={image.source.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {image.source.platform}
                </a>
              </p>
              <p className="text-textSecondary">
                <a
                  href={image.source.license_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {image.source.license}
                </a>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-2">
              Quick Copy
            </h3>
            <CopyButton text={image.url} label="Copy URL" />
            <CopyButton text={image.thumb_url} label="Copy Thumbnail" />
            <CopyButton
              text={`background-image: url('${image.url}');\nbackground-size: cover;\nbackground-position: center;`}
              label="Copy as CSS Background"
            />
            <CopyButton
              text={`<img src="${image.url}" alt="${image.alt}" />`}
              label="Copy as HTML img"
            />
            <div className="pt-2">
              <a
                href={image.source.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-accent hover:bg-accentHover rounded-lg text-sm text-white font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open Original
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
