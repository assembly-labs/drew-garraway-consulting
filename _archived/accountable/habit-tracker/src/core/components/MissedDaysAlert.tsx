import { format, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useHabitStore } from '@/store/habitStore';
import { createRepository } from '@/data/repositories';

const MAX_EDITABLE_DAYS = 5;
const repository = createRepository();

export const MissedDaysAlert: React.FC = () => {
  const currentDate = useHabitStore(state => state.currentDate);
  const loadDate = useHabitStore(state => state.loadDate);
  const [missedDays, setMissedDays] = useState<string[]>([]);
  const [oldestMissedDay, setOldestMissedDay] = useState<string | null>(null);

  useEffect(() => {
    const checkMissedDays = async () => {
      const today = new Date();
      const missed: string[] = [];

      // Check last 5 days (excluding today since it's "current")
      for (let i = 1; i < MAX_EDITABLE_DAYS; i++) {
        const checkDate = subDays(today, i);
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        const log = await repository.getLog(dateStr);

        // If no log exists or no habits completed, it's "missed"
        if (!log || Object.keys(log.habits).length === 0) {
          missed.push(dateStr);
        }
      }

      setMissedDays(missed);

      // Oldest missed day is the last in the array (furthest back)
      if (missed.length > 0) {
        setOldestMissedDay(missed[missed.length - 1]);
      } else {
        setOldestMissedDay(null);
      }
    };

    checkMissedDays();
  }, [currentDate]);

  if (missedDays.length === 0) {
    return null;
  }

  const handleGoToOldestMissed = async () => {
    if (oldestMissedDay) {
      await loadDate(oldestMissedDay);
    }
  };

  return (
    <div className="mx-4 mt-4 mb-2 bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="font-semibold text-amber-900">
              {missedDays.length === 1 ? '1 day' : `${missedDays.length} days`} need updates
            </h3>
          </div>
          <p className="text-sm text-amber-700">
            You have incomplete days within the last 5 days. Complete them before they become locked.
          </p>
        </div>
        <button
          onClick={handleGoToOldestMissed}
          className="flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm"
        >
          Review →
        </button>
      </div>
    </div>
  );
};
