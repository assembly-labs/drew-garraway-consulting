import { Bounce } from '../../animations/attention-emphasis/Bounce';
import { AnimationRegistryEntry } from '../types';

export const bounceEntry: AnimationRegistryEntry = {
  id: 'bounce',
  name: 'Bounce',
  category: 'Attention & Emphasis',
  description: 'A playful vertical bouncing motion that brings energy and life to elements. Perfect for drawing attention in a fun, friendly way.',
  keywords: ['bounce', 'jump', 'hop', 'playful', 'fun', 'energy', 'attention', 'vertical'],
  component: Bounce,
  controls: [
    {
      prop: 'height',
      type: 'range',
      defaultValue: 15,
      options: { min: 5, max: 50, step: 1, unit: 'px' },
      meta: {
        label: 'Height',
        description: 'How high the element bounces (in pixels).',
        analogy: 'Like a ball bouncing - 15px is a small hop, 50px is an energetic jump.',
        tip: 'Use 10-20px for subtle UI feedback, 30px+ for playful illustrations.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.6,
      options: { min: 0.2, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Time for one complete bounce cycle.',
        analogy: 'Faster bounces feel energetic and urgent, slower feels playful and relaxed.',
        tip: '0.4-0.6s feels natural. Below 0.3s can feel frantic.',
      },
    },
    {
      prop: 'repeat',
      type: 'select',
      defaultValue: 'infinity',
      options: {
        choices: [
          { value: 'infinity', label: 'Forever' },
          { value: 1, label: 'Once' },
          { value: 2, label: 'Twice' },
          { value: 3, label: '3 times' },
          { value: 5, label: '5 times' },
        ],
      },
      meta: {
        label: 'Repeat',
        description: 'How many times the bounce repeats.',
        tip: 'Use finite repeats for one-time callouts, infinite for persistent indicators.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => {
        const repeatValue = props.repeat === 'infinity' ? 'Infinity' : props.repeat;
        return `import { motion } from 'framer-motion';

const Bounce = ({ children }) => (
  <motion.div
    animate={{ y: [0, -${props.height}, 0] }}
    transition={{
      duration: ${props.duration},
      repeat: ${repeatValue},
      ease: 'easeInOut',
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
      generate: (props) => {
        const repeatValue = props.repeat === 'infinity' ? 'infinite' : props.repeat;
        return `.bounce {
  animation: bounce ${props.duration}s ease-in-out ${repeatValue};
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-${props.height}px); }
}`;
      },
    },
  ],
  usage: {
    whenToUse: [
      'Playful UI elements like mascots or illustrations',
      'Drawing attention to new features or badges',
      'Loading states that should feel friendly',
      'Game-like interfaces',
    ],
    whenNotToUse: [
      'Professional/corporate interfaces',
      'Multiple bouncing elements at once',
      'Long reading sessions',
      'Accessibility-sensitive contexts',
    ],
    tips: [
      'Combine with hover states for interactive elements',
      'Use slower durations for ambient background elements',
      'Consider using finite repeats to avoid distraction',
    ],
    accessibility: [
      'Respects prefers-reduced-motion automatically',
      'Can be distracting for users with attention disorders',
    ],
  },
  preview: { background: 'dark' },
};
