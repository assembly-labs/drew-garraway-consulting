import type { Meta, StoryObj } from '@storybook/react';
import { FadeInRight, fadeInRightCode, fadeInRightCssCode } from './FadeInRight';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';

const meta: Meta<typeof FadeInRight> = {
  title: 'Entrances & Exits/Fade/FadeInRight',
  component: FadeInRight,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    distance: { control: { type: 'range', min: 5, max: 100, step: 5 } },
  },
};

export default meta;
type Story = StoryObj<typeof FadeInRight>;

export const Default: Story = {
  args: { duration: 0.5, distance: 20 },
  render: (args) => (
    <DemoContainer title="Fade In Right" description="Fade + translate from right">
      <FadeInRight {...args}>
        <AnimationBox>Fade In Right</AnimationBox>
      </FadeInRight>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Fade In Right">
        <FadeInRight>
          <AnimationBox>Fade In Right</AnimationBox>
        </FadeInRight>
      </DemoContainer>
      <CodeBlock code={fadeInRightCode} alternativeCode={fadeInRightCssCode} />
    </div>
  ),
};
