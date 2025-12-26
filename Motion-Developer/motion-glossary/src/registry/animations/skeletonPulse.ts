import { SkeletonPulse } from '../../animations/feedback-state/SkeletonPulse';
import { AnimationRegistryEntry } from '../types';

export const skeletonPulseEntry: AnimationRegistryEntry = {
  id: 'skeleton-pulse',
  name: 'Skeleton Pulse',
  category: 'Feedback & State',
  description: 'A pulsing placeholder for loading content. Shows users where content will appear, reducing perceived loading time.',
  keywords: ['skeleton', 'pulse', 'placeholder', 'loading', 'content', 'shimmer', 'ghost'],
  component: SkeletonPulse,
  controls: [
    {
      prop: 'width',
      type: 'text',
      defaultValue: '100%',
      meta: {
        label: 'Width',
        description: 'Width of the skeleton (px, %, or auto).',
        tip: 'Match the expected content width.',
      },
    },
    {
      prop: 'height',
      type: 'range',
      defaultValue: 20,
      options: { min: 8, max: 200, step: 4, unit: 'px' },
      meta: {
        label: 'Height',
        description: 'Height of the skeleton.',
        tip: '16-20px for text lines, larger for images/cards.',
      },
    },
    {
      prop: 'borderRadius',
      type: 'range',
      defaultValue: 4,
      options: { min: 0, max: 20, step: 2, unit: 'px' },
      meta: {
        label: 'Border Radius',
        description: 'Corner roundness.',
        tip: 'Match your UI component border radius.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const SkeletonPulse = () => (
  <motion.div
    style={{
      width: '${props.width}',
      height: ${props.height},
      borderRadius: ${props.borderRadius},
      background: '#2a2a2a',
    }}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.skeleton-pulse {
  width: ${props.width};
  height: ${props.height}px;
  border-radius: ${props.borderRadius}px;
  background: #2a2a2a;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}`,
    },
  ],
  usage: {
    whenToUse: ['Content loading states', 'Image placeholders', 'List item loading', 'Card skeletons'],
    whenNotToUse: ['Very short loading times', 'When spinner is more appropriate'],
    tips: ['Create multiple skeletons matching your content layout', 'Better UX than spinners for content'],
  },
  preview: { background: 'dark', minHeight: 200 },
};
