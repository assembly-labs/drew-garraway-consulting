import React, { useState, useMemo, useCallback } from 'react';
import { EditingBoothProps } from '../../registry/types';
import { ControlPanel } from '../ControlPanel';
import { LiveCodePanel } from '../LiveCodePanel';
import { PreviewStage } from '../PreviewStage';
import { UsageNotes } from '../UsageNotes';
import { AnimationBox } from '../AnimationBox';
import styles from './EditingBooth.module.css';

/**
 * EditingBooth - The unified animation editing experience
 *
 * Combines:
 * - Large preview area with replay
 * - Control panel with inline help
 * - Live code generation
 * - Usage guidance
 */
export const EditingBooth: React.FC<EditingBoothProps> = ({
  animation,
  initialValues = {},
  onPropsChange,
}) => {
  // Initialize values from defaults and any overrides
  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    animation.controls.forEach((control) => {
      defaults[control.prop] = control.defaultValue;
    });
    return defaults;
  }, [animation.controls]);

  const [values, setValues] = useState<Record<string, any>>({
    ...defaultValues,
    ...initialValues,
  });

  // Key for remounting the preview to replay animation
  const [previewKey, setPreviewKey] = useState(0);

  // Handle control value changes
  const handleChange = useCallback(
    (prop: string, value: any) => {
      setValues((prev) => {
        const updated = { ...prev, [prop]: value };
        onPropsChange?.(updated);
        return updated;
      });
    },
    [onPropsChange]
  );

  // Handle replay
  const handleReplay = useCallback(() => {
    setPreviewKey((prev) => prev + 1);
  }, []);

  // Get the animation component
  const AnimationComponent = animation.component;

  return (
    <div className={styles.booth}>
      {/* Header */}
      <header className={styles.boothHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.animationName}>{animation.name}</h1>
          <p className={styles.animationDescription}>{animation.description}</p>
          {animation.keywords.length > 0 && (
            <div className={styles.keywords}>
              {animation.keywords.map((keyword) => (
                <span key={keyword} className={styles.keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className={styles.categoryBadge}>
          <svg className={styles.categoryIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          {animation.category}
        </span>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Preview Stage - Full Width */}
        <section className={styles.previewSection}>
          <PreviewStage
            title={animation.name}
            background={animation.preview?.background || 'dark'}
            minHeight={animation.preview?.minHeight || 300}
            onReplay={handleReplay}
          >
            <div key={previewKey}>
              <AnimationComponent {...values}>
                {animation.preview?.demoContent || (
                  <AnimationBox variant="primary" size="lg">
                    {animation.name}
                  </AnimationBox>
                )}
              </AnimationComponent>
            </div>
          </PreviewStage>
        </section>

        {/* Controls and Code - Side by Side */}
        <section className={styles.controlsCodeSection}>
          <ControlPanel
            controls={animation.controls}
            values={values}
            onChange={handleChange}
          />

          <LiveCodePanel
            templates={animation.codeTemplates}
            currentProps={values}
            defaultValues={defaultValues}
            highlightChanges
          />
        </section>

        {/* Usage Notes */}
        {animation.usage && (
          <section className={styles.usageSection}>
            <UsageNotes
              whenToUse={animation.usage.whenToUse}
              whenNotToUse={animation.usage.whenNotToUse}
              tips={animation.usage.tips}
              accessibility={animation.usage.accessibility}
              performance={animation.usage.performance}
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default EditingBooth;
