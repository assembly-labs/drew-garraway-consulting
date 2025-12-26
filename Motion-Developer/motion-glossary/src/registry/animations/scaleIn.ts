import { ScaleIn } from '../../animations/entrances-exits/ScaleIn';
import { AnimationRegistryEntry } from '../types';

export const scaleInEntry: AnimationRegistryEntry = {
  id: 'scale-in',
  name: 'Scale In',
  category: 'Entrances & Exits',
  description: 'Elements scale from nothing to full size with an optional overshoot. More dramatic than fade-in-scale, perfect for impactful reveals.',
  keywords: ['scale', 'zoom', 'grow', 'appear', 'entrance', 'dramatic', 'impact', 'spring'],
  component: ScaleIn,
  controls: [
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.4,
      options: { min: 0.1, max: 1.5, step: 0.1, unit: 's' },
      meta: { label: 'Duration', description: 'How long the animation takes.' },
    },
    {
      prop: 'delay',
      type: 'range',
      defaultValue: 0,
      options: { min: 0, max: 2, step: 0.1, unit: 's' },
      meta: { label: 'Delay', description: 'Wait before animation starts.' },
    },
    {
      prop: 'initialScale',
      type: 'range',
      defaultValue: 0,
      options: { min: 0, max: 0.9, step: 0.1 },
      meta: {
        label: 'Initial Scale',
        description: 'Starting size (0 = invisible).',
        tip: '0 for dramatic pop, 0.5 for gentler growth.',
      },
    },
    {
      prop: 'spring',
      type: 'boolean',
      defaultValue: false,
      meta: {
        label: 'Spring Physics',
        description: 'Use bouncy spring instead of easing.',
        analogy: 'Spring adds a natural bounce, like a rubber band snapping into place.',
        tip: 'Spring feels more organic but takes longer to settle.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => {
        if (props.spring) {
          return `import { motion } from 'framer-motion';

const ScaleIn = ({ children }) => (
  <motion.div
    initial={{ scale: ${props.initialScale}, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      type: 'spring',
      stiffness: 300,
      damping: 20,
      delay: ${props.delay},
    }}
  >
    {children}
  </motion.div>
);`;
        }
        return `import { motion } from 'framer-motion';

const ScaleIn = ({ children }) => (
  <motion.div
    initial={{ scale: ${props.initialScale}, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      duration: ${props.duration},
      delay: ${props.delay},
      ease: [0.34, 1.56, 0.64, 1], // Overshoot easing
    }}
  >
    {children}
  </motion.div>
);`;
      },
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.scale-in {
  animation: scaleIn ${props.duration}s cubic-bezier(0.34, 1.56, 0.64, 1) ${props.delay}s both;
}

@keyframes scaleIn {
  from { transform: scale(${props.initialScale}); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`,
    },
  ],
  usage: {
    whenToUse: ['Notification badges', 'Action confirmations', 'Dramatic reveals', 'Badge counters'],
    whenNotToUse: ['Subtle UI elements', 'Large content areas', 'Frequent animations'],
    tips: ['Built-in overshoot easing adds polish', 'Spring option for more organic feel'],
  },
  preview: { background: 'dark' },
};
