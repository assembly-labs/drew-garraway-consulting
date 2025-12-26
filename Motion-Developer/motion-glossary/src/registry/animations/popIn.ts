import { PopIn } from '../../animations/entrances-exits/PopIn';
import { AnimationRegistryEntry } from '../types';

export const popInEntry: AnimationRegistryEntry = {
  id: 'pop-in',
  name: 'Pop In',
  category: 'Entrances & Exits',
  description: 'A playful, bouncy entrance with spring physics. Elements pop into existence like a bubble, with a natural overshoot and settle.',
  keywords: ['pop', 'bounce', 'spring', 'playful', 'fun', 'bubble', 'elastic', 'entrance'],
  component: PopIn,
  controls: [
    {
      prop: 'delay',
      type: 'range',
      defaultValue: 0,
      options: { min: 0, max: 2, step: 0.1, unit: 's' },
      meta: {
        label: 'Delay',
        description: 'Wait before the pop animation starts.',
        tip: 'Stagger delays for multiple popping elements.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const PopIn = ({ children }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      type: 'spring',
      stiffness: 400,
      damping: 15,
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
      generate: (props) => `.pop-in {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${props.delay}s both;
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}`,
    },
  ],
  usage: {
    whenToUse: ['Notification bubbles', 'Chat messages', 'Gamification elements', 'Playful UI'],
    whenNotToUse: ['Professional/corporate contexts', 'Serious error states', 'High-frequency events'],
    tips: ['Uses spring physics for natural bounce', 'Great for reward feedback'],
  },
  preview: { background: 'dark' },
};
