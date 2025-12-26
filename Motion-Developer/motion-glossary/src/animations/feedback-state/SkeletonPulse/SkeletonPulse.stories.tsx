import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonPulse, skeletonPulseCode, skeletonPulseCssCode } from './SkeletonPulse';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof SkeletonPulse> = {
  title: 'Feedback & State/Loading/SkeletonPulse',
  component: SkeletonPulse,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonPulse>;

export const Default: Story = {
  args: { width: 200, height: 20 },
  render: (args) => (
    <DemoContainer title="Skeleton Pulse" description="Pulsing placeholder" showReplay={false}>
      <SkeletonPulse {...args} />
    </DemoContainer>
  ),
};

export const CardSkeleton: Story = {
  render: () => (
    <DemoContainer title="Card Skeleton" description="Skeleton layout for a card" showReplay={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px', padding: '16px', background: '#171717', borderRadius: '12px' }}>
        <SkeletonPulse width="100%" height={140} borderRadius={8} />
        <SkeletonPulse width="70%" height={20} />
        <SkeletonPulse width="100%" height={14} />
        <SkeletonPulse width="90%" height={14} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <SkeletonPulse width={80} height={32} borderRadius={16} />
          <SkeletonPulse width={80} height={32} borderRadius={16} />
        </div>
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Skeleton Pulse" showReplay={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
          <SkeletonPulse height={20} />
          <SkeletonPulse width="80%" height={16} />
          <SkeletonPulse width="60%" height={16} />
        </div>
      </DemoContainer>
      <CodeBlock code={skeletonPulseCode} alternativeCode={skeletonPulseCssCode} />
      <UsageNotes
        whenToUse={['Content loading placeholders', 'Image loading states', 'List item placeholders']}
        tips={['Match skeleton dimensions to actual content', 'Use multiple skeletons to show layout']}
      />
    </div>
  ),
};
