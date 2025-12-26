import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, spinnerCode, spinnerCssCode } from './Spinner';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback & State/Loading/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 20, max: 80, step: 4 } },
    color: { control: 'color' },
    strokeWidth: { control: { type: 'range', min: 2, max: 6, step: 1 } },
    duration: { control: { type: 'range', min: 0.5, max: 2, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: 40, color: '#8b5cf6' },
  render: (args) => (
    <DemoContainer title="Spinner" description="Classic loading spinner" showReplay={false}>
      <Spinner {...args} />
    </DemoContainer>
  ),
};

export const Sizes: Story = {
  render: () => (
    <DemoContainer title="Spinner Sizes" showReplay={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Spinner size={24} />
        <Spinner size={40} />
        <Spinner size={60} />
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Spinner" showReplay={false}>
        <Spinner />
      </DemoContainer>
      <CodeBlock code={spinnerCode} alternativeCode={spinnerCssCode} />
      <UsageNotes
        whenToUse={['Async operations', 'Data fetching', 'Form submissions', 'Button loading states']}
        tips={['Use appropriate size for context', 'Match color to your theme']}
      />
    </div>
  ),
};
