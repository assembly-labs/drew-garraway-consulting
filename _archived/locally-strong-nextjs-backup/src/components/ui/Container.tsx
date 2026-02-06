import { cn } from '@/lib/utils';

type ContainerSize = 'sm' | 'md' | 'lg' | 'full';

interface ContainerProps {
  size?: ContainerSize;
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  full: 'max-w-full',
};

export default function Container({
  size = 'lg',
  children,
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
