import { useState, useEffect, useRef, RefObject } from 'react';

export interface UseInViewOptions {
  /** Threshold for intersection (0-1). Default: 0 */
  threshold?: number | number[];
  /** Root margin for intersection observer. Default: '0px' */
  rootMargin?: string;
  /** Only trigger once when element enters view. Default: false */
  triggerOnce?: boolean;
  /** Root element for intersection observer. Default: null (viewport) */
  root?: Element | null;
}

export interface UseInViewReturn<T extends HTMLElement> {
  /** Ref to attach to the target element */
  ref: RefObject<T>;
  /** Whether the element is currently in view */
  inView: boolean;
  /** The intersection entry object */
  entry: IntersectionObserverEntry | null;
}

/**
 * useInView
 *
 * Hook that detects when an element enters or leaves the viewport.
 * Perfect for triggering animations when elements scroll into view.
 *
 * @param options - Configuration options for the intersection observer
 * @returns Object containing ref, inView state, and entry
 *
 * @example
 * const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
 *   >
 *     Animates when 50% visible
 *   </motion.div>
 * );
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): UseInViewReturn<T> {
  const {
    threshold = 0,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce and already triggered, don't observe
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;

        setEntry(entry);

        if (triggerOnce) {
          if (isIntersecting && !hasTriggered.current) {
            setInView(true);
            hasTriggered.current = true;
            observer.unobserve(element);
          }
        } else {
          setInView(isIntersecting);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, root]);

  return { ref, inView, entry };
}

/**
 * useInViewCallback
 *
 * Similar to useInView but calls a callback when visibility changes.
 *
 * @param callback - Function to call when visibility changes
 * @param options - Configuration options
 * @returns Ref to attach to target element
 */
export function useInViewCallback<T extends HTMLElement = HTMLDivElement>(
  callback: (inView: boolean, entry: IntersectionObserverEntry) => void,
  options: UseInViewOptions = {}
): RefObject<T> {
  const {
    threshold = 0,
    rootMargin = '0px',
    triggerOnce = false,
    root = null,
  } = options;

  const ref = useRef<T>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (triggerOnce) {
          if (entry.isIntersecting && !hasTriggered.current) {
            callback(true, entry);
            hasTriggered.current = true;
            observer.unobserve(element);
          }
        } else {
          callback(entry.isIntersecting, entry);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [callback, threshold, rootMargin, triggerOnce, root]);

  return ref;
}

export default useInView;
