import type { Meta, StoryObj } from '@storybook/react';
import { EditingBooth } from '../components';
import { floatingParticlesEntry, starfieldEntry, particleNetworkEntry } from '../registry';

// ============================================================================
// FLOATING PARTICLES BOOTH
// ============================================================================

const FloatingParticlesMeta: Meta<typeof EditingBooth> = {
  title: 'Editing Booth/Particle Effects/Floating Particles',
  component: EditingBooth,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Gentle drifting particles like dust motes in sunlight. Interactive, subtle background effect.',
      },
    },
  },
};

export default FloatingParticlesMeta;

type FloatingParticlesStory = StoryObj<typeof EditingBooth>;

export const FloatingParticlesBooth: FloatingParticlesStory = {
  args: {
    animation: floatingParticlesEntry,
  },
  parameters: {
    docs: {
      description: {
        story: 'Canvas-based floating particles with mouse repulsion. Perfect for ambient hero backgrounds.',
      },
    },
  },
};

// ============================================================================
// STARFIELD BOOTH
// ============================================================================

export const StarfieldBooth: StoryObj<typeof EditingBooth> = {
  args: {
    animation: starfieldEntry,
  },
  parameters: {
    docs: {
      description: {
        story: 'Twinkling points of light with parallax depth effect. Great for space-themed or night sky backgrounds.',
      },
    },
  },
};

// ============================================================================
// PARTICLE NETWORK BOOTH
// ============================================================================

export const ParticleNetworkBooth: StoryObj<typeof EditingBooth> = {
  args: {
    animation: particleNetworkEntry,
  },
  parameters: {
    docs: {
      description: {
        story: 'Connected constellation of nodes. Tech-themed, web-like background with mouse attraction.',
      },
    },
  },
};
