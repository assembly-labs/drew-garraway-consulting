// Easing functions for CSS and JavaScript animations
export {
  cssEasings,
  cubicBezier,
  easingFunctions,
  default as easings,
} from './easings';

// Spring configurations for Framer Motion
export {
  gentle,
  defaultSpring,
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
  springs,
  default as springsDefault,
} from './springs';

export type { SpringConfig } from './springs';
