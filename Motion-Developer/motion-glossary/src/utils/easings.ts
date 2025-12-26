/**
 * Motion Glossary - Easing Functions
 *
 * A collection of easing functions for CSS and JavaScript animations.
 * These can be used as CSS timing functions or with Framer Motion.
 */

// Standard CSS Easings
export const cssEasings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

// Custom Cubic Bezier Easings
export const cubicBezier = {
  // Smooth & Natural
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  smoothOut: 'cubic-bezier(0, 0, 0.2, 1)',
  smoothIn: 'cubic-bezier(0.4, 0, 1, 1)',

  // Snappy & Quick
  snappy: 'cubic-bezier(0.2, 0, 0, 1)',
  snappyOut: 'cubic-bezier(0, 0, 0, 1)',
  snappyIn: 'cubic-bezier(0.4, 0, 1, 1)',

  // Emphasized
  emphasized: 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',

  // Bounce & Elastic (approximations)
  bounceOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounceIn: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Overshoot
  overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  overshootStrong: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  // Slow Mo
  slowMo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  slowMoStart: 'cubic-bezier(0.7, 0, 0.84, 0)',
  slowMoEnd: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Power Curves
  power1In: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  power1Out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  power2In: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  power2Out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  power3In: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  power3Out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  power4In: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  power4Out: 'cubic-bezier(0.165, 0.84, 0.44, 1)',

  // Circular
  circIn: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  circOut: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  circInOut: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',

  // Expo
  expoIn: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  expoOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
  expoInOut: 'cubic-bezier(1, 0, 0, 1)',

  // Back
  backIn: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  backOut: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  backInOut: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Easing functions for JavaScript animations
export const easingFunctions = {
  linear: (t: number) => t,

  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

  easeInSine: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2,

  easeInCirc: (t: number) => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t: number) => Math.sqrt(1 - --t * t),
  easeInOutCirc: (t: number) =>
    t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInOutElastic: (t: number) => {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
          : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 +
            1;
  },

  easeInBounce: (t: number) => 1 - easingFunctions.easeOutBounce(1 - t),
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInOutBounce: (t: number) =>
    t < 0.5
      ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2,
} as const;

// Default export for convenience
export default {
  css: cssEasings,
  bezier: cubicBezier,
  fn: easingFunctions,
};
