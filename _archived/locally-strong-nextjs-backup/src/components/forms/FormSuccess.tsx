import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FormSuccessProps {
  message: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

export default function FormSuccess({
  message,
  ctaLabel,
  onCtaClick,
  className,
}: FormSuccessProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-forest/20 bg-forest/5 p-6 text-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <CheckCircle className="mx-auto h-12 w-12 text-forest" aria-hidden="true" />
      <p className="mt-4 text-lg font-medium text-charcoal">{message}</p>
      {ctaLabel && onCtaClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCtaClick}
          className="mt-4"
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
