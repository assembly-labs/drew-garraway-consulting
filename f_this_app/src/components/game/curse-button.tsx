'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface CurseButtonProps {
  onClick: () => void;
  disabled?: boolean;
  multiplierActive?: boolean;
  ceaseFireActive?: boolean;
}

export function CurseButton({
  onClick,
  disabled = false,
  multiplierActive = false,
  ceaseFireActive = false,
}: CurseButtonProps) {
  return (
    <div className="relative">
      {/* Pulsing background effect */}
      {!disabled && !ceaseFireActive && (
        <>
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full',
              multiplierActive
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            )}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full',
              multiplierActive
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            )}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Main button */}
      <motion.button
        onClick={onClick}
        disabled={disabled || ceaseFireActive}
        whileHover={!disabled && !ceaseFireActive ? { scale: 1.05 } : {}}
        whileTap={!disabled && !ceaseFireActive ? { scale: 0.95 } : {}}
        className={cn(
          'relative w-48 h-48 rounded-full',
          'flex flex-col items-center justify-center',
          'font-bold text-white',
          'shadow-2xl',
          'transition-all duration-300',
          'focus:outline-none focus:ring-4 focus:ring-red-500/50',
          ceaseFireActive
            ? 'bg-gradient-to-br from-gray-600 to-gray-700 cursor-not-allowed'
            : disabled
            ? 'bg-gradient-to-br from-gray-600 to-gray-700 cursor-not-allowed opacity-50'
            : multiplierActive
            ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 cursor-pointer'
            : 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 cursor-pointer'
        )}
        style={{
          boxShadow: ceaseFireActive
            ? '0 0 40px rgba(100, 100, 100, 0.3)'
            : disabled
            ? 'none'
            : multiplierActive
            ? '0 0 60px rgba(245, 158, 11, 0.5), inset 0 -5px 20px rgba(0,0,0,0.2)'
            : '0 0 60px rgba(239, 68, 68, 0.5), inset 0 -5px 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Inner highlight */}
        <div className={cn(
          'absolute inset-2 rounded-full opacity-30',
          'bg-gradient-to-b from-white to-transparent'
        )} />

        {/* Content */}
        <div className="relative z-10 text-center">
          {ceaseFireActive ? (
            <>
              <span className="text-3xl mb-1 block">🕊️</span>
              <span className="text-lg">CEASE</span>
              <span className="text-2xl font-black block">FIRE</span>
            </>
          ) : (
            <>
              <span className="text-4xl mb-1 block">🤬</span>
              <span className="text-3xl font-black tracking-wider">CURSE!</span>
              {multiplierActive && (
                <span className="text-sm mt-1 block text-yellow-200">2X ACTIVE</span>
              )}
            </>
          )}
        </div>
      </motion.button>

      {/* Multiplier badge */}
      {multiplierActive && !ceaseFireActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-yellow-400 text-yellow-900 font-black text-lg flex items-center justify-center shadow-lg"
        >
          2X
        </motion.div>
      )}
    </div>
  );
}
