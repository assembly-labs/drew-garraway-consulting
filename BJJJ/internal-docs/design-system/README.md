# Design System

**BJJ Progress Tracker Design System Documentation**

This folder contains the complete design system for the BJJ Progress Tracker app. Use these resources to ensure visual consistency, accessibility, and brand alignment across all UI development.

---

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Interactive design system browser (open in browser to explore) |
| `styles.css` | Production-ready CSS implementing all design tokens and components |
| `script.js` | Tab navigation and interactive functionality for the design system browser |
| `tokens.md` | Design token reference (colors, typography, spacing) |

---

## How to Use

### For Designers
1. Open `index.html` in a browser to explore the complete design system
2. Navigate through the 4 tabs: **Foundations**, **Components**, **Patterns**, **Voice & Copy**
3. Reference `tokens.md` for design token values when creating mockups

### For Developers
1. Import `styles.css` into your project or reference the CSS custom properties
2. Use the component classes documented in the Components tab
3. Follow the mobile-first responsive patterns in the Foundations tab

### For Content/Copy
1. Navigate to the **Voice & Copy** tab in `index.html`
2. Reference terminology guidelines and copy examples
3. Cross-reference with `/brand-voice-and-philosophy/` for complete voice documentation

---

## Key Design Decisions

### Color Palette
- **Primary:** Alliance BJJ Black (#0a0a0a)
- **Accent:** Alliance Gold (#d4af37)
- **Backgrounds:** Dark (#121212), Surface (#1a1a1a)
- **Belt colors:** Authentic IBJJF belt progression colors

### Typography
- **Font:** Inter (Google Fonts)
- **Scale:** 12px (xs) → 48px (4xl)
- **Approach:** Mobile-first responsive sizing

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

## Design Principles

1. **Mobile-first, post-training aware** — Users log sessions after exhausting training
2. **Tap-first input** — Presets over text entry wherever possible
3. **Belt-aware theming** — Colors and feedback respect BJJ culture
4. **Accessibility-first** — High contrast, large touch targets, clear hierarchy

---

## Related Documentation

- `/brand-voice-and-philosophy/` — Complete voice and copy guidelines
- `/FEATURE_TRACKER.md` — Design decisions log with rationale
- `/prototype/` — Working React prototype implementing this system

---

*Last Updated: December 2024*
