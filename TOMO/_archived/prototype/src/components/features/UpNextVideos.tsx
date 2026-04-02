/**
 * Up Next Videos Component
 *
 * Displays personalized video recommendations based on the active persona.
 * Features:
 * - Hero video with large thumbnail and personalized one-liner
 * - Supporting "Level Up" videos as smaller cards
 * - At-risk personas see psychological support videos
 * - Full-screen in-app video player (no external tabs)
 *
 * Reference: /internal-docs/personas/PERSONA_PROFILES.md
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import {
  getPersonaVideos,
  isAtRiskPersona,
  type PersonaVideoRecommendation,
  type PersonaVideoConfig,
} from '../../data/personaVideoRecommendations';
import type { PersonaKey } from '../../data/personas';
import { Icons } from '../ui/Icons';
import type { TechniqueVideo } from '../../types/techniqueVideos';

// ===========================================
// YOUTUBE THUMBNAIL WITH FALLBACK CHAIN
// ===========================================

/**
 * YouTube thumbnail URL patterns by quality:
 * - maxresdefault.jpg (1280×720) - HD videos only
 * - hqdefault.jpg (480×360) - Most videos
 * - mqdefault.jpg (320×180) - Guaranteed to exist
 */
type ThumbnailQuality = 'maxresdefault' | 'hqdefault' | 'mqdefault';

const THUMBNAIL_FALLBACK_CHAIN: ThumbnailQuality[] = [
  'maxresdefault',
  'hqdefault',
  'mqdefault',
];

interface YouTubeThumbnailProps {
  youtubeId: string;
  alt: string;
  style?: React.CSSProperties;
  /** Instructor name for placeholder fallback */
  instructor?: string;
}

function YouTubeThumbnail({ youtubeId, alt, style, instructor }: YouTubeThumbnailProps) {
  const [qualityIndex, setQualityIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  // Reset state when youtubeId changes
  useEffect(() => {
    setQualityIndex(0);
    setShowPlaceholder(false);
  }, [youtubeId]);

  const currentQuality = THUMBNAIL_FALLBACK_CHAIN[qualityIndex];
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/${currentQuality}.jpg`;

  const handleError = useCallback(() => {
    const nextIndex = qualityIndex + 1;
    if (nextIndex < THUMBNAIL_FALLBACK_CHAIN.length) {
      // Try next quality level
      setQualityIndex(nextIndex);
    } else {
      // All YouTube options exhausted, show CSS placeholder
      setShowPlaceholder(true);
    }
  }, [qualityIndex]);

  // CSS Placeholder - gradient with play icon
  if (showPlaceholder) {
    return (
      <div
        style={{
          ...style,
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
        }}
        aria-label={alt}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'rgba(245, 166, 35, 0.15)',
            border: '2px solid rgba(245, 166, 35, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icons.Play size={24} color="var(--color-gold)" />
        </div>
        {instructor && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {instructor}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={thumbnailUrl}
      alt={alt}
      onError={handleError}
      style={style}
    />
  );
}

// ===========================================
// FULL-SCREEN VIDEO PLAYER MODAL
// ===========================================

interface VideoPlayerModalProps {
  video: TechniqueVideo;
  onClose: () => void;
}

function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // YouTube embed URL with autoplay
  const embedUrl = `https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with close button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderBottom: '1px solid var(--color-gray-800)',
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-white)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {video.title}
          </h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-400)',
              margin: 0,
              marginTop: 2,
            }}
          >
            {video.instructor}
          </p>
        </div>

        <button
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            marginLeft: 12,
            border: 'none',
            background: 'var(--color-gray-800)',
            borderRadius: '50%',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label="Close video"
        >
          <Icons.Close size={24} color="var(--color-white)" />
        </button>
      </div>

      {/* Video container - takes remaining space */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
        }}
      >
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            maxHeight: 'calc(100vh - 80px)',
          }}
        />
      </div>
    </div>
  );
}

// ===========================================
// VIDEO CARD COMPONENT
// ===========================================

interface VideoCardProps {
  recommendation: PersonaVideoRecommendation;
  variant: 'hero' | 'compact';
  onPlay: (video: TechniqueVideo) => void;
}

