import { ScrollProgressBar } from '../../animations/scroll-driven/ScrollProgressBar';
import { AnimationRegistryEntry } from '../types';

export const scrollProgressBarEntry: AnimationRegistryEntry = {
  id: 'scroll-progress-bar',
  name: 'Scroll Progress Bar',
  category: 'Scroll-Driven',
  description: 'A progress bar that fills as the user scrolls down the page. Provides visual feedback on reading progress.',
  keywords: ['scroll', 'progress', 'bar', 'reading', 'indicator', 'position', 'track'],
  component: ScrollProgressBar,
  controls: [
    {
      prop: 'color',
      type: 'color',
      defaultValue: '#8b5cf6',
      meta: {
        label: 'Color',
        description: 'Color of the progress bar.',
        tip: 'Use your brand primary color.',
      },
    },
    {
      prop: 'height',
      type: 'range',
      defaultValue: 4,
      options: { min: 2, max: 10, step: 1, unit: 'px' },
      meta: {
        label: 'Height',
        description: 'Thickness of the progress bar.',
        tip: '3-4px is subtle, 6px+ is more prominent.',
      },
    },
    {
      prop: 'position',
      type: 'select',
      defaultValue: 'top',
      options: {
        choices: [
          { value: 'top', label: 'Top' },
          { value: 'bottom', label: 'Bottom' },
        ],
      },
      meta: {
        label: 'Position',
        description: 'Where the bar appears on screen.',
        tip: 'Top is most common, bottom for unique UX.',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        ${props.position}: 0,
        left: 0,
        right: 0,
        height: ${props.height},
        background: '${props.color}',
        transformOrigin: 'left',
        scaleX,
        zIndex: 9999,
      }}
    />
  );
};`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: (props) => `.scroll-progress {
  position: fixed;
  ${props.position}: 0;
  left: 0;
  height: ${props.height}px;
  background: ${props.color};
  transform-origin: left;
  z-index: 9999;
  /* Width controlled by JavaScript */
}

/* JavaScript:
   window.addEventListener('scroll', () => {
     const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
     bar.style.transform = \`scaleX(\${progress})\`;
   });
*/`,
    },
  ],
  usage: {
    whenToUse: ['Blog posts', 'Long articles', 'Documentation', 'Reading-focused pages'],
    whenNotToUse: ['Short pages', 'App-style interfaces', 'Infinite scroll'],
    tips: ['Spring physics makes it feel smooth', 'Add to your layout component'],
  },
  preview: { background: 'dark' },
};
