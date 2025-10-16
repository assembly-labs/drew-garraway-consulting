import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useTimer } from '../hooks/useTimer';
import { usePersona } from '../hooks/usePersona';
import { useHaptic } from '../hooks/useHaptic';
import { Timer } from '../components/common/Timer';
import { ExerciseModule } from '../components/workout/ExerciseModule';
import { PersonaMessage } from '../components/workout/PersonaMessage';

export function ActiveWorkout() {
  const navigate = useNavigate();
  const { currentWorkout, updateExercise } = useWorkout();
  const { triggerMessage } = usePersona();
  const { vibratePauseWarning } = useHaptic();

  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [personaMsg, setPersonaMsg] = useState(null);
  const [easterEggMsg, setEasterEggMsg] = useState(null);

  // Initialize timer
  const { timeRemaining, totalTime, isRunning, isComplete, start } = useTimer(
    currentWorkout?.durationSelected * 60,
    () => {
      // Timer complete - go to post-workout edit
      navigate('/edit');
    }
  );

  // Start timer on mount
  useEffect(() => {
    if (!isRunning && currentWorkout) {
      start();
      // Trigger workout start message
      const msg = triggerMessage('WORKOUT_START');
      setPersonaMsg(msg);
    }
  }, []);

  // Redirect if no workout
  if (!currentWorkout) {
    navigate('/');
    return null;
  }

  // Calculate progress
  const completedSets = currentWorkout.exercises.reduce(
    (total, ex) => total + ex.sets.filter(s => s.reps > 0 || s.weight > 0).length,
    0
  );
  const totalSets = currentWorkout.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0
  );
  const progressPercentage = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  /**
   * PAUSE BUTTON EASTER EGG - CRITICAL IMPLEMENTATION
   */
  const handlePauseClick = () => {
    // Show full-screen red overlay
    setShowPauseOverlay(true);

    // Trigger haptic feedback
    vibratePauseWarning();

    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      setShowPauseOverlay(false);

      // Trigger persona message after overlay dismisses
      const msg = triggerMessage('PAUSE_WARNING');
      setPersonaMsg(msg);
    }, 2000);

    // Timer NEVER stops - do nothing to timer
  };

  /**
   * Handle set updates with auto-save
   */
  const handleSetUpdate = async (exerciseId, setIndex, updates) => {
    await updateExercise(exerciseId, setIndex, updates);
  };

  /**
   * Handle easter egg from 69 reps
   */
  const handleEasterEgg = (message) => {
    setEasterEggMsg(message);
    setTimeout(() => setEasterEggMsg(null), 5000);
  };

  /**
   * Trigger mid-workout push messages every 10 minutes
   */
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning && !isComplete) {
        const msg = triggerMessage('MID_WORKOUT');
        setPersonaMsg(msg);
      }
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(interval);
  }, [isRunning, isComplete]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-6">
      {/* Timer header - sticky */}
      <div className="sticky top-0 z-30 bg-[#0A0A0A] border-b border-gray-800 pb-4 pt-6 px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Timer timeRemaining={timeRemaining} totalTime={totalTime} />
          {/* Pause button */}
          <button
            onClick={handlePauseClick}
            className="text-3xl text-gray-600 hover:text-gray-400 transition-colors ml-2"
            title="Try to pause..."
          >
            ⏸️
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="px-6 mt-6 space-y-4">
        {currentWorkout.exercises.map((exercise) => (
          <ExerciseModule
            key={exercise.exerciseId}
            exercise={exercise}
            onUpdateSet={handleSetUpdate}
            onEasterEgg={handleEasterEgg}
          />
        ))}
      </div>

      {/* Pause overlay - EXACT SPEC */}
      {showPauseOverlay && (
        <div className="fixed inset-0 z-[9999] bg-red-600 flex flex-col items-center justify-center animate-pulse">
          <p className="text-white text-4xl md:text-6xl font-bold text-center px-6 mb-8">
            FUCK YOU,
            <br />
            NO STOPPING
          </p>
        </div>
      )}

      {/* Persona messages */}
      {personaMsg && (
        <PersonaMessage
          persona={personaMsg.persona}
          message={personaMsg.message}
          name={personaMsg.name}
          onDismiss={() => setPersonaMsg(null)}
          duration={2000}
        />
      )}

      {/* Easter egg message (69 reps) */}
      {easterEggMsg && (
        <div className="fixed bottom-4 left-4 right-4 bg-yellow-500 text-black p-4 rounded-lg shadow-xl z-40">
          <p className="font-bold">{easterEggMsg}</p>
        </div>
      )}
    </div>
  );
}
