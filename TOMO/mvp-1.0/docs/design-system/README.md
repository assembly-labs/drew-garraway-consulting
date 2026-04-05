# Design System

> **THIS IS THE SOURCE OF TRUTH**
>
> All design decisions, tokens, and components are defined here. The rest of the codebase implements this system. Changes flow FROM here TO the code, never the reverse.

**BJJ Progress Tracker Design System Documentation**

This folder contains the complete design system for the BJJ Progress Tracker app. Use these resources to ensure visual consistency, accessibility, and brand alignment across all UI development.

---

## Contents

| File | Purpose |
|------|---------|
| `tokens.md` | **Primary reference** - Complete design token documentation |
| `styles.css` | Production-ready CSS implementing all design tokens and components |
| `index.html` | Interactive design system browser (open in browser to explore) |
| `icons.html` | Full icon library (95+ icons) |
| `typography.html` | Typography demonstrations |
| `script.js` | Tab navigation and interactive functionality |

---

## Propagation Workflow

When the design system changes, updates flow in this order:

```
/internal-docs/design-system/tokens.md      ← DEFINE HERE FIRST
                ↓
/internal-docs/design-system/styles.css     ← Update CSS second
                ↓
/prototype/src/index.css                    ← Sync to prototype
                ↓
/prototype/src/config/design-tokens.ts      ← Update TypeScript tokens
                ↓
Component inline styles                      ← Uses tokens automatically
```

### How to Make Design Changes

1. **Define the change** in `tokens.md` (document the token)
2. **Implement in CSS** in `styles.css` (add the CSS variable)
3. **Sync to prototype** - Update `/prototype/src/index.css`
4. **Update TypeScript** - Update `/prototype/src/config/design-tokens.ts`
5. **Update CLAUDE.md** if it's a key token referenced there

### Files That Reference This System

| File | Purpose | Update Required |
|------|---------|-----------------|
| `/CLAUDE.md` | Project context for Claude | Summary only |
| `/.claude/design-system-rules.md` | Detailed guardrails for Claude | Key rules |
| `/prototype/src/index.css` | Production CSS | Full sync |
| `/prototype/src/config/design-tokens.ts` | TypeScript tokens | Full sync |

---

## How to Use

### For Claude (AI Assistant)
1. **Read `tokens.md` before any UI work** - Contains all valid values
2. **Never invent values** - If it's not in the design system, ask first
3. **Follow `/.claude/design-system-rules.md`** - Mandatory guardrails

### For Designers
1. Open `index.html` in a browser to explore the complete design system
2. Navigate through the tabs: **Foundations**, **Components**, **Patterns**, **Motion**
3. Reference `tokens.md` for design token values when creating mockups

### For Developers
1. Import styles from `styles.css` or use CSS custom properties
2. Use TypeScript tokens from `/prototype/src/config/design-tokens.ts`
3. Use the component classes documented in the Components tab
4. Follow the mobile-first responsive patterns in the Foundations tab

### For Content/Copy
1. Navigate to the **Voice & Copy** tab in `index.html`
2. Reference terminology guidelines and copy examples
3. Cross-reference with `/brand-voice-and-philosophy/` for complete voice documentation

---

## Key Design Decisions

### Color Palette
- **Primary:** Softened Black (#111111) - better readability than pure black
- **Accent:** Alliance Gold (#F5A623)
- **Positive:** Green (#22c55e) - wins, submissions, streaks
- **Negative:** Red (#ef4444) - losses, taps, weaknesses
- **Belt colors:** Authentic IBJJF belt progression colors

### Typography
- **Fonts:** Inter (headings/body) + JetBrains Mono (labels/data)
- **Scale:** 12px (xs) → 180px (mega)
- **Minimum weight:** 500 (Medium) - weight 400 is prohibited
- **Minimum size:** 12px - nothing smaller, ever

### Touch Targets
- **Standard:** 44px minimum (WAI guidelines)
- **Post-training entry:** 56-80px (for fatigued users)
- **Primary actions:** 64px minimum

### Responsive Breakpoints
- **Base:** Mobile-first (< 768px)
- **Tablet:** 768px+
- **Desktop:** 1024px+
- **Large:** 1280px+

---

## Design Principles (Non-Negotiable)

1. **NO EMOJIS** — Use SVG lineart icons from Icons.tsx only
2. **Dark Theme** — #111111 background with gold accents
3. **Large Typography** — Hero numbers up to 144-180px
4. **Semantic Colors** — GREEN = positive, RED = negative (never swap)
5. **Full-Bleed Sections** — Minimal rounded corners, gradient backgrounds
6. **Inter + JetBrains Mono** — Maximum legibility for exhausted users
7. **Font Weight 500+ Only** — Weight 400 is PROHIBITED
8. **12px Minimum Font Size** — Nothing smaller, ever
9. **Mobile-first, post-training aware** — Users log sessions after exhausting training
10. **Accessibility-first** — High contrast, large touch targets, WCAG AA compliant

---

## Related Documentation

| File | Purpose |
|------|---------|
| `/CLAUDE.md` | Project context with design system summary |
| `/.claude/design-system-rules.md` | Mandatory guardrails for Claude |
| `/prototype/src/index.css` | Production CSS implementation |
| `/prototype/src/config/design-tokens.ts` | TypeScript token exports |
| `/prototype/src/components/ui/Icons.tsx` | 95+ SVG icon components |
| `/internal-docs/brand-voice-and-philosophy/` | Voice and copy guidelines |

---

*Last Updated: December 2024*
