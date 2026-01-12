import { useRef, useState, useCallback } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isSwiping: boolean;
}

export function useSwipe(handlers: SwipeHandlers, threshold = 30) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
  });

  const startTimeRef = useRef<number>(0);
  const hasMoved = useRef(false);
  const isMouseDown = useRef(false);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    startTimeRef.current = Date.now();
    hasMoved.current = false;
    setSwipeState({
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      isSwiping: true,
    });
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    hasMoved.current = true;
    setSwipeState(prev => ({
      ...prev,
      currentX: clientX,
      currentY: clientY,
    }));
  }, []);

  const handleEnd = useCallback(() => {
    // Get current state values for calculations
    setSwipeState(prev => {
      if (!prev.isSwiping) return prev;

      const deltaX = prev.currentX - prev.startX;
      const deltaY = prev.currentY - prev.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      const duration = Date.now() - startTimeRef.current;

      // Calculate velocity (pixels per ms) - quick flicks should trigger easier
      const velocity = Math.max(absX, absY) / Math.max(duration, 1);
      const isQuickFlick = velocity > 0.3; // Fast swipe
      const effectiveThreshold = isQuickFlick ? threshold * 0.5 : threshold;

      // Schedule handler calls after state update (outside the setter)
      setTimeout(() => {
        // Check for tap (short duration, minimal movement)
        if (!hasMoved.current || (absX < 10 && absY < 10 && duration < 300)) {
          handlers.onTap?.();
        }
        // Horizontal swipe - trigger if horizontal movement exceeds threshold
        // and is at least as strong as vertical (>= instead of >)
        else if (absX >= absY && absX > effectiveThreshold) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        }
        // Vertical swipe
        else if (absY > absX && absY > effectiveThreshold) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
        // Fallback: if there's clear directional intent but didn't meet threshold,
        // still trigger the swipe if movement is significant (>20px)
        else if (absX >= absY && absX > 20) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        }
        else if (absY > absX && absY > 20) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
        // If movement was less than threshold, treat as tap
        else if (absX < 15 && absY < 15) {
          handlers.onTap?.();
        }
      }, 0);

      return { ...prev, isSwiping: false };
    });
  }, [handlers, threshold]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Mouse events (for desktop testing)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isMouseDown.current = true;
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    if (!isMouseDown.current) return;
    isMouseDown.current = false;
    handleEnd();
  }, [handleEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isMouseDown.current) {
      isMouseDown.current = false;
      handleEnd();
    }
  }, [handleEnd]);

  // Click fallback for simple taps on desktop
  const handleClick = useCallback(() => {
    // Only trigger if we haven't already handled it via mouse events
    if (!hasMoved.current && !swipeState.isSwiping) {
      handlers.onTap?.();
    }
  }, [handlers, swipeState.isSwiping]);

  const deltaX = swipeState.currentX - swipeState.startX;
  const deltaY = swipeState.currentY - swipeState.startY;

  return {
    handlers: {
      // Touch events
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      // Mouse events
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
    },
    isSwiping: swipeState.isSwiping,
    deltaX,
    deltaY,
  };
}
