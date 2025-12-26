import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface FadeInLeftProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  easing?: string | number[];
  className?: string;
  style?: React.CSSProperties;
}

export const FadeInLeft: React.FC<FadeInLeftProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  distance = 20,
  easing = [0.4, 0, 0.2, 1],
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -distance }}
      animate={{ opacity: 1, x: 0 }}
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

export default FadeInLeft;

export const fadeInLeftCode = `import { motion } from 'framer-motion';

const FadeInLeft = ({ children, duration = 0.5, distance = 20 }) => (
  <motion.div
    initial={{ opacity: 0, x: -distance }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);`;

export const fadeInLeftCssCode = `.fade-in-left {
  animation: fadeInLeft 0.5s ease-out forwards;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`;
