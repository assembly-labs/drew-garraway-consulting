import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { motion } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { createRepository } from '@/data/repositories';
import { CLUSTERS } from '@/config/clusters';
import { RingChart } from '@/shared/components/RingChart';
import { HeatMap } from '@/shared/components/HeatMap';
import { TrendChart } from '@/shared/components/TrendChart';
import { HabitLog } from '@/types';

const repository = createRepository();

interface Stats {
  totalCompleted: number;
  bestStreak: number;
  currentStreak: number;
  completionRate: number;
  mostConsistent: string;
  clusterStats: Record<string, number>;
}

export const ProgressView: React.FC = () => {
  const navigate = useNavigate();
  const calculateStreak = useHabitStore(state => state.calculateStreak);
  const [stats, setStats] = useState<Stats>({
    totalCompleted: 0,
    bestStreak: 0,
    currentStreak: 0,
    completionRate: 0,
    mostConsistent: '',
    clusterStats: {}
  });
  const [monthlyData, setMonthlyData] = useState<Record<string, HabitLog>>({});
  const [weeklyData, setWeeklyData] = useState<Record<string, HabitLog>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProgressData = async () => {
    setLoading(true);

    // Load current month data
    const now = new Date();
    const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
    const monthLogs = await repository.getDateRange(monthStart, monthEnd);

    const monthMap: Record<string, HabitLog> = {};
    monthLogs.forEach(log => {
      monthMap[log.date] = log;
    });
    setMonthlyData(monthMap);

    // Load last 7 days data
    const weekMap: Record<string, HabitLog> = {};
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(now, i), 'yyyy-MM-dd');
      const log = await repository.getLog(date);
      if (log) {
        weekMap[date] = log;
      }
    }
    setWeeklyData(weekMap);

    // Calculate stats
    const currentStreak = await calculateStreak();
    const totalCompleted = monthLogs.reduce((acc, log) => {
      return acc + Object.values(log.habits).filter(Boolean).length;
    }, 0);

    // Calculate cluster stats for today
    const todayLog = await repository.getLog(format(now, 'yyyy-MM-dd'));
    const clusterStats: Record<string, number> = {};

    CLUSTERS.forEach(cluster => {
      const completedInCluster = cluster.habitIds.filter(id =>
        todayLog?.habits[id] === true
      ).length;
      clusterStats[cluster.id] = (completedInCluster / cluster.habitIds.length) * 100;
    });

    // Calculate completion rate for the month
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(now),
      end: now
    }).length;
    const daysWithAllClusters = monthLogs.filter(log => {
      const completedIds = Object.entries(log.habits)
        .filter(([, isComplete]) => isComplete)
        .map(([id]) => id);
      return CLUSTERS.every(cluster => cluster.isComplete(completedIds));
    }).length;
    const completionRate = Math.round((daysWithAllClusters / daysInMonth) * 100);

    // Find most consistent habit
    const habitCounts: Record<string, number> = {};
    monthLogs.forEach(log => {
      Object.entries(log.habits).forEach(([id, completed]) => {
        if (completed) {
          habitCounts[id] = (habitCounts[id] || 0) + 1;
        }
      });
    });
    const mostConsistent = Object.entries(habitCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '';

    setStats({
      totalCompleted,
      bestStreak: Math.max(currentStreak, stats.bestStreak),
      currentStreak,
      completionRate,
      mostConsistent,
      clusterStats
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Progress</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Streak Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{stats.currentStreak}</h2>
              <p className="text-gray-600">Day Streak</p>
            </div>
            <div className="text-5xl">
              {stats.currentStreak > 0 ? '🔥' : '💪'}
            </div>
          </div>
          {stats.currentStreak > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Keep it going! You're doing amazing!</p>
            </div>
          )}
        </motion.div>

        {/* Cluster Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Progress</h2>
          <div className="grid grid-cols-3 gap-4">
            {CLUSTERS.map((cluster) => (
              <RingChart
                key={cluster.id}
                label={cluster.name}
                value={stats.clusterStats[cluster.id] || 0}
                color={cluster.id === 'physical' ? 'blue' : cluster.id === 'mental' ? 'purple' : 'green'}
              />
            ))}
          </div>
        </motion.div>

        {/* Weekly Heat Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
          <HeatMap data={weeklyData} />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCompleted}</div>
            <div className="text-sm text-gray-600">Habits Completed</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-xs text-gray-400 mt-1">All clusters</div>
          </div>
        </motion.div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">30-Day Trend</h2>
          <TrendChart data={monthlyData} />
        </motion.div>
      </div>
    </div>
  );
};