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
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#111111', // matches design system --color-black
  },

  // --- iOS Configuration ---
  ios: {
    bundleIdentifier: 'com.drewgarraway.tomo',
    supportsTablet: false,
    infoPlist: {
      // Required for voice recording
      NSMicrophoneUsageDescription:
        'TOMO uses your microphone to record voice session logs after training.',
      // Required for gym finder
      NSLocationWhenInUseUsageDescription:
        'TOMO uses your location to find BJJ gyms near you.',
    },
    config: {
      usesNonExemptEncryption: false, // No custom encryption — simplifies App Store submission
    },
  },

  // --- Android (not MVP, but configure basics) ---
  android: {
    package: 'com.drewgarraway.tomo',
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundColor: '#111111',
    },
    permissions: ['RECORD_AUDIO'],
  },

  // --- Expo Plugins ---
  plugins: [
    'expo-asset',
    'expo-audio', // Voice recording (preferred over expo-av)
    'expo-location', // Gym finder — location permission
    [
      'expo-build-properties',
      {
        ios: {
          deploymentTarget: '16.0',
        },
      },
    ],
    [
      '@sentry/react-native',
      {
        organization: 'assembly-labs',
        project: 'react-native',
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
      projectId: '96937ab8-c6ad-476d-8fa6-fd1feb2c5823',
    },
  },

  // --- EAS Updates ---
  updates: {
    url: 'https://u.expo.dev/96937ab8-c6ad-476d-8fa6-fd1feb2c5823',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },

  // --- Scheme (for deep linking, future use) ---
  scheme: 'tomo',
});
