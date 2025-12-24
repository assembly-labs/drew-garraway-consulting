# 04-Development: Standard Operating Procedure

This document is the complete guide for running the Development phase. Follow it step-by-step.

---

## Phase Overview

**Purpose:** Build the token system and component library that brings the design to life.

**Duration:** Variable based on project scope (typically 2-4 weeks for MVP)

**Inputs:**
- Completed `03-ui/MAGENTA.md` (visual design source of truth)
- Finalized `03-ui/tokens.json`
- Component specifications from `03-ui/components/`
- Motion principles from `03-ui/motion/`
- Wireframes from `02-ux/wireframes/`
- Content strategy from `02-ux/content-strategy.md`

**Outputs:**
- Working token system in `packages/tokens/`
- Component library in `packages/ui/`
- Storybook documentation in `storybook/`
- Application shell in `apps/web/`

**Key Question:** "Is this built exactly as specified, with no magic numbers?"

---

## How Claude Participates

In this phase, Claude acts as an **implementation partner**:

| Claude Does | Claude Doesn't |
|-------------|----------------|
| Write clean, typed code | Use raw values (always tokens) |
| Follow component specifications exactly | Improvise on design decisions |
| Create comprehensive Storybook stories | Skip edge cases or states |
| Implement all defined states | Add features not in spec |
| Ensure accessibility baseline | Cut corners on a11y |
| Write meaningful tests | Create test coverage for its own sake |

**Collaboration mode:** Implementation-focused. Execute on approved specs; raise questions when specs are ambiguous.

---

## Core Principle: Tokens Only

**No magic numbers.** Every visual value must come from the token system:

```typescript
// WRONG - raw values
const Button = styled.button`
  padding: 12px 24px;
  background: #6366F1;
  border-radius: 8px;
  font-size: 14px;
`;

// RIGHT - tokens only
const Button = styled.button`
  padding: ${tokens.spacing[3]} ${tokens.spacing[6]};
  background: ${tokens.color.accent.primary};
  border-radius: ${tokens.radius.md};
  font-size: ${tokens.typography.fontSize.sm};
`;
```

If a value isn't in the token system and you need it, that's a signal to update the tokens—not to hardcode.

---

## Architecture Overview

```
04-development/
├── packages/
│   ├── tokens/              # Design tokens package
│   │   ├── src/
│   │   │   ├── tokens.ts    # Token definitions
│   │   │   ├── css.ts       # CSS custom properties
│   │   │   └── index.ts     # Public exports
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── ui/                  # Component library
│       ├── src/
│       │   ├── components/  # Individual components
│       │   ├── hooks/       # Shared hooks
│       │   ├── utils/       # Utilities
│       │   └── index.ts     # Public exports
│       ├── package.json
│       └── README.md
│
├── storybook/               # Storybook configuration
│   ├── .storybook/
│   │   ├── main.ts
│   │   └── preview.ts
│   ├── stories/             # Component stories
│   └── README.md
│
├── apps/
│   └── web/                 # Application implementation
│       ├── src/
│       ├── package.json
│       └── README.md
│
├── SOP.md                   # This file
├── code-review-checklist.md
└── testing-guide.md
```

---

## Step-by-Step Process

### Step 1: Project Setup (30-60 min)

**Goal:** Initialize the monorepo structure and dependencies.

**Input:** Technology choices from brief, tokens.json

**Process:**

1. **Choose package manager**
   - npm, yarn, or pnpm
   - Recommend pnpm for monorepo support

2. **Initialize monorepo**
   ```bash
   # Example with pnpm
   pnpm init
   # Create pnpm-workspace.yaml
   ```

3. **Set up TypeScript**
   - Root tsconfig.json with strict mode
   - Package-specific configs extending root

4. **Configure linting/formatting**
   - ESLint with accessibility plugin
   - Prettier for consistent formatting
   - Husky + lint-staged for pre-commit

5. **Set up shared dependencies**
   - React (if React project)
   - TypeScript
   - Styling solution (styled-components, vanilla-extract, Tailwind, etc.)

**Output:** Working monorepo with basic tooling

**Claude's role:** Generate configuration files, set up tooling.

**Quality check:**
- [ ] `pnpm install` runs without errors
- [ ] TypeScript compiles
- [ ] Linting passes
- [ ] Project structure matches architecture

---

### Step 2: Token System Implementation (60-90 min)

**Goal:** Convert tokens.json into a consumable code package.

**Input:** `03-ui/tokens.json`

**Process:**

1. **Create token package structure**
   ```
   packages/tokens/
   ├── src/
   │   ├── tokens.ts      # Raw token values
   │   ├── css.ts         # CSS custom properties
   │   ├── types.ts       # TypeScript types
   │   └── index.ts       # Public API
   ├── package.json
   └── README.md
   ```

