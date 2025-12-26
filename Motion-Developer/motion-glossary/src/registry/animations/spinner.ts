import { Spinner } from '../../animations/feedback-state/Spinner';
import { AnimationRegistryEntry } from '../types';

export const spinnerEntry: AnimationRegistryEntry = {
  id: 'spinner',
  name: 'Spinner',
  category: 'Feedback & State',
  description: 'A classic circular loading indicator. Clean, professional, and universally understood as "loading in progress".',
  keywords: ['spinner', 'loading', 'progress', 'wait', 'circular', 'indicator', 'async'],
  component: Spinner,
  controls: [
    {
      prop: 'size',
      type: 'range',
      defaultValue: 40,
      options: { min: 16, max: 80, step: 4, unit: 'px' },
      meta: {
        label: 'Size',
        description: 'Diameter of the spinner.',
        tip: '20-24px for inline, 40px for standard, 60px+ for full-page loaders.',
      },
    },
    {
      prop: 'color',
      type: 'color',
      defaultValue: '#8b5cf6',
      meta: {
        label: 'Color',
        description: 'Color of the spinner arc.',
        tip: 'Match your brand primary color.',
      },
    },
    {
      prop: 'strokeWidth',
      type: 'range',
      defaultValue: 3,
      options: { min: 1, max: 6, step: 0.5, unit: 'px' },
      meta: {
        label: 'Stroke Width',
        description: 'Thickness of the spinner line.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 1,
      options: { min: 0.5, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Time for one complete rotation.',
        tip: '0.8-1.2s is standard. Faster feels urgent.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const Spinner = () => (
  <motion.svg
    width={${props.size}}
    height={${props.size}}
    viewBox="0 0 50 50"
    animate={{ rotate: 360 }}
    transition={{ duration: ${props.duration}, repeat: Infinity, ease: 'linear' }}
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="${props.color}"
      strokeWidth="${props.strokeWidth}"
      strokeDasharray="80 200"
      strokeLinecap="round"
    />
  </motion.svg>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.spinner {
  width: ${props.size}px;
  height: ${props.size}px;
  border: ${props.strokeWidth}px solid transparent;
  border-top-color: ${props.color};
  border-radius: 50%;
  animation: spin ${props.duration}s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Button loading states', 'Data fetching', 'Form submissions', 'Page transitions'],
    whenNotToUse: ['When progress is measurable (use progress bar)', 'Very quick operations (<200ms)'],
    tips: ['Add aria-label="Loading" for accessibility', 'Consider skeleton screens for content loading'],
  },
  preview: { background: 'dark' },
};
