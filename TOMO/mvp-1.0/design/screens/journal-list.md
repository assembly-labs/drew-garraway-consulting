# Journal List

Main screen. Shows all your logged sessions in chronological order.

**Code:** `tomo/src/screens/JournalScreen.tsx`
**Tab:** Journal (first tab, left side)

## Elements

### Screen Title
- "Journal" (Unbounded ExtraBold, 28px, white)

### Weekly Pulse Strip
- Shows your training progress for the current week
- Text: "X of Y" (e.g., "3 of 4") or "X sessions this week" if no target set
- Visual: Row of small dots (10px each)
  - Gold filled dots = sessions logged this week
  - Gray outline dots = remaining to hit your target
- Only visible when sessions have loaded

### Filter Pills
- Horizontal row, sticky below the header
- Three pills: "All", "Gi", "No-Gi"
- Active pill: gold background + gold border + gold text
- Inactive pill: dark gray background + gray border + gray text
- Light haptic on tap

### Session Count
- Right side of filter row
- Shows total count: "X sessions" (monospace, gray)
- Updates when filter changes

### Session Cards (list)
- Grouped by time: Today / Yesterday / This Week / This Month / Earlier
- **Group Header:** Uppercase, monospace, gray, with letter spacing

Each **Session Card** contains:
- **Mode Badge** (top-left): "Gi" or "No-Gi" or "Other" with belt-colored background
- **Duration** (top-right): "90 min" in monospace, gray
- **Session Kind** (main text): "Open Mat" / "Class" / "Competition Training" (bold, white, 16px)
- **Lesson Topic** (subtitle, if present): One line, gray, 13px
- **Techniques** (below topic, if present): Comma-separated list, gray, 15px, one line
- **Sparring Indicator** (if sparred): Sparring icon + "X rounds" text
- **Chevron** (right edge): Small right-arrow icon, gray

Tap a card to open Session Detail.

### Empty States
- **No sessions yet:** Mic icon, "No Sessions Yet" heading, "Log your first session" gold button
- **No filter matches:** Filter icon, "No Gi/No-Gi Sessions" heading, description
- **Network error:** Wifi-off icon, "Could Not Load Sessions" heading, "Retry" button

### Pull to Refresh
- Pull down on the list to refresh
- Gold-tinted refresh spinner
