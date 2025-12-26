import type { Meta, StoryObj } from '@storybook/react';
import { StaggeredChildren, staggeredCode, staggeredCssCode } from './StaggeredChildren';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof StaggeredChildren> = {
  title: 'Entrances & Exits/Staggered/StaggeredChildren',
  component: StaggeredChildren,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Makes a list of items appear one after another (like dominoes). Great for menus, card grids, and any repeated content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    staggerDelay: {
      control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 },
      description: '🎯 Gap (in seconds) between each item starting. 0.1 = item 2 starts 0.1s after item 1.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0.1' },
      },
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
      description: '⏱️ How long each individual item takes to animate in.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0.4' },
      },
    },
    distance: {
      control: { type: 'range', min: 10, max: 50, step: 5 },
      description: '📏 How far (in pixels) each item travels upward while fading in.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '20' },
      },
    },
  },
  args: {
    staggerDelay: 0.1,
    duration: 0.4,
    distance: 20,
  },
};

export default meta;
type Story = StoryObj<typeof StaggeredChildren>;

export const Default: Story = {
  args: { staggerDelay: 0.1, duration: 0.4, distance: 20 },
  render: (args) => (
    <DemoContainer title="Staggered Children" description="Items appear one after another">
      <StaggeredChildren {...args} style={{ display: 'flex', gap: '16px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <AnimationBox key={i} size="sm" variant={i % 2 === 0 ? 'secondary' : 'primary'}>
            {i}
          </AnimationBox>
        ))}
      </StaggeredChildren>
    </DemoContainer>
  ),
};

export const ListItems: Story = {
  args: { staggerDelay: 0.08 },
  render: (args) => (
    <DemoContainer title="Staggered List" description="Great for menu items or lists">
      <StaggeredChildren {...args} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '200px' }}>
        {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
          <div
            key={item}
            style={{
              padding: '12px 16px',
              background: '#262626',
              borderRadius: '8px',
              color: '#fafafa',
            }}
          >
            {item}
          </div>
        ))}
      </StaggeredChildren>
    </DemoContainer>
  ),
};

export const CardGrid: Story = {
  args: { staggerDelay: 0.1, distance: 30 },
  render: (args) => (
    <DemoContainer title="Card Grid" description="Staggered grid reveal" minHeight={350}>
      <StaggeredChildren
        {...args}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <AnimationBox key={i} card size="lg">
            Card {i}
          </AnimationBox>
        ))}
      </StaggeredChildren>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Staggered Children">
        <StaggeredChildren style={{ display: 'flex', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <AnimationBox key={i} size="sm">{i}</AnimationBox>
          ))}
        </StaggeredChildren>
      </DemoContainer>
      <CodeBlock code={staggeredCode} alternativeCode={staggeredCssCode} />
      <UsageNotes
        whenToUse={['Lists and grids', 'Navigation menus', 'Card layouts', 'Any repeated content']}
        tips={[
          'Keep stagger delay between 50-150ms',
          'Shorter delays for many items, longer for few',
          'Use with scroll-triggered reveals',
        ]}
        performance={['Framer Motion handles orchestration efficiently', 'Consider virtualization for very long lists']}
      />
    </div>
  ),
};