2. **Convert tokens.json to TypeScript**
   - Type-safe token access
   - Autocomplete support
   - Nested object structure

3. **Generate CSS custom properties**
   ```typescript
   // Example output
   :root {
     --color-surface-base: #ffffff;
     --color-text-primary: #1a1a1a;
     --spacing-4: 16px;
     // ...
   }
   ```

4. **Create utility functions**
   ```typescript
   // Token access helpers
   export function token(path: string): string;
   export function cssVar(path: string): string;
   ```

5. **Export for multiple formats**
   - ESM for modern bundlers
   - CJS for Node.js
   - CSS file for direct import

**Output:** Working `packages/tokens/` with exports

**Claude's role:** Generate token package from tokens.json.

**Quality check:**
- [ ] All tokens from tokens.json are present
- [ ] TypeScript types are accurate
- [ ] CSS variables are generated correctly
- [ ] Package builds without errors
- [ ] Exports are correct

---

### Step 3: Base Styles Setup (30-45 min)

**Goal:** Create foundation styles that apply tokens globally.

**Input:** Token package, MAGENTA.md

**Process:**

1. **Create CSS reset**
   - Normalize browser defaults
   - Apply box-sizing: border-box
   - Remove default margins

2. **Set up typography defaults**
   - Apply font-family to body
   - Set base font-size and line-height
   - Configure heading scales

3. **Configure color scheme**
   - Apply surface colors to body
   - Set up text colors
   - Handle dark mode (if applicable)

4. **Add accessibility foundations**
   - Focus styles using tokens
   - Reduced motion media query
   - Skip links (if needed)

**Output:** Global styles file consuming tokens

**Claude's role:** Create base styles following MAGENTA.md.

**Quality check:**
- [ ] All values reference tokens
- [ ] No raw colors, sizes, or values
- [ ] Reduced motion is respected
- [ ] Focus styles are visible

---

### Step 4: Component Library Foundation (45-60 min)

**Goal:** Set up the component library package structure.

**Input:** Component specifications from 03-ui/components/

**Process:**

1. **Create package structure**
   ```
   packages/ui/
   ├── src/
   │   ├── components/
   │   │   ├── Button/
   │   │   │   ├── Button.tsx
   │   │   │   ├── Button.styles.ts
   │   │   │   ├── Button.test.tsx
   │   │   │   └── index.ts
   │   │   └── index.ts
   │   ├── hooks/
   │   ├── utils/
   │   └── index.ts
   ├── package.json
   └── README.md
   ```

2. **Configure styling approach**
   - Match team preference (CSS-in-JS, CSS Modules, Tailwind, etc.)
   - Set up theme provider if needed
   - Configure token consumption

3. **Create shared utilities**
   ```typescript
   // Example utilities
   export function cn(...classes: string[]): string;
   export function forwardRef<T, P>(component: ...): ...;
   ```

4. **Set up component template**
   - Consistent file structure per component
   - Typed props interface
   - forwardRef pattern
   - Display name for debugging

**Output:** Component library skeleton ready for components

**Claude's role:** Create package structure, shared utilities.

**Quality check:**
- [ ] Package builds
- [ ] Exports are configured
- [ ] Template is reusable
- [ ] Token integration works

---

### Step 5: Component Development (Time varies)

**Goal:** Build each component according to specifications.

**Input:** Component specs from `03-ui/components/`

**Process:**

For each component:

1. **Review specification**
   - Understand all variants
   - Note all states
   - Check accessibility requirements
   - Review token usage

2. **Create component files**
   ```
   ComponentName/
   ├── ComponentName.tsx       # Main component
   ├── ComponentName.styles.ts # Styled components/CSS
   ├── ComponentName.test.tsx  # Unit tests
   ├── ComponentName.stories.tsx # Storybook stories
   └── index.ts               # Exports
   ```

3. **Implement base component**
   - Props interface from spec
   - All variants as props
   - forwardRef for DOM access
   - TypeScript strict

4. **Implement all states**
   - Default, hover, active, focus, disabled
   - Loading (if applicable)
   - Error (if applicable)

5. **Apply tokens**
   - Every color from tokens
   - Every spacing value from tokens
   - Every typography value from tokens
   - No exceptions

6. **Add accessibility**
   - Correct HTML element
   - ARIA attributes as needed
   - Keyboard interaction
   - Focus management

7. **Write tests**
   - Renders without error
   - All variants render
   - Accessibility tests
   - Interaction tests

8. **Create Storybook story**
   - All variants displayed
   - All states demonstrated
   - Controls for interactive props
   - Documentation

**Output:** Complete, tested, documented component

**Claude's role:** Implement components exactly as specified.

**Quality check (per component):**
- [ ] Matches spec exactly
- [ ] All states implemented
- [ ] Only uses tokens (no magic numbers)
- [ ] Accessible (keyboard, screen reader)
- [ ] Tests pass
- [ ] Storybook story exists
- [ ] TypeScript strict passes

