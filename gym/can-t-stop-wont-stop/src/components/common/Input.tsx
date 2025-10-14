import React, { useState, useEffect } from 'react';
import { validateReps, validateWeight } from '../../utils/validation';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'reps' | 'weight';
  onValidatedChange?: (value: number) => void;
  showEasterEgg?: (message: string) => void;
}

/**
 * Input Component
 *
 * Types:
 * - text, email, password: Standard text inputs
 * - number: Generic number input
 * - reps: Validated reps input (0-69)
 * - weight: Validated weight input (0-9999)
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  inputType = 'text',
  onValidatedChange,
  showEasterEgg,
  className = '',
  value,
  onChange,
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [validationMessage, setValidationMessage] = useState<string | undefined>(error);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    setValidationMessage(error);
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // For reps and weight, validate on change
    if (inputType === 'reps') {
      const validation = validateReps(newValue);
      setLocalValue(validation.value.toString());
      setValidationMessage(validation.message);

      if (validation.isEasterEgg && showEasterEgg) {
        showEasterEgg(validation.message || '');
      }

      if (onValidatedChange) {
        onValidatedChange(validation.value);
      }
    } else if (inputType === 'weight') {
      const validation = validateWeight(newValue);
      setLocalValue(validation.value.toString());
      setValidationMessage(validation.message);

      if (onValidatedChange) {
        onValidatedChange(validation.value);
      }
    } else {
      setLocalValue(newValue);
      if (onChange) {
        onChange(e);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Re-validate on blur for reps/weight
    const stringValue = typeof localValue === 'string' ? localValue : String(localValue);

    if (inputType === 'reps') {
      const validation = validateReps(stringValue);
      setLocalValue(validation.value.toString());
      setValidationMessage(validation.message);
      if (onValidatedChange) {
        onValidatedChange(validation.value);
      }
    } else if (inputType === 'weight') {
      const validation = validateWeight(stringValue);
      setLocalValue(validation.value.toString());
      setValidationMessage(validation.message);
      if (onValidatedChange) {
        onValidatedChange(validation.value);
      }
    }

    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  // Determine HTML input type
  let htmlInputType = inputType;
  if (inputType === 'reps' || inputType === 'weight') {
    htmlInputType = 'number';
  }

  // Determine CSS classes
  const isNumberInput = inputType === 'reps' || inputType === 'weight' || inputType === 'number';
  const inputClasses = isNumberInput
    ? `input-number ${className}`
    : `input-field ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-white mb-2">
          {label}
        </label>
      )}
      <input
        type={htmlInputType}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={inputClasses}
        {...props}
      />
      {validationMessage && (
        <p className={`mt-2 text-sm ${validationMessage.includes('Nice') ? 'text-primary-red' : 'text-semantic-warning'}`}>
          {validationMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
