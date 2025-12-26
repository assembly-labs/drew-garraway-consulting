import { Pulse } from '../../animations/attention-emphasis/Pulse';
import { AnimationRegistryEntry } from '../types';

/**
 * Pulse Animation Registry Entry
 *
 * Rhythmic scaling animation that draws attention to an element.
 */
export const pulseEntry: AnimationRegistryEntry = {
  id: 'pulse',
  name: 'Pulse',
  category: 'Attention & Emphasis',
  description:
    'A rhythmic scaling animation that draws attention to important elements. Like a heartbeat, it subtly grows and shrinks to catch the eye.',
  keywords: ['pulse', 'attention', 'heartbeat', 'glow', 'notification', 'cta', 'emphasis', 'scale'],

  component: Pulse,

  controls: [
    {
      prop: 'scale',
      type: 'range',
      defaultValue: 1.05,
      options: {
        min: 1.01,
        max: 1.3,
        step: 0.01,
      },
      meta: {
        label: 'Scale',
        description: 'How much bigger the element gets at its peak.',
        analogy:
          'Think of it like a heartbeat - 1.05 is a gentle thump you barely notice, 1.2 is an excited pound that demands attention.',
        tip: 'Use 1.02-1.05 for subtle background pulses, 1.1-1.2 for notifications and CTAs.',
        warning: 'Values above 1.3 can feel aggressive and may cause layout shifts.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 1,
      options: {
        min: 0.3,
        max: 3,
        step: 0.1,
        unit: 's',
      },
      meta: {
        label: 'Duration',
        description: 'Time for one complete pulse cycle (grow + shrink back).',
        analogy:
          'Like a breathing rhythm - 0.5s is rapid and urgent, 2s is slow and meditative.',
        tip: 'Faster pulses (0.5-1s) feel urgent. Slower pulses (1.5-3s) feel calm and ambient.',
      },
    },
    {
      prop: 'repeat',
      type: 'select',
      defaultValue: 'infinity',
      options: {
        choices: [
          { value: 'infinity', label: 'Forever (Infinity)' },
          { value: 1, label: 'Once (1)' },
          { value: 2, label: 'Twice (2)' },
          { value: 3, label: 'Three times (3)' },
          { value: 5, label: 'Five times (5)' },
        ],
      },
      meta: {
        label: 'Repeat',
        description: 'How many times the pulse repeats.',
        analogy:
          'Like a notification badge - infinite repeats for ongoing attention, limited repeats for "hey look at this once".',
        tip: 'Use finite repeats (2-3) for new feature callouts that shouldn\'t distract forever.',
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

const Pulse = ({ children }) => (
  <motion.div
    animate={{ scale: [1, ${props.scale}, 1] }}
    transition={{
      duration: ${props.duration},
      repeat: ${repeatValue},
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

// Usage
<Pulse>
  <YourElement />
</Pulse>`;
      },
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => {
        const repeatValue = props.repeat === 'infinity' ? 'infinite' : props.repeat;
        return `.pulse {
  animation: pulse ${props.duration}s ease-in-out ${repeatValue};
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(${props.scale});
  }
}

/* Usage: <div class="pulse">Your content</div> */`;
      },
    },
  ],

  usage: {
    whenToUse: [
      'Drawing attention to important CTAs or buttons',
      'Notification badges that need to be noticed',
      'New feature indicators or badges',
      'Loading states where something is "alive"',
      'Highlighting recently updated content',
    ],
    whenNotToUse: [
      'Multiple elements on the same screen (visual noise)',
      'Long reading sessions (distraction)',
      'Elements that users interact with frequently',
      'Background decorations (too distracting)',
    ],
    tips: [
      'Combine with a subtle glow/shadow for extra emphasis',
      'Use slower durations (2s+) for ambient background effects',
      'Consider finite repeats for one-time callouts',
      'Test on real users - what feels subtle to you may annoy others',
    ],
    accessibility: [
      'Automatically respects prefers-reduced-motion',
      'Avoid using pulse as the only indicator of state',
      'Ensure sufficient color contrast for pulsing elements',
      'Consider users with vestibular disorders',
    ],
    performance: [
      'Uses GPU-accelerated transform property',
      'Minimal performance impact for single elements',
      'Avoid using on many elements simultaneously',
    ],
  },

  preview: {
    background: 'dark',
    minHeight: 300,
  },
};

export default pulseEntry;
