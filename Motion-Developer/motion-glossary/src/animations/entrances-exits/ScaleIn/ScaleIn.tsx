import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import { springs } from '../../../utils/springs';

export interface ScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  spring?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  duration = 0.4,
  delay = 0,
  initialScale = 0,
  spring = false,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const transition = spring
    ? { ...springs.bouncy, delay: prefersReducedMotion ? 0 : delay }
    : {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.34, 1.56, 0.64, 1],
      };

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ scale: prefersReducedMotion ? 1 : initialScale, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;

export const scaleInCode = `import { motion } from 'framer-motion';

const ScaleIn = ({ children, duration = 0.4 }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      duration,
      ease: [0.34, 1.56, 0.64, 1] // overshoot easing
    }}
  >
    {children}
  </motion.div>
);`;

export const scaleInCssCode = `.scale-in {
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}`;
