# Code Review Checklist

> **Status:** Template — Use during 04-Development phase

Use this checklist when reviewing component PRs. Every item should be verified before merge.

---

## How to Use This Checklist

1. Copy the relevant section to your PR review
2. Check each item as you verify it
3. Note any issues with specific line references
4. All items must pass for merge approval

---

## Component Review Checklist

### Specification Compliance

```
□ Component matches specification in 03-ui/components/
□ All specified variants implemented
□ All specified sizes implemented (if applicable)
□ All states implemented:
  □ Default
  □ Hover
  □ Active/Pressed
  □ Focus
  □ Disabled
  □ Loading (if applicable)
  □ Error (if applicable)
□ Props match specification exactly
□ Behavior matches specification
```

### Token Usage

```
□ NO magic numbers (hardcoded values)
□ All colors from tokens.color.*
□ All spacing from tokens.spacing.*
□ All typography from tokens.typography.*
□ All radii from tokens.radius.*
□ All shadows from tokens.shadow.*
□ All motion from tokens.motion.*
□ If a value isn't in tokens and is needed, tokens.json was updated
```

### Code Quality

```
□ TypeScript strict mode passes
□ No 'any' types (unless genuinely necessary with justification)
□ Props interface is complete and accurate
□ Props have JSDoc comments
□ Component uses forwardRef pattern
□ displayName is set
□ No console.log statements
□ No commented-out code
□ No TODO comments (or they have ticket references)
□ File size reasonable (< 300 lines per file)
```

### Styling

```
□ Styles are in separate .styles.ts file
□ Transient props use $ prefix (styled-components)
□ Consistent with other component styling patterns
□ No inline styles (except dynamic values)
□ Responsive behavior implemented (if specified)
□ Reduced motion respected (@media (prefers-reduced-motion))
□ Transitions use tokens.motion values
```

### Accessibility

```
□ Correct semantic HTML element
□ ARIA attributes present where needed
□ aria-label provided for icon-only elements
□ Role attribute only if necessary
□ Keyboard accessible:
  □ Focusable with Tab
  □ Activates with Enter/Space (for buttons)
  □ Escape closes (for overlays)
□ Focus is visible on all backgrounds
□ Focus is trapped (for modals/dialogs)
□ Content readable by screen reader
□ Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
□ Touch target minimum 44x44px
```

### Testing

```
□ Test file exists
□ Tests cover:
  □ Basic rendering
  □ All variants render correctly
  □ All states render correctly
  □ Event handlers are called
  □ Disabled state prevents interaction
  □ Keyboard interaction works
□ Accessibility test included (jest-axe)
□ No snapshot tests (unless truly necessary)
□ Tests are meaningful (not just for coverage)
□ All tests pass
```

### Storybook

```
□ Story file exists
□ Story title follows naming convention
□ All variants have stories
□ All states demonstrated
□ Controls configured for interactive props
□ Component documentation present
□ Story renders without errors
□ a11y addon shows no violations
```

### Documentation

```
□ Props documented with JSDoc
□ README updated (if package-level changes)
□ Complex logic has explanatory comments
□ Usage examples provided (in Storybook)
```

---

## Token Package Review Checklist

```
□ tokens.ts matches tokens.json
□ Types are accurate
□ CSS generation works correctly
□ Utility functions work
□ Package builds without errors
□ Exports are correct
□ No breaking changes (or versioned appropriately)
```

---

## Application Code Review Checklist

### Component Usage

```
□ Only uses components from @your-org/ui
□ No custom one-off styling
□ Props used correctly
□ Correct component for use case
```

### Layout

```
□ Uses layout components (Box, Flex, Grid)
□ Spacing uses tokens
□ Responsive behavior works
□ No layout shift
```

### Data Handling

```
□ Loading states implemented
□ Error states implemented
□ Empty states implemented
□ Skeleton/placeholder during load
```

### Accessibility

```
□ Page title set
□ Heading hierarchy correct (h1 → h2 → h3)
□ Skip link present (if applicable)
□ Focus management correct
□ Announcements for dynamic content
```

---

## PR Description Requirements

Every PR should include:

```markdown
## What

[Brief description of changes]

## Why

[Reason for changes, link to spec or ticket]

## How

[Implementation approach if non-obvious]

## Testing

[How to test the changes]

## Screenshots

[If visual changes]

## Checklist

- [ ] Spec compliance verified
- [ ] No magic numbers
- [ ] Accessibility tested
- [ ] Tests pass
- [ ] Storybook story added
```

---

## Review Response Guide

### Requesting Changes

Be specific and actionable:

```markdown
**Issue:** Line 45 - Magic number detected
**Problem:** `padding: '12px'` uses raw value
**Fix:** Use `tokens.spacing[3]` instead
```

### Approving

Confirm verification:

```markdown
✅ Reviewed against spec
✅ Token usage verified
✅ Accessibility tested
✅ Tests pass
✅ Story renders correctly

LGTM
```

---

## Common Issues to Watch For

### Token Violations

```typescript
// ❌ Wrong
background: '#6366f1'
padding: '16px'
fontSize: '14px'

// ✅ Right
background: ${tokens.color.accent.primary}
padding: ${tokens.spacing[4]}
fontSize: ${tokens.typography.fontSize.sm}
```

### Accessibility Gaps

```typescript
// ❌ Missing aria-label
<button onClick={onClose}><CloseIcon /></button>

// ✅ Has accessible name
<button onClick={onClose} aria-label="Close dialog"><CloseIcon /></button>
```

### Incomplete States

```typescript
// ❌ Missing focus state
&:hover { ... }

// ✅ Complete states
&:hover:not(:disabled) { ... }
&:focus-visible { outline: ... }
&:disabled { opacity: 0.5; cursor: not-allowed; }
```

### Poor TypeScript

```typescript
// ❌ Lazy typing
const handleClick = (e: any) => { ... }

// ✅ Proper typing
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => { ... }
```

---

## Merge Criteria

A PR can be merged when:

1. **All checklist items pass**
2. **Tests pass in CI**
3. **At least one approval from reviewer**
4. **No unresolved comments**
5. **Branch is up to date with main**

---

*Quality is non-negotiable. Review thoroughly.*
