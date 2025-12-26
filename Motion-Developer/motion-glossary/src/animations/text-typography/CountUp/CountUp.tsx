import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks';

export interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * CountUp
 *
 * Animates a number counting up from start to end.
 */
export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  className,
  style,
}) => {
  const [value, setValue] = useState(start);
  const prefersReducedMotion = useReducedMotion();
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const [integer, decimal] = fixed.split('.');
    const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimal ? `${formatted}.${decimal}` : formatted;
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(end);
      return;
    }

    const startAnimation = () => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / (duration * 1000), 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * eased;

        setValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [start, end, duration, delay, prefersReducedMotion]);

  return (
    <span className={className} style={style}>
      {prefix}
      {formatNumber(value)}
      {suffix}
    </span>
  );
};

export default CountUp;

export const countUpCode = `import { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, start = 0, duration = 2, prefix = '', suffix = '' }) => {
  const [value, setValue] = useState(start);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, end, duration]);

  return <span>{prefix}{Math.round(value)}{suffix}</span>;
};`;

export const countUpCssCode = `/* CSS-only count up is not possible.
   Use CSS counters for static sequences only.
   JavaScript is required for animated counting. */`;
