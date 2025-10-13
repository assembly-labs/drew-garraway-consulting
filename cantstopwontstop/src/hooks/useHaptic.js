/**
 * Haptic feedback hook using Vibration API
 */
export function useHaptic() {
  const vibrate = (pattern) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const vibrateShort = () => vibrate(50);
  const vibrateMedium = () => vibrate(100);
  const vibrateLong = () => vibrate(200);

  /**
   * Pause button easter egg pattern
   */
  const vibratePauseWarning = () => vibrate([100, 50, 100, 50, 100]);

  /**
   * Success pattern
   */
  const vibrateSuccess = () => vibrate([50, 50, 50, 50, 100]);

  /**
   * Error pattern
   */
  const vibrateError = () => vibrate([200, 100, 200]);

  return {
    vibrate,
    vibrateShort,
    vibrateMedium,
    vibrateLong,
    vibratePauseWarning,
    vibrateSuccess,
    vibrateError,
  };
}
