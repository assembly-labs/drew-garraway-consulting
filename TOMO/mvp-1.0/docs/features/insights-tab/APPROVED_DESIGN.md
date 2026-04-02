# FEAT-002: Approved Design Direction

**Approved:** 2026-03-30
**Reference prototype:** `visual-direction-v2.html`
**Status:** Approved, ready for development

---

## Visual Direction: Message Style

Insights read like a message from a knowledgeable training partner. No cards, no badges, no dashboards. Just text.

### Typography

- Body text: Inter 15px 500wt, gray300 (#d4d4d4), lineHeight 24px
- Bold emphasis: Inter 15px 600wt, white (#ffffff) -- used inline for key phrases
- Week header: JetBrains Mono 11px 600wt, gray600 (#8a8a8a), 1px letter-spacing
- Focus label: JetBrains Mono 11px 600wt, gold (#F5A623), 1px letter-spacing
- Signoff: Inter 13px 500wt, gray600 (#8a8a8a)
- Screen title: Unbounded-ExtraBold 28px, white
- Screen subtitle: Inter 13px 500wt, gray500 -- shows session count or "X sessions this week"

### Layout

- Screen padding: 20px horizontal
- Paragraphs: 16px margin-bottom between them
- Focus section: 20px top margin, 16px top padding, 1px #222 border-top
- Signoff: 24px top margin
- Older weeks section: collapsed rows, gray800 bg, 12px padding, 8px margin-bottom

### The Only Visual Differentiation: Watch/Injury

Injury and risk paragraphs get:
- 2px solid #ef4444 (negative) left border
- 12px left padding
- Deferred action line below in gray500 13px

Everything else is identical paragraph text.

### No Tab Bar Iconography in Prototypes

The tab bar in prototypes does not match the production app's icon style. During development, use the existing tab bar pattern from MainTabNavigator.tsx with TrendUp icon ported from the prototype's MIT Lucide icon library.

---

## Typewriter Animation (First View Only)

Port the chat payoff animation from `GetStartedScreen.tsx` (lines 57-142) for first-time insight views.

### Behavior

- When a user opens the Insights tab and a NEW (unviewed) weekly insight exists:
  - Paragraphs type out sequentially at **25ms per character**
  - 150ms delay before typing starts
  - Static cursor `|` visible while typing
  - After each paragraph completes, 200ms pause before next paragraph begins
  - Watch paragraphs type at the same speed (red border already visible)
  - Focus section types after all paragraphs complete
  - Signoff appears instantly (no typewriter) after focus finishes

- When the user returns to the same insight (already viewed):
  - All text renders immediately, no animation
  - Determined by `has_been_viewed` flag in the insights table

- Skip behavior:
  - Tap anywhere on the content area to skip
  - All remaining text renders instantly
  - Marks insight as viewed

### What to Port

From `GetStartedScreen.tsx`:
- The `ChatBubble` typing logic (25ms per character, cursor, completion callback)
- Adapt for sequential paragraph rendering instead of chat bubbles
- No slide-in animation needed (paragraphs just type in place)
- No typing indicator dots needed

Create a reusable hook: `useInsightTypewriter(paragraphs, isNewInsight)`
- Returns: `{ displayedParagraphs, isComplete, skip }`
- If `isNewInsight === false`, returns all paragraphs immediately

---

## Output Schema (Simplified)

The edge function returns:

```typescript
interface WeeklyInsightOutput {
  paragraphs: Array<{
    text: string;       // The paragraph body. Can contain **bold** markers.
    isWatch: boolean;   // True = injury/risk. Gets red left border.
    defer?: string;     // Optional coach deferral line (only when isWatch is true)
  }>;
  focusNext: string;    // The "this week, try this" recommendation
}
```

The screen renders paragraphs in order. The only visual branching is `isWatch`. Everything else is uniform text.

### Bold Handling

The prompt outputs `**bold text**` markdown-style markers. The screen parses these into `<Text style={{fontWeight:'600', color:'#ffffff'}}>` spans. No other markdown. Just bold.

---

## Opener Variety

The prompt is instructed to vary opening lines across weeks:
- Never start with the user's name (unless it's their very first insight ever)
- Lead with whatever is most noteworthy: a milestone, a technique pattern, a consistency note, a direct response to their own session notes
- No two consecutive weeks should open with the same structure

---

## Elements NOT Included

- No type badges (technique, consistency, sparring, etc.)
- No card backgrounds or borders (except watch items)
- No milestone numbers as visual elements
- No sparring stat callouts
- No technique tags/pills
- No greeting line with user's name
- No tab bar in design prototypes (doesn't match production icons)