---

### Step 6: Storybook Configuration (45-60 min)

**Goal:** Set up Storybook for component documentation.

**Input:** Component library, tokens

**Process:**

1. **Install and configure Storybook**
   ```bash
   npx storybook@latest init
   ```

2. **Configure main.ts**
   - Point to component stories
   - Add addons (a11y, viewport, etc.)
   - Configure static assets

3. **Configure preview.ts**
   - Apply global styles
   - Set up decorators
   - Configure viewports
   - Set up theme

4. **Create story template**
   ```typescript
   // Standard story structure
   export default {
     title: 'Components/Button',
     component: Button,
     parameters: {
       docs: { description: { component: '...' } },
     },
     argTypes: { /* controls */ },
   } satisfies Meta<typeof Button>;

   export const Default: Story = { args: { /* default props */ } };
   export const Variants: Story = { /* show all variants */ };
   export const States: Story = { /* show all states */ };
   ```

5. **Add documentation pages**
   - Getting started
   - Token reference
   - Accessibility guidelines
   - Contribution guide

**Output:** Working Storybook with all components documented

**Claude's role:** Configure Storybook, create story template.

**Quality check:**
- [ ] Storybook starts without errors
- [ ] All components have stories
- [ ] Controls work
- [ ] a11y addon configured
- [ ] Theme matches design

---

### Step 7: Application Shell (60-90 min)

**Goal:** Create the application structure that consumes the component library.

**Input:** Wireframes, component library, tokens

**Process:**

1. **Set up application framework**
   - Next.js, Remix, Vite, etc.
   - Configure to use component library
   - Set up routing (if needed)

2. **Create layout components**
   - App shell (header, main, footer)
   - Page layouts
   - Responsive containers

3. **Implement navigation**
   - From information architecture
   - Using component library components
   - Accessible navigation pattern

4. **Create page templates**
   - Based on wireframes
   - Composed of library components
   - Content slots defined

5. **Set up data patterns**
   - Loading states
   - Error handling
   - Empty states

**Output:** Application shell ready for content

**Claude's role:** Create app structure using component library.

**Quality check:**
- [ ] App starts without errors
- [ ] Uses only component library components
- [ ] Responsive at all breakpoints
- [ ] Navigation is accessible
- [ ] Loading/error states work

---

### Step 8: Testing & Accessibility Audit (60-90 min)

**Goal:** Ensure quality and accessibility compliance.

**Input:** Completed components and application

**Process:**

1. **Run unit tests**
   - All component tests pass
   - Coverage meets threshold (suggest 80%+)

2. **Run accessibility tests**
   - Storybook a11y addon (all stories pass)
   - axe-core in test suite
   - Manual keyboard testing
   - Screen reader testing (at least VoiceOver or NVDA)

3. **Run visual regression tests (optional)**
   - Chromatic or similar
   - Catch unintended visual changes

4. **Perform manual review**
   - Compare to specifications
   - Check all states
   - Test responsive behavior
   - Test reduced motion

5. **Fix any issues**
   - Prioritize accessibility issues
   - Document any known issues
   - Update tests as needed

**Output:** Passing test suite, accessibility compliance

**Claude's role:** Run tests, identify issues, fix problems.

**Quality check:**
- [ ] All tests pass
- [ ] No a11y violations
- [ ] Manual review complete
- [ ] Known issues documented

---

### Step 9: Documentation (30-45 min)

**Goal:** Ensure the codebase is well-documented.

**Input:** Completed implementation

**Process:**

1. **Component documentation**
   - README per package
   - JSDoc comments on exports
   - Usage examples

2. **Setup documentation**
   - How to install
   - How to configure
   - How to contribute

3. **Storybook documentation**
   - Component docs
   - Design token reference
   - Accessibility guidelines

4. **Code comments**
   - Complex logic explained
   - Non-obvious decisions documented
   - No comments that restate code

**Output:** Comprehensive documentation

**Claude's role:** Write documentation, ensure completeness.

**Quality check:**
- [ ] READMEs exist
- [ ] Getting started works
- [ ] Storybook has docs pages
- [ ] Complex code is commented

---

### Step 10: Gate Review

**Goal:** Verify readiness for launch or next iteration.

**Checklist:**

**Token System:**
- [ ] All tokens from tokens.json implemented
- [ ] TypeScript types are accurate
- [ ] CSS variables generated
- [ ] Package builds and exports correctly

**Component Library:**
- [ ] All specified components built
- [ ] Components match specifications exactly
- [ ] No magic numbers (tokens only)
- [ ] All states implemented
- [ ] TypeScript strict passes

**Accessibility:**
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Focus states visible
- [ ] Reduced motion respected

