# FEAT-002: Insights Tab -- Design Plan

**Created:** 2026-03-30
**Status:** Design direction (awaiting Drew's approval)
**Approach:** B (Weekly Check-In) -- static cards, own tab, no animation
**Next after approval:** Development + TestFlight

---

## Design Decisions (Grounded in Research)

Every decision below traces to the psychological profiles, content strategy, and design system docs in this folder.

### 1. Tab Position: Journal | [Log] | Insights | Profile

Insights goes between the center Log button and Profile. Rationale:
- Journal (left) = past. Insights (right of center) = reflection. Profile (far right) = settings. Natural information flow.
- The center Log button stays exactly as-is (70x70 gold circle, 32px margin-bottom float).
- Tab icon: **TrendUp** (rising trendline, Lucide MIT). Already in the web prototype. Clean lineart, analytical, no decorative elements. Recommended by the UX audit.
- Tab label: "Insights" in JetBrains Mono 12px 600wt uppercase, same as Journal/Profile.

### 2. Screen Layout: Existing InsightsScreen (minimal changes)

The current InsightsScreen.tsx (1,063 lines) already implements Approach B's design:
- Header: "Insights" in Unbounded-ExtraBold 28px + subtitle "Based on N sessions"
- Weekly cards with type badges, titles, body text
- Focus Next section with gold label
- Empty states for 0 sessions, < 5 sessions, no weekly insights
- NEW badge on unviewed insights
- Pull-to-refresh
- Coach deferral footer

**Changes needed for Approach B launch:**
- Update empty state copy to match psychological profiles (warmer, belt-aware)
- Ensure type badge colors use design token colors (infoDim/info, goldDim/gold, positiveDim/positive, negativeDim/negative, purpleDim/purple)
- Add collapsed card treatment for older weeks (currently all weeks render expanded)
- Remove monthly/quarterly card rendering for Phase 1 (or hide behind session count threshold)

### 3. Card Anatomy (Weekly Insight)

```
[gray800 card, radius-lg, 1px gray700 border, 16px padding]

  [TYPE BADGE]  pill shape, 8px horiz padding, 3px vert
    JetBrains Mono 12px 600wt uppercase, 0.5px tracking
    Colors by type:
      technique  → infoDim bg, info text (#3b82f6)
      consistency → goldDim bg, gold text (#F5A623)
      sparring   → positiveDim bg, positive text (#22c55e)
      risk       → negativeDim bg, negative text (#ef4444)
      milestone  → goldDim bg, gold text (#F5A623)

  [NEW]  badge (goldDim bg, gold text, JetBrains Mono 12px 700wt)
    Only shows on first view. Removed after markAsViewed()

  [TITLE]  Inter-Bold 15px 700wt, white
  [BODY]   Inter 15px 500wt, gray400, lineHeight 22

  ---  (1px gray700 border-top, 8px top padding)

  [FOCUS NEXT WEEK]
    Label: JetBrains Mono 12px 600wt, gold, uppercase, 1.5px tracking
    Body: Inter 15px 500wt, gray300, lineHeight 22
```

### 4. Empty States (Belt-Aware)

Phase 1 uses the user's belt from their profile to personalize the empty state.

**0 sessions logged:**
```
[64px circle, gray800 bg]
  TrendUp icon 24px gray600

"Your debriefs will appear here"
  Inter-Bold 20px white

"Log your first session. After a week of training,
TOMO will have something to say about your game."
  Inter 15px gray500, centered, lineHeight 22
```

**1-4 sessions (not enough for weekly):**
```
[Same icon circle]

"Building Your First Debrief"
  Inter-Bold 20px white

"A few more sessions this week and your first
weekly insight will appear."
  Inter 15px gray500

[Progress bar: goldFill on gray700 track, 6px height]
[Label: "2 of 3 sessions" JetBrains Mono 12px gray500]
```

**5+ sessions but no weekly generated yet:**
```
"Your first weekly debrief is on the way."
  Inter 15px gray500, centered
```

### 5. Week Grouping

Current week: expanded (all cards visible)
Previous weeks: collapsed to single row

**Collapsed week row:**
```
[gray800 bg, radius-lg, 12px padding, 1px gray700 border]
  [left] "Mar 17-23"  Inter-SemiBold 15px white
         "2 insights" Inter 13px gray500
  [right] ChevronRight 16px gray500
```

Tapping expands inline (no navigation). Same card anatomy as current week.

### 6. Section Labels

```
[JetBrains Mono 12px 600wt, gray500, uppercase, 2px tracking]
  "THIS WEEK"
  "EARLIER"
  "MARCH"  (month grouping for older weeks)

  After text: 1px gray700 line extending to right edge
```

### 7. Coach Deferral Footer

Appears at the bottom of the scrollable area, below all weekly cards.

```
[Centered, 32px top margin, 16px vert padding]
  "Your coach knows your game better than any app.
   These observations supplement -- never replace --
   their guidance."
  Inter 15px gray600, centered, lineHeight 22
```

### 8. Color Palette (All From Design Tokens)

| Element | Color | Token |
|---------|-------|-------|
| Background | #111111 | colors.black |
| Card bg | #1f1f1f | colors.gray800 |
| Card border | #4a4a4a | colors.gray700 |
| Title text | #ffffff | colors.white |
| Body text | #c4c4c4 | colors.gray400 |
| Focus body | #d4d4d4 | colors.gray300 |
| Label text | #a3a3a3 | colors.gray500 |
| Muted text | #8a8a8a | colors.gray600 |
| Gold accent | #F5A623 | colors.gold |
| Gold dim bg | rgba(245,166,35,0.15) | colors.goldDim |
| Info blue | #3b82f6 | colors.info |
| Info dim bg | rgba(59,130,246,0.15) | colors.infoDim |
| Positive | #22c55e | colors.positive |
| Negative | #ef4444 | colors.negative |
| Purple | #8B5CF6 | colors.purple |

### 9. Typography Stack

| Use | Font | Size | Weight | Token |
|-----|------|------|--------|-------|
| Screen title | Unbounded-ExtraBold | 28px | 800 | custom |
| Subtitle | Inter | 13px | 500 | fontSizes.sm |
| Section label | JetBrains Mono-SemiBold | 12px | 600 | fontSizes.xs |
| Type badge | JetBrains Mono-SemiBold | 12px | 600 | fontSizes.xs |
| Card title | Inter-Bold | 15px | 700 | fontSizes.base |
| Card body | Inter | 15px | 500 | fontSizes.base |
| Date range | Inter-SemiBold | 15px | 600 | fontSizes.base |
| Coach footer | Inter | 15px | 500 | fontSizes.base |
| Tab label | JetBrains Mono | 12px | 600 | fontSizes.xs |

### 10. Spacing System (4px grid)

| Element | Value | Token |
|---------|-------|-------|
| Screen horizontal padding | 24px | spacing.lg |
| Card padding | 16px | spacing.md |
| Card margin-bottom | 8px | spacing.sm (weekly), 16px spacing.md (quarterly/monthly) |
| Section label top margin | 24px | spacing.lg |
| Section label bottom margin | 8px | spacing.sm |
| Badge pill horizontal padding | 8px | - |
| Badge pill vertical padding | 3px | - |
| Focus section top border padding | 8px | spacing.sm |
| Scroll bottom padding | 64px | spacing.3xl |

---

## What This Does NOT Include (Phase 2+)

- Typewriter animation (Phase 2)
- GlowText component (Phase 2)
- Monthly/quarterly card rendering (Phase 2)
- Chat follow-up input (Phase 3)
- Feedback thumbs (Phase 4)
- Push notification for new insights
- Insight detail screen (full-page view)

---

## Implementation Sequence

See TASKS.md (to be created after design approval) for ordered steps. High-level:

1. Add TrendUp icon to Icons.tsx
2. Add InsightsTab to MainTabNavigator.tsx
3. Deploy database migration (supabase db push)
4. Deploy generate-weekly edge function (--no-verify-jwt)
5. Update InsightsScreen empty states for belt-aware copy
6. Add collapsed week treatment for older weeks
7. Wire generation trigger after session save
8. Fix 6 pre-integration audit items
9. Local test on device
10. TestFlight build

---

## Approval Checklist

Before proceeding to development, Drew confirms:

- [ ] Tab position (Journal | Log | Insights | Profile) looks right
- [ ] Card anatomy matches expectations
- [ ] Empty state copy feels warm, not generic
- [ ] Weekly-only scope for Phase 1 is acceptable
- [ ] Belt-aware content direction is correct
- [ ] Coach deferral footer wording is right
