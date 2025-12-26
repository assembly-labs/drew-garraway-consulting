import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface FadeInUpProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  easing?: string | number[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FadeInUp
 *
 * Element fades in while translating upward.
 * Great for revealing content as users scroll or for staggered list entrances.
 */
export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  duration = 0.5,
  delay = 0,
  distance = 20,
  easing = [0.4, 0, 0.2, 1],
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : distance,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

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

export default FadeInUp;

export const fadeInUpCode = `import { motion } from 'framer-motion';

const FadeInUp = ({ children, duration = 0.5, distance = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
);`;

export const fadeInUpCssCode = `.fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;
