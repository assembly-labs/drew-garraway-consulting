import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { Button } from '../components/common/Button';

export function TimeSelection() {
  const navigate = useNavigate();
  const { selectedDay, setSelectedDuration, generateWorkoutPlan } = useWorkout();
  const [selected, setSelected] = useState(null);

  const durations = [
    { value: 60, label: '60 Minutes', subtitle: 'Full Session' },
    { value: 45, label: '45 Minutes', subtitle: 'Medium Session' },
    { value: 30, label: '30 Minutes', subtitle: 'Quick Session' },
  ];

  const handleNext = () => {
    if (selected) {
      setSelectedDuration(selected);
      generateWorkoutPlan(selectedDay, selected);
      navigate('/preview');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/day')}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white">How Much Time?</h1>
        <p className="text-gray-400 mt-2">Pick your duration</p>
      </div>

      {/* Duration options */}
      <div className="flex-1 space-y-4">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => setSelected(duration.value)}
            className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
              selected === duration.value
                ? 'bg-red-600 border-red-600 text-white'
                : 'bg-gray-900 border-gray-700 text-white hover:border-red-500'
            }`}
          >
            <div className="font-bold text-xl">{duration.label}</div>
            <div className={`text-sm mt-1 ${selected === duration.value ? 'text-white' : 'text-gray-400'}`}>
              {duration.subtitle}
            </div>
          </button>
        ))}
      </div>

      {/* Next button */}
      <div className="mt-6">
        <Button
          onClick={handleNext}
          disabled={!selected}
          variant="primary"
          fullWidth
        >
          Next
        </Button>
      </div>
    </div>
  );
}
