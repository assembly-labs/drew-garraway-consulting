# Insights Screen — Implementation Plan

**Created:** March 22, 2026
**Goal:** Rewrite `InsightsScreen.tsx` to match the prototype's `TrainingFeedback.tsx` design language — typewriter text reveal, gold glow trail, chat input field (5 exchanges), and proper iconography.

---

## What the Prototype Already Solved

The prototype's `TrainingFeedback.tsx` has a polished insights UI that we need to port to React Native. Key elements:

### 1. Typewriter Text Reveal
- `useTypewriter` hook: reveals text character-by-character (20ms default, 800ms start delay)
- `GlowText` component: 12-character trailing glow effect where new characters start gold and fade to gray
- Pulsing gold cursor bar (3px wide, `pulse-glow` animation at 1.5s)
- Skip button: tap to instantly reveal full text
- Paragraph-aware: handles `\n` splits with proper spacing

### 2. Visual Hierarchy
- Insight title: Unbounded, gold, 22px (`text-xl`), weight 700
- Body text: Inter, gray-200 (settled) / gold (in glow trail), 15px, line-height 1.7
- Section labels: JetBrains Mono, 12px, uppercase, 2px letter spacing, gold
- Focus area pills: gold-dim background, gold text, pill-shaped (`radius-full`)
- Coach deferral: gray-900 background, info-blue left border (3px), gray-300 text, 13px

### 3. Card Structure
- Dark card background (`gray-900`)
- Gold left border (3px) for primary insights
- Padding: 24px
- Minimal border radius (4px)

### 4. Tab Icon
- Prototype uses an inline **sparkle/starburst** SVG (8 radiating lines from center)
- Tab label: "Insights"

---

## What Needs to Be Built

### A. New Icon: `Sparkle` in Icons.tsx

**What:** Add a sparkle/starburst icon matching the prototype's insights tab icon.

**Where:** `tomo/src/components/Icons.tsx`

**Pattern to follow:** Same as all existing icons — function component with `size`, `color`, `strokeWidth` props, 24x24 viewBox, stroke-based paths.

