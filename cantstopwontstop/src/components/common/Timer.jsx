export function Timer({ timeRemaining, totalTime }) {
  // Convert milliseconds to MM:SS format
  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Determine color based on remaining time
  const getTimerColor = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50) return 'text-timer-green';
    if (percentage > 25) return 'text-timer-yellow';
    return 'text-timer-red';
  };

  // Flash animation in final 60 seconds
  const shouldFlash = timeRemaining <= 60000 && timeRemaining > 0;

  return (
    <div className={`text-7xl font-mono font-bold text-center ${getTimerColor()} ${shouldFlash ? 'animate-pulse-fast' : ''}`}>
      {formatTime(timeRemaining)}
    </div>
  );
}
