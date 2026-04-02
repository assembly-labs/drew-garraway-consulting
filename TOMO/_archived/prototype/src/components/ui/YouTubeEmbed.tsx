/**
 * YouTubeEmbed Component
 *
 * Mobile-optimized YouTube video embed with thumbnail-first loading.
 * Shows thumbnail initially, loads iframe only when user taps play.
 * This reduces initial page weight and respects tired users' bandwidth.
 */

import { useState, useCallback } from 'react';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  instructor?: string;
  duration?: number; // in seconds
  aspectRatio?: '16:9' | '4:3';
  showInfo?: boolean;
  autoplay?: boolean;
  onPlay?: () => void;
}

/**
 * Format duration from seconds to mm:ss
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get YouTube thumbnail URL
 * mqdefault = 320x180, hqdefault = 480x360, maxresdefault = 1280x720
 */
function getThumbnailUrl(videoId: string, quality: 'mq' | 'hq' | 'maxres' = 'hq'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

export function YouTubeEmbed({
  videoId,
  title,
  instructor,
  duration,
  aspectRatio = '16:9',
  showInfo = true,
  autoplay = true,
  onPlay,
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handleThumbnailError = useCallback(() => {
    setThumbnailError(true);
  }, []);

  const aspectRatioValue = aspectRatio === '16:9' ? '56.25%' : '75%';

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingBottom: aspectRatioValue,
    backgroundColor: 'var(--color-gray-900)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };

  // When playing, show the iframe
  if (isPlaying) {
    return (
      <div style={containerStyle}>
        <iframe
          style={{
            ...contentStyle,
            border: 'none',
          }}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Thumbnail view with play button
  return (
    <div style={containerStyle}>
      {/* Thumbnail image */}
      <img
        src={thumbnailError ? getThumbnailUrl(videoId, 'mq') : getThumbnailUrl(videoId, 'hq')}
        alt={title}
        onError={handleThumbnailError}
        style={{
          ...contentStyle,
          objectFit: 'cover',
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div
        style={{
          ...contentStyle,
          background: 'var(--overlay-gradient-video)',
        }}
      />

      {/* Play button */}
      <button
        onClick={handlePlay}
        aria-label={`Play ${title}`}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-gold)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.1s ease, box-shadow 0.2s ease',
          boxShadow: 'var(--shadow-video)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
        }}
      >
        {/* Play icon triangle */}
        <svg
          width="24"
          height="28"
          viewBox="0 0 24 28"
          fill="none"
          style={{ marginLeft: '4px' }}
        >
          <path
            d="M22 14L2 26V2L22 14Z"
            fill="var(--color-black)"
          />
        </svg>
      </button>

      {/* Video info overlay */}
      {showInfo && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'var(--space-md)',
            paddingTop: 'var(--space-xl)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-white)',
              lineHeight: 1.3,
              marginBottom: '4px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-300)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {instructor && <span>{instructor}</span>}
            {instructor && duration && <span>•</span>}
            {duration && <span>{formatDuration(duration)}</span>}
          </div>
        </div>
      )}

      {/* Duration badge (top right) */}
      {duration && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-sm)',
            right: 'var(--space-sm)',
            padding: '4px 10px',
            backgroundColor: 'var(--overlay-heavy)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-white)',
          }}
        >
          {formatDuration(duration)}
        </div>
      )}
    </div>
  );
}

/**
 * Compact video thumbnail for lists/grids
 */
interface VideoThumbnailProps {
  videoId: string;
  title: string;
  instructor?: string;
  duration?: number;
  onClick?: () => void;
  isActive?: boolean;
}

export function VideoThumbnail({
  videoId,
  title,
  instructor,
  duration,
  onClick,
  isActive = false,
}: VideoThumbnailProps) {
  const [thumbnailError, setThumbnailError] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        backgroundColor: isActive ? 'var(--color-gold-dim)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background-color 0.15s ease',
      }}
      aria-label={`Play ${title}`}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: '120px',
          minWidth: '120px',
          aspectRatio: '16/9',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          backgroundColor: 'var(--color-gray-800)',
        }}
      >
        <img
          src={thumbnailError ? getThumbnailUrl(videoId, 'mq') : getThumbnailUrl(videoId, 'hq')}
          alt=""
          onError={() => setThumbnailError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Duration badge */}
        {duration && (
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              padding: '2px 6px',
              backgroundColor: 'var(--overlay-badge)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-white)',
            }}
          >
            {formatDuration(duration)}
          </div>
        )}
        {/* Play overlay */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--overlay-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
            <path d="M11 7L1 13V1L11 7Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: isActive ? 'var(--color-gold)' : 'var(--color-white)',
            lineHeight: 1.4,
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </div>
        {instructor && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {instructor}
          </div>
        )}
      </div>
    </button>
  );
}

export default YouTubeEmbed;
