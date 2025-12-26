import { StaggeredChildren } from '../../animations/entrances-exits/StaggeredChildren';
import { AnimationRegistryEntry } from '../types';

export const staggeredChildrenEntry: AnimationRegistryEntry = {
  id: 'staggered-children',
  name: 'Staggered Children',
  category: 'Entrances & Exits',
  description: 'A container that staggers the entrance of its children. Creates a cascading reveal effect, perfect for lists, grids, and sequential content.',
  keywords: ['stagger', 'cascade', 'sequence', 'list', 'grid', 'children', 'delay', 'wave'],
  component: StaggeredChildren,
  controls: [
    {
      prop: 'staggerDelay',
      type: 'range',
      defaultValue: 0.1,
      options: { min: 0.03, max: 0.3, step: 0.01, unit: 's' },
      meta: {
        label: 'Stagger Delay',
        description: 'Time gap between each child animating.',
        analogy: 'Like dominoes falling - smaller delay = faster cascade, larger = more deliberate.',
        tip: '0.05-0.1s for quick lists, 0.15-0.2s for dramatic reveals.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.4,
      options: { min: 0.1, max: 1, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Animation duration for each child.',
      },
    },
    {
      prop: 'distance',
      type: 'range',
      defaultValue: 20,
      options: { min: 5, max: 50, step: 5, unit: 'px' },
      meta: {
        label: 'Distance',
        description: 'How far each child travels during entrance.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: ${props.staggerDelay} }
  }
};

const item = {
  hidden: { opacity: 0, y: ${props.distance} },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: ${props.duration} }
  }
};

const StaggeredList = ({ items }) => (
  <motion.ul variants={container} initial="hidden" animate="show">
    {items.map((item) => (
      <motion.li key={item.id} variants={item}>
        {item.content}
      </motion.li>
    ))}
  </motion.ul>
);`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.staggered-container > * {
  animation: staggerFadeIn ${props.duration}s ease-out both;
}

.staggered-container > *:nth-child(1) { animation-delay: 0s; }
.staggered-container > *:nth-child(2) { animation-delay: ${props.staggerDelay}s; }
.staggered-container > *:nth-child(3) { animation-delay: ${props.staggerDelay * 2}s; }
.staggered-container > *:nth-child(4) { animation-delay: ${props.staggerDelay * 3}s; }
/* Add more as needed */

@keyframes staggerFadeIn {
  from { opacity: 0; transform: translateY(${props.distance}px); }
  to { opacity: 1; transform: translateY(0); }
}`,
    },
  ],
  usage: {
    whenToUse: ['List items', 'Card grids', 'Navigation menus', 'Feature lists', 'Search results'],
    whenNotToUse: ['Single elements', 'Real-time updating content', 'Very long lists (>20 items)'],
    tips: ['Wrap your list/grid with this component', 'Children should be motion.div elements'],
  },
  preview: { background: 'dark', minHeight: 350 },
};
