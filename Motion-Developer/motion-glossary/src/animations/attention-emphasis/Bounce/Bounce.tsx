import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface BounceProps {
  children: React.ReactNode;
  height?: number;
  duration?: number;
  repeat?: number | 'infinity';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Bounce
 *
 * Vertical bouncing motion.
 */
export const Bounce: React.FC<BounceProps> = ({
  children,
  height = 15,
  duration = 0.6,
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
              y: [0, -height, 0],
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

export default Bounce;

export const bounceCode = `import { motion } from 'framer-motion';

const Bounce = ({ children, height = 15 }) => (
  <motion.div
    animate={{ y: [0, -height, 0] }}
    transition={{
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);`;

export const bounceCssCode = `.bounce {
  animation: bounce 0.6s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}`;
