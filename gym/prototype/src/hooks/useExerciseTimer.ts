import { useState, useEffect } from 'react';

export const useExerciseTimer = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    setElapsedTime(0);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const resume = () => {
    setIsRunning(true);
  };

  const reset = () => {
    setElapsedTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    elapsedTime,
    formattedTime: formatTime(elapsedTime),
    isRunning,
    start,
    pause,
    resume,
    reset,
  };
};
