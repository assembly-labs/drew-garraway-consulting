import { ButtonPress } from '../../animations/feedback-state/ButtonPress';
import { AnimationRegistryEntry } from '../types';

export const buttonPressEntry: AnimationRegistryEntry = {
  id: 'button-press',
  name: 'Button Press',
  category: 'Feedback & State',
  description: 'Subtle scale-down effect on press/click. Provides immediate tactile feedback that the button is being activated.',
  keywords: ['button', 'press', 'click', 'tap', 'feedback', 'interaction', 'scale', 'tactile'],
  component: ButtonPress,
  controls: [
    {
      prop: 'scale',
      type: 'range',
      defaultValue: 0.95,
      options: { min: 0.85, max: 0.99, step: 0.01 },
      meta: {
        label: 'Press Scale',
        description: 'How much the button shrinks when pressed.',
        analogy: 'Like a physical button being pushed in - 0.95 is subtle, 0.9 is more noticeable.',
        tip: '0.95-0.97 for most buttons, 0.9 for large playful buttons.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.1,
      options: { min: 0.05, max: 0.3, step: 0.01, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'How fast the press animation happens.',
        tip: '0.1s is instant and responsive. Slower feels sluggish.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const ButtonPress = ({ children, onClick }) => (
  <motion.button
    whileTap={{ scale: ${props.scale} }}
    transition={{ duration: ${props.duration} }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.button-press {
  transition: transform ${props.duration}s ease;
}

.button-press:active {
  transform: scale(${props.scale});
}`,
    },
  ],
  usage: {
    whenToUse: ['All clickable buttons', 'Interactive cards', 'Icon buttons', 'Submit buttons'],
    whenNotToUse: ['Links within text', 'Disabled buttons', 'Non-interactive elements'],
    tips: ['Essential UX pattern - use on all buttons', 'Keep duration short for responsiveness'],
    accessibility: ['Provides visual feedback for interactions', 'Safe for motion-sensitive users'],
  },
  preview: { background: 'dark' },
};
