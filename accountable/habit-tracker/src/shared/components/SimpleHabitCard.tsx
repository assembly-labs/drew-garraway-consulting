import { useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { DashboardCardProps } from '@/types';

export const SimpleHabitCard: React.FC<DashboardCardProps> = ({
  habit,
  isCompleted,
  onToggle,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const controls = useAnimation();

  const handleDragEnd = async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    // If dragged more than 50px in either direction, toggle
    if (Math.abs(info.offset.x) > 50 && !isCompleted) {
      // Show checkmark briefly before toggling
      setShowCheckmark(true);

      // Animate back to center
      await controls.start({
        x: 0,
        transition: { duration: 0.3, type: "spring", stiffness: 300 }
      });

      // Wait 300ms to show checkmark, then toggle (which will trigger exit animation)
      setTimeout(() => {
        onToggle();
      }, 300);
    } else {
      // Snap back if not dragged far enough
      controls.start({ x: 0, transition: { duration: 0.2 } });
    }
  };

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

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragStart={() => !isCompleted && setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileHover={!isCompleted ? { scale: 1.02 } : {}}
      whileTap={!isCompleted ? { scale: 0.98 } : {}}
      exit={{
        x: 300,
        opacity: 0,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      layout
      className={`
        relative overflow-hidden rounded-xl p-5
        transition-all duration-300 border
        ${colors.bg} ${colors.text} ${colors.border}
        ${!isCompleted ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        ${isDragging ? 'shadow-2xl scale-105' : 'shadow-lg hover:shadow-xl'}
      `}
      style={{
        touchAction: 'pan-y', // Allow vertical scrolling
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{habit.name}</h3>
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

      {/* Swipe indicator - only shows during drag */}
      {!isCompleted && isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm"
        >
          <span className="text-lg font-medium">Release to complete</span>
        </motion.div>
      )}
    </motion.div>
  );
};