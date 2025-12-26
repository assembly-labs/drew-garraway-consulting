import type { Meta, StoryObj } from '@storybook/react';
import { AnimationGallery } from '../components/AnimationGallery';

/**
 * # Animation Gallery
 *
 * Browse all 27 animations organized by category.
 * Use the search bar to find animations by name or keyword.
 * Click any card to open the Editing Booth.
 */
const meta: Meta<typeof AnimationGallery> = {
  title: 'Animation Gallery',
  component: AnimationGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: null,
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimationGallery>;

/**
 * Browse all animations. Search and filter to find what you need.
 */
export const Browse: Story = {
  render: () => (
    <AnimationGallery
      onSelectAnimation={(animation) => {
        // In a real implementation, this would navigate to the booth
        console.log('Selected animation:', animation.id);
        alert(`Would navigate to: Editing Booth / ${animation.name}\n\nNote: Navigation between stories is not yet implemented.`);
      }}
    />
  ),
};
