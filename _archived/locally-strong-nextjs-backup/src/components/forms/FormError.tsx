import { AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function FormError({
  message,
  onRetry,
  className,
}: FormErrorProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-6 text-center',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" aria-hidden="true" />
      <p className="mt-4 text-lg font-medium text-charcoal">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          Try again
        </Button>
      )}
    </div>
  );
}
