import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { UserProvider } from './context/UserContext';
import { Landing } from './pages/Landing';
import { DaySelection } from './pages/DaySelection';
import { WorkoutPlanPreview } from './pages/WorkoutPlanPreview';
import { ActiveWorkout } from './pages/ActiveWorkout';
import { PostWorkoutEdit } from './pages/PostWorkoutEdit';
import { History } from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <WorkoutProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/day" element={<DaySelection />} />
            <Route path="/preview" element={<WorkoutPlanPreview />} />
            <Route path="/workout" element={<ActiveWorkout />} />
            <Route path="/edit" element={<PostWorkoutEdit />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </WorkoutProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
