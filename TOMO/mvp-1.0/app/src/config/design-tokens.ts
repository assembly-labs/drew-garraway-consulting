/**
 * TOMO Design Tokens — React Native
 *
 * Converted from the CSS design system at docs/design-system/tokens.md
 * Use these instead of CSS variables in React Native StyleSheet.
 *
 * Usage:
 *   import { colors, spacing, typography } from '@/config/design-tokens';
 *
 *   const styles = StyleSheet.create({
 *     container: { backgroundColor: colors.black, padding: spacing.md },
 *     title: { ...typography.headline, color: colors.white },
 *   });
 */

import { TextStyle } from 'react-native';

// ===========================================
// COLORS
// ===========================================

export const colors = {
  // Primary
  black: '#111111',
  white: '#ffffff',
  gold: '#F5A623',
  goldDim: 'rgba(245, 166, 35, 0.15)',
  goldUltraDim: 'rgba(245, 166, 35, 0.04)',
  goldDimBorder: 'rgba(245, 166, 35, 0.2)',

  // Semantic
  positive: '#22c55e',
  positiveDim: 'rgba(34, 197, 94, 0.15)',
  negative: '#ef4444',
  negativeDim: 'rgba(239, 68, 68, 0.15)',
  negativeDimBorder: 'rgba(239, 68, 68, 0.3)',
  warning: '#f59e0b',
  warningDim: 'rgba(245, 158, 11, 0.15)',
  warningDimBorder: 'rgba(245, 158, 11, 0.3)',
  info: '#3b82f6',
  infoDim: 'rgba(59, 130, 246, 0.15)',
  purple: '#8B5CF6',
  purpleDim: 'rgba(139, 92, 246, 0.15)',

  // Toast backgrounds
  toastSuccess: '#1a2e1a',
  toastError: '#2e1a1a',
  toastWarning: '#2e2a1a',
  toastInfo: '#1a1a2e',

  // Dividers
  divider: '#2a2a2a',

  // Grayscale (all brightened for dark background readability)
  gray300: '#d4d4d4', // Tertiary text
  gray400: '#c4c4c4', // Muted text
  gray500: '#a3a3a3', // Labels
  gray600: '#8a8a8a', // Secondary labels
  gray700: '#4a4a4a', // Borders
  gray800: '#1f1f1f', // Card backgrounds
  gray900: '#161616', // Elevated surfaces

  // Belt colors
  beltWhite: '#FFFFFF',
  beltBlue: '#0033A0',
  beltPurple: '#4B0082',
  beltBrown: '#8B4513',
  beltBlack: '#000000',

  // Training mode colors
  trainingGi: '#3B82F6',
  trainingNogi: '#F97316',

} as const;

// ===========================================
// SPACING (4px base unit)
// ===========================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// ===========================================
// BORDER RADIUS
// ===========================================

export const radius = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,   // For cards in RN (slightly more than web)
  xl: 12,  // For buttons in RN
  full: 9999, // Pill shape
} as const;

// ===========================================
// TYPOGRAPHY
// ===========================================
// Note: Fonts must be loaded via expo-font before use.
// Unbounded, Inter, and JetBrains Mono need to be installed.
//
// Weight 400 is PROHIBITED — minimum is 500 (Medium).

export const fontSizes = {
  xs: 12,    // Minimum allowed — eyebrow labels only
  sm: 13,    // Secondary text, timestamps
  base: 15,  // Body text, descriptions
  lg: 17,    // Key information
  xl: 22,    // Section headers
  '2xl': 24, // Page titles
  '3xl': 32, // Large headings
  '4xl': 48, // Hero stats
  '5xl': 72, // Large hero numbers
} as const;

export const lineHeights = {
  none: 0.8,     // Hero numbers (multiply by fontSize)
  tight: 0.85,   // Large headings
  snug: 1.0,     // Compact text
  normal: 1.5,   // Body text
} as const;

// Pre-built typography styles for common use cases.
// Spread these into your StyleSheet: { ...typography.body }
export const typography: Record<string, TextStyle> = {
  body: {
    fontFamily: 'Inter',
    fontSize: fontSizes.base,
    fontWeight: '500',
    lineHeight: fontSizes.base * lineHeights.normal,
  },
} as const;

// ===========================================
// TOUCH TARGETS
// ===========================================
// Minimum sizes for interactive elements.
// Session logging (exhausted users): 56-80px
// Browse mode (relaxed users): 44px minimum

export const touchTargets = {
  minimum: 44,       // Absolute minimum (WCAG)
  secondary: 44,     // Browse-mode buttons
  primary: 56,       // Primary actions
  recording: 80,     // Record button, save button
} as const;

// ===========================================
// SHADOWS (for elevated surfaces)
// ===========================================

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // Android
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
} as const;

// ===========================================
// BELT COLOR HELPER
// ===========================================

// ===========================================
// SHARED COMPONENT STYLES
// ===========================================

export const pressedStyles = {
  card: { backgroundColor: '#252525' },
  button: { opacity: 0.85 },
  subtle: { opacity: 0.7 },
} as const;

// ===========================================
// BELT COLOR HELPER
// ===========================================

export function getBeltColor(belt: string): string {
  const map: Record<string, string> = {
    white: colors.beltWhite,
    blue: colors.beltBlue,
    purple: colors.beltPurple,
    brown: colors.beltBrown,
    black: colors.beltBlack,
  };
  return map[belt] ?? colors.beltWhite;
}

