import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface FloatProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Float
 *
 * Gentle floating/bobbing motion. Great for ambient elements.
 */
export const Float: React.FC<FloatProps> = ({
  children,
  distance = 10,
  duration = 3,
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
              y: [0, -distance, 0],
            }
      }
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default Float;

export const floatCode = `import { motion } from 'framer-motion';

const Float = ({ children, distance = 10, duration = 3 }) => (
  <motion.div
    animate={{ y: [0, -distance, 0] }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);`;

export const floatCssCode = `.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`;
