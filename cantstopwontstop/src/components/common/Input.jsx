import { useState } from 'react';

export function Input({
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder = '',
  min,
  max,
  disabled = false,
  error = null,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = "w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors bg-gray-900 text-white";
  const borderClass = error
    ? "border-red-500"
    : isFocused
      ? "border-red-500"
      : "border-gray-600";

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        className={`${baseClasses} ${borderClass} ${className}`}
        inputMode={type === 'number' ? 'decimal' : 'text'}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
