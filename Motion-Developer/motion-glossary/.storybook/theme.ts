import { create } from '@storybook/theming';

export default create({
  base: 'dark',

  // Brand
  brandTitle: 'Motion Glossary',
  brandUrl: '/',
  brandTarget: '_self',

  // UI Colors
  colorPrimary: '#7c3aed',
  colorSecondary: '#8b5cf6',

  // UI
  appBg: '#0f0f0f',
  appContentBg: '#171717',
  appPreviewBg: '#0a0a0a',
  appBorderColor: '#2e2e2e',
  appBorderRadius: 8,

  // Text colors
  textColor: '#fafafa',
  textInverseColor: '#0a0a0a',
  textMutedColor: '#a3a3a3',

  // Toolbar default and active colors
  barTextColor: '#a3a3a3',
  barSelectedColor: '#8b5cf6',
  barHoverColor: '#c4b5fd',
  barBg: '#171717',

  // Form colors
  inputBg: '#262626',
  inputBorder: '#404040',
  inputTextColor: '#fafafa',
  inputBorderRadius: 6,

  // Button colors
  buttonBg: '#7c3aed',
  buttonBorder: '#7c3aed',

  // Boolean (toggle)
  booleanBg: '#262626',
  booleanSelectedBg: '#7c3aed',

  // Typography
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',
});
