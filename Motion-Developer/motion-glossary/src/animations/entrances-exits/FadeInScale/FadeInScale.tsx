import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface FadeInScaleProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  easing?: string | number[];
  className?: string;
  style?: React.CSSProperties;
}

export const FadeInScale: React.FC<FadeInScaleProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  initialScale = 0.8,
  easing = [0.4, 0, 0.2, 1],
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: easing,
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInScale;

export const fadeInScaleCode = `import { motion } from 'framer-motion';

const FadeInScale = ({ children, duration = 0.5, initialScale = 0.8 }) => (
  <motion.div
    initial={{ opacity: 0, scale: initialScale }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);`;

export const fadeInScaleCssCode = `.fade-in-scale {
  animation: fadeInScale 0.5s ease-out forwards;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}`;
