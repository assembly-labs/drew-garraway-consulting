'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const sizes = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 'translate-x-7',
  },
};

export function Toggle({
  enabled,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
}: ToggleProps) {
  return (
    <div className={cn(
      'flex items-center justify-between',
      disabled && 'opacity-50 cursor-not-allowed'
    )}>
      {(label || description) && (
        <div className="flex-1 mr-4">
          {label && (
            <div className="text-sm font-medium text-white">{label}</div>
          )}
          {description && (
            <div className="text-xs text-gray-400 mt-0.5">{description}</div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        className={cn(
          'relative inline-flex flex-shrink-0 rounded-full',
          'transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900',
          sizes[size].track,
          enabled ? 'bg-red-500' : 'bg-gray-600',
          disabled && 'pointer-events-none'
        )}
        role="switch"
        aria-checked={enabled}
      >
        <motion.span
          layout
          className={cn(
            'inline-block rounded-full bg-white shadow-lg',
            'ring-0',
            sizes[size].thumb
          )}
          style={{
            marginTop: size === 'sm' ? 2 : 2,
            marginLeft: enabled ? (size === 'sm' ? 18 : size === 'md' ? 22 : 30) : 2,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

// Around Kids Toggle with special styling
interface AroundKidsToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function AroundKidsToggle({ enabled, onChange }: AroundKidsToggleProps) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full p-4 rounded-2xl',
        'flex items-center justify-between',
        'transition-all duration-200',
        enabled
          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500'
          : 'bg-gray-800 border border-gray-700'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{enabled ? '👶' : '👶'}</span>
        <div className="text-left">
          <div className={cn(
            'font-semibold',
            enabled ? 'text-yellow-400' : 'text-white'
          )}>
            Around Kids Mode
          </div>
          <div className="text-xs text-gray-400">
            {enabled ? '2x points active!' : 'Tap to enable 2x points'}
          </div>
        </div>
      </div>
      <div className={cn(
        'px-3 py-1 rounded-full text-sm font-bold',
        enabled
          ? 'bg-yellow-500 text-yellow-900'
          : 'bg-gray-700 text-gray-400'
      )}>
        {enabled ? '2X' : 'OFF'}
      </div>
    </motion.button>
  );
}
