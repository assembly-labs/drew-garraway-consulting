import { useState } from 'react';
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

  // Track the X position of the card during drag
  const x = useMotionValue(0);

  // Map x position to rotation (-15deg to +15deg)
  // When swiped right: positive rotation (clockwise tilt)
  // When swiped left: negative rotation (counter-clockwise tilt)
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  // Map x position to opacity (fades out as card moves away)
  // Starts fading when card moves beyond 50px in either direction
  const opacity = useTransform(
    x,
    [-200, -50, 0, 50, 200],
    [0.5, 1, 1, 1, 0.5]
  );

  /**
   * Handler for drag start
   * Sets isDragging state to show visual feedback
   */
  const handleDragStart = () => {
    if (isEnabled) {
      setIsDragging(true);
    }
  };

  /**
   * Handler for drag end
   * Determines whether to complete the swipe or snap back
   *
   * Swipe threshold: 50% of a 300px reference width = 150px
   * If dragged beyond threshold: animate off-screen and trigger completion
   * If not: snap back to center position
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

    const threshold = 150; // 50% of a 300px card width
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Determine swipe direction and strength
    const shouldSwipeOff = Math.abs(offset) > threshold || Math.abs(velocity) > 500;

    if (shouldSwipeOff) {
      // Calculate exit direction (maintain swipe direction)
      const exitX = offset > 0 ? 300 : -300;

      // Animate card off-screen
      x.set(exitX);

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
