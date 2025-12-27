import { motion, AnimatePresence } from 'framer-motion';
import { Cluster } from '@/data/models/Cluster';
import { useHabitStore } from '@/store/habitStore';
import { useMemo } from 'react';

interface ClusterNodeProps {
  cluster: Cluster;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export const ClusterNode: React.FC<ClusterNodeProps> = ({
  cluster,
  size = 'medium',
  showDetails = true
}) => {
  const completedHabits = useHabitStore(state => state.completedHabits);
  const toggleHabit = useHabitStore(state => state.toggleHabit);
  const currentDate = useHabitStore(state => state.currentDate);
  const isDateEditable = useHabitStore(state => state.isDateEditable);

  const isEditable = useMemo(() => {
    return isDateEditable(currentDate);
  }, [currentDate, isDateEditable]);

  const progress = useMemo(() => {
    const completed = cluster.habitIds.filter(id => completedHabits.has(id)).length;
    return {
      completed,
      required: cluster.requiredCount,
      total: cluster.habitIds.length
    };
  }, [cluster.habitIds, cluster.requiredCount, completedHabits]);

  const state = useMemo(() => {
    if (progress.completed >= progress.required) {
      return progress.completed === progress.total ? 'perfect' : 'active';
    }
    return progress.completed > 0 ? 'partial' : 'dormant';
  }, [progress]);

  const sizeConfig = {
    small: { node: 40, stroke: 2, fontSize: 'text-xs' },
    medium: { node: 80, stroke: 3, fontSize: 'text-sm' },
    large: { node: 120, stroke: 4, fontSize: 'text-base' }
  };

  const config = sizeConfig[size];

  const categoryColors = {
    physical: {
      gradient: 'from-blue-500 to-blue-700',
      base: 'blue',
      rgb: '59, 130, 246'
    },
    mental: {
      gradient: 'from-purple-500 to-purple-700',
      base: 'purple',
      rgb: '139, 92, 246'
    },
    diet: {
      gradient: 'from-green-500 to-green-700',
      base: 'green',
      rgb: '16, 185, 129'
    }
  };

  const colors = categoryColors[cluster.category];

  // Animation variants for different states
  const nodeVariants = {
    dormant: {
      scale: 1,
      opacity: 0.3,
    },
    partial: {
      scale: [1, 1.02, 1],
      opacity: 0.6,
      transition: {
        scale: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      }
    },
    active: {
      scale: [1, 1.05, 1],
      opacity: 1,
      transition: {
        scale: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      }
    },
    perfect: {
      scale: [1, 1.08, 1],
      opacity: 1,
      transition: {
        scale: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut" as const
        }
      }
    }
  };

  const handleHabitToggle = (habitId: string) => {
    if (isEditable) {
      toggleHabit(habitId);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Cluster Node */}
      <div className="relative">
        <motion.div
          className={`relative rounded-full bg-gradient-to-br ${colors.gradient}`}
          style={{
            width: config.node,
            height: config.node,
          }}
          variants={nodeVariants}
          animate={state}
          initial={state}
        >
          {/* Inner circle for visual depth */}
          <div
            className="absolute inset-1 rounded-full bg-white/20"
            style={{
              boxShadow: state === 'active' || state === 'perfect'
                ? `0 0 20px rgba(${colors.rgb}, 0.4)`
                : 'none'
            }}
          />

          {/* Progress indicator */}
          <svg
            className="absolute inset-0"
            viewBox="0 0 100 100"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth={config.stroke}
              opacity={0.2}
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth={config.stroke}
              strokeDasharray={`${(progress.completed / progress.total) * 283} 283`}
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${config.fontSize} font-bold text-white`}>
              {progress.completed}/{progress.required}
            </span>
          </div>

          {/* Perfect state burst effect */}
          {state === 'perfect' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                background: `radial-gradient(circle, rgba(${colors.rgb}, 0.3) 0%, transparent 70%)`
              }}
            />
          )}
        </motion.div>

        {/* Streak badge */}
        {state === 'active' || state === 'perfect' ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          >
            ✓
          </motion.div>
        ) : null}
      </div>

      {/* Cluster name */}
      <div className="text-center">
        <h3 className={`font-bold ${config.fontSize} text-gray-800`}>
          {cluster.name}
        </h3>
        <p className="text-xs text-gray-500">
          {progress.required === progress.total
            ? `All ${progress.total} required`
            : `${progress.required} of ${progress.total} required`}
        </p>
      </div>

      {/* Habit checkboxes (if showing details) */}
      {showDetails && (
        <div className="space-y-2 w-full max-w-xs">
          <AnimatePresence mode="sync">
            {cluster.habitIds.map(habitId => {
              const isCompleted = completedHabits.has(habitId);
              const habitName = habitId.charAt(0).toUpperCase() +
                               habitId.slice(1).replace(/-/g, ' ');

              return (
                <motion.div
                  key={habitId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={() => handleHabitToggle(habitId)}
                    disabled={!isEditable}
                    className={`
                      w-5 h-5 rounded border-2 transition-all
                      ${isCompleted
                        ? `bg-${colors.base}-500 border-${colors.base}-500`
                        : `border-gray-300 hover:border-${colors.base}-400`}
                      ${!isEditable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {isCompleted && (
                      <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-sm ${isCompleted ? 'text-gray-600 line-through' : 'text-gray-800'}`}>
                    {habitName}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};