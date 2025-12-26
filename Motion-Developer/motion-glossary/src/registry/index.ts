// Registry types
export * from './types';

// Animation registry entries - Attention & Emphasis
export { pulseEntry } from './animations/pulse';
export { bounceEntry } from './animations/bounce';
export { floatEntry } from './animations/float';
export { shakeEntry } from './animations/shake';

// Animation registry entries - Entrances & Exits
export { fadeInEntry } from './animations/fadeIn';
export { fadeInUpEntry } from './animations/fadeInUp';
export { fadeInDownEntry } from './animations/fadeInDown';
export { fadeInLeftEntry } from './animations/fadeInLeft';
export { fadeInRightEntry } from './animations/fadeInRight';
export { fadeInScaleEntry } from './animations/fadeInScale';
export { scaleInEntry } from './animations/scaleIn';
export { popInEntry } from './animations/popIn';
export { slideInEntry } from './animations/slideIn';
export { staggeredChildrenEntry } from './animations/staggeredChildren';

// Animation registry entries - Feedback & State
export { buttonPressEntry } from './animations/buttonPress';
export { buttonRippleEntry } from './animations/buttonRipple';
export { spinnerEntry } from './animations/spinner';
export { loadingDotsEntry } from './animations/loadingDots';
export { skeletonPulseEntry } from './animations/skeletonPulse';
export { successCheckEntry } from './animations/successCheck';
export { toggleSwitchEntry } from './animations/toggleSwitch';

// Animation registry entries - Text & Typography
export { typewriterEntry } from './animations/typewriter';
export { textRevealEntry } from './animations/textReveal';
export { countUpEntry } from './animations/countUp';

// Animation registry entries - Scroll-Driven
export { scrollFadeInEntry } from './animations/scrollFadeIn';
export { scrollProgressBarEntry } from './animations/scrollProgressBar';

// Animation registry entries - Ambient Backgrounds
export { gradientBackgroundEntry } from './animations/gradientBackground';

// Animation registry entries - Particle Effects
export { floatingParticlesEntry } from './animations/floatingParticles';
export { starfieldEntry } from './animations/starfield';
export { particleNetworkEntry } from './animations/particleNetwork';

// All animations for the gallery
import { pulseEntry } from './animations/pulse';
import { bounceEntry } from './animations/bounce';
import { floatEntry } from './animations/float';
import { shakeEntry } from './animations/shake';
import { fadeInEntry } from './animations/fadeIn';
import { fadeInUpEntry } from './animations/fadeInUp';
import { fadeInDownEntry } from './animations/fadeInDown';
import { fadeInLeftEntry } from './animations/fadeInLeft';
import { fadeInRightEntry } from './animations/fadeInRight';
import { fadeInScaleEntry } from './animations/fadeInScale';
import { scaleInEntry } from './animations/scaleIn';
import { popInEntry } from './animations/popIn';
import { slideInEntry } from './animations/slideIn';
import { staggeredChildrenEntry } from './animations/staggeredChildren';
import { buttonPressEntry } from './animations/buttonPress';
import { buttonRippleEntry } from './animations/buttonRipple';
import { spinnerEntry } from './animations/spinner';
import { loadingDotsEntry } from './animations/loadingDots';
import { skeletonPulseEntry } from './animations/skeletonPulse';
import { successCheckEntry } from './animations/successCheck';
import { toggleSwitchEntry } from './animations/toggleSwitch';
import { typewriterEntry } from './animations/typewriter';
import { textRevealEntry } from './animations/textReveal';
import { countUpEntry } from './animations/countUp';
import { scrollFadeInEntry } from './animations/scrollFadeIn';
import { scrollProgressBarEntry } from './animations/scrollProgressBar';
import { gradientBackgroundEntry } from './animations/gradientBackground';
import { floatingParticlesEntry } from './animations/floatingParticles';
import { starfieldEntry } from './animations/starfield';
import { particleNetworkEntry } from './animations/particleNetwork';
import { AnimationRegistryEntry } from './types';

/**
 * All registered animations (30 total)
 */
export const allAnimations: AnimationRegistryEntry[] = [
  // Attention & Emphasis
  pulseEntry,
  bounceEntry,
  floatEntry,
  shakeEntry,
  // Entrances & Exits
  fadeInEntry,
  fadeInUpEntry,
  fadeInDownEntry,
  fadeInLeftEntry,
  fadeInRightEntry,
  fadeInScaleEntry,
  scaleInEntry,
  popInEntry,
  slideInEntry,
  staggeredChildrenEntry,
  // Feedback & State
  buttonPressEntry,
  buttonRippleEntry,
  spinnerEntry,
  loadingDotsEntry,
  skeletonPulseEntry,
  successCheckEntry,
  toggleSwitchEntry,
  // Text & Typography
  typewriterEntry,
  textRevealEntry,
  countUpEntry,
  // Scroll-Driven
  scrollFadeInEntry,
  scrollProgressBarEntry,
  // Ambient Backgrounds
  gradientBackgroundEntry,
  // Particle Effects
  floatingParticlesEntry,
  starfieldEntry,
  particleNetworkEntry,
];

/**
 * Get animation by ID
 */
export const getAnimationById = (id: string): AnimationRegistryEntry | undefined => {
  return allAnimations.find((anim) => anim.id === id);
};

/**
 * Get animations by category
 */
export const getAnimationsByCategory = (category: string): AnimationRegistryEntry[] => {
  return allAnimations.filter((anim) => anim.category === category);
};

/**
 * Get all unique categories
 */
export const getAllCategories = (): string[] => {
  return [...new Set(allAnimations.map((anim) => anim.category))];
};

/**
 * Search animations by keyword
 */
export const searchAnimations = (query: string): AnimationRegistryEntry[] => {
  const q = query.toLowerCase();
  return allAnimations.filter(
    (anim) =>
      anim.name.toLowerCase().includes(q) ||
      anim.description.toLowerCase().includes(q) ||
      anim.keywords.some((k) => k.toLowerCase().includes(q))
  );
};
