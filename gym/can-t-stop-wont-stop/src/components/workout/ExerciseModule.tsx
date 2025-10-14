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
 * ExerciseModule Component
 *
 * Features:
 * - Collapsible exercise cards
 * - Display: exercise name, set progress, current reps/weight
 * - Tap to expand
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const completedSets = exercise.sets.filter(set => set.completed).length;
  const totalSets = exercise.sets.length;
  const isComplete = completedSets === totalSets;

  const toggleExpand = () => {
    if (!isSwiping) {
      setIsExpanded(!isExpanded);
    }
  };

  // Swipe handlers
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

  if (!isExpanded) {
    // Find next incomplete set
    const nextSet = exercise.sets.find(set => !set.completed);
    const nextSetNumber = nextSet ? nextSet.setNumber : totalSets;

    // Truncate description to 60 chars
    const descriptionPreview = exercise.description
      ? exercise.description.length > 60
        ? exercise.description.substring(0, 60) + '...'
        : exercise.description
      : null;

    // Collapsed View
    return (
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: getSwipeTransform(),
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        <button
          onClick={toggleExpand}
          className={`w-full text-left py-5 px-6 ${
            isComplete
              ? 'exercise-card border-semantic-success bg-semantic-success bg-opacity-10'
              : 'exercise-card'
          }`}
        >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary-red font-bold text-sm">
                #{exerciseNumber}
              </span>
              <h3 className="text-white font-bold text-lg">
                {exercise.exerciseName}
              </h3>
            </div>

            {/* Description Preview */}
            {descriptionPreview && (
              <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                {descriptionPreview}
              </p>
            )}

            {/* Current Progress */}
            <div className="flex items-center gap-3 text-sm mb-2">
              <span className="text-gray-400">
                Sets: {completedSets}/{totalSets}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">{exercise.category}</span>
              {exercise.equipment && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400">{exercise.equipment}</span>
                </>
              )}
            </div>

            {/* Next Set Info or Complete Indicator */}
            {isComplete ? (
              <div className="text-xs text-semantic-success font-bold flex items-center gap-2">
                <span className="text-lg">✓</span> COMPLETE - Swipe to dismiss
              </div>
            ) : nextSet ? (
              <div className="text-xs text-primary-red font-semibold">
                Next: Set {nextSetNumber} • {nextSet.reps} reps @ {nextSet.weight} lbs
              </div>
            ) : null}
          </div>
          <div className={`text-2xl ml-4 ${isComplete ? 'text-semantic-success' : 'text-gray-400'}`}>
            {isComplete ? '✓' : '▼'}
          </div>
        </div>
      </button>
      </div>
    );
  }

  // Expanded View
  return (
    <div className="exercise-card-expanded w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary-red font-bold text-sm">
              #{exerciseNumber}
            </span>
            <h3 className="text-white font-bold text-xl">
              {exercise.exerciseName}
            </h3>
          </div>
          <div className="text-sm text-gray-400">
            {completedSets}/{totalSets} sets completed
          </div>
        </div>
        <button
          onClick={toggleExpand}
          className="text-gray-400 hover:text-white text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          ▲
        </button>
      </div>

      {/* Exercise Description */}
      {exercise.description && (
        <div className="mb-4 p-3 bg-primary-black border border-gray-700 rounded-none">
          <p className="text-sm text-gray-300">{exercise.description}</p>
        </div>
      )}

      {/* Sets */}
      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <SetInput
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

// SetInput Component (individual set)
interface SetInputProps {
  set: ExerciseSet;
  setNumber: number;
  onRepsChange: (reps: number) => void;
  onWeightChange: (weight: number) => void;
  onComplete: () => void;
  showToast?: (message: string) => void;
}

const SetInput: React.FC<SetInputProps> = ({
  set,
  setNumber,
  onRepsChange,
  onWeightChange,
  onComplete,
  showToast,
}) => {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-none border ${
      set.completed
        ? 'bg-semantic-success bg-opacity-10 border-semantic-success'
        : 'bg-primary-black-secondary border-gray-700'
    }`}>
      {/* Set Number */}
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          set.completed
            ? 'bg-semantic-success text-white'
            : 'bg-gray-800 text-gray-400'
        }`}>
          {setNumber}
        </div>
      </div>

      {/* Reps Input */}
      <div className="flex-1">
        <Input
          inputType="reps"
          value={set.reps}
          onValidatedChange={onRepsChange}
          showEasterEgg={showToast}
          disabled={set.completed}
          placeholder="Reps"
          className="text-center py-2"
        />
      </div>

      {/* Weight Input */}
      <div className="flex-1">
        <Input
          inputType="weight"
          value={set.weight}
          onValidatedChange={onWeightChange}
          disabled={set.completed}
          placeholder="Weight"
          className="text-center py-2"
        />
      </div>

      {/* Complete Button */}
      <div className="flex-shrink-0">
        <button
          onClick={onComplete}
          disabled={set.completed}
          className={`min-w-[44px] min-h-[44px] rounded-none font-bold text-sm transition-colors ${
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
