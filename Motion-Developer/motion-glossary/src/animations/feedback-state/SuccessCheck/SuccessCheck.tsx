import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';

export interface SuccessCheckProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  className?: string;
}

/**
 * SuccessCheck
 *
 * Animated checkmark that draws itself.
 * Perfect for success confirmations.
 */
export const SuccessCheck: React.FC<SuccessCheckProps> = ({
  size = 60,
  color = '#22c55e',
  strokeWidth = 3,
  duration = 0.5,
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: prefersReducedMotion ? 0 : duration * 0.6, ease: 'easeOut' },
        opacity: { duration: 0.1 },
      },
    },
  };

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: prefersReducedMotion ? 0 : duration * 0.4, ease: 'easeOut' },
        opacity: { duration: 0.1 },
        delay: prefersReducedMotion ? 0 : duration * 0.5,
      },
    },
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="30"
        cy="30"
        r="27"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial="hidden"
        animate="visible"
        variants={circleVariants}
        style={{ opacity: prefersReducedMotion ? 1 : undefined }}
      />
      <motion.path
        d="M20 30L27 37L40 24"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="hidden"
        animate="visible"
        variants={checkVariants}
        style={{ opacity: prefersReducedMotion ? 1 : undefined }}
      />
    </svg>
  );
};

export default SuccessCheck;

export const successCheckCode = `import { motion } from 'framer-motion';

const SuccessCheck = ({ size = 60, color = '#22c55e' }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <motion.circle
      cx="30" cy="30" r="27"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    />
    <motion.path
      d="M20 30L27 37L40 24"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.25, ease: 'easeOut' }}
    />
  </svg>
);`;

export const successCheckCssCode = `.success-circle {
  stroke-dasharray: 170;
  stroke-dashoffset: 170;
  animation: drawCircle 0.3s ease-out forwards;
}

.success-check {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: drawCheck 0.2s ease-out 0.25s forwards;
}

@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}`;
