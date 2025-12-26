import { ScrollFadeIn } from '../../animations/scroll-driven/ScrollFadeIn';
import { AnimationRegistryEntry } from '../types';

export const scrollFadeInEntry: AnimationRegistryEntry = {
  id: 'scroll-fade-in',
  name: 'Scroll Fade In',
  category: 'Scroll-Driven',
  description: 'Elements animate into view as the user scrolls. The foundation for scroll-triggered animations and the key to engaging landing pages.',
  keywords: ['scroll', 'fade', 'reveal', 'viewport', 'intersection', 'lazy', 'trigger', 'landing'],
  component: ScrollFadeIn,
  controls: [
    {
      prop: 'direction',
      type: 'select',
      defaultValue: 'up',
      options: {
        choices: [
          { value: 'up', label: 'From Below (↑)' },
          { value: 'down', label: 'From Above (↓)' },
          { value: 'left', label: 'From Left (←)' },
          { value: 'right', label: 'From Right (→)' },
          { value: 'none', label: 'Fade Only' },
        ],
      },
      meta: {
        label: 'Direction',
        description: 'Which direction the element animates from.',
        tip: '"Up" is most natural for scrolling content.',
      },
    },
    {
      prop: 'distance',
      type: 'range',
      defaultValue: 30,
      options: { min: 0, max: 100, step: 5, unit: 'px' },
      meta: {
        label: 'Distance',
        description: 'How far the element travels.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 0.6,
      options: { min: 0.2, max: 1.5, step: 0.1, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'Animation duration.',
      },
    },
    {
      prop: 'threshold',
      type: 'range',
      defaultValue: 0.1,
      options: { min: 0, max: 1, step: 0.1 },
      meta: {
        label: 'Threshold',
        description: 'How much of the element must be visible (0-1).',
        tip: '0.1 triggers early, 0.5 waits until half visible.',
      },
    },
    {
      prop: 'triggerOnce',
      type: 'boolean',
      defaultValue: true,
      meta: {
        label: 'Trigger Once',
        description: 'Only animate the first time element enters view.',
        tip: 'Enable for performance, disable for re-animating on scroll up.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => {
        const initial = props.direction === 'up' ? `y: ${props.distance}` :
          props.direction === 'down' ? `y: -${props.distance}` :
          props.direction === 'left' ? `x: -${props.distance}` :
          props.direction === 'right' ? `x: ${props.distance}` : '';
        const animate = props.direction === 'none' ? '' :
          props.direction === 'up' || props.direction === 'down' ? 'y: 0' : 'x: 0';
        return `import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ScrollFadeIn = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: ${props.triggerOnce},
    amount: ${props.threshold}
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0${initial ? `, ${initial}` : ''} }}
      animate={isInView ? { opacity: 1${animate ? `, ${animate}` : ''} } : {}}
      transition={{ duration: ${props.duration} }}
    >
      {children}
    </motion.div>
  );
};`;
      },
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => {
        const transform = props.direction === 'up' ? `translateY(${props.distance}px)` :
          props.direction === 'down' ? `translateY(-${props.distance}px)` :
          props.direction === 'left' ? `translateX(-${props.distance}px)` :
          props.direction === 'right' ? `translateX(${props.distance}px)` : 'none';
        return `.scroll-fade-in {
  opacity: 0;
  transform: ${transform};
  transition: opacity ${props.duration}s, transform ${props.duration}s;
}

.scroll-fade-in.in-view {
  opacity: 1;
  transform: translate(0);
}

/* Add .in-view class with Intersection Observer */`;
      },
    },
  ],
  usage: {
    whenToUse: ['Landing page sections', 'Blog content', 'Feature lists', 'Any scrollable content'],
    whenNotToUse: ['Above-the-fold content', 'Critical immediate information'],
    tips: ['Use triggerOnce for performance', 'Stagger delays for multiple elements'],
  },
  preview: { background: 'dark', minHeight: 400 },
};
