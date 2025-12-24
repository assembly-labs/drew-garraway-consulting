# Token System Implementation Guide

> **Status:** Template — Implement during 04-Development phase

This guide covers building the design token package that powers all visual styling.

---

## Purpose

The token package:
- Converts `03-ui/tokens.json` into consumable code
- Provides type-safe token access
- Generates CSS custom properties
- Ensures no magic numbers in components

---

## Package Structure

```
packages/tokens/
├── src/
│   ├── tokens.ts          # Token values as TypeScript object
│   ├── css.ts             # CSS custom properties generator
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   └── index.ts           # Public exports
├── dist/
│   ├── index.js           # ESM bundle
│   ├── index.cjs          # CommonJS bundle
│   ├── index.d.ts         # Type definitions
│   └── tokens.css         # CSS custom properties
├── package.json
├── tsconfig.json
└── README.md
```

---

## Implementation

### Step 1: Create Token Definitions

```typescript
// src/tokens.ts
// Generated from 03-ui/tokens.json

export const tokens = {
  color: {
    surface: {
      base: '#ffffff',
      subtle: '#f9fafb',
      muted: '#f3f4f6',
      inverse: '#1f2937',
    },
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      muted: '#9ca3af',
      inverse: '#ffffff',
    },
    accent: {
      primary: '[value from MAGENTA.md]',
      primaryHover: '[hover state]',
      secondary: '[secondary accent]',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    border: {
      default: '#e5e7eb',
      subtle: '#f3f4f6',
      strong: '#d1d5db',
    },
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  typography: {
    fontFamily: {
      sans: '[Font from MAGENTA.md], system-ui, sans-serif',
      mono: 'ui-monospace, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  motion: {
    duration: {
      instant: '0ms',
      fast: '100ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  breakpoint: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type Tokens = typeof tokens;
```

### Step 2: Create Type Definitions

```typescript
// src/types.ts
import type { tokens } from './tokens';

export type Tokens = typeof tokens;

// Utility types for accessing nested paths
export type TokenPath = string;

export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radius;
export type ShadowToken = keyof typeof tokens.shadow;

// Deep key paths (for token() function)
type PathsOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? PathsOf<T[K], `${Prefix}${K & string}.`>
        : `${Prefix}${K & string}`;
    }[keyof T]
  : never;

export type TokenPathString = PathsOf<Tokens>;
```

### Step 3: Create Utility Functions

```typescript
// src/utils.ts
import { tokens } from './tokens';

/**
 * Get a token value by dot-notation path
 * @example token('color.accent.primary') // '#6366f1'
 */
export function token(path: string): string {
  const parts = path.split('.');
  let result: any = tokens;

  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      console.warn(`Token not found: ${path}`);
      return '';
    }
  }

  return result as string;
}

/**
 * Get a CSS custom property reference
 * @example cssVar('color.accent.primary') // 'var(--color-accent-primary)'
 */
export function cssVar(path: string): string {
  const varName = path.replace(/\./g, '-');
  return `var(--${varName})`;
}

/**
 * Create a media query string
 * @example media('md') // '@media (min-width: 768px)'
 */
export function media(breakpoint: keyof typeof tokens.breakpoint): string {
  return `@media (min-width: ${tokens.breakpoint[breakpoint]})`;
}
```

### Step 4: Generate CSS Custom Properties

```typescript
// src/css.ts
import { tokens } from './tokens';

/**
 * Recursively flatten tokens to CSS custom properties
 */
function flattenTokens(
  obj: Record<string, any>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const cssKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTokens(value, cssKey));
    } else {
      result[`--${cssKey}`] = String(value);
    }
  }

  return result;
}

/**
 * Generate CSS string with all custom properties
 */
export function generateCSS(): string {
  const flattened = flattenTokens(tokens);

  const cssLines = Object.entries(flattened)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root {\n${cssLines}\n}`;
}

/**
 * CSS string for reduced motion
 */
export const reducedMotionCSS = `
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

// Export pre-generated CSS
export const tokenCSS = generateCSS();
```

### Step 5: Create Package Exports

```typescript
// src/index.ts
export { tokens } from './tokens';
export type { Tokens, TokenPathString } from './types';
export { token, cssVar, media } from './utils';
export { tokenCSS, generateCSS, reducedMotionCSS } from './css';
```

---

## Package Configuration

### package.json

