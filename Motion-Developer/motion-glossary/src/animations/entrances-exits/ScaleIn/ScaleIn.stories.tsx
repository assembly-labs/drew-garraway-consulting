import type { Meta, StoryObj } from '@storybook/react';
import { ScaleIn, scaleInCode, scaleInCssCode } from './ScaleIn';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof ScaleIn> = {
  title: 'Entrances & Exits/Scale/ScaleIn',
  component: ScaleIn,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    initialScale: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    spring: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ScaleIn>;

export const Default: Story = {
  args: { duration: 0.4, initialScale: 0 },
  render: (args) => (
    <DemoContainer title="Scale In" description="Element scales from 0 to 1">
      <ScaleIn {...args}>
        <AnimationBox>Scale In</AnimationBox>
      </ScaleIn>
    </DemoContainer>
  ),
};

export const Spring: Story = {
  args: { spring: true },
  render: (args) => (
    <DemoContainer title="Spring Scale In" description="Physics-based spring animation">
      <ScaleIn {...args}>
        <AnimationBox variant="secondary">Spring</AnimationBox>
      </ScaleIn>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Scale In">
        <ScaleIn>
          <AnimationBox>Scale In</AnimationBox>
        </ScaleIn>
      </DemoContainer>
      <CodeBlock code={scaleInCode} alternativeCode={scaleInCssCode} />
      <UsageNotes
        whenToUse={['Buttons appearing', 'Icons popping in', 'Badges and notifications', 'Playful UI elements']}
        tips={['Add slight overshoot for more natural feel', 'Use spring for bouncy effect']}
      />
    </div>
  ),
};
