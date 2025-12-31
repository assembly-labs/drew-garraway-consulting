# BJJ Journal Design System

Bold, dark, editorial design system. Linear/Palantir inspired aesthetic.

---

## Design Principles

1. **NO EMOJIS** - Use SVG lineart icons only
2. **Dark Theme** - #111111 background (softened from pure black) with gold accents
3. **Large Typography** - Hero numbers up to 144px-180px
4. **Semantic Colors** - GREEN = positive, RED = negative
5. **Full-Bleed Sections** - No rounded corners, gradient backgrounds
6. **Inter + JetBrains Mono** - Maximum legibility for exhausted users
7. **Medium Font Weight** - Body text uses 500 weight for better readability
8. **Lightened Grays** - All gray values lifted for better contrast on dark backgrounds
9. **12px Minimum Font Size** - Nothing smaller than 12px for mobile readability

---

## Color Tokens

### Primary Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-black` | `#111111` | Primary background (softened for readability) |
| `--color-white` | `#FFFFFF` | Primary text |
| `--color-gold` | `#F5A623` | Accent color |
| `--color-gold-dim` | `rgba(245, 166, 35, 0.15)` | Gold backgrounds |
| `--color-gold-glow` | `rgba(245, 166, 35, 0.25)` | Gold radial glows |

### Semantic Colors (Positive/Negative)

Use GREEN for positive outcomes (wins, submissions landed, progress).
Use RED for negative outcomes (losses, times tapped, weaknesses).

| Token | Value | Usage |
|-------|-------|-------|
| `--color-positive` | `#22c55e` | Wins, submissions, streaks |
| `--color-positive-dim` | `rgba(34, 197, 94, 0.15)` | Green backgrounds |
| `--color-positive-glow` | `rgba(34, 197, 94, 0.25)` | Green radial glows |
| `--color-negative` | `#ef4444` | Losses, taps, weaknesses |
| `--color-negative-dim` | `rgba(239, 68, 68, 0.15)` | Red backgrounds |
| `--color-negative-glow` | `rgba(239, 68, 68, 0.25)` | Red radial glows |
| `--color-warning` | `#f59e0b` | Warnings |
| `--color-info` | `#3b82f6` | Information |

### Grayscale Palette

