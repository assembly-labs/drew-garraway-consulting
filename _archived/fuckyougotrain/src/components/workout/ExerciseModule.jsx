import { useState } from 'react';
import { SetInput } from './SetInput';

export function ExerciseModule({ exercise, onUpdateSet, onEasterEgg, isPR = false }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedSets = exercise.sets.filter(s => s.reps > 0 || s.weight > 0).length;
  const totalSets = exercise.sets.length;

  return (
    <div
      className={`rounded-lg shadow-md p-4 border-2 transition-all ${
        isExpanded
          ? 'bg-gray-800 border-red-500 shadow-lg'
          : 'bg-gray-900 border-gray-700 hover:border-red-500 cursor-pointer'
      } ${isPR ? 'ring-2 ring-yellow-400' : ''}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="flex-1">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            {exercise.exerciseName}
            {isPR && <span className="text-yellow-400 text-sm">PR!</span>}
          </h3>
          <p className="text-sm text-gray-400">
            {exercise.category} • {exercise.equipment}
          </p>
          {!isExpanded && (
            <p className="text-sm text-gray-500 mt-1">
              Sets: {completedSets}/{totalSets}
              {exercise.targetReps && ` • Target: ${exercise.targetReps} reps`}
            </p>
          )}
        </div>
        {!isExpanded && (
          <div className="text-3xl text-gray-600">›</div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {/* Description */}
          <p className="text-sm text-gray-300 pb-3 border-b border-gray-700">
            {exercise.description}
          </p>

          {/* Target reps */}
          {exercise.targetReps && (
            <p className="text-sm text-yellow-400">
              Target: {exercise.targetReps} reps
            </p>
          )}

          {/* Sets */}
          <div className="space-y-2">
            {exercise.sets.map((set, index) => (
              <SetInput
                key={index}
                setNumber={set.setNumber}
                reps={set.reps}
                weight={set.weight}
                onUpdate={(updates) => onUpdateSet(exercise.exerciseId, index, updates)}
                onEasterEgg={onEasterEgg}
              />
            ))}
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setIsExpanded(false)}
            className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Collapse ▲
          </button>
        </div>
      )}
    </div>
  );
}