```json
{
  "name": "@your-org/tokens",
  "version": "0.0.1",
  "description": "Design tokens for [Product]",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./css": "./dist/tokens.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts && pnpm build:css",
    "build:css": "node scripts/build-css.js",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {}
}
```

### tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### Build Script for CSS

```javascript
// scripts/build-css.js
const fs = require('fs');
const path = require('path');

// Import the generated CSS function
const { generateCSS, reducedMotionCSS } = require('../dist/index.cjs');

const css = `/* Generated from tokens.json - DO NOT EDIT */
${generateCSS()}

${reducedMotionCSS}
`;

fs.writeFileSync(
  path.join(__dirname, '../dist/tokens.css'),
  css
);

console.log('✓ Generated tokens.css');
```

---

## Usage Examples

### In styled-components

```typescript
import { tokens } from '@your-org/tokens';

const Button = styled.button`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  background: ${tokens.color.accent.primary};
  color: ${tokens.color.text.inverse};
  border-radius: ${tokens.radius.md};
`;
```

### In CSS Modules

```css
/* Import the CSS file first */
@import '@your-org/tokens/css';

.button {
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-accent-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
}
```

### In Tailwind (as theme extension)

```javascript
// tailwind.config.js
const { tokens } = require('@your-org/tokens');

module.exports = {
  theme: {
    extend: {
      colors: tokens.color,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      // etc.
    },
  },
};
```

### With utility functions

```typescript
import { token, cssVar, media } from '@your-org/tokens';

// Get raw value
const primaryColor = token('color.accent.primary');
// → '#6366f1'

// Get CSS variable reference
const primaryVar = cssVar('color.accent.primary');
// → 'var(--color-accent-primary)'

// Get media query
const tabletQuery = media('md');
// → '@media (min-width: 768px)'
```

---

## Synchronizing with Design

### From tokens.json

When `03-ui/tokens.json` is updated:

1. Regenerate `src/tokens.ts` from the JSON
2. Run `pnpm build` to update outputs
3. Commit both source and generated files

### Automation Script

```javascript
// scripts/sync-tokens.js
const fs = require('fs');
const path = require('path');

const tokensJson = require('../../03-ui/tokens.json');

const output = `// Generated from 03-ui/tokens.json - DO NOT EDIT DIRECTLY
export const tokens = ${JSON.stringify(tokensJson, null, 2)} as const;

export type Tokens = typeof tokens;
`;

fs.writeFileSync(
  path.join(__dirname, '../src/tokens.ts'),
  output
);

console.log('✓ Synced tokens.ts from tokens.json');
```

---

## Validation

### Token Coverage Check

```typescript
// scripts/validate-tokens.js
import { tokens } from '../src/tokens';

const requiredCategories = [
  'color.surface.base',
  'color.text.primary',
  'color.accent.primary',
  'spacing.4',
  'typography.fontFamily.sans',
  'typography.fontSize.base',
  'radius.md',
  'shadow.md',
  'motion.duration.normal',
];

function validateTokens() {
  const missing: string[] = [];

  for (const path of requiredCategories) {
    const parts = path.split('.');
    let current: any = tokens;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        missing.push(path);
        break;
      }
    }
  }

  if (missing.length > 0) {
    console.error('Missing required tokens:', missing);
    process.exit(1);
  }

  console.log('✓ All required tokens present');
}

validateTokens();
```

---

## Checklist

```
□ tokens.ts matches tokens.json
□ All token categories present (color, spacing, typography, etc.)
□ TypeScript types are accurate
□ CSS custom properties generate correctly
□ Utility functions work (token, cssVar, media)
□ Package builds without errors
□ Exports configured correctly (ESM, CJS, types)
□ CSS file outputs correctly
□ No magic numbers in token values
□ Values match MAGENTA.md specifications
```

---

## Maintenance

### Adding a New Token

1. Add to `03-ui/tokens.json`
2. Regenerate `src/tokens.ts`
3. Run build
4. Update components using new token
5. Document in MAGENTA.md

### Changing a Token Value

1. Update in `03-ui/tokens.json`
2. Regenerate and build
3. Visual regression test all affected components
4. Update MAGENTA.md if philosophy changed

### Removing a Token

1. Search codebase for usages
2. Replace with new token or remove usage
3. Remove from `tokens.json`
4. Regenerate and build
5. Confirm no build errors

---

*The token package is the foundation. Every visual value flows from here.*
