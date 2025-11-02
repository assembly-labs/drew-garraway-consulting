import { useEffect } from 'react';
import { format } from 'date-fns';
import { useHabitStore } from '@/store/habitStore';
import { Header } from './Header';
import { ClusterCard } from './ClusterCard';
import { DailySummary } from './DailySummary';
import { CLUSTERS } from '@/config/clusters';

export const Dashboard: React.FC = () => {
  const loading = useHabitStore(state => state.loading);

  useEffect(() => {
    // Load today's data only on mount
    const loadTodayData = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const store = useHabitStore.getState();
      await store.loadDate(today);
    };

    loadTodayData();
  }, []); // Empty dependency - only run once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-32">
      <Header />

      <div className="py-8">
        {CLUSTERS.map(cluster => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>

      <DailySummary />
    </div>
  );
};