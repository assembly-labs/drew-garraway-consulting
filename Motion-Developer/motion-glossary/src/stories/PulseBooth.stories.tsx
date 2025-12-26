import type { Meta, StoryObj } from '@storybook/react';
import { EditingBooth } from '../components/EditingBooth';
import { pulseEntry } from '../registry';

/**
 * # Pulse - Editing Booth
 *
 * The unified editing experience for the Pulse animation.
 * Adjust controls to see live changes and copy the generated code.
 */
const meta: Meta<typeof EditingBooth> = {
  title: 'Editing Booth/Pulse',
  component: EditingBooth,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: null, // Disable docs page - the EditingBooth IS the documentation
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditingBooth>;

/**
 * The Pulse editing booth - adjust controls, see live preview, copy code.
 */
export const Booth: Story = {
  render: () => <EditingBooth animation={pulseEntry} />,
};
