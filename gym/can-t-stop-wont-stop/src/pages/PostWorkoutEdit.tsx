import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useUser } from '../context/UserContext';
import Button from '../components/common/Button';
import ExerciseModule from '../components/workout/ExerciseModule';

const PostWorkoutEdit = () => {
  const navigate = useNavigate();
  const { currentWorkout, resetWorkoutSelection, updateExerciseSet } = useWorkout();
  const { addWorkout } = useUser();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!currentWorkout) {
    navigate('/');
    return null;
  }

  // Calculate completion percentage
  const totalSets = currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = currentWorkout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
    0
  );
  const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Handle save
  const handleSave = () => {
    // Update completion status based on completion rate
    const status =
      completionRate >= 100
        ? 'Completed'
        : completionRate >= 50
        ? 'Incomplete'
        : 'Failed';

    const workoutToSave = {
      ...currentWorkout,
      completionStatus: status as any,
      date: new Date(),
    };

    // Add to workout history
    addWorkout(workoutToSave);

    // Show success message
    showToast('Workout saved!');

    // Reset and return to home
    setTimeout(() => {
      resetWorkoutSelection();
      navigate('/');
    }, 1500);
  };

  // Handle discard
  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard this workout?')) {
      resetWorkoutSelection();
      navigate('/');
    }
  };

  // Show toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-primary-black flex flex-col">
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-semantic-success border-2 border-white rounded-medium px-6 py-3">
            <p className="text-white text-sm font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-primary-black-secondary border-b border-gray-800 px-6 py-6">
        <h1 className="text-h2 font-bold text-white text-center mb-4">
          WORKOUT COMPLETE
        </h1>

        {/* Completion Stats */}
        <div className="flex justify-around items-center">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Completion</p>
            <p
              className={`text-3xl font-bold ${
                completionRate >= 100
                  ? 'text-semantic-success'
                  : completionRate >= 50
                  ? 'text-semantic-warning'
                  : 'text-semantic-error'
              }`}
            >
              {completionRate}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Sets</p>
            <p className="text-3xl font-bold text-white">
              {completedSets}/{totalSets}
            </p>
          </div>
        </div>
      </div>

      {/* Exercises List - Editable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide">
        <h2 className="text-lg font-bold text-white mb-4">
          Review & Edit
        </h2>
        {currentWorkout.exercises.map((exercise, index) => (
          <ExerciseModule
            key={exercise.exerciseId}
            exercise={exercise}
            exerciseNumber={index + 1}
            onUpdateSet={(setIndex, reps, weight) =>
              updateExerciseSet(exercise.exerciseId, setIndex, reps, weight)
            }
            onCompleteSet={() => {}}
            showToast={showToast}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6 border-t border-gray-800 space-y-3">
        <Button variant="primary" fullWidth onClick={handleSave}>
          SAVE WORKOUT
        </Button>
        <button
          onClick={handleDiscard}
          className="w-full text-center text-gray-400 hover:text-white py-3 transition-colors underline"
        >
          Discard
        </button>
      </div>
    </div>
  );
};

export default PostWorkoutEdit;
