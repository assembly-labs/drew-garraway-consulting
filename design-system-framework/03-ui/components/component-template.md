# Component: [Component Name]

> **Status:** Template — Copy for each component specification

---

## Overview

**Component name:** [e.g., Button, Input, Card]
**Category:** [Primitive / Composite / Pattern]
**Related components:** [Components this works with]

---

## Purpose

**What it does:**
[Clear description of component purpose]

**When to use:**
- [Use case 1]
- [Use case 2]
- [Use case 3]

**When NOT to use:**
- [Anti-use case 1]
- [Anti-use case 2]

---

## Anatomy

```
┌─────────────────────────────────────────┐
│  [Icon]  [Label]  [Trailing element]    │
│                                         │
│  ← Leading    Content    Trailing →     │
└─────────────────────────────────────────┘
```

| Part | Required | Description |
|------|----------|-------------|
| [Part 1] | Yes/No | [What it is] |
| [Part 2] | Yes/No | [What it is] |
| [Part 3] | Yes/No | [What it is] |

---

## Variants

### [Variant 1: e.g., Primary]

**Use when:** [When to use this variant]

**Visual:**
- Background: `[token]`
- Text: `[token]`
- Border: `[token or none]`

---

### [Variant 2: e.g., Secondary]

**Use when:** [When to use this variant]

**Visual:**
- Background: `[token]`
- Text: `[token]`
- Border: `[token]`

---

### [Variant 3: e.g., Ghost/Tertiary]

**Use when:** [When to use this variant]

**Visual:**
- Background: `transparent`
- Text: `[token]`
- Border: `none`

---

### [Variant 4: e.g., Destructive]

**Use when:** [When to use this variant]

**Visual:**
- Background: `color.status.error`
- Text: `color.text.inverse`
- Border: `none`

---

## Sizes

| Size | Height | Padding | Font Size | Icon Size | Use Case |
|------|--------|---------|-----------|-----------|----------|
| sm | [value] | `spacing.[x]` | `typography.fontSize.sm` | 16px | [When] |
| md | [value] | `spacing.[x]` | `typography.fontSize.base` | 20px | [When] |
| lg | [value] | `spacing.[x]` | `typography.fontSize.lg` | 24px | [When] |

**Default size:** [md]

---

## States

### Default
- Background: `[token]`
- Text: `[token]`
- Border: `[token]`
- Cursor: `pointer`

### Hover
- Background: `[token]` (or opacity change)
- Transition: `motion.duration.fast` `motion.easing.default`

### Active/Pressed
- Background: `[token]` (darker/lighter)
- Transform: [if any, e.g., scale(0.98)]

### Focus
- Outline: `[focus ring specification]`
- Outline offset: `[value]`
- Must be visible on all backgrounds

### Disabled
- Opacity: `0.5` or specific colors
- Cursor: `not-allowed`
- No hover/active effects

### Loading (if applicable)
- Show loading indicator
- Disable interaction
- [Specific behavior]

---

## Token Usage

### Colors by Variant

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `color.accent.primary` | `color.text.inverse` | none |
| Secondary | `color.surface.subtle` | `color.text.primary` | `color.border.default` |
| Ghost | transparent | `color.accent.primary` | none |
| Destructive | `color.status.error` | `color.text.inverse` | none |

### Spacing

| Property | Token |
|----------|-------|
| Padding horizontal | `spacing.[x]` |
| Padding vertical | `spacing.[x]` |
| Gap (icon to label) | `spacing.[x]` |

### Typography

| Property | Token |
|----------|-------|
| Font family | `typography.fontFamily.sans` |
| Font size | `typography.fontSize.[size]` |
| Font weight | `typography.fontWeight.medium` |

### Other

| Property | Token |
|----------|-------|
| Border radius | `radius.[x]` |
| Transition | `motion.duration.fast` `motion.easing.default` |

---

## Behavior

### Interaction

| Trigger | Action | Result |
|---------|--------|--------|
| Click/Tap | [Action] | [Result] |
| Keyboard Enter/Space | [Action] | [Result] |
| Hover | Visual feedback | [State change] |

### With icons

- Icon size matches font size (or specified)
- Icon color inherits text color
- Gap between icon and label: `spacing.[x]`

### Full width

- [ ] Supports `fullWidth` prop
- When full width: width = 100%, text centered

### Loading state

- [ ] Shows spinner/loading indicator
- [ ] Text may be hidden or shown
- [ ] Prevents interaction

---

## Content Guidelines

### Label text
- Use action verbs: "Save", "Submit", "Create"
- Keep short: 1-3 words
- Sentence case

### With icons
- Icon should reinforce, not replace, meaning
- Don't use icon-only without accessible label

### Examples

| Good | Bad |
|------|-----|
| "Save changes" | "Click here" |
| "Create account" | "Submit" |
| "Delete" | "Proceed with deletion" |

---

## Accessibility

### Keyboard

| Key | Action |
|-----|--------|
| Tab | Focus component |
| Enter | Activate |
| Space | Activate |

### Screen Reader

- Role: `button`
- Accessible name: [Label text or aria-label]
- State announcements: [disabled, loading, etc.]

### Requirements

- [ ] Focusable with keyboard
- [ ] Visible focus indicator
- [ ] Sufficient color contrast
- [ ] Touch target ≥ 44×44px
- [ ] Disabled state prevents interaction

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile | [Any changes] |
| Tablet | [Any changes] |
| Desktop | [Default behavior] |

---

## Do / Don't

### Do
- [Specific guidance]
- [Specific guidance]
- [Specific guidance]

### Don't
- [Specific anti-pattern]
- [Specific anti-pattern]
- [Specific anti-pattern]

---

## Examples

### Basic Usage
```
[Visual or code representation]
```

### With Icon
```
[Visual or code representation]
```

### Loading State
```
[Visual or code representation]
```

---

## Related Components

| Component | Relationship |
|-----------|--------------|
| [Component 1] | [How they relate] |
| [Component 2] | [How they relate] |

---

## Changelog

| Date | Change |
|------|--------|
| [Date] | Initial specification |

---

*Specification complete. Ready for development in Phase 04.*
