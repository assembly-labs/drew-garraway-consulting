import { useState } from 'react';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ActiveWorkoutScreen } from './screens/ActiveWorkoutScreen';
import { Exercise } from './data/exerciseLibrary';
import { workoutPlans, WorkoutPlan } from './data/workoutPlans';

type Screen = 'welcome' | 'mode-selection' | 'dashboard' | 'workout';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [workoutMode, setWorkoutMode] = useState<'challenge' | 'beast'>('challenge');
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan>(workoutPlans[0]);
  const [currentWorkout, setCurrentWorkout] = useState<{
    exercises: Exercise[];
    totalTime: number;
  } | null>(null);

  const handleModeSelected = (mode: 'challenge' | 'beast') => {
    setWorkoutMode(mode);
    setCurrentScreen('dashboard');
  };

  const handlePlanSelected = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
  };

  const handleStartWorkout = (exercises: Exercise[], totalTime: number) => {
    setCurrentWorkout({ exercises, totalTime });
    setCurrentScreen('workout');
  };

  const handleWorkoutComplete = () => {
    alert('Workout Complete! 🎉\n\nThis would show the summary screen in the full app.');
    setCurrentScreen('dashboard');
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onContinue={() => setCurrentScreen('mode-selection')} />
      )}

      {currentScreen === 'mode-selection' && (
        <ModeSelectionScreen onModeSelected={handleModeSelected} />
      )}

      {currentScreen === 'dashboard' && (
        <DashboardScreen
          onStartWorkout={handleStartWorkout}
          selectedPlan={selectedPlan}
          onPlanSelected={handlePlanSelected}
          availablePlans={workoutPlans}
        />
      )}

      {currentScreen === 'workout' && currentWorkout && (
        <ActiveWorkoutScreen
          exercises={currentWorkout.exercises}
          totalTime={currentWorkout.totalTime}
          mode={workoutMode}
          onComplete={handleWorkoutComplete}
        />
      )}
    </div>
  );
}

export default App;
