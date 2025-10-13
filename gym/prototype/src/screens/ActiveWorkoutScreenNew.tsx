import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { ExerciseModule } from '../components/ExerciseModule';
import { ProgressBar } from '../components/ProgressBar';
import { colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { useTimer } from '../hooks/useTimer';
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
    weight: number;
    completed: boolean;
  }[];
}

interface ActiveWorkoutScreenNewProps {
  planId: string;
  planName: string;
  exercises: Exercise[];
  totalTime: number;
  mode: 'challenge' | 'beast';
  onComplete: (session: WorkoutSession) => void;
}

export const ActiveWorkoutScreenNew: React.FC<ActiveWorkoutScreenNewProps> = ({
  planId,
  planName,
  exercises,
  totalTime,
  mode,
  onComplete,
}) => {
  const [pausesUsed, setPausesUsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showPushMessage, setShowPushMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [startTime] = useState(new Date().toISOString());
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<number | null>(0);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [pauseFooterMessage, setPauseFooterMessage] = useState('');

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

  const workoutProgressPercentage = ((totalTime - remainingTime) / totalTime) * 100;

  useEffect(() => {
    start();
  }, []);

  // Auto-end workout when timer reaches 0
  useEffect(() => {
    if (remainingTime === 0 && isRunning) {
      completeWorkout();
    }
  }, [remainingTime, isRunning]);

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

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, reps: number, weight: number) => {
    setExerciseTracking((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex].reps = reps;
      updated[exerciseIndex].sets[setIndex].weight = weight;
      return updated;
    });
  };

  const handleCompleteSet = (exerciseIndex: number, setIndex: number) => {
    setExerciseTracking((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex].completed = true;

      // Check if all sets are completed for this exercise
      const allSetsCompleted = updated[exerciseIndex].sets.every((s) => s.completed);
      if (allSetsCompleted) {
        updated[exerciseIndex].completed = true;
      }

      return updated;
    });
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

  const handlePauseButtonClick = () => {
    // Show "FUCK YOU NO STOPPING" overlay
    setShowPauseOverlay(true);

    // Haptic feedback - vibration pattern
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }

    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      setShowPauseOverlay(false);

      // Show provocative footer message
      const messages = [
        "Your competition isn't taking breaks.",
        "Weakness is a choice. Keep going.",
        "You tap in training, you tap in life.",
        "The only easy day was yesterday.",
        "Pain is temporary. Quitting is forever.",
        "Stop when you're done, not when you're tired.",
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setPauseFooterMessage(randomMessage);

      // Clear footer message after 5 seconds
      setTimeout(() => {
        setPauseFooterMessage('');
      }, 5000);
    }, 2000);

    // Timer NEVER stops running - do nothing to the timer
  };

  const handleEndSessionClick = () => {
    // For testing: immediately end the workout
    completeWorkout();
  };

  const handleResume = () => {
    resume();
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

  const handleToggleExpand = (index: number) => {
    setExpandedExerciseIndex(expandedExerciseIndex === index ? null : index);
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

      {/* Sticky Timer Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: colors.black,
          borderBottom: `1px solid ${colors.gray800}`,
          padding: spacing.m,
          paddingTop: `calc(${spacing.m} + 4px)`, // Account for progress bar
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: spacing.m,
          }}
        >
          {/* Timer */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 'clamp(11px, 3vw, 12px)',
                color: colors.gray400,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: spacing.xxs,
              }}
            >
              Total Time
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.s,
              }}
            >
              <div
                style={{
                  fontSize: 'clamp(36px, 9vw, 56px)',
                  fontWeight: 700,
                  color: isUrgent ? colors.red : colors.white,
                  animation: isUrgent ? 'pulse 1s infinite' : 'none',
                  lineHeight: 1,
                }}
              >
                {formattedTime}
              </div>
              {/* Pause Button */}
              <button
                onClick={handlePauseButtonClick}
                style={{
                  fontSize: 'clamp(24px, 6vw, 32px)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: spacing.xs,
                  color: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Try to pause... I dare you"
              >
                ⏸️
              </button>
            </div>
          </div>

          {/* Controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              alignItems: 'flex-end',
            }}
          >
            {/* END SESSION - Testing Button */}
            <button
              onClick={handleEndSessionClick}
              style={{
                fontSize: 'clamp(11px, 3vw, 12px)',
                color: colors.gray400,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.xs,
              }}
            >
              🧪 END SESSION
            </button>
            <button
              onClick={handleEndWorkoutClick}
              style={{
                fontSize: 'clamp(11px, 3vw, 12px)',
                color: colors.red,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: spacing.xs,
                textDecoration: 'underline',
              }}
            >
              End Workout
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Exercise List */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: spacing.m,
        }}
      >
        <div
          style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: colors.gray400,
            marginBottom: spacing.m,
            textAlign: 'center',
          }}
        >
          {planName}
        </div>

        {exerciseTracking.map((exerciseData, index) => (
          <ExerciseModule
            key={exerciseData.exerciseId}
            exercise={exercises[index]}
            exerciseIndex={index}
            sets={exerciseData.sets}
            onUpdateSet={(setIndex, reps, weight) =>
              handleUpdateSet(index, setIndex, reps, weight)
            }
            onCompleteSet={(setIndex) => handleCompleteSet(index, setIndex)}
            isExpanded={expandedExerciseIndex === index}
            onToggleExpand={() => handleToggleExpand(index)}
          />
        ))}

        {/* DONE EARLY Button */}
        <button
          onClick={() => completeWorkout()}
          style={{
            width: '100%',
            marginTop: spacing.l,
            padding: spacing.m,
            background: colors.red,
            border: `2px solid ${colors.white}`,
            borderRadius: '8px',
            color: colors.white,
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
          }}
        >
          🧪 DONE EARLY (Testing)
        </button>
      </div>

      {/* "FUCK YOU NO STOPPING" Overlay */}
      {showPauseOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.red,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: spacing.l,
            zIndex: 9999,
            animation: 'redFlash 0.5s infinite',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(32px, 8vw, 64px)',
              fontWeight: 900,
              color: colors.white,
              textAlign: 'center',
              marginBottom: spacing.m,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              lineHeight: 1.2,
            }}
          >
            FUCK YOU<br />NO STOPPING
          </h1>
          <div
            style={{
              fontSize: 'clamp(80px, 20vw, 120px)',
              marginTop: spacing.m,
            }}
          >
            🖕
          </div>
        </div>
      )}

      {/* Provocative Footer Message */}
      {pauseFooterMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(220, 38, 38, 0.95)',
            padding: spacing.m,
            zIndex: 999,
            borderTop: `2px solid ${colors.white}`,
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              fontWeight: 700,
              color: colors.white,
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {pauseFooterMessage}
          </p>
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
          @keyframes redFlash {
            0%, 100% {
              opacity: 1;
              background-color: #DC2626;
            }
            50% {
              opacity: 0.9;
              background-color: #B91C1C;
            }
          }
          @keyframes slideUp {
            from {
              transform: translateY(100%);
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
