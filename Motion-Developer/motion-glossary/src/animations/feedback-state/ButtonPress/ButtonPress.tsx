import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './ButtonPress.module.css';

export interface ButtonPressProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ButtonPress
 *
 * Scales down slightly on click for tactile feedback.
 * The most common button interaction pattern.
 */
export const ButtonPress: React.FC<ButtonPressProps> = ({
  children,
  scale = 0.95,
  duration = 0.1,
  onClick,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      className={`${styles.button} ${className || ''}`}
      style={style}
      whileTap={prefersReducedMotion ? {} : { scale }}
      transition={{ duration }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default ButtonPress;

export const buttonPressCode = `import { motion } from 'framer-motion';

const ButtonPress = ({ children, scale = 0.95, onClick }) => (
  <motion.button
    whileTap={{ scale }}
    transition={{ duration: 0.1 }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);`;

export const buttonPressCssCode = `.button-press {
  transition: transform 0.1s ease;
}

.button-press:active {
  transform: scale(0.95);
}`;
