import { useMemo } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { useNavigate } from 'react-router-dom';
import { CLUSTERS } from '@/config/clusters';
import { motion } from 'framer-motion';

export const DailySummary: React.FC = () => {
  const completedHabits = useHabitStore(state => state.completedHabits);
  const navigate = useNavigate();

  // Calculate progress locally - NOT in the selector
  const progress = useMemo(() => {
    const completedClusters = CLUSTERS.filter(cluster => {
      const completedInCluster = cluster.habitIds.filter(id =>
        completedHabits.has(id)
      ).length;
      return completedInCluster >= cluster.requiredCount;
    }).length;

    return {
      completed: completedClusters,
      total: CLUSTERS.length
    };
  }, [completedHabits]);

  const progressPercentage = (progress.completed / progress.total) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 px-6 py-4 shadow-2xl">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">Daily Progress</p>
          <p className="text-sm font-bold text-gray-900">
            {progress.completed}/{progress.total} clusters
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Motivational Message */}
        <div className="mt-3">
          {progress.completed === progress.total ? (
            <p className="text-green-600 font-semibold text-center">
              Perfect day! All goals achieved!
            </p>
          ) : progress.completed > 0 ? (
            <p className="text-blue-600 font-medium text-center">
              Great progress! Keep going!
            </p>
          ) : (
            <p className="text-gray-500 text-center">
              Start by completing your first habit
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/calendar')}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        View Calendar
      </button>
    </div>
  );
};