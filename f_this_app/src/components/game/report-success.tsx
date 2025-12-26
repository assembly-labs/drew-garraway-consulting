'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DIRTY_MOUTH, getRandomQuip } from '@/lib/constants/characters';
import { cn } from '@/lib/utils/cn';

// Pre-generated confetti positions (generated at module load, not during render)
const CONFETTI_POSITIONS = [...Array(20)].map(() => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  rotate: Math.random() * 360,
}));

interface ReportSuccessProps {
  offenderName: string;
  offenderAvatar?: string | null;
  pointsAwarded: number;
  multiplierActive: boolean;
  onDismiss: () => void;
}

export function ReportSuccess({
  offenderName,
  offenderAvatar,
  pointsAwarded,
  multiplierActive,
  onDismiss,
}: ReportSuccessProps) {
  // Initialize quip with random value (only called once on mount)
  const [quip] = useState(() => getRandomQuip(DIRTY_MOUTH.reportQuips));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    >
      {/* Confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CONFETTI_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute w-3 h-3 rounded-full',
              i % 3 === 0 && 'bg-red-500',
              i % 3 === 1 && 'bg-yellow-500',
              i % 3 === 2 && 'bg-orange-500'
            )}
            initial={{
              x: '50vw',
              y: '50vh',
              scale: 0,
            }}
            animate={{
              x: `${pos.x}vw`,
              y: `${pos.y}vh`,
              scale: [0, 1, 1, 0],
              rotate: pos.rotate,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              delay: i * 0.02,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="relative z-10 text-center px-8"
      >
        {/* Dirty Mouth Character */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-8xl mb-4"
        >
          😈
        </motion.div>

        {/* Offender Avatar with shame effect */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="relative inline-block mb-4"
        >
          <Avatar
            src={offenderAvatar}
            name={offenderName}
            size="xl"
            className="ring-4 ring-red-500"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
          >
            +{pointsAwarded}
          </motion.div>
        </motion.div>

        {/* Name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          {offenderName}
        </motion.h2>

        {/* Points */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className={cn(
            'text-4xl font-black mb-4',
            multiplierActive ? 'text-yellow-400' : 'text-red-400'
          )}
        >
          +{pointsAwarded} {pointsAwarded === 1 ? 'POINT' : 'POINTS'}
          {multiplierActive && (
            <span className="text-lg ml-2 text-yellow-500">(2X!)</span>
          )}
        </motion.div>

        {/* Dirty Mouth quip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-300 italic max-w-xs mx-auto mb-8"
        >
          &ldquo;{quip}&rdquo;
        </motion.p>

        {/* Dismiss button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={onDismiss} size="lg">
            Got it
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
