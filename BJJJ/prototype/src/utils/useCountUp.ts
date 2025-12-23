import { useState, useEffect, useRef } from 'react';

/**
 * easeOutQuart - Fast start, slow finish
 * Perfect for count-up animations that feel snappy
 */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

interface UseCountUpOptions {
  /** Duration in milliseconds (default: 500) */
  duration?: number;
  /** Start value (default: 0) */
  startValue?: number;
  /** Delay before starting in ms (default: 0) */
  delay?: number;
  /** Whether to trigger animation (default: true) */
  enabled?: boolean;
}

/**
 * Hook for animating numbers from startValue to endValue
 * Uses easeOutQuart for a snappy, satisfying feel
 *
 * @example
 * const count = useCountUp(127);
 * return <span>{count}</span>;
 */
export function useCountUp(
  endValue: number,
  options: UseCountUpOptions = {}
): number {
  const {
    duration = 500,
    startValue = 0,
    delay = 0,
    enabled = true,
  } = options;

  const [currentValue, setCurrentValue] = useState(enabled ? startValue : endValue);
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!enabled || hasAnimated.current) {
      setCurrentValue(endValue);
      return;
    }

    const startAnimation = () => {
      const startTime = performance.now();
      hasAnimated.current = true;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(startValue + (endValue - startValue) * easedProgress);

        setCurrentValue(current);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentValue(endValue);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [endValue, duration, startValue, delay, enabled]);

  return currentValue;
}

/**
 * Hook for animating percentages with optional suffix
 *
 * @example
 * const progress = useCountUpPercent(85.5);
 * return <span>{progress}%</span>;
 */
export function useCountUpPercent(
  endValue: number,
  options: UseCountUpOptions & { decimals?: number } = {}
): string {
  const { decimals = 0, ...countUpOptions } = options;
  const multiplier = Math.pow(10, decimals);
  const animatedValue = useCountUp(
    Math.round(endValue * multiplier),
    { ...countUpOptions, startValue: (options.startValue ?? 0) * multiplier }
  );
  return (animatedValue / multiplier).toFixed(decimals);
}
