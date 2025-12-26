import type { Meta, StoryObj } from '@storybook/react';
import { Pulse, pulseCode, pulseCssCode } from './Pulse';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof Pulse> = {
  title: 'Attention & Emphasis/Pulse/Pulse',
  component: Pulse,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Makes an element "breathe" by scaling up and down repeatedly. Great for drawing attention to buttons or notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    scale: {
      control: { type: 'range', min: 1.01, max: 1.2, step: 0.01 },
      description: '📏 How much bigger the element gets. 1.05 = 5% bigger. Higher = more obvious pulse.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1.05' },
      },
    },
    duration: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: '⏱️ Time for one full pulse cycle (grow + shrink). Lower = faster heartbeat.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
  },
  args: {
    scale: 1.05,
    duration: 1,
  },
};

export default meta;
type Story = StoryObj<typeof Pulse>;

export const Default: Story = {
  args: { scale: 1.05, duration: 1 },
  render: (args) => (
    <DemoContainer title="Pulse" description="Rhythmic scaling" showReplay={false}>
      <Pulse {...args}>
        <AnimationBox>Pulse</AnimationBox>
      </Pulse>
    </DemoContainer>
  ),
};

export const Subtle: Story = {
  args: { scale: 1.02, duration: 2 },
  render: (args) => (
    <DemoContainer title="Subtle Pulse" showReplay={false}>
      <Pulse {...args}>
        <AnimationBox variant="secondary">Subtle</AnimationBox>
      </Pulse>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Pulse" showReplay={false}>
        <Pulse>
          <AnimationBox>Pulse</AnimationBox>
        </Pulse>
      </DemoContainer>
      <CodeBlock code={pulseCode} alternativeCode={pulseCssCode} />
      <UsageNotes
        whenToUse={['CTAs needing attention', 'Notifications', 'Important status indicators', 'Waiting states']}
        whenNotToUse={['Too many elements (visual noise)', 'Long reading sessions']}
      />
    </div>
  ),
};
