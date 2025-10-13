import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { validateReps, validateWeight } from '../../utils/validation';

export function SetInput({ setNumber, reps, weight, onUpdate, onEasterEgg }) {
  const [localReps, setLocalReps] = useState(reps?.toString() || '0');
  const [localWeight, setLocalWeight] = useState(weight?.toString() || '0');
  const [repsError, setRepsError] = useState(null);
  const [weightError, setWeightError] = useState(null);

  useEffect(() => {
    setLocalReps(reps?.toString() || '0');
    setLocalWeight(weight?.toString() || '0');
  }, [reps, weight]);

  const handleRepsBlur = () => {
    const result = validateReps(localReps);
    setLocalReps(result.value.toString());

    if (result.message && !result.isEasterEgg) {
      setRepsError(result.message);
      setTimeout(() => setRepsError(null), 3000);
    }

    if (result.isEasterEgg) {
      onEasterEgg?.(result.message);
    }

    onUpdate({ reps: result.value });
  };

  const handleWeightBlur = () => {
    const result = validateWeight(localWeight);
    setLocalWeight(result.value.toString());

    if (result.message) {
      setWeightError(result.message);
      setTimeout(() => setWeightError(null), 3000);
    }

    onUpdate({ weight: result.value });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 font-medium w-12">Set {setNumber}</span>
      <div className="flex-1">
        <Input
          type="number"
          value={localReps}
          onChange={(e) => setLocalReps(e.target.value)}
          onBlur={handleRepsBlur}
          placeholder="Reps"
          min={0}
          max={69}
          error={repsError}
        />
      </div>
      <span className="text-gray-500">×</span>
      <div className="flex-1">
        <Input
          type="number"
          value={localWeight}
          onChange={(e) => setLocalWeight(e.target.value)}
          onBlur={handleWeightBlur}
          placeholder="Weight"
          min={0}
          max={9999}
          error={weightError}
        />
      </div>
      <span className="text-gray-400 text-sm">lbs</span>
    </div>
  );
}
