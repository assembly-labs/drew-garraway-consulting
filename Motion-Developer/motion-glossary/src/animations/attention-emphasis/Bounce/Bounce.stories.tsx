import type { Meta, StoryObj } from '@storybook/react';
import { Bounce, bounceCode, bounceCssCode } from './Bounce';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';

const meta: Meta<typeof Bounce> = {
  title: 'Attention & Emphasis/Bounce/Bounce',
  component: Bounce,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    height: { control: { type: 'range', min: 5, max: 40, step: 5 } },
    duration: { control: { type: 'range', min: 0.3, max: 1.5, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Bounce>;

export const Default: Story = {
  args: { height: 15, duration: 0.6 },
  render: (args) => (
    <DemoContainer title="Bounce" description="Vertical bouncing" showReplay={false}>
      <Bounce {...args}>
        <AnimationBox>Bounce</AnimationBox>
      </Bounce>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Bounce" showReplay={false}>
        <Bounce>
          <AnimationBox>Bounce</AnimationBox>
        </Bounce>
      </DemoContainer>
      <CodeBlock code={bounceCode} alternativeCode={bounceCssCode} />
    </div>
  ),
};
