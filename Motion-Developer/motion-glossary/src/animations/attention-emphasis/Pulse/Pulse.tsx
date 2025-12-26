import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface PulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  repeat?: number | 'infinity';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Pulse
 *
 * Rhythmic scale animation to draw attention.
 */
export const Pulse: React.FC<PulseProps> = ({
  children,
  scale = 1.05,
  duration = 1,
  repeat = 'infinity',
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      animate={
        prefersReducedMotion
          ? {}
          : {
              scale: [1, scale, 1],
            }
      }
      transition={{
        duration,
        repeat: repeat === 'infinity' ? Infinity : repeat,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default Pulse;

export const pulseCode = `import { motion } from 'framer-motion';

const Pulse = ({ children, scale = 1.05, duration = 1 }) => (
  <motion.div
    animate={{ scale: [1, scale, 1] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);`;

export const pulseCssCode = `.pulse {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}`;
