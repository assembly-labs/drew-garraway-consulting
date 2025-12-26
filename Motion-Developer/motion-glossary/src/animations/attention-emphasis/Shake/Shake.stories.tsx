import type { Meta, StoryObj } from '@storybook/react';
import { Shake, shakeCode, shakeCssCode } from './Shake';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof Shake> = {
  title: 'Attention & Emphasis/Shake/Shake',
  component: Shake,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical', 'rotate'] },
    intensity: { control: { type: 'range', min: 5, max: 30, step: 1 } },
    duration: { control: { type: 'range', min: 0.2, max: 1, step: 0.1 } },
    repeat: { control: { type: 'range', min: 0, max: 5, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Shake>;

export const Horizontal: Story = {
  args: { direction: 'horizontal', intensity: 10 },
  render: (args) => (
    <DemoContainer title="Horizontal Shake" description="Left-right shake">
      <Shake {...args}>
        <AnimationBox>Shake</AnimationBox>
      </Shake>
    </DemoContainer>
  ),
};

export const Vertical: Story = {
  args: { direction: 'vertical', intensity: 10 },
  render: (args) => (
    <DemoContainer title="Vertical Shake">
      <Shake {...args}>
        <AnimationBox variant="secondary">Vertical</AnimationBox>
      </Shake>
    </DemoContainer>
  ),
};

export const Rotate: Story = {
  args: { direction: 'rotate', intensity: 5 },
  render: (args) => (
    <DemoContainer title="Rotate Shake" description="Rotational wiggle">
      <Shake {...args}>
        <AnimationBox variant="gradient">Wiggle</AnimationBox>
      </Shake>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Shake">
        <Shake>
          <AnimationBox>Shake</AnimationBox>
        </Shake>
      </DemoContainer>
      <CodeBlock code={shakeCode} alternativeCode={shakeCssCode} />
      <UsageNotes
        whenToUse={['Error states', 'Invalid form submissions', 'Wrong password feedback', 'Attention grabbing']}
        whenNotToUse={['Success states', 'Continuous animations', 'Subtle UI feedback']}
        tips={['Keep short (0.3-0.5s)', 'Use sparingly to maintain impact']}
      />
    </div>
  ),
};
