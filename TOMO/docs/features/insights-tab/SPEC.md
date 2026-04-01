# FEAT-002: Insights Tab -- Screen Spec

**Created:** 2026-03-30
**Approach:** B (Weekly Check-In, static cards, own tab)
**Dependency:** FEAT-008 (User Profile Expansion) for birthday, gender, weight, expanded goals

---

## Screen: InsightsScreen

### Entry Point
Tab bar, 3rd tab (between Log and Profile). TrendUp icon. Label "Insights".

### Header
- Title: "Insights" -- Unbounded-ExtraBold 28px white
- Subtitle: "Based on N sessions" -- Inter 13px gray500
- Subtitle only shows when session_count > 0

### State Machine

```
                    +------------------+
                    |  Loading         |
                    |  (skeleton cards)|
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
    +---------v--+  +--------v-------+  +---v-----------+
    | 0 sessions |  | 1-2 sessions   |  | 3+ sessions   |
    | (empty)    |  | (building)     |  | (has insights)|
    +------------+  +----------------+  +--------+------+
                                                 |
                                    +------------+-------------+
                                    |            |             |
                              +-----v----+ +----v------+ +----v------+
                              | Current  | | Older     | | Error     |
                              | week     | | weeks     | | state     |
                              | expanded | | collapsed | | (retry)   |
                              +----------+ +-----------+ +-----------+
```

### Empty State: 0 Sessions

- 64px circle (gray800 bg), TrendUp icon 28px gray600 centered
- Title: "Your debriefs will appear here" -- Inter-Bold 20px white
- Body: "Log your first session. After a week of training, TOMO will have something to say about your game." -- Inter 15px gray500, centered, lineHeight 22
- No CTA button (the Log tab is right there)

### Empty State: 1-2 Sessions (Building)

- Same icon circle
- Title: "Building your first debrief" -- Inter-Bold 20px white
- Body: "A few more sessions this week and your first weekly insight will appear." -- Inter 15px gray500
- Progress bar: gold fill on gray700 track, 6px height, 200px max-width
- Label: "2 of 3 sessions" -- JetBrains Mono 12px gray500
- Progress threshold: user's `target_frequency` or 3, whichever is lower

### Content State: Weekly Insights

**Section label:** "THIS WEEK" -- JetBrains Mono 12px 600wt gray500 uppercase, 2px tracking, with gray700 line extending right

**Weekly card (current week, expanded):**
- Container: gray800 bg, radius-lg, 1px gray700 border, 16px padding
- Header row: date range (Inter-SemiBold 15px white) + NEW badge (if unviewed)
- 2-3 insight items, each with:
  - Type badge: pill shape, JetBrains Mono 10px 600wt uppercase
    - technique: infoDim bg, info text
    - consistency: goldDim bg, gold text
    - sparring: positiveDim bg, positive text
    - risk: negativeDim bg, negative text
    - milestone: goldDim bg, gold text
  - Title: Inter-Bold 15px white
  - Body: Inter 15px gray400, lineHeight 22
- Focus Next section (below last insight, separated by 1px gray700 border-top):
  - Label: "FOCUS NEXT WEEK" -- JetBrains Mono 12px 600wt gold uppercase, 1.5px tracking
  - Body: Inter 15px gray300, lineHeight 22

**Section label:** "EARLIER" (only if older weeks exist)

**Collapsed week rows (older weeks):**
- Container: gray800 bg, radius-lg, 1px gray700 border, 12px vert / 16px horiz padding
- Left: date range (Inter-SemiBold 15px gray300) + insight count (Inter 13px gray600)
- Right: ChevronRight 16px gray600
- Tap: expands inline with same card anatomy as current week (no animation, instant)
- Tap again: collapses back

**Coach deferral footer (bottom of scroll):**
- 32px top margin, 16px vert padding
- "Your coach knows your game better than any app. These observations supplement -- never replace -- their guidance."
- Inter 15px gray600, centered, lineHeight 22
- Shows only on first visit or when scrolled to bottom

### Pull-to-Refresh
- Standard React Native RefreshControl
- Triggers: reload insights from Supabase + attempt generation if eligible
- Gold tint on the spinner

### Error State
- "Something went wrong loading your insights."
- Inter 15px gray500, centered
- "Pull down to retry" below

### Mark as Viewed
- When insight scrolls into viewport (or screen opens with new insight visible)
- Update `has_been_viewed = true` and `first_viewed_at = now()` via insightService
- Remove NEW badge with fade (200ms)
- Track `viewedThisSession` locally to prevent re-marking during same session

---

## Navigation: MainTabNavigator Changes

### Current (3 tabs)
```
Journal | [Log] | Profile
```

### New (4 tabs)
```
Journal | [Log] | Insights | Profile
```

### Changes to MainTabNavigator.tsx

1. Add to `MainTabParamList`:
   ```typescript
   InsightsTab: undefined;
   ```

2. Import InsightsScreen:
   ```typescript
   import InsightsScreen from '../screens/InsightsScreen';
   ```

3. Add Tab.Screen between LogTab and ProfileTab:
   ```typescript
   <Tab.Screen
     name="InsightsTab"
     component={InsightsScreen}
     options={{
       tabBarLabel: 'INSIGHTS',
       tabBarIcon: ({ color, size }) => (
         <Icons.TrendUp size={size} color={color} />
       ),
     }}
   />
   ```

4. Port TrendUp icon from prototype (`prototype/src/components/ui/Icons.tsx` line 516):
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

---

## Edge Function: generate-weekly

### Trigger
Called after session save when:
- 7+ days since last weekly insight for this user, AND
- 1+ session logged in the current week (Monday-Sunday)

### Input Assembly (client-side, in insights-engine.ts)
1. Fetch user profile (including birthday, gender, weight, training_goals, experience_level)
2. Compute age from birthday
3. Fetch sessions for current week
4. Fetch sessions for prior week (for delta)
5. Compute weekData (techniques, submissions, sparring, injuries, sentiment, patterns)
6. Aggregate instructor names and lesson topics from this week's sessions
7. Fetch UCD serialized text (or build if none exists)
8. Fetch monthly/quarterly context (if exists)
9. Assemble WeeklyInsightInput object

### System Prompt
Use the redesigned prompt from PROMPT_ENGINEERING.md. Key routing variables:
- `belt` + `stripes` (tone and vocabulary)
- `trainingGoals` (motivation framing)
- `age` (recovery and volume language)
- `gender` (social dynamics context)
- `experienceLevel` (calibration)

### Output
```json
{
  "insights": [
    { "type": "technique|consistency|sparring|risk|milestone", "title": "...", "body": "..." }
  ],
  "focusNext": "..."
}
```

### Storage
Insert into `insights` table:
- tier: "weekly"
- period_start: Monday of the week
- period_end: Sunday of the week
- insight_data: the JSON output
- model: "claude-haiku-4-5-20251001"
- has_been_viewed: false

---

## Data Dependencies on FEAT-008

FEAT-002 can ship without FEAT-008, but the insights will be less personalized:

| Without FEAT-008 | With FEAT-008 |
|-------------------|---------------|
| No age context in prompt | Age-calibrated recovery/volume language |
| No gender context | Social dynamics awareness |
| No weight context | Competition weight class framing |
| Current training_goals options (5) | Expanded options (7) including Self-Defense, Self-Improvement, Social |
| training_goals not in prompt | training_goals routed into motivation framing blocks |

**Recommendation:** Ship FEAT-008 onboarding changes first (or alongside), then deploy FEAT-002. The prompt is designed to gracefully degrade -- if birthday/gender/weight are null, those prompt blocks are skipped.
