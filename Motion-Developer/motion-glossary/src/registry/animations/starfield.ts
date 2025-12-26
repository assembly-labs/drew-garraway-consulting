import { AnimationRegistryEntry } from '../types';
import { Starfield, starfieldCode, starfieldCssCode } from '../../animations/particle-effects';

export const starfieldEntry: AnimationRegistryEntry = {
  id: 'starfield',
  name: 'Starfield',
  category: 'Particle Effects',
  description: 'Twinkling points of light like a night sky. Features subtle parallax movement on mouse interaction for depth.',
  keywords: ['stars', 'twinkle', 'night', 'sky', 'space', 'parallax', 'ambient', 'background'],
  component: Starfield,
  controls: [
    {
      prop: 'starCount',
      type: 'range',
      defaultValue: 100,
      meta: {
        label: 'Star Count',
        description: 'Number of stars in the night sky.',
        analogy: 'A clear night in the countryside has more visible stars than a city sky.',
      },
      options: { min: 20, max: 300, step: 10 },
    },
    {
      prop: 'maxStarSize',
      type: 'range',
      defaultValue: 3,
      meta: {
        label: 'Max Star Size',
        description: 'Maximum size of stars in pixels.',
        analogy: 'Larger stars become the "bright" ones that catch your eye.',
      },
      options: { min: 1, max: 8, step: 0.5, unit: 'px' },
    },
    {
      prop: 'color',
      type: 'color',
      defaultValue: '#ffffff',
      meta: {
        label: 'Color',
        description: 'The color of the stars.',
        analogy: 'White is classic, but try soft blue for a cold night or warm yellow for a sunset sky.',
      },
    },
    {
      prop: 'twinkleSpeed',
      type: 'range',
      defaultValue: 0.5,
      meta: {
        label: 'Twinkle Speed',
        description: 'How fast stars twinkle (fade in and out).',
        analogy: 'Slow twinkle is serene, fast twinkle feels more dynamic.',
      },
      options: { min: 0.1, max: 1, step: 0.1 },
    },
    {
      prop: 'opacity',
      type: 'range',
      defaultValue: 0.8,
      meta: {
        label: 'Opacity',
        description: 'Base brightness of the stars.',
        analogy: 'Lower opacity creates a misty, distant galaxy feel.',
      },
      options: { min: 0.2, max: 1, step: 0.1 },
    },
    {
      prop: 'parallaxStrength',
      type: 'range',
      defaultValue: 0.3,
      meta: {
        label: 'Parallax Strength',
        description: 'How much stars shift based on mouse position.',
        analogy: 'Creates depth—near stars move more than distant ones, like looking through a window.',
      },
      options: { min: 0, max: 1, step: 0.1 },
    },
  ],
  codeTemplates: [
    {
      language: 'javascript',
      label: 'Canvas/React',
      generate: () => starfieldCode,
    },
    {
      language: 'css',
      label: 'CSS (Limited)',
      generate: () => starfieldCssCode,
    },
  ],
  usage: {
    whenToUse: [
      'Perfect for dark-themed hero sections and landing pages',
      'Use with parallax for immersive space/night themes',
      'Pair with gradients from dark blue to black',
      'Keep star count moderate for smooth performance',
    ],
    whenNotToUse: [
      'Don\'t use on light backgrounds—stars won\'t be visible',
      'Avoid high parallax on touch devices (no hover)',
      'Don\'t combine with other busy background effects',
    ],
    accessibility: [
      'Respects prefers-reduced-motion—disables twinkle and parallax',
      'Purely decorative background element',
      'Stars remain visible even when motion is reduced',
    ],
  },
  preview: {
    background: 'dark',
    minHeight: 300,
  },
};
