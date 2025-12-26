import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './LoadingDots.module.css';

export interface LoadingDotsProps {
  size?: number;
  color?: string;
  gap?: number;
  className?: string;
}

/**
 * LoadingDots
 *
 * Three bouncing dots, like a typing indicator.
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 8,
  color = '#8b5cf6',
  gap = 4,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: prefersReducedMotion ? 0 : [-4, 4, -4],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={`${styles.container} ${className || ''}`} style={{ gap }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={styles.dot}
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            opacity: prefersReducedMotion ? 0.5 : 1,
          }}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingDots;

export const loadingDotsCode = `import { motion } from 'framer-motion';

const LoadingDots = ({ size = 8, color = '#8b5cf6' }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
        }}
        animate={{ y: [-4, 4, -4] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.15,
        }}
      />
    ))}
  </div>
);`;

export const loadingDotsCssCode = `.loading-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8b5cf6;
  animation: bounce 0.6s ease-in-out infinite;
}

.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.3s; }

@keyframes bounce {
  0%, 100% { transform: translateY(-4px); }
  50% { transform: translateY(4px); }
}`;