All grays are lightened for better contrast on dark backgrounds.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gray-100` | `#f5f5f5` | Primary text on dark |
| `--color-gray-200` | `#e5e5e5` | Secondary text on dark |
| `--color-gray-300` | `#d4d4d4` | Tertiary text - readable on dark |
| `--color-gray-400` | `#b3b3b3` | Muted text (lightened from #a3a3a3) |
| `--color-gray-500` | `#8b8b8b` | Labels (lightened from #6b7280) |
| `--color-gray-600` | `#6b6b6b` | Secondary labels (lightened from #525252) |
| `--color-gray-700` | `#4a4a4a` | Borders (lightened from #404040) |
| `--color-gray-800` | `#1f1f1f` | Card backgrounds (lightened from #1a1a1a) |
| `--color-gray-900` | `#161616` | Elevated surfaces (lightened from #0f0f0f) |

### Belt Colors (Industry Standard)

| Token | Value | Belt |
|-------|-------|------|
| `--color-belt-white` | `#FFFFFF` | White belt |
| `--color-belt-blue` | `#0033A0` | Blue belt |
| `--color-belt-purple` | `#4B0082` | Purple belt |
| `--color-belt-brown` | `#8B4513` | Brown belt |
| `--color-belt-black` | `#000000` | Black belt |

### Training Type Colors

| Token | Value | Type |
|-------|-------|------|
| `--color-training-gi` | `#3B82F6` | Gi training |
| `--color-training-nogi` | `#F97316` | No-Gi training |
| `--color-training-openmat` | `#A855F7` | Open mat |
| `--color-training-private` | `#22C55E` | Private lessons |
| `--color-training-competition` | `#EF4444` | Competition prep |

---

## Typography

### Font Families

| Type | Font | Weight | Fallbacks |
|------|------|--------|-----------|
| Headings | Inter | **800** (ExtraBold) | -apple-system, sans-serif |
| Subheads | Inter | **600-700** | -apple-system, sans-serif |
| Body | Inter | **500** (Medium) | -apple-system, sans-serif |
| Labels | JetBrains Mono | **500-600** | monospace |
| Data Values | JetBrains Mono | **700** | monospace |

### Font Weight Guidelines

> **Weight 400 (Regular) is PROHIBITED for user-facing text.** It's too thin for dark backgrounds and exhausted users.

| Weight | Name | Usage | Status |
|--------|------|-------|--------|
| 400 | Regular | N/A | **AVOID** |
| 500 | Medium | Body text, descriptions, secondary text | **Required minimum** |
| 600 | SemiBold | Subheadings, section titles, badges | OK |
| 700 | Bold | List items, card titles, emphasis | OK |
| 800 | ExtraBold | Primary headlines, hero stats | **Preferred for headlines** |
| 900 | Black | Hero numbers only | OK |

**Rationale:** Our users are exhausted post-training. Thin fonts lose contrast on dark backgrounds, making text harder to read. Weight 500+ ensures maximum legibility.

### Minimum Font Size (CRITICAL)

> **12px is the absolute minimum font size.** Nothing in the app should be smaller than 12px.
>
> Our users are exhausted post-training with reduced cognitive capacity. Text smaller than 12px becomes illegible on mobile devices in this state.

| Size | Status | Usage |
|------|--------|-------|
| < 12px | **PROHIBITED** | Never use |
| 12px | Minimum | Eyebrow labels, metadata only |
| 13px | Small | Secondary text, timestamps |
| 15px | Base | Body text, descriptions |
| 17px+ | Preferred | Headlines, key information |

### Type Scale

| Token | Size | Pixels | Status |
|-------|------|--------|--------|
| `--text-xs` | 0.75rem | 12px | Minimum allowed |
| `--text-sm` | 0.8125rem | 13px | OK |
| `--text-base` | 0.9375rem | 15px | OK |
| `--text-lg` | 1.0625rem | 17px | OK |
| `--text-xl` | 1.375rem | 22px | OK |
| `--text-2xl` | 1.5rem | 24px | OK |
| `--text-3xl` | 2rem | 32px | OK |
| `--text-4xl` | 3rem | 48px | OK |
| `--text-5xl` | 4.5rem | 72px | OK |
| `--text-hero` | 9rem | 144px | OK |
| `--text-mega` | 11.25rem | 180px | OK |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--leading-none` | 0.8 | Hero numbers |
| `--leading-tight` | 0.85 | Large headings |
| `--leading-snug` | 1 | Compact text |
| `--leading-normal` | 1.5 | Body text |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--tracking-tighter` | -0.05em | Mega numbers |
| `--tracking-tight` | -0.04em | Hero numbers |
| `--tracking-normal` | 0 | Default |
| `--tracking-wide` | 0.05em | Subheadings |
| `--tracking-wider` | 0.1em | Labels |
| `--tracking-widest` | 0.15em | Section titles |
| `--tracking-ultra` | 0.2em | Eyebrow labels |

---

## Spacing System

Based on 4px unit for consistency.

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-xs` | 4px | 4px |
| `--space-sm` | 8px | 8px |
| `--space-md` | 16px | 16px |
| `--space-lg` | 24px | 24px |
| `--space-xl` | 32px | 32px |
| `--space-2xl` | 48px | 48px |
| `--space-3xl` | 64px | 64px |

---

## Border Radius

Minimal radius - sharp edges for bold aesthetic.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0 | Default, most elements |
| `--radius-sm` | 2px | Belt badges |
| `--radius-md` | 4px | Buttons (rare) |

---

## Components

### Stat Displays

```css
.stat-grid              /* Grid container with 1px gap */
.stat-grid-2            /* 2-column grid */
.stat-grid-4            /* 4-column grid */
.stat-grid-5            /* 5-column grid */
.stat-cell              /* Individual stat cell */
.stat-cell--positive    /* Green gradient background */
.stat-cell--negative    /* Red gradient background */
.stat-cell--compact     /* Smaller padding, centered */
.stat-label             /* Monospace uppercase label */
.stat-label--positive   /* Green label text */
.stat-label--negative   /* Red label text */
.stat-value             /* Large number (64px) */
.stat-value--positive   /* Green number */
.stat-value--negative   /* Red number */
.stat-value--gold       /* Gold number */
```

### Buttons

```css
.btn                    /* Base button */
.btn-primary            /* Gold background, black text */
.btn-dark               /* Dark background, gray border */
.btn-outline            /* Transparent, gray border */
.btn-positive           /* Green background */
.btn-negative           /* Red background */
.btn-sm                 /* Smaller padding */
```

### Callouts

```css
.callout                /* Base callout */
.callout--positive      /* Green gradient + left border */
.callout--negative      /* Red gradient + left border */
.callout-label          /* Uppercase monospace label */
.callout-text           /* Body text */
```

### Badges

```css
/* Belt badges */
.belt-badge             /* Base belt badge */
.belt-white             /* White belt color */
.belt-blue              /* Blue belt color */
.belt-purple            /* Purple belt color */
.belt-brown             /* Brown belt color */
.belt-black             /* Black belt color */

/* Training type badges */
.training-badge         /* Base training badge */
.training-gi            /* Gi class */
.training-nogi          /* No-Gi class */
.training-openmat       /* Open mat */
.training-private       /* Private lesson */
.training-competition   /* Competition */
```

### Bar Charts

```css
.bar-list               /* Container for bar rows */
.bar-row                /* Individual bar row */
.bar-rank               /* Rank number */
.bar-container          /* Bar background */
.bar-fill               /* Bar fill */
.bar-fill--gold         /* Gold fill */
.bar-fill--gray         /* Gray fill */
.bar-label              /* Label inside bar */
.bar-count              /* Count outside bar */
```

### Forms

```css
.form-group             /* Form field wrapper */
.form-label             /* Monospace uppercase label */
.form-input             /* Text input */
.form-select            /* Select dropdown */
.form-textarea          /* Multiline input */
```

### Streak Display

```css
.streak-display         /* Container with dark bg */
.streak-glow            /* Radial gradient glow */
.streak-number          /* Massive green number */
.streak-unit            /* "Day Streak" label */
```

---

## Utility Classes

```css
/* Layout */
.flex                   /* display: flex */
.flex-wrap              /* flex-wrap: wrap */
.flex-col               /* flex-direction: column */
.items-center           /* align-items: center */
.justify-between        /* justify-content: space-between */

/* Spacing */
.gap-xs                 /* gap: 4px */
.gap-sm                 /* gap: 8px */
.gap-md                 /* gap: 16px */
.gap-lg                 /* gap: 24px */
.gap-xl                 /* gap: 32px */

/* Grid */
.grid                   /* display: grid */
.grid-2                 /* 2-column grid */
.grid-3                 /* 3-column grid */
.grid-auto              /* auto-fit columns */

/* Text */
.text-center            /* text-align: center */
.text-small             /* font-size: 13px */
.text-muted             /* color: gray-400 */
.text-mono              /* font-family: Space Mono */
.text-gold              /* color: gold */
.text-positive          /* color: green */
.text-negative          /* color: red */
```

---

## Icon Guidelines

**NEVER USE EMOJIS.**

Always use SVG lineart icons from the Icons component. See the full [Icon Library (95 icons)](../../prototype/public/icons.html) for visual reference.

```tsx
import { Icons } from '@/components/ui/Icons';

// Usage
<Icons.Check size={24} />
<Icons.Gi size={24} />
<Icons.NoGi size={24} />
<Icons.Trophy size={24} color="var(--color-gold)" />
```

### Icon Categories

| Category | Count | Examples |
|----------|-------|----------|
| Navigation | 10 | Home, Journal, Progress, Library, Profile, Menu, Search, Settings, Back, Close |
| Chevrons & Arrows | 8 | ChevronRight, ChevronLeft, ChevronDown, ChevronUp, ArrowUp, ArrowDown |
| Session Logging | 10 | Mic, MicOff, Keyboard, Play, Pause, Stop, Timer, Hourglass, Calendar, Clock |
| BJJ Training | 6 | **Gi, NoGi**, Sparring, MapPin, Dumbbell, Belt |
| Technique Categories | 6 | Hand, Shield, Sweep, Pass, Escape, Takedown |
| Progress & Achievements | 11 | Trophy, Medal, Flame, Target, Crown, Flag, Award, TrendUp, TrendDown |
| Status & Feedback | 15 | Check, CheckCircle, XCircle, AlertCircle, Star, StarFilled, Heart |
| Actions | 19 | Plus, Minus, Edit, Trash, Copy, Refresh, Filter, Sort, Share |
| Media & Content | 5 | Video, Camera, Image, Message, Zap |
| Body & Recovery | 5 | User, Users, Bandage, Moon, Sun |
| App State | 10 | Loader, Cloud, Wifi, WifiOff, Lock, Unlock, Eye, EyeOff, Bell |
| Utility | 11 | Hundred, Grid, List, Logout, Sliders, ToggleLeft, ToggleRight |

---

## Accessibility

- All color combinations meet WCAG 2.1 AA standards
- Focus states use gold outline with 3px gold-dim box-shadow
- Interactive elements have min 44px touch targets
- Motion respects prefers-reduced-motion
