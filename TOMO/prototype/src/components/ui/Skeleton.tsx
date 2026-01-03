/**
 * Skeleton Loading Components
 *
 * Placeholder components shown while content is loading.
 * Provides visual feedback and maintains layout stability.
 */

import type { CSSProperties } from 'react';

// ===========================================
// BASE SKELETON
// ===========================================

interface SkeletonProps {
  /** Width (default: 100%) */
  width?: string | number;
  /** Height (default: 20px) */
  height?: string | number;
  /** Border radius (default: md) */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Additional inline styles */
  style?: CSSProperties;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

const radiusMap = {
  none: '0',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: 'var(--radius-full)',
};

export function Skeleton({
  width = '100%',
  height = 20,
  radius = 'md',
  style,
  'aria-label': ariaLabel = 'Loading...',
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: radiusMap[radius],
        background: 'linear-gradient(90deg, var(--color-gray-800) 25%, var(--color-gray-700) 50%, var(--color-gray-800) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

// ===========================================
// SKELETON TEXT
// ===========================================

interface SkeletonTextProps {
  /** Number of lines */
  lines?: number;
  /** Width of last line (default: 60%) */
  lastLineWidth?: string;
  /** Line height */
  lineHeight?: number;
  /** Gap between lines */
  gap?: number;
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = 16,
  gap = 8,
}: SkeletonTextProps) {
  return (
    <div
      role="status"
      aria-label="Loading text..."
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
      }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 ? lastLineWidth : '100%'}
          aria-label=""
        />
      ))}
    </div>
  );
}

// ===========================================
// SKELETON CARD
// ===========================================

interface SkeletonCardProps {
  /** Show header area */
  showHeader?: boolean;
  /** Number of content lines */
  lines?: number;
  /** Card height (default: auto) */
  height?: string | number;
}

export function SkeletonCard({
  showHeader = true,
  lines = 2,
  height,
}: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading content..."
      style={{
        background: 'var(--color-gray-900)',
        border: '1px solid var(--color-gray-800)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
      }}
    >
      {showHeader && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-md)',
          }}
        >
          <Skeleton width={120} height={14} aria-label="" />
          <Skeleton width={60} height={24} radius="sm" aria-label="" />
        </div>
      )}
      <SkeletonText lines={lines} />
    </div>
  );
}

// ===========================================
// SKELETON SESSION CARD
// ===========================================

export function SkeletonSessionCard() {
  return (
    <div
      role="status"
      aria-label="Loading session..."
      style={{
        background: 'var(--color-gray-900)',
        border: '1px solid var(--color-gray-800)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-sm)',
        }}
      >
        <Skeleton width={100} height={14} aria-label="" />
        <Skeleton width={50} height={24} radius="sm" aria-label="" />
      </div>

      {/* Title */}
      <Skeleton width="70%" height={20} style={{ marginBottom: 'var(--space-xs)' }} aria-label="" />

      {/* Subtitle */}
      <Skeleton width={140} height={14} style={{ marginBottom: 'var(--space-sm)' }} aria-label="" />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <Skeleton width={32} height={24} aria-label="" />
          <Skeleton width={40} height={14} aria-label="" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
          <Skeleton width={20} height={24} aria-label="" />
          <Skeleton width={50} height={14} aria-label="" />
        </div>
      </div>
    </div>
  );
}

// ===========================================
// SKELETON STAT CARD
// ===========================================

export function SkeletonStatCard() {
  return (
    <div
      role="status"
      aria-label="Loading stat..."
      style={{
        background: 'var(--color-gray-900)',
        border: '1px solid var(--color-gray-800)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        textAlign: 'center',
      }}
    >
      <Skeleton width={80} height={48} style={{ margin: '0 auto var(--space-xs)' }} aria-label="" />
      <Skeleton width={60} height={12} style={{ margin: '0 auto' }} aria-label="" />
    </div>
  );
}

// ===========================================
// SKELETON DASHBOARD
// ===========================================

export function SkeletonDashboard() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard..."
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)',
        padding: 'var(--space-md)',
      }}
    >
      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 'var(--space-md)',
        }}
      >
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Main card */}
      <SkeletonCard showHeader lines={3} />

      {/* Session list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <Skeleton width={120} height={14} style={{ marginBottom: 'var(--space-xs)' }} aria-label="" />
        <SkeletonSessionCard />
        <SkeletonSessionCard />
      </div>
    </div>
  );
}

// ===========================================
// KEYFRAMES (add to index.css if not present)
// ===========================================

// Note: Add this CSS to index.css:
// @keyframes skeleton-shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }
