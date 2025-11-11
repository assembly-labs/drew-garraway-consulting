import { useMemo, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { Cluster } from '@/data/models/Cluster';
import { getModulesByCategory } from '@/config/modules';
import { Toast } from '@/shared/components/Toast';

interface ClusterCardProps {
  cluster: Cluster;
}

export const ClusterCard: React.FC<ClusterCardProps> = ({ cluster }) => {
  const completedHabits = useHabitStore(state => state.completedHabits);
  const toggleHabit = useHabitStore(state => state.toggleHabit);
  const currentDate = useHabitStore(state => state.currentDate);
  const isDateEditable = useHabitStore(state => state.isDateEditable);
  const [toast, setToast] = useState<{ habitId: string; habitName: string } | null>(null);

  const isEditable = useMemo(() => {
    return isDateEditable(currentDate);
  }, [currentDate, isDateEditable]);

  // Calculate progress locally - NOT in the selector
  const progress = useMemo(() => {
    const completed = cluster.habitIds.filter(id => completedHabits.has(id)).length;
    return { completed, required: cluster.requiredCount };
  }, [cluster.habitIds, cluster.requiredCount, completedHabits]);

  const isComplete = useMemo(() => {
    return progress.completed >= progress.required;
  }, [progress]);

  const modules = getModulesByCategory(cluster.category);

  // Filter out completed habits for display
  const activeModules = useMemo(() => {
    return modules.filter(module => !completedHabits.has(module.getHabit().id));
  }, [modules, completedHabits]);

  const handleToggle = useCallback((habitId: string, habitName: string) => {
    toggleHabit(habitId);
    setToast({ habitId, habitName });
  }, [toggleHabit]);

  const handleUndo = useCallback(() => {
    if (toast) {
      toggleHabit(toast.habitId);
      setToast(null);
    }
  }, [toast, toggleHabit]);

  const categoryColors = {
    physical: {
      bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
      text: 'text-blue-900',
      complete: 'text-blue-600',
      border: 'border-blue-200'
    },
    mental: {
      bg: 'bg-gradient-to-r from-purple-50 to-purple-100',
      text: 'text-purple-900',
      complete: 'text-purple-600',
      border: 'border-purple-200'
    },
    diet: {
      bg: 'bg-gradient-to-r from-green-50 to-green-100',
      text: 'text-green-900',
      complete: 'text-green-600',
      border: 'border-green-200'
    }
  };

  const colors = categoryColors[cluster.category] || categoryColors.physical;

  return (
    <div className="mb-8">
      {/* Cluster Header */}
      <div className={`mx-6 mb-4 p-4 rounded-lg ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className={`text-sm font-bold tracking-wide ${isComplete ? colors.complete : colors.text}`}>
              {cluster.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: cluster.requiredCount }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < progress.completed
                      ? isComplete ? 'bg-green-500' : 'bg-gray-400'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${isComplete ? colors.complete : colors.text}`}>
              {progress.completed}/{progress.required}
            </span>
          </div>
        </div>
      </div>

      {/* Habit Cards */}
      <div className="space-y-3 px-6">
        {activeModules.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {activeModules.map(module => {
              const habit = module.getHabit();
              const isCompleted = completedHabits.has(habit.id);

              return (
                <module.DashboardCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isCompleted}
                  onToggle={() => handleToggle(habit.id, habit.name)}
                  isEditable={isEditable}
                />
              );
            })}
          </AnimatePresence>
        ) : (
          <div className={`${colors.bg} rounded-xl p-6 text-center border ${colors.border}`}>
            <p className={`font-semibold ${colors.text}`}>All done!</p>
            <p className={`text-sm mt-1 ${colors.text} opacity-70`}>
              You've completed all habits in this cluster
            </p>
          </div>
        )}
      </div>

      {/* Toast for undo */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={`${toast.habitName} completed`}
            onUndo={handleUndo}
            onDismiss={() => setToast(null)}
            duration={5000}
          />
        )}
      </AnimatePresence>
    </div>
  );
};