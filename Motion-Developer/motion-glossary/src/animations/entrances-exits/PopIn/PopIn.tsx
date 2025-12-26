import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import { springs } from '../../../utils/springs';

export interface PopInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PopIn
 *
 * Playful scale animation with bounce overshoot.
 * Like a bubble popping into existence.
 */
export const PopIn: React.FC<PopInProps> = ({
  children,
  delay = 0,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ scale: prefersReducedMotion ? 1 : 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        ...springs.bouncy,
        delay: prefersReducedMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default PopIn;

export const popInCode = `import { motion } from 'framer-motion';

const PopIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      type: 'spring',
      stiffness: 300,
      damping: 10,
      delay,
    }}
  >
    {children}
  </motion.div>
);`;

export const popInCssCode = `.pop-in {
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}`;
