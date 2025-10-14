import { useEffect, useRef, useCallback } from 'react';
import { useWorkout } from '../context/WorkoutContext';

/**
 * useTimer Hook
 *
 * CRITICAL IMPLEMENTATION:
 * - Uses Date.now() for accuracy (not just setInterval)
 * - Continues running if tab is backgrounded
 * - NEVER pauses or stops (except at 00:00)
 * - Survives component re-renders
 * - Updates every 100ms for smooth countdown
 */
export const useTimer = (onComplete?: () => void) => {
  const { timeRemaining, setTimeRemaining, isWorkoutActive, selectedDuration } = useWorkout();
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);

  // Initialize timer when workout becomes active
  useEffect(() => {
    if (isWorkoutActive && !endTimeRef.current && selectedDuration) {
      // Calculate end time using Date.now() for accuracy
      const now = Date.now();
      const durationMs = selectedDuration * 60 * 1000; // Convert minutes to milliseconds
      endTimeRef.current = now + durationMs;
      setTimeRemaining(selectedDuration * 60); // Set initial time in seconds
    }
  }, [isWorkoutActive, selectedDuration, setTimeRemaining]);

  // Timer tick function
  const tick = useCallback(() => {
    if (!endTimeRef.current) return;

    const now = Date.now();
    const remaining = endTimeRef.current - now;

    if (remaining <= 0) {
      // Timer reached 00:00
      setTimeRemaining(0);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (onComplete) {
        onComplete();
      }
    } else {
      // Update time remaining (convert ms to seconds)
      setTimeRemaining(Math.ceil(remaining / 1000));
    }
  }, [setTimeRemaining, onComplete]);

  // Start/stop interval based on workout state
  useEffect(() => {
    if (isWorkoutActive && endTimeRef.current) {
      // Start interval - update every 100ms for smooth countdown
      intervalRef.current = window.setInterval(tick, 100);

      return () => {
        // Cleanup interval on unmount
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isWorkoutActive, tick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timeRemaining,
    isActive: isWorkoutActive,
  };
};

export default useTimer;
