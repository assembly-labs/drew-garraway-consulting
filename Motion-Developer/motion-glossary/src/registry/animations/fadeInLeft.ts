import { FadeInLeft } from '../../animations/entrances-exits/FadeInLeft';
import { AnimationRegistryEntry } from '../types';

export const fadeInLeftEntry: AnimationRegistryEntry = {
  id: 'fade-in-left',
  name: 'Fade In Left',
  category: 'Entrances & Exits',
  description: 'Elements fade in while sliding from the left. Perfect for sidebars, navigation panels, and left-aligned content.',
  keywords: ['fade', 'left', 'slide', 'entrance', 'sidebar', 'navigation', 'panel'],
  component: FadeInLeft,
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
      meta: {
        label: 'Distance',
        description: 'How far the element slides from the left.',
        tip: 'Match to your content width for smooth reveals.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const FadeInLeft = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -${props.distance} }}
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
      generate: (props) => `.fade-in-left {
  animation: fadeInLeft ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-${props.distance}px); }
  to { opacity: 1; transform: translateX(0); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Left sidebars and drawers', 'Navigation menus', 'Timeline events', 'Left-aligned cards'],
    whenNotToUse: ['Right-to-left language interfaces', 'Content that should appear from right'],
  },
  preview: { background: 'dark' },
};
