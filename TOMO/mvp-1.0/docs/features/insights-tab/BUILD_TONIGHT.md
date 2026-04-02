# FEAT-002: Build Plan -- Ship Tonight

**Date:** 2026-03-30
**Goal:** Insights tab live in TestFlight by end of night
**Design:** Message style (visual-direction-v2.html), typewriter on first view
**FEAT-008:** Shipped (birthday, gender, weight, goals all in DB)

---

## Rule: No Insights Until One Full Week

Users cannot generate or view AI insights until they have at least 7 days of account history AND 1+ session logged. Before that threshold, the Insights tab shows a typewriter message explaining what's coming.

---

## Edge Cases -- Every State the Tab Can Be In

### Pre-Insight States (no AI, client-side only)

**State 1: Brand new user, 0 sessions**
```
Screen title: "Insights"
No subtitle.

[Typewriter on first visit, static on revisit]

"TOMO needs at least one week of training data before your first
debrief. Log your sessions this week and your first insights will
be here next week."
```

**State 2: Has sessions, but account is less than 7 days old**
```
Screen title: "Insights"
Subtitle: "3 sessions this week"

[Typewriter on first visit to this state, static on revisit]

"You've been putting in the work. TOMO needs a full week of
training data to spot patterns and put together your first
debrief. Keep logging -- it's coming."
```

**State 3: Account is 7+ days old, has sessions, but no insight generated yet**
Trigger generation. Show loading state briefly, then typewriter the result.

**State 4: Account is 7+ days old, 0 sessions ever**
Same as State 1. Can't generate without data.

### Post-Insight States

**State 5: Has weekly insight(s), current week has new sessions**
```
Screen title: "Insights"
Subtitle: "Based on N sessions"

[Latest weekly debrief -- typewriter if new, static if viewed]
[Paragraphs, watch items, focus section, signoff]

[Collapsed older weeks below]
```

**State 6: Has weekly insight(s), current week has 0 sessions**
```
[Latest weekly debrief -- static, already viewed]
[Collapsed older weeks]
```
No "you didn't train this week" message. Just the existing content.

**State 7: Returning after 14+ day gap, logs a session**
The next weekly generation will happen at end of their first week back. Until then, show existing insights (static).

**State 8: Generation fails (API error, timeout)**
```
[Show last available insight if any]
[If no insights exist, show State 1 or 2]
Pull-to-refresh to retry.
```

**State 9: Pull-to-refresh while eligible**
Check eligibility (7+ days since last insight, 1+ session this week, account 7+ days old). If eligible, trigger generation. Show brief loading spinner, then typewriter the new result.

### Generation Eligibility

```
canGenerate = ALL of:
  - account created_at is 7+ days ago
  - 1+ session logged in current week (Mon-Sun)
  - no existing insight for current week
  - 7+ days since last weekly insight (or no prior insight)
```

---

## Build Sequence (Ordered for Tonight)

### Step 1: TrendUp Icon
**File:** `tomo/src/components/Icons.tsx`

Add before the export:
```typescript
function TrendUp({ size = 24, color = '#ffffff', strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <Polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}
```

Add `TrendUp` to the Icons export object.

---

### Step 2: Wire Tab
**File:** `tomo/src/navigation/MainTabNavigator.tsx`

Add to MainTabParamList:
```typescript
InsightsTab: undefined;
```

Import InsightsScreen. Add Tab.Screen between LogTab and ProfileTab:
```typescript
<Tab.Screen
  name="InsightsTab"
  component={InsightsScreen}
  options={{
    tabBarLabel: 'Insights',
    tabBarIcon: ({ color, size }) => (
      <Icons.TrendUp size={size} color={color} />
    ),
  }}
/>
```

---

### Step 3: useInsightTypewriter Hook
**New file:** `tomo/src/hooks/useInsightTypewriter.ts`

Port from GetStartedScreen ChatBubble logic (25ms/char).

```typescript
interface TypewriterInput {
  paragraphs: Array<{ text: string; isWatch: boolean; defer?: string }>;
  focusNext: string;
}

interface TypewriterOutput {
  /** Text revealed so far for each paragraph + focusNext */
  revealedText: string[];       // One string per paragraph + final = focusNext
  currentIndex: number;         // Which paragraph is currently typing
  isComplete: boolean;
  skip: () => void;
}

function useInsightTypewriter(
  input: TypewriterInput | null,
  shouldAnimate: boolean         // false = show all text immediately
): TypewriterOutput
```

- If `shouldAnimate === false` or `input === null`: return all text fully revealed
- 25ms per character
- 150ms delay before first paragraph starts
- 200ms pause between paragraphs
- Cursor: append `|` to current paragraph's revealed text (removed on completion)
- `skip()`: instantly reveal everything, mark complete

---

### Step 4: parseBold Utility
**New file or add to:** `tomo/src/utils/text-helpers.ts`

```typescript
// Parses "Some **bold** text" into segments
interface TextSegment { text: string; bold: boolean }
function parseBold(input: string): TextSegment[]
```

Used in rendering to apply fontWeight 600 + white color to bold segments.

---

### Step 5: Rewrite InsightsScreen
**File:** `tomo/src/screens/InsightsScreen.tsx`

This is the main work. The screen has 3 modes:

