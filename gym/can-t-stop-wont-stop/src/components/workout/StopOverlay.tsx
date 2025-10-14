import { useEffect } from 'react';

interface StopOverlayProps {
  isVisible: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

/**
 * Stop Button Overlay Component
 *
 * Displays confirmation dialog when user wants to quit workout early
 * - Full-screen red flashing overlay (z-index: 9999)
 * - Message: "Are you absolutely sure you want to quit like a pansy?!"
 * - CTA: "I'm a bitch" button to confirm quit
 * - Haptic vibration on display
 * - Can dismiss to return to workout
 */
const StopOverlay: React.FC<StopOverlayProps> = ({ isVisible, onConfirm, onDismiss }) => {
  useEffect(() => {
    if (isVisible) {
      // Haptic feedback pattern
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-primary-red flex flex-col items-center justify-center px-6"
      style={{
        animation: 'flash 0.5s ease-in-out 4',
      }}
    >
      {/* Main Message */}
      <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 text-shadow-display leading-tight">
        Are you absolutely sure you want to quit like a pansy?!
      </h1>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="bg-primary-black text-white font-bold text-xl px-12 py-6 rounded-none border-4 border-white hover:bg-primary-black-secondary active:scale-95 transition-transform mb-6 shadow-red-glow"
      >
        I'm a bitch
      </button>

      {/* Dismiss Button */}
      <button
        onClick={onDismiss}
        className="text-white text-lg underline hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
      >
        Back to workout
      </button>
    </div>
  );
};

export default StopOverlay;
