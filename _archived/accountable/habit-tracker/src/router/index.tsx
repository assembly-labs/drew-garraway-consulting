import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '@/core/components/Dashboard';
import { CalendarView } from '@/core/components/CalendarView';
import { ProgressView } from '@/core/components/ProgressView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/calendar',
    element: <CalendarView />,
  },
  {
    path: '/progress',
    element: <ProgressView />,
  },
  // Future module routes will be added here
], {
  basename: '/accountable/habit-tracker'
});