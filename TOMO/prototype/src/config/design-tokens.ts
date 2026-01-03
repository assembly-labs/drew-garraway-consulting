/**
 * TOMO Design Tokens
 *
 * THIS FILE IS DERIVED FROM THE DESIGN SYSTEM.
 * Source of truth: /internal-docs/design-system/tokens.md
 *
 * Typography System:
 * - Unbounded: Hero numbers, headlines (display font)
 * - Inter: Body text, descriptions (readable font)
 * - JetBrains Mono: Labels, data values (monospace)
 *
 * When the design system changes:
 * 1. Update /internal-docs/design-system/styles.css first
 * 2. Sync changes to /prototype/src/index.css
 * 3. Update this file to match
 *
 * NEVER modify this file directly without updating the design system first.
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Primary
  black: '#111111',
  white: '#FFFFFF',
  gold: '#F5A623',
  goldDim: 'rgba(245, 166, 35, 0.15)',
  goldGlow: 'rgba(245, 166, 35, 0.25)',

  // Semantic
  positive: '#22c55e',
  positiveDim: 'rgba(34, 197, 94, 0.15)',
  positiveGlow: 'rgba(34, 197, 94, 0.25)',
  negative: '#ef4444',
  negativeDim: 'rgba(239, 68, 68, 0.15)',
  negativeGlow: 'rgba(239, 68, 68, 0.25)',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Grayscale (lightened for dark backgrounds)
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#b3b3b3',
    500: '#8b8b8b',
    600: '#6b6b6b',
    700: '#4a4a4a',
    800: '#1f1f1f',
    900: '#161616',
  },

  // Belt colors (IBJJF standard)
  belt: {
    white: '#FFFFFF',
    blue: '#0033A0',
    purple: '#4B0082',
    brown: '#8B4513',
    black: '#000000',
  },

  // Training type colors
  training: {
    gi: '#3B82F6',
    nogi: '#F97316',
    openmat: '#A855F7',
    private: '#22C55E',
    competition: '#EF4444',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    display: 'Unbounded, sans-serif',  // Hero numbers, headlines
    heading: 'Unbounded, sans-serif',  // Page titles, section headers
    body: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',  // Body text
    mono: 'JetBrains Mono, SF Mono, Monaco, monospace',  // Labels, data
  },

  /**
   * Font weights
   * CRITICAL: Weight 400 is PROHIBITED. Minimum is 500.
   */
  fontWeight: {
    medium: 500,      // Body text (MINIMUM ALLOWED)
    semibold: 600,    // Subheadings, section titles
    bold: 700,        // Emphasis, card titles
    extrabold: 800,   // Primary headlines (PREFERRED)
    black: 900,       // Hero numbers only
  },

  /**
   * Font sizes in rem
   * CRITICAL: 12px (0.75rem) is the absolute minimum.
   */
  fontSize: {
    xs: '0.75rem',      // 12px - MINIMUM ALLOWED
    sm: '0.8125rem',    // 13px
    base: '0.9375rem',  // 15px
    lg: '1.0625rem',    // 17px
    xl: '1.375rem',     // 22px
    '2xl': '1.5rem',    // 24px
    '3xl': '2rem',      // 32px
    '4xl': '3rem',      // 48px
    '5xl': '4.5rem',    // 72px
    hero: '9rem',       // 144px
    mega: '11.25rem',   // 180px
  },

  lineHeight: {
    none: 0.8,      // Hero numbers
    tight: 0.85,    // Large headings
    snug: 1,        // Compact text
    normal: 1.5,    // Body text
  },

  letterSpacing: {
    tighter: '-0.05em',   // Mega numbers
    tight: '-0.04em',     // Hero numbers
    normal: '0',          // Default
    wide: '0.05em',       // Subheadings
    wider: '0.1em',       // Labels
    widest: '0.15em',     // Section titles
    ultra: '0.2em',       // Eyebrow labels
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

/**
 * Spacing scale (4px base unit)
 * Use these values for margins, padding, and gaps.
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

// =============================================================================
// BORDERS
// =============================================================================

export const borders = {
  radius: {
    none: '0',
    sm: '2px',    // Belt badges
    md: '4px',    // Buttons (rare)
    lg: '8px',    // Cards (rare)
    full: '9999px',
  },
} as const;

// =============================================================================
// MOTION
// =============================================================================

/**
 * Animation tokens
 * CRITICAL: Minimal motion. Users are exhausted post-training.
 * - No entrance animations
 * - No hover-only interactions
 * - Always respect prefers-reduced-motion
 */
export const motion = {
  duration: {
    instant: '0.1s',    // Button press
    fast: '0.15s',      // Focus states
    normal: '0.25s',    // Sheets, toasts
    slow: '0.5s',       // Progress fills
    emphasis: '2s',     // Achievement glow
  },

  easing: {
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
} as const;

// =============================================================================
// TOUCH TARGETS
// =============================================================================

/**
 * Minimum touch target sizes
 * CRITICAL: Exhausted users need large touch targets.
 */
export const touchTargets = {
  minimum: '44px',        // Secondary actions
  primary: '56px',        // Primary actions
  comfortable: '80px',    // FAB, major CTAs
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  md: '0 4px 12px rgba(0, 0, 0, 0.3)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.4)',
  button: '0 2px 4px rgba(0, 0, 0, 0.2)',
} as const;

// =============================================================================
// CSS VARIABLE ACCESSORS
// =============================================================================

/**
 * Helper to get CSS variable value
 * Use this when you need to reference a CSS variable in inline styles
 */
export const cssVar = (name: string): string => `var(--${name})`;

/**
 * Common CSS variable references
 * These map directly to the CSS custom properties in index.css
 */
export const cssVars = {
  // Colors
  colorBlack: cssVar('color-black'),
  colorWhite: cssVar('color-white'),
  colorGold: cssVar('color-gold'),
  colorPositive: cssVar('color-positive'),
  colorNegative: cssVar('color-negative'),

  // Typography
  fontDisplay: cssVar('font-display'),
  fontHeading: cssVar('font-heading'),
  fontBody: cssVar('font-body'),
  fontMono: cssVar('font-mono'),

  // Spacing
  spaceXs: cssVar('space-xs'),
  spaceSm: cssVar('space-sm'),
  spaceMd: cssVar('space-md'),
  spaceLg: cssVar('space-lg'),
  spaceXl: cssVar('space-xl'),
  space2xl: cssVar('space-2xl'),
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type FontSizeKey = keyof typeof typography.fontSize;
export type FontWeightKey = keyof typeof typography.fontWeight;
