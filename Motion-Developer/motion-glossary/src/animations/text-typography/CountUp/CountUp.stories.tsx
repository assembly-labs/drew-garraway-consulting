import type { Meta, StoryObj } from '@storybook/react';
import { CountUp, countUpCode, countUpCssCode } from './CountUp';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof CountUp> = {
  title: 'Text & Typography/CountUp/CountUp',
  component: CountUp,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    end: { control: 'number' },
    start: { control: 'number' },
    duration: { control: { type: 'range', min: 0.5, max: 5, step: 0.5 } },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    decimals: { control: { type: 'range', min: 0, max: 4, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof CountUp>;

export const Default: Story = {
  args: { end: 1000, duration: 2 },
  render: (args) => (
    <DemoContainer title="Count Up" description="Numbers animate from 0 to target">
      <div style={{ fontSize: '4rem', fontWeight: 700, color: '#fafafa' }}>
        <CountUp {...args} />
      </div>
    </DemoContainer>
  ),
};

export const Currency: Story = {
  args: { end: 99999, prefix: '$', separator: ',', duration: 2.5 },
  render: (args) => (
    <DemoContainer title="Currency" description="With dollar prefix">
      <div style={{ fontSize: '3rem', fontWeight: 700, color: '#22c55e' }}>
        <CountUp {...args} />
      </div>
    </DemoContainer>
  ),
};

export const Percentage: Story = {
  args: { end: 98.5, suffix: '%', decimals: 1 },
  render: (args) => (
    <DemoContainer title="Percentage" description="With decimals and suffix">
      <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fafafa' }}>
        <CountUp {...args} />
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Count Up">
        <div style={{ fontSize: '4rem', fontWeight: 700, color: '#fafafa' }}>
          <CountUp end={10000} prefix="$" />
        </div>
      </DemoContainer>
      <CodeBlock code={countUpCode} alternativeCode={countUpCssCode} />
      <UsageNotes
        whenToUse={['Statistics displays', 'Dashboard metrics', 'Achievement numbers', 'Pricing pages']}
        tips={['Trigger on scroll into view', '2-3 seconds feels natural']}
      />
    </div>
  ),
};
