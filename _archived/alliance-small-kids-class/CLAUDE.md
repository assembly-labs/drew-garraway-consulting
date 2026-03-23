# Alliance Small Kids Class

## What This Is

A curriculum proposal page for Alliance BJJ Paoli's kids program (ages 4-8). Single-page static site presenting the class structure, warm-ups, games, and learning objectives.

**Not indexed by search engines** - This is a private proposal document.

## Tech Stack

- **Framework:** Static HTML
- **Build:** None
- **Styling:** Inline CSS (TOMO Design System)
- **Deployment:** Cloudflare Pages

## Design System

Uses the **TOMO Design System** - a bold, dark, editorial design inspired by Linear/Palantir.

### Core Principles

1. **Dark Theme** - #111111 background with gold (#F5A623) accents
2. **Font Weight 500+ only** - No thin fonts for readability
3. **12px minimum font size** - Nothing smaller
4. **Monospace labels** - JetBrains Mono for eyebrows and labels
5. **No rounded corners** - Sharp, editorial aesthetic

### Typography

| Type | Font | Weight | Usage |
|------|------|--------|-------|
| Headlines | Unbounded | 700-800 | Page title, section headers |
| Body | Inter | 500-600 | All body text |
| Labels | JetBrains Mono | 600 | Eyebrows, hints, footer |

### Color Palette

| Use | Color | Hex |
|-----|-------|-----|
| Background | Softened black | `#111111` |
| Text | White | `#ffffff` |
| Accent | Gold | `#F5A623` |
| Secondary text | Gray | `#b3b3b3` |
| Card backgrounds | Dark gray | `#161616` |
| Borders | Gray | `#1f1f1f` |

### Components

- **Philosophy callout** - Gold gradient background with gold left border
- **Content boxes** - Gray-900 background with gray left border
- **Highlight box** - Solid gold background with black text
- **Class structure** - Gray-900 with gold monospace headers
- **Modal** - Gray-900 with gold border accent

## Features

- Interactive warm-up and game descriptions (click to expand modal)
- Print-friendly styles
- Mobile responsive
- Keyboard accessible (Escape to close modal)
- **Not searchable** - `noindex, nofollow` meta tags

## File Structure

```
alliance-small-kids-class/
├── index.html    # Single-page site with inline styles
└── CLAUDE.md     # This file
```

## Deployment

Auto-deploys via Cloudflare Pages on push to main.

Manual deployment:
```bash
wrangler pages deploy . --project-name=alliance-small-kids-class
```

## Content Overview

1. **The Approach** - Philosophy of positions > attacks for young kids
2. **50-Minute Class Structure** - Detailed breakdown of each class segment
3. **Warm-ups & Games** - Interactive list with descriptions
4. **What Students Will Learn** - Defensive and offensive skills overview
