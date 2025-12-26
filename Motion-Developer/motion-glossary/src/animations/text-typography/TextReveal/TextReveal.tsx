import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './TextReveal.module.css';

export type RevealMode = 'characters' | 'words' | 'lines';

export interface TextRevealProps {
  text: string;
  mode?: RevealMode;
  staggerDelay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const splitText = (text: string, mode: RevealMode): string[] => {
  switch (mode) {
    case 'characters':
      return text.split('');
    case 'words':
      return text.split(' ');
    case 'lines':
      return text.split('\n');
    default:
      return [text];
  }
};

/**
 * TextReveal
 *
 * Reveals text by characters, words, or lines with staggered animation.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  mode = 'words',
  staggerDelay = 0.05,
  duration = 0.4,
  className,
  style,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const elements = splitText(text, mode);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.span
      className={`${styles.container} ${className || ''}`}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          className={styles.element}
          variants={itemVariants}
        >
          {element}
          {mode === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TextReveal;

export const textRevealCode = `import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const TextReveal = ({ text }) => {
  const words = text.split(' ');

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={itemVariants}>
          {word}{' '}
        </motion.span>
      ))}
    </motion.span>
  );
};`;

export const textRevealCssCode = `.word {
  display: inline-block;
  opacity: 0;
  animation: revealWord 0.4s ease-out forwards;
}

.word:nth-child(1) { animation-delay: 0s; }
.word:nth-child(2) { animation-delay: 0.05s; }
.word:nth-child(3) { animation-delay: 0.1s; }
/* Continue for more words */

@keyframes revealWord {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;
