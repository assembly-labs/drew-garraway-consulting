import type { Meta, StoryObj } from '@storybook/react';
import { ButtonRipple, buttonRippleCode, buttonRippleCssCode } from './ButtonRipple';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof ButtonRipple> = {
  title: 'Feedback & State/Button/ButtonRipple',
  component: ButtonRipple,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    rippleColor: { control: 'color' },
    duration: { control: { type: 'range', min: 0.3, max: 1, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonRipple>;

export const Default: Story = {
  render: (args) => (
    <DemoContainer title="Button Ripple" description="Click anywhere on the button" showReplay={false}>
      <ButtonRipple {...args}>Click Me</ButtonRipple>
    </DemoContainer>
  ),
};

export const CustomColor: Story = {
  args: { rippleColor: 'rgba(124, 58, 237, 0.5)' },
  render: (args) => (
    <DemoContainer title="Custom Ripple Color" showReplay={false}>
      <ButtonRipple {...args}>Purple Ripple</ButtonRipple>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Button Ripple" showReplay={false}>
        <ButtonRipple>Click Me</ButtonRipple>
      </DemoContainer>
      <CodeBlock code={buttonRippleCode} alternativeCode={buttonRippleCssCode} />
      <UsageNotes
        whenToUse={['Material Design UIs', 'Touch-friendly interfaces', 'When precise click location matters']}
        tips={['Ripple emanates from click point', 'Adjust color to complement button']}
      />
    </div>
  ),
};
