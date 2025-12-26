import type { Preview } from '@storybook/react';
import theme from './theme';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#fafafa' },
        { name: 'neutral', value: '#171717' },
      ],
    },
    docs: {
      theme,
    },
    darkMode: {
      dark: theme,
      light: theme,
      current: 'dark',
      stylePreview: true,
    },
    layout: 'centered',
  },
  globalTypes: {
    reducedMotion: {
      name: 'Reduced Motion',
      description: 'Simulate prefers-reduced-motion',
      defaultValue: 'no-preference',
      toolbar: {
        icon: 'accessibility',
        items: [
          { value: 'no-preference', title: 'No Preference' },
          { value: 'reduce', title: 'Reduce Motion' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
