import { AnimationRegistryEntry } from '../types';
import { ParticleNetwork, particleNetworkCode, particleNetworkCssCode } from '../../animations/particle-effects';

export const particleNetworkEntry: AnimationRegistryEntry = {
  id: 'particle-network',
  name: 'Particle Network',
  category: 'Particle Effects',
  description: 'Connected constellation of nodes with lines between nearby points. Creates a dynamic, web-like network effect with mouse interaction.',
  keywords: ['network', 'constellation', 'connected', 'web', 'nodes', 'lines', 'tech', 'interactive'],
  component: ParticleNetwork,
  controls: [
    {
      prop: 'nodeCount',
      type: 'range',
      defaultValue: 40,
      meta: {
        label: 'Node Count',
        description: 'Number of nodes in the network.',
        analogy: 'More nodes = denser web. Too many can feel cluttered.',
      },
      options: { min: 10, max: 100, step: 5 },
    },
    {
      prop: 'nodeSize',
      type: 'range',
      defaultValue: 3,
      meta: {
        label: 'Node Size',
        description: 'Size of each node in pixels.',
        analogy: 'The "dots" at connection points. Smaller is more subtle.',
      },
      options: { min: 1, max: 8, step: 0.5, unit: 'px' },
    },
    {
      prop: 'nodeColor',
      type: 'color',
      defaultValue: '#8b5cf6',
      meta: {
        label: 'Node Color',
        description: 'Color of the network nodes.',
        analogy: 'The accent points—often matches your brand color.',
      },
    },
    {
      prop: 'lineColor',
      type: 'color',
      defaultValue: '#8b5cf6',
      meta: {
        label: 'Line Color',
        description: 'Color of connection lines between nodes.',
        analogy: 'Usually same as nodes, but can be different for contrast.',
      },
    },
    {
      prop: 'connectionDistance',
      type: 'range',
      defaultValue: 150,
      meta: {
        label: 'Connection Distance',
        description: 'Maximum distance for nodes to connect.',
        analogy: 'Like a social network—closer nodes are "friends" and get connected.',
      },
      options: { min: 50, max: 300, step: 10, unit: 'px' },
    },
    {
      prop: 'speed',
      type: 'range',
      defaultValue: 0.3,
      meta: {
        label: 'Speed',
        description: 'How fast nodes drift around.',
        analogy: 'Slow creates a calm, meditative feel. Fast is more dynamic.',
      },
      options: { min: 0.1, max: 1, step: 0.05 },
    },
    {
      prop: 'opacity',
      type: 'range',
      defaultValue: 0.6,
      meta: {
        label: 'Opacity',
        description: 'Overall transparency of the network.',
        analogy: 'Lower opacity keeps it as a subtle background layer.',
      },
      options: { min: 0.1, max: 1, step: 0.1 },
    },
    {
      prop: 'mouseAttraction',
      type: 'range',
      defaultValue: 0.5,
      meta: {
        label: 'Mouse Attraction',
        description: 'How strongly nodes are attracted to your cursor.',
        analogy: 'Your cursor becomes a gravity well that pulls nodes toward it.',
      },
      options: { min: 0, max: 1, step: 0.1 },
    },
  ],
  codeTemplates: [
    {
      language: 'javascript',
      label: 'Canvas/React',
      generate: () => particleNetworkCode,
    },
    {
      language: 'css',
      label: 'CSS (Not Possible)',
      generate: () => particleNetworkCssCode,
    },
  ],
  usage: {
    whenToUse: [
      'Great for tech-themed landing pages and portfolios',
      'Use behind hero sections or "about" blocks',
      'Match colors to your brand accent color',
      'Subtle opacity (0.3-0.6) keeps content readable',
    ],
    whenNotToUse: [
      'Don\'t use on mobile—too processor intensive',
      'Avoid high node counts on lower-end devices',
      'Don\'t combine with other moving background effects',
    ],
    accessibility: [
      'Respects prefers-reduced-motion—nodes stop moving',
      'Network remains visible but static when motion reduced',
      'Purely decorative—no interaction required for functionality',
    ],
  },
  preview: {
    background: 'dark',
    minHeight: 300,
  },
};
