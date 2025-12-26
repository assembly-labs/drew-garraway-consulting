'use client';

import { cn } from '@/lib/utils/cn';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

// Generate a consistent color based on name
function getAvatarColor(name: string): string {
  const colors = [
    'from-red-500 to-orange-500',
    'from-orange-500 to-yellow-500',
    'from-yellow-500 to-green-500',
    'from-green-500 to-teal-500',
    'from-teal-500 to-cyan-500',
    'from-cyan-500 to-blue-500',
    'from-blue-500 to-indigo-500',
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
    'from-pink-500 to-red-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Get initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white',
        'bg-gradient-to-br',
        getAvatarColor(name),
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

// Avatar with rank badge
interface RankedAvatarProps extends AvatarProps {
  rank: number;
}

export function RankedAvatar({ rank, ...props }: RankedAvatarProps) {
  return (
    <div className="relative">
      <Avatar {...props} />
      <div className={cn(
        'absolute -bottom-1 -right-1',
        'w-5 h-5 rounded-full',
        'flex items-center justify-center',
        'text-xs font-bold',
        'border-2 border-gray-900',
        rank === 1 && 'bg-yellow-500 text-yellow-900',
        rank === 2 && 'bg-gray-300 text-gray-700',
        rank === 3 && 'bg-amber-600 text-amber-100',
        rank > 3 && 'bg-gray-600 text-gray-300'
      )}>
        {rank}
      </div>
    </div>
  );
}
