# Design System Rules for Claude

> **This file contains mandatory rules Claude MUST follow when making any UI changes.**
>
> Source of truth: `/internal-docs/design-system/`

---

## Before Making ANY UI Change

1. **Read the design system first:**
   - `/internal-docs/design-system/tokens.md` - For correct token values
   - `/internal-docs/design-system/styles.css` - For existing CSS classes

2. **Never invent values.** If a color, spacing, or typography value isn't in the design system, it doesn't exist. Ask the user if you need something new.

3. **Use existing patterns.** Check if a similar component already exists before creating new CSS.

---

## Absolute Prohibitions

### Typography
- **NEVER use font-weight 400 (Regular)** - Minimum is 500 (Medium)
- **NEVER use font sizes below 12px** - The `--text-xs` token is the minimum
- **NEVER use fonts other than Inter or JetBrains Mono**

### Colors
- **NEVER use emojis** - Always use Icons component
- **NEVER invent new hex colors** - Use existing CSS variables
- **NEVER swap semantic colors** - Green is ALWAYS positive, Red is ALWAYS negative
- **NEVER use pure black (#000000) for backgrounds** - Use #111111 (`--color-black`)

### Spacing & Layout
- **NEVER use arbitrary pixel values** - Use `--space-*` tokens
- **NEVER make touch targets smaller than 44px**
- **NEVER add unnecessary border-radius** - Sharp edges are intentional

### Motion
- **NEVER add entrance animations** - Users are exhausted
- **NEVER add hover-only interactions** - Mobile-first
- **ALWAYS respect `prefers-reduced-motion`**

---

## Required Patterns

### When Adding a New Component

1. Check if a similar class exists in `/internal-docs/design-system/styles.css`
2. Use CSS variables for ALL colors, spacing, and typography
3. Include focus states for accessibility
4. Ensure minimum 44px touch targets

### When Modifying Existing Components

1. Check current implementation matches design system
2. If it doesn't, update to match design system first
3. Then make the requested change

### When Adding Icons

```tsx
// CORRECT
import { Icons } from '@/components/ui/Icons';
<Icons.Check size={24} />

// WRONG - Never use emojis
<span>✓</span>
```

### When Adding Text

```tsx
// CORRECT - Using design tokens
<p style={{
  fontSize: 'var(--text-base)',      // 15px
  fontWeight: 500,                    // Medium minimum
  color: 'var(--color-gray-100)'     // Readable on dark
}}>

// WRONG - Arbitrary values
<p style={{ fontSize: '14px', fontWeight: 400, color: '#888' }}>
```

### When Adding Colors

```tsx
// CORRECT - Semantic colors
<div style={{ color: 'var(--color-positive)' }}>+5 Submissions</div>
<div style={{ color: 'var(--color-negative)' }}>-3 Losses</div>

// WRONG - Swapped semantics or arbitrary colors
<div style={{ color: 'red' }}>+5 Submissions</div>  // Never use red for positive
<div style={{ color: '#22ff22' }}>Success</div>     // Arbitrary green
```

---

## Token Quick Reference

### Colors
| Token | Value | Use For |
|-------|-------|---------|
| `--color-black` | #111111 | Background |
| `--color-gold` | #F5A623 | Accent, CTAs |
| `--color-positive` | #22c55e | Wins, success, streaks |
| `--color-negative` | #ef4444 | Losses, errors, taps |
| `--color-gray-100` | #f5f5f5 | Primary text |
| `--color-gray-400` | #b3b3b3 | Muted text |
| `--color-gray-800` | #1f1f1f | Card backgrounds |

### Typography
| Token | Size | Usage |
|-------|------|-------|
| `--text-xs` | 12px | Minimum allowed |
| `--text-sm` | 13px | Secondary text |
| `--text-base` | 15px | Body text |
| `--text-lg` | 17px | Key information |
| `--text-xl` | 22px | Headings |
| `--text-hero` | 144px | Hero numbers |

### Font Weights
| Weight | Usage | Status |
|--------|-------|--------|
| 400 | None | PROHIBITED |
| 500 | Body text | Required minimum |
| 600 | Subheadings | OK |
| 700 | Emphasis | OK |
| 800 | Headlines | Preferred |

### Spacing
| Token | Value |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

---

## Propagation Workflow

When the design system changes, updates flow in this order:

```
/internal-docs/design-system/styles.css  (SOURCE OF TRUTH)
           ↓
/prototype/src/index.css                 (Implementation)
           ↓
/prototype/src/config/design-tokens.ts   (TypeScript access)
           ↓
Component inline styles                   (Uses tokens)
```

### If You Need to Add a New Token

1. **Ask the user first** - Don't invent design tokens
2. Add to `/internal-docs/design-system/tokens.md`
3. Add to `/internal-docs/design-system/styles.css`
4. Sync to `/prototype/src/index.css`
5. Update `/prototype/src/config/design-tokens.ts`

---

## Validation Checklist

Before completing any UI work, verify:

- [ ] No font-weight below 500
- [ ] No font-size below 12px
- [ ] No arbitrary hex colors (all use CSS variables)
- [ ] No emojis (all use Icons component)
- [ ] Green used for positive outcomes only
- [ ] Red used for negative outcomes only
- [ ] Touch targets are 44px minimum
- [ ] All spacing uses `--space-*` tokens
- [ ] Focus states are visible
- [ ] Motion respects reduced-motion preference

---

## Related Files

- **Full documentation:** `/internal-docs/design-system/tokens.md`
- **CSS source:** `/internal-docs/design-system/styles.css`
- **Interactive browser:** `/internal-docs/design-system/index.html`
- **Icon library:** `/internal-docs/design-system/icons.html`
- **Typography showcase:** `/internal-docs/design-system/typography.html`