**Mode A: Pre-insight (account < 7 days or 0 sessions)**
- Render the typewriter message (no AI, hardcoded text)
- Choose message based on session count (0 vs 1+)
- Typewriter plays once (track with local state or AsyncStorage key)

**Mode B: Eligible but no insight yet (account 7+ days, sessions exist)**
- Trigger generation on mount (or show loading)
- On success, switch to Mode C with typewriter

**Mode C: Has insight(s)**
- Latest insight: typewriter if `has_been_viewed === false`, static otherwise
- Paragraphs rendered as message text (Inter 15px gray300)
- Watch paragraphs: 2px red left border, 12px left padding, defer line below
- Bold: parsed from `**bold**` markers, rendered as white 600wt
- Focus section: gold label + body, separated by 1px #222 border-top
- Signoff: "Your coach knows your game better than any app." gray600
- Older weeks: collapsed rows, tap to expand

**Styles follow the existing design tokens exactly:**
- Background: colors.black (#111111)
- Screen title: Unbounded-ExtraBold 28px white (same as current)
- Subtitle: Inter 13px gray500 (same as current)
- Body: Inter 15px 500wt gray300, lineHeight 24
- Bold: Inter 15px 600wt white
- Week header: JetBrains Mono 11px 600wt gray600, 1px letter-spacing
- Focus label: JetBrains Mono 11px 600wt gold, 1px letter-spacing
- Signoff: Inter 13px 500wt gray600
- Watch border: 2px solid colors.negative (#ef4444)
- Collapsed rows: gray800 bg, radius-lg (8px), 1px gray700 border

---

### Step 6: Pattern Engine Updates
**File:** `tomo/src/services/insights-engine.ts`

Add to WeeklyInsightInput assembly:
- `instructors`: aggregate unique instructor names from week's sessions
- `lessonTopics`: aggregate unique lesson_topic values
- `trainingGoals`: from profile.training_goals
- `experienceLevel`: from profile.experience_level
- `age`: computed from profile.birthday
- `gender`: from profile.gender
- `weight`: from profile.weight_lbs

---

### Step 7: Fix insights-service
**File:** `tomo/src/services/insights-service.ts`

- Delete `extractEdgeFnError()`, import `parseEdgeFnError` from supabase.ts
- Update type expectations: the insight_data JSONB now contains `{ paragraphs, focusNext }` not `{ insights, focusNext }`

---

### Step 8: Deploy DB Migration
```bash
cd tomo && supabase db push
```
Deploys: insights, insight_conversations, user_context tables + RLS.

---

### Step 9: Rewrite System Prompt + Deploy Edge Function
**File:** `tomo/supabase/functions/generate-weekly/index.ts`

Replace system prompt with the version from PROMPT_ENGINEERING.md.

Key changes:
- Output format is now `{ paragraphs: [{text, isWatch, defer?}], focusNext }`
- Training_goals routing blocks
- Age context from birthday
- Gender context
- Belt-specific rules (white belt vocabulary ceiling, 3-4 stripe adjustment, blue belt peer tone)
- Instructor + lesson topic in input data
- Rules: no name in opener, vary structure, **bold** for emphasis, isWatch only for injuries

Deploy:
```bash
supabase functions deploy generate-weekly --no-verify-jwt
```

---

### Step 10: Wire Generation Trigger
**File:** `tomo/src/services/session-service.ts` (or wherever session save completes)

After successful session save:
```typescript
// Check if eligible for weekly insight generation
const profile = await profileService.get(userId);
const accountAge = daysSince(profile.created_at);
if (accountAge < 7) return; // Too new

const weekStart = getMonday(new Date());
const existing = await insightService.getWeeklyForPeriod(userId, weekStart);
if (existing) return; // Already have one this week

const lastInsight = await insightService.getLatestWeekly(userId);
if (lastInsight && daysSince(lastInsight.period_end) < 7) return; // Too soon

// Fire and forget
insightService.generateWeekly(userId, weekStart).catch(console.error);
```

---

### Step 11: TypeScript Check
```bash
npx tsc --noEmit
```
Zero errors before testing.

---

### Step 12: Local Device Test
```bash
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device
```

Test checklist:
- [ ] 4-tab bar renders correctly, center button still floats
- [ ] TrendUp icon shows for Insights tab
- [ ] New user (0 sessions): typewriter plays "need one week" message
- [ ] New user (1+ sessions, < 7 days): typewriter plays "keep logging" message
- [ ] Revisit pre-insight state: text is static, no re-animation
- [ ] 7+ day account with sessions: insight generates
- [ ] Insight typewriter plays on first view
- [ ] Tap to skip works
- [ ] Revisit: insight is static
- [ ] Watch paragraphs have red left border
- [ ] Bold text renders white 600wt
- [ ] Focus section has gold label + border-top separator
- [ ] Signoff shows at bottom
- [ ] Older weeks collapse/expand
- [ ] Pull-to-refresh works
- [ ] Content is belt-appropriate
- [ ] No TypeScript errors

---

### Step 13: TestFlight Build
```bash
bash build.sh
```
Only after Drew confirms local test passes.

---

## What We Are NOT Building Tonight

- Monthly insights (Phase 2)
- Quarterly insights (Phase 3)
- Chat follow-up (Phase 3)
- Feedback thumbs (Phase 4)
- "This week so far" client-side summaries between debriefs (nice-to-have, not blocking launch)
- Quality validation layer (Phase 2)
- Push notifications for new insights