**Testing:**
- [ ] Unit tests pass
- [ ] a11y tests pass
- [ ] Coverage meets threshold

**Documentation:**
- [ ] Storybook complete
- [ ] READMEs exist
- [ ] Usage examples provided

**Application:**
- [ ] App shell complete
- [ ] Navigation works
- [ ] Responsive at all breakpoints
- [ ] Loading/error states implemented

**If all boxes checked:** Ready for launch/deployment

**If boxes unchecked:** Address gaps before proceeding

---

## Component Development Checklist

Use this for each component:

```
□ Review spec from 03-ui/components/
□ Create file structure
□ Implement props interface
□ Build base component
□ Implement all variants
□ Implement all states (default, hover, active, focus, disabled)
□ Apply tokens (no raw values)
□ Add accessibility (roles, ARIA, keyboard)
□ Write unit tests
□ Create Storybook story
□ Manual testing
□ Code review
```

---

## Common Pitfalls

### Magic numbers
Every value must come from tokens. If you need a new value, add it to tokens.json first.

### Incomplete states
Every interactive component needs: default, hover, active, focus, disabled at minimum.

### Missing accessibility
Don't skip keyboard support, ARIA labels, or focus management. Test with screen reader.

### Over-engineering
Build what the spec says. Don't add features, abstractions, or "improvements" not in scope.

### Inconsistent patterns
Use the same patterns across components. If Button uses X approach, so should Input.

### Skipping Storybook
Every component needs a story. Stories are documentation and testing in one.

### Poor TypeScript
Use strict mode. Export proper types. Don't use `any`.

---

## Code Patterns

### Component Template

```typescript
// ComponentName.tsx
import { forwardRef } from 'react';
import { styled } from './ComponentName.styles';
import type { ComponentNameProps } from './types';

export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(
  ({ variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <StyledComponent
        ref={ref}
        $variant={variant}
        $size={size}
        {...props}
      >
        {children}
      </StyledComponent>
    );
  }
);

ComponentName.displayName = 'ComponentName';
```

### Token Usage

```typescript
// Using tokens in styled-components
import { tokens } from '@your-org/tokens';

const StyledButton = styled.button`
  padding: ${tokens.spacing[3]} ${tokens.spacing[4]};
  background: ${tokens.color.accent.primary};
  color: ${tokens.color.text.inverse};
  border-radius: ${tokens.radius.md};
  font-size: ${tokens.typography.fontSize.base};
  transition: background ${tokens.motion.duration.fast} ${tokens.motion.easing.default};

  &:hover {
    background: ${tokens.color.accent.primaryHover};
  }

  &:focus-visible {
    outline: 2px solid ${tokens.color.accent.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

### Accessibility Pattern

```typescript
// Accessible component example
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    disabled,
    loading,
    'aria-label': ariaLabel,
    ...props
  }, ref) => {
    return (
      <StyledButton
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        aria-label={ariaLabel}
        {...props}
      >
        {loading && <LoadingSpinner aria-hidden="true" />}
        <span aria-hidden={loading}>{children}</span>
      </StyledButton>
    );
  }
);
```

---

## Technology Recommendations

### Styling
- **CSS-in-JS:** styled-components, emotion
- **Zero-runtime:** vanilla-extract, Linaria
- **Utility-first:** Tailwind (with custom tokens)
- **CSS Modules:** For simpler setups

### Testing
- **Unit:** Vitest or Jest
- **Component:** Testing Library
- **a11y:** jest-axe
- **E2E:** Playwright or Cypress

### Documentation
- **Components:** Storybook
- **API:** TypeDoc
- **General:** Markdown in repo

### Build
- **Bundler:** tsup, Rollup, or Vite
- **Types:** TypeScript
- **Monorepo:** pnpm workspaces, Turborepo, or Nx

---

## Session Templates

### Session 1: Foundation (2-3 hours)
1. Project setup (45 min)
2. Token system (60 min)
3. Base styles (30 min)
4. Component library foundation (45 min)

### Session 2+: Components (2-4 hours each)
1. Review specs for session's components
2. Implement 2-4 components depending on complexity
3. Write tests and stories
4. Review and refine

### Final Session: Polish (2-3 hours)
1. Testing & accessibility audit (60 min)
2. Documentation (45 min)
3. Gate review (30 min)
4. Address any gaps

---

## Completion Checklist

```
□ Step 1: Project setup complete
□ Step 2: Token system implemented
□ Step 3: Base styles configured
□ Step 4: Component library foundation ready
□ Step 5: All components built
□ Step 6: Storybook configured
□ Step 7: Application shell created
□ Step 8: Testing complete
□ Step 9: Documentation complete
□ Step 10: Gate review passed
```

**Phase 04 complete. Product is ready for deployment.**

---

*This SOP governs the Development phase. Reference MAGENTA.md for design decisions and component specs for implementation details.*
