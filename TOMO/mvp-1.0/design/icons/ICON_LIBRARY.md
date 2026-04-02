# TOMO Icon Library

Internal reference for the TOMO icon system — what we use, where it comes from, and how to add more.

---

## Source

**Lucide Icons** — [lucide.dev](https://lucide.dev) | [GitHub](https://github.com/lucide-icons/lucide)

- **License:** ISC (MIT-compatible). Free for commercial use. No attribution required.
- **Style:** 24x24 grid, 2px stroke, round caps/joins, outline only.
- **Why Lucide:** Consistent stroke weight across 1,500+ icons. Same geometric clarity as Apple SF Symbols. Used by Linear, Vercel, Raycast. No cartoon or novelty icons.

---

## What's in the App (25 icons)

Every icon currently in `tomo/src/components/Icons.tsx`:

### Navigation
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `Journal` | Custom (book with lines) | Tab bar |
| `Profile` | Custom (head + shoulders) | Tab bar |
| `Back` | `arrow-left` | Session detail header, privacy policy |
| `Close` | `x` | Edit sheets, chip dismiss, injury remove |
| `Search` | `search` | Gym search input |

### Chevrons
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `ChevronRight` | `chevron-right` | Profile rows, journal cards, gym history |
| `ChevronDown` | `chevron-down` | Collapse sections |
| `ChevronUp` | `chevron-up` | Expand sections |

### Session Logging
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `Mic` | `mic` | Record button, empty states, onboarding, permission primer |
| `Stop` | `square` | Stop recording |
| `Keyboard` | `keyboard` | Onboarding text preference |

### Status & Feedback
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `Check` | `check` | Chip selection, gym confirmed |
| `CheckCircle` | `check-circle` | Success phase (56px), success toast |
| `AlertCircle` | `circle-alert` | Error toast, warning toast, error boundary |
| `Info` | `info` | Info toast |
| `WifiOff` | `wifi-off` | Offline banner |

### Actions
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `Plus` | `plus` | Tab bar center button, submission counters |
| `Minus` | `minus` | Submission counters, sparring rounds |
| `Edit` | `pen-line` | Inline edit indicators (8+ places, often at 10-14px) |
| `Trash` | `trash` | Session delete |
| `Filter` | `filter` | Journal empty state |
| `Logout` | `log-out` | Profile sign-out |

### BJJ
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `Sparring` | `swords` | Journal cards (sparring indicator) |

### Location
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `MapPin` | `map-pin` | Gym card, gym history, onboarding |

### Misc
| Name | Lucide Source | Where Used |
|------|---------------|------------|
| `Shield` | `shield` | Privacy policy link |

---

## How to Add a New Icon

### Step 1: Find it

Browse the SVGs in `DESIGN/icons/` (469 pre-downloaded, organized by category) or search [lucide.dev/icons](https://lucide.dev/icons).

### Step 2: Convert to React Native

Lucide SVGs use `<svg>`, `<path>`, `<line>`, `<circle>`, `<polyline>`, `<rect>`. Convert to `react-native-svg` components:

```
<svg>        → <Svg>
<path>       → <Path>
<line>       → <Line>
<circle>     → <Circle>
<polyline>   → <Polyline>
<rect>       → <Rect>
stroke-width → strokeWidth
stroke-linecap → strokeLinecap
stroke-linejoin → strokeLinejoin
```

### Step 3: Add to Icons.tsx

Follow the existing pattern:

```tsx
function NewIcon({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {/* Paste converted paths here */}
    </Svg>
  );
}
```

Add it to the `export const Icons = { ... }` block at the bottom of the file.

### Step 4: Use it

```tsx
import { Icons } from '@/components/Icons';

<Icons.NewIcon size={24} color={colors.gold} />
```

---

## Design Rules

1. **Default stroke width is 1.5** — Lucide ships at 2, but TOMO uses 1.5 for a lighter feel on dark backgrounds. The `strokeWidth` prop lets individual callsites override when needed (e.g., the tab bar center Plus uses 2.5 for emphasis).

2. **Default color is white** — Icons inherit `#ffffff` unless a color prop is passed. Most callsites pass a design token color (`colors.gold`, `colors.gray500`, etc.).

3. **Size conventions:**
   - Tab bar icons: 24px (set by React Navigation)
   - Inline edit indicators: 10-14px
   - Empty state heroes: 32-40px
   - Success confirmation: 56px
   - Standard actions: 16-22px

4. **Don't add icons for decoration.** Every icon should communicate something text alone doesn't. If a label is clear without an icon, leave it.

5. **One icon, one meaning.** Don't reuse the same icon for different concepts (the AlertCircle/Info/WifiOff split was exactly this fix).

---

## Candidate Icons (Pre-Downloaded)

`DESIGN/icons/` contains 469 Lucide SVGs across 12 categories, ready to convert if needed:

| Folder | Count | Examples |
|--------|-------|---------|
| `01-navigation` | 45 | arrows, chevrons, menu, expand, home |
| `02-session-logging` | 47 | mic, waveform, play/stop, clipboard, pencil |
| `03-training-fitness` | 61 | dumbbell, trophy, flame, shield, heart-pulse |
| `04-bjj-combat` | 31 | locks, rotate, skull, layers, radar |
| `05-profile-settings` | 50 | user variants, settings, bell, eye, badge |
| `06-insights-analytics` | 45 | brain, lightbulb, sparkles, charts, signal |
| `07-status-feedback` | 33 | check/x/alert variants, loader, wifi, cloud |
| `08-gym-location` | 30 | map pins, building, compass, navigate |
| `09-data-content` | 37 | files, clipboard, trash, bookmark, tag |
| `10-communication` | 26 | messages, mail, send, phone, megaphone |
| `11-time-calendar` | 32 | clock faces, timer, alarm, calendar variants |
| `12-misc-delight` | 32 | sparkles, heart, sun/moon, coffee, gem |

To re-pull or update: `cd DESIGN/icons && bash pull-icons.sh`

---

## Changelog

| Date | Change | Why |
|------|--------|-----|
| 2026-03-26 | Swapped `Edit` from square-with-pencil to `pen-line` | Old icon was unreadable at 10-14px (8+ callsites) |
| 2026-03-26 | Swapped `Sparring` from two-heads to `swords` | Old icon read as "group/team", not combat |
| 2026-03-26 | Added `Info` icon (`info`) | Info toasts were using same AlertCircle as errors |
| 2026-03-26 | Added `WifiOff` icon (`wifi-off`) | Offline banner was using same AlertCircle as errors |
| 2026-03-26 | Initial icon candidate library (469 SVGs) | Pre-downloaded for future use |
