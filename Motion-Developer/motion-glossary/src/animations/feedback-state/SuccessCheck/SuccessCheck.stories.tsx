import type { Meta, StoryObj } from '@storybook/react';
import { SuccessCheck, successCheckCode, successCheckCssCode } from './SuccessCheck';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof SuccessCheck> = {
  title: 'Feedback & State/Success/SuccessCheck',
  component: SuccessCheck,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 30, max: 100, step: 10 } },
    color: { control: 'color' },
    strokeWidth: { control: { type: 'range', min: 2, max: 6, step: 1 } },
    duration: { control: { type: 'range', min: 0.3, max: 1, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof SuccessCheck>;

export const Default: Story = {
  args: { size: 60, color: '#22c55e' },
  render: (args) => (
    <DemoContainer title="Success Check" description="Animated checkmark drawing">
      <SuccessCheck {...args} />
    </DemoContainer>
  ),
};

export const Large: Story = {
  args: { size: 100 },
  render: (args) => (
    <DemoContainer title="Large Success Check">
      <SuccessCheck {...args} />
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Success Check">
        <SuccessCheck />
      </DemoContainer>
      <CodeBlock code={successCheckCode} alternativeCode={successCheckCssCode} />
      <UsageNotes
        whenToUse={['Form submission success', 'Task completion', 'Payment confirmation', 'Upload complete']}
        tips={['Pair with a subtle scale or bounce for extra delight', 'Use green color for success convention']}
      />
    </div>
  ),
};
