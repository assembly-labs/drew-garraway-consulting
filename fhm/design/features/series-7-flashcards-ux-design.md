# Series 7 Flashcards Feature - UX Design

_A mobile-first flashcard experience for Series 7 exam preparation_

---

## Executive Summary

This document outlines the UX design for Series 7 flashcards, building on the successful SIE
flashcard system while addressing the unique challenges of the Series 7 exam: larger content volume,
complex calculations, and weighted topic areas.

**Key design principles:**

1. Mobile-first, thumb-friendly interactions
2. Spaced repetition for long-term retention
3. Topic-based filtering for focused study
4. Special treatment for formula/calculation cards
5. Progress visualization that motivates

---

## Current State Analysis

### What Works in SIE Flashcards

- Swipe gestures (up = got it, left/right = don't know)
- Tap to flip
- Dark theme for reduced eye strain
- Clean, distraction-free UI
- Progress bar with session stats
- Night mode (5pm-9am)
- Keyboard navigation for desktop

### Series 7 Unique Challenges

| Challenge                 | Impact              | Solution Needed                    |
| ------------------------- | ------------------- | ---------------------------------- |
| Volume: 400+ cards vs 116 | Overwhelming        | Topic filtering, spaced repetition |
| 73% weighted to Section 3 | Uneven distribution | Priority-weighted sessions         |
| Heavy calculations        | Hard to memorize    | Formula mode with worked examples  |
| Complex strategies        | Need context        | Card types with explanations       |
| Long prep period          | Forgetting curve    | Spaced repetition algorithm        |

---

## Feature Requirements

### Must Have (MVP)

- [ ] Browse/filter by section and topic
- [ ] Swipe-based card interaction (existing pattern)
- [ ] Progress persistence (localStorage)
- [ ] Basic stats: cards seen, mastered, learning
- [ ] Formula cards with special formatting
- [ ] Spaced repetition scheduling (Leitner 5-box system)
- [ ] Study streak tracking
- [ ] "Due for Review" session mode

### Should Have (V1.1)

- [ ] Difficulty rating per card (manual adjustment)
- [ ] Quick review of missed cards (separate mode)
- [ ] Keyboard shortcuts
- [ ] Weak area summary on session complete

### Nice to Have (Future)

- [ ] Offline support (service worker)
- [ ] Audio pronunciation for terms
- [ ] Export/import progress
- [ ] Multiple deck support
- [ ] Social sharing of progress

---

## User Flows

### Flow 1: Start a Study Session

```
┌─────────────────────────────────────────────────────────────┐
│                     SERIES 7 FLASHCARDS                     │
│                                                             │
│         ╭────────────────────────────────────────╮         │
│         │            [Progress Ring]             │         │
│         │               47%                       │         │
│         │          Mastered: 189/401             │         │
│         ╰────────────────────────────────────────╯         │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  ▼  Study Mode                                      │  │
│   │     ○ All Cards (401)                               │  │
│   │     ○ Due for Review (23)        ← Spaced rep       │  │
│   │     ○ Missed Cards Only (17)                        │  │
│   │     ● By Topic...                                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│              ╭─────────────────────────╮                   │
│              │     START SESSION       │                   │
│              ╰─────────────────────────╯                   │
│                                                             │
│   Last studied: 2 hours ago • 7-day streak 🔥              │
└─────────────────────────────────────────────────────────────┘
```

### Flow 2: Topic Selection

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                SELECT TOPIC                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Section 1: Seeks Business (9%)                             │
│  ├── Prospecting Customers         12/15 ████████░░        │
│  └── Networking & Referrals         8/10 ████████░░        │
│                                                             │
│  Section 2: Opens Accounts (11%)                            │
│  ├── Account Types                 18/20 █████████░        │
│  ├── Customer Documentation        15/18 ████████░░        │
│  └── Margin Requirements           10/25 ████░░░░░░  ← Weak │
│                                                             │
│  Section 3: Provides Information (73%)    ← THE BIG ONE     │
│  ├── Equity Securities             22/30 ███████░░░        │
│  ├── Debt Securities               18/35 █████░░░░░        │
│  ├── Packaged Products             20/25 ████████░░        │
│  ├── OPTIONS                       25/80 ███░░░░░░░  ← FOCUS│
│  │   ├── Basic Options             15/20 ███████░░░        │
│  │   ├── Options Strategies         5/30 ██░░░░░░░░        │
│  │   └── Options Calculations       5/30 ██░░░░░░░░        │
│  ├── Municipal Securities          12/40 ███░░░░░░░        │
│  └── [more topics...]                                       │
│                                                             │
│  Section 4: Processes Transactions (7%)                     │
│  └── [topics...]                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Active Study Session

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back          OPTIONS: STRATEGIES          12/30        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Progress: ████████████░░░░░░░░  40%                │
│                                                             │
│              Got It: 8    Don't Know: 4                    │
│                                                             │
│         ╭──────────────────────────────────────╮           │
│         │                                      │           │
│         │                                      │           │
│         │    What is a protective put?        │           │
│         │                                      │           │
│         │                                      │           │
│         │                                      │           │
│         │         [ Tap to reveal ]            │           │
│         │                                      │           │
│         ╰──────────────────────────────────────╯           │
│                                                             │
│                    ↑ Swipe up: Got it                       │
│           ← Don't know        Don't know →                 │
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   DON'T KNOW     │      │     GOT IT       │            │
│  │       ←          │      │        ↑         │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Flow 4: Card Flipped (Answer Revealed)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back          OPTIONS: STRATEGIES          12/30        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Progress: ████████████░░░░░░░░  40%                │
│                                                             │
│              Got It: 8    Don't Know: 4                    │
│                                                             │
│         ╭──────────────────────────────────────╮           │
│         │                                      │           │
│         │   A protective put is buying a put   │           │
│         │   on stock you already own.          │           │
│         │                                      │           │
│         │   Purpose: Limits downside risk      │           │
│         │   while keeping upside potential.    │           │
│         │                                      │           │
│         │   Also called: "Married put" or      │           │
│         │   "portfolio insurance"              │           │
│         │                                      │           │
│         ╰──────────────────────────────────────╯           │
│                                                             │
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   DON'T KNOW     │      │     GOT IT       │            │
│  │       ←          │      │        ↑         │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Flow 5: Formula Card (Special Type)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back          OPTIONS: CALCULATIONS        8/30         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ FORMULA                                                ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│         ╭──────────────────────────────────────╮           │
│         │                                      │           │
│         │   How do you calculate the           │           │
│         │   BREAKEVEN for a LONG CALL?         │           │
│         │                                      │           │
│         │                                      │           │
│         │         [ Tap to reveal ]            │           │
│         │                                      │           │
│         ╰──────────────────────────────────────╯           │
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │   DON'T KNOW     │      │     GOT IT       │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘

                          ↓ AFTER FLIP ↓

┌─────────────────────────────────────────────────────────────┐
│         ╭──────────────────────────────────────╮           │
│         │                                      │           │
│         │   BREAKEVEN = Strike + Premium       │           │
│         │                                      │           │
│         │   ───────────────────────────────    │           │
│         │                                      │           │
│         │   Example:                           │           │
│         │   Buy 1 ABC Jan 50 Call @ 3          │           │
│         │   BE = $50 + $3 = $53                │           │
│         │                                      │           │
│         │   Memory: "Call UP" - add premium    │           │
│         │   to strike to go UP to breakeven    │           │
│         │                                      │           │
│         ╰──────────────────────────────────────╯           │
└─────────────────────────────────────────────────────────────┘
```

### Flow 6: Session Complete

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    SESSION COMPLETE                         │
│                                                             │
│                   ╭─────────────────╮                       │
│                   │      85%        │                       │
│                   │  ████████████░  │                       │
│                   ╰─────────────────╯                       │
│                                                             │
│         ┌────────┐    ┌────────┐    ┌────────┐             │
│         │   30   │    │   26   │    │   4    │             │
│         │ Cards  │    │ Got It │    │ Missed │             │
│         └────────┘    └────────┘    └────────┘             │
│                                                             │
│                                                             │
│   WEAK AREAS IDENTIFIED:                                    │
│   • Options Strategies (3 missed)                           │
│   • Margin Calculations (1 missed)                          │
│                                                             │
│                                                             │
│              ╭─────────────────────────╮                    │
│              │   REVIEW MISSED (4)     │                    │
│              ╰─────────────────────────╯                    │
│                                                             │
│              ╭─────────────────────────╮                    │
│              │     STUDY MORE          │                    │
│              ╰─────────────────────────╯                    │
│                                                             │
│              ╭─────────────────────────╮                    │
│              │        DONE             │                    │
│              ╰─────────────────────────╯                    │
│                                                             │
│   OPTIONS: STRATEGIES progress: 40% → 53% (+13%)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Interaction Design

### Gesture System (Same as SIE)

| Gesture         | Action                   | Feedback                    |
| --------------- | ------------------------ | --------------------------- |
| **Tap**         | Flip card                | 3D flip animation           |
| **Swipe Up**    | Mark "Got It"            | Green glow, card slides up  |
| **Swipe Left**  | Mark "Don't Know"        | Red glow, card slides left  |
| **Swipe Right** | Mark "Don't Know"        | Red glow, card slides right |
| **Long Press**  | Show hint (if available) | Subtle modal                |

### Keyboard Shortcuts (Desktop)

| Key               | Action      |
| ----------------- | ----------- |
| `Space` / `Enter` | Flip card   |
| `↑`               | Got It      |
| `←` / `→`         | Don't Know  |
| `?`               | Show hint   |
| `Esc`             | End session |

### Touch Targets

- Minimum 44x44px (WCAG 2.1 AA)
- Action buttons: 60px height minimum
- Adequate spacing between interactive elements

---

## Card Types & Formatting

### Type 1: Term Definition

```
┌────────────────────────────────────────┐
│ FRONT                                  │
│                                        │
│ What is a "wash sale"?                 │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ BACK                                   │
│                                        │
│ Selling a security at a loss and       │
│ repurchasing it (or substantially      │
│ identical security) within 30 days     │
│ before or after.                       │
│                                        │
│ Tax impact: Loss is disallowed         │
│                                        │
└────────────────────────────────────────┘
```

### Type 2: Formula/Calculation

```
┌────────────────────────────────────────┐
│ FORMULA                          [f(x)]│
│                                        │
│ Current yield formula?                 │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ BACK                                   │
│                                        │
│ Current Yield = Annual Interest        │
│                 ─────────────────      │
│                   Market Price         │
│                                        │
│ Example:                               │
│ $1,000 par, 6% coupon, trading at $900 │
│ CY = $60 / $900 = 6.67%               │
│                                        │
│ Memory: "CY = Coupon over Current"     │
│                                        │
└────────────────────────────────────────┘
```

### Type 3: Comparison

```
┌────────────────────────────────────────┐
│ COMPARE                           [vs] │
│                                        │
│ General Obligation bonds vs.           │
│ Revenue bonds: Key difference?         │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ BACK                                   │
│                                        │
│ GO Bonds:                              │
│ • Backed by taxing power               │
│ • Voter approved                       │
│ • Generally safer                      │
│                                        │
│ Revenue Bonds:                         │
│ • Backed by project income             │
│ • No voter approval needed             │
│ • Higher risk = higher yield           │
│                                        │
│ Memory: "GO = Government taxes"        │
│                                        │
└────────────────────────────────────────┘
```

### Type 4: Rule/Regulation

```
┌────────────────────────────────────────┐
│ RULE                              [§]  │
│                                        │
│ Regulation T initial margin            │
│ requirement?                           │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ BACK                                   │
│                                        │
│ 50% of purchase price                  │
│                                        │
│ Example:                               │
│ Buy $10,000 stock on margin            │
│ Must deposit: $5,000 (50%)             │
│                                        │
│ Note: Set by Federal Reserve           │
│ (not FINRA or exchanges)               │
│                                        │
└────────────────────────────────────────┘
```

### Type 5: Scenario

```
┌────────────────────────────────────────┐
│ SCENARIO                         [?]   │
│                                        │
│ A customer owns 500 shares of XYZ      │
│ and is worried about a market          │
│ downturn. What strategy protects       │
│ their position?                        │
│                                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ BACK                                   │
│                                        │
│ Buy protective puts                    │
│                                        │
│ Position: Long stock + Long put        │
│                                        │
│ Why it works:                          │
│ • Put gains value if stock falls       │
│ • Limits downside to strike price      │
│ • Keeps unlimited upside potential     │
│                                        │
│ Cost: Premium paid for puts            │
│                                        │
└────────────────────────────────────────┘
```

---

## Progress & Spaced Repetition (MVP Feature)

The spaced repetition system is built into MVP - no point building flashcards without it.

### Leitner 5-Box System

Cards move between boxes based on correct/incorrect responses:

| Box | Level      | Review Interval | Criteria                   |
| --- | ---------- | --------------- | -------------------------- |
| 0   | New        | Immediate       | Never seen OR missed twice |
| 1   | Learning   | 1 day           | Got it once                |
| 2   | Familiar   | 3 days          | Got it twice in a row      |
| 3   | Proficient | 7 days          | Got it 3x in a row         |
| 4   | Mastered   | 14 days         | Got it 4x in a row         |
| 5   | Expert     | 30 days         | Got it 5+ times            |

**On correct**: Move up one box (max 5) **On incorrect**: Drop back 2 boxes (min 0)

### Algorithm Implementation

```javascript
// On "Got It"
if (card.level < 5) {
  card.level++;
  card.nextReview = calculateNextReview(card.level);
}

// On "Don't Know"
card.level = Math.max(0, card.level - 2);
card.nextReview = null; // Re-queue in current session

// Next Review Intervals
const intervals = {
  0: 0, // Immediate (learning)
  1: 1, // 1 day
  2: 3, // 3 days
  3: 7, // 1 week
  4: 14, // 2 weeks
  5: 30, // 1 month (mastered)
};
```

### Progress Persistence

Store in localStorage:

```javascript
{
  "fhm_series7_flashcards": {
    "version": 1,
    "lastStudied": "2024-01-15T14:30:00Z",
    "streak": 7,
    "cards": {
      "opt-001": { "level": 4, "nextReview": "2024-01-18", "attempts": 6 },
      "opt-002": { "level": 2, "nextReview": "2024-01-16", "attempts": 3 },
      // ...
    },
    "sessions": [
      { "date": "2024-01-15", "cards": 30, "correct": 26, "topic": "options" }
    ]
  }
}
```

---

## Visual Design

### Color Usage (FHM Brand)

| Element        | Color                   | Usage                 |
| -------------- | ----------------------- | --------------------- |
| Background     | `#1a1f2e`               | App background (dark) |
| Card Front     | `#2a3142`               | Question side         |
| Card Back      | `#1e3a5f`               | Answer side           |
| Got It         | `#7C9885` (Sage)        | Success actions       |
| Don't Know     | `#6B2737` (Burgundy)    | Retry actions         |
| Progress       | `#7C9885` → `#8fb099`   | Gradient fill         |
| Accent         | `#B08D57` (Gold)        | Streaks, achievements |
| Text Primary   | `#e8eaed`               | Main text             |
| Text Secondary | `rgba(255,255,255,0.6)` | Labels, hints         |

### Typography

| Element       | Font          | Size                   | Weight |
| ------------- | ------------- | ---------------------- | ------ |
| Card Question | Inter         | 1.125-1.625rem (clamp) | 500    |
| Card Answer   | Inter         | 1rem-1.5rem (clamp)    | 400    |
| Formula       | IBM Plex Mono | 1rem                   | 400    |
| Labels        | Inter         | 0.75rem                | 500    |
| Headers       | Crimson Pro   | 1.75rem                | 600    |

### Card Type Badges

```css
/* Visual indicator for card types */
.card-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.card-type--formula {
  color: #b08d57;
} /* Gold */
.card-type--rule {
  color: #7c9885;
} /* Sage */
.card-type--compare {
  color: #4a90c2;
} /* Light blue */
.card-type--scenario {
  color: #9b7bb8;
} /* Purple */
```

---

## Mobile Considerations

### iOS Safari Specific

- Use `100dvh` for dynamic viewport height
- `env(safe-area-inset-*)` for notch/home indicator
- `-webkit-overflow-scrolling: touch` for smooth scroll
- `touch-action: manipulation` to prevent double-tap zoom
- `position: fixed` on body to prevent rubber-banding

### Performance

- Lazy load card data by section
- Preload next 3 cards in session
- Debounce progress saves (every 5 cards or 30 seconds)
- Use CSS transforms (GPU accelerated) for animations

### Offline Support (Future)

```javascript
// Service worker strategy
// - Cache flashcard JSON on first load
// - Queue progress updates when offline
// - Sync when connection restored
```

---

## Accessibility

### WCAG 2.1 AA Compliance

- [ ] Color contrast 4.5:1 minimum
- [ ] Focus indicators visible (3px gold outline)
- [ ] Screen reader announcements for card flip
- [ ] Reduced motion support (`prefers-reduced-motion`)
- [ ] Touch targets 44x44px minimum

### Screen Reader Support

```html
<div class="flashcard" role="button" aria-label="Flashcard. Tap to flip." aria-pressed="false">
  <div class="flashcard__front" aria-hidden="false">
    <p>Question text...</p>
  </div>
  <div class="flashcard__back" aria-hidden="true">
    <p>Answer text...</p>
  </div>
</div>
```

---

## Data Structure

### Enhanced Card Schema

```json
{
  "id": "s7-opt-025",
  "front": "What is a protective put?",
  "back": "Buying a put on stock you already own to limit downside risk while maintaining upside potential.",
  "type": "term",
  "difficulty": "medium",
  "section": 3,
  "subsection": "options",
  "chapter": "strategies",
  "tags": ["options", "strategies", "hedging"],
  "related_lesson": "3.4.2",
  "memory_aid": "Think 'insurance' - you're buying protection",
  "example": "Own 100 XYZ at $50, buy 1 XYZ 50 Put @ $3. Max loss = $300 (premium)",
  "weight": 1.2
}
```

### Section Organization

```
Section 1: Seeks Business (9%)
├── 01-prospecting (~15 cards)
└── 02-referrals (~10 cards)

Section 2: Opens Accounts (11%)
├── 01-account-types (~20 cards)
├── 02-documentation (~18 cards)
└── 03-margin-basics (~25 cards)

Section 3: Provides Information (73%)
├── 01-equity-securities (~30 cards)
├── 02-debt-securities (~35 cards)
├── 03-packaged-products (~25 cards)
├── 04-options (~80 cards)          ← Largest
│   ├── basics (~20 cards)
│   ├── strategies (~30 cards)
│   └── calculations (~30 cards)
├── 05-municipal-securities (~40 cards)
├── 06-government-securities (~25 cards)
├── 07-economic-factors (~20 cards)
├── 08-margin-requirements (~30 cards)
├── 09-retirement-plans (~25 cards)
├── 10-variable-products (~20 cards)
└── 11-recommendations (~25 cards)

Section 4: Processes Transactions (7%)
├── 01-order-types (~15 cards)
└── 02-trade-settlement (~10 cards)

Total: ~400-450 cards
```

---

## Implementation Approach

### Phase 1: MVP (Reuse SIE Infrastructure)

1. Create `series-7-flashcards.html` (copy from SIE)
2. Add topic filter dropdown to start screen
3. Create Series 7 card data JSON
4. Update localStorage keys for separate progress
5. Test on mobile devices

### Phase 2: Enhanced Features

1. Add card type badges and formatting
2. Implement spaced repetition algorithm
3. Add "Due for Review" session mode
4. Show weak areas on summary screen
5. Add streak tracking

### Phase 3: Polish

1. Formula card special rendering
2. Memory aid hints (long press)
3. Progress export/import
4. Performance optimizations
5. Offline support

---

## Success Metrics

| Metric             | Target              | How to Measure             |
| ------------------ | ------------------- | -------------------------- |
| Cards created      | 400+                | Card count                 |
| Daily active usage | 5+ min              | Session time tracking      |
| Mastery rate       | 80%+ cards mastered | Progress data              |
| Retention          | 70%+ on review      | Review session performance |
| Mobile usage       | 80%+                | User agent tracking        |

---

## Open Questions

1. **Card generation**: Manual creation vs. AI-assisted from lesson content?
2. **Formula rendering**: MathML/LaTeX or styled HTML?
3. **Audio**: Worth adding pronunciation for complex terms?
4. **Sync**: Future cloud sync for multi-device?
5. **Gamification**: Badges, achievements beyond streaks?

---

## Next Steps

1. [ ] Review and approve UX design
2. [ ] Create Series 7 flashcard JSON structure
3. [ ] Build topic filter UI component
4. [ ] Generate initial card content (Section 3 priority)
5. [ ] Test on target devices (iPhone 12+, Android)

---

_Document created: January 2026_ _FHM Series 7 Flashcards - An Investment in Knowledge_
