import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfWeek, endOfWeek, subDays, isToday } from 'date-fns';
import { ClusterNode } from './ClusterNode';
import { CLUSTERS } from '@/config/clusters';
import { useHabitStore } from '@/store/habitStore';
import { createRepository } from '@/data/repositories';
import { HabitLog } from '@/types';

const repository = createRepository();

type ViewMode = 'daily' | 'monthly' | 'weekly';

interface ClusterStreak {
  clusterId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompleted: string | null;
}

export const ClusterPulse: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthLogs, setMonthLogs] = useState<Record<string, HabitLog>>({});
  const [streaks, setStreaks] = useState<Record<string, ClusterStreak>>({});
  const [loading, setLoading] = useState(false);

  const currentDate = useHabitStore(state => state.currentDate);
  const completedHabits = useHabitStore(state => state.completedHabits);
  const loadDate = useHabitStore(state => state.loadDate);

  // Load data for selected date
  useEffect(() => {
    if (viewMode === 'daily') {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      loadDate(dateStr);
    }
  }, [selectedDate, viewMode, loadDate]);

  // Load month data for monthly/weekly views
  useEffect(() => {
    if (viewMode === 'monthly' || viewMode === 'weekly') {
      const loadMonthData = async () => {
        setLoading(true);
        const start = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
        const end = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
        const logs = await repository.getDateRange(start, end);

        const logsMap: Record<string, HabitLog> = {};
        logs.forEach(log => {
          logsMap[log.date] = log;
        });
        setMonthLogs(logsMap);
        setLoading(false);
      };
      loadMonthData();
    }
  }, [selectedDate, viewMode]);

  // Calculate streaks
  useEffect(() => {
    const calculateStreaks = async () => {
      const streakData: Record<string, ClusterStreak> = {};

      for (const cluster of CLUSTERS) {
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastCompleted: string | null = null;

        // Check last 365 days for streak calculation
        for (let i = 0; i < 365; i++) {
          const checkDate = subDays(new Date(), i);
          const dateStr = format(checkDate, 'yyyy-MM-dd');
          const log = await repository.getLog(dateStr);

          if (log) {
            const completedIds = Object.entries(log.habits)
              .filter(([, isComplete]) => isComplete)
              .map(([id]) => id);

            if (cluster.isComplete(completedIds)) {
              if (i === 0 || i === tempStreak) {
                tempStreak++;
                currentStreak = tempStreak;
                if (!lastCompleted) lastCompleted = dateStr;
              }
              longestStreak = Math.max(longestStreak, tempStreak);
            } else if (i < 7) {
              // Only break current streak if within last week
              tempStreak = 0;
            }
          } else if (i === 0) {
            currentStreak = 0;
            tempStreak = 0;
          }
        }

        streakData[cluster.id] = {
          clusterId: cluster.id,
          currentStreak,
          longestStreak,
          lastCompleted
        };
      }

      setStreaks(streakData);
    };

    calculateStreaks();
  }, [completedHabits, currentDate]);

  const overallProgress = useMemo(() => {
    const completedClusters = CLUSTERS.filter(cluster => {
      const completedInCluster = cluster.habitIds.filter(id =>
        completedHabits.has(id)
      ).length;
      return completedInCluster >= cluster.requiredCount;
    }).length;

    return {
      completed: completedClusters,
      total: CLUSTERS.length,
      percentage: (completedClusters / CLUSTERS.length) * 100
    };
  }, [completedHabits]);

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(current => {
      const newDate = new Date(current);
      if (viewMode === 'daily') {
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
      } else {
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      }
      return newDate;
    });
  };

  const getStreakColor = (days: number) => {
    if (days >= 100) return 'text-purple-600 bg-purple-100';
    if (days >= 30) return 'text-yellow-600 bg-yellow-100';
    if (days >= 7) return 'text-gray-600 bg-gray-100';
    if (days >= 3) return 'text-orange-600 bg-orange-100';
    return 'text-gray-500 bg-gray-50';
  };

  const renderDailyView = () => (
    <div className="space-y-8">
      {/* Date Navigation */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={() => navigateDate('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {format(selectedDate, 'EEEE')}
          </h2>
          <p className="text-sm text-gray-500">
            {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => navigateDate('next')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isToday(selectedDate)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Cluster Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {CLUSTERS.map(cluster => (
          <div key={cluster.id} className="flex flex-col items-center space-y-2">
            <ClusterNode cluster={cluster} size="medium" showDetails={true} />
            {streaks[cluster.id] && streaks[cluster.id].currentStreak > 0 && (
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStreakColor(streaks[cluster.id].currentStreak)}`}>
                {streaks[cluster.id].currentStreak} day streak
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="px-4 py-6 bg-gray-50 rounded-xl mx-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">Daily Progress</span>
          <span className="text-sm font-bold text-gray-800">
            {overallProgress.completed}/{overallProgress.total} clusters
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress.percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {overallProgress.completed === overallProgress.total && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-3 text-green-600 font-semibold"
          >
            Perfect day! All clusters complete!
          </motion.p>
        )}
      </div>
    </div>
  );

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const getClusterCompletion = (date: Date, cluster: typeof CLUSTERS[0]) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const log = monthLogs[dateStr];
      if (!log) return 'empty';

      const completedIds = Object.entries(log.habits)
        .filter(([, isComplete]) => isComplete)
        .map(([id]) => id);

      const progress = cluster.getProgress(completedIds);
      if (progress.completed >= progress.required) return 'complete';
      if (progress.completed > 0) return 'partial';
      return 'empty';
    };

    return (
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Heat Map */}
        <div className="px-4 overflow-x-auto">
          <div className="min-w-[320px]">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid for each cluster */}
            {CLUSTERS.map((cluster, clusterIdx) => (
              <div key={cluster.id} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${
                    cluster.category === 'physical' ? 'from-blue-500 to-blue-700' :
                    cluster.category === 'mental' ? 'from-purple-500 to-purple-700' :
                    'from-green-500 to-green-700'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">{cluster.name}</span>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map(day => {
                    const isCurrentMonth = isSameMonth(day, selectedDate);
                    const completion = isCurrentMonth ? getClusterCompletion(day, cluster) : 'outside';
                    const dateStr = format(day, 'd');

                    return (
                      <div
                        key={day.toISOString()}
                        className={`
                          aspect-square rounded flex items-center justify-center text-xs
                          ${completion === 'complete' ? 'bg-green-500 text-white' :
                            completion === 'partial' ? 'bg-yellow-400 text-gray-800' :
                            completion === 'empty' ? 'bg-gray-200 text-gray-600' :
                            'bg-gray-50 text-gray-400'}
                          ${isToday(day) ? 'ring-2 ring-blue-500' : ''}
                        `}
                      >
                        {clusterIdx === 0 && dateStr}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Summary */}
        <div className="px-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Cluster Streaks</h3>
          {CLUSTERS.map(cluster => {
            const streak = streaks[cluster.id];
            if (!streak) return null;

            return (
              <div key={cluster.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{cluster.name}</span>
                <div className="flex items-center gap-4">
                  <div className="flex-1 w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        cluster.category === 'physical' ? 'bg-blue-500' :
                        cluster.category === 'mental' ? 'bg-purple-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, (streak.currentStreak / 30) * 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${streak.currentStreak > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                    {streak.currentStreak} days
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <span>Empty</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-center gap-2 p-4">
          {(['daily', 'monthly'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all
                ${viewMode === mode
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'daily' ? renderDailyView() : renderMonthlyView()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};