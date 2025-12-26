import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export interface SlideInProps {
  children: React.ReactNode;
  direction?: SlideDirection;
  duration?: number;
  delay?: number;
  distance?: number;
  fade?: boolean;
  easing?: number[];
  className?: string;
  style?: React.CSSProperties;
}

const getDirectionOffset = (direction: SlideDirection, distance: number) => {
  switch (direction) {
    case 'left':
      return { x: -distance, y: 0 };
    case 'right':
      return { x: distance, y: 0 };
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
  }
};

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  duration = 0.5,
  delay = 0,
  distance = 100,
  fade = true,
  easing = [0.4, 0, 0.2, 1],
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const offset = getDirectionOffset(direction, distance);

  return (
    <motion.div
      className={className}
      style={style}
      initial={{
        x: prefersReducedMotion ? 0 : offset.x,
        y: prefersReducedMotion ? 0 : offset.y,
        opacity: fade ? 0 : 1,
      }}
      animate={{ x: 0, y: 0, opacity: 1 }}
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

export default SlideIn;

export const slideInCode = `import { motion } from 'framer-motion';

type Direction = 'left' | 'right' | 'up' | 'down';

const getOffset = (direction: Direction, distance: number) => {
  const offsets = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
  };
  return offsets[direction];
};

const SlideIn = ({ children, direction = 'left', distance = 100 }) => {
  const offset = getOffset(direction, distance);

  return (
    <motion.div
      initial={{ ...offset, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};`;

export const slideInCssCode = `.slide-in-left {
  animation: slideInLeft 0.5s ease-out forwards;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Similar for right, up, down */`;
