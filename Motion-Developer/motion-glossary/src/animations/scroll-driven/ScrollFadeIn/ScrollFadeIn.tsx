import React from 'react';
import { motion } from 'framer-motion';
import { useInView, useReducedMotion } from '../../../hooks';

export interface ScrollFadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const getInitialPosition = (direction: string, distance: number) => {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
    default:
      return {};
  }
};

/**
 * ScrollFadeIn
 *
 * Fades in when element enters viewport. Optionally slides from a direction.
 */
export const ScrollFadeIn: React.FC<ScrollFadeInProps> = ({
  children,
  direction = 'up',
  distance = 30,
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className,
  style,
}) => {
  const { ref, inView } = useInView<HTMLDivElement>({
    threshold,
    triggerOnce,
  });
  const prefersReducedMotion = useReducedMotion();

  const initialPosition = prefersReducedMotion ? {} : getInitialPosition(direction, distance);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, ...initialPosition }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...initialPosition }
      }
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollFadeIn;

export const scrollFadeInCode = `import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ScrollFadeIn = ({ children, direction = 'up', distance = 30 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const getOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getOffset() }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};`;

export const scrollFadeInCssCode = `/* Use Intersection Observer API with CSS */
.scroll-fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-fade-in.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* JavaScript to add .in-view class when visible */`;
