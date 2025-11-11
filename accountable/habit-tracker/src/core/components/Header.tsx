import { format, isToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { DaySelector } from './DaySelector';

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
  const viewingToday = isToday(new Date(currentDate));

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
      <div className="px-6 py-8">
        <div className="mb-4">
          <DaySelector />
        </div>

        {!viewingToday && (
          <div className="mb-3 px-3 py-2 bg-blue-700/50 rounded-lg inline-flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Viewing past day - You can edit within 5 days</span>
          </div>
        )}

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