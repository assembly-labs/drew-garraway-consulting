import { FadeIn } from '../../animations/entrances-exits/FadeIn';
import { AnimationRegistryEntry } from '../types';

export const fadeInEntry: AnimationRegistryEntry = {
  id: 'fade-in',
  name: 'Fade In',
  category: 'Entrances & Exits',
  description: 'The simplest and most versatile entrance animation. Elements smoothly appear by transitioning from transparent to opaque.',
  keywords: ['fade', 'appear', 'opacity', 'simple', 'entrance', 'reveal', 'basic'],
  component: FadeIn,
  controls: [
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.5,
      options: { min: 0.1, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'How long the fade takes.',
        analogy: 'Like a dimmer switch - fast is snappy, slow is cinematic.',
        tip: '0.3-0.5s for UI, 0.8-1.5s for dramatic reveals.',
      },
    },
    {
      prop: 'delay',
      type: 'range',
      defaultValue: 0,
      options: { min: 0, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Delay',
        description: 'Wait time before the animation starts.',
        tip: 'Use delays to sequence multiple elements appearing.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const FadeIn = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
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
      generate: (props) => `.fade-in {
  animation: fadeIn ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}`,
    },
  ],
  usage: {
    whenToUse: ['Page content loading', 'Modal appearances', 'Lazy-loaded images', 'Any element entrance'],
    whenNotToUse: ['When direction/movement would add context', 'Critical immediate content'],
    tips: ['The foundation for most animations', 'Combine with movement for more impact'],
    accessibility: ['Very accessible - subtle and non-jarring', 'Safe for motion-sensitive users'],
  },
  preview: { background: 'dark' },
};
