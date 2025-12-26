import { Shake } from '../../animations/attention-emphasis/Shake';
import { AnimationRegistryEntry } from '../types';

export const shakeEntry: AnimationRegistryEntry = {
  id: 'shake',
  name: 'Shake',
  category: 'Attention & Emphasis',
  description: 'A quick shaking motion to signal errors, warnings, or grab immediate attention. Use sparingly for maximum impact.',
  keywords: ['shake', 'error', 'warning', 'vibrate', 'alert', 'attention', 'invalid', 'wrong'],
  component: Shake,
  controls: [
    {
      prop: 'direction',
      type: 'select',
      defaultValue: 'horizontal',
      options: {
        choices: [
          { value: 'horizontal', label: 'Horizontal (←→)' },
          { value: 'vertical', label: 'Vertical (↑↓)' },
          { value: 'rotate', label: 'Rotate (↻)' },
        ],
      },
      meta: {
        label: 'Direction',
        description: 'Which way the element shakes.',
        analogy: 'Horizontal is like shaking your head "no". Vertical is like nodding. Rotate is like a wobble.',
        tip: 'Horizontal is most commonly used for form validation errors.',
      },
    },
    {
      prop: 'intensity',
      type: 'range',
      defaultValue: 10,
      options: { min: 2, max: 30, step: 1, unit: 'px' },
      meta: {
        label: 'Intensity',
        description: 'How far the element moves during the shake.',
        analogy: 'Like volume on a speaker - 5 is a gentle tremor, 20+ is aggressive shaking.',
        tip: '8-12px is noticeable but not jarring. Higher values for critical errors.',
        warning: 'High intensity can feel aggressive or cause motion sickness.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.5,
      options: { min: 0.2, max: 1, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'How long the shake lasts.',
        tip: '0.4-0.6s is ideal. Longer shakes can feel excessive.',
      },
    },
    {
      prop: 'repeat',
      type: 'select',
      defaultValue: 0,
      options: {
        choices: [
          { value: 0, label: 'Once' },
          { value: 1, label: 'Twice' },
          { value: 2, label: '3 times' },
        ],
      },
      meta: {
        label: 'Repeat',
        description: 'How many additional times to shake.',
        tip: 'Usually once is enough. Multiple shakes for critical errors only.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => {
        const animateProp = props.direction === 'horizontal'
          ? `x: [0, -${props.intensity}, ${props.intensity}, -${props.intensity}, ${props.intensity}, 0]`
          : props.direction === 'vertical'
          ? `y: [0, -${props.intensity}, ${props.intensity}, -${props.intensity}, ${props.intensity}, 0]`
          : `rotate: [0, -${props.intensity}, ${props.intensity}, -${props.intensity}, ${props.intensity}, 0]`;
        return `import { motion } from 'framer-motion';

const Shake = ({ children }) => (
  <motion.div
    animate={{ ${animateProp} }}
    transition={{ duration: ${props.duration} }}
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
        const transform = props.direction === 'horizontal'
          ? 'translateX'
          : props.direction === 'vertical'
          ? 'translateY'
          : 'rotate';
        const unit = props.direction === 'rotate' ? 'deg' : 'px';
        return `.shake {
  animation: shake ${props.duration}s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: ${transform}(0); }
  20% { transform: ${transform}(-${props.intensity}${unit}); }
  40% { transform: ${transform}(${props.intensity}${unit}); }
  60% { transform: ${transform}(-${props.intensity}${unit}); }
  80% { transform: ${transform}(${props.intensity}${unit}); }
}`;
      },
    },
  ],
  usage: {
    whenToUse: [
      'Form validation errors',
      'Invalid input feedback',
      'Critical alerts requiring attention',
      'Destructive action warnings',
    ],
    whenNotToUse: [
      'Success states (use something positive)',
      'General notifications',
      'Decorative purposes',
      'Frequently triggered actions',
    ],
    tips: [
      'Trigger once per error, not on every keystroke',
      'Pair with color change (red) and error message',
      'Use horizontal for forms, rotate for playful contexts',
    ],
    accessibility: [
      'Respects prefers-reduced-motion',
      'Can trigger vestibular issues - use sparingly',
      'Always pair with non-motion feedback (color, text)',
    ],
  },
  preview: { background: 'dark' },
};
