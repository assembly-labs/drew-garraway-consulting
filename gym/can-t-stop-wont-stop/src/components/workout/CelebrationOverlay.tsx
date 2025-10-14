import { useEffect } from 'react';
import type { Affirmation } from '../../services/affirmationService';

interface CelebrationOverlayProps {
  isVisible: boolean;
  affirmation: Affirmation | null;
  onDismiss: () => void;
}

/**
 * Celebration Overlay Component
 *
 * Full-screen green celebration when user completes and dismisses an exercise
 * - Shows for 3 seconds
 * - Displays affirmation message with emoji
 * - Inspired by Asana's task completion celebration
 */
const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isVisible,
  affirmation,
  onDismiss,
}) => {
  useEffect(() => {
    if (isVisible) {
      // Haptic feedback (single strong pulse)
      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }

      // Auto-dismiss after 3000ms
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible || !affirmation) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-semantic-success flex flex-col items-center justify-center"
      style={{
        animation: 'fadeIn 0.3s ease-in-out',
      }}
    >
      {/* Emoji */}
      {affirmation.emoji && (
        <div className="text-9xl mb-8 animate-bounce">
          {affirmation.emoji}
        </div>
      )}

      {/* Affirmation Message */}
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center px-8 text-shadow-display">
        {affirmation.message}
      </h1>

      {/* Subtle progress indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full"
          style={{
            animation: 'progressBar 3s linear',
          }}
        />
      </div>
    </div>
  );
};

export default CelebrationOverlay;
