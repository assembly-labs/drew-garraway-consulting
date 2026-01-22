import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  className?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  rows = 5,
  minLength,
  maxLength,
  className,
}: FormFieldProps) {
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;

  const baseInputStyles = cn(
    'w-full rounded-lg border bg-white px-4 py-3 text-charcoal',
    'placeholder:text-charcoal/50',
    'focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-charcoal/20'
  );

  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-charcoal">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          minLength={minLength}
          maxLength={maxLength}
          className={baseInputStyles}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          className={baseInputStyles}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
