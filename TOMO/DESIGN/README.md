# TOMO Design Assets

Central hub for all TOMO design resources — icons, brand, style guide.

---

## Icons (469 SVGs)

**Source:** [Lucide Icons](https://github.com/lucide-icons/lucide)
**License:** ISC (MIT-compatible) — free for commercial use, no attribution required
**Style:** 24x24 grid, 2px stroke, outline style — matches Apple SF Symbols / Peloton aesthetic

### How to Use

1. Browse the categorized folders in `icons/`
2. Pick the ones you want for the app
3. Move winners to a `icons/_selected/` folder (or just note the names)
4. Convert to React Native SVG components in `tomo/src/components/Icons.tsx`

### Categories

| Folder | Count | What's Inside |
|--------|-------|---------------|
| `01-navigation` | 45 | Arrows, chevrons, menu, expand, links, home, back |
| `02-session-logging` | 47 | Mic, audio, play/stop, save, check, clipboard, pencil |
| `03-training-fitness` | 61 | Dumbbell, trophy, target, charts, shield, flame, recovery |
| `04-bjj-combat` | 31 | Locks, grips, rotate, skull, layers, radar, scan |
| `05-profile-settings` | 50 | User, settings, bell, eye, lock, mail, camera, badge |
| `06-insights-analytics` | 45 | Brain, lightbulb, charts, trending, message, book, signal |
| `07-status-feedback` | 33 | Check/x variants, alerts, loader, wifi, cloud, thumbs |
| `08-gym-location` | 30 | Map pins, building, navigate, compass, locate, route |
| `09-data-content` | 37 | Files, folders, clipboard, trash, download, bookmark, tag |
| `10-communication` | 26 | Messages, mail, send, reply, phone, video, megaphone |
| `11-time-calendar` | 32 | Clocks (1-12), timer, alarm, calendar variants, hourglass |
| `12-misc-delight` | 32 | Sparkles, heart, sun/moon, coffee, smile faces, gem |

### Re-pulling Icons

```bash
cd DESIGN/icons && bash pull-icons.sh
```

---

## Brand

Copies of TOMO brand voice docs (originals in `docs/brand/`):

- `BRAND_VOICE_GUIDE.md` — Personality, tone, writing rules
- `instructor-influence-matrix.md` — BJJ instructor style analysis
- `index.html` — Interactive brand presentation

---

## Style Guide

Copies of TOMO design system docs (originals in `docs/design-system/`):

- `tokens.md` — Colors, typography, spacing, component tokens
- `styles.css` — Production CSS with all tokens
- `README.md` — Design system overview
- `icons.html` — Current 95+ icon library (prototype era)
- `typography.html` — Font demonstrations
- `logo-test.html` — Logo explorations

---

## TOMO Design Principles (Non-Negotiable)

1. **NO EMOJIS** — SVG lineart icons only
2. **Dark theme** — `#111111` background, gold `#F5A623` accent
3. **Large typography** — Hero numbers up to 144-180px
4. **Semantic colors** — GREEN = positive, RED = negative (never swap)
5. **Font weight 500+** — Never use weight 400 on dark backgrounds
6. **12px minimum** — Nothing smaller, ever
7. **Unbounded + Inter + JetBrains Mono** — Headlines / body / labels
