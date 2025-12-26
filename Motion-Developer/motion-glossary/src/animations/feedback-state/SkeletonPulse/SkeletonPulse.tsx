import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './SkeletonPulse.module.css';

export interface SkeletonPulseProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
}

/**
 * SkeletonPulse
 *
 * Pulsing placeholder for loading content.
 */
export const SkeletonPulse: React.FC<SkeletonPulseProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={`${styles.skeleton} ${className || ''}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      animate={
        prefersReducedMotion
          ? {}
          : {
              opacity: [0.5, 1, 0.5],
            }
      }
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export default SkeletonPulse;

export const skeletonPulseCode = `import { motion } from 'framer-motion';

const SkeletonPulse = ({ width = '100%', height = 20 }) => (
  <motion.div
    style={{
      width,
      height,
      backgroundColor: '#2e2e2e',
      borderRadius: 4,
    }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);`;

export const skeletonPulseCssCode = `.skeleton {
  background: #2e2e2e;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}`;
