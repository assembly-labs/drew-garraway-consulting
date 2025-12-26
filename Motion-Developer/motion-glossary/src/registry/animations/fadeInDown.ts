import { FadeInDown } from '../../animations/entrances-exits/FadeInDown';
import { AnimationRegistryEntry } from '../types';

export const fadeInDownEntry: AnimationRegistryEntry = {
  id: 'fade-in-down',
  name: 'Fade In Down',
  category: 'Entrances & Exits',
  description: 'Elements fade in while descending from above. Perfect for dropdowns, notifications, and content that "falls" into place.',
  keywords: ['fade', 'down', 'drop', 'fall', 'entrance', 'dropdown', 'notification', 'header'],
  component: FadeInDown,
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
        description: 'How far the element falls from.',
        tip: '10-20px for subtle, 30-50px for noticeable drop.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const FadeInDown = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: -${props.distance} }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: ${props.duration}, delay: ${props.delay} }}
  >
    {children}
  </motion.div>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.fade-in-down {
  animation: fadeInDown ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-${props.distance}px); }
  to { opacity: 1; transform: translateY(0); }
}`,
    },
  ],
  usage: {
    whenToUse: ['Dropdown menus', 'Toast notifications from top', 'Header elements', 'Tooltips below triggers'],
    whenNotToUse: ['Scroll-triggered content (use up instead)', 'Footer elements'],
    tips: ['Natural for elements originating from headers/top nav', 'Great for dropdown menus'],
  },
  preview: { background: 'dark' },
};
