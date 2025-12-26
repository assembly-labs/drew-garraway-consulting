import type { Meta, StoryObj } from '@storybook/react';
import { FadeInUp, fadeInUpCode, fadeInUpCssCode } from './FadeInUp';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof FadeInUp> = {
  title: 'Entrances & Exits/Fade/FadeInUp',
  component: FadeInUp,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Element fades in while translating upward. Great for revealing content as users scroll or for staggered list entrances.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
    },
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
    },
    distance: {
      control: { type: 'range', min: 5, max: 100, step: 5 },
      description: 'Distance to travel in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FadeInUp>;

export const Default: Story = {
  args: {
    duration: 0.5,
    delay: 0,
    distance: 20,
  },
  render: (args) => (
    <DemoContainer title="Fade In Up" description="Fade + translate from below">
      <FadeInUp {...args}>
        <AnimationBox>Fade In Up</AnimationBox>
      </FadeInUp>
    </DemoContainer>
  ),
};

export const LargeDistance: Story = {
  args: {
    duration: 0.6,
    distance: 50,
  },
  render: (args) => (
    <DemoContainer title="Large Distance" description="More dramatic entrance from further below">
      <FadeInUp {...args}>
        <AnimationBox variant="secondary">50px</AnimationBox>
      </FadeInUp>
    </DemoContainer>
  ),
};

export const Staggered: Story = {
  render: () => (
    <DemoContainer title="Staggered Items" description="Multiple items with increasing delays">
      <div style={{ display: 'flex', gap: '16px' }}>
        {[0, 1, 2, 3].map((i) => (
          <FadeInUp key={i} delay={i * 0.1} distance={30}>
            <AnimationBox size="sm" variant={i % 2 === 0 ? 'primary' : 'secondary'}>
              {i + 1}
            </AnimationBox>
          </FadeInUp>
        ))}
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Fade In Up" description="The most common entrance animation">
        <FadeInUp>
          <AnimationBox>Fade In Up</AnimationBox>
        </FadeInUp>
      </DemoContainer>

      <CodeBlock
        code={fadeInUpCode}
        language="tsx"
        title="Implementation"
        alternativeCode={fadeInUpCssCode}
      />

      <UsageNotes
        whenToUse={[
          'Content revealing on scroll',
          'Staggered list entrances',
          'Card grid reveals',
          'Hero content on page load',
          'Modal content appearing',
        ]}
        whenNotToUse={[
          'When content comes from a specific direction contextually',
          'Very small or inline elements',
          'Rapid, repeated animations',
        ]}
        tips={[
          'Keep distance between 15-30px for subtle effect',
          'Use 40-60px for more dramatic reveals',
          'Stagger delays by 50-100ms for lists',
        ]}
      />
    </div>
  ),
};
