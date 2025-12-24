# Storybook Configuration Guide

> **Status:** Template — Configure during 04-Development phase

This guide covers setting up Storybook as the component documentation and development environment.

---

## Purpose

Storybook serves as:
- **Component catalog:** Browse all components and their variants
- **Development environment:** Build components in isolation
- **Documentation:** Usage examples and API reference
- **Testing environment:** Visual regression, accessibility, interaction testing

---

## Initial Setup

### Installation

```bash
# Run from project root
npx storybook@latest init

# Or if using pnpm
pnpm dlx storybook@latest init
```

### Recommended Addons

Install these essential addons:

```bash
# Core addons (usually included)
pnpm add -D @storybook/addon-essentials

# Accessibility testing
pnpm add -D @storybook/addon-a11y

# Interaction testing
pnpm add -D @storybook/addon-interactions
pnpm add -D @storybook/test

# Design integration (optional)
pnpm add -D @storybook/addon-designs
```

---

## Configuration Files

### .storybook/main.ts

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Point to component stories
  stories: [
    '../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../docs/**/*.mdx',
  ],

  // Enable addons
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],

  // Framework configuration
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Documentation mode
  docs: {
    autodocs: 'tag',
  },

  // Static files
  staticDirs: ['../public'],

  // TypeScript configuration
  typescript: {
    check: true,
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
```

### .storybook/preview.ts

```typescript
import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';

// Import global styles
import '../packages/ui/src/styles/global.css';

// Import tokens CSS
import '../packages/tokens/dist/tokens.css';

const preview: Preview = {
  parameters: {
    // Action handling
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Controls configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    // Viewport presets
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },

    // Accessibility configuration
    a11y: {
      config: {
        rules: [
          // Customize axe rules if needed
          { id: 'color-contrast', enabled: true },
        ],
      },
    },

    // Documentation theme
    docs: {
      theme: themes.light,
    },

    // Backgrounds
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface', value: 'var(--color-surface-base)' },
        { name: 'subtle', value: 'var(--color-surface-subtle)' },
        { name: 'inverse', value: 'var(--color-surface-inverse)' },
      ],
    },
  },

  // Global decorators
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],

  // Tags for autodocs
  tags: ['autodocs'],
};

export default preview;
```

---

## Story Structure

### Story File Template

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Description of what this component does and when to use it.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Visual variant of the component',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Default story
export const Default: Story = {
  args: {
    children: 'Component content',
  },
};

// All variants
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
    </div>
  ),
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

// All states
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <ComponentName>Default</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
      <ComponentName loading>Loading</ComponentName>
    </div>
  ),
};

// With icons
export const WithIcons: Story = {
  args: {
    leftIcon: <IconName />,
    children: 'With Icon',
  },
};
```

---

## Documentation Pages

### Structure

```
storybook/
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── docs/
│   ├── Introduction.mdx
│   ├── GettingStarted.mdx
│   ├── Tokens.mdx
│   ├── Accessibility.mdx
│   └── Contributing.mdx
└── README.md
```

### Documentation Template (MDX)

```mdx
{/* Introduction.mdx */}
import { Meta } from '@storybook/blocks';

<Meta title="Introduction" />

# [Product] Design System

Welcome to the [Product] design system component library.

## Quick Start

```bash
# Install the package
pnpm add @your-org/ui @your-org/tokens

# Import and use
import { Button } from '@your-org/ui';
import '@your-org/tokens/dist/tokens.css';
```

## Principles

1. **Accessibility First**: Every component meets WCAG 2.1 AA
2. **Token-Based**: All styling uses design tokens
3. **Composable**: Components work together seamlessly

## Resources

- [Figma Library](link)
- [GitHub Repository](link)
- [MAGENTA.md (Design Source of Truth)](link)
```

---

## Accessibility Testing

### Configuration

The a11y addon runs axe-core automatically on every story.

```typescript
// In preview.ts
parameters: {
  a11y: {
    config: {
      rules: [
        { id: 'color-contrast', enabled: true },
        { id: 'label', enabled: true },
        { id: 'button-name', enabled: true },
      ],
    },
    options: {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
    },
  },
}
```

### Per-Story Configuration

```typescript
export const CustomA11y: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Disable specific rule for this story (with justification)
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
  },
};
```

---

## Interaction Testing

### Setup

```typescript
// ComponentName.stories.tsx
import { within, userEvent, expect } from '@storybook/test';

export const WithInteractions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Find elements
    const button = canvas.getByRole('button');

    // Simulate interaction
    await userEvent.click(button);

    // Assert result
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};
```

---

## Visual Regression Testing

### Chromatic Integration

```bash
# Install Chromatic
pnpm add -D chromatic

# Run Chromatic
npx chromatic --project-token=<your-token>
```

### Configuration

```json
// package.json
{
  "scripts": {
    "chromatic": "chromatic --exit-zero-on-changes"
  }
}
```

---

## Folder Organization

### Story Location

Stories should live next to their components:

```
packages/ui/src/components/
├── Button/
│   ├── Button.tsx
│   ├── Button.styles.ts
│   ├── Button.test.tsx
│   ├── Button.stories.tsx    ← Story file
│   └── index.ts
└── Input/
    ├── Input.tsx
    ├── Input.styles.ts
    ├── Input.test.tsx
    ├── Input.stories.tsx     ← Story file
    └── index.ts
```

### Story Hierarchy

```typescript
// Naming convention
meta: {
  title: 'Category/Subcategory/ComponentName',
  // Examples:
  // 'Primitives/Button'
  // 'Forms/Input'
  // 'Layout/Container'
  // 'Patterns/Card'
}
```

---

## Scripts

```json
// package.json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "storybook:test": "test-storybook",
    "chromatic": "chromatic --exit-zero-on-changes"
  }
}
```

---

## Checklist

```
□ Storybook installed and running
□ main.ts configured with story paths
□ preview.ts configured with global styles and tokens
□ a11y addon configured
□ All components have stories
□ Stories show all variants
□ Stories show all states
□ Documentation pages created
□ Controls work for interactive props
□ Viewports configured for responsive testing
□ No accessibility violations
```

---

*Storybook is your component development environment. Keep stories up to date with component changes.*
