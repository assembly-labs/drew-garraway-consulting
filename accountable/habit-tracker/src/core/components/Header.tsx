import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useHabitStore } from '@/store/habitStore';

export const Header: React.FC = () => {
  const currentDate = useHabitStore(state => state.currentDate);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Only calculate streak on mount and when date changes
    const calculateStreakAsync = async () => {
      try {
        const store = useHabitStore.getState();
        const streakValue = await store.calculateStreak();
        setStreak(streakValue);
      } catch (error) {
        console.error('Error calculating streak:', error);
        setStreak(0);
      }
    };

    calculateStreakAsync();
  }, [currentDate]);

  const formattedDate = format(new Date(currentDate), 'EEEE, MMMM dd, yyyy');

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">{formattedDate}</h1>
        {streak > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">
              🔥 {streak} day streak
            </span>
          </div>
        )}
        {streak === 0 && (
          <p className="text-blue-100 text-sm">Start your streak today!</p>
        )}
      </div>
    </div>
  );
};