# Claude Code Guidelines for Prompt Property Manager

**Version:** 1.0
**Last Updated:** December 16, 2024
**Purpose:** Explicit instructions for Claude Code when working on this project

---

## MANDATORY: Read Before Any Work

Before starting ANY task on this project, Claude Code MUST:

1. Read `/docs/PRD.md` to understand the product
2. Read `/docs/DEVELOPMENT.md` to understand the workflow
3. Read `/docs/TESTING.md` to understand testing requirements
4. Check the current todo list and update it if working on new tasks

---

## Core Principles for Claude Code

### 1. ALWAYS Write Tests

**This is non-negotiable.** Every piece of code you write must have tests.

```
WRONG:
1. Write component
2. Test manually
3. Move on

RIGHT:
1. Write component
2. Write unit test for component
3. Verify test passes
4. Write E2E test if user-facing
5. Move on
```

### 2. ALWAYS Follow the Type System

- Never use `any` without explicit justification
- Define interfaces for all data structures
- Export types from `src/types/index.ts`

### 3. ALWAYS Use Existing Patterns

Before creating something new, check if a pattern exists:
- Check `/src/components` for component patterns
- Check `/src/hooks` for hook patterns
- Check `/src/utils` for utility patterns

### 4. ALWAYS Commit Incrementally

One logical change per commit. Never:
- Combine unrelated changes
- Make huge commits
- Skip commit messages

---

## Workflow: Before Writing Any Code

### Step 1: Understand the Task

```markdown
Before coding, answer these questions:
1. What user story does this relate to? (US-P1, US-P2, etc.)
2. What are the acceptance criteria?
3. What files will need to change?
4. What tests will need to be written?
5. Are there any dependencies or blockers?
```

### Step 2: Update the Todo List

Use `TodoWrite` to track your work:

```typescript
// Example: Working on chat input
TodoWrite({
  todos: [
    { content: "Define ChatInput props interface", status: "in_progress", activeForm: "Defining ChatInput interface" },
    { content: "Create ChatInput component", status: "pending", activeForm: "Creating ChatInput component" },
    { content: "Write ChatInput unit tests", status: "pending", activeForm: "Writing ChatInput tests" },
    { content: "Integrate ChatInput with ChatContainer", status: "pending", activeForm: "Integrating ChatInput" },
  ]
});
```

### Step 3: Check Existing Code

Always check for:
- Similar components that can be reused
- Existing types that can be extended
- Patterns already established

---

## Workflow: Writing Code

### Step 1: Types First

Always define types before implementation:

```typescript
// src/types/index.ts - ADD NEW TYPES HERE

// Define the interface FIRST
export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}
```

### Step 2: Implementation

Follow the component structure from DEVELOPMENT.md:

```typescript
// src/components/chat/ChatInput.tsx

// 1. Imports
import { useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import { clsx } from 'clsx';
import type { ChatInputProps } from '@/types';

// 2. Component
export const ChatInput: FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Ask me about community rules...',
  className,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('flex gap-2', className)}
    >
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Message input"
        data-testid="chat-input"
        className="flex-1 p-2 border rounded"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        data-testid="send-button"
        className="px-4 py-2 border rounded"
      >
        Send
      </button>
    </form>
  );
};

ChatInput.displayName = 'ChatInput';
```

### Step 3: Write Tests Immediately

**Do not move on without tests:**

```typescript
// src/components/chat/ChatInput.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('should render input and button', () => {
    render(<ChatInput onSend={vi.fn()} />);

    expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  it('should call onSend with input value when submitted', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(<ChatInput onSend={onSend} />);

    await user.type(screen.getByTestId('chat-input'), 'Test message');
    await user.click(screen.getByTestId('send-button'));

    expect(onSend).toHaveBeenCalledWith('Test message');
  });

  it('should clear input after send', async () => {
    const user = userEvent.setup();

    render(<ChatInput onSend={vi.fn()} />);

    const input = screen.getByTestId('chat-input');
    await user.type(input, 'Test message');
    await user.click(screen.getByTestId('send-button'));

    expect(input).toHaveValue('');
  });

  it('should disable button when input is empty', () => {
    render(<ChatInput onSend={vi.fn()} />);

    expect(screen.getByTestId('send-button')).toBeDisabled();
  });

  it('should disable input and button when disabled prop is true', () => {
    render(<ChatInput onSend={vi.fn()} disabled />);

    expect(screen.getByTestId('chat-input')).toBeDisabled();
    expect(screen.getByTestId('send-button')).toBeDisabled();
  });
});
```

### Step 4: Run Tests

**Always verify tests pass before moving on:**

```bash
npm run test -- src/components/chat/ChatInput.test.tsx
```

### Step 5: Update Todo

Mark task complete, move to next:

```typescript
TodoWrite({
  todos: [
    { content: "Define ChatInput props interface", status: "completed", activeForm: "Defining ChatInput interface" },
    { content: "Create ChatInput component", status: "completed", activeForm: "Creating ChatInput component" },
    { content: "Write ChatInput unit tests", status: "completed", activeForm: "Writing ChatInput tests" },
    { content: "Integrate ChatInput with ChatContainer", status: "in_progress", activeForm: "Integrating ChatInput" },
  ]
});
```

---

## Workflow: Before Creating a PR

### Checklist

Run through this EVERY time before suggesting a PR:

