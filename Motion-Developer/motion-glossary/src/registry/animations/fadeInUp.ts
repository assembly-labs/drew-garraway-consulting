import { FadeInUp } from '../../animations/entrances-exits/FadeInUp';
import { AnimationRegistryEntry } from '../types';

export const fadeInUpEntry: AnimationRegistryEntry = {
  id: 'fade-in-up',
  name: 'Fade In Up',
  category: 'Entrances & Exits',
  description: 'Elements fade in while rising upward. The most popular entrance animation - feels natural and draws the eye upward.',
  keywords: ['fade', 'up', 'rise', 'entrance', 'reveal', 'scroll', 'popular', 'natural'],
  component: FadeInUp,
  controls: [
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.5,
      options: { min: 0.1, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'How long the animation takes.',
        tip: '0.4-0.6s feels snappy, 0.8-1.2s feels elegant.',
      },
    },
    {
      prop: 'delay',
      type: 'range',
      defaultValue: 0,
      options: { min: 0, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Delay',
        description: 'Wait before animation starts.',
        tip: 'Stagger delays for lists: 0s, 0.1s, 0.2s, etc.',
      },
    },
    {
      prop: 'distance',
      type: 'range',
      defaultValue: 20,
      options: { min: 5, max: 100, step: 5, unit: 'px' },
      meta: {
        label: 'Distance',
        description: 'How far the element travels upward.',
        analogy: 'Small distance (10-20px) is subtle, large (50px+) is dramatic.',
        tip: '15-30px works for most UI elements.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const FadeInUp = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: ${props.distance} }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: ${props.duration},
      delay: ${props.delay},
    }}
  >
    {children}
  </motion.div>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.fade-in-up {
  animation: fadeInUp ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(${props.distance}px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
    },
  ],
  usage: {
    whenToUse: ['Scroll-triggered reveals', 'Card entrances', 'List item animations', 'Hero section content'],
    whenNotToUse: ['Elements that should appear instantly', 'Dropdown menus (use down)'],
    tips: ['Most versatile directional fade', 'Perfect for scroll-triggered content'],
    accessibility: ['Respects prefers-reduced-motion', 'Natural, non-jarring motion'],
  },
  preview: { background: 'dark' },
};
