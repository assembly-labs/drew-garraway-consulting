import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import History from './pages/History';
import DaySelection from './pages/DaySelection';
import TimeSelection from './pages/TimeSelection';
import WorkoutPlanPreview from './pages/WorkoutPlanPreview';
import ActiveWorkout from './pages/ActiveWorkout';
import PostWorkoutEdit from './pages/PostWorkoutEdit';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary-black text-white">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Workout Flow */}
          <Route path="/day-selection" element={<DaySelection />} />
          <Route path="/time-selection" element={<TimeSelection />} />
          <Route path="/workout-preview" element={<WorkoutPlanPreview />} />
          <Route path="/active-workout" element={<ActiveWorkout />} />
          <Route path="/post-workout-edit" element={<PostWorkoutEdit />} />

          {/* History */}
          <Route path="/history" element={<History />} />

          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
