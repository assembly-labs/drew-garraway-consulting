/**
 * BreakthroughHero Component
 *
 * A bold, full-width hero section that displays when there's a
 * breakthrough to celebrate. Designed to be the first thing users
 * see when they load the dashboard.
 *
 * Design Philosophy:
 * - Bold, typographic, attention-grabbing
 * - Gold accents on black background
 * - Matches Dashboard design language
 * - NO overlays/modals - inline hero section
 * - Belt-appropriate messaging
 */

import { useMemo } from 'react';
import type { Breakthrough } from '../../utils/breakthrough-detection';

// ===========================================
// TYPES
// ===========================================

interface BreakthroughHeroProps {
  breakthrough: Breakthrough;
  onDismiss?: () => void;
}

// ===========================================
// ICON COMPONENTS
// ===========================================

function TrophyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function getIcon(iconType: Breakthrough['icon']) {
  switch (iconType) {
    case 'trophy': return <TrophyIcon />;
    case 'flame': return <FlameIcon />;
    case 'target': return <TargetIcon />;
    case 'shield': return <ShieldIcon />;
    case 'zap': return <ZapIcon />;
    case 'trending-up': return <TrendingUpIcon />;
    case 'award': return <AwardIcon />;
    case 'check-circle': return <CheckCircleIcon />;
    default: return <TrophyIcon />;
  }
}

// ===========================================
// GRADIENT COLORS BY CONFIDENCE
// ===========================================

function getGradientColors(confidence: Breakthrough['confidence']): { primary: string; glow: string } {
  switch (confidence) {
    case 'high':
      return {
        primary: 'var(--color-gold)',
        glow: 'rgba(252, 211, 77, 0.25)',
      };
    case 'medium':
      return {
        primary: 'var(--color-positive)',
        glow: 'rgba(34, 197, 94, 0.2)',
      };
    case 'low':
      return {
        primary: 'var(--color-gray-300)',
        glow: 'rgba(255, 255, 255, 0.1)',
      };
  }
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function BreakthroughHero({ breakthrough, onDismiss }: BreakthroughHeroProps) {
  const colors = useMemo(() => getGradientColors(breakthrough.confidence), [breakthrough.confidence]);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 24px',
        overflow: 'hidden',
        background: 'var(--color-black)',
      }}
    >
      {/* Background glow effect */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150%',
          height: '80%',
          background: `radial-gradient(ellipse at center, ${colors.glow} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Animated pulse ring */}
      <div
        className="breakthrough-pulse"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: `2px solid ${colors.primary}`,
          opacity: 0.3,
          animation: 'pulse-ring 2s ease-out infinite',
        }}
      />

      {/* Content container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Top label */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.35em',
            color: colors.primary,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: '24px',
            height: '1px',
            background: colors.primary,
          }} />
          BREAKTHROUGH
          <span style={{
            display: 'inline-block',
            width: '24px',
            height: '1px',
            background: colors.primary,
          }} />
        </div>

        {/* Icon */}
        <div
          style={{
            color: colors.primary,
            marginBottom: '24px',
            filter: `drop-shadow(0 0 20px ${colors.glow})`,
          }}
        >
          {getIcon(breakthrough.icon)}
        </div>

        {/* Main stat (if available) */}
        {breakthrough.stat && (
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: 'clamp(64px, 20vw, 120px)',
                fontWeight: 800, /* Extra Bold for hero numbers */
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                background: `linear-gradient(180deg, ${colors.primary} 0%, rgba(255,255,255,0.6) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {breakthrough.stat.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-gray-400)',
                marginTop: '8px',
              }}
            >
              {breakthrough.stat.label}
            </div>
          </div>
        )}

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 8vw, 42px)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: '0 0 16px 0',
            lineHeight: 1.1,
            maxWidth: '320px',
          }}
        >
          {breakthrough.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-gray-300)',
            margin: '0 0 24px 0',
            maxWidth: '300px',
            lineHeight: 1.6,
          }}
        >
          {breakthrough.description}
        </p>

        {/* Belt context message */}
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderLeft: `3px solid ${colors.primary}`,
            maxWidth: '320px',
            textAlign: 'left',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-100)',
              margin: 0,
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}
          >
            {breakthrough.beltContext}
          </p>
        </div>

        {/* Confidence indicator (subtle) */}
        {breakthrough.confidence !== 'high' && (
          <div
            style={{
              marginTop: '24px',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: breakthrough.confidence === 'medium'
                  ? 'var(--color-positive)'
                  : 'var(--color-gray-500)',
              }}
            />
            {breakthrough.confidence === 'medium'
              ? 'Based on recent patterns'
              : 'Early signal'
            }
          </div>
        )}
      </div>

      {/* Dismiss button (optional) */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'var(--color-gray-400)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = 'var(--color-white)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'var(--color-gray-400)';
          }}
          aria-label="Continue to dashboard"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-gray-500)',
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          Scroll
        </span>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </section>
  );
}

// ===========================================
// COMPACT VARIANT (for secondary breakthroughs)
// ===========================================

interface BreakthroughCardProps {
  breakthrough: Breakthrough;
  onClick?: () => void;
}

export function BreakthroughCard({ breakthrough, onClick }: BreakthroughCardProps) {
  const colors = getGradientColors(breakthrough.confidence);

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '20px 24px',
        background: `linear-gradient(135deg, ${colors.glow} 0%, transparent 100%)`,
        borderLeft: `3px solid ${colors.primary}`,
        border: 'none',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          color: colors.primary,
          flexShrink: 0,
        }}
      >
        <div style={{ width: 32, height: 32 }}>
          {getIcon(breakthrough.icon)}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: colors.primary,
            marginBottom: '4px',
          }}
        >
          Breakthrough
        </div>
        <div
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-white)',
            marginBottom: '4px',
          }}
        >
          {breakthrough.title}
        </div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-gray-400)',
          }}
        >
          {breakthrough.description}
        </div>
      </div>

      {/* Stat badge */}
      {breakthrough.stat && (
        <div
          style={{
            flexShrink: 0,
            textAlign: 'right',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: colors.primary,
              lineHeight: 1,
            }}
          >
            {breakthrough.stat.value}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {breakthrough.stat.label}
          </div>
        </div>
      )}
    </button>
  );
}

export default BreakthroughHero;
