import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export type ShakeDirection = 'horizontal' | 'vertical' | 'rotate';

export interface ShakeProps {
  children: React.ReactNode;
  direction?: ShakeDirection;
  intensity?: number;
  duration?: number;
  repeat?: number;
  className?: string;
  style?: React.CSSProperties;
}

const getShakeAnimation = (direction: ShakeDirection, intensity: number) => {
  switch (direction) {
    case 'horizontal':
      return { x: [0, -intensity, intensity, -intensity, intensity, 0] };
    case 'vertical':
      return { y: [0, -intensity, intensity, -intensity, intensity, 0] };
    case 'rotate':
      return { rotate: [0, -intensity, intensity, -intensity, intensity, 0] };
  }
};

/**
 * Shake
 *
 * Quick shaking motion to signal error or grab attention.
 */
export const Shake: React.FC<ShakeProps> = ({
  children,
  direction = 'horizontal',
  intensity = 10,
  duration = 0.5,
  repeat = 0,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      animate={prefersReducedMotion ? {} : getShakeAnimation(direction, intensity)}
      transition={{
        duration,
        repeat,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

export default Shake;

export const shakeCode = `import { motion } from 'framer-motion';

const Shake = ({ children, intensity = 10 }) => (
  <motion.div
    animate={{ x: [0, -intensity, intensity, -intensity, intensity, 0] }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);`;

export const shakeCssCode = `.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
}`;
