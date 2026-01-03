/**
 * App Configuration
 *
 * Central configuration for the BJJ Progress Tracker app.
 * Used for app metadata, feature flags, and environment settings.
 */

// ===========================================
// APP METADATA
// ===========================================

export const APP_CONFIG = {
  // App Identity
  name: 'BJJ Progress',
  displayName: 'BJJ Progress Tracker',
  description: 'Voice-first training journal for Brazilian Jiu-Jitsu practitioners',
  version: '1.0.0',
  buildNumber: '1',

  // Bundle Identifiers
  bundleId: {
    ios: 'com.bjjprogress.app',
    android: 'com.bjjprogress.app',
  },

  // URLs
  urls: {
    website: 'https://bjjprogress.app',
    support: 'https://bjjprogress.app/support',
    privacy: 'https://bjjprogress.app/privacy',
    terms: 'https://bjjprogress.app/terms',
  },

  // Contact
  contact: {
    supportEmail: 'support@bjjprogress.app',
    feedbackEmail: 'feedback@bjjprogress.app',
  },

  // Copyright
  copyright: `© ${new Date().getFullYear()} BJJ Progress`,
} as const;

// ===========================================
// FEATURE FLAGS
// ===========================================

export const FEATURES = {
  // Voice features
  voiceLogging: true,
  voiceTranscription: false, // Enable when AssemblyAI is connected

  // Social features (future)
  gymConnection: false,
  coachFeatures: false,
  socialSharing: false,

  // Analytics
  crashReporting: false, // Enable when Sentry is set up
  analytics: false, // Enable when PostHog is set up

  // Monetization (future)
  subscriptions: false,
  premiumFeatures: false,

  // Platform-specific
  appleSignIn: false, // Enable in iOS build
  pushNotifications: false, // Enable when configured
  offlineSync: false, // Enable when implemented
} as const;

// ===========================================
// API CONFIGURATION
// ===========================================

export const API_CONFIG = {
  // Supabase (replace with real values when set up)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key',
  },

  // AssemblyAI (for voice transcription)
  // Chosen over OpenAI Whisper for:
  // - 24% better accuracy on proper nouns (BJJ terminology)
  // - 30% lower hallucination rate (important for exhausted users)
  // - Custom vocabulary support for BJJ terms
  // - $50 free credits (~135 hours for testing)
  assemblyai: {
    apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY || '',
    // Pricing tiers:
    // - Best: $0.0062/min ($0.37/hour) - recommended for accuracy
    // - Nano: $0.002/min ($0.12/hour) - budget option
    tier: 'best' as 'best' | 'nano',
    // Custom vocabulary for BJJ terms (configure when account is set up)
    customVocabulary: [
      // Positions
      'mount', 'guard', 'half guard', 'side control', 'back control', 'turtle',
      // Submissions
      'armbar', 'kimura', 'americana', 'omoplata', 'triangle', 'rear naked choke', 'guillotine',
      'darce', 'anaconda', 'arm triangle', 'ezekiel', 'heel hook', 'knee bar', 'toe hold',
      // Guards
      'closed guard', 'open guard', 'butterfly guard', 'spider guard', 'lasso guard',
      'de la riva', 'reverse de la riva', 'x guard', 'single leg x', 'rubber guard',
      'worm guard', 'lapel guard', '50/50',
      // Sweeps & techniques
      'scissor sweep', 'hip bump', 'flower sweep', 'berimbolo', 'leg drag',
      'knee slice', 'toreando', 'stack pass', 'over under', 'double under',
      // Training types
      'gi', 'no-gi', 'open mat', 'positional sparring', 'flow rolling',
    ],
  },

  // Timeouts
  timeouts: {
    default: 10000, // 10 seconds
    upload: 60000, // 60 seconds for audio upload
    transcription: 30000, // 30 seconds for transcription
  },
} as const;

// ===========================================
// UI CONFIGURATION
// ===========================================

/**
 * UI Configuration
 *
 * NOTE: For design tokens (colors, typography, spacing, motion), use:
 * import { colors, typography, spacing, motion } from './design-tokens';
 *
 * Source of truth: /internal-docs/design-system/tokens.md
 */
export const UI_CONFIG = {
  // Touch targets (for exhausted users)
  // See also: design-tokens.ts touchTargets
  touchTargets: {
    minimum: 44, // iOS minimum
    recommended: 56, // Our standard
    large: 80, // For primary actions
  },

  // Animation durations (ms)
  // See also: design-tokens.ts motion.duration
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Session logging
  logging: {
    maxVoiceDuration: 300, // 5 minutes max recording
    minVoiceDuration: 2, // 2 seconds minimum
    transcriptionTimeout: 30000, // 30 seconds
  },

  // Pagination
  pagination: {
    sessionsPerPage: 20,
    techniquesPerPage: 30,
  },
} as const;

// ===========================================
// BELT SYSTEM CONFIGURATION
// ===========================================

export const BELT_CONFIG = {
  // Belt order (for comparisons)
  order: ['white', 'blue', 'purple', 'brown', 'black'] as const,

  // Typical time between belts (months) - IBJJF minimums
  minimumTime: {
    white: 0,
    blue: 24, // 2 years at white
    purple: 18, // 1.5 years at blue
    brown: 18, // 1.5 years at purple
    black: 12, // 1 year at brown
  },

  // Maximum stripes per belt
  maxStripes: 4,

  // Stripe colors by belt
  stripeColor: {
    white: '#000000',
    blue: '#FFFFFF',
    purple: '#FFFFFF',
    brown: '#000000',
    black: '#FF0000', // Red for black belt degrees
  },
} as const;

// ===========================================
// PROGRESSIVE PROFILING CONFIG
// ===========================================

export const PROFILING_CONFIG = {
  // Session triggers for each question
  triggers: {
    trainingStartDate: 3,
    stripes: 5,
    gymName: 7,
    trainingGoals: 10,
    targetFrequency: 12,
    currentBeltDate: 15,
    birthYear: 18,
  },

  // Max skips before we stop asking
  maxSkips: 3,

  // Sessions between re-asking skipped questions
  reaskInterval: 3,
} as const;

// ===========================================
// ENVIRONMENT HELPERS
// ===========================================

export const ENV = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// ===========================================
// TYPE EXPORTS
// ===========================================

export type BeltLevel = (typeof BELT_CONFIG.order)[number];
export type FeatureFlag = keyof typeof FEATURES;
