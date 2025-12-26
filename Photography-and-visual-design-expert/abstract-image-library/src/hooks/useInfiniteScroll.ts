import { useEffect, useRef, useCallback } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore) {
        callback();
      }
    },
    [callback, hasMore]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  return { sentinelRef };
}
