/**
 * Registry Types for the Editing Booth
 *
 * These types define how animations are registered and configured
 * for the unified editing experience.
 */

import { ReactNode, ComponentType } from 'react';

/**
 * Metadata for a single control - explains what it does to the user
 */
export interface ControlMetadata {
  /** Display label (e.g., "Duration") */
  label: string;

  /** Short description of what this control does */
  description: string;

  /** "Think of it like..." analogy for visual learners */
  analogy?: string;

  /** Quick tip for common use cases */
  tip?: string;

  /** Warning about edge cases or potential issues */
  warning?: string;
}

/**
 * Definition for a single control in the editing booth
 */
export interface ControlDefinition {
  /** Property name on the component (e.g., "duration") */
  prop: string;

  /** Type of control to render */
  type: 'range' | 'select' | 'boolean' | 'color' | 'text' | 'number';

  /** Default value for this control */
  defaultValue: any;

  /** Human-readable metadata */
  meta: ControlMetadata;

  /** Control-specific options */
  options?: {
    /** Minimum value (for range/number) */
    min?: number;
    /** Maximum value (for range/number) */
    max?: number;
    /** Step increment (for range/number) */
    step?: number;
    /** Choices for select controls */
    choices?: Array<{ value: any; label: string }>;
    /** Unit to display (e.g., "s", "px", "%") */
    unit?: string;
  };
}

/**
 * Code template that generates live code from current props
 */
export interface CodeTemplate {
  /** Label for the tab (e.g., "Framer Motion", "CSS") */
  label: string;

  /** Language for syntax highlighting */
  language: 'tsx' | 'css' | 'typescript' | 'javascript';

  /** Function that generates code string from current props */
  generate: (props: Record<string, any>) => string;
}

/**
 * Usage guidance for an animation
 */
export interface UsageGuidance {
  /** When to use this animation */
  whenToUse?: string[];

  /** When NOT to use this animation */
  whenNotToUse?: string[];

  /** Implementation tips */
  tips?: string[];

  /** Accessibility considerations */
  accessibility?: string[];

  /** Performance notes */
  performance?: string[];
}

/**
 * Preview configuration for the animation
 */
export interface PreviewConfig {
  /** Background style for the preview area */
  background?: 'dark' | 'light' | 'gradient' | 'dots' | 'grid';

  /** Custom demo content (defaults to AnimationBox) */
  demoContent?: ReactNode;

  /** Minimum height for preview area */
  minHeight?: number;
}

/**
 * Complete registry entry for an animation
 */
export interface AnimationRegistryEntry {
  /** Unique identifier (e.g., "pulse") */
  id: string;

  /** Display name (e.g., "Pulse") */
  name: string;

  /** Category for grouping (e.g., "Attention & Emphasis") */
  category: string;

  /** Short description for cards/listings */
  description: string;

  /** Keywords for search */
  keywords: string[];

  /** The actual animation component */
  component: ComponentType<any>;

  /** Control definitions with metadata */
  controls: ControlDefinition[];

  /** Code templates for live generation */
  codeTemplates: CodeTemplate[];

  /** Usage guidance */
  usage?: UsageGuidance;

  /** Preview configuration */
  preview?: PreviewConfig;
}

/**
 * Props passed to the EditingBooth component
 */
export interface EditingBoothProps {
  /** The animation registry entry to display */
  animation: AnimationRegistryEntry;

  /** Initial prop values (optional override) */
  initialValues?: Record<string, any>;

  /** Callback when props change */
  onPropsChange?: (props: Record<string, any>) => void;
}

/**
 * Props for the ControlPanel component
 */
export interface ControlPanelProps {
  /** Control definitions from registry */
  controls: ControlDefinition[];

  /** Current values */
  values: Record<string, any>;

  /** Callback when a value changes */
  onChange: (prop: string, value: any) => void;

  /** Whether to show expanded help by default */
  expandedHelp?: boolean;
}

/**
 * Props for a single ControlItem
 */
export interface ControlItemProps {
  /** The control definition */
  control: ControlDefinition;

  /** Current value */
  value: any;

  /** Callback when value changes */
  onChange: (value: any) => void;

  /** Whether help is expanded */
  expanded?: boolean;

  /** Toggle help expansion */
  onToggleExpand?: () => void;
}

/**
 * Props for the LiveCodePanel component
 */
export interface LiveCodePanelProps {
  /** Code templates from registry */
  templates: CodeTemplate[];

  /** Current prop values for generation */
  currentProps: Record<string, any>;

  /** Highlight props that differ from defaults */
  highlightChanges?: boolean;

  /** Default values for comparison */
  defaultValues?: Record<string, any>;
}

/**
 * Props for the PreviewStage component
 */
export interface PreviewStageProps {
  /** Content to preview */
  children: ReactNode;

  /** Animation name for the header */
  title?: string;

  /** Background style */
  background?: 'dark' | 'light' | 'gradient' | 'dots' | 'grid';

  /** Minimum height */
  minHeight?: number;

  /** Callback when replay is triggered */
  onReplay?: () => void;
}
