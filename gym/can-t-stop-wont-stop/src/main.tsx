import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { WorkoutProvider } from './context/WorkoutContext';
import { UserProvider } from './context/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <WorkoutProvider>
        <App />
      </WorkoutProvider>
    </UserProvider>
  </StrictMode>
);
