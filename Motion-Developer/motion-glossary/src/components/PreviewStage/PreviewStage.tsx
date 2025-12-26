import React, { useState, useCallback } from 'react';
import { PreviewStageProps } from '../../registry/types';
import styles from './PreviewStage.module.css';

type BackgroundType = 'dark' | 'light' | 'gradient' | 'dots' | 'grid';

const backgroundClasses: Record<BackgroundType, string> = {
  dark: styles.bgDark,
  light: styles.bgLight,
  gradient: styles.bgGradient,
  dots: styles.bgDots,
  grid: styles.bgGrid,
};

const backgroundLabels: Record<BackgroundType, string> = {
  dark: 'Dark',
  light: 'Light',
  gradient: 'Gradient',
  dots: 'Dots',
  grid: 'Grid',
};

/**
 * PreviewStage - Large preview area for animations
 *
 * Features:
 * - Large preview area with configurable backgrounds
 * - Replay button to restart animation
 * - Background selector dropdown
 * - Reduced motion indicator
 */
export const PreviewStage: React.FC<PreviewStageProps> = ({
  children,
  title = 'Preview',
  background: initialBackground = 'dark',
  minHeight = 300,
  onReplay,
}) => {
  const [key, setKey] = useState(0);
  const [background, setBackground] = useState<BackgroundType>(initialBackground);
  const [showBgDropdown, setShowBgDropdown] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Handle replay - remount children to restart animation
  const handleReplay = useCallback(() => {
    setKey((prev) => prev + 1);
    onReplay?.();
  }, [onReplay]);

  return (
    <div className={styles.stage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <svg className={styles.headerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.controls}>
          {/* Reduced motion indicator */}
          {prefersReducedMotion && (
            <div className={styles.reducedMotionBadge}>
              <svg className={styles.reducedMotionIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span>Reduced motion</span>
            </div>
          )}

          {/* Background selector */}
          <div className={styles.backgroundSelector}>
            <button
              className={styles.backgroundButton}
              onClick={() => setShowBgDropdown(!showBgDropdown)}
              type="button"
            >
              <svg className={styles.bgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>{backgroundLabels[background]}</span>
              <svg className={styles.bgIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showBgDropdown && (
              <div className={styles.backgroundDropdown}>
                {(Object.keys(backgroundClasses) as BackgroundType[]).map((bg) => (
                  <button
                    key={bg}
                    className={`${styles.backgroundOption} ${background === bg ? styles.active : ''}`}
                    onClick={() => {
                      setBackground(bg);
                      setShowBgDropdown(false);
                    }}
                    type="button"
                  >
                    <span
                      className={`${styles.bgSwatch} ${
                        bg === 'dark' ? styles.bgSwatchDark :
                        bg === 'light' ? styles.bgSwatchLight :
                        bg === 'gradient' ? styles.bgSwatchGradient :
                        bg === 'dots' ? styles.bgSwatchDots :
                        styles.bgSwatchGrid
                      }`}
                    />
                    <span>{backgroundLabels[bg]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Replay button */}
          <button className={styles.replayButton} onClick={handleReplay} type="button">
            <svg className={styles.replayIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Preview content */}
      <div
        className={`${styles.content} ${backgroundClasses[background]}`}
        style={{ minHeight }}
        key={key}
      >
        {children}
      </div>
    </div>
  );
};

export default PreviewStage;
