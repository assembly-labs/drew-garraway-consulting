import type { Meta, StoryObj } from '@storybook/react';
import { ScrollFadeIn, scrollFadeInCode, scrollFadeInCssCode } from './ScrollFadeIn';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof ScrollFadeIn> = {
  title: 'Scroll-Driven/ScrollFadeIn/ScrollFadeIn',
  component: ScrollFadeIn,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'left', 'right', 'none'] },
    distance: { control: { type: 'range', min: 10, max: 100, step: 10 } },
    duration: { control: { type: 'range', min: 0.2, max: 1.5, step: 0.1 } },
    threshold: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    triggerOnce: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollFadeIn>;

export const Default: Story = {
  args: { direction: 'up', distance: 30, triggerOnce: true },
  render: (args) => (
    <DemoContainer title="Scroll Fade In" description="Triggers when entering viewport">
      <ScrollFadeIn {...args}>
        <AnimationBox>Scroll Fade In</AnimationBox>
      </ScrollFadeIn>
    </DemoContainer>
  ),
};

export const FromLeft: Story = {
  args: { direction: 'left', distance: 50 },
  render: (args) => (
    <DemoContainer title="From Left">
      <ScrollFadeIn {...args}>
        <AnimationBox variant="secondary">From Left</AnimationBox>
      </ScrollFadeIn>
    </DemoContainer>
  ),
};

export const StaggeredList: Story = {
  render: () => (
    <DemoContainer title="Staggered Scroll Reveal" minHeight={400}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[0, 1, 2, 3].map((i) => (
          <ScrollFadeIn key={i} delay={i * 0.1}>
            <AnimationBox card size="lg" style={{ width: '300px' }}>
              Item {i + 1}
            </AnimationBox>
          </ScrollFadeIn>
        ))}
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Scroll Fade In">
        <ScrollFadeIn>
          <AnimationBox>Scroll Fade In</AnimationBox>
        </ScrollFadeIn>
      </DemoContainer>
      <CodeBlock code={scrollFadeInCode} alternativeCode={scrollFadeInCssCode} />
      <UsageNotes
        whenToUse={['Content sections', 'Cards and grids', 'Feature lists', 'Any scroll-revealed content']}
        tips={['triggerOnce: true prevents re-animation', 'Stagger delays for lists']}
      />
    </div>
  ),
};
