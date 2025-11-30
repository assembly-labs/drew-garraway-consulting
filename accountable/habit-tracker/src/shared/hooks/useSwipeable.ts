import { useState, useEffect } from 'react';
import { useMotionValue, useTransform, PanInfo } from 'framer-motion';

/**
 * Custom hook for Tinder-style swipe animations
 *
 * Returns motion values and handlers for creating smooth swipe interactions
 * with rotation, opacity, and position transforms based on drag distance.
 */
export const useSwipeable = (
  onSwipeComplete: () => void,
  isEnabled: boolean = true
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasVibratedAt30, setHasVibratedAt30] = useState(false);
  const [hasVibratedAt70, setHasVibratedAt70] = useState(false);

  // Track the X position of the card during drag
  const x = useMotionValue(0);

  // Map x position to rotation (-15deg to +15deg)
  // When swiped right: positive rotation (clockwise tilt)
  // When swiped left: negative rotation (counter-clockwise tilt)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  // Map x position to opacity (fades out as card moves away)
  // Starts fading when card moves beyond 30px in either direction for earlier feedback
  const opacity = useTransform(
    x,
    [-200, -30, 0, 30, 200],
    [0.4, 1, 1, 1, 0.4]
  );

  // Monitor drag distance for haptic feedback
  useEffect(() => {
    const unsubscribe = x.on('change', (latest) => {
      const absX = Math.abs(latest);

      // Light haptic at 30px
      if (absX >= 30 && absX < 35 && !hasVibratedAt30 && isDragging) {
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }
        setHasVibratedAt30(true);
      }

      // Medium haptic at 70px
      if (absX >= 70 && absX < 75 && !hasVibratedAt70 && isDragging) {
        if ('vibrate' in navigator) {
          navigator.vibrate([30, 20, 30]);
        }
        setHasVibratedAt70(true);
      }
    });

    return () => unsubscribe();
  }, [x, hasVibratedAt30, hasVibratedAt70, isDragging]);

  /**
   * Handler for drag start
   * Sets isDragging state to show visual feedback
   * Resets haptic feedback flags for new drag
   */
  const handleDragStart = () => {
    if (isEnabled) {
      setIsDragging(true);
      setHasVibratedAt30(false);
      setHasVibratedAt70(false);
    }
  };

  /**
   * Handler for drag end
   * Determines whether to complete the swipe or snap back
   *
   * Swipe threshold: Reduced to 100px for easier completion
   * Velocity threshold: Reduced to 300 for more responsive swipes
   * If dragged beyond threshold: animate off-screen and trigger completion
   * If not: snap back to center position with spring animation
   */
  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    if (!isEnabled) {
      // Reset position if not enabled
      x.set(0);
      return;
    }

    const threshold = 100; // Lowered from 150px for easier completion
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Determine swipe direction and strength (lower velocity threshold for better responsiveness)
    const shouldSwipeOff = Math.abs(offset) > threshold || Math.abs(velocity) > 300;

    if (shouldSwipeOff) {
      // Calculate exit direction (maintain swipe direction)
      const exitX = offset > 0 ? 300 : -300;

      // Animate card off-screen
      x.set(exitX);

      // Success haptic feedback pattern
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 100]);
      }

      // Trigger completion callback after animation starts
      // Slight delay allows the animation to be visible
      setTimeout(() => {
        onSwipeComplete();
      }, 150);
    } else {
      // Snap back to center with spring animation
      x.set(0);
    }
  };

  /**
   * Reset function to programmatically reset card position
   * Useful for undo functionality or manual resets
   */
  const reset = () => {
    x.set(0);
  };

  return {
    // Motion values for binding to motion components
    x,
    rotate,
    opacity,

    // State
    isDragging,

    // Handlers
    handleDragStart,
    handleDragEnd,

    // Utility
    reset,
  };
};
