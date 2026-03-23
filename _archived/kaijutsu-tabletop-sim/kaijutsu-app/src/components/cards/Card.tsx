import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  borderColor?: string;
  bgColor?: string;
  onClick?: () => void;
  selected?: boolean;
  dimmed?: boolean;
  glowing?: boolean;
  className?: string;
}

export function Card({
  children,
  borderColor = '#E5E7EB',
  bgColor = '#FFFFFF',
  onClick,
  selected = false,
  dimmed = false,
  glowing = false,
  className = '',
}: CardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`relative rounded-2xl p-4 shadow-md transition-all ${
        onClick ? 'cursor-pointer active:scale-95' : ''
      } ${selected ? 'ring-4 ring-gray-900/40 scale-[1.02]' : ''} ${
        dimmed ? 'opacity-40' : ''
      } ${glowing ? 'ring-4 ring-yellow-400/60 shadow-lg shadow-yellow-200' : ''} ${className}`}
      style={{
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor,
        backgroundColor: bgColor,
      }}
    >
      {children}
    </div>
  );
}
