import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudyModeSelect } from './pages/StudyModeSelect';
import { Flashcard } from './pages/Flashcard';
import { Quiz } from './pages/Quiz';
import { ExamSimulation } from './pages/ExamSimulation';
import { WeakAreas } from './pages/WeakAreas';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';
import { Formulas } from './pages/Formulas';
import { MemoryHooks } from './pages/MemoryHooks';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="study" element={<StudyModeSelect />} />
            <Route path="study/flashcard" element={<Flashcard />} />
            <Route path="study/quiz" element={<Quiz />} />
            <Route path="study/exam" element={<ExamSimulation />} />
            <Route path="study/weak" element={<WeakAreas />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
            <Route path="formulas" element={<Formulas />} />
            <Route path="hooks" element={<MemoryHooks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
