import { format, subDays, isToday, isYesterday } from 'date-fns';
import { useHabitStore } from '@/store/habitStore';

const MAX_EDITABLE_DAYS = 7;

export const DaySelector: React.FC = () => {
  const currentDate = useHabitStore(state => state.currentDate);
  const loadDate = useHabitStore(state => state.loadDate);

  const today = new Date();

  // Generate last 7 days (including today)
  const editableDays = Array.from({ length: MAX_EDITABLE_DAYS }, (_, i) => {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const daysDiff = i;

    return {
      date: dateStr,
      label: getDateLabel(date, daysDiff),
      isEditable: true,
    };
  });

  const handleDateChange = async (dateStr: string) => {
    await loadDate(dateStr);
  };

  return (
    <div className="relative">
      <select
        value={currentDate}
        onChange={(e) => handleDateChange(e.target.value)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer appearance-none text-base font-medium text-gray-900"
      >
        {editableDays.map((day) => (
          <option key={day.date} value={day.date}>
            {day.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

function getDateLabel(date: Date, daysDiff: number): string {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  const formatted = format(date, 'EEE, MMM d');
  return `${formatted} (${daysDiff} days ago)`;
}
