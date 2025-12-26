import { FadeInRight } from '../../animations/entrances-exits/FadeInRight';
import { AnimationRegistryEntry } from '../types';

export const fadeInRightEntry: AnimationRegistryEntry = {
  id: 'fade-in-right',
  name: 'Fade In Right',
  category: 'Entrances & Exits',
  description: 'Elements fade in while sliding from the right. Perfect for right sidebars, slide-out panels, and right-aligned content.',
  keywords: ['fade', 'right', 'slide', 'entrance', 'sidebar', 'panel', 'drawer'],
  component: FadeInRight,
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
      prop: 'distance',
      type: 'range',
      defaultValue: 20,
      options: { min: 5, max: 100, step: 5, unit: 'px' },
      meta: { label: 'Distance', description: 'How far the element slides from the right.' },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const FadeInRight = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: ${props.distance} }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: ${props.duration}, delay: ${props.delay} }}
  >
    {children}
  </motion.div>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.fade-in-right {
  animation: fadeInRight ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(${props.distance}px); }
  to { opacity: 1; transform: translateX(0); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Right sidebars and drawers', 'Settings panels', 'Detail views', 'Right-aligned notifications'],
    whenNotToUse: ['LTR reading flow content', 'Primary content reveals'],
  },
  preview: { background: 'dark' },
};
