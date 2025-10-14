import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useTimer } from '../hooks/useTimer';
import Timer from '../components/common/Timer';
import ExerciseModule from '../components/workout/ExerciseModule';
import PauseOverlay from '../components/workout/PauseOverlay';
import StopOverlay from '../components/workout/StopOverlay';
import CelebrationOverlay from '../components/workout/CelebrationOverlay';
import personaService from '../services/personaService';
import affirmationService from '../services/affirmationService';
import type { Affirmation } from '../services/affirmationService';

const ActiveWorkout = () => {
  const navigate = useNavigate();
  const {
    currentWorkout,
    selectedDuration,
    updateExerciseSet,
    completeExerciseSet,
    endWorkout,
  } = useWorkout();

  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [showStopOverlay, setShowStopOverlay] = useState(false);
  const [personaMessage, setPersonaMessage] = useState<{ persona: string; message: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dismissedExercises, setDismissedExercises] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);

  // Timer hook - auto-transitions to post-workout when complete
  const { timeRemaining } = useTimer(() => {
    // Timer reached 00:00 - transition to post-workout edit
    endWorkout();
    navigate('/post-workout-edit');
  });

  // Show workout start message on mount
  useEffect(() => {
    const startMessage = personaService.getWorkoutStart();
    setPersonaMessage({ persona: startMessage.persona, message: startMessage.message });

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setPersonaMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Redirect if no workout is active
  useEffect(() => {
    if (!currentWorkout) {
      navigate('/');
    }
  }, [currentWorkout, navigate]);

  if (!currentWorkout || !selectedDuration) {
    return null;
  }

  // Calculate progress
  const totalSets = currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = currentWorkout.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
    0
  );
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Handle pause button click (CRITICAL EASTER EGG)
  const handlePauseClick = () => {
    // 1. Show full-screen red flashing overlay
    setShowPauseOverlay(true);

    // Note: Timer NEVER stops - it continues running in the background
  };

  // Handle pause overlay dismiss
  const handlePauseOverlayDismiss = () => {
    setShowPauseOverlay(false);

    // 4. Trigger persona message after dismissal
    const message = personaService.getPauseWarning();
    setPersonaMessage({ persona: message.persona, message: message.message });

    // Auto-hide persona message after 3 seconds
    setTimeout(() => {
      setPersonaMessage(null);
    }, 3000);
  };

  // Handle stop button click
  const handleStopClick = () => {
    setShowStopOverlay(true);
  };

  // Handle stop confirmation (user clicked "I'm a bitch")
  const handleStopConfirm = () => {
    endWorkout();
    navigate('/post-workout-edit');
  };

  // Handle stop overlay dismiss (user wants to continue)
  const handleStopDismiss = () => {
    setShowStopOverlay(false);
  };

  // Handle exercise set updates
  const handleUpdateSet = (exerciseId: string, setIndex: number, reps: number, weight: number) => {
    updateExerciseSet(exerciseId, setIndex, reps, weight);
  };

  // Handle set completion
  const handleCompleteSet = (exerciseId: string, setIndex: number) => {
    completeExerciseSet(exerciseId, setIndex);
  };

  // Show toast message
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handle exercise dismissal
  const handleExerciseDismiss = (exerciseId: string) => {
    // Add to dismissed set
    setDismissedExercises(prev => new Set(prev).add(exerciseId));

    // Show celebration
    const affirmation = affirmationService.getAffirmation();
    setCurrentAffirmation(affirmation);
    setShowCelebration(true);
  };

  // Handle celebration dismiss
  const handleCelebrationDismiss = () => {
    setShowCelebration(false);
    setCurrentAffirmation(null);
  };

  return (
    <div className="min-h-screen bg-primary-black flex flex-col">
      {/* Pause Overlay (CRITICAL EASTER EGG) */}
      <PauseOverlay
        isVisible={showPauseOverlay}
        onDismiss={handlePauseOverlayDismiss}
      />

      {/* Stop Overlay */}
      <StopOverlay
        isVisible={showStopOverlay}
        onConfirm={handleStopConfirm}
        onDismiss={handleStopDismiss}
      />

      {/* Celebration Overlay */}
      <CelebrationOverlay
        isVisible={showCelebration}
        affirmation={currentAffirmation}
        onDismiss={handleCelebrationDismiss}
      />

      {/* Header with Timer */}
      <div className="sticky top-0 bg-primary-black border-b border-gray-800 px-6 py-4 z-10">
        <div className="flex items-center justify-between mb-4">
          {/* Progress */}
          <div className="text-sm text-gray-400">
            {completedSets}/{totalSets} sets
          </div>

          {/* Stop & Pause Buttons */}
          <div className="flex gap-3">
            {/* Stop Button */}
            <button
              onClick={handleStopClick}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl hover:text-semantic-error transition-colors"
              title="Stop workout"
            >
              ⏹️
            </button>

            {/* Pause Button (CRITICAL) */}
            <button
              onClick={handlePauseClick}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-2xl hover:text-primary-red transition-colors"
              title="Pause (just kidding)"
            >
              ⏸️
            </button>
          </div>
        </div>

        {/* Timer */}
        <Timer
          timeRemaining={timeRemaining}
          totalDuration={selectedDuration * 60}
          size="large"
          showProgress
        />

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="text-center text-sm font-bold text-primary-red mb-2">
            {progress}% Complete
          </div>
        </div>
      </div>

      {/* Persona Message */}
      {personaMessage && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in-out px-4 w-full max-w-lg">
          <div className="bg-primary-red bg-opacity-90 border-4 border-white rounded-none p-8 shadow-red-glow-pulse">
            <p className="text-white text-4xl font-bold text-center leading-tight">
              {personaMessage.message}
            </p>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 animate-slide-in">
          <div className="bg-primary-black-secondary border-2 border-primary-red rounded-medium px-6 py-3">
            <p className="text-primary-red text-sm font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Exercises List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-hide">
        {currentWorkout.exercises
          .filter(exercise => !dismissedExercises.has(exercise.exerciseId))
          .map((exercise, index) => (
            <ExerciseModule
              key={exercise.exerciseId}
              exercise={exercise}
              exerciseNumber={index + 1}
              onUpdateSet={(setIndex, reps, weight) =>
                handleUpdateSet(exercise.exerciseId, setIndex, reps, weight)
              }
              onCompleteSet={(setIndex) =>
                handleCompleteSet(exercise.exerciseId, setIndex)
              }
              onDismiss={() => handleExerciseDismiss(exercise.exerciseId)}
              showToast={showToast}
            />
          ))}
      </div>
    </div>
  );
};

export default ActiveWorkout;
