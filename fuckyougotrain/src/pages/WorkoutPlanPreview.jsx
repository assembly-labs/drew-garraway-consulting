import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { Button } from '../components/common/Button';

export function WorkoutPlanPreview() {
  const navigate = useNavigate();
  const { workoutPlan, startWorkout } = useWorkout();

  if (!workoutPlan) {
    navigate('/day');
    return null;
  }

  const handleStart = async () => {
    await startWorkout(workoutPlan);
    navigate('/workout');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/day')}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white">{workoutPlan.name}</h1>
        <p className="text-gray-400 mt-2">{workoutPlan.description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="bg-red-600 text-white px-3 py-1 rounded">
            {workoutPlan.duration} min
          </span>
          <span className="text-gray-400">
            {workoutPlan.exercises.length} exercises
          </span>
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
        {workoutPlan.exercises.map((exercise, index) => (
          <div
            key={exercise.exerciseId}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-gray-500 font-bold text-lg">{index + 1}</span>
              <div className="flex-1">
                <h3 className="font-bold text-white">{exercise.exerciseName}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {exercise.sets.length} sets • {exercise.targetReps} reps • {exercise.equipment}
                </p>
                <p className="text-xs text-gray-500 mt-2">{exercise.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Start button */}
      <div className="space-y-4">
        <Button
          onClick={handleStart}
          variant="primary"
          fullWidth
          className="text-2xl py-6"
        >
          Let's Go
        </Button>
        <p className="text-center text-gray-500 text-sm">
          Timer starts immediately. No stopping.
        </p>
      </div>
    </div>
  );
}
