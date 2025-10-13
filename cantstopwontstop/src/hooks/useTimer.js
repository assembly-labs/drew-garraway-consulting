import { useState, useEffect, useRef } from 'react';

/**
 * NON-STOPPABLE TIMER HOOK
 * Uses Date.now() for accuracy - survives tab backgrounding
 * NEVER pauses or stops (except when reaching 00:00)
 */
export function useTimer(durationInSeconds, onComplete) {
  const [timeRemaining, setTimeRemaining] = useState(durationInSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const start = () => {
    if (isRunning) return;

    const now = Date.now();
    startTimeRef.current = now;
    endTimeRef.current = now + (durationInSeconds * 1000);
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    // Update every 100ms for smooth countdown
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = endTimeRef.current - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsRunning(false);
        clearInterval(intervalRef.current);
        onComplete?.();
        return;
      }

      setTimeRemaining(remaining);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onComplete]);

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeRemaining(durationInSeconds * 1000);
    setIsRunning(false);
    startTimeRef.current = null;
    endTimeRef.current = null;
  };

  return {
    timeRemaining,
    totalTime: durationInSeconds * 1000,
    isRunning,
    isComplete: timeRemaining === 0,
    start,
    reset,
  };
}
