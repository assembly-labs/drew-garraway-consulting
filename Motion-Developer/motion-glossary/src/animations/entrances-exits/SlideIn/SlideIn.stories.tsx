import type { Meta, StoryObj } from '@storybook/react';
import { SlideIn, slideInCode, slideInCssCode } from './SlideIn';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof SlideIn> = {
  title: 'Entrances & Exits/Slide/SlideIn',
  component: SlideIn,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Slides content in from any edge. Perfect for sidebars, menus, and drawers.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right', 'up', 'down'],
      description: '🧭 Which edge the element slides from. Match to where content "lives" (sidebar = left/right).',
      table: {
        type: { summary: "'left' | 'right' | 'up' | 'down'" },
        defaultValue: { summary: "'left'" },
      },
    },
    duration: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: '⏱️ Animation length in seconds. 0.3-0.5s feels natural for most UI.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0.5' },
      },
    },
    delay: {
      control: { type: 'range', min: 0, max: 2, step: 0.1 },
      description: '⏳ Wait time before animation starts. Use to sequence multiple elements.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    distance: {
      control: { type: 'range', min: 20, max: 300, step: 10 },
      description: '📏 How far (in pixels) the element travels. 50-100px is typical. Higher = more dramatic.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    fade: {
      control: 'boolean',
      description: '👁️ Also fade in while sliding? ON = slide + fade together. OFF = slide only.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  args: {
    direction: 'left',
    duration: 0.5,
    delay: 0,
    distance: 100,
    fade: true,
  },
};

export default meta;
type Story = StoryObj<typeof SlideIn>;

export const Left: Story = {
  args: { direction: 'left', distance: 100 },
  render: (args) => (
    <DemoContainer title="Slide In Left">
      <SlideIn {...args}>
        <AnimationBox>From Left</AnimationBox>
      </SlideIn>
    </DemoContainer>
  ),
};

export const Right: Story = {
  args: { direction: 'right', distance: 100 },
  render: (args) => (
    <DemoContainer title="Slide In Right">
      <SlideIn {...args}>
        <AnimationBox variant="secondary">From Right</AnimationBox>
      </SlideIn>
    </DemoContainer>
  ),
};

export const Up: Story = {
  args: { direction: 'up', distance: 100 },
  render: (args) => (
    <DemoContainer title="Slide In Up">
      <SlideIn {...args}>
        <AnimationBox variant="gradient">From Below</AnimationBox>
      </SlideIn>
    </DemoContainer>
  ),
};

export const Down: Story = {
  args: { direction: 'down', distance: 100 },
  render: (args) => (
    <DemoContainer title="Slide In Down">
      <SlideIn {...args}>
        <AnimationBox>From Above</AnimationBox>
      </SlideIn>
    </DemoContainer>
  ),
};

export const AllDirections: Story = {
  render: () => (
    <DemoContainer title="All Directions" minHeight={400}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
        <SlideIn direction="left" delay={0}>
          <AnimationBox size="sm">Left</AnimationBox>
        </SlideIn>
        <SlideIn direction="right" delay={0.1}>
          <AnimationBox size="sm" variant="secondary">Right</AnimationBox>
        </SlideIn>
        <SlideIn direction="up" delay={0.2}>
          <AnimationBox size="sm" variant="gradient">Up</AnimationBox>
        </SlideIn>
        <SlideIn direction="down" delay={0.3}>
          <AnimationBox size="sm">Down</AnimationBox>
        </SlideIn>
      </div>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Slide In">
        <SlideIn direction="left">
          <AnimationBox>Slide In</AnimationBox>
        </SlideIn>
      </DemoContainer>
      <CodeBlock code={slideInCode} alternativeCode={slideInCssCode} />
      <UsageNotes
        whenToUse={['Sidebars and drawers', 'Page transitions', 'Card carousels', 'Navigation menus']}
        tips={['Match direction to content origin', 'Use longer distances for dramatic effect']}
      />
    </div>
  ),
};
