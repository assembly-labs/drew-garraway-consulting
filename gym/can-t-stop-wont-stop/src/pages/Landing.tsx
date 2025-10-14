import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-primary-black">
      <div className="flex flex-col items-center space-y-12 w-full max-w-md">
        {/* App Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight">
            CAN'T STOP<br />WON'T STOP
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-semibold">
            Time-based training. Zero excuses.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="w-full space-y-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/day-selection')}
          >
            START WORKOUT
          </Button>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/history')}
          >
            HISTORY
          </Button>
        </div>

        {/* Tagline */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            No pause. No excuses. Just results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
