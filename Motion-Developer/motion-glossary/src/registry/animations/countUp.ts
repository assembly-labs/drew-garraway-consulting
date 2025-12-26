import { CountUp } from '../../animations/text-typography/CountUp';
import { AnimationRegistryEntry } from '../types';

export const countUpEntry: AnimationRegistryEntry = {
  id: 'count-up',
  name: 'Count Up',
  category: 'Text & Typography',
  description: 'Animates a number from start to end value. Perfect for statistics, achievements, and metrics that should feel impactful.',
  keywords: ['count', 'number', 'statistics', 'metrics', 'increment', 'animate', 'achievement'],
  component: CountUp,
  controls: [
    {
      prop: 'end',
      type: 'number',
      defaultValue: 1000,
      options: { min: 0, max: 1000000, step: 1 },
      meta: {
        label: 'End Value',
        description: 'The final number to count to.',
      },
    },
    {
      prop: 'start',
      type: 'number',
      defaultValue: 0,
      options: { min: 0, max: 1000000, step: 1 },
      meta: {
        label: 'Start Value',
        description: 'The number to start counting from.',
        tip: 'Usually 0, but can start higher for effect.',
      },
    },
    {
      prop: 'duration',
      type: 'range',
      defaultValue: 2,
      options: { min: 0.5, max: 5, step: 0.5, unit: 's' },
      meta: {
        label: 'Duration',
        description: 'How long the count animation takes.',
        tip: '2-3s feels satisfying. Longer for larger numbers.',
      },
    },
    {
      prop: 'prefix',
      type: 'text',
      defaultValue: '',
      meta: {
        label: 'Prefix',
        description: 'Text before the number (e.g., "$").',
      },
    },
    {
      prop: 'suffix',
      type: 'text',
      defaultValue: '',
      meta: {
        label: 'Suffix',
        description: 'Text after the number (e.g., "+", "%").',
      },
    },
    {
      prop: 'separator',
      type: 'text',
      defaultValue: ',',
      meta: {
        label: 'Thousands Separator',
        description: 'Character for thousands (e.g., "," for 1,000).',
      },
    },
  ],
  codeTemplates: [
    {
      label: 'Framer Motion',
      language: 'tsx',
      generate: (props) => `import { useEffect, useState } from 'react';

const CountUp = () => {
  const [count, setCount] = useState(${props.start});

  useEffect(() => {
    const duration = ${props.duration} * 1000;
    const start = ${props.start};
    const end = ${props.end};
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(start + (end - start) * eased));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  const formatted = count.toLocaleString('en-US');
  return <span>${props.prefix}{formatted}${props.suffix}</span>;
};`,
    },
    {
      label: 'CSS',
      language: 'css',
      generate: () => `/* CSS-only count animation is not possible.
   Numbers must be animated with JavaScript.

   Use the Framer Motion / React implementation,
   or a library like countup.js */`,
    },
  ],
  usage: {
    whenToUse: ['Statistics displays', 'Achievement counters', 'Dashboard metrics', 'Pricing numbers'],
    whenNotToUse: ['Real-time updating numbers', 'Small insignificant values'],
    tips: ['Trigger on scroll-into-view for impact', 'Use suffixes like "+" or "K" for large numbers'],
  },
  preview: { background: 'dark' },
};
