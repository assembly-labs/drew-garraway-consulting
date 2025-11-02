import { createBrowserRouter } from 'react-router-dom';
import { Dashboard } from '@/core/components/Dashboard';
import { CalendarView } from '@/core/components/CalendarView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/calendar',
    element: <CalendarView />,
  },
  // Future module routes will be added here
]);