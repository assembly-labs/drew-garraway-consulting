import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { createRepository } from '@/data/repositories';
import { CLUSTERS } from '@/config/clusters';
import { HabitLog } from '@/types';

const repository = createRepository();

export const CalendarView: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [logs, setLogs] = useState<Record<string, HabitLog>>({});

  useEffect(() => {
    const loadMonth = async () => {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthLogs = await repository.getDateRange(start, end);

      const logsMap: Record<string, HabitLog> = {};
      monthLogs.forEach(log => {
        logsMap[log.date] = log;
      });
      setLogs(logsMap);
    };

    loadMonth();
  }, [currentMonth]);

  const getDayColor = (date: Date): string => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = logs[dateStr];

    if (!log) return 'bg-gray-100';

    const completedIds = Object.entries(log.habits)
      .filter(([, isComplete]) => isComplete)
      .map(([id]) => id);

    const completedClusters = CLUSTERS.filter(cluster =>
      cluster.isComplete(completedIds)
    ).length;

    if (completedClusters === CLUSTERS.length) return 'bg-success';
    if (completedClusters > 0) return 'bg-warning';
    return 'bg-gray-300';
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-primary font-medium"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold">Calendar</h1>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const dayColor = isCurrentMonth ? getDayColor(day) : 'bg-gray-50';

            return (
              <button
                key={day.toISOString()}
                onClick={() => {
                  // Future: open day detail modal
                }}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  ${dayColor}
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  hover:ring-2 hover:ring-primary transition-all
                `}
              >
                <span className="text-sm font-medium">
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-success mr-2"></div>
            <span>All complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-warning mr-2"></div>
            <span>Partial</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-gray-300 mr-2"></div>
            <span>Incomplete</span>
          </div>
        </div>
      </div>
    </div>
  );
};