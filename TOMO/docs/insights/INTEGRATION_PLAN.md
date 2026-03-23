# Insights Feature — Integration Plan

**Created:** March 22, 2026
**Status:** Code written, not connected. This plan covers integration into MVP 1.0.

---

## Pre-Integration Audit Results

TypeScript compilation: **CLEAN** (zero errors, `npx tsc --noEmit`)
ESLint: No config in project (not a blocker)

### Issues Found (6 items, ranked by severity)

| # | Severity | Issue | File(s) | Fix |
|---|----------|-------|---------|-----|
| 1 | **High** | Model IDs need verification | `generate-monthly`, `generate-quarterly` | Confirm `claude-sonnet-4-6-20250514` and `claude-opus-4-6-20250514` exist in Anthropic API. If not, swap to latest stable Sonnet/Opus model IDs. |
| 2 | **High** | `belt-system/journal-patterns` imports not verified | `insights-engine.ts:24`, `user-context.ts:18` | Verify that `analyzeJournalEntry` and `quickSentimentCheck` are exported from `tomo/src/config/belt-system/journal-patterns.ts`. If export names differ, update imports. |
| 3 | **Medium** | Duplicate edge function error parser | `insights-service.ts:376-389` | `supabase.ts` already has `parseEdgeFnError()`. Export it from supabase.ts and import in insights-service.ts. Delete the local duplicate `extractEdgeFnError()`. |
| 4 | **Medium** | Missing Insights tab icon | `Icons.tsx` | Add a Lightbulb (or Brain/Sparkle) SVG icon to `Icons.tsx`. Needed for the 4th tab in `MainTabNavigator.tsx`. |
| 5 | **Medium** | Insights tab not wired into navigation | `MainTabNavigator.tsx` | Add `InsightsTab` to `MainTabParamList`, add `Tab.Screen` component, import `InsightsScreen`. |
| 6 | **Low** | Purple color hardcoded | `InsightsScreen.tsx:46` | Add `colors.purple: '#8B5CF6'` to `design-tokens.ts` and reference it instead of the inline hex. |

### Patterns Verified (all passing)

- Supabase client usage matches `supabase.ts` canonical pattern
- Service layer follows `sessionService` / `profileService` conventions
- Edge functions match `extract-session` structure (CORS, auth, Anthropic SDK v0.39.0, timeout, code fence stripping)
- All TypeScript types explicit, no implicit `any` (strict mode compliant)
- Null checks present for auth, empty data, optional fields
- Navigation patterns match existing `JournalScreen` and `ProfileScreen`
- RLS policies follow existing migration patterns
- Foreign keys reference correct tables and column types
- No circular dependencies detected

---

## Integration Steps (Ordered)

### Step 1: Fix Audit Issues (Pre-Integration)

These fixes happen BEFORE connecting anything.

#### 1a. Verify model IDs
- Call Anthropic API (or check docs) to confirm model IDs:
  - `claude-sonnet-4-6-20250514`
  - `claude-opus-4-6-20250514`
- If invalid, update the `MODEL` constant in `generate-monthly/index.ts` and `generate-quarterly/index.ts`
- Also update `MODELS` map in `chat-with-insight/index.ts`
- Also update `INSIGHT_MODELS` in `insights-types.ts`

#### 1b. Verify journal-patterns imports
- Open `tomo/src/config/belt-system/journal-patterns.ts`
- Confirm these are exported: `analyzeJournalEntry`, `quickSentimentCheck`
- If export names differ (e.g., `analyzeJournal` instead of `analyzeJournalEntry`), update imports in:
  - `insights-engine.ts` line 24
  - `user-context.ts` line 18

#### 1c. Deduplicate error parser
- In `supabase.ts`: Export the existing `parseEdgeFnError()` function (add `export` keyword)
- In `insights-service.ts`: Replace local `extractEdgeFnError()` with import from `supabase.ts`
- Delete the local function definition (~13 lines)

#### 1d. Add purple color token
- In `design-tokens.ts`: Add `purple: '#8B5CF6'` to the colors object
- In `InsightsScreen.tsx` line 46: Replace `'#8B5CF6'` with `colors.purple`

### Step 2: Add Insights Tab Icon

- Open `src/components/Icons.tsx`
- Add a `Lightbulb` icon (SVG path matching the existing 24x24 viewBox pattern)
- Follow the same component pattern as existing icons (props: `size`, `color`)
- Suggested: simple lightbulb outline or sparkle/star — matches "insights" concept

### Step 3: Wire Navigation

- Open `src/navigation/MainTabNavigator.tsx`
- Import `InsightsScreen` from `../screens/InsightsScreen`
- Import `Lightbulb` (or chosen icon) from `../components/Icons`
- Update `MainTabParamList`:
  ```typescript
  export type MainTabParamList = {
    JournalTab: undefined;
    LogTab: undefined;
    InsightsTab: undefined;  // ADD
    ProfileTab: undefined;
  };
  ```
- Add `Tab.Screen` between LogTab and ProfileTab:
  ```typescript
  <Tab.Screen
    name="InsightsTab"
    component={InsightsScreen}
    options={{
      tabBarLabel: 'Insights',
      tabBarIcon: ({ color, size }) => (
        <Icons.Lightbulb size={size} color={color} />
      ),
    }}
  />
  ```
- Tab order becomes: **Journal | [Log] | Insights | Profile**

### Step 4: Run Database Migration

