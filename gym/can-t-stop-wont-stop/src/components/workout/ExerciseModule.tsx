import { useState } from 'react';
import type { Exercise, ExerciseSet } from '../../context/WorkoutContext';
import Input from '../common/Input';

interface ExerciseModuleProps {
  exercise: Exercise;
  exerciseNumber: number;
  onUpdateSet: (setIndex: number, reps: number, weight: number) => void;
  onCompleteSet: (setIndex: number) => void;
  onDismiss?: () => void;
  showToast?: (message: string) => void;
}

/**
 * ExerciseModule Component - Always Expanded Mini-Cards (Option A)
 *
 * Features:
 * - Always shows all sets (no collapse/expand)
 * - Compact vertical layout for efficient workout flow
 * - Swipe-to-dismiss when all sets complete
 * - Fixed number of sets (user cannot change)
 * - Editable reps (0-69) and weight (0-9999)
 * - Real-time auto-save
 */
const ExerciseModule: React.FC<ExerciseModuleProps> = ({
  exercise,
  exerciseNumber,
  onUpdateSet,
  onCompleteSet,
  onDismiss,
  showToast,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const completedSets = exercise.sets.filter(set => set.completed).length;
  const totalSets = exercise.sets.length;
  const isComplete = completedSets === totalSets;

  // Swipe handlers (only active when exercise is complete)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isComplete || !onDismiss) return;
    setTouchStart(e.touches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isComplete || !onDismiss || touchStart === null) return;
    const current = e.touches[0].clientX;
    setTouchCurrent(current);
    const diff = Math.abs(current - touchStart);
    if (diff > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = () => {
    if (!isComplete || !onDismiss || touchStart === null) {
      setTouchStart(null);
      setTouchCurrent(null);
      setIsSwiping(false);
      return;
    }

    const diff = touchCurrent !== null ? touchCurrent - touchStart : 0;
    const SWIPE_THRESHOLD = 100;

    // If swiped left or right beyond threshold, dismiss
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      onDismiss();
    } else {
      // Reset position
      setTouchStart(null);
      setTouchCurrent(null);
      setIsSwiping(false);
    }
  };

  // Calculate swipe transform
  const getSwipeTransform = () => {
    if (touchStart !== null && touchCurrent !== null) {
      const diff = touchCurrent - touchStart;
      return `translateX(${diff}px)`;
    }
    return 'translateX(0)';
  };

  const handleRepsChange = (setIndex: number, reps: number) => {
    const currentSet = exercise.sets[setIndex];
    onUpdateSet(setIndex, reps, currentSet.weight);
  };

  const handleWeightChange = (setIndex: number, weight: number) => {
    const currentSet = exercise.sets[setIndex];
    onUpdateSet(setIndex, currentSet.reps, weight);
  };

  const handleSetComplete = (setIndex: number) => {
    onCompleteSet(setIndex);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: getSwipeTransform(),
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
      }}
      className={`w-full rounded-none p-5 border-2 ${
        isComplete
          ? 'border-semantic-success bg-semantic-success bg-opacity-10'
          : 'border-gray-800 bg-primary-black-secondary'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary-red font-bold text-sm">
              #{exerciseNumber}
            </span>
            <h3 className="text-white font-bold text-lg">
              {exercise.exerciseName}
            </h3>
            <span className={`ml-auto text-sm font-semibold ${
              isComplete ? 'text-semantic-success' : 'text-gray-400'
            }`}>
              {completedSets}/{totalSets} sets
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
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

      {/* Exercise Description */}
      {exercise.description && (
        <div className="mb-3 pb-3 border-b border-gray-700">
          <p className="text-xs text-gray-400 leading-relaxed">
            {exercise.description}
          </p>
        </div>
      )}

      {/* Complete Indicator */}
      {isComplete && (
        <div className="mb-3 p-2 bg-semantic-success bg-opacity-20 border border-semantic-success rounded-none">
          <p className="text-xs text-semantic-success font-bold text-center flex items-center justify-center gap-2">
            <span className="text-base">✓</span> COMPLETE - Swipe left or right to dismiss
          </p>
        </div>
      )}

      {/* Sets List - Compact Single Line Per Set */}
      <div className="space-y-2">
        {exercise.sets.map((set, index) => (
          <CompactSetRow
            key={set.setNumber}
            set={set}
            setNumber={set.setNumber}
            onRepsChange={(reps) => handleRepsChange(index, reps)}
            onWeightChange={(weight) => handleWeightChange(index, weight)}
            onComplete={() => handleSetComplete(index)}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  );
};

// Compact Set Row Component (single line per set)
interface CompactSetRowProps {
  set: ExerciseSet;
  setNumber: number;
  onRepsChange: (reps: number) => void;
  onWeightChange: (weight: number) => void;
  onComplete: () => void;
  showToast?: (message: string) => void;
}

const CompactSetRow: React.FC<CompactSetRowProps> = ({
  set,
  setNumber,
  onRepsChange,
  onWeightChange,
  onComplete,
  showToast,
}) => {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-none border transition-all ${
      set.completed
        ? 'bg-semantic-success bg-opacity-10 border-semantic-success'
        : 'bg-primary-black border-gray-700'
    }`}>
      {/* Set Number with Checkmark */}
      <div className="flex-shrink-0 w-8">
        {set.completed ? (
          <div className="w-8 h-8 rounded-full bg-semantic-success flex items-center justify-center">
            <span className="text-white font-bold text-sm">✓</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-400 font-bold text-sm">{setNumber}</span>
          </div>
        )}
      </div>

      {/* Reps Input - Compact */}
      <div className="flex-1 min-w-0">
        <Input
          inputType="reps"
          value={set.reps}
          onValidatedChange={onRepsChange}
          showEasterEgg={showToast}
          disabled={set.completed}
          placeholder="Reps"
          className="text-center py-1 text-sm h-10"
        />
      </div>

      {/* "reps @" label */}
      <span className="text-xs text-gray-500 flex-shrink-0">reps @</span>

      {/* Weight Input - Compact */}
      <div className="flex-1 min-w-0">
        <Input
          inputType="weight"
          value={set.weight}
          onValidatedChange={onWeightChange}
          disabled={set.completed}
          placeholder="lbs"
          className="text-center py-1 text-sm h-10"
        />
      </div>

      {/* "lbs" label */}
      <span className="text-xs text-gray-500 flex-shrink-0">lbs</span>

      {/* Complete Button - Compact */}
      <div className="flex-shrink-0">
        <button
          onClick={onComplete}
          disabled={set.completed}
          className={`min-w-[60px] h-10 rounded-none font-bold text-xs transition-colors ${
            set.completed
              ? 'bg-semantic-success text-white cursor-not-allowed'
              : 'bg-primary-red hover:bg-primary-red-dark text-white active:scale-95'
          }`}
        >
          {set.completed ? '✓' : 'Done'}
        </button>
      </div>
    </div>
  );
};

export default ExerciseModule;
