# Component Library Structure Guide

> **Status:** Template — Build during 04-Development phase

This guide covers building the component library that implements the design system.

---

## Purpose

The UI package:
- Implements components from `03-ui/components/` specifications
- Consumes tokens from `@your-org/tokens` exclusively
- Provides accessible, tested, documented components
- Works as a dependency in applications

---

## Package Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   └── ...
│   │   └── index.ts          # Re-export all components
│   │
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   ├── useFocusTrap.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── cn.ts             # Class name utility
│   │   ├── polymorphic.ts    # Polymorphic component helper
│   │   └── index.ts
│   │
│   ├── styles/
│   │   └── global.css        # Global/reset styles
│   │
│   └── index.ts              # Package entry point
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## Component Template

### File Structure

Every component follows this structure:

```
ComponentName/
├── ComponentName.tsx       # Main component implementation
├── ComponentName.styles.ts # Styled components / CSS
├── ComponentName.test.tsx  # Unit tests
├── ComponentName.stories.tsx # Storybook stories
├── types.ts                # TypeScript interfaces
└── index.ts                # Public exports
```

### ComponentName.tsx

```typescript
import { forwardRef } from 'react';
import type { ComponentNameProps } from './types';
import {
  StyledComponentName,
  StyledIcon,
  StyledLabel,
} from './ComponentName.styles';

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <StyledComponentName
        ref={ref}
        $variant={variant}
        $size={size}
        $disabled={disabled}
        $loading={loading}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        className={className}
        {...props}
      >
        {loading && <LoadingSpinner size={size} aria-hidden="true" />}
        {!loading && leftIcon && (
          <StyledIcon $position="left" aria-hidden="true">
            {leftIcon}
          </StyledIcon>
        )}
        <StyledLabel $hidden={loading}>{children}</StyledLabel>
        {!loading && rightIcon && (
          <StyledIcon $position="right" aria-hidden="true">
            {rightIcon}
          </StyledIcon>
        )}
      </StyledComponentName>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### types.ts

```typescript
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ComponentNameVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ComponentNameSize = 'sm' | 'md' | 'lg';

export interface ComponentNameProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual variant */
  variant?: ComponentNameVariant;
  /** Size of the component */
  size?: ComponentNameSize;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether the component is in a loading state */
  loading?: boolean;
  /** Icon to display before the label */
  leftIcon?: ReactNode;
  /** Icon to display after the label */
  rightIcon?: ReactNode;
  /** Component content */
  children: ReactNode;
}
```

### ComponentName.styles.ts

```typescript
import styled, { css } from 'styled-components';
import { tokens } from '@your-org/tokens';
import type { ComponentNameVariant, ComponentNameSize } from './types';

interface StyledProps {
  $variant: ComponentNameVariant;
  $size: ComponentNameSize;
  $disabled: boolean;
  $loading: boolean;
}

const variants = {
  primary: css`
    background: ${tokens.color.accent.primary};
    color: ${tokens.color.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      background: ${tokens.color.accent.primaryHover};
    }
  `,
  secondary: css`
    background: ${tokens.color.surface.subtle};
    color: ${tokens.color.text.primary};
    border: 1px solid ${tokens.color.border.default};

    &:hover:not(:disabled) {
      background: ${tokens.color.surface.muted};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${tokens.color.accent.primary};
    border: none;

    &:hover:not(:disabled) {
      background: ${tokens.color.surface.subtle};
    }
  `,
  destructive: css`
    background: ${tokens.color.status.error};
    color: ${tokens.color.text.inverse};
    border: none;

    &:hover:not(:disabled) {
      filter: brightness(0.9);
    }
  `,
};

const sizes = {
  sm: css`
    padding: ${tokens.spacing[2]} ${tokens.spacing[3]};
    font-size: ${tokens.typography.fontSize.sm};
    gap: ${tokens.spacing[1]};
  `,
  md: css`
    padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
    font-size: ${tokens.typography.fontSize.base};
    gap: ${tokens.spacing[2]};
  `,
  lg: css`
    padding: ${tokens.spacing[4]} ${tokens.spacing[6]};
    font-size: ${tokens.typography.fontSize.lg};
    gap: ${tokens.spacing[2]};
  `,
};

export const StyledComponentName = styled.button<StyledProps>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${tokens.typography.fontFamily.sans};
  font-weight: ${tokens.typography.fontWeight.medium};
  border-radius: ${tokens.radius.md};
  cursor: pointer;
  transition:
    background ${tokens.motion.duration.fast} ${tokens.motion.easing.default},
    transform ${tokens.motion.duration.fast} ${tokens.motion.easing.default};

  /* Variant styles */
  ${({ $variant }) => variants[$variant]}

  /* Size styles */
  ${({ $size }) => sizes[$size]}

  /* Active state */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  /* Focus state */
  &:focus-visible {
    outline: 2px solid ${tokens.color.accent.primary};
    outline-offset: 2px;
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none !important;
  }
