import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import type { DurationType } from '../context/WorkoutContext';
import Button from '../components/common/Button';

const TimeSelection = () => {
  const navigate = useNavigate();
  const { selectedDuration, setSelectedDuration } = useWorkout();
  const [localSelection, setLocalSelection] = useState<DurationType>(selectedDuration);

  const durationOptions: { value: DurationType; label: string; description: string }[] = [
    {
      value: 60,
      label: '60 MIN',
      description: 'Full workout, maximum gains',
    },
    {
      value: 45,
      label: '45 MIN',
      description: 'Solid session, efficient',
    },
    {
      value: 30,
      label: '30 MIN',
      description: 'Quick and intense',
    },
  ];

  const handleSelect = (duration: DurationType) => {
    setLocalSelection(duration);
    setSelectedDuration(duration);
    navigate('/workout-preview');
  };

  return (
    <div className="min-h-screen bg-primary-black px-6 py-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="icon" onClick={() => navigate('/day-selection')}>
          <span className="text-2xl">←</span>
        </Button>
        <h1 className="text-h2 font-bold text-white">SELECT TIME</h1>
        <div className="w-11"></div> {/* Spacer for centering */}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-12">
        <div className="w-8 h-1 bg-primary-red rounded-full"></div>
        <div className="w-8 h-1 bg-primary-red rounded-full"></div>
      </div>

      {/* Duration Options */}
      <div className="flex-1 flex flex-col justify-center space-y-4 max-w-md mx-auto w-full">
        {durationOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`
              w-full p-6 rounded-none border-2 transition-all duration-200
              ${
                localSelection === option.value
                  ? 'border-primary-red bg-primary-red bg-opacity-10 shadow-red-glow'
                  : 'border-gray-700 bg-primary-black-secondary hover:border-gray-500'
              }
            `}
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                {option.label}
              </h3>
              <p className="text-gray-400 text-sm">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSelection;
