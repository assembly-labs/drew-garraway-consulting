import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Button } from '../components/common/Button';
import { formatTime } from '../utils/timerHelpers';

export function History() {
  const navigate = useNavigate();
  const { workoutHistory, getStats } = useUser();
  const [expandedId, setExpandedId] = useState(null);

  const stats = getStats();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const duration = new Date(end) - new Date(start);
    return formatTime(duration);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-500';
      case 'Failed':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white">Workout History</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalWorkouts}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-500">{stats.completedWorkouts}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.totalPRs}</p>
            <p className="text-xs text-gray-400">PRs</p>
          </div>
        </div>
      </div>

      {/* Workout list */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {workoutHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-6">No workouts yet</p>
            <Button onClick={() => navigate('/day')} variant="primary">
              Start Your First Workout
            </Button>
          </div>
        ) : (
          workoutHistory.map((workout) => (
            <div
              key={workout.id}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* Workout summary */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === workout.id ? null : workout.id)
                }
                className="w-full p-4 text-left hover:bg-gray-850 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-white">
                      {workout.dayType.charAt(0) + workout.dayType.slice(1).toLowerCase()} Workout
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {formatDate(workout.date)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className={getStatusColor(workout.completionStatus)}>
                        {workout.completionStatus}
                      </span>
                      <span className="text-gray-500">
                        {workout.durationSelected} min
                      </span>
                      {workout.startTime && workout.endTime && (
                        <span className="text-gray-500">
                          Actual: {formatDuration(workout.startTime, workout.endTime)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-600 text-2xl">
                    {expandedId === workout.id ? '▼' : '›'}
                  </span>
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === workout.id && (
                <div className="border-t border-gray-800 p-4 space-y-3">
                  {workout.exercises?.map((exercise, idx) => (
                    <div key={idx} className="bg-gray-950 rounded p-3">
                      <h4 className="font-bold text-white text-sm mb-2">
                        {exercise.exerciseName}
                        {exercise.isPR && <span className="text-yellow-400 ml-2">PR</span>}
                      </h4>
                      <div className="space-y-1">
                        {exercise.sets?.map((set, setIdx) => (
                          <div key={setIdx} className="text-xs text-gray-400">
                            Set {set.setNumber}: {set.reps} reps × {set.weight} lbs
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
