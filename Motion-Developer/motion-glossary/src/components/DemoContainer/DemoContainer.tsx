import React, { useState, useCallback } from 'react';
import styles from './DemoContainer.module.css';

export interface DemoContainerProps {
  /** Content to display in the demo area */
  children: React.ReactNode;
  /** Title for the demo */
  title?: string;
  /** Description of what the animation does */
  description?: string;
  /** Whether to show replay button */
  showReplay?: boolean;
  /** Callback when replay is clicked */
  onReplay?: () => void;
  /** Minimum height of the demo area */
  minHeight?: number;
  /** Background variant */
  background?: 'dark' | 'light' | 'gradient' | 'dots' | 'grid';
  /** Whether to center content */
  centered?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * DemoContainer
 *
 * A consistent wrapper for animation demos in Storybook.
 * Provides replay functionality, various backgrounds, and consistent styling.
 */
export const DemoContainer: React.FC<DemoContainerProps> = ({
  children,
  title,
  description,
  showReplay = true,
  onReplay,
  minHeight = 300,
  background = 'dark',
  centered = true,
  className = '',
}) => {
  const [key, setKey] = useState(0);

  const handleReplay = useCallback(() => {
    setKey((prev) => prev + 1);
    onReplay?.();
  }, [onReplay]);

  const containerClasses = [
    styles.container,
    styles[`bg-${background}`],
    centered && styles.centered,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      <div
        className={containerClasses}
        style={{ minHeight }}
        key={key}
      >
        {children}
      </div>

      {showReplay && (
        <div className={styles.controls}>
          <button
            className={styles.replayButton}
            onClick={handleReplay}
            type="button"
            aria-label="Replay animation"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Replay
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoContainer;