function VideoCard({ recommendation, variant, onPlay }: VideoCardProps) {
  const { video, headline, oneLiner, category } = recommendation;

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    technique: 'var(--color-gold)',
    mindset: 'var(--color-blue-400, #60a5fa)',
    lifestyle: 'var(--color-positive)',
  };

  // Play video in full-screen modal
  const handleClick = () => {
    onPlay(video);
  };

  if (variant === 'hero') {
    return (
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Hero Thumbnail */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: 'var(--space-md)',
          }}
        >
          <YouTubeThumbnail
            youtubeId={video.youtube_id}
            alt={video.title}
            instructor={video.instructor}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Play Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              transition: 'background 0.2s ease',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 166, 35, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Icons.Play size={32} color="#111111" />
            </div>
          </div>

          {/* Duration Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              padding: '4px 8px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--color-white)',
            }}
          >
            {formatDuration(video.duration_seconds)}
          </div>

          {/* Category Tag */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              padding: '4px 10px',
              backgroundColor: categoryColors[category],
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: category === 'technique' ? '#111111' : '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {category}
          </div>
        </div>

        {/* Hero Content */}
        <div style={{ padding: '0 4px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-white)',
              margin: 0,
              marginBottom: 'var(--space-xs)',
            }}
          >
            {headline}
          </h3>

          <p
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              color: 'var(--color-gray-300)',
              margin: 0,
              marginBottom: 'var(--space-sm)',
              lineHeight: 1.5,
            }}
          >
            {oneLiner}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--color-gray-500)',
              }}
            >
              {video.instructor}
            </span>
          </div>
        </div>
      </button>
    );
  }

  // Compact variant for Level Up section
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-sm)',
        border: 'none',
        background: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'background 0.2s ease',
      }}
    >
      {/* Compact Thumbnail */}
      <div
        style={{
          position: 'relative',
          width: 120,
          minWidth: 120,
          aspectRatio: '16/9',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        <YouTubeThumbnail
          youtubeId={video.youtube_id}
          alt={video.title}
          instructor={video.instructor}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Play Icon Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <Icons.Play size={20} color="rgba(255, 255, 255, 0.9)" />
        </div>

        {/* Duration Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            padding: '2px 5px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 'var(--radius-xs)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--color-white)',
          }}
        >
          {formatDuration(video.duration_seconds)}
        </div>
      </div>

      {/* Compact Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 'var(--space-xs)',
          overflow: 'hidden',
        }}
      >
        <h4
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-white)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {headline}
        </h4>

        <p
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: 'var(--color-gray-400)',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {oneLiner}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: categoryColors[category],
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {category}
          </span>
          <span style={{ color: 'var(--color-gray-600)', fontSize: '11px' }}>
            |
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--color-gray-500)',
            }}
          >
            {video.instructor}
          </span>
        </div>
      </div>
    </button>
  );
}

// ===========================================
// MAIN COMPONENT
// ===========================================

interface UpNextVideosProps {
  /** Maximum number of level-up videos to show */
  maxLevelUpVideos?: number;
  /** Whether to show support videos for at-risk personas */
  showSupportSection?: boolean;
  /** Callback to open training feedback (optional) */
  onOpenFeedback?: () => void;
}

export function UpNextVideos({
  maxLevelUpVideos = 4,
  showSupportSection = true,
  onOpenFeedback,
}: UpNextVideosProps) {
  const { isDemoMode, activePersona } = useUserProfile();

  // State for currently playing video (full-screen modal)
  const [playingVideo, setPlayingVideo] = useState<TechniqueVideo | null>(null);

  // Handle video play - opens full-screen modal
  const handlePlayVideo = useCallback((video: TechniqueVideo) => {
    setPlayingVideo(video);
  }, []);

  // Handle close video modal
  const handleCloseVideo = useCallback(() => {
    setPlayingVideo(null);
  }, []);

  // Get persona-specific video config
  const videoConfig: PersonaVideoConfig | null = useMemo(() => {
    if (!isDemoMode || !activePersona) {
      // Default to blue-excelling for non-demo mode
      return getPersonaVideos('blue-excelling');
    }
    return getPersonaVideos(activePersona.key as PersonaKey);
  }, [isDemoMode, activePersona]);

  if (!videoConfig) {
    return null;
  }

  const { heroVideo, levelUpVideos, supportVideos } = videoConfig;
  const personaKey = activePersona?.key as PersonaKey | undefined;
  const showSupport = showSupportSection && personaKey && isAtRiskPersona(personaKey) && supportVideos;

  return (
    <>
      {/* Full-screen video player modal */}
      {playingVideo && (
        <VideoPlayerModal video={playingVideo} onClose={handleCloseVideo} />
      )}
    <section
      style={{
        padding: 'var(--space-lg) var(--space-lg)',
        borderTop: '1px solid var(--color-gray-800)',
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-sm)',
        }}
      >
        <Icons.Play size={18} color="var(--color-gold)" />
        <h2
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--color-gold)',
            margin: 0,
          }}
        >
          Up Next
        </h2>
      </div>

      {/* Hero Video */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <VideoCard recommendation={heroVideo} variant="hero" onPlay={handlePlayVideo} />
      </div>

      {/* Level Up Section */}
      <div style={{ marginBottom: showSupport ? 'var(--space-xl)' : 0 }}>
        <h3
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--color-gray-500)',
            margin: 0,
            marginBottom: 'var(--space-md)',
          }}
        >
          Level Up
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          {levelUpVideos.slice(0, maxLevelUpVideos).map((rec, index) => (
            <VideoCard key={index} recommendation={rec} variant="compact" onPlay={handlePlayVideo} />
          ))}
        </div>
      </div>

      {/* Support Section (At-Risk Only) */}
      {showSupport && supportVideos && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-md)',
            }}
          >
            <Icons.Heart size={14} color="var(--color-positive)" />
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-positive)',
                margin: 0,
              }}
            >
              When It Gets Hard
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}
          >
            {supportVideos.slice(0, 3).map((rec, index) => (
              <VideoCard key={`support-${index}`} recommendation={rec} variant="compact" onPlay={handlePlayVideo} />
            ))}
          </div>
        </div>
      )}

      {/* Ask Coach Reminder */}
      <div style={{
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-md)',
        borderLeft: '3px solid var(--color-gray-600)',
        marginTop: 'var(--space-xl)',
      }}>
        <p style={{
          color: 'var(--color-gray-400)',
          fontSize: 'var(--text-sm)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          Your coach knows your game best. Use these as starting points.
        </p>
      </div>

      {/* Training Feedback CTA */}
      {onOpenFeedback && (
        <button
          onClick={onOpenFeedback}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gray-700)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            marginTop: 'var(--space-lg)',
            minHeight: 64,
          }}
        >
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-gray-800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-white)',
            }}>
              Get Training Feedback
            </div>
            <div style={{
              color: 'var(--color-gray-500)',
              fontSize: 'var(--text-xs)',
            }}>
              AI insights from your session logs
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-gray-600)"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </section>
    </>
  );
}

export default UpNextVideos;
