import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleSwitch, toggleSwitchCode, toggleSwitchCssCode } from './ToggleSwitch';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'Feedback & State/Toggle/ToggleSwitch',
  component: ToggleSwitch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    activeColor: { control: 'color' },
    checked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

const InteractiveToggle = (args: any) => {
  const [checked, setChecked] = useState(args.checked ?? false);
  return <ToggleSwitch {...args} checked={checked} onChange={setChecked} />;
};

export const Default: Story = {
  render: (args) => (
    <DemoContainer title="Toggle Switch" description="Click to toggle" showReplay={false}>
      <InteractiveToggle {...args} />
    </DemoContainer>
  ),
};

export const Sizes: Story = {
  render: () => (
    <DemoContainer title="Toggle Sizes" showReplay={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <InteractiveToggle size="sm" />
        <InteractiveToggle size="md" />
        <InteractiveToggle size="lg" />
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Toggle Switch" showReplay={false}>
        <InteractiveToggle />
      </DemoContainer>
      <CodeBlock code={toggleSwitchCode} alternativeCode={toggleSwitchCssCode} />
      <UsageNotes
        whenToUse={['Boolean settings', 'Feature toggles', 'Dark mode switches', 'Any on/off state']}
        tips={['Spring animation feels more natural', 'Use consistent size throughout app']}
        accessibility={['Use role="switch" and aria-checked', 'Ensure keyboard accessibility']}
      />
    </div>
  ),
};
