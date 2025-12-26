import type { Meta, StoryObj } from '@storybook/react';
import { GradientBackground, gradientBackgroundCode, gradientBackgroundCssCode } from './GradientBackground';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof GradientBackground> = {
  title: 'Ambient Backgrounds/Gradient/GradientBackground',
  component: GradientBackground,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'range', min: 5, max: 30, step: 1 },
      description: '⏱️ How long (in seconds) one full animation cycle takes. Lower = faster, higher = slower.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
      },
    },
    colors: {
      control: 'object',
      description: '🎨 Array of color codes for the gradient. Use hex colors like "#ff0000" for red.',
      table: {
        type: { summary: 'string[]' },
        defaultValue: { summary: "['#7c3aed', '#3b82f6', '#06b6d4', '#8b5cf6']" },
      },
    },
    className: {
      control: 'text',
      description: '📝 Optional CSS class name to add custom styles.',
    },
  },
  args: {
    colors: ['#7c3aed', '#3b82f6', '#06b6d4', '#8b5cf6'],
    duration: 10,
  },
};

export default meta;
type Story = StoryObj<typeof GradientBackground>;

export const Default: Story = {
  args: { duration: 10 },
  render: (args) => (
    <DemoContainer title="Gradient Background" description="Smooth animated gradient" showReplay={false} minHeight={300}>
      <GradientBackground {...args} style={{ width: '400px', height: '250px', borderRadius: '12px' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          Animated Gradient
        </h2>
      </GradientBackground>
    </DemoContainer>
  ),
};

export const Sunset: Story = {
  args: {
    colors: ['#f97316', '#ec4899', '#8b5cf6', '#f43f5e'],
    duration: 15,
  },
  render: (args) => (
    <DemoContainer title="Sunset Gradient" showReplay={false} minHeight={300}>
      <GradientBackground {...args} style={{ width: '400px', height: '250px', borderRadius: '12px' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>Sunset</h2>
      </GradientBackground>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Gradient Background" showReplay={false} minHeight={200}>
        <GradientBackground style={{ width: '100%', height: '200px', borderRadius: '12px' }}>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>Gradient</h2>
        </GradientBackground>
      </DemoContainer>
      <CodeBlock code={gradientBackgroundCode} alternativeCode={gradientBackgroundCssCode} />
      <UsageNotes
        whenToUse={['Hero sections', 'Card backgrounds', 'Landing pages', 'Ambient decoration']}
        tips={['Keep duration slow (10-20s) for subtle effect', 'Use complementary colors']}
      />
    </div>
  ),
};
