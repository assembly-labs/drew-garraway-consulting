import type { Meta, StoryObj } from '@storybook/react';
import { TextReveal, textRevealCode, textRevealCssCode } from './TextReveal';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof TextReveal> = {
  title: 'Text & Typography/TextReveal/TextReveal',
  component: TextReveal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
    mode: { control: 'select', options: ['characters', 'words', 'lines'] },
    staggerDelay: { control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 } },
    duration: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
  },
};

export default meta;
type Story = StoryObj<typeof TextReveal>;

export const Words: Story = {
  args: { text: 'Reveal each word with style', mode: 'words' },
  render: (args) => (
    <DemoContainer title="Word by Word" description="Each word animates in sequence">
      <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fafafa' }}>
        <TextReveal {...args} />
      </div>
    </DemoContainer>
  ),
};

export const Characters: Story = {
  args: { text: 'Character reveal', mode: 'characters', staggerDelay: 0.03 },
  render: (args) => (
    <DemoContainer title="Character by Character">
      <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fafafa' }}>
        <TextReveal {...args} />
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Text Reveal">
        <div style={{ fontSize: '2rem', fontWeight: 600, color: '#fafafa' }}>
          <TextReveal text="Animate your headlines" />
        </div>
      </DemoContainer>
      <CodeBlock code={textRevealCode} alternativeCode={textRevealCssCode} />
      <UsageNotes
        whenToUse={['Hero headlines', 'Section titles', 'Impactful statements', 'Scroll-triggered reveals']}
        tips={['Words mode is most readable', 'Characters mode for dramatic effect']}
      />
    </div>
  ),
};
