import { useState, useEffect, useRef, RefObject, useCallback } from 'react';

export interface UseScrollProgressOptions {
  /** Offset from top when element should start (in viewport height %). Default: 0 */
  offsetStart?: number;
  /** Offset from top when element should end (in viewport height %). Default: 0 */
  offsetEnd?: number;
}

export interface UseScrollProgressReturn<T extends HTMLElement> {
  /** Ref to attach to the target element */
  ref: RefObject<T>;
  /** Scroll progress from 0 to 1 */
  progress: number;
  /** Whether the element is currently in the scroll tracking range */
  isInRange: boolean;
}

/**
 * useScrollProgress
 *
 * Tracks scroll progress of an element as it moves through the viewport.
 * Returns a value from 0 (element just entered) to 1 (element just left).
 *
 * @param options - Configuration options
 * @returns Object with ref, progress (0-1), and isInRange boolean
 *
 * @example
 * const { ref, progress } = useScrollProgress();
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{ opacity: progress, transform: `translateX(${progress * 100}px)` }}
 *   >
 *     Animates based on scroll
 *   </motion.div>
 * );
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollProgressOptions = {}
): UseScrollProgressReturn<T> {
  const { offsetStart = 0, offsetEnd = 0 } = options;

  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [isInRange, setIsInRange] = useState(false);

  const calculateProgress = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate offsets in pixels
    const startOffset = windowHeight * (offsetStart / 100);
    const endOffset = windowHeight * (offsetEnd / 100);

    // Element enters when its top reaches (windowHeight - startOffset)
    // Element leaves when its bottom reaches endOffset
    const start = windowHeight - startOffset;
    const end = endOffset;

    const elementTop = rect.top;
    const elementBottom = rect.bottom;

    // Calculate progress
    // 0 = element top just entered viewport (at start position)
    // 1 = element bottom just left viewport (at end position)
    const totalDistance = start - end + rect.height;
    const currentPosition = start - elementTop;
    const rawProgress = currentPosition / totalDistance;

    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    setProgress(clampedProgress);
    setIsInRange(elementTop < start && elementBottom > end);
  }, [offsetStart, offsetEnd]);

  useEffect(() => {
    calculateProgress();

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);

  return { ref, progress, isInRange };
}

/**
 * usePageScrollProgress
 *
 * Tracks overall page scroll progress from 0 (top) to 1 (bottom).
 *
 * @returns Progress value from 0 to 1
 *
 * @example
 * const progress = usePageScrollProgress();
 *
 * return (
 *   <div style={{ width: `${progress * 100}%` }} className="progress-bar" />
 * );
 */
export function usePageScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = docHeight - windowHeight;

      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }

      const rawProgress = scrollTop / maxScroll;
      setProgress(Math.max(0, Math.min(1, rawProgress)));
    };

    calculateProgress();

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  return progress;
}

/**
 * useScrollVelocity
 *
 * Tracks scroll velocity (speed and direction).
 *
 * @returns Object with velocity (pixels per frame) and direction ('up' | 'down' | 'idle')
 */
export function useScrollVelocity(): {
  velocity: number;
  direction: 'up' | 'down' | 'idle';
} {
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down' | 'idle'>('idle');
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let rafId: number;

    const calculateVelocity = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime.current;

      if (timeDelta > 0) {
        const scrollDelta = currentScrollY - lastScrollY.current;
        const newVelocity = scrollDelta / timeDelta * 16; // Normalize to ~60fps

        setVelocity(Math.abs(newVelocity));

        if (scrollDelta > 0) {
          setDirection('down');
        } else if (scrollDelta < 0) {
          setDirection('up');
        } else {
          setDirection('idle');
        }
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      rafId = requestAnimationFrame(calculateVelocity);
    };

    rafId = requestAnimationFrame(calculateVelocity);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  return { velocity, direction };
}

export default useScrollProgress;
