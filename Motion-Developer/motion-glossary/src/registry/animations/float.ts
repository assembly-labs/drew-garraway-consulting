import { Float } from '../../animations/attention-emphasis/Float';
import { AnimationRegistryEntry } from '../types';

export const floatEntry: AnimationRegistryEntry = {
  id: 'float',
  name: 'Float',
  category: 'Attention & Emphasis',
  description: 'A gentle, dreamy floating motion that makes elements feel weightless. Perfect for ambient backgrounds and decorative elements.',
  keywords: ['float', 'hover', 'drift', 'gentle', 'ambient', 'dreamy', 'weightless', 'calm'],
  component: Float,
  controls: [
    {
      prop: 'distance',
      type: 'range',
      defaultValue: 10,
      options: { min: 3, max: 30, step: 1, unit: 'px' },
      meta: {
        label: 'Distance',
        description: 'How far the element floats up and down.',
        analogy: 'Like a leaf floating on water - 5px is barely perceptible, 20px is a gentle bob.',
        tip: '8-12px is ideal for most ambient effects.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 3,
      options: { min: 1, max: 8, step: 0.5, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Time for one complete float cycle.',
        analogy: 'Slower = more dreamlike and relaxing. Faster = more noticeable movement.',
        tip: '3-5s feels natural and calming. Below 2s can feel restless.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const Float = ({ children }) => (
  <motion.div
    animate={{ y: [0, -${props.distance}, 0] }}
    transition={{
      duration: ${props.duration},
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.float {
  animation: float ${props.duration}s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${props.distance}px); }
}`,
    },
  ],
  usage: {
    whenToUse: [
      'Decorative background elements',
      'Hero section illustrations',
      'Empty state graphics',
      'Ambient visual interest',
    ],
    whenNotToUse: [
      'Interactive buttons or links',
      'Text content',
      'Multiple floating elements in close proximity',
      'High-focus task interfaces',
    ],
    tips: [
      'Layer multiple elements with different durations for depth',
      'Combine with opacity for a more ethereal effect',
      'Use on isolated decorative elements, not groups',
    ],
    accessibility: [
      'Respects prefers-reduced-motion',
      'Non-essential motion - safe for most users',
    ],
  },
  preview: { background: 'gradient' },
};
