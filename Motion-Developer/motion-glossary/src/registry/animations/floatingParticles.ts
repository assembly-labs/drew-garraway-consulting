import { AnimationRegistryEntry } from '../types';
import { FloatingParticles, floatingParticlesCode, floatingParticlesCssCode } from '../../animations/particle-effects';

export const floatingParticlesEntry: AnimationRegistryEntry = {
  id: 'floating-particles',
  name: 'Floating Particles',
  category: 'Particle Effects',
  description: 'Gentle drifting particles like dust motes in sunlight. Subtle, ambient background effect with mouse interactivity.',
  keywords: ['particles', 'floating', 'dust', 'ambient', 'background', 'canvas', 'interactive', 'mouse'],
  component: FloatingParticles,
  controls: [
    {
      prop: 'particleCount',
      type: 'range',
      defaultValue: 50,
      meta: {
        label: 'Particle Count',
        description: 'Number of particles floating in the container.',
        analogy: 'Dust specks in a sunbeam—more particles means a denser, busier effect.',
      },
      options: { min: 10, max: 200, step: 5 },
    },
    {
      prop: 'particleSize',
      type: 'range',
      defaultValue: 3,
      meta: {
        label: 'Particle Size',
        description: 'Base size of each particle in pixels.',
        analogy: 'The size of dust motes—tiny ones fade into background, larger ones are more visible.',
      },
      options: { min: 1, max: 10, step: 0.5, unit: 'px' },
    },
    {
      prop: 'color',
      type: 'color',
      defaultValue: '#ffffff',
      meta: {
        label: 'Color',
        description: 'The color of the particles.',
        analogy: 'White particles work on dark backgrounds, try purple or gold for themed effects.',
      },
    },
    {
      prop: 'speed',
      type: 'range',
      defaultValue: 0.3,
      meta: {
        label: 'Speed',
        description: 'How fast particles drift across the canvas.',
        analogy: 'Low speed is meditative, higher speed feels more energetic.',
      },
      options: { min: 0.05, max: 1, step: 0.05 },
    },
    {
      prop: 'opacity',
      type: 'range',
      defaultValue: 0.5,
      meta: {
        label: 'Opacity',
        description: 'Base transparency of the particles.',
        analogy: 'Lower opacity creates a ghostly, subtle effect. Higher makes particles pop.',
      },
      options: { min: 0.1, max: 1, step: 0.1 },
    },
    {
      prop: 'mouseInfluence',
      type: 'range',
      defaultValue: 0.3,
      meta: {
        label: 'Mouse Influence',
        description: 'How strongly particles react to mouse movement.',
        analogy: 'Set to 0 for no interaction. Higher values make particles "flee" from your cursor.',
      },
      options: { min: 0, max: 1, step: 0.1 },
    },
  ],
  codeTemplates: [
    {
      language: 'javascript',
      label: 'Canvas/React',
      generate: () => floatingParticlesCode,
    },
    {
      language: 'css',
      label: 'CSS (Limited)',
      generate: () => floatingParticlesCssCode,
    },
  ],
  usage: {
    whenToUse: [
      'Use as a subtle background layer behind hero sections',
      'Keep particle count low (30-50) for ambient effect',
      'Match particle color to your theme',
      'Set mouseInfluence to 0 for static content areas',
    ],
    whenNotToUse: [
      'Avoid high particle counts on mobile (performance)',
      'Don\'t use over complex content—particles should be subtle',
      'Avoid conflicting with important UI elements',
    ],
    accessibility: [
      'Respects prefers-reduced-motion automatically',
      'When reduced motion is enabled, particles remain visible but static',
      'Canvas content is decorative—no alt text needed',
    ],
  },
  preview: {
    background: 'dark',
    minHeight: 300,
  },
};
