// Shared configuration constants
export const APP_CONSTANTS = {
  MAX_EDITABLE_DAYS: 5,
  STREAK_LOOKBACK_DAYS: 30, // Reduced from 365 for performance
  STREAK_CALCULATION_INTERVAL: 5000, // Debounce streak calculations (5 seconds)

  STREAK_THRESHOLDS: {
    LEGENDARY: 100,
    GOLD: 30,
    SILVER: 7,
    BRONZE: 3
  },

  CATEGORY_COLORS: {
    physical: {
      gradient: 'from-blue-500 to-blue-700',
      base: 'blue',
      rgb: '59, 130, 246'
    },
    mental: {
      gradient: 'from-purple-500 to-purple-700',
      base: 'purple',
      rgb: '139, 92, 246'
    },
    diet: {
      gradient: 'from-green-500 to-green-700',
      base: 'green',
      rgb: '16, 185, 129'
    }
  },

  ANIMATION: {
    BREATHING_DURATION: 4000,
    PULSE_DURATION: 1500,
    PERFECT_DURATION: 1000,
    TRANSITION_DURATION: 300
  }
} as const;