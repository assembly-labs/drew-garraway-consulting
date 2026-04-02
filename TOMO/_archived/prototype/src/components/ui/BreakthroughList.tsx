/**
 * Breakthrough List Component
 *
 * Shows a history of detected breakthroughs in a compact, scrollable list.
 * Complements the BreakthroughHero (which shows the most significant one)
 * by displaying the full breakthrough history.
 *
 * Design: Dark cards with colored accents based on breakthrough type
 */

import { useMemo } from 'react';
import type { Breakthrough } from '../../utils/breakthrough-detection';

// ===========================================
// TYPES
// ===========================================

interface BreakthroughListProps {
  breakthroughs: Breakthrough[];
  maxVisible?: number;
  showEmptyState?: boolean;
  belt: string;
}

// ===========================================
// ICON COMPONENTS (smaller versions)
// ===========================================

function getIconSvg(iconType: Breakthrough['icon']) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (iconType) {
    case 'trophy':
      return (
        <svg {...props}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case 'flame':
      return (
        <svg {...props}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 'target':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'zap':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'trending-up':
      return (
        <svg {...props}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      );
    case 'award':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
  }
}

// ===========================================
// CONFIDENCE COLOR
// ===========================================

function getConfidenceColor(confidence: Breakthrough['confidence']): string {
  switch (confidence) {
    case 'high':
      return 'var(--color-gold)';
    case 'medium':
      return 'var(--color-success)';
    case 'low':
      return 'var(--color-gray-400)';
  }
}

// ===========================================
// BREAKTHROUGH ITEM
// ===========================================

function BreakthroughItem({ breakthrough }: { breakthrough: Breakthrough }) {
  const color = getConfidenceColor(breakthrough.confidence);
  const date = new Date(breakthrough.detectedAt);
  const timeAgo = getTimeAgo(date);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '20px 24px',
        borderBottom: '1px solid var(--color-gray-800)',
        background: 'linear-gradient(90deg, transparent 0%, transparent 100%)',
      }}
    >
      {/* Icon */}
      <div
        style={{
          flexShrink: 0,
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}
      >
        {getIconSvg(breakthrough.icon)}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontSize: 'var(--text-base)',
          fontWeight: 600,
          color: 'var(--color-white)',
          margin: '0 0 4px 0',
        }}>
          {breakthrough.title}
        </h4>

        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          margin: '0 0 8px 0',
          lineHeight: 1.5,
        }}>
          {breakthrough.description}
        </p>

        <span style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-gray-500)',
        }}>
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

// ===========================================
// EMPTY STATE
// ===========================================

function EmptyState({ belt }: { belt: string }) {
  const messages: Record<string, { title: string; description: string }> = {
    white: {
      title: 'Your Journey Begins',
      description: 'Keep training. Your first breakthrough is coming - we\'ll celebrate it when it happens.',
    },
    blue: {
      title: 'Building Momentum',
      description: 'Breakthroughs get detected as patterns emerge. Keep logging your sessions.',
    },
    purple: {
      title: 'Depth Over Breadth',
      description: 'At purple belt, breakthroughs are often subtle refinements. They\'re coming.',
    },
    brown: {
      title: 'Refining Mastery',
      description: 'The journey continues. New insights will emerge.',
    },
    black: {
      title: 'Endless Discovery',
      description: 'Even at black belt, the art reveals new layers.',
    },
  };

  const message = messages[belt] || messages.white;

  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        margin: '0 auto 20px',
        borderRadius: '50%',
        background: 'var(--color-gray-800)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-gray-500)',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      </div>
      <h3 style={{
        fontSize: 'var(--text-lg)',
        fontWeight: 600,
        color: 'var(--color-white)',
        margin: '0 0 8px 0',
      }}>
        {message.title}
      </h3>
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-gray-400)',
        maxWidth: '260px',
        margin: '0 auto',
        lineHeight: 1.6,
      }}>
        {message.description}
      </p>
    </div>
  );
}

// ===========================================
// HELPER
// ===========================================

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ===========================================
// MAIN COMPONENT
// ===========================================

export function BreakthroughList({
  breakthroughs,
  maxVisible = 5,
  showEmptyState = true,
  belt,
}: BreakthroughListProps) {
  // Sort by date (newest first) and limit
  const sortedBreakthroughs = useMemo(() => {
    return [...breakthroughs]
      .sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime())
      .slice(0, maxVisible);
  }, [breakthroughs, maxVisible]);

  return (
    <section
      style={{
        background: 'var(--color-black)',
        borderTop: '1px solid var(--color-gray-800)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '24px 24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--color-gold)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Breakthroughs
          </div>
          {breakthroughs.length > 0 && (
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              fontFamily: 'var(--font-mono)',
            }}>
              {breakthroughs.length} detected
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {sortedBreakthroughs.length > 0 ? (
        <div style={{ marginTop: '16px' }}>
          {sortedBreakthroughs.map((breakthrough) => (
            <BreakthroughItem
              key={breakthrough.id}
              breakthrough={breakthrough}
            />
          ))}

          {/* "View more" indicator */}
          {breakthroughs.length > maxVisible && (
            <div style={{
              padding: '16px 24px',
              textAlign: 'center',
              borderTop: '1px solid var(--color-gray-800)',
            }}>
              <span style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-gray-500)',
              }}>
                +{breakthroughs.length - maxVisible} more breakthroughs
              </span>
            </div>
          )}
        </div>
      ) : showEmptyState ? (
        <EmptyState belt={belt} />
      ) : null}
    </section>
  );
}

export default BreakthroughList;
