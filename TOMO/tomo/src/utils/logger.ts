/**
 * TOMO — Logger Utility
 *
 * Guards console output behind __DEV__ so production builds are clean.
 * console.error always fires (Sentry picks these up).
 */

export const logger = {
  log: (...args: unknown[]) => {
    if (__DEV__) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (__DEV__) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors — Sentry integration captures these
    console.error(...args);
  },
};
