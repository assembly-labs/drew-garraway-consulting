import type { Meta, StoryObj } from '@storybook/react';
import { FadeInDown, fadeInDownCode, fadeInDownCssCode } from './FadeInDown';
import { AnimationBox } from '../../../components/AnimationBox';
import { DemoContainer } from '../../../components/DemoContainer';
import { CodeBlock } from '../../../components/CodeBlock';
import { UsageNotes } from '../../../components/UsageNotes';

const meta: Meta<typeof FadeInDown> = {
  title: 'Entrances & Exits/Fade/FadeInDown',
  component: FadeInDown,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    delay: { control: { type: 'range', min: 0, max: 2, step: 0.1 } },
    distance: { control: { type: 'range', min: 5, max: 100, step: 5 } },
  },
};

export default meta;
type Story = StoryObj<typeof FadeInDown>;

export const Default: Story = {
  args: { duration: 0.5, delay: 0, distance: 20 },
  render: (args) => (
    <DemoContainer title="Fade In Down" description="Fade + translate from above">
      <FadeInDown {...args}>
        <AnimationBox>Fade In Down</AnimationBox>
      </FadeInDown>
    </DemoContainer>
  ),
};

export const WithCode: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '800px' }}>
      <DemoContainer title="Fade In Down">
        <FadeInDown>
          <AnimationBox>Fade In Down</AnimationBox>
        </FadeInDown>
      </DemoContainer>
      <CodeBlock code={fadeInDownCode} alternativeCode={fadeInDownCssCode} />
      <UsageNotes
        whenToUse={['Dropdown menus', 'Notification toasts from top', 'Header elements', 'Elements dropping into place']}
        whenNotToUse={['Content below the fold', 'When scroll direction is down']}
      />
    </div>
  ),
};
