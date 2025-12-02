import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SwipeHintProps {
  show: boolean;
  onDismiss: () => void;
}

export const SwipeHint: React.FC<SwipeHintProps> = ({ show, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-32 left-0 right-0 z-40 px-6"
        >
          <div className="glass rounded-2xl p-4 mx-auto max-w-sm shadow-xl border border-white/20">
            <div className="flex items-center gap-3">
              {/* Animated hand icon */}
              <motion.div
                animate={{
                  x: [0, 30, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-3xl"
              >
                👉
              </motion.div>

              <div className="flex-1">
                <p className="font-semibold text-gray-800">Swipe to Complete!</p>
                <p className="text-sm text-gray-600 mt-1">
                  Swipe habit cards right to mark them as done
                </p>
              </div>

              <button
                onClick={onDismiss}
                className="touch-target p-2"
                aria-label="Dismiss hint"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};