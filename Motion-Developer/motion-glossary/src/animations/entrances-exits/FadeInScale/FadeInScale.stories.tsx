import type { Meta, StoryObj } from '@storybook/react';
import { FadeInScale, fadeInScaleCode, fadeInScaleCssCode } from './FadeInScale';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof FadeInScale> = {
  title: 'Entrances & Exits/Fade/FadeInScale',
  component: FadeInScale,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    initialScale: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
  },
};

export default meta;
type Story = StoryObj<typeof FadeInScale>;

export const Default: Story = {
  args: { duration: 0.5, initialScale: 0.8 },
  render: (args) => (
    <DemoContainer title="Fade In Scale" description="Fade + scale from smaller size">
      <FadeInScale {...args}>
        <AnimationBox>Fade In Scale</AnimationBox>
      </FadeInScale>
    </DemoContainer>
  ),
};

export const FromSmall: Story = {
  args: { initialScale: 0.5 },
  render: (args) => (
    <DemoContainer title="From Small" description="More dramatic scale from 50%">
      <FadeInScale {...args}>
        <AnimationBox variant="gradient">50%</AnimationBox>
      </FadeInScale>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Fade In Scale">
        <FadeInScale>
          <AnimationBox>Fade In Scale</AnimationBox>
        </FadeInScale>
      </DemoContainer>
      <CodeBlock code={fadeInScaleCode} alternativeCode={fadeInScaleCssCode} />
      <UsageNotes
        whenToUse={['Modal dialogs', 'Image reveals', 'Card appearances', 'Emphasis elements']}
        tips={['Keep initialScale between 0.8-0.95 for subtle effect', 'Use 0.5-0.7 for more dramatic reveals']}
      />
    </div>
  ),
};
