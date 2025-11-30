import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from './core/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;