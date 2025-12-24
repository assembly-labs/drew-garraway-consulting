/**
 * Alliance BJJ App - Design System
 * Single source of truth for all design tokens
 *
 * This file centralizes all colors, typography, spacing, and component styles.
 * When updating the design system, only modify this file.
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const colors = {
  // Core brand colors
  primary: '#000000',
  primaryLight: '#333333',

  // Backgrounds
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#FAFAFA',

  // Text colors
  text: {
    primary: '#000000',
    secondary: '#737373',
    muted: '#A5A5A5',
    inverse: '#FFFFFF',
  },

  // Borders & dividers
  border: '#E5E5E5',
  divider: '#E5E5E5',

  // Status colors
  status: {
    success: {
      background: '#D4EDDA',
      text: '#155724',
      border: '#C3E6CB',
    },
    error: {
      background: '#F8D7DA',
      text: '#721C24',
      border: '#F5C6CB',
    },
    warning: {
      background: '#FFF3CD',
      text: '#856404',
      border: '#FFEEBA',
    },
    info: {
      background: '#D1ECF1',
      text: '#0C5460',
      border: '#BEE5EB',
    },
  },

  // Semantic colors
  danger: '#DC3545',
  link: '#0066CC',

  // Belt colors (for progress/ranking displays)
  belts: {
    white: '#FFFFFF',
    blue: '#0066CC',
    purple: '#6F42C1',
    brown: '#8B4513',
    black: '#000000',
  },
};

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  // Font sizes
  size: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
  },

  // Font weights
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
};

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// =============================================================================
// COMMON COMPONENT STYLES
// =============================================================================

export const componentStyles = {
  // Screen container
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Card component
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Header bar
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Primary button
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPrimaryText: {
    color: colors.text.inverse,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
  },

  // Secondary/outline button
  buttonSecondary: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonSecondaryText: {
    color: colors.text.primary,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
  },

  // Danger button
  buttonDanger: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDangerText: {
    color: colors.danger,
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },

  statusBadgeSuccess: {
    backgroundColor: colors.status.success.background,
  },

  statusBadgeSuccessText: {
    color: colors.status.success.text,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },

  // Input field
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.size.lg,
    color: colors.text.primary,
  },

  inputDisabled: {
    backgroundColor: colors.surfaceSecondary,
  },

  // Section header
  sectionHeader: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },

  // List item row
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // Avatar
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.text.inverse,
    fontSize: typography.size['3xl'],
    fontWeight: typography.weight.semibold,
  },

  // Small avatar for lists
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get belt color by belt name
 * @param {string} belt - Belt name (white, blue, purple, brown, black)
 * @returns {string} Hex color code
 */
export const getBeltColor = (belt) => {
  const beltLower = belt?.toLowerCase() || 'white';
  return colors.belts[beltLower] || colors.belts.white;
};

/**
 * Create a status style object
 * @param {'success' | 'error' | 'warning' | 'info'} status
 * @returns {object} Style object with backgroundColor and color
 */
export const getStatusStyle = (status) => {
  const statusColors = colors.status[status] || colors.status.info;
  return {
    container: {
      backgroundColor: statusColors.background,
      borderColor: statusColors.border,
    },
    text: {
      color: statusColors.text,
    },
  };
};

// =============================================================================
// DEFAULT EXPORT - FULL THEME OBJECT
// =============================================================================

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  componentStyles,
  getBeltColor,
  getStatusStyle,
};

export default theme;
