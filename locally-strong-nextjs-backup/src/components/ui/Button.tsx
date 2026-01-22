import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-forest text-white hover:bg-forest/90',
  secondary: 'bg-earth text-white hover:bg-earth/90',
  ghost: 'border-2 border-forest text-forest bg-transparent hover:bg-forest/10',
  outline: 'border-2 border-charcoal text-charcoal bg-transparent hover:bg-charcoal/10',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className,
  type = 'button',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200',
    'focus-visible:outline-2 focus-visible:outline-forest focus-visible:outline-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseStyles}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
