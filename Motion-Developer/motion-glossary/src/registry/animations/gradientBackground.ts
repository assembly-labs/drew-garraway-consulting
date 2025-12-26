import { GradientBackground } from '../../animations/ambient-backgrounds/GradientBackground';
import { AnimationRegistryEntry } from '../types';

export const gradientBackgroundEntry: AnimationRegistryEntry = {
  id: 'gradient-background',
  name: 'Gradient Background',
  category: 'Ambient Backgrounds',
  description: 'A smoothly animating gradient background that shifts colors over time. Creates visual interest without distracting from content.',
  keywords: ['gradient', 'background', 'ambient', 'colors', 'shift', 'mesh', 'aurora', 'dynamic'],
  component: GradientBackground,
  controls: [
    {
      prop: 'colors',
      type: 'text',
      defaultValue: '#7c3aed, #3b82f6, #06b6d4, #8b5cf6',
      meta: {
        label: 'Colors',
        description: 'Comma-separated list of colors for the gradient.',
        tip: 'Use 3-5 colors that blend well together.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 10,
      options: { min: 3, max: 30, step: 1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Time for one complete color cycle.',
        analogy: 'Slower is more calming and subtle. Faster is more dynamic.',
        tip: '8-15s is ideal. Below 5s can feel restless.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => {
        const colors = props.colors.split(',').map((c: string) => c.trim());
        return `import { motion } from 'framer-motion';

const GradientBackground = ({ children }) => (
  <motion.div
    style={{
      background: 'linear-gradient(-45deg, ${colors.join(', ')})',
      backgroundSize: '400% 400%',
    }}
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{
      duration: ${props.duration},
      repeat: Infinity,
      ease: 'linear',
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
        const colors = props.colors.split(',').map((c: string) => c.trim());
        return `.gradient-background {
  background: linear-gradient(-45deg, ${colors.join(', ')});
  background-size: 400% 400%;
  animation: gradient ${props.duration}s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
      },
    },
  ],
  usage: {
    whenToUse: ['Hero sections', 'Landing page backgrounds', 'Card backgrounds', 'Empty states'],
    whenNotToUse: ['Behind text-heavy content', 'Data dashboards', 'Forms'],
    tips: [
      'Use colors that blend smoothly',
      'Keep duration slow for ambient effect',
      'Add a semi-transparent overlay for text readability',
    ],
    accessibility: ['Non-essential motion', 'Consider reduced motion preferences'],
  },
  preview: { background: 'gradient', minHeight: 300 },
};
