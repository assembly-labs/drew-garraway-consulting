import type { Meta, StoryObj } from '@storybook/react';
import { FadeIn, fadeInCode, fadeInCssCode } from './FadeIn';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof FadeIn> = {
  title: 'Entrances & Exits/Fade/FadeIn',
  component: FadeIn,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Basic opacity animation from 0 to 1. The simplest and most versatile entrance animation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Animation duration in seconds',
    },
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: 'Animation delay in seconds',
    },
    easing: {
      control: 'select',
      options: [
        [0.4, 0, 0.2, 1],  // Ease Out
        [0.4, 0, 1, 1],    // Ease In
        [0.4, 0, 0.2, 1],  // Ease In Out
        [0, 0, 1, 1],      // Linear
      ],
      description: 'Easing function',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FadeIn>;

export const Default: Story = {
  args: {
    duration: 0.5,
    delay: 0,
    easing: [0.4, 0, 0.2, 1],
  },
  render: (args) => (
    <DemoContainer title="Fade In" description="Basic opacity transition from invisible to visible">
      <FadeIn {...args}>
        <AnimationBox>Fade In</AnimationBox>
      </FadeIn>
    </DemoContainer>
  ),
};

export const Slow: Story = {
  args: {
    duration: 1.5,
    delay: 0,
  },
  render: (args) => (
    <DemoContainer title="Slow Fade In" description="Extended duration for dramatic reveals">
      <FadeIn {...args}>
        <AnimationBox variant="secondary">Slow</AnimationBox>
      </FadeIn>
    </DemoContainer>
  ),
};

export const Delayed: Story = {
  args: {
    duration: 0.5,
    delay: 0.5,
  },
  render: (args) => (
    <DemoContainer title="Delayed Fade In" description="Starts after a short delay">
      <FadeIn {...args}>
        <AnimationBox variant="gradient">Delayed</AnimationBox>
      </FadeIn>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  args: {
    duration: 0.5,
    delay: 0,
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Fade In" description="Basic opacity transition">
        <FadeIn {...args}>
          <AnimationBox>Fade In</AnimationBox>
        </FadeIn>
      </DemoContainer>

      <CodeBlock
        code={fadeInCode}
        language="tsx"
        title="Implementation"
        alternativeCode={fadeInCssCode}
        alternativeLabel="CSS"
      />

      <UsageNotes
        whenToUse={[
          'Initial page load content',
          'Lazy-loaded images and components',
          'Modal and dialog content',
          'Toast notifications',
          'Any subtle content appearance',
        ]}
        whenNotToUse={[
          'When you need directional context (use FadeInUp instead)',
          'For important CTAs that need more attention',
          'When content position matters for context',
        ]}
        tips={[
          'Keep duration between 0.2s and 0.5s for UI elements',
          'Use longer durations (0.5s-1s) for hero content',
          'Combine with other transforms for more dynamic entrances',
        ]}
        accessibility={[
          'Respects prefers-reduced-motion automatically',
          'Content is immediately available to screen readers',
        ]}
        performance={[
          'Opacity-only animations are GPU-accelerated',
          'Very performant, safe to use liberally',
        ]}
      />
    </div>
  ),
};
