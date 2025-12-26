import React from 'react';
import styles from './AnimationBox.module.css';

export interface AnimationBoxProps {
  /** Content to display inside the box */
  children?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'gradient' | 'outline';
  /** Whether to show as a card */
  card?: boolean;
  /** Custom width */
  width?: number | string;
  /** Custom height */
  height?: number | string;
  /** Additional class name */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * AnimationBox
 *
 * A versatile box component used as a target for animation demos.
 * Provides consistent styling across all animation examples.
 */
export const AnimationBox: React.FC<AnimationBoxProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  card = false,
  width,
  height,
  className = '',
  style,
}) => {
  const boxClasses = [
    styles.box,
    styles[`size-${size}`],
    styles[variant],
    card && styles.card,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle: React.CSSProperties = {
    ...style,
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <div className={boxClasses} style={customStyle}>
      {children}
    </div>
  );
};

export default AnimationBox;
