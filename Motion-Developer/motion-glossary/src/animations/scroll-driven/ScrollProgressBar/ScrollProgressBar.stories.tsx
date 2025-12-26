import type { Meta, StoryObj } from '@storybook/react';
import { ScrollProgressBar, scrollProgressBarCode, scrollProgressBarCssCode } from './ScrollProgressBar';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof ScrollProgressBar> = {
  title: 'Scroll-Driven/Progress/ScrollProgressBar',
  component: ScrollProgressBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'color' },
    height: { control: { type: 'range', min: 2, max: 10, step: 1 } },
    position: { control: 'select', options: ['top', 'bottom'] },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollProgressBar>;

export const Default: Story = {
  args: { color: '#8b5cf6', height: 4 },
  render: (args) => (
    <div style={{ minHeight: '200vh', padding: '20px' }}>
      <ScrollProgressBar {...args} />
      <DemoContainer title="Scroll Progress Bar" description="Scroll the page to see progress" showReplay={false}>
        <p style={{ color: '#a3a3a3', textAlign: 'center' }}>
          Scroll this story to see the progress bar at the top.
          <br />
          The bar shows how much of the page you've scrolled.
        </p>
      </DemoContainer>
      <div style={{ marginTop: '100vh', textAlign: 'center', color: '#a3a3a3' }}>
        Bottom of page
      </div>
    </div>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px', padding: '20px' }}>
      <DemoContainer title="Scroll Progress Bar" showReplay={false}>
        <p style={{ color: '#a3a3a3', textAlign: 'center' }}>
          Progress bar appears at top of page when scrolling.
        </p>
      </DemoContainer>
      <CodeBlock code={scrollProgressBarCode} alternativeCode={scrollProgressBarCssCode} />
      <UsageNotes
        whenToUse={['Long-form articles', 'Documentation pages', 'Reading progress indication']}
        tips={['Use spring for smooth feel', 'Match color to brand']}
      />
    </div>
  ),
};
