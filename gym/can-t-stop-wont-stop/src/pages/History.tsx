import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../components/common/Button';
import { formatDate } from '../utils/validation';

const History = () => {
  const navigate = useNavigate();
  const { workoutHistory } = useUser();

  return (
    <div className="min-h-screen bg-primary-black px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="icon" onClick={() => navigate('/')}>
          <span className="text-2xl">←</span>
        </Button>
        <h1 className="text-h2 font-bold text-white">HISTORY</h1>
        <div className="w-11"></div>
      </div>

      {/* Workout List */}
      {workoutHistory.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center mt-32">
          <p className="text-gray-500 text-xl mb-4">No workouts yet</p>
          <p className="text-gray-600 text-center mb-8">
            Complete your first workout to see it here
          </p>
          <Button variant="primary" onClick={() => navigate('/day-selection')}>
            START WORKOUT
          </Button>
        </div>
      ) : (
        /* Workout Cards */
        <div className="space-y-4">
          {workoutHistory.map((workout) => {
            const completedSets = workout.exercises.reduce(
              (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
              0
            );
            const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
            const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

            // Border color based on completion
            const borderColor =
              completionRate >= 100
                ? 'border-l-semantic-success'
                : completionRate >= 75
                ? 'border-l-semantic-warning'
                : 'border-l-gray-600';

            return (
              <div
                key={workout.id}
                className={`bg-primary-black-secondary border-l-4 ${borderColor} border border-gray-800 rounded-none p-5`}
              >
                {/* Date */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-bold text-lg">
                    {formatDate(new Date(workout.date))}
                  </p>
                  <span
                    className={`text-sm font-bold ${
                      completionRate >= 100
                        ? 'text-semantic-success'
                        : completionRate >= 75
                        ? 'text-semantic-warning'
                        : 'text-gray-500'
                    }`}
                  >
                    {completionRate}%
                  </span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span>{workout.dayType}</span>
                  <span>•</span>
                  <span>{workout.durationSelected} min</span>
                  <span>•</span>
                  <span>
                    {completedSets}/{totalSets} sets
                  </span>
                </div>

                {/* Exercises Summary */}
                <div className="text-xs text-gray-500">
                  {workout.exercises.map((ex, i) => (
                    <span key={ex.exerciseId}>
                      {ex.exerciseName}
                      {i < workout.exercises.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
