import { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { InitialSelectionScreen } from './screens/InitialSelectionScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { ModeSelectionScreen } from './screens/ModeSelectionScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ActiveWorkoutScreenNew } from './screens/ActiveWorkoutScreenNew';
import { WorkoutSummaryScreen } from './screens/WorkoutSummaryScreen';
import { WorkoutHistoryScreen } from './screens/WorkoutHistoryScreen';
import { PlanManagementScreen } from './screens/PlanManagementScreen';
import { PlanCreationScreen } from './screens/PlanCreationScreen';
import { PreFlightScreen } from './screens/PreFlightScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Toast } from './components/Toast';
import { WorkoutPlan } from './data/workoutPlans';
import { WorkoutSession, storageService } from './services/StorageService';

type Screen =
  | 'initial-selection'
  | 'welcome'
  | 'mode-selection'
  | 'dashboard'
  | 'pre-flight'
  | 'workout'
  | 'summary'
  | 'history'
  | 'plans'
  | 'create-plan'
  | 'settings';

function AppContent() {
  const {
    plans,
    addPlan,
    deletePlan,
    workoutHistory,
    addWorkoutSession,
    getRecentWorkout,
    preferences,
    updatePreferences,
    lastUsedPlanId,
    setLastUsedPlanId,
    isLoading,
  } = useAppContext();

  const [currentScreen, setCurrentScreen] = useState<Screen>('initial-selection');
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<{
    planId: string;
    planName: string;
    exercises: WorkoutPlan['exercises'];
    totalTime: number;
  } | null>(null);
  const [completedSession, setCompletedSession] = useState<WorkoutSession | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Loading screen
  if (isLoading) {
    return (
      <div style={{
        backgroundColor: '#0A0A0A',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontSize: '18px',
      }}>
        Loading...
      </div>
    );
  }

  // Handlers
  const handleModeSelected = (mode: 'challenge' | 'beast') => {
    updatePreferences({ mode });
    setCurrentScreen('dashboard');
  };

  const handlePlanSelected = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setLastUsedPlanId(plan.id);
  };

  const handleStartWorkout = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    setCurrentScreen('pre-flight');
  };

  const handlePreFlightStart = (totalTimeInSeconds: number) => {
    if (!selectedPlan) return;

    setCurrentWorkout({
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      exercises: selectedPlan.exercises,
      totalTime: totalTimeInSeconds,
    });
    setCurrentScreen('workout');
  };

  const handleWorkoutComplete = async (session: WorkoutSession) => {
    await addWorkoutSession(session);
    setCompletedSession(session);
    setCurrentWorkout(null);
    setCurrentScreen('summary');
  };

  const handleSummaryDone = () => {
    setCompletedSession(null);
    setCurrentScreen('dashboard');
  };

  const handleManagePlans = () => {
    setCurrentScreen('plans');
  };

  const handleViewHistory = () => {
    setCurrentScreen('history');
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setCurrentScreen('create-plan');
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setCurrentScreen('create-plan');
  };

  const handleSavePlan = async (plan: WorkoutPlan) => {
    await addPlan(plan);
    setEditingPlan(null);
    setToast({ message: 'Plan saved successfully!', type: 'success' });
    setCurrentScreen('plans');
  };

  const handleDeletePlan = async (planId: string) => {
    await deletePlan(planId);
    setToast({ message: 'Plan deleted', type: 'info' });
  };

  const handleClearAllData = async () => {
    await storageService.clearAllData();
    setToast({ message: 'All data cleared', type: 'success' });
    window.location.reload();
  };

  // Initialize selected plan
  if (!selectedPlan && plans.length > 0) {
    const initialPlan = lastUsedPlanId
      ? plans.find(p => p.id === lastUsedPlanId) || plans[0]
      : plans[0];
    setSelectedPlan(initialPlan);
  }

  // Render current screen
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {currentScreen === 'initial-selection' && (
        <InitialSelectionScreen
          onViewHistory={() => setCurrentScreen('history')}
          onStartWorkout={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen onContinue={() => setCurrentScreen('mode-selection')} />
      )}

      {currentScreen === 'mode-selection' && (
        <ModeSelectionScreen onModeSelected={handleModeSelected} />
      )}

      {currentScreen === 'dashboard' && selectedPlan && (
        <DashboardScreen
          onStartWorkout={handleStartWorkout}
          selectedPlan={selectedPlan}
          onPlanSelected={handlePlanSelected}
          availablePlans={plans}
          onManagePlans={handleManagePlans}
          onViewHistory={handleViewHistory}
          onSettings={() => setCurrentScreen('settings')}
          recentWorkout={getRecentWorkout()}
        />
      )}

      {currentScreen === 'pre-flight' && selectedPlan && (
        <PreFlightScreen
          plan={selectedPlan}
          mode={preferences.mode}
          onStart={handlePreFlightStart}
          onBack={() => setCurrentScreen('dashboard')}
        />
      )}

      {currentScreen === 'workout' && currentWorkout && (
        <ActiveWorkoutScreenNew
          planId={currentWorkout.planId}
          planName={currentWorkout.planName}
          exercises={currentWorkout.exercises}
          totalTime={currentWorkout.totalTime}
          mode={preferences.mode}
          onComplete={handleWorkoutComplete}
        />
      )}

      {currentScreen === 'summary' && completedSession && (
        <WorkoutSummaryScreen
          session={completedSession}
          onDone={handleSummaryDone}
        />
      )}

      {currentScreen === 'history' && (
        <WorkoutHistoryScreen
          workoutHistory={workoutHistory}
          onBack={() => setCurrentScreen('initial-selection')}
        />
      )}

      {currentScreen === 'plans' && (
        <PlanManagementScreen
          plans={plans}
          onBack={() => setCurrentScreen('dashboard')}
          onCreateNew={handleCreatePlan}
          onSelectPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
        />
      )}

      {currentScreen === 'create-plan' && (
        <PlanCreationScreen
          onSave={handleSavePlan}
          onBack={() => setCurrentScreen('plans')}
          existingPlan={editingPlan || undefined}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          preferences={preferences}
          onUpdatePreferences={updatePreferences}
          onBack={() => setCurrentScreen('dashboard')}
          onClearData={handleClearAllData}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
