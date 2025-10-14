import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { workoutTemplates } from '../data/exercises';
import type { Exercise } from '../context/WorkoutContext';
import Button from '../components/common/Button';

const WorkoutPlanPreview = () => {
  const navigate = useNavigate();
  const { selectedDay, selectedDuration, startWorkout } = useWorkout();

  // If no day/duration selected, redirect back
  if (!selectedDay || !selectedDuration) {
    navigate('/day-selection');
    return null;
  }

  // Get workout template for the selected day
  const exerciseTemplates = workoutTemplates[selectedDay] || [];

  // Convert templates to Exercise objects with initialized sets
  const exercises: Exercise[] = exerciseTemplates.map((template) => ({
    exerciseId: template.exerciseId,
    exerciseName: template.exerciseName,
    category: template.category,
    equipment: template.equipment,
    description: template.description,
    isPR: false,
    sets: Array.from({ length: template.defaultSets }, (_, i) => ({
      setNumber: i + 1,
      reps: template.defaultReps,
      weight: template.defaultWeight,
      completed: false,
    })),
  }));

  const handleStart = () => {
    startWorkout(exercises);
    navigate('/active-workout');
  };

  return (
    <div className="min-h-screen bg-primary-black px-6 py-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="icon" onClick={() => navigate('/time-selection')}>
          <span className="text-2xl">←</span>
        </Button>
        <h1 className="text-h3 font-bold text-white">WORKOUT PREVIEW</h1>
        <div className="w-11"></div>
      </div>

      {/* Workout Info */}
      <div className="bg-primary-black-secondary border border-gray-800 rounded-none p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-400 text-sm mb-1">Day</p>
            <p className="text-white font-bold text-xl">{selectedDay}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">Duration</p>
            <p className="text-primary-red font-bold text-xl">{selectedDuration} MIN</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-400 text-sm mb-1">Total Exercises</p>
          <p className="text-white font-bold text-lg">{exercises.length} exercises</p>
        </div>
      </div>

      {/* Exercise List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide mb-6">
        <h2 className="text-lg font-bold text-white mb-4">EXERCISES</h2>
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <div
              key={exercise.exerciseId}
              className="bg-primary-black-secondary border border-gray-800 rounded-none p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary-red font-bold text-sm">
                      #{index + 1}
                    </span>
                    <h3 className="text-white font-bold text-base">
                      {exercise.exerciseName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{exercise.sets.length} sets</span>
                    <span>•</span>
                    <span>{exercise.category}</span>
                    {exercise.equipment && (
                      <>
                        <span>•</span>
                        <span>{exercise.equipment}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-primary-red bg-opacity-10 border-2 border-primary-red rounded-none p-4 mb-6">
        <p className="text-primary-red font-bold text-center text-sm">
          ⚠️ TIMER CANNOT BE PAUSED
        </p>
        <p className="text-gray-300 text-center text-xs mt-2">
          Once started, the timer runs until 00:00. No stopping. No excuses.
        </p>
      </div>

      {/* Start Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleStart}
        className="animate-pulse"
      >
        LET'S GO
      </Button>
    </div>
  );
};

export default WorkoutPlanPreview;
