import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { useTimer } from '../hooks/useTimer';
import { useExerciseTimer } from '../hooks/useExerciseTimer';
import { Exercise } from '../data/exerciseLibrary';
import { getRandomMessage } from '../data/pushMessages';
import { WorkoutSession } from '../services/StorageService';

interface ExerciseTracking {
  exerciseId: string;
  exerciseName: string;
  completed: boolean;
  skipped: boolean;
  sets: {
    setNumber: number;
    reps: number;
    weight?: number;
    completed: boolean;
  }[];
}

interface ActiveWorkoutScreenProps {
  planId: string;
  planName: string;
  exercises: Exercise[];
  totalTime: number;
  mode: 'challenge' | 'beast';
  onComplete: (session: WorkoutSession) => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  planId,
  planName,
  exercises,
  totalTime,
  mode,
  onComplete,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [pausesUsed, setPausesUsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPushMessage, setShowPushMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [startTime] = useState(new Date().toISOString());
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionText, setTransitionText] = useState('');

  // Initialize exercise tracking
  const [exerciseTracking, setExerciseTracking] = useState<ExerciseTracking[]>(
    exercises.map((ex) => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      completed: false,
      skipped: false,
      sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        reps: ex.defaultReps,
        weight: 0,
        completed: false,
      })),
    }))
  );

  const { remainingTime, formattedTime, isUrgent, start, pause, resume, isRunning } =
    useTimer(totalTime);

  const exerciseTimer = useExerciseTimer();

  const currentExercise = exercises[currentExerciseIndex];
  const progress = `${currentExerciseIndex + 1}/${exercises.length}`;

  // Calculate overall workout progress percentage
  const workoutProgressPercentage = ((totalTime - remainingTime) / totalTime) * 100;

  // Calculate estimated time for current exercise (sets * reps * 3 seconds per rep + rest time)
  const estimatedExerciseTime =
    currentExercise.defaultSets * currentExercise.defaultReps * 3 +
    currentExercise.defaultSets * currentExercise.restTime;

  useEffect(() => {
    start();
    exerciseTimer.start();
  }, []);

  // Auto-end workout when timer reaches 0
  useEffect(() => {
    if (remainingTime === 0 && isRunning) {
      completeWorkout();
    }
  }, [remainingTime, isRunning]);

  // Reset exercise timer when moving to new exercise
  useEffect(() => {
    exerciseTimer.reset();
    exerciseTimer.start();
  }, [currentExerciseIndex]);

  // Push message system
  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(
      () => {
        const message = getRandomMessage('mid-workout');
        setCurrentMessage(message.text);
        setShowPushMessage(true);

        setTimeout(() => {
          setShowPushMessage(false);
        }, 3000);
      },
      Math.random() * 120000 + 180000
    ); // 3-5 minutes

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // Rest timer
  useEffect(() => {
    if (!isResting) return;

    const interval = setInterval(() => {
      setRestTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting]);

  const handleSetComplete = () => {
    // Mark set as completed
    setExerciseTracking((prev) => {
      const updated = [...prev];
      updated[currentExerciseIndex].sets[currentSet - 1].completed = true;
      return updated;
    });

    if (currentSet < currentExercise.defaultSets) {
      // More sets remaining
      if (currentExercise.restTime > 0) {
        setRestTimeRemaining(currentExercise.restTime);
        setIsResting(true);
      }
      setCurrentSet(currentSet + 1);
    } else {
      // Mark exercise as completed
      setExerciseTracking((prev) => {
        const updated = [...prev];
        updated[currentExerciseIndex].completed = true;
        return updated;
      });

      // Exercise complete, move to next
      if (currentExerciseIndex < exercises.length - 1) {
        // Show transition to next exercise
        const nextExercise = exercises[currentExerciseIndex + 1];
        setTransitionText(`Next: ${nextExercise.icon} ${nextExercise.name}`);
        setShowTransition(true);

        setTimeout(() => {
          setShowTransition(false);
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setCurrentSet(1);
        }, 1500);
      } else {
        // Workout complete!
        completeWorkout();
      }
    }
  };

  const handleSkipExercise = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    setShowSkipConfirm(false);

    // Mark exercise as skipped
    setExerciseTracking((prev) => {
      const updated = [...prev];
      updated[currentExerciseIndex].skipped = true;
      return updated;
    });

    if (currentExerciseIndex < exercises.length - 1) {
      // Show transition to next exercise
      const nextExercise = exercises[currentExerciseIndex + 1];
      setTransitionText(`Next: ${nextExercise.name}`);
      setShowTransition(true);

      setTimeout(() => {
        setShowTransition(false);
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
      }, 1500);
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    const endTime = new Date().toISOString();
    const actualTime = totalTime - remainingTime;

    // Calculate stats
    const completedSets = exerciseTracking.reduce(
      (total, ex) => total + ex.sets.filter((s) => s.completed).length,
      0
    );
    const totalSets = exerciseTracking.reduce((total, ex) => total + ex.sets.length, 0);
    const completionPercentage = Math.round((completedSets / totalSets) * 100);

    // Calculate volume
    const totalVolume = exerciseTracking.reduce((volume, ex) => {
      return (
        volume +
        ex.sets.reduce((setVolume, set) => {
          return set.completed ? setVolume + (set.weight || 0) * set.reps : setVolume;
        }, 0)
      );
    }, 0);

    const session: WorkoutSession = {
      id: `workout-${Date.now()}`,
      planId,
      planName,
      date: startTime,
      startTime,
      endTime,
      totalTime: actualTime,
      mode,
      exercises: exerciseTracking,
      completionPercentage,
      totalVolume,
      pausesUsed,
    };

    onComplete(session);
  };

  const handlePause = () => {
    if (mode === 'challenge' && pausesUsed < 3) {
      pause();
      exerciseTimer.pause();
      setIsPaused(true);
      setPausesUsed(pausesUsed + 1);
    }
  };

  const handleResume = () => {
    resume();
    exerciseTimer.resume();
    setIsPaused(false);
  };

  const handleEndWorkoutClick = () => {
    if (mode === 'beast') {
      setShowEndConfirm(true);
    } else {
      completeWorkout();
    }
  };

  const confirmEndWorkout = () => {
    setShowEndConfirm(false);
    setIsPaused(false);
    completeWorkout();
  };

  return (
    <div
      style={{
        backgroundColor: colors.black,
        minHeight: '100dvh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Progress Bar */}
      <ProgressBar percentage={workoutProgressPercentage} />

      {/* Top Bar */}
      <div
        style={{
          padding: spacing.m,
          paddingTop: `calc(${spacing.m} + 4px)`, // Account for progress bar
          borderBottom: `1px solid ${colors.gray800}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.s,
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
          <div
            style={{
              fontSize: 'clamp(11px, 3vw, 12px)',
              color: colors.gray400,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Total Time
          </div>
          <div
            style={{
              fontSize: 'clamp(28px, 8vw, 48px)',
              fontWeight: 700,
              color: isUrgent ? colors.red : colors.white,
              animation: isUrgent ? 'pulse 1s infinite' : 'none',
            }}
          >
            {formattedTime}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: spacing.xs, minWidth: 'fit-content' }}>
          <div
            style={{
              fontSize: 'clamp(11px, 3vw, 12px)',
              color: colors.gray400,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Exercise Time
          </div>
          <div
            style={{
              fontSize: 'clamp(20px, 5vw, 32px)',
              fontWeight: 700,
              color: exerciseTimer.elapsedTime > estimatedExerciseTime ? colors.red : colors.white,
            }}
          >
            {exerciseTimer.formattedTime}
          </div>
          <div
            style={{
              fontSize: 'clamp(11px, 3vw, 12px)',
              color: colors.gray500,
            }}
          >
            {progress}
          </div>
          {mode === 'challenge' && (
            <button
              onClick={handlePause}
              disabled={pausesUsed >= 3}
              style={{
                fontSize: 'clamp(11px, 3vw, 12px)',
                color: pausesUsed >= 3 ? colors.gray600 : colors.white,
                background: 'none',
                border: 'none',
                cursor: pausesUsed >= 3 ? 'not-allowed' : 'pointer',
                padding: spacing.xs,
              }}
            >
              ⏸ Pauses: {pausesUsed}/3
            </button>
          )}
        </div>
      </div>

      {/* Exercise Card */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.m,
          width: '100%',
          overflow: 'auto',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(24px, 7vw, 48px)',
            fontWeight: 800,
            color: colors.white,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: spacing.m,
            wordBreak: 'break-word',
            padding: `0 ${spacing.s}`,
            width: '100%',
            maxWidth: '90vw',
          }}
        >
          {currentExercise.icon} {currentExercise.name}
        </h1>
        <div
          style={{
            fontSize: 'clamp(18px, 5vw, 24px)',
            fontWeight: 700,
            color: colors.red,
            marginBottom: spacing.l,
          }}
        >
          Set {currentSet} of {currentExercise.defaultSets}
        </div>
        <div
          style={{
            fontSize: 'clamp(28px, 8vw, 48px)',
            fontWeight: 700,
            color: colors.white,
            marginBottom: spacing.m,
          }}
        >
          {currentExercise.defaultReps} reps
        </div>
        <details
          style={{
            maxWidth: 'min(400px, 90vw)',
            marginTop: spacing.l,
            color: colors.gray400,
            fontSize: 'clamp(13px, 3.5vw, 16px)',
            width: '100%',
          }}
        >
          <summary style={{ cursor: 'pointer', marginBottom: spacing.s, color: colors.white, fontSize: 'clamp(14px, 3.5vw, 16px)' }}>
            How-to Tips
          </summary>
          <ul style={{ paddingLeft: spacing.m, lineHeight: 1.6 }}>
            {currentExercise.formTips.map((tip, i) => (
              <li key={i} style={{ marginBottom: spacing.xs, wordBreak: 'break-word' }}>
                {tip}
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Bottom Actions */}
      <div style={{ padding: spacing.m, width: '100%' }}>
        <Button onClick={handleSetComplete} size="large" fullWidth>
          {isResting ? `REST ${restTimeRemaining}s` : 'DONE'}
        </Button>
        <button
          onClick={handleSkipExercise}
          style={{
            width: '100%',
            marginTop: spacing.s,
            padding: spacing.s,
            background: 'none',
            border: 'none',
            color: colors.white,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
          }}
        >
          Skip Exercise
        </button>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.m,
            zIndex: 1000,
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          <div style={{ fontSize: 'clamp(64px, 15vw, 96px)', marginBottom: spacing.l }}>⏸</div>
          <h2
            style={{
              fontSize: 'clamp(28px, 7vw, 48px)',
              fontWeight: 800,
              color: colors.white,
              marginBottom: spacing.s,
              textAlign: 'center',
            }}
          >
            PAUSED
          </h2>
          <p
            style={{
              fontSize: 'clamp(16px, 4vw, 18px)',
              color: colors.red,
              fontWeight: 700,
              marginBottom: spacing.xl,
              textAlign: 'center',
            }}
          >
            Pause {pausesUsed}/3 used
          </p>
          <div style={{ width: '100%', maxWidth: 'min(400px, 90vw)' }}>
            <Button onClick={handleResume} size="large" fullWidth>
              RESUME
            </Button>
          </div>
          <button
            onClick={handleEndWorkoutClick}
            style={{
              marginTop: spacing.m,
              background: 'none',
              border: 'none',
              color: colors.white,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 'clamp(14px, 3.5vw, 16px)',
              padding: spacing.s,
            }}
          >
            End Workout
          </button>
        </div>
      )}

      {/* Skip Confirmation Modal */}
      {showSkipConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.m,
            zIndex: 1001,
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          <div style={{ maxWidth: 'min(400px, 90vw)', width: '100%' }}>
            <h2
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 800,
                color: colors.white,
                marginBottom: spacing.s,
                textAlign: 'center',
              }}
            >
              Skip This Exercise?
            </h2>
            <p
              style={{
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                color: colors.whiteMuted,
                marginBottom: spacing.xl,
                textAlign: 'center',
              }}
            >
              {currentExercise.name} will be marked as incomplete.
            </p>
            <Button onClick={confirmSkip} fullWidth size="large" style={{ marginBottom: spacing.s }}>
              SKIP
            </Button>
            <button
              onClick={() => setShowSkipConfirm(false)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: colors.white,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                padding: spacing.s,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* End Workout Confirmation Modal (Beast Mode) */}
      {showEndConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.m,
            zIndex: 1001,
            width: '100%',
            maxWidth: '100vw',
          }}
        >
          <div style={{ maxWidth: 'min(400px, 90vw)', width: '100%' }}>
            <div style={{ fontSize: 'clamp(64px, 15vw, 96px)', textAlign: 'center', marginBottom: spacing.m }}>
              ⚠️
            </div>
            <h2
              style={{
                fontSize: 'clamp(24px, 6vw, 32px)',
                fontWeight: 800,
                color: colors.red,
                marginBottom: spacing.s,
                textAlign: 'center',
              }}
            >
              Quitting Early?
            </h2>
            <p
              style={{
                fontSize: 'clamp(16px, 4vw, 18px)',
                color: colors.white,
                marginBottom: spacing.xl,
                textAlign: 'center',
                fontWeight: 700,
              }}
            >
              Sure you're weak?
            </p>
            <Button onClick={confirmEndWorkout} fullWidth size="large" style={{ marginBottom: spacing.s }}>
              YES, END WORKOUT
            </Button>
            <button
              onClick={() => setShowEndConfirm(false)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: colors.white,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 'clamp(14px, 3.5vw, 16px)',
                padding: spacing.s,
              }}
            >
              Keep Going
            </button>
          </div>
        </div>
      )}

      {/* Exercise Transition Overlay */}
      {showTransition && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.m,
            zIndex: 998,
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(32px, 8vw, 48px)',
              fontWeight: 800,
              color: colors.red,
              textAlign: 'center',
              animation: 'slideUp 0.5s ease-out',
            }}
          >
            {transitionText}
          </div>
        </div>
      )}

      {/* Push Message Overlay */}
      {showPushMessage && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            border: `clamp(2px, 0.5vw, 4px) solid ${colors.red}`,
            padding: spacing.m,
            maxWidth: 'min(80%, 90vw)',
            width: '90%',
            zIndex: 999,
            animation: 'slideIn 0.4s ease-out, pulse 1s infinite',
            boxShadow: `0 0 40px rgba(220, 38, 38, 0.6)`,
          }}
        >
          <p
            style={{
              fontSize: 'clamp(16px, 4.5vw, 24px)',
              fontWeight: 700,
              color: colors.white,
              textAlign: 'center',
              margin: 0,
              wordBreak: 'break-word',
              lineHeight: 1.4,
            }}
          >
            {currentMessage}
          </p>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes slideIn {
            from {
              transform: translate(-50%, -150%);
              opacity: 0;
            }
            to {
              transform: translate(-50%, -50%);
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideUp {
            from {
              transform: translateY(30px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};
