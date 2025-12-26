import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './ScrollProgressBar.module.css';

export interface ScrollProgressBarProps {
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
  className?: string;
}

/**
 * ScrollProgressBar
 *
 * Fixed progress bar showing scroll position on the page.
 */
export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  color = '#8b5cf6',
  height = 4,
  position = 'top',
  className,
}) => {
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className={`${styles.progressBar} ${styles[position]} ${className || ''}`}
      style={{
        height,
        backgroundColor: color,
        scaleX: prefersReducedMotion ? scrollYProgress : scaleX,
        transformOrigin: 'left',
      }}
    />
  );
};

export default ScrollProgressBar;

export const scrollProgressBarCode = `import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar = ({ color = '#8b5cf6', height = 4 }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height,
        backgroundColor: color,
        scaleX,
        transformOrigin: 'left',
        zIndex: 1000,
      }}
    />
  );
};`;

export const scrollProgressBarCssCode = `/* Requires JavaScript to update width */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background: #8b5cf6;
  transform-origin: left;
  z-index: 1000;
}

/* Set width via JS: element.style.transform = \`scaleX(\${progress})\` */`;
