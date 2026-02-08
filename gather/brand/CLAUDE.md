# Gather Brand — Claude Context

## What This Folder Contains

This is the **single source of truth** for Gather's brand identity, voice, and visual design system. All UI development, copywriting, and product decisions should reference this guide.

**Primary Document:** `BRAND_GUIDE.md`

---

## Quick Reference

### Brand Voice: "Mr. Rogers with a farmers market booth"

- **Warm and personal** — Talk to people like neighbors, not customers
- **Gently rebellious** — State simple truths, don't attack corporations directly
- **Affirming** — Celebrate the choice to shop local

**Tagline:** Good things from good people.

### Voice Do's and Don'ts

| Do | Don't |
|---|---|
| "Real food from real neighbors" | "Leveraging synergies in local food ecosystems" |
| "You deserve to know what's in your food" | "Our platform enables supply chain transparency" |
| Use contractions (you're, it's) | Sound corporate or stiff |
| Reference tangible things (tomatoes, Saturday mornings) | Use abstract marketing language |

---

## Design System Overview

### Three Experiences, One System

| Experience | Style | Font | Target |
|---|---|---|---|
| Manager Dashboard | Notion-clean, data-dense | Inter 14px | Keyboard-first professionals |
| Consumer Marketplace | Instacart-fresh, image-forward | DM Sans 16px | Mobile-first shoppers |
| Vendor Portal | WhatsApp-simple, high-contrast | System 18px | Outdoor/field use |

### Primary Colors

```css
--sage-500: #4A7C28;    /* Primary accent */
--sage-700: #2D5016;    /* Primary action (dashboard) */
--gold-300: #FFB74D;    /* Golden hour warmth */
--mint-500: #3DDC97;    /* Success */
--coral-500: #FF6B6B;   /* Error */
```

### Key Gradients

```css
--gradient-golden: linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%);
--gradient-field: linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%);
```

---

## When to Reference BRAND_GUIDE.md

1. **Writing any user-facing copy** — Check voice guidelines and tone by audience
2. **Building UI components** — Use specified colors, spacing, radii, shadows
3. **Choosing fonts/sizes** — Different specs for each platform (dashboard vs marketplace vs vendor)
4. **Implementing buttons, cards, forms** — Detailed component specs provided
5. **Adding animations** — Motion tokens and accessibility requirements defined

---

## Accessibility Requirements

- **Touch targets:** 44px min (dashboard/marketplace), 56px min (vendor)
- **Color contrast:** WCAG AA (4.5:1 body, 3:1 large text)
- **Focus states:** `outline: 2px solid --sage-500; outline-offset: 2px`
- **Reduced motion:** Respect `prefers-reduced-motion: reduce`

---

## Files in This Folder

| File | Purpose |
|---|---|
| `BRAND_GUIDE.md` | Complete brand guide — identity, voice, design system, components |
| `CLAUDE.md` | This file — quick reference for Claude/developers |

---

## Important Notes

- This guide supersedes the older `/design-system/DESIGN_SYSTEM.md` — use this for all new development
- The brand guide includes Tailwind config extensions and React component patterns
- Voice guidelines apply to ALL user-facing text: UI labels, error messages, emails, marketing
