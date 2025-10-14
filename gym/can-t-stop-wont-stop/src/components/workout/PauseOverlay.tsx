import { useEffect } from 'react';

interface PauseOverlayProps {
  isVisible: boolean;
  onDismiss: () => void;
}

/**
 * Pause Button Easter Egg Component
 *
 * CRITICAL FEATURE:
 * - Full-screen red flashing overlay (z-index: 9999)
 * - Display: "FUCK YOU, NO STOPPING"
 * - Display: 🖕 emoji centered below text
 * - Haptic vibration: [100, 50, 100, 50, 100]ms
 * - Auto-dismiss after 2000ms
 * - Timer NEVER stops running (this component doesn't touch the timer)
 */
const PauseOverlay: React.FC<PauseOverlayProps> = ({ isVisible, onDismiss }) => {
  useEffect(() => {
    if (isVisible) {
      // Haptic feedback pattern: [100, 50, 100, 50, 100]ms
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }

      // Auto-dismiss after 2000ms
      const timer = setTimeout(() => {
        onDismiss();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-primary-red flex flex-col items-center justify-center"
      style={{
        animation: 'flash 0.5s ease-in-out 4',
      }}
    >
      {/* Main Message */}
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-8 mb-8 text-shadow-display">
        FUCK YOU,
        <br />
        NO STOPPING
      </h1>

      {/* Middle Finger Emoji */}
      <div className="text-8xl mb-8">
        🖕
      </div>

      {/* Timer Still Running Message */}
      <p className="text-xl text-white text-center px-8 opacity-90">
        Timer is still running
      </p>
    </div>
  );
};

export default PauseOverlay;
