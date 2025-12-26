import React from 'react';
import { ControlPanelProps } from '../../registry/types';
import { ControlItem } from './ControlItem';
import styles from './ControlPanel.module.css';

/**
 * ControlPanel - Container for all animation controls
 *
 * Renders a list of ControlItem components, each with inline help.
 * Users can adjust values and see descriptions for each control.
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  controls,
  values,
  onChange,
  expandedHelp = false,
}) => {
  return (
    <div className={styles.panel}>
      {/* Panel Header */}
      <div className={styles.panelHeader}>
        <svg className={styles.panelIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <span className={styles.panelTitle}>Controls</span>
      </div>

      {/* Control Items */}
      {controls.map((control) => (
        <ControlItem
          key={control.prop}
          control={control}
          value={values[control.prop] ?? control.defaultValue}
          onChange={(newValue) => onChange(control.prop, newValue)}
          expanded={expandedHelp}
        />
      ))}
    </div>
  );
};

export default ControlPanel;
