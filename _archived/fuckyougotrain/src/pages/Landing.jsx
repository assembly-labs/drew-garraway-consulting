import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Fuck You
            <br />
            Go Train
          </h1>
          <p className="text-gray-400 text-lg">
            Time-based workouts. No stopping. No excuses.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/day')}
            variant="primary"
            fullWidth
          >
            Start Workout
          </Button>

          <Button
            onClick={() => navigate('/history')}
            variant="secondary"
            fullWidth
          >
            View History
          </Button>
        </div>

        {/* Tagline */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Built for men who don't quit
        </p>
      </div>
    </div>
  );
}
