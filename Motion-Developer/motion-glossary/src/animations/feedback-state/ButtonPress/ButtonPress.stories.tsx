import type { Meta, StoryObj } from '@storybook/react';
import { ButtonPress, buttonPressCode, buttonPressCssCode } from './ButtonPress';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof ButtonPress> = {
  title: 'Feedback & State/Button/ButtonPress',
  component: ButtonPress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    scale: { control: { type: 'range', min: 0.85, max: 1, step: 0.01 } },
    duration: { control: { type: 'range', min: 0.05, max: 0.3, step: 0.05 } },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonPress>;

export const Default: Story = {
  args: { scale: 0.95 },
  render: (args) => (
    <DemoContainer title="Button Press" description="Click/tap to see the press effect" showReplay={false}>
      <ButtonPress {...args}>Click Me</ButtonPress>
    </DemoContainer>
  ),
};

export const Subtle: Story = {
  args: { scale: 0.98 },
  render: (args) => (
    <DemoContainer title="Subtle Press" description="Minimal scale for professional UIs" showReplay={false}>
      <ButtonPress {...args}>Subtle Press</ButtonPress>
    </DemoContainer>
  ),
};

export const Deep: Story = {
  args: { scale: 0.9 },
  render: (args) => (
    <DemoContainer title="Deep Press" description="More pronounced for playful UIs" showReplay={false}>
      <ButtonPress {...args}>Deep Press</ButtonPress>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Button Press" showReplay={false}>
        <ButtonPress>Click Me</ButtonPress>
      </DemoContainer>
      <CodeBlock code={buttonPressCode} alternativeCode={buttonPressCssCode} />
      <UsageNotes
        whenToUse={['Primary action buttons', 'Submit buttons', 'Any clickable element needing feedback']}
        tips={[
          'Scale of 0.95-0.98 feels natural',
          'Keep duration under 150ms for snappy feel',
          'Combine with box-shadow reduction',
        ]}
        accessibility={['Provides visual feedback for clicks', 'Works with keyboard activation']}
      />
    </div>
  ),
};
