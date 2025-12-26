import type { Meta, StoryObj } from '@storybook/react';
import { PopIn, popInCode, popInCssCode } from './PopIn';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof PopIn> = {
  title: 'Entrances & Exits/Scale/PopIn',
  component: PopIn,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof PopIn>;

export const Default: Story = {
  render: (args) => (
    <DemoContainer title="Pop In" description="Bouncy scale with overshoot">
      <PopIn {...args}>
        <AnimationBox variant="gradient">Pop!</AnimationBox>
      </PopIn>
    </DemoContainer>
  ),
};

export const Staggered: Story = {
  render: () => (
    <DemoContainer title="Staggered Pop" description="Multiple items popping in sequence">
      <div style={{ display: 'flex', gap: '16px' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <PopIn key={i} delay={i * 0.1}>
            <AnimationBox size="sm" variant={i % 2 === 0 ? 'primary' : 'gradient'}>
              {i + 1}
            </AnimationBox>
          </PopIn>
        ))}
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Pop In">
        <PopIn>
          <AnimationBox variant="gradient">Pop!</AnimationBox>
        </PopIn>
      </DemoContainer>
      <CodeBlock code={popInCode} alternativeCode={popInCssCode} />
      <UsageNotes
        whenToUse={['Celebration moments', 'Achievement badges', 'Emoji reactions', 'Playful UI elements', 'Notification bubbles']}
        whenNotToUse={['Professional/corporate UIs', 'Frequent repeated animations', 'Accessibility-critical contexts']}
        tips={['Great for one-time celebrations', 'Combine with confetti for extra delight']}
      />
    </div>
  ),
};
