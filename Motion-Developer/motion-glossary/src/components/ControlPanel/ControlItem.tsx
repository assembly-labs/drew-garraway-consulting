import React, { useState } from 'react';
import { ControlItemProps } from '../../registry/types';
import styles from './ControlPanel.module.css';

/**
 * ControlItem - A single control with inline help text
 *
 * Renders different input types (range, select, boolean, etc.)
 * with descriptions and expandable help sections.
 */
export const ControlItem: React.FC<ControlItemProps> = ({
  control,
  value,
  onChange,
  expanded: initialExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const { meta, options, type } = control;

  // Format value for display
  const formatValue = (val: any): string => {
    if (typeof val === 'number') {
      const unit = options?.unit || '';
      return `${val}${unit}`;
    }
    if (typeof val === 'boolean') {
      return val ? 'On' : 'Off';
    }
    if (typeof val === 'string') {
      return val;
    }
    return String(val);
  };

  // Check if we have expandable help content
  const hasExpandableHelp = meta.analogy || meta.tip || meta.warning;

  // Render the appropriate input type
  const renderInput = () => {
    switch (type) {
      case 'range':
        return (
          <div className={styles.rangeWrapper}>
            <input
              type="range"
              className={styles.rangeInput}
              min={options?.min ?? 0}
              max={options?.max ?? 100}
              step={options?.step ?? 1}
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value))}
            />
            <div className={styles.rangeMinMax}>
              <span>{options?.min ?? 0}{options?.unit || ''}</span>
              <span>{options?.max ?? 100}{options?.unit || ''}</span>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className={styles.selectWrapper}>
            <select
              className={styles.selectInput}
              value={JSON.stringify(value)}
              onChange={(e) => onChange(JSON.parse(e.target.value))}
            >
              {options?.choices?.map((choice) => (
                <option key={choice.label} value={JSON.stringify(choice.value)}>
                  {choice.label}
                </option>
              ))}
            </select>
            <svg className={styles.selectArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        );

      case 'boolean':
        return (
          <div className={styles.toggleWrapper}>
            <div
              className={`${styles.toggleSwitch} ${value ? styles.active : ''}`}
              onClick={() => onChange(!value)}
              role="switch"
              aria-checked={value}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(!value);
                }
              }}
            >
              <div className={styles.toggleKnob} />
            </div>
            <span className={styles.toggleLabel}>{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        );

      case 'color':
        return (
          <div className={styles.colorWrapper}>
            <input
              type="color"
              className={styles.colorInput}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className={styles.colorHex}>{value}</span>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            className={styles.numberInput}
            value={value}
            min={options?.min}
            max={options?.max}
            step={options?.step}
            onChange={(e) => onChange(parseFloat(e.target.value))}
          />
        );

      case 'text':
        return (
          <input
            type="text"
            className={styles.textInput}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.controlItem}>
      {/* Header: Label + Current Value */}
      <div className={styles.controlHeader}>
        <span className={styles.controlLabel}>{meta.label}</span>
        <span className={styles.controlValue}>{formatValue(value)}</span>
      </div>

      {/* Input Control */}
      {renderInput()}

      {/* Help Section */}
      <div className={styles.helpSection}>
        {/* Always visible description */}
        <p className={styles.description}>{meta.description}</p>

        {/* Expandable help */}
        {hasExpandableHelp && (
          <>
            <button
              className={styles.expandButton}
              onClick={() => setExpanded(!expanded)}
              type="button"
            >
              <span>{expanded ? 'Less info' : 'More info'}</span>
              <svg
                className={`${styles.expandIcon} ${expanded ? styles.expanded : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {expanded && (
              <div className={styles.expandedHelp}>
                {meta.analogy && (
                  <div className={styles.helpItem}>
                    <svg className={`${styles.helpIcon} ${styles.analogy}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className={styles.helpText}>
                      <strong>Think of it like:</strong> {meta.analogy}
                    </span>
                  </div>
                )}

                {meta.tip && (
                  <div className={styles.helpItem}>
                    <svg className={`${styles.helpIcon} ${styles.tip}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                      <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7Z" />
                    </svg>
                    <span className={styles.helpText}>
                      <strong>Tip:</strong> {meta.tip}
                    </span>
                  </div>
                )}

                {meta.warning && (
                  <div className={styles.helpItem}>
                    <svg className={`${styles.helpIcon} ${styles.warning}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className={styles.helpText}>
                      <strong>Warning:</strong> {meta.warning}
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ControlItem;
