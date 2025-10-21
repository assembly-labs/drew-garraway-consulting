import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import type { DayType } from '../context/WorkoutContext';
import Button from '../components/common/Button';

const DaySelection = () => {
  const navigate = useNavigate();
  const { selectedDay, setSelectedDay } = useWorkout();
  const [localSelection, setLocalSelection] = useState<DayType>(selectedDay);

  const dayOptions: { value: DayType; label: string; description: string }[] = [
    {
      value: 'Monday',
      label: 'Monday',
      description: 'Power Day',
    },
    {
      value: 'Friday',
      label: 'Friday',
      description: 'Strength Day',
    },
    {
      value: 'Weekend',
      label: 'Weekend',
      description: 'Warrior Mode',
    },
  ];

  const handleSelect = (day: DayType) => {
    setLocalSelection(day);
    setSelectedDay(day);
    navigate('/workout-preview');
  };

  return (
    <div className="min-h-screen bg-primary-black px-6 py-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="icon" onClick={() => navigate('/')}>
          <span className="text-2xl">←</span>
        </Button>
        <h1 className="text-h2 font-bold text-white">Select Your Day</h1>
        <div className="w-11"></div> {/* Spacer for centering */}
      </div>

      {/* Subtitle */}
      <p className="text-center text-gray-400 mb-12">Choose your workout split</p>

      {/* Day Options */}
      <div className="flex-1 flex flex-col justify-center space-y-4 max-w-md mx-auto w-full">
        {dayOptions.map((option) => (
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

export default DaySelection;
