# Testing Guide

> **Status:** Template — Reference during 04-Development phase

This guide covers testing requirements and patterns for the component library.

---

## Testing Philosophy

1. **Test behavior, not implementation**
2. **Every component needs tests**
3. **Accessibility is tested, not optional**
4. **Tests should prevent regressions**

---

## Testing Stack

### Recommended Tools

| Purpose | Tool |
|---------|------|
| Test runner | Vitest or Jest |
| Component testing | Testing Library |
| Accessibility testing | jest-axe |
| User interaction | @testing-library/user-event |
| E2E (optional) | Playwright or Cypress |
| Visual regression | Chromatic (via Storybook) |

### Installation

```bash
# Core testing
pnpm add -D vitest @testing-library/react @testing-library/user-event

# Accessibility
pnpm add -D jest-axe @axe-core/react

# Types
pnpm add -D @testing-library/jest-dom @types/jest-axe
```

---

## Test Configuration

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.stories.tsx',
        '**/*.d.ts',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

### test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});
```

---

## Test Structure

### File Naming

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx    ← Test file
└── ...
```

### Test Organization

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  // Rendering tests
  describe('rendering', () => {
    it('renders children', () => {});
    it('renders all variants', () => {});
    it('renders all sizes', () => {});
  });

  // State tests
  describe('states', () => {
    it('handles disabled state', () => {});
    it('handles loading state', () => {});
  });

  // Interaction tests
  describe('interactions', () => {
    it('calls onClick handler', async () => {});
    it('does not call onClick when disabled', async () => {});
  });

  // Accessibility tests
  describe('accessibility', () => {
    it('has no accessibility violations', async () => {});
    it('is keyboard accessible', async () => {});
    it('has correct ARIA attributes', () => {});
  });
});
```

---

## Test Patterns

### Basic Rendering

```typescript
it('renders children', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Testing Variants

```typescript
it('renders all variants', () => {
  const { rerender } = render(<Button variant="primary">Button</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();

  rerender(<Button variant="secondary">Button</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();

  rerender(<Button variant="ghost">Button</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### Testing States

```typescript
it('handles disabled state', () => {
  render(<Button disabled>Disabled</Button>);
  const button = screen.getByRole('button');

  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-disabled', 'true');
});

it('handles loading state', () => {
  render(<Button loading>Loading</Button>);
  const button = screen.getByRole('button');

  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-busy', 'true');
});
```

### Testing Interactions

```typescript
it('calls onClick handler', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button onClick={onClick}>Click</Button>);
  await user.click(screen.getByRole('button'));

  expect(onClick).toHaveBeenCalledTimes(1);
});

it('does not call onClick when disabled', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button onClick={onClick} disabled>Click</Button>);
  await user.click(screen.getByRole('button'));

  expect(onClick).not.toHaveBeenCalled();
});
```

### Testing Keyboard Interaction

```typescript
it('is keyboard accessible', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  render(<Button onClick={onClick}>Keyboard</Button>);

  // Tab to focus
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();

  // Enter activates
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);

  // Space activates
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
});
```

### Testing Accessibility

```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<Button>Accessible</Button>);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});

it('has correct role', () => {
  render(<Button>Button</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

it('has accessible name', () => {
  render(<Button aria-label="Close dialog"><CloseIcon /></Button>);
  expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
});
```

### Testing Focus Trap (for Modals)

```typescript
it('traps focus within modal', async () => {
  const user = userEvent.setup();

  render(
    <Modal open>
      <button>First</button>
      <button>Second</button>
      <button>Third</button>
    </Modal>
  );

  // First element should be focused on open
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

  // Tab forward
  await user.tab();
  expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();

  await user.tab();
  expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();

  // Tab wraps to first
  await user.tab();
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();

  // Shift+Tab wraps to last
  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();
});
```

### Testing Form Components

```typescript
describe('Input', () => {
  it('accepts user input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'Hello');

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
  });

  it('shows error state', () => {
    render(<Input error="Required field" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });
});
```

---

## Accessibility Testing Patterns

### Basic axe Test

```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### With Configuration

```typescript
it('has no accessibility violations', async () => {
  const { container } = render(<Component />);

  const results = await axe(container, {
    rules: {
      // Customize rules if needed
      'color-contrast': { enabled: true },
    },
  });

  expect(results).toHaveNoViolations();
});
```

### Testing All Variants

```typescript
const variants = ['primary', 'secondary', 'ghost'] as const;

describe.each(variants)('variant: %s', (variant) => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button variant={variant}>Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  beforeEach(() => {
    // Reset mock
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it('returns false initially', () => {
    const { result } = renderHook(() => useMediaQuery('md'));
    expect(result.current).toBe(false);
  });

  it('updates on media query change', () => {
    let listener: (e: { matches: boolean }) => void;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event, cb) => {
        listener = cb;
      }),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('md'));

    act(() => {
      listener({ matches: true });
    });

    expect(result.current).toBe(true);
  });
});
```

---

## What NOT to Test

### Don't Test Implementation Details

```typescript
// ❌ Don't test internal state
it('sets internal state', () => {
  const { result } = renderHook(() => useComponent());
  expect(result.current.internalState).toBe(true); // Implementation detail!
});

// ✅ Test behavior
it('shows content when expanded', async () => {
  render(<Accordion />);
  await userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Hidden content')).toBeVisible();
});
```

### Don't Test Styled-Components

```typescript
// ❌ Don't test styles directly
it('has correct background color', () => {
  render(<Button variant="primary" />);
  expect(screen.getByRole('button')).toHaveStyle('background: #6366f1');
});

// ✅ Test behavior that relies on styles (if needed)
// Or use visual regression testing instead
```

### Don't Over-Test Third-Party Libraries

```typescript
// ❌ Don't test React itself
it('re-renders when props change', () => {
  // React does this; we don't need to test it
});

// ✅ Test your component's behavior
it('updates displayed value when value prop changes', () => {
  const { rerender } = render(<Input value="initial" />);
  expect(screen.getByRole('textbox')).toHaveValue('initial');

  rerender(<Input value="updated" />);
  expect(screen.getByRole('textbox')).toHaveValue('updated');
});
```

---

## Coverage Requirements

### Targets

| Metric | Minimum |
|--------|---------|
| Lines | 80% |
| Functions | 80% |
| Branches | 80% |
| Statements | 80% |

### What Counts

- Component rendering
- All variants and states
- User interactions
- Accessibility
- Edge cases

### What Doesn't Count (Exclude)

- Type definitions (`.d.ts`)
- Stories (`.stories.tsx`)
- Test utilities
- Generated files

---

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific file
pnpm test Button.test.tsx

# Run tests matching pattern
pnpm test -t "handles disabled state"
```

---

## CI Configuration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Test Checklist

Per component:

```
□ Basic rendering test
□ All variants tested
□ All sizes tested (if applicable)
□ All states tested (disabled, loading, etc.)
□ Event handlers tested (onClick, onChange, etc.)
□ Keyboard interaction tested
□ Accessibility test (jest-axe)
□ ARIA attributes verified
□ Focus behavior tested
□ Edge cases covered
```

---

*Tests are documentation. They show how components should be used.*
