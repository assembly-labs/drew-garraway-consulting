import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  className?: string;
}

/**
 * Spinner
 *
 * Classic rotating spinner for loading states.
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color = '#8b5cf6',
  strokeWidth = 3,
  duration = 1,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`${styles.spinner} ${className || ''}`}
      animate={prefersReducedMotion ? {} : { rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
        opacity={prefersReducedMotion ? 0.5 : 1}
      />
    </motion.svg>
  );
};

export default Spinner;

export const spinnerCode = `import { motion } from 'framer-motion';

const Spinner = ({ size = 40, color = '#8b5cf6' }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  >
    <circle
      cx="20"
      cy="20"
      r="18"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="85 28"
    />
  </motion.svg>
);`;

export const spinnerCssCode = `.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
