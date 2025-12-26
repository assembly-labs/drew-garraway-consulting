import React from 'react';
import styles from './UsageNotes.module.css';

export interface UsageNotesProps {
  /** When to use this animation */
  whenToUse?: string[];
  /** When NOT to use this animation */
  whenNotToUse?: string[];
  /** Tips for implementation */
  tips?: string[];
  /** Accessibility considerations */
  accessibility?: string[];
  /** Performance notes */
  performance?: string[];
  /** Additional class name */
  className?: string;
}

/**
 * UsageNotes
 *
 * Displays when/why/how to use an animation.
 * Provides guidance for proper implementation.
 */
export const UsageNotes: React.FC<UsageNotesProps> = ({
  whenToUse,
  whenNotToUse,
  tips,
  accessibility,
  performance,
  className = '',
}) => {
  const hasContent =
    whenToUse?.length ||
    whenNotToUse?.length ||
    tips?.length ||
    accessibility?.length ||
    performance?.length;

  if (!hasContent) return null;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {whenToUse && whenToUse.length > 0 && (
        <Section
          title="When to use"
          items={whenToUse}
          icon={<CheckIcon />}
          variant="success"
        />
      )}

      {whenNotToUse && whenNotToUse.length > 0 && (
        <Section
          title="When NOT to use"
          items={whenNotToUse}
          icon={<XIcon />}
          variant="error"
        />
      )}

      {tips && tips.length > 0 && (
        <Section
          title="Tips"
          items={tips}
          icon={<LightbulbIcon />}
          variant="info"
        />
      )}

      {accessibility && accessibility.length > 0 && (
        <Section
          title="Accessibility"
          items={accessibility}
          icon={<AccessibilityIcon />}
          variant="warning"
        />
      )}

      {performance && performance.length > 0 && (
        <Section
          title="Performance"
          items={performance}
          icon={<ZapIcon />}
          variant="neutral"
        />
      )}
    </div>
  );
};

interface SectionProps {
  title: string;
  items: string[];
  icon: React.ReactNode;
  variant: 'success' | 'error' | 'info' | 'warning' | 'neutral';
}

const Section: React.FC<SectionProps> = ({ title, items, icon, variant }) => (
  <div className={`${styles.section} ${styles[variant]}`}>
    <h4 className={styles.sectionTitle}>
      <span className={styles.icon}>{icon}</span>
      {title}
    </h4>
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index} className={styles.listItem}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// Icons
const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
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
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LightbulbIcon = () => (
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
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const AccessibilityIcon = () => (
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
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6v6" />
    <path d="M6 10l6 2 6-2" />
    <path d="M8 22l4-8 4 8" />
  </svg>
);

const ZapIcon = () => (
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
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default UsageNotes;
