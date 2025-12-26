import { useState, useEffect } from 'react';

/**
 * useReducedMotion
 *
 * Detects if the user has enabled reduced motion preferences in their OS settings.
 * Use this to provide accessible alternatives to animations.
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 *
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *     initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
 *   />
 * );
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * getReducedMotionVariant
 *
 * Helper function to get appropriate animation variant based on motion preference.
 *
 * @param prefersReducedMotion - whether user prefers reduced motion
 * @param fullVariant - the full animation variant
 * @param reducedVariant - the reduced motion variant (defaults to just opacity)
 * @returns the appropriate variant
 */
export function getReducedMotionVariant<T extends object>(
  prefersReducedMotion: boolean,
  fullVariant: T,
  reducedVariant?: Partial<T>
): T | Partial<T> {
  if (prefersReducedMotion) {
    return reducedVariant || { opacity: 1 } as Partial<T>;
  }
  return fullVariant;
}

export default useReducedMotion;
