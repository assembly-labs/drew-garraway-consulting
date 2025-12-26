/**
 * Motion Glossary - Spring Configurations
 *
 * Pre-configured spring settings for Framer Motion animations.
 * Springs provide more natural, physics-based motion than easing curves.
 */

import type { SpringOptions } from 'framer-motion';

// Spring configuration type
export interface SpringConfig extends SpringOptions {
  type: 'spring';
}

/**
 * Gentle Spring
 * Soft, slow motion. Good for subtle UI elements.
 */
export const gentle: SpringConfig = {
  type: 'spring',
  stiffness: 120,
  damping: 14,
  mass: 1,
};

/**
 * Default Spring
 * Balanced spring for general purpose use.
 */
export const defaultSpring: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
  mass: 1,
};

/**
 * Snappy Spring
 * Quick and responsive. Good for button clicks and micro-interactions.
 */
export const snappy: SpringConfig = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
};

/**
 * Bouncy Spring
 * Playful with noticeable bounce. Good for notifications and emphasis.
 */
export const bouncy: SpringConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 10,
  mass: 1,
};

/**
 * Stiff Spring
 * Very quick with minimal bounce. Good for tooltips and popovers.
 */
export const stiff: SpringConfig = {
  type: 'spring',
  stiffness: 500,
  damping: 35,
  mass: 1,
};

/**
 * Wobbly Spring
 * Lots of oscillation. Good for playful, attention-grabbing animations.
 */
export const wobbly: SpringConfig = {
  type: 'spring',
  stiffness: 180,
  damping: 8,
  mass: 1,
};

/**
 * Slow Spring
 * Slow, dramatic motion. Good for page transitions.
 */
export const slow: SpringConfig = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1.5,
};

/**
 * Molasses Spring
 * Very slow and heavy. Good for dramatic reveals.
 */
export const molasses: SpringConfig = {
  type: 'spring',
  stiffness: 40,
  damping: 15,
  mass: 2,
};

/**
 * Elastic Spring
 * High oscillation with quick response. Good for rubber-band effects.
 */
export const elastic: SpringConfig = {
  type: 'spring',
  stiffness: 250,
  damping: 6,
  mass: 0.8,
};

/**
 * No Wobble Spring
 * Fast with no overshoot. Good for smooth, professional UI.
 */
export const noWobble: SpringConfig = {
  type: 'spring',
  stiffness: 200,
  damping: 26,
  mass: 1,
};

// Preset collections for common use cases
export const presets = {
  // UI Interactions
  button: snappy,
  toggle: snappy,
  hover: snappy,
  click: stiff,

  // Modals & Overlays
  modal: defaultSpring,
  drawer: defaultSpring,
  tooltip: stiff,
  dropdown: snappy,

  // Page Transitions
  pageEnter: gentle,
  pageExit: gentle,
  pageSlide: defaultSpring,

  // Notifications
  notification: bouncy,
  toast: snappy,
  alert: defaultSpring,

  // Lists & Cards
  listItem: snappy,
  card: defaultSpring,
  cardHover: snappy,

  // Micro-interactions
  like: bouncy,
  favorite: bouncy,
  check: snappy,
  iconHover: elastic,

  // Loading
  skeleton: gentle,
  spinner: noWobble,
  progress: noWobble,

  // Text
  characterReveal: snappy,
  wordReveal: defaultSpring,
  lineReveal: gentle,

  // Background
  ambient: molasses,
  parallax: slow,
  floating: gentle,
} as const;

// Helper function to create custom springs
export const createSpring = (
  stiffness: number,
  damping: number,
  mass: number = 1
): SpringConfig => ({
  type: 'spring',
  stiffness,
  damping,
  mass,
});

// Helper to adjust spring speed (multiplies stiffness)
export const adjustSpeed = (
  spring: SpringConfig,
  multiplier: number
): SpringConfig => ({
  ...spring,
  stiffness: spring.stiffness ? spring.stiffness * multiplier : 200 * multiplier,
});

// Helper to adjust spring bounciness (adjusts damping)
export const adjustBounce = (
  spring: SpringConfig,
  dampingRatio: number
): SpringConfig => ({
  ...spring,
  damping: spring.damping ? spring.damping * dampingRatio : 20 * dampingRatio,
});

// All springs export
export const springs = {
  gentle,
  default: defaultSpring,
  snappy,
  bouncy,
  stiff,
  wobbly,
  slow,
  molasses,
  elastic,
  noWobble,
  presets,
  createSpring,
  adjustSpeed,
  adjustBounce,
} as const;

export default springs;
