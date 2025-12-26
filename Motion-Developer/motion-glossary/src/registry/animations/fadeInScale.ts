import { FadeInScale } from '../../animations/entrances-exits/FadeInScale';
import { AnimationRegistryEntry } from '../types';

export const fadeInScaleEntry: AnimationRegistryEntry = {
  id: 'fade-in-scale',
  name: 'Fade In Scale',
  category: 'Entrances & Exits',
  description: 'Elements fade in while growing from a smaller size. Creates a sense of depth and focus, perfect for modals and important content.',
  keywords: ['fade', 'scale', 'grow', 'zoom', 'entrance', 'modal', 'focus', 'depth'],
  component: FadeInScale,
  controls: [
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.5,
      options: { min: 0.1, max: 2, step: 0.1, unit: 's' },
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
      defaultValue: 0.8,
      options: { min: 0, max: 1, step: 0.05 },
      meta: {
        label: 'Initial Scale',
        description: 'Starting size (0 = invisible, 1 = full size).',
        analogy: '0.8 is subtle growth, 0.5 is dramatic zoom in, 0 appears from nothing.',
        tip: '0.8-0.95 for modals, 0.5-0.7 for dramatic reveals.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const FadeInScale = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: ${props.initialScale} }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: ${props.duration}, delay: ${props.delay} }}
  >
    {children}
  </motion.div>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.fade-in-scale {
  animation: fadeInScale ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(${props.initialScale}); }
  to { opacity: 1; transform: scale(1); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Modal dialogs', 'Lightbox images', 'Feature spotlights', 'Tooltip content'],
    whenNotToUse: ['List items (use directional fade)', 'Continuous content flow'],
    tips: ['Creates depth perception', 'Great for focus-drawing UI'],
  },
  preview: { background: 'dark' },
};
