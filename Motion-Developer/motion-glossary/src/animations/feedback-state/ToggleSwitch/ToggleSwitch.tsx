import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks';
import { springs } from '../../../utils/springs';
import styles from './ToggleSwitch.module.css';

export interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  className?: string;
}

const sizes = {
  sm: { width: 36, height: 20, knob: 16 },
  md: { width: 48, height: 26, knob: 22 },
  lg: { width: 60, height: 32, knob: 28 },
};

/**
 * ToggleSwitch
 *
 * iOS-style toggle switch with spring animation.
 */
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  size = 'md',
  activeColor = '#22c55e',
  className,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { width, height, knob } = sizes[size];
  const padding = (height - knob) / 2;

  return (
    <button
      className={`${styles.toggle} ${className || ''}`}
      style={{
        width,
        height,
        backgroundColor: checked ? activeColor : '#404040',
        borderRadius: height / 2,
      }}
      onClick={() => onChange?.(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <motion.span
        className={styles.knob}
        style={{
          width: knob,
          height: knob,
          borderRadius: knob / 2,
        }}
        animate={{
          x: checked ? width - knob - padding : padding,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : springs.snappy}
      />
    </button>
  );
};

export default ToggleSwitch;

export const toggleSwitchCode = `import { motion } from 'framer-motion';

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    style={{
      width: 48,
      height: 26,
      backgroundColor: checked ? '#22c55e' : '#404040',
      borderRadius: 13,
      padding: 2,
      border: 'none',
      cursor: 'pointer',
    }}
    onClick={() => onChange(!checked)}
    role="switch"
    aria-checked={checked}
  >
    <motion.span
      style={{
        display: 'block',
        width: 22,
        height: 22,
        backgroundColor: 'white',
        borderRadius: 11,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
      animate={{ x: checked ? 22 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    />
  </button>
);`;

export const toggleSwitchCssCode = `.toggle {
  width: 48px;
  height: 26px;
  background: #404040;
  border-radius: 13px;
  padding: 2px;
  transition: background 0.2s;
}

.toggle[aria-checked="true"] {
  background: #22c55e;
}

.knob {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 11px;
  transition: transform 0.2s ease;
}

.toggle[aria-checked="true"] .knob {
  transform: translateX(22px);
}`;
