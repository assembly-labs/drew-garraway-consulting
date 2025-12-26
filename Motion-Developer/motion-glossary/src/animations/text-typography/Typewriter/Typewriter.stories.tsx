import type { Meta, StoryObj } from '@storybook/react';
import { Typewriter, typewriterCode, typewriterCssCode } from './Typewriter';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof Typewriter> = {
  title: 'Text & Typography/Typewriter/Typewriter',
  component: Typewriter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    speed: { control: { type: 'range', min: 20, max: 150, step: 10 } },
    delay: { control: { type: 'range', min: 0, max: 2000, step: 100 } },
    cursor: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Typewriter>;

export const Default: Story = {
  args: { text: 'Hello, World!', speed: 50, cursor: true },
  render: (args) => (
    <DemoContainer title="Typewriter" description="Character by character reveal">
      <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fafafa' }}>
        <Typewriter {...args} />
      </div>
    </DemoContainer>
  ),
};

export const Slow: Story = {
  args: { text: 'Typing slowly...', speed: 150 },
  render: (args) => (
    <DemoContainer title="Slow Typewriter">
      <div style={{ fontSize: '1.5rem', color: '#fafafa' }}>
        <Typewriter {...args} />
      </div>
    </DemoContainer>
  ),
};

export const NoCursor: Story = {
  args: { text: 'No cursor here', cursor: false },
  render: (args) => (
    <DemoContainer title="Without Cursor">
      <div style={{ fontSize: '1.5rem', color: '#fafafa' }}>
        <Typewriter {...args} />
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Typewriter">
        <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fafafa' }}>
          <Typewriter text="Motion Glossary" />
        </div>
      </DemoContainer>
      <CodeBlock code={typewriterCode} alternativeCode={typewriterCssCode} />
      <UsageNotes
        whenToUse={['Hero headlines', 'Terminal/code demos', 'Chat interfaces', 'Dramatic reveals']}
        tips={['50-80ms per character feels natural', 'Add delay before starting for impact']}
      />
    </div>
  ),
};
