import { useState, useEffect, useRef, RefObject, useCallback } from 'react';

export interface MousePosition {
  /** Absolute X position in pixels */
  x: number;
  /** Absolute Y position in pixels */
  y: number;
  /** Normalized X position (0-1) relative to target or window */
  normalizedX: number;
  /** Normalized Y position (0-1) relative to target or window */
  normalizedY: number;
  /** X position relative to center (-0.5 to 0.5) */
  centerX: number;
  /** Y position relative to center (-0.5 to 0.5) */
  centerY: number;
  /** Whether the mouse is over the target element */
  isOver: boolean;
}

export interface UseMousePositionOptions {
  /** Whether to track globally or only on the target element. Default: false */
  global?: boolean;
  /** Whether to include touch events. Default: true */
  includeTouch?: boolean;
  /** Smoothing factor for lerped movement (0-1). Default: 1 (no smoothing) */
  smoothing?: number;
}

/**
 * useMousePosition
 *
 * Tracks mouse position with various coordinate systems.
 * Can track globally or relative to a specific element.
 *
 * @param options - Configuration options
 * @returns Object with ref and position data
 *
 * @example
 * // Track mouse globally
 * const { position } = useMousePosition({ global: true });
 *
 * // Track mouse over specific element
 * const { ref, position } = useMousePosition<HTMLDivElement>();
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{
 *       transform: `rotateX(${position.centerY * 20}deg) rotateY(${position.centerX * 20}deg)`
 *     }}
 *   />
 * );
 */
export function useMousePosition<T extends HTMLElement = HTMLDivElement>(
  options: UseMousePositionOptions = {}
): { ref: RefObject<T>; position: MousePosition } {
  const { global = false, includeTouch = true, smoothing = 1 } = options;

  const ref = useRef<T>(null);
  const animationRef = useRef<number>();
  const targetPosition = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    centerX: 0,
    centerY: 0,
    isOver: false,
  });

  const updatePosition = useCallback(
    (clientX: number, clientY: number, isOver: boolean) => {
      let x = clientX;
      let y = clientY;
      let width = window.innerWidth;
      let height = window.innerHeight;

      if (!global && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
        width = rect.width;
        height = rect.height;
      }

      const normalizedX = width > 0 ? x / width : 0;
      const normalizedY = height > 0 ? y / height : 0;
      const centerX = normalizedX - 0.5;
      const centerY = normalizedY - 0.5;

      targetPosition.current = { x, y };

      if (smoothing >= 1) {
        setPosition({
          x,
          y,
          normalizedX,
          normalizedY,
          centerX,
          centerY,
          isOver,
        });
      } else {
        // Let animation frame handle smoothed updates
        setPosition((prev) => ({
          ...prev,
          normalizedX,
          normalizedY,
          centerX,
          centerY,
          isOver,
        }));
      }
    },
    [global, smoothing]
  );

  // Smooth animation loop
  useEffect(() => {
    if (smoothing >= 1) return;

    const animate = () => {
      setPosition((prev) => {
        const dx = targetPosition.current.x - prev.x;
        const dy = targetPosition.current.y - prev.y;

        if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
          return prev;
        }

        const newX = prev.x + dx * smoothing;
        const newY = prev.y + dy * smoothing;

        return {
          ...prev,
          x: newX,
          y: newY,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [smoothing]);

  useEffect(() => {
    const element = global ? window : ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY, true);
    };

    const handleMouseLeave = () => {
      if (!global) {
        setPosition((prev) => ({ ...prev, isOver: false }));
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (!global) {
        updatePosition(e.clientX, e.clientY, true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!includeTouch || e.touches.length === 0) return;
      const touch = e.touches[0];
      updatePosition(touch.clientX, touch.clientY, true);
    };

    const handleTouchEnd = () => {
      if (!global) {
        setPosition((prev) => ({ ...prev, isOver: false }));
      }
    };

    if (global) {
      window.addEventListener('mousemove', handleMouseMove);
      if (includeTouch) {
        window.addEventListener('touchmove', handleTouchMove);
      }
    } else {
      const el = element as HTMLElement;
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseenter', handleMouseEnter);
      if (includeTouch) {
        el.addEventListener('touchmove', handleTouchMove);
        el.addEventListener('touchend', handleTouchEnd);
      }
    }

    return () => {
      if (global) {
        window.removeEventListener('mousemove', handleMouseMove);
        if (includeTouch) {
          window.removeEventListener('touchmove', handleTouchMove);
        }
      } else {
        const el = element as HTMLElement;
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mouseenter', handleMouseEnter);
        if (includeTouch) {
          el.removeEventListener('touchmove', handleTouchMove);
          el.removeEventListener('touchend', handleTouchEnd);
        }
      }
    };
  }, [global, includeTouch, updatePosition]);

  return { ref, position };
}

/**
 * useMouseDistance
 *
 * Tracks distance from mouse to the center of an element.
 *
 * @returns Object with ref, distance in pixels, and normalized distance (0-1)
 */
export function useMouseDistance<T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T>;
  distance: number;
  normalizedDistance: number;
} {
  const ref = useRef<T>(null);
  const [distance, setDistance] = useState(0);
  const [normalizedDistance, setNormalizedDistance] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Normalize to max possible distance (diagonal of viewport)
      const maxDist = Math.sqrt(
        window.innerWidth ** 2 + window.innerHeight ** 2
      );
      const normalized = dist / maxDist;

      setDistance(dist);
      setNormalizedDistance(normalized);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { ref, distance, normalizedDistance };
}

export default useMousePosition;
