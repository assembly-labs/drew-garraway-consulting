import { useState } from 'react';
import { Header } from './Header';
import { ClusterPulse } from './ClusterPulse';
import { ClusterCard } from './ClusterCard';
import { DailySummary } from './DailySummary';
import { MissedDaysAlert } from './MissedDaysAlert';
import { BottomNavigation } from './BottomNavigation';
import { CLUSTERS } from '@/config/clusters';

type VisualizationMode = 'pulse' | 'cards';

export const Dashboard: React.FC = () => {
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('cards');

  // Toggle between visualization modes
  const toggleVisualization = () => {
    setVisualizationMode(prev => prev === 'pulse' ? 'cards' : 'pulse');
  };

  if (visualizationMode === 'pulse') {
    return (
      <div className="min-h-screen pb-20">
        {/* Top bar with safe area padding */}
        <div className="fixed top-0 left-0 right-0 z-30 glass-dark safe-top">
          <div className="px-6 py-4 flex justify-center items-center">
            <h2 className="text-white font-semibold text-lg">Accountable</h2>
          </div>
        </div>

        <ClusterPulse />

        {/* Mode toggle button - positioned above bottom nav */}
        <button
          onClick={toggleVisualization}
          className="fixed bottom-24 right-6 bg-white shadow-lg rounded-full p-3 hover:scale-110 transition-transform z-20"
          title="Switch to card view"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    );
  }

  // Original card-based view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-32">
      <Header />

      <MissedDaysAlert />

      <div className="py-8">
        {CLUSTERS.map(cluster => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>

      <DailySummary />

      {/* Mode toggle button - positioned above bottom nav */}
      <button
        onClick={toggleVisualization}
        className="fixed bottom-24 right-6 bg-white shadow-lg rounded-full p-3 hover:scale-110 transition-transform z-20"
        title="Switch to pulse view"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};