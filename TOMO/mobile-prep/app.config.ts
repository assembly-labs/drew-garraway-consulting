/**
 * TOMO — Expo App Configuration
 *
 * This is the template for app.config.ts (dynamic config).
 * When you create the Expo project, replace the generated app.json
 * with this file for better flexibility.
 *
 * BEFORE USING: Replace placeholder values marked with TODO.
 *
 * Docs: https://docs.expo.dev/versions/latest/config/app/
 */

import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TOMO',
  slug: 'tomo',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark', // Dark theme app

  // --- App Icon & Splash ---
  // TODO: Replace with actual icon/splash after design (Phase 3, task 7.1)
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#111111', // matches design system --color-black
  },

  // --- iOS Configuration ---
  ios: {
    bundleIdentifier: 'com.drewgarraway.tomo', // TODO: confirm this is what you want
    supportsTablet: false,
    infoPlist: {
      // Required for voice recording
      NSMicrophoneUsageDescription:
        'TOMO uses your microphone to record voice session logs after training.',
    },
    config: {
      usesNonExemptEncryption: false, // No custom encryption — simplifies App Store submission
    },
    // Minimum iOS version
    // iOS 16 drops ~3% of users but simplifies development significantly
    deploymentTarget: '16.0',
  },

  // --- Android (not MVP, but configure basics) ---
  android: {
    package: 'com.drewgarraway.tomo',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#111111',
    },
    permissions: ['RECORD_AUDIO'],
  },

  // --- Expo Plugins ---
  plugins: [
    'expo-audio', // Voice recording (preferred over expo-av)
    'expo-router', // File-based routing (if using expo-router)
    'sentry-expo', // Crash reporting
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '16.0',
        },
      },
    ],
  ],

  // --- Environment Variables ---
  // These are embedded in the app binary — only put PUBLIC keys here.
  // Secret keys (Anthropic, AssemblyAI) stay in Supabase Edge Function secrets.
  extra: {
    supabaseUrl: process.env.SUPABASE_URL ?? 'https://whzycopfjvwmsgzfqvig.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoenljb3BmanZ3bXNnemZxdmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDc4OTIsImV4cCI6MjA4ODU4Mzg5Mn0.DK77hald-AaCUcY1AIz7t_MgSbn_LDNO0HcESt_vD8Y',
    // Sentry DSN is safe to embed (it's a public identifier, not a secret)
    sentryDsn: process.env.SENTRY_DSN ?? 'https://3ac2b9a99c8fd8b6cae3614b4d92d141@o4511011218849792.ingest.us.sentry.io/4511011232415744',
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? 'TODO_REPLACE',
    },
  },

  // --- EAS Updates ---
  updates: {
    url: 'TODO_REPLACE_AFTER_EAS_INIT',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },

  // --- Scheme (for deep linking, future use) ---
  scheme: 'tomo',
});
