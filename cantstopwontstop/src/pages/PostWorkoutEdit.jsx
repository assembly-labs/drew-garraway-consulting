import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { useUser } from '../context/UserContext';
import { usePersona } from '../hooks/usePersona';
import { detectPR } from '../utils/prDetection';
import { Button } from '../components/common/Button';
import { ExerciseModule } from '../components/workout/ExerciseModule';
import { PersonaMessage } from '../components/workout/PersonaMessage';
import { Modal } from '../components/common/Modal';

export function PostWorkoutEdit() {
  const navigate = useNavigate();
  const { currentWorkout, updateExercise, completeWorkout, discardWorkout } = useWorkout();
  const { workoutHistory, addWorkoutToHistory } = useUser();
  const { triggerMessage } = usePersona();

  const [prExercises, setPrExercises] = useState(new Set());
  const [personaMsg, setPersonaMsg] = useState(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check for PRs
    if (currentWorkout && workoutHistory) {
      const prs = new Set();
      currentWorkout.exercises.forEach(exercise => {
        const isPR = detectPR(exercise, workoutHistory);
        if (isPR) {
          prs.add(exercise.exerciseId);
        }
      });
      setPrExercises(prs);

      // Trigger PR message if any PRs achieved
      if (prs.size > 0) {
        const msg = triggerMessage('PR_ACHIEVED');
        setPersonaMsg(msg);
      }
    }
  }, [currentWorkout, workoutHistory]);

  if (!currentWorkout) {
    navigate('/');
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Complete workout
      const completed = await completeWorkout(currentWorkout);

      // Add to history
      await addWorkoutToHistory(completed);

      // Trigger completion message
      const msg = triggerMessage('WORKOUT_COMPLETE');
      setPersonaMsg(msg);

      // Navigate to history after brief delay
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (error) {
      console.error('Failed to save workout:', error);
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    await discardWorkout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Review Your Work</h1>
        <p className="text-gray-400 mt-2">Edit any sets before saving</p>

        {prExercises.size > 0 && (
          <div className="mt-4 bg-yellow-900 border border-yellow-600 rounded-lg p-3">
            <p className="text-yellow-400 font-bold">
              🎉 {prExercises.size} PR{prExercises.size > 1 ? 's' : ''} Achieved!
            </p>
          </div>
        )}
      </div>

      {/* Exercise list */}
      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {currentWorkout.exercises.map((exercise) => (
          <ExerciseModule
            key={exercise.exerciseId}
            exercise={exercise}
            onUpdateSet={updateExercise}
            isPR={prExercises.has(exercise.exerciseId)}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleSave}
          variant="primary"
          fullWidth
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Workout'}
        </Button>

        <Button
          onClick={() => setShowDiscardModal(true)}
          variant="ghost"
          fullWidth
          disabled={isSaving}
        >
          Discard
        </Button>
      </div>

      {/* Discard confirmation modal */}
      <Modal isOpen={showDiscardModal} onClose={() => setShowDiscardModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Discard Workout?</h2>
          <p className="text-gray-400 mb-6">
            This will delete all your progress. This action cannot be undone.
          </p>
          <div className="space-y-3">
            <Button onClick={handleDiscard} variant="danger" fullWidth>
              Yes, Discard
            </Button>
            <Button
              onClick={() => setShowDiscardModal(false)}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Persona messages */}
      {personaMsg && (
        <PersonaMessage
          persona={personaMsg.persona}
          message={personaMsg.message}
          name={personaMsg.name}
          onDismiss={() => setPersonaMsg(null)}
        />
      )}
    </div>
  );
}