```bash
# 1. Run linting
npm run lint

# 2. Run type check
npm run type-check

# 3. Run unit tests
npm run test

# 4. Run E2E tests (if changed user-facing code)
npm run test:e2e

# 5. Build to verify no build errors
npm run build
```

If ANY of these fail, fix them before proceeding.

---

## Required Patterns

### Data Test IDs

All interactive elements MUST have `data-testid`:

```typescript
// REQUIRED for testing
<button data-testid="send-button">Send</button>
<input data-testid="chat-input" />
<div data-testid="message-list">...</div>
<div data-testid="user-message">...</div>
<div data-testid="assistant-message">...</div>
<div data-testid="loading-indicator">...</div>
<div data-testid="error-message">...</div>
```

### Accessibility Attributes

All interactive elements MUST have accessibility:

```typescript
// REQUIRED
<button aria-label="Send message">Send</button>
<input aria-label="Message input" />
<div role="article" aria-label="Message from Prompt Property Manager">...</div>
<div role="status" aria-live="polite">Loading...</div>
```

### Error Handling

All async operations MUST have error handling:

```typescript
// REQUIRED pattern
try {
  setIsLoading(true);
  const result = await apiCall();
  // handle success
} catch (error) {
  const err = error instanceof Error ? error : new Error('Unknown error');
  setError(err);
  // optionally call error callback
  onError?.(err);
} finally {
  setIsLoading(false);
}
```

### Loading States

All async operations MUST show loading state:

```typescript
// REQUIRED - user must know something is happening
{isLoading && (
  <div data-testid="loading-indicator" role="status" aria-live="polite">
    Loading...
  </div>
)}
```

---

## File Creation Rules

### When Creating a New Component

1. Create the component file: `src/components/[category]/ComponentName.tsx`
2. Create the test file: `src/components/[category]/ComponentName.test.tsx`
3. Export from barrel: `src/components/index.ts`
4. Add types to: `src/types/index.ts` (if new types needed)

### When Creating a New Hook

1. Create the hook file: `src/hooks/useHookName.ts`
2. Create the test file: `src/hooks/useHookName.test.ts`
3. Export from barrel: `src/hooks/index.ts`
4. Add types to: `src/types/index.ts`

### When Creating a New Utility

1. Create the utility file: `src/utils/utilityName.ts`
2. Create the test file: `src/utils/utilityName.test.ts`
3. Export from barrel: `src/utils/index.ts`

---

## Prohibited Actions

### NEVER Do These:

1. **Never skip tests** - Every function, hook, and component needs tests
2. **Never use `any` without comment** - Always justify or fix the type
3. **Never hardcode API keys** - Use environment variables
4. **Never commit console.logs** - Remove before committing
5. **Never ignore TypeScript errors** - Fix them
6. **Never ignore linting errors** - Fix them
7. **Never create files without tests** - Tests are required
8. **Never combine unrelated changes** - One logical change per commit
9. **Never skip accessibility** - ARIA labels are required
10. **Never skip loading states** - Users need feedback

---

## Communication Style

When explaining work to the user:

1. **Be concise** - Don't over-explain
2. **Show progress** - Use todo list updates
3. **Report blockers immediately** - Don't hide problems
4. **Ask clarifying questions** - When requirements are unclear
5. **Suggest improvements** - But explain trade-offs

---

## Common Tasks Quick Reference

### Adding a New Component

```bash
# 1. Create files
src/components/features/NewComponent.tsx
src/components/features/NewComponent.test.tsx

# 2. Add to barrel export
# src/components/index.ts
export { NewComponent } from './features/NewComponent';

# 3. Run tests
npm run test -- src/components/features/NewComponent.test.tsx

# 4. Run lint
npm run lint
```

### Adding a New Hook

```bash
# 1. Create files
src/hooks/useNewHook.ts
src/hooks/useNewHook.test.ts

# 2. Add to barrel export
# src/hooks/index.ts
export { useNewHook } from './useNewHook';

# 3. Run tests
npm run test -- src/hooks/useNewHook.test.ts
```

### Fixing a Bug

```bash
# 1. Write a failing test that reproduces the bug
# 2. Fix the bug
# 3. Verify the test passes
# 4. Run full test suite to check for regressions
npm run test
```

### Making a PR

```bash
# 1. Run all checks
npm run lint && npm run type-check && npm run test && npm run build

# 2. If all pass, create PR with:
#    - Descriptive title
#    - Link to user story
#    - Test plan
#    - Screenshots (if UI)
```

---

## Environment Setup Verification

When starting work, verify the environment is set up:

```bash
# Check Node version (should be 20+)
node --version

# Check npm dependencies are installed
npm ci

# Verify dev server starts
npm run dev

# Verify tests run
npm run test

# Verify build works
npm run build
```

If any of these fail, fix the environment before proceeding with feature work.

---

## Document Updates

When making changes that affect documentation:

1. **PRD changes** - Update version number and changelog
2. **New patterns** - Update DEVELOPMENT.md
3. **New test patterns** - Update TESTING.md
4. **API changes** - Update relevant docs

---

## Summary Checklist

Before completing ANY task, verify:

- [ ] Code is written following existing patterns
- [ ] Types are properly defined
- [ ] Unit tests are written and passing
- [ ] E2E tests are written (if user-facing)
- [ ] Accessibility attributes are present
- [ ] Data test IDs are present
- [ ] Error handling is implemented
- [ ] Loading states are implemented
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Todo list is updated
- [ ] Commit message follows convention