- Run against Supabase: `supabase db push` or apply migration manually
- Verify tables created: `insights`, `insight_conversations`, `user_context`
- Verify RLS policies active
- Verify indexes created
- Test: `SELECT * FROM insights LIMIT 1;` should return empty, no errors

### Step 5: Deploy Edge Functions

Deploy in this order (dependencies):
1. `supabase functions deploy generate-weekly --no-verify-jwt`
2. `supabase functions deploy generate-monthly --no-verify-jwt`
3. `supabase functions deploy generate-quarterly --no-verify-jwt`
4. `supabase functions deploy chat-with-insight --no-verify-jwt`

Then redeploy WITH JWT verification:
1. `supabase functions deploy generate-weekly`
2. `supabase functions deploy generate-monthly`
3. `supabase functions deploy generate-quarterly`
4. `supabase functions deploy chat-with-insight`

Verify `ANTHROPIC_API_KEY` secret is set:
```bash
supabase secrets list  # should show ANTHROPIC_API_KEY
```

### Step 6: Connect InsightsScreen to Auth Context

- InsightsScreen currently fetches session count via `sessionService.list()`
- Add `useAuth()` import to get profile (belt, name, target_frequency)
- Pass belt/profile data to pattern engine functions when generating insights
- This enables the UCD builder and belt-adaptive prompts

### Step 7: Integrate UCD Rebuild Trigger

- After a session is saved in `SessionLoggerScreen.tsx` (success phase):
  - Call `buildUserContext(profile, sessions)` from `user-context.ts`
  - Call `serializeUCD(ucd)` to get prompt-ready text
  - Call `userContextService.upsert(...)` to persist
- This keeps the UCD fresh after every session log
- First session will create the UCD; subsequent sessions update it

### Step 8: Wire Insight Generation Triggers

- **Weekly:** Add generation trigger to InsightsScreen's `onRefresh` or a dedicated "Generate" button
  - Check eligibility via `checkInsightEligibility()`
  - If eligible, call `buildWeeklyInput()` → `insightGenerationService.generateWeekly()`
  - Fetch lower-tier context via `insightService.getLowerTierContext()` and pass to input builder
- **Monthly/Quarterly:** Same pattern but with monthly/quarterly builders
  - Initially: manual trigger only (user taps to generate)
  - Future: automatic generation on cadence

### Step 9: Wire Chat Follow-Up

- On InsightsScreen, add "Ask about this" button to each insight card
- Button opens a chat modal or bottom sheet
- Chat calls `insightChatService.sendMessage()` with the insight context
- Display responses inline with exchange counter (N/5)
- Disable input after 5 exchanges, show close message

### Step 10: Local Testing

- Build locally: `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device`
- Test sequence:
  1. Open app → navigate to Insights tab → see empty state
  2. Log a session → return to Insights → verify session count updates
  3. Trigger weekly insight → verify Haiku card appears
  4. Tap insight → verify chat opens → send 5 messages → verify close
  5. Log 5+ sessions across 2+ weeks → trigger monthly → verify Sonnet card
  6. Verify belt-adaptive tone (switch belt in profile, regenerate)

---

## What NOT to Do

- **Don't deploy to TestFlight** until all 10 steps pass locally
- **Don't auto-generate insights** on app open — wait for explicit trigger or cadence
- **Don't run migration on production** until edge functions are deployed and tested
- **Don't skip JWT re-deployment** — functions must enforce auth in production
- **Don't connect quarterly Opus** until weekly and monthly are stable (it depends on their outputs)

---

## Estimated Scope Per Step

| Step | Complexity | Files Modified | New Code? |
|------|-----------|---------------|-----------|
| 1a | Verify only | 3-4 edge function files | Possibly swap model IDs |
| 1b | Verify only | 2 service files | Possibly rename imports |
| 1c | Small | `supabase.ts`, `insights-service.ts` | No — dedup |
| 1d | Tiny | `design-tokens.ts`, `InsightsScreen.tsx` | 1 line add, 1 line change |
| 2 | Small | `Icons.tsx` | ~15 lines (SVG icon) |
| 3 | Small | `MainTabNavigator.tsx` | ~15 lines |
| 4 | Deploy | Migration SQL (already written) | No |
| 5 | Deploy | Edge functions (already written) | No |
| 6 | Small | `InsightsScreen.tsx` | ~10 lines |
| 7 | Medium | `SessionLoggerScreen.tsx` | ~20 lines |
| 8 | Medium | `InsightsScreen.tsx` | ~40 lines |
| 9 | Medium | `InsightsScreen.tsx` + new chat component | ~80 lines |
| 10 | Testing | None | None |

**Total new code for integration: ~180 lines across 6-7 files.**
Everything else is already written and waiting.

---

## After Integration: Testing Checklist

- [ ] Insights tab visible in bottom nav with icon
- [ ] Empty state shows correctly (0 sessions, 1-4 sessions, 5+ sessions)
- [ ] Weekly insight generates successfully with Haiku
- [ ] Weekly card displays with correct type badges and formatting
- [ ] Monthly insight generates after 5+ sessions in a month
- [ ] Monthly card shows 6-section review
- [ ] Context cascades: weekly insights reference monthly focus area
- [ ] Chat opens from insight card, exchanges count correctly, closes at 5
- [ ] Coach deferral footer visible at bottom of insights
- [ ] Pull-to-refresh works on Insights screen
- [ ] UCD rebuilds after each new session
- [ ] Belt-adaptive tone changes with different belt levels
- [ ] Feedback thumbs (helpful/not helpful) save to database
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Local build succeeds: `npx expo run:ios --device`
