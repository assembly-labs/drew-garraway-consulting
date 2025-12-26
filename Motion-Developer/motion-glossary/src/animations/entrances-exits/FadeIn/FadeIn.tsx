import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface FadeInProps {
  /** Content to animate */
  children: React.ReactNode;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Easing function */
  easing?: string | number[];
  /** Additional class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

const variants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * FadeIn
 *
 * Basic opacity animation from 0 to 1.
 * The simplest and most versatile entrance animation.
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  easing = [0.4, 0, 0.2, 1],
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="visible"
      variants={variants}
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

export default FadeIn;

// Code for display in Storybook
export const fadeInCode = `import { motion } from 'framer-motion';

const FadeIn = ({ children, duration = 0.5, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);`;

export const fadeInCssCode = `.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}`;
