import { SuccessCheck } from '../../animations/feedback-state/SuccessCheck';
import { AnimationRegistryEntry } from '../types';

export const successCheckEntry: AnimationRegistryEntry = {
  id: 'success-check',
  name: 'Success Check',
  category: 'Feedback & State',
  description: 'An animated checkmark that draws itself. Provides satisfying confirmation that an action completed successfully.',
  keywords: ['success', 'check', 'checkmark', 'complete', 'done', 'confirm', 'validation', 'tick'],
  component: SuccessCheck,
  controls: [
    {
      prop: 'size',
      type: 'range',
      defaultValue: 60,
      options: { min: 24, max: 120, step: 4, unit: 'px' },
      meta: {
        label: 'Size',
        description: 'Size of the checkmark circle.',
      },
    },
    {
      prop: 'color',
      type: 'color',
      defaultValue: '#22c55e',
      meta: {
        label: 'Color',
        description: 'Color of the checkmark and circle.',
        tip: 'Green is universally recognized as success.',
      },
    },
    {
      prop: 'strokeWidth',
      type: 'range',
      defaultValue: 3,
      options: { min: 1, max: 6, step: 0.5, unit: 'px' },
      meta: {
        label: 'Stroke Width',
        description: 'Thickness of the lines.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.5,
      options: { min: 0.2, max: 1, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Animation duration.',
        tip: '0.4-0.6s feels satisfying.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const SuccessCheck = () => (
  <svg width={${props.size}} height={${props.size}} viewBox="0 0 50 50">
    <motion.circle
      cx="25"
      cy="25"
      r="20"
      fill="none"
      stroke="${props.color}"
      strokeWidth="${props.strokeWidth}"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: ${props.duration} }}
    />
    <motion.path
      d="M14 27 L22 35 L37 16"
      fill="none"
      stroke="${props.color}"
      strokeWidth="${props.strokeWidth}"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: ${props.duration * 0.6}, delay: ${props.duration * 0.4} }}
    />
  </svg>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.success-check circle,
.success-check path {
  stroke: ${props.color};
  stroke-width: ${props.strokeWidth};
  fill: none;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw ${props.duration}s ease forwards;
}

.success-check path {
  animation-delay: ${props.duration * 0.4}s;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}`,
    },
  ],
  usage: {
    whenToUse: ['Form submission success', 'Task completion', 'Payment confirmation', 'Save confirmation'],
    whenNotToUse: ['Inline validation (too heavy)', 'Frequent actions'],
    tips: ['Pair with a success message', 'Use sparingly for impact'],
  },
  preview: { background: 'dark' },
};
