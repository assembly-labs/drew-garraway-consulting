# Post-Save Quote

Full-screen quote overlay shown immediately after saving a session.

**Code:** `tomo/src/components/PostSaveQuote.tsx`
**Used by:** Success Phase (session-success.md)

## Elements

### Quote Text
- Centered on screen (180px from top, 40px horizontal padding)
- Inter font, 17px, gray-300 color
- 28px line height
- Text-aligned center

### Quote Attribution
- Below the quote text (12px gap)
- Monospace font (JetBrains Mono), 12px
- Gold color at 60% opacity
- Shows the person's name

### Progress Bar
- Bottom of screen (32px from bottom, 40px side margins)
- Thin line (2px height)
- Background: gold at 10% opacity
- Fill: gold at 30% opacity, animates from left to right over 4 seconds
- Rounded ends (1px radius)

## Behavior

- Displays for exactly 4 seconds, then auto-dismisses
- Double-tap anywhere to dismiss early (300ms tap window)
- Fades out over 200ms on dismiss
- Tracks last 5 quote IDs in local storage to prevent repeats
- Quote selection is personalized:
  - Belt-aware: different quotes for white/blue/purple/brown/black belts
  - Gender-weighted: female users see ~50% women athlete quotes
- Quote pool: 135+ quotes from 48+ martial arts figures (BJJ, MMA, boxing, wrestling, judo)
- After dismiss: navigates to Journal List
