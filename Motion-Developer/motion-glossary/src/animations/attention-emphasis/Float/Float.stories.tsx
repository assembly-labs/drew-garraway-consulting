import type { Meta, StoryObj } from '@storybook/react';
import { Float, floatCode, floatCssCode } from './Float';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';

const meta: Meta<typeof Float> = {
  title: 'Attention & Emphasis/Float/Float',
  component: Float,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    distance: { control: { type: 'range', min: 5, max: 30, step: 1 } },
    duration: { control: { type: 'range', min: 1, max: 6, step: 0.5 } },
  },
};

export default meta;
type Story = StoryObj<typeof Float>;

export const Default: Story = {
  args: { distance: 10, duration: 3 },
  render: (args) => (
    <DemoContainer title="Float" description="Gentle floating motion" showReplay={false}>
      <Float {...args}>
        <AnimationBox>Float</AnimationBox>
      </Float>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Float" showReplay={false}>
        <Float>
          <AnimationBox>Float</AnimationBox>
        </Float>
      </DemoContainer>
      <CodeBlock code={floatCode} alternativeCode={floatCssCode} />
    </div>
  ),
};
