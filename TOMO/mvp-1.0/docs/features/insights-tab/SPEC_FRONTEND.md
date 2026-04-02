# FEAT-002: Front-End Development Spec

**Design reference:** APPROVED_DESIGN.md + visual-direction-v2.html
**Depends on:** FEAT-008 (shipped), backend edge function (SPEC_BACKEND.md)

---

## Files to Create or Modify

### New Files

| File | Purpose |
|------|---------|
| `tomo/src/hooks/useInsightTypewriter.ts` | Typewriter hook for first-view animation |

### Modified Files

| File | Changes |
|------|---------|
| `tomo/src/components/Icons.tsx` | Add TrendUp icon |
| `tomo/src/navigation/MainTabNavigator.tsx` | Add 4th tab |
| `tomo/src/screens/InsightsScreen.tsx` | Rewrite to message style + typewriter |
| `tomo/src/services/insights-service.ts` | Fix duplicate error parser |
| `tomo/src/services/insights-engine.ts` | Add instructor, lesson_topic, training_goals, experience_level to input |

---

## 1. TrendUp Icon

**File:** `tomo/src/components/Icons.tsx`

Port from `prototype/src/components/ui/Icons.tsx` line 516:

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

Add `TrendUp` to the `Icons` export object under a `// Insights` section.

---

## 2. Navigation Wiring

**File:** `tomo/src/navigation/MainTabNavigator.tsx`

Add `InsightsTab` to `MainTabParamList`. Add `Tab.Screen` between LogTab and ProfileTab:

```typescript
<Tab.Screen
  name="InsightsTab"
  component={InsightsScreen}
  options={{
    tabBarLabel: 'INSIGHTS',
    tabBarIcon: ({ color, size }) => <Icons.TrendUp size={size} color={color} />,
  }}
/>
```

Tab order: Journal | [Log] | Insights | Profile

Verify the center Log button (70x70, 32px margin-bottom) still floats correctly with 4 tabs.

---

## 3. useInsightTypewriter Hook

**File:** `tomo/src/hooks/useInsightTypewriter.ts`

Port typing logic from `GetStartedScreen.tsx` ChatBubble (lines 98-123). Adapted for sequential paragraph rendering.

```typescript
interface TypewriterParagraph {
  text: string;
  isWatch: boolean;
  defer?: string;
}

interface UseInsightTypewriterReturn {
  /** Paragraphs with text revealed up to current position */
  visibleParagraphs: Array<{
    text: string;          // Text revealed so far
    isWatch: boolean;
    defer?: string;
    isComplete: boolean;   // Has this paragraph finished typing?
  }>;
  /** All paragraphs fully revealed */
  isAllComplete: boolean;
  /** Skip to end */
  skip: () => void;
}

function useInsightTypewriter(
  paragraphs: TypewriterParagraph[],
  focusNext: string,
  isNewInsight: boolean
): UseInsightTypewriterReturn
```

**Behavior:**
- If `isNewInsight === false`: return all text immediately, `isAllComplete = true`
- If `isNewInsight === true`:
  - 150ms initial delay
  - Type paragraph 0 at 25ms/char
  - When paragraph 0 completes, 200ms pause, then type paragraph 1
  - Continue through all paragraphs
  - After last paragraph, type focusNext
  - `skip()` reveals all remaining text instantly

**Cursor:** Append `|` character (Inter, gold color) to the end of the currently-typing paragraph's displayed text. Remove when that paragraph completes.

---

## 4. InsightsScreen Rewrite

**File:** `tomo/src/screens/InsightsScreen.tsx`

Rewrite from card-based layout to message-based layout. The current 1,063-line file has all the data fetching, empty states, and refresh logic we need. The rewrite changes the render layer only.

### Screen Structure

```
SafeAreaView (flex:1, bg:colors.black)
  Header
    "Insights" (Unbounded-ExtraBold 28px)
    subtitle (Inter 13px gray500)

  Loading → InsightsSkeleton (keep existing)
  Error → error message + pull-to-retry
  0 sessions → EmptyNoSessions
  Building → EmptyFewSessions (with progress bar)

  ScrollView (RefreshControl)
    Week Header (JetBrains Mono 11px gray600)

    [If new insight, typewriter active]
      Typewriter paragraphs rendering sequentially
    [Else]
      Static paragraphs

    Focus section (gold label + body, border-top separator)
    Signoff line

    "Earlier" section header
    Collapsed older week rows (tap to expand inline)
```

### Paragraph Rendering

