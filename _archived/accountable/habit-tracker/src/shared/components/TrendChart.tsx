import { format, subDays, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';
import { HabitLog } from '@/types';
import { CLUSTERS } from '@/config/clusters';

interface TrendChartProps {
  data: Record<string, HabitLog>;
}

interface TrendDataPoint {
  date: string;
  day: string;
  [key: string]: string | boolean;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 29);
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: today });

  // Calculate completion percentages for each cluster over time
  const trendData: TrendDataPoint[] = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const log = data[dateStr];

    const clusterCompletion: Record<string, boolean> = {};
    CLUSTERS.forEach(cluster => {
      if (log) {
        const completedIds = Object.entries(log.habits)
          .filter(([, isComplete]) => isComplete)
          .map(([id]) => id);
        clusterCompletion[cluster.id] = cluster.isComplete(completedIds);
      } else {
        clusterCompletion[cluster.id] = false;
      }
    });

    return {
      date: dateStr,
      day: format(day, 'd'),
      ...clusterCompletion
    };
  });

  // Calculate max height for scaling
  const maxHeight = 100;

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative h-32">
        <div className="absolute inset-0 flex items-end justify-between gap-1">
          {trendData.map((day, index) => {
            const physicalHeight = day.physical === true ? maxHeight : 0;
            const mentalHeight = day.mental === true ? maxHeight * 0.8 : 0;
            const dietHeight = day.diet === true ? maxHeight * 0.6 : 0;

            return (
              <motion.div
                key={day.date}
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ delay: index * 0.02 }}
                className="flex-1 flex flex-col justify-end gap-0.5"
                title={`${format(new Date(day.date), 'MMM d')}`}
              >
                {/* Stacked bars for each cluster */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${dietHeight}%` }}
                  transition={{ delay: index * 0.02 + 0.2 }}
                  className="bg-green-400 rounded-t-sm"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${mentalHeight}%` }}
                  transition={{ delay: index * 0.02 + 0.1 }}
                  className="bg-purple-400"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${physicalHeight}%` }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-blue-400 rounded-b-sm"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-t border-gray-100" />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{format(thirtyDaysAgo, 'MMM d')}</span>
        <span>Today</span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-400" />
          <span className="text-xs text-gray-600">Physical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-400" />
          <span className="text-xs text-gray-600">Mental</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-400" />
          <span className="text-xs text-gray-600">Diet</span>
        </div>
      </div>
    </div>
  );
};