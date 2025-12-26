# SIE Flash Card Feature - Implementation Plan

## Context

You are extending an existing SIE exam preparation project. The project contains educational content in markdown files organized by chapter. Your task is to build a flash card training feature that helps users study for the FINRA Securities Industry Essentials exam.

Build this feature end-to-end in one pass. Do not stop for approvals.

---

## Step 1: Codebase Discovery

Before writing any code, understand the existing codebase.

**Explore the repository:**
- Map the directory structure
- Identify where markdown content lives
- Identify the tech stack (framework, styling, state management)
- Note existing components and patterns to follow for consistency

**Analyze the markdown content:**
- List all markdown files and their chapter/topic organization
- Document the formatting patterns used (headers, bold terms, lists, definition structures)

**Create the chapter → FINRA section mapping:**

Assign each chapter to one of these four FINRA sections based on content:

| Section | Name | Exam Weight |
|---------|------|-------------|
| 1 | Knowledge of Capital Markets | 16% |
| 2 | Understanding Products and Their Risks | 44% |
| 3 | Understanding Trading, Customer Accounts and Prohibited Activities | 31% |
| 4 | Overview of the Regulatory Framework | 9% |

**Mapping heuristics:**
- Bonds, stocks, mutual funds, ETFs, options, annuities, alternative investments → Section 2
- Order types, account types, margin, suitability, prohibited practices, customer accounts → Section 3
- Market structure, exchanges, economic factors, regulators, SROs → Section 1
- Registration, licensing, compliance, continuing education, Form U4/U5 → Section 4

---

## Step 2: Card Generation

**Card data structure:**

```typescript
interface FlashCard {
  id: string;
  front: string;
  back: string;
  chapter: string;
  section: 1 | 2 | 3 | 4;
  weight: number;               // 0.16, 0.44, 0.31, or 0.09 based on section
  source: 'auto' | 'curated';   // all 'auto' for now
  tags?: string[];
}
```

**Parsing heuristics (priority order):**

1. **Bold term definitions** - `**term**` followed by explanatory text → Front: term, Back: explanation

2. **Explicit definition patterns** - "X is...", "X refers to...", "X means..." → Front: X, Back: definition

3. **Header + content** - H2/H3 headers with paragraph following → Front: "What is [header]?", Back: paragraph

4. **Lists under headers** - Header + bullet list → One card per item, header provides context

**Quality filters:**
- Skip cards where front ≈ back
- Skip cards with back under 10 words
- Flag cards with back over 200 words (split if possible)
- Dedupe by front text (keep more complete back)

**Output:**
- Generate `src/data/flashcards.json` (or appropriate location matching project structure)
- Log summary: total cards, cards per section, cards per chapter

---

## Step 3: Flash Card UI

**Interaction model:**

| Gesture | Action |
|---------|--------|
| Tap card | Flip to reveal back |
| Swipe left or right | "Still learning" - card stays in rotation |
| Swipe up | "Got it" - increment proficiency, reduce frequency |

**Component structure:**

```
FlashCardView/
├── FlashCardDeck.tsx        # manages queue and session state
├── FlashCard.tsx            # card with flip animation
├── SwipeHandler.tsx         # gesture detection
├── ProgressIndicator.tsx    # cards remaining / mastered
└── SessionSummary.tsx       # end-of-session stats
```

**Session state:**

```typescript
interface CardSession {
  queue: FlashCard[];
  currentIndex: number;
  sessionStats: {
    seen: number;
    markedProficient: number;
    markedLearning: number;
  };
}
```

**Persistent state (localStorage):**

```typescript
interface UserProgress {
  cardProficiency: Record<string, {
    proficiencyScore: number;      // 0-5 scale
    lastSeen: string;              // ISO timestamp
    timesMarkedProficient: number;
    timesMarkedLearning: number;
  }>;
  settings: {
    cardsPerSession: number;       // default 20
    prioritizeWeakCards: boolean;
  };
}
```

**Card queue algorithm:**

Build session queue with this priority:
1. Unseen cards from high-weight sections first (Section 2 > 3 > 1 > 4)
2. Low proficiency cards (score < 3)
3. Cards not seen recently (> 3 days)

Score formula:
```
score = (5 - proficiencyScore) * sectionWeight * recencyBonus
```

Shuffle top 20 cards for the session.

**Mobile-first styling:**
- Card: 85% viewport width, 60% viewport height
- Min font: 18px body, 24px terms
- Touch targets: minimum 44px
- Swipe threshold: 50px horizontal, 80px vertical
- 3D flip animation via CSS transform
- Support dark mode if project has it

---

## Step 4: Integration

**Routing:**
- Add `/practice` or `/flashcards` route (match existing routing pattern)
- Entry point in main navigation

**Build integration:**
- Card generation runs via `npm run generate-cards`
- Or integrate into build process to regenerate when markdown changes

**Testing:**
- Verify swipe gestures work on mobile
- Verify localStorage persists across sessions
- Test performance with full card deck

---

## What NOT to Build

Do not implement these (future scope):
- Curated card layer
- Spaced repetition (SM-2)
- Quiz/multiple choice mode
- Progress dashboard
- Section/chapter filtering
- Export/import
- Audio features