```typescript
function InsightParagraph({ text, isWatch, defer, isTyping }: Props) {
  // Parse **bold** markers in text
  const parts = parseBold(text);

  return (
    <View style={isWatch ? styles.watchParagraph : styles.paragraph}>
      <Text style={styles.paragraphText}>
        {parts.map((part, i) =>
          part.bold
            ? <Text key={i} style={styles.boldText}>{part.text}</Text>
            : part.text
        )}
        {isTyping && <Text style={styles.cursor}>|</Text>}
      </Text>
      {isWatch && defer && (
        <Text style={styles.deferText}>{defer}</Text>
      )}
    </View>
  );
}
```

### Styles

```typescript
const styles = StyleSheet.create({
  // Paragraph (default)
  paragraph: {
    marginBottom: spacing.md, // 16px
  },
  paragraphText: {
    fontFamily: 'Inter',
    fontSize: fontSizes.base, // 15px
    fontWeight: '500',
    color: colors.gray300,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '600',
    color: colors.white,
  },
  cursor: {
    color: colors.gold,
    fontWeight: '400',
  },

  // Watch paragraph (injury/risk)
  watchParagraph: {
    marginBottom: spacing.md,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.negative,
  },
  deferText: {
    fontFamily: 'Inter',
    fontSize: fontSizes.sm, // 13px
    fontWeight: '500',
    color: colors.gray500,
    marginTop: 6,
  },

  // Focus section
  focusSection: {
    marginTop: 20,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  focusLabel: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.gold,
    marginBottom: 6,
  },

  // Week header
  weekHeader: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    color: colors.gray600,
    marginTop: 12,
    marginBottom: spacing.md,
  },

  // Signoff
  signoff: {
    fontFamily: 'Inter',
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.gray600,
    marginTop: spacing.lg,
    lineHeight: 20,
  },

  // Collapsed older week
  collapsedWeek: {
    backgroundColor: colors.gray800,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collapsedDate: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray400,
  },
});
```

### Empty States

Keep existing empty state structure but update copy:

**0 sessions:**
- TrendUp icon 28px gray600 in 64px gray800 circle
- "Your debriefs will appear here"
- "Log your first session. After a week of training, TOMO will have something to say about your game."

**Building (1-2 sessions):**
- Same icon
- "Building your first debrief"
- "A few more sessions this week and your first weekly insight will appear."
- Progress bar: gold on gray700, 6px, label "2 of 3 sessions"

### Mark as Viewed

When insight finishes typing (or user skips, or insight was already viewed):
- Call `insightService.markAsViewed(insightId)`
- Sets `has_been_viewed = true`, `first_viewed_at = now()` in Supabase
- Next visit: `isNewInsight` will be false, no typewriter

### Pull-to-Refresh

- Standard RefreshControl, gold tint
- Reloads insights from Supabase
- If eligible (7+ days since last, 1+ session this week), triggers generation

---

## 5. Pattern Engine Updates

**File:** `tomo/src/services/insights-engine.ts`

Add to the `WeeklyInsightInput` assembly:

```typescript
// These fields exist in sessions but aren't currently aggregated
weekData.instructors = uniqueInstructorNames(sessionsThisWeek);
weekData.lessonTopics = uniqueLessonTopics(sessionsThisWeek);

// These fields exist in profile but aren't currently passed
input.trainingGoals = profile.training_goals;
input.experienceLevel = profile.experience_level;
input.age = computeAge(profile.birthday);
input.gender = profile.gender;
input.weight = profile.weight_lbs;
```

---

## 6. Service Layer Fix

**File:** `tomo/src/services/insights-service.ts`

- Delete the local `extractEdgeFnError()` function (lines 376-389)
- Import `parseEdgeFnError` from `supabase.ts` instead
- Verify all insight CRUD methods work with the new output schema

---

## Development Checklist

- [ ] Add TrendUp to Icons.tsx
- [ ] Wire InsightsTab in MainTabNavigator.tsx
- [ ] Create useInsightTypewriter hook
- [ ] Rewrite InsightsScreen render layer
- [ ] Add parseBold utility for **bold** markers
- [ ] Update pattern engine with new input fields
- [ ] Fix duplicate error parser in insights-service.ts
- [ ] Verify 4-tab layout with center Log button
- [ ] Test typewriter on first view, static on revisit
- [ ] Test skip behavior
- [ ] Test empty states (0 sessions, building, error)
- [ ] Test pull-to-refresh
- [ ] Test collapsed older weeks expand/collapse
- [ ] Run `npx tsc --noEmit` -- zero errors
- [ ] Local device test on Drew's phone
