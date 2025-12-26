import type { Meta, StoryObj } from '@storybook/react';
import { FadeInLeft, fadeInLeftCode, fadeInLeftCssCode } from './FadeInLeft';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof FadeInLeft> = {
  title: 'Entrances & Exits/Fade/FadeInLeft',
  component: FadeInLeft,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    distance: { control: { type: 'range', min: 5, max: 100, step: 5 } },
  },
};

export default meta;
type Story = StoryObj<typeof FadeInLeft>;

export const Default: Story = {
  args: { duration: 0.5, distance: 20 },
  render: (args) => (
    <DemoContainer title="Fade In Left" description="Fade + translate from left">
      <FadeInLeft {...args}>
        <AnimationBox>Fade In Left</AnimationBox>
      </FadeInLeft>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Fade In Left">
        <FadeInLeft>
          <AnimationBox>Fade In Left</AnimationBox>
        </FadeInLeft>
      </DemoContainer>
      <CodeBlock code={fadeInLeftCode} alternativeCode={fadeInLeftCssCode} />
      <UsageNotes
        whenToUse={['Sidebar content', 'Navigation appearing', 'Left-aligned content reveals', 'Reading direction flow (LTR)']}
      />
    </div>
  ),
};
