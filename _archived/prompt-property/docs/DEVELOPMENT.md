# Prompt Property Manager Development Framework

**Version:** 1.0
**Last Updated:** December 16, 2024
**Purpose:** Standardized development process for Claude Code and all developers

---

## Table of Contents

1. [Development Philosophy](#1-development-philosophy)
2. [Development Workflow](#2-development-workflow)
3. [Code Standards](#3-code-standards)
4. [Building Methodology](#4-building-methodology)
5. [Iteration Process](#5-iteration-process)
6. [Launch Process](#6-launch-process)
7. [Technical Debt Management](#7-technical-debt-management)

---

## 1. Development Philosophy

### Core Principles

1. **Test-Alongside Development (TAD)**
   - Write tests as you write code, not after
   - Every new function/hook/component should have corresponding tests
   - Tests are not optional - they are part of "done"

2. **Small, Incremental Changes**
   - One logical change per commit
   - PRs should be reviewable in <15 minutes
   - If a PR is too large, break it into smaller pieces

3. **Fail Fast, Fix Fast**
   - CI must pass before merge
   - Broken builds are top priority
   - No "I'll fix it later" - fix it now or don't merge

4. **Documentation as Code**
   - Update docs in the same PR as code changes
   - PRD changes require version bump
   - README/docs must stay current

5. **Accessibility from Day One**
   - Not an afterthought
   - Every interactive element needs keyboard support
   - ARIA labels are required, not optional

### Definition of Done

A feature is **NOT done** until:

- [ ] Code is written and working
- [ ] Unit tests pass (80%+ coverage for new code)
- [ ] E2E tests pass (if user-facing)
- [ ] TypeScript has no errors (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Accessibility basics verified
- [ ] Mobile responsiveness checked
- [ ] PR reviewed and approved
- [ ] Merged to develop/main
- [ ] Deployed and verified in staging

---

## 2. Development Workflow

### 2.1 Branch Strategy

```
main (production)
  │
  └── develop (integration)
        │
        ├── feature/US-P1-chat-interface
        ├── feature/US-P2-multi-turn
        ├── fix/chat-input-focus
        └── chore/update-dependencies
```

| Branch Type | Naming Convention | Merges To | Example |
|-------------|-------------------|-----------|---------|
| `main` | Protected | - | Production code |
| `develop` | Protected | main | Integration |
| `feature/*` | `feature/<ticket>-<description>` | develop | `feature/US-P1-chat-interface` |
| `fix/*` | `fix/<description>` | develop | `fix/chat-scroll-position` |
| `hotfix/*` | `hotfix/<description>` | main + develop | `hotfix/api-key-exposure` |
| `chore/*` | `chore/<description>` | develop | `chore/update-vitest` |

### 2.2 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(chat): add message streaming` |
| `fix` | Bug fix | `fix(input): resolve focus trap` |
| `docs` | Documentation | `docs(readme): update setup instructions` |
| `style` | Formatting only | `style(components): fix indentation` |
| `refactor` | Code restructure | `refactor(hooks): extract useMessages` |
| `test` | Add/update tests | `test(chat): add E2E conversation flow` |
| `chore` | Maintenance | `chore(deps): update react to 18.3` |
| `perf` | Performance | `perf(messages): virtualize long lists` |
| `a11y` | Accessibility | `a11y(input): add aria-label` |

**Good Commits:**
```bash
feat(chat): implement multi-turn conversation context

- Add conversation history to Claude API calls
- Maintain context for up to 10 messages
- Add clear chat functionality

Closes #12
```

**Bad Commits:**
```bash
# Too vague
fix stuff

# Multiple unrelated changes
update chat and fix tests and add new component

# No type
added the thing
```

### 2.3 Pull Request Process

#### Before Creating PR

1. Rebase on latest develop: `git pull --rebase origin develop`
2. Run full test suite: `npm run test:all`
3. Run lint and type check: `npm run lint && npm run type-check`
4. Self-review your diff
5. Update documentation if needed

#### PR Requirements

- [ ] Descriptive title following commit convention
- [ ] Description explains WHAT and WHY
- [ ] Links to related issue/user story
- [ ] Screenshots for UI changes
- [ ] Test plan documented
- [ ] Breaking changes noted

#### PR Size Guidelines

| Size | Lines Changed | Review Time | Action |
|------|---------------|-------------|--------|
| Small | <100 | 15 min | Ideal |
| Medium | 100-300 | 30 min | Acceptable |
| Large | 300-500 | 1 hour | Consider splitting |
| XL | >500 | 2+ hours | Must split |

### 2.4 Code Review Checklist

**Reviewer must verify:**

- [ ] Code does what it claims to do
- [ ] Tests cover the new/changed code
- [ ] No obvious bugs or edge cases missed
- [ ] Error handling is appropriate
- [ ] No security issues (API keys, XSS, etc.)
- [ ] Accessibility requirements met
- [ ] Performance is acceptable
- [ ] Code is readable and maintainable
- [ ] TypeScript types are correct (no `any` without justification)
- [ ] No console.logs or debug code

---

## 3. Code Standards

### 3.1 TypeScript Requirements

```typescript
// REQUIRED: Strict mode enabled
// tsconfig.json: "strict": true

// GOOD: Explicit types
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const sendMessage = async (message: string): Promise<ChatMessage> => {
  // ...
};

// BAD: Implicit any
const sendMessage = async (message) => {
  // ...
};

// BAD: Explicit any without justification
const data: any = response.data;

// ACCEPTABLE: any with comment explaining why
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyData: any = externalLib.getData(); // External lib has no types
```

### 3.2 Component Structure

```typescript
// src/components/chat/MessageBubble.tsx

// 1. Imports (grouped and ordered)
import { memo, type FC } from 'react';
import { clsx } from 'clsx';

import { formatTimestamp } from '@/utils/formatters';
import type { Message } from '@/types';

// 2. Types/Interfaces
interface MessageBubbleProps {
  message: Message;
  className?: string;
}

// 3. Component
export const MessageBubble: FC<MessageBubbleProps> = memo(({
  message,
  className
}) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'p-4 rounded-lg',
        isUser ? 'ml-auto' : 'mr-auto',
        className
      )}
      role="article"
      aria-label={`Message from ${isUser ? 'you' : 'Prompt Property Manager'}`}
    >
      <p>{message.content}</p>
      <time
        dateTime={message.timestamp.toISOString()}
        className="text-sm opacity-60"
      >
        {formatTimestamp(message.timestamp)}
      </time>
    </div>
  );
});

// 4. Display name for debugging
MessageBubble.displayName = 'MessageBubble';
```

### 3.3 Hook Structure

```typescript
// src/hooks/useChat.ts

import { useState, useCallback } from 'react';
import type { Message, CommunityData } from '@/types';
import { sendMessageToClaudeAPI } from '@/lib/claude';

interface UseChatOptions {
  communityData: CommunityData;
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChat = ({
  communityData,
  onError
}: UseChatOptions): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Implementation...
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [communityData, messages, onError]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
```

### 3.4 File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `MessageBubble.tsx` |
| Hooks | camelCase with `use` prefix | `useChat.ts` |
| Utils | camelCase | `formatters.ts` |
| Types | `index.ts` in types folder | `types/index.ts` |
| Tests | `*.test.ts` or `*.spec.ts` | `useChat.test.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_CONFIG` |

### 3.5 Import Order

```typescript
// 1. React/external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal absolute imports (@/)
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/common';
import type { Message } from '@/types';

// 3. Relative imports
import { MessageBubble } from './MessageBubble';
import styles from './Chat.module.css';
```

---

## 4. Building Methodology

### 4.1 Feature Development Order

For each user story, follow this sequence:

```
1. Types First
   └── Define interfaces/types for the feature

2. Mock Data
   └── Create or update mock data needed

3. Hook/Logic Layer
   └── Build the business logic
   └── Write unit tests alongside

4. Component Layer
   └── Build UI components (minimal styling)
   └── Add accessibility attributes
   └── Write component tests

5. Integration
   └── Connect components to hooks
   └── Add E2E tests for critical paths

6. Polish
   └── Responsive design verification
   └── Error states and edge cases
   └── Loading states
```

### 4.2 Component Development Checklist

For every new component:

- [ ] Props interface defined with JSDoc comments
- [ ] Default props where appropriate
- [ ] Error boundary consideration
- [ ] Loading state handling
- [ ] Empty state handling
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Mobile touch targets (44px minimum)
- [ ] Accepts className prop for styling overrides

### 4.3 API Integration Checklist

For every API integration:

- [ ] Types defined for request/response
- [ ] Error handling with user-friendly messages
- [ ] Loading states in UI
- [ ] Retry logic for transient failures
- [ ] Timeout handling
- [ ] Rate limiting consideration
- [ ] Sensitive data not logged

---

## 5. Iteration Process

### 5.1 Development Cycles

Work in focused 1-week cycles:

```
Monday:     Planning + Start feature work
Tuesday:    Feature development
Wednesday:  Feature development + Testing
Thursday:   Testing + Bug fixes + PR reviews
Friday:     Integration + Demo prep + Retro
```

### 5.2 Feedback Integration

When feedback is received:

1. **Triage** - Is it a bug, enhancement, or new feature?
2. **Prioritize** - P0 (blocking), P1 (important), P2 (nice to have)
3. **Size** - Can it fit in current cycle or needs scheduling?
4. **Document** - Create issue with acceptance criteria
5. **Execute** - Follow standard development workflow

### 5.3 Prioritization Framework

| Priority | Description | Response Time | Example |
|----------|-------------|---------------|---------|
| P0 | Blocking/broken | Same day | App won't load, API errors |
| P1 | Important functionality | This cycle | Missing feature, UX issues |
| P2 | Enhancement | Next cycle | Performance, polish |
| P3 | Nice to have | Backlog | Minor improvements |

---

## 6. Launch Process

### 6.1 Pre-Launch Checklist

**Code Quality:**
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code coverage meets targets
- [ ] No console.logs in production code
- [ ] Environment variables documented

**Functionality:**
- [ ] All P0 user stories complete
- [ ] Critical user flows tested manually
- [ ] Error handling works correctly
- [ ] Loading states display properly
- [ ] Empty states display properly

**Security:**
- [ ] API keys not exposed in client code (or acceptable for prototype)
- [ ] No sensitive data in console/logs
- [ ] HTTPS enforced

**Performance:**
- [ ] Initial load under 3 seconds
- [ ] Time to interactive under 5 seconds
- [ ] No memory leaks in long sessions

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast passes
- [ ] Focus indicators visible

**Cross-Browser/Device:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)

### 6.2 Deployment Verification

After deployment:

1. **Smoke test** - Can you load the app?
2. **Happy path** - Does the main user flow work?
3. **Error path** - Does error handling work?
4. **Monitor** - Watch for console errors, API failures

### 6.3 Rollback Strategy

If issues found in production:

1. **Assess severity** - Is it blocking users?
2. **Quick fix possible?** - Can we fix forward in <30 min?
3. **Rollback if needed** - Revert to last known good deploy
4. **Post-mortem** - Document what happened and how to prevent

```bash
# Cloudflare Pages rollback
# Go to Cloudflare Dashboard > Pages > Deployments
# Select previous deployment > "Rollback to this deployment"
```

---

## 7. Technical Debt Management

### 7.1 Tracking Technical Debt

Create issues with `tech-debt` label:

```markdown
## Technical Debt: [Brief Description]

**What:** [What is the debt]
**Why it exists:** [How did we get here]
**Impact:** [What problems does it cause]
**Proposed fix:** [How to address it]
**Effort:** [S/M/L]
**Priority:** [P1/P2/P3]
```

### 7.2 Debt Paydown Strategy

- Reserve 20% of each cycle for tech debt
- Never skip more than 2 cycles without addressing debt
- High-impact, low-effort items first
- Refactor incrementally, not all at once

### 7.3 Code Smell Indicators

Watch for these and address proactively:

- [ ] Files over 300 lines
- [ ] Functions over 50 lines
- [ ] More than 3 levels of nesting
- [ ] Duplicated code (3+ occurrences)
- [ ] `any` types without comments
- [ ] Disabled linting rules
- [ ] TODO comments older than 2 weeks
- [ ] Skipped tests

---

## Quick Reference Commands

```bash
# Start development
npm run dev

# Run all quality checks before PR
npm run lint && npm run type-check && npm run test

# Full test suite
npm run test:all

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Appendix: PR Template

Save as `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
<!-- What does this PR do? -->

## Related Issue
<!-- Link to issue/user story -->
Closes #

## Type of Change
- [ ] Feature (new functionality)
- [ ] Bug fix (fixes an issue)
- [ ] Refactor (no functional changes)
- [ ] Docs (documentation only)
- [ ] Chore (dependencies, configs)

## Checklist
- [ ] Tests added/updated
- [ ] TypeScript types correct
- [ ] Linting passes
- [ ] Accessibility verified
- [ ] Mobile responsive
- [ ] Docs updated (if needed)

## Screenshots (if UI change)
<!-- Add before/after screenshots -->

## Test Plan
<!-- How can reviewers test this? -->
```
