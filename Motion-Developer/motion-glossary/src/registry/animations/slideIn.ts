import { SlideIn } from '../../animations/entrances-exits/SlideIn';
import { AnimationRegistryEntry } from '../types';

export const slideInEntry: AnimationRegistryEntry = {
  id: 'slide-in',
  name: 'Slide In',
  category: 'Entrances & Exits',
  description: 'A versatile sliding entrance from any direction. Perfect for panels, drawers, and content that should feel like it\'s coming from off-screen.',
  keywords: ['slide', 'drawer', 'panel', 'entrance', 'direction', 'menu', 'sidebar', 'off-screen'],
  component: SlideIn,
  controls: [
    {
      prop: 'direction',
      type: 'select',
      defaultValue: 'left',
      options: {
        choices: [
          { value: 'left', label: 'From Left (←)' },
          { value: 'right', label: 'From Right (→)' },
          { value: 'up', label: 'From Below (↑)' },
          { value: 'down', label: 'From Above (↓)' },
        ],
      },
      meta: {
        label: 'Direction',
        description: 'Which direction the element slides from.',
        tip: 'Match to where the element "lives" - sidebars from sides, dropdowns from top.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.5,
      options: { min: 0.1, max: 1.5, step: 0.1, unit: 's' },
      meta: { label: 'Duration', description: 'How long the slide takes.' },
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
      defaultValue: 100,
      options: { min: 20, max: 300, step: 10, unit: 'px' },
      meta: {
        label: 'Distance',
        description: 'How far off-screen the element starts.',
        tip: 'Use larger distances (100px+) for dramatic panel slides.',
      },
    },
    {
      prop: 'fade',
      type: 'boolean',
      defaultValue: true,
      meta: {
        label: 'Include Fade',
        description: 'Also fade in while sliding.',
        tip: 'Disable for elements that should always be visible during slide.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => {
        const axis = props.direction === 'left' || props.direction === 'right' ? 'x' : 'y';
        const sign = props.direction === 'right' || props.direction === 'down' ? '' : '-';
        return `import { motion } from 'framer-motion';

const SlideIn = ({ children }) => (
  <motion.div
    initial={{ ${axis}: ${sign}${props.distance}, opacity: ${props.fade ? 0 : 1} }}
    animate={{ ${axis}: 0, opacity: 1 }}
    transition={{ duration: ${props.duration}, delay: ${props.delay} }}
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
        const transform = props.direction === 'left' ? `translateX(-${props.distance}px)` :
          props.direction === 'right' ? `translateX(${props.distance}px)` :
          props.direction === 'up' ? `translateY(${props.distance}px)` :
          `translateY(-${props.distance}px)`;
        return `.slide-in {
  animation: slideIn ${props.duration}s ease-out ${props.delay}s both;
}

@keyframes slideIn {
  from {
    transform: ${transform};${props.fade ? '\n    opacity: 0;' : ''}
  }
  to {
    transform: translate(0);${props.fade ? '\n    opacity: 1;' : ''}
  }
}`;
      },
    },
  ],
  usage: {
    whenToUse: ['Navigation drawers', 'Slide-out panels', 'Mobile menus', 'Full-width reveals'],
    whenNotToUse: ['Small inline elements', 'Subtle content changes'],
    tips: ['Use large distances for panel-style slides', 'Disable fade for sheet overlays'],
  },
  preview: { background: 'dark' },
};
