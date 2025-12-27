import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';

export function DaySelection() {
  const navigate = useNavigate();
  const { setSelectedDay, generateWorkoutPlan } = useWorkout();

  const days = [
    { id: 'MONDAY', label: 'Monday', subtitle: 'Power Day' },
    { id: 'FRIDAY', label: 'Friday', subtitle: 'Strength Day' },
    { id: 'WEEKEND', label: 'Weekend', subtitle: 'Warrior Mode' },
  ];

  const handleDaySelect = (dayId) => {
    setSelectedDay(dayId);
    generateWorkoutPlan(dayId, 60); // Always 60 minutes
    navigate('/preview');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white">Select Your Day</h1>
        <p className="text-gray-400 mt-2">Choose your workout split</p>
      </div>

      {/* Day options */}
      <div className="flex-1 space-y-4">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => handleDaySelect(day.id)}
            className="w-full p-6 rounded-lg border-2 transition-all text-left bg-gray-900 border-gray-700 text-white hover:border-red-500 hover:bg-gray-800"
          >
            <div className="font-bold text-xl">{day.label}</div>
            <div className="text-sm mt-1 text-gray-400">
              {day.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