`;

export const StyledIcon = styled.span<{ $position: 'left' | 'right' }>`
  display: inline-flex;
  flex-shrink: 0;
`;

export const StyledLabel = styled.span<{ $hidden: boolean }>`
  ${({ $hidden }) =>
    $hidden &&
    css`
      visibility: hidden;
    `}
`;
```

### ComponentName.test.tsx

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  it('renders children', () => {
    render(<ComponentName>Click me</ComponentName>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders all variants', () => {
    const { rerender } = render(<ComponentName variant="primary">Button</ComponentName>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ComponentName variant="secondary">Button</ComponentName>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ComponentName variant="ghost">Button</ComponentName>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders all sizes', () => {
    const { rerender } = render(<ComponentName size="sm">Button</ComponentName>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ComponentName size="md">Button</ComponentName>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<ComponentName size="lg">Button</ComponentName>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<ComponentName disabled>Disabled</ComponentName>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles loading state', () => {
    render(<ComponentName loading>Loading</ComponentName>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('calls onClick handler', async () => {
    const onClick = jest.fn();
    render(<ComponentName onClick={onClick}>Click</ComponentName>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = jest.fn();
    render(<ComponentName onClick={onClick} disabled>Click</ComponentName>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ComponentName>Accessible</ComponentName>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('is keyboard accessible', async () => {
    const onClick = jest.fn();
    render(<ComponentName onClick={onClick}>Keyboard</ComponentName>);

    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);

    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
```

### index.ts

```typescript
export { ComponentName } from './ComponentName';
export type {
  ComponentNameProps,
  ComponentNameVariant,
  ComponentNameSize,
} from './types';
```

---

## Shared Utilities

### cn (Class Name Utility)

```typescript
// src/utils/cn.ts
type ClassValue = string | undefined | null | false;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
```

### Polymorphic Component Helper

```typescript
// src/utils/polymorphic.ts
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
} from 'react';

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProp<
  C extends ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

---

## Shared Hooks

### useMediaQuery

```typescript
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';
import { tokens, media } from '@your-org/tokens';

export function useMediaQuery(
  breakpoint: keyof typeof tokens.breakpoint
): boolean {
  const query = media(breakpoint).replace('@media ', '');
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

### useFocusTrap

```typescript
// src/hooks/useFocusTrap.ts
import { useEffect, useRef } from 'react';

export function useFocusTrap<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return containerRef;
}
```

---

## Package Configuration

### package.json

```json
{
  "name": "@your-org/ui",
  "version": "0.0.1",
  "description": "Component library for [Product]",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles/global.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@your-org/tokens": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "styled-components": "^6.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest-axe": "^8.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### tsconfig.json

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"]
}
```

---

## Component Categories

Organize components by purpose:

### Primitives
Basic building blocks:
- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Label

### Layout
Structural components:
- Box
- Flex
- Grid
- Container
- Stack

### Typography
Text components:
- Heading
- Text
- Link
- Code

### Feedback
User feedback:
- Alert
- Toast
- Progress
- Spinner
- Skeleton

### Overlay
Layered components:
- Modal
- Dialog
- Drawer
- Dropdown
- Tooltip
- Popover

### Navigation
Wayfinding:
- Tabs
- Breadcrumb
- Pagination
- Nav

### Data Display
Showing information:
- Avatar
- Badge
- Card
- Table
- List

---

## Quality Standards

### Per Component

```
□ Matches specification exactly
□ All variants implemented
□ All states implemented (default, hover, active, focus, disabled)
□ Only uses tokens (no magic numbers)
□ Accessible (keyboard, screen reader, ARIA)
□ Tests pass (including a11y)
□ Storybook story exists
□ TypeScript strict passes
□ Props documented
```

### Package-wide

```
□ All components exported from index.ts
□ No circular dependencies
□ Package builds without errors
□ Types are accurate and exported
□ Peer dependencies are correct
```

---

## Checklist

```
□ Package structure created
□ Token package integrated
□ Utilities created (cn, etc.)
□ Hooks created (useMediaQuery, useFocusTrap)
□ Global styles configured
□ Component template established
□ All specified components built
□ All tests pass
□ All stories created
□ Package builds successfully
□ Types exported correctly
□ README complete
```

---

*Components are the deliverable. Build them right, build them once.*
