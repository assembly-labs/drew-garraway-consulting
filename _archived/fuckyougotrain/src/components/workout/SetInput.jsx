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
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-300 font-bold text-lg">Set {setNumber}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-400 text-xs mb-1">Reps</label>
          <Input
            type="number"
            value={localReps}
            onChange={(e) => setLocalReps(e.target.value)}
            onBlur={handleRepsBlur}
            placeholder="0"
            min={0}
            max={69}
            error={repsError}
            className="text-center text-xl font-bold"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-xs mb-1">Weight (lbs)</label>
          <Input
            type="number"
            value={localWeight}
            onChange={(e) => setLocalWeight(e.target.value)}
            onBlur={handleWeightBlur}
            placeholder="0"
            min={0}
            max={9999}
            error={weightError}
            className="text-center text-xl font-bold"
          />
        </div>
      </div>
    </div>
  );
}