**SVG source** (from prototype's TabBar.tsx):
```
<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
        M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
```

**Also add:** `Send` icon for the chat input field (arrow pointing up-right, standard send icon). Not currently in Icons.tsx.

**Scope:** ~30 lines, 2 new icon components.

---

### B. Navigation: Add "Insights" Tab

**Where:** `tomo/src/navigation/MainTabNavigator.tsx`

**Changes:**
1. Add `InsightsTab: undefined` to `MainTabParamList`
2. Import `InsightsScreen`
3. Add `Tab.Screen` between LogTab and ProfileTab
4. Use `Icons.Sparkle` with label "Insights"

**Tab order becomes:** Journal | [Log] | Insights | Profile

**Consideration:** The center LogTab FAB is currently positioned with `marginBottom: 20` to float above the bar. With 4 tabs, the spacing tightens. Need to verify the FAB still looks correct and all labels fit. If the center FAB breaks the 4-tab layout, the LogTab screen can use a `tabBarButton` custom renderer with absolute positioning (React Navigation supports this).

**Scope:** ~15 lines changed in MainTabNavigator.

---

### C. Typewriter Hook: `useTypewriter` for React Native

**Where:** New file `tomo/src/hooks/useTypewriter.ts`

**Port from:** Prototype's `TrainingFeedback.tsx` lines 173-218

**Differences from prototype (React web → React Native):**
- Replace `setInterval` with `useRef` + `requestAnimationFrame` or keep `setInterval` (both work in RN)
- No DOM-specific APIs needed — the hook is pure state logic
- The `skip` function and `isComplete` state port directly
- Add `Animated` value for cursor pulse (React Native `Animated.loop` instead of CSS keyframes)

**Interface:**
```typescript
function useTypewriter(text: string, speed?: number, startDelay?: number): {
  displayedText: string;
  currentIndex: number;
  isComplete: boolean;
  isStarted: boolean;
  skip: () => void;
  totalLength: number;
}
```

**Scope:** ~50 lines, direct port with minor RN adjustments.

---

### D. GlowText Component for React Native

**Where:** New file `tomo/src/components/GlowText.tsx`

**Port from:** Prototype's `TrainingFeedback.tsx` lines 220-291

**Key difference:** React Native doesn't support `textShadow` with blur on individual `<Text>` spans the same way CSS does. The glow effect needs adaptation:

**Option 1 (Recommended): Simplified glow**
- Render text as a single `<Text>` component
- Use `Animated.Value` to interpolate color from gold → gray on trailing characters
- Skip the per-character shadow — instead, apply a subtle gold color that fades
- The visual effect is 90% of the prototype with much better RN performance

**Option 2: Per-character rendering (expensive)**
- Map each character to its own `<Text>` span with computed color
- Gold color intensity: `rgba(245, 166, 35, ${0.4 + intensity * 0.6})` for trail
- Gray `#d4d4d4` for settled text
- Works but may stutter on older devices with long text

**Recommended approach:** Option 1 for body text, with a pulsing gold cursor using `Animated.loop`:
```typescript
// Cursor: pulsing gold bar
Animated.loop(
  Animated.sequence([
    Animated.timing(opacity, { toValue: 0.4, duration: 750 }),
    Animated.timing(opacity, { toValue: 0.8, duration: 750 }),
  ])
)
```

**Scope:** ~80-120 lines depending on glow approach.

---

### E. Rewrite InsightsScreen with Prototype Design

**Where:** `tomo/src/screens/InsightsScreen.tsx` (overwrite current)

**Structure:**

```
┌─────────────────────────────────────┐
│  INSIGHTS                   [skip]  │  ← Header (Unbounded, uppercase)
│  Based on 34 sessions               │  ← Subtitle (Inter, gray500)
│─────────────────────────────────────│
│                                     │
│  ── THIS WEEK ──────────────────── │  ← Section label (JetBrains Mono)
│                                     │
│  KNEE SLICE IS NEW                  │  ← Title (Unbounded, gold, 22px)
│                                     │
│  You added knee slice this w█       │  ← Typewriter body (Inter, 15px)
│  eek — that's directly buildi       │     Gold glow trail + pulsing cursor
│  ng the passing system your         │
│  quarterly review flagged...        │
│                                     │
│  ┌─ FOCUS NEXT WEEK ──────────────┐│  ← Focus card (gold left border)
│  │  Get that 4th session in.      ││
│  └────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  Ask about this insight...      ││  ← Chat input (appears after
│  │                          [Send] ││     typewriter completes)
│  └─────────────────────────────────┘│
│                                     │
│  ── EARLIER ────────────────────── │
│                                     │
│  ┌─ QUARTERLY REVIEW ─────────────┐│  ← Collapsed card (tappable)
│  │  Q1 2026                    →  ││
│  └────────────────────────────────┘│
│                                     │
│  ┌─ MARCH CHECK-IN ──────────────┐│
│  │  March 2026                 →  ││
│  └────────────────────────────────┘│
│                                     │
│  ┌─ WEEK OF MAR 9-15 ────────────┐│
│  │  3 insights                 →  ││
│  └────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Your coach knows your game      ││  ← Coach deferral (info-blue border)
│  │ better than any app.            ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

**Key design decisions:**

1. **Most recent insight gets typewriter treatment.** The newest weekly/monthly/quarterly insight auto-plays with the typewriter animation. All older insights show as collapsed cards (tap to expand, no animation).

2. **Chat input appears after typewriter completes.** Once `isComplete = true`, the input field fades in below the insight. This prevents the user from trying to chat while still reading.

3. **"Skip" button in header** during typewriter animation. Tapping skips to full text + shows chat input immediately.

4. **Older insights** are collapsed, single-line cards with period label and chevron. Tapping opens a detail view (or expands inline) with the full text (no typewriter, just rendered).

**Scope:** Full rewrite of InsightsScreen.tsx. ~600-800 lines (current is 912, will be leaner).

---

### F. Chat Input Component

**Where:** New file `tomo/src/components/InsightChat.tsx`

**Design:**

```
┌─────────────────────────────────────┐
│                                     │
│  ┌─ YOU ───────────────────────────┐│
│  │ What should I focus on when     ││  ← User message bubble
│  │ drilling knee slice?            ││     (gray800 bg, white text)
│  └─────────────────────────────────┘│
│                                     │
│  ┌─ TOMO ──────────────────────────┐│
│  │ Getting stuck at the knee li█   ││  ← Bot response (typewriter!)
│  │ ne is the most common stall...  ││     (no bg, gray200 text, gold trail)
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Ask a follow-up...      [Send] ││  ← Input field (3/5 counter)
│  │                           3/5  ││
│  └─────────────────────────────────┘│
│                                     │
```

After 5th exchange:
```
│  ┌─────────────────────────────────┐│
│  │ That's our 5 for this one.     ││  ← Close message (gray, italic)
│  │ Bring these to your coach.     ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ [input disabled, grayed out]   ││
│  └─────────────────────────────────┘│
```

**Component details:**

- **Input field:** TextInput with gray800 background, gray700 border, 44px height (touch target), placeholder "Ask about this insight..."
- **Send button:** `Icons.Send` icon, gold color, 44x44 touch target, disabled when input empty or loading
- **Exchange counter:** JetBrains Mono, 12px, gray500, right-aligned in input row — shows "1/5", "2/5", etc.
- **User messages:** Right-aligned, gray800 background, white text, 4px border radius, 16px padding
- **Bot responses:** Left-aligned, no background, gray200 text with typewriter animation on each new response
- **Loading state:** Pulsing gold dots (3 dots animation) while waiting for response
- **Close state:** Input grayed out, close message shown in italic gray text
- **Scroll behavior:** Chat area auto-scrolls to bottom on new messages

**State management:**
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [inputText, setInputText] = useState('');
const [exchangeCount, setExchangeCount] = useState(0);
const [isComplete, setIsComplete] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

**Scope:** ~200-250 lines.

---

### G. Design Token Additions

**Where:** `tomo/src/config/design-tokens.ts`

**Add:**
```typescript
colors: {
  // ... existing
  purple: '#8B5CF6',          // For game_development insight type badge
  goldDim: 'rgba(245, 166, 35, 0.15)',  // For focus area pills (if not already)
}
```

**Scope:** 2-3 lines.

---

## Implementation Order

| Step | What | Files | Lines | Depends On |
|------|------|-------|-------|------------|
| 1 | Add `Sparkle` + `Send` icons | `Icons.tsx` | ~30 | Nothing |
| 2 | Add design token values | `design-tokens.ts` | ~3 | Nothing |
| 3 | Port `useTypewriter` hook | New: `hooks/useTypewriter.ts` | ~50 | Nothing |
| 4 | Build `GlowText` component | New: `components/GlowText.tsx` | ~100 | Step 3 |
| 5 | Build `InsightChat` component | New: `components/InsightChat.tsx` | ~230 | Steps 1, 3, 4 |
| 6 | Rewrite `InsightsScreen.tsx` | Overwrite existing | ~700 | Steps 3, 4, 5 |
| 7 | Wire "Insights" tab in nav | `MainTabNavigator.tsx` | ~15 | Steps 1, 6 |

**Total new/changed code:** ~1,130 lines across 7 files.

Steps 1-4 can be done in parallel. Step 5 depends on the typewriter pieces. Step 6 is the main screen rewrite. Step 7 is the final wiring.

---

## Interaction Flow

### First Visit (No Insights Yet)
1. User taps "Insights" tab
2. Empty state: sparkle icon + "Log your first session to start building insights"
3. After 1+ sessions: "Your first weekly debrief will appear Sunday" (or trigger manually)

### Weekly Insight Appears
1. User opens Insights tab
2. Most recent weekly insight auto-plays with typewriter animation
3. Gold cursor pulses, characters reveal with trailing glow
4. "Skip" button in header to jump to full text
5. After typewriter completes → focus area card fades in → chat input fades in

### User Chats
1. User types question in input field
2. Taps Send (or hits return)
3. User message appears in right-aligned bubble
4. Loading dots pulse while waiting for Haiku response
5. Bot response types out with typewriter animation
6. Counter updates: "1/5" → "2/5" → etc.
7. After 5th exchange → input disables → close message appears

### Monthly/Quarterly Reviews
1. Monthly card appears with "MONTHLY CHECK-IN" label
2. Tapping opens full review with typewriter on first view
3. Chat input available after text completes
4. Monthly uses Sonnet (deeper responses)
5. Quarterly uses Opus (strategic, weighted responses)
6. Same 5-exchange limit per insight

### Browsing History
1. Scroll past the featured (newest) insight
2. "EARLIER" section with collapsed cards
3. Each card shows period + tier label + chevron
4. Tap to expand → shows full text (no typewriter on re-read) + existing chat thread (if any)

---

## What This Does NOT Include (Future)

- Automatic generation scheduling (cron/background)
- Push notifications for new insights
- Feedback thumbs UI (helpful/not helpful)
- Video suggestions (prototype had placeholder data, not implemented)
- Progressive profiling prompts within insights
- Semi-annual / annual Opus reviews
