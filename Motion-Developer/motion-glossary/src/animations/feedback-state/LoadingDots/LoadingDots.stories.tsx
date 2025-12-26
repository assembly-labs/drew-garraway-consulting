import type { Meta, StoryObj } from '@storybook/react';
import { LoadingDots, loadingDotsCode, loadingDotsCssCode } from './LoadingDots';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof LoadingDots> = {
  title: 'Feedback & State/Loading/LoadingDots',
  component: LoadingDots,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 4, max: 16, step: 2 } },
    color: { control: 'color' },
    gap: { control: { type: 'range', min: 2, max: 12, step: 2 } },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingDots>;

export const Default: Story = {
  render: (args) => (
    <DemoContainer title="Loading Dots" description="Typing indicator style" showReplay={false}>
      <LoadingDots {...args} />
    </DemoContainer>
  ),
};

export const InButton: Story = {
  render: () => (
    <DemoContainer title="In Button" showReplay={false}>
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 24px',
        background: '#7c3aed',
        border: 'none',
        borderRadius: '8px',
        color: 'white',
        fontSize: '1rem',
        cursor: 'wait',
      }}>
        Loading <LoadingDots size={6} color="white" />
      </button>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Loading Dots" showReplay={false}>
        <LoadingDots />
      </DemoContainer>
      <CodeBlock code={loadingDotsCode} alternativeCode={loadingDotsCssCode} />
      <UsageNotes
        whenToUse={['Typing indicators', 'Inline loading states', 'Chat applications', 'Compact loading areas']}
      />
    </div>
  ),
};
