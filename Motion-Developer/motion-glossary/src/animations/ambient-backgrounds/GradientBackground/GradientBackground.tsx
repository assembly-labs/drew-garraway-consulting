import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './GradientBackground.module.css';

export interface GradientBackgroundProps {
  colors?: string[];
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * GradientBackground
 *
 * Animated gradient background with smooth color transitions.
 */
export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = ['#7c3aed', '#3b82f6', '#06b6d4', '#8b5cf6'],
  duration = 10,
  className,
  style,
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Ensure colors is always an array (Storybook controls can sometimes pass objects)
  const safeColors = Array.isArray(colors) ? colors : ['#7c3aed', '#3b82f6', '#06b6d4', '#8b5cf6'];

  const gradientStops = safeColors.map((color, i) => {
    const position = (i / (safeColors.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');

  return (
    <div className={`${styles.container} ${className || ''}`} style={style}>
      <motion.div
        className={styles.gradient}
        style={{
          background: `linear-gradient(135deg, ${gradientStops})`,
          backgroundSize: '400% 400%',
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {children && <div className={styles.content}>{children}</div>}
    </div>
  );
};

export default GradientBackground;

export const gradientBackgroundCode = `import { motion } from 'framer-motion';

const GradientBackground = ({ colors, duration = 10, children }) => {
  const gradientStops = colors.map((color, i) =>
    \`\${color} \${(i / (colors.length - 1)) * 100}%\`
  ).join(', ');

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: \`linear-gradient(135deg, \${gradientStops})\`,
          backgroundSize: '400% 400%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};`;

export const gradientBackgroundCssCode = `.gradient-bg {
  background: linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4, #8b5cf6);
  background-size: 400% 400%;
  animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}`;
