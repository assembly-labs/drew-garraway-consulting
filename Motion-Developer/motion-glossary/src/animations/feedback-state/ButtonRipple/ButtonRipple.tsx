import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import styles from './ButtonRipple.module.css';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export interface ButtonRippleProps {
  children: React.ReactNode;
  rippleColor?: string;
  duration?: number;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ButtonRipple
 *
 * Material Design-style ripple effect that emanates from the click point.
 */
export const ButtonRipple: React.FC<ButtonRippleProps> = ({
  children,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  duration = 0.6,
  onClick,
  className,
  style,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!prefersReducedMotion) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { id, x, y }]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, duration * 1000);
      }

      onClick?.();
    },
    [onClick, duration, prefersReducedMotion]
  );

  return (
    <button
      className={`${styles.button} ${className || ''}`}
      style={style}
      onClick={handleClick}
    >
      {children}
      <span className={styles.rippleContainer}>
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className={styles.ripple}
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: rippleColor,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </span>
    </button>
  );
};

export default ButtonRipple;

export const buttonRippleCode = `import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

const ButtonRipple = ({ children, onClick }) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  }, [onClick]);

  return (
    <button onClick={handleClick} style={{ position: 'relative', overflow: 'hidden' }}>
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.4)',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};`;

export const buttonRippleCssCode = `.button {
  position: relative;
  overflow: hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}`;
