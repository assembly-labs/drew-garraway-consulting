import { useState, useEffect, useRef } from 'react';

export const useTimer = (totalSeconds: number) => {
  const [remainingTime, setRemainingTime] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current - pausedTimeRef.current) / 1000);
      const remaining = totalSeconds - elapsed;

      setRemainingTime(remaining > 0 ? remaining : 0);

      if (remaining <= 0) {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds]);

  const start = () => {
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    pausedTimeRef.current += Date.now() - (startTimeRef.current + remainingTime * 1000);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setRemainingTime(totalSeconds);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    remainingTime,
    formattedTime: formatTime(remainingTime),
    isRunning,
    isUrgent: remainingTime < 300, // Less than 5 minutes
    start,
    pause,
    resume,
    stop,
  };
};
