import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { HabitLog } from '@/types';
import { CLUSTERS } from '@/config/clusters';

interface HeatMapProps {
  data: Record<string, HabitLog>;
}

export const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  const getCompletionLevel = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = data[dateStr];

    if (!log) return 0;

    const completedIds = Object.entries(log.habits)
      .filter(([, isComplete]) => isComplete)
      .map(([id]) => id);

    const completedClusters = CLUSTERS.filter(cluster =>
      cluster.isComplete(completedIds)
    ).length;

    return completedClusters;
  };

  const getColorClass = (level: number): string => {
    switch (level) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-yellow-200';
      case 2: return 'bg-green-300';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const level = getCompletionLevel(day);
          const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

          return (
            <motion.div
              key={format(day, 'yyyy-MM-dd')}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center"
            >
              <div className="text-xs text-gray-500 mb-1">
                {format(day, 'EEE')}
              </div>
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${getColorClass(level)}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  transition-all duration-200 hover:scale-110
                `}
                title={`${format(day, 'MMM d')}: ${level}/3 clusters`}
              >
                {level === 3 && (
                  <span className="text-white text-sm">✓</span>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {format(day, 'd')}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-100" />
          <span className="text-xs text-gray-500">None</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-200" />
          <span className="text-xs text-gray-500">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-xs text-gray-500">All</span>
        </div>
      </div>
    </div>
  );
};