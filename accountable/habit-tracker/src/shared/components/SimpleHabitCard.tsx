import { useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { DashboardCardProps } from '@/types';
import { useSwipeable } from '@/shared/hooks/useSwipeable';

export const SimpleHabitCard: React.FC<DashboardCardProps> = ({
  habit,
  isCompleted,
  onToggle,
  isEditable = true,
}) => {
  const [showCheckmark, setShowCheckmark] = useState(false);

  const categoryColors = {
    physical: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-200',
      icon: 'text-blue-400'
    },
    mental: {
      bg: 'bg-gradient-to-r from-purple-50 to-purple-100',
      text: 'text-purple-900',
      border: 'border-purple-200',
      icon: 'text-purple-400'
    },
    diet: {
      bg: 'bg-gradient-to-r from-green-50 to-green-100',
      text: 'text-green-900',
      border: 'border-green-200',
      icon: 'text-green-400'
    }
  };

  const colors = categoryColors[habit.category] || categoryColors.physical;

  /**
   * Custom hook for Tinder-style swipe behavior
   * Handles all drag physics, rotation, and opacity transforms
   */
  const {
    x,
    rotate,
    opacity,
    isDragging,
    handleDragStart,
    handleDragEnd,
  } = useSwipeable(
    () => {
      // Callback when swipe completes (card goes off-screen)
      if (!isCompleted) {
        setShowCheckmark(true);
        // Small delay to show checkmark before state update
        setTimeout(() => {
          onToggle();
        }, 150);
      }
    },
    isEditable && !isCompleted // Only enable swipe if editable and not completed
  );

  // Create transforms at component level to avoid conditional hook calls
  const progressBarWidth = useTransform(x, [0, 100], ['0%', '100%']);
  const swipeText = useTransform(
    x,
    [0, 30, 70, 100],
    ["Keep swiping", "Keep swiping", "Almost there!", "Release to complete!"]
  );

  return (
    <motion.div
      // Enable horizontal dragging only when editable and not completed
      drag={isEditable && !isCompleted ? "x" : false}

      // No constraints - allow card to move freely during drag
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1} // Allow natural movement beyond constraints
      dragMomentum={false} // Disable momentum for precise control

      // Drag handlers from useSwipeable hook
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}

      // Bind motion values for smooth transforms
      style={{
        x, // Horizontal position (controlled by drag)
        rotate, // Rotation based on x position (-15deg to +15deg)
        opacity, // Opacity fades as card moves away
        touchAction: 'pan-y', // Allow vertical scrolling on touch devices
      }}

      // Hover and tap animations for better UX feedback
      whileHover={isEditable && !isCompleted ? { scale: 1.02 } : {}}
      whileTap={isEditable && !isCompleted ? { scale: 0.98 } : {}}

      // Exit animation when card is removed from DOM (after completion)
      exit={{
        x: 300,
        opacity: 0,
        rotate: 15,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1] // Custom easing for smooth exit
        }
      }}

      // Animate layout changes smoothly
      layout

      // Transition for layout and scale animations
      transition={{
        layout: { duration: 0.3, ease: "easeInOut" },
        scale: { duration: 0.2 },
      }}

      className={`
        relative overflow-hidden rounded-xl p-5
        border
        ${colors.bg} ${colors.text} ${colors.border}
        ${isEditable && !isCompleted ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        ${isDragging ? 'shadow-2xl z-10' : 'shadow-lg hover:shadow-xl'}
        ${!isEditable ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {habit.name}
            {!isEditable && (
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </h3>
        </div>

        {showCheckmark || isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${colors.icon}`}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        ) : (
          <div className={`w-8 h-8 rounded-full border-2 ${colors.border}`} />
        )}
      </div>

      {/* Swipe progress bar at bottom */}
      {!isCompleted && isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-green-500"
            style={{
              width: progressBarWidth
            }}
          />
        </motion.div>
      )}

      {/* Swipe indicator overlay - shows during drag with animated entrance */}
      {!isCompleted && isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm rounded-xl pointer-events-none"
        >
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg
                className="w-8 h-8 text-white drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <motion.span className="text-sm font-semibold text-white drop-shadow-lg">
              {swipeText.get()}
            </motion.span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};