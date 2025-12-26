import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './Typewriter.module.css';

export interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Typewriter
 *
 * Types out text character by character with optional blinking cursor.
 */
export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  className,
  style,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    const startTimeout = setTimeout(() => {
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay, prefersReducedMotion]);

  return (
    <span className={`${styles.typewriter} ${className || ''}`} style={style}>
      {displayedText}
      {cursor && (
        <motion.span
          className={styles.cursor}
          animate={{ opacity: isTyping ? 1 : [1, 0, 1] }}
          transition={{
            duration: isTyping ? 0 : 1,
            repeat: isTyping ? 0 : Infinity,
          }}
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
};

export default Typewriter;

export const typewriterCode = `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Typewriter = ({ text, speed = 50, cursor = true }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {cursor && (
        <motion.span
          animate={{ opacity: isTyping ? 1 : [1, 0, 1] }}
          transition={{ duration: isTyping ? 0 : 1, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};`;

export const typewriterCssCode = `.typewriter {
  display: inline;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* For pure CSS typewriter, use steps() with width animation */
.typewriter-css {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 2s steps(20, end);
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}`;
