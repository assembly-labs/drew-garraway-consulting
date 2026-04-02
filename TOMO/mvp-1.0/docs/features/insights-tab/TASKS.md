# FEAT-002: Insights Tab -- Implementation Tasks

**Updated:** 2026-03-30
**Design:** Approved (message style + typewriter on first view)
**FEAT-008:** Shipped (birthday, gender, weight, expanded goals in DB)
**Specs:** SPEC_FRONTEND.md + SPEC_BACKEND.md

---

## Build Order

### Front-End (do first, can test with mock data)

- [x] **FE-1: TrendUp icon** -- Port from prototype to Icons.tsx. Add to export. (10 min)
- [x] **FE-2: Wire navigation** -- Add InsightsTab to MainTabNavigator between Log and Profile. Verify 4-tab layout with center button. (15 min)
- [x] **FE-3: useInsightTypewriter hook** -- Port typing logic from GetStartedScreen ChatBubble. 25ms/char, sequential paragraphs, skip on tap, cursor while typing. (30 min)
- [x] **FE-4: parseBold utility** -- Parse `**bold**` markers into styled Text spans. Small utility function. (10 min)
- [x] **FE-5: InsightsScreen rewrite** -- Message-style layout per APPROVED_DESIGN.md. Paragraphs, watch items (red border), focus section, signoff, collapsed older weeks. Integrate typewriter hook for new insights. Keep existing data fetching, empty states, skeleton, refresh. (60-90 min)
- [ ] **FE-6: Pattern engine updates** -- Add instructor, lesson_topic, training_goals, experience_level, age (from birthday), gender, weight to WeeklyInsightInput assembly. (20 min)
- [x] **FE-7: Fix insights-service** -- Delete local extractEdgeFnError, import parseEdgeFnError from supabase.ts. Update to handle new output schema (paragraphs array instead of insights array). (15 min)
- [x] **FE-8: TypeScript check** -- `npx tsc --noEmit` passes with zero errors. (5 min)

### Backend (do after front-end shell is ready)

- [ ] **BE-1: Deploy DB migration** -- `supabase db push` for insights, insight_conversations, user_context tables. Verify RLS policies in Supabase dashboard. (10 min)
- [ ] **BE-2: Rewrite system prompt** -- Replace current prompt in generate-weekly/index.ts with redesigned version from PROMPT_ENGINEERING.md. Add training_goals routing blocks, age context, gender context, belt rules, output format for paragraphs schema. (45-60 min)
- [ ] **BE-3: Update input handling** -- Edge function now receives additional fields (training_goals, experience_level, age, gender, weight, instructors, lessonTopics). Query profiles table for FEAT-008 fields. Compute age from birthday. (20 min)
- [ ] **BE-4: Update output parsing** -- Validate response matches new WeeklyInsightOutput schema (paragraphs array, not insights array). Handle **bold** markers, isWatch flag, defer strings. (15 min)
- [ ] **BE-5: Deploy edge function** -- `supabase functions deploy generate-weekly --no-verify-jwt`. Test with curl. (10 min)
- [ ] **BE-6: Wire generation trigger** -- After session save in session-service.ts, check eligibility (7+ days since last, 1+ session this week), fire background generation. (20 min)

### Integration Testing

- [ ] **TEST-1: Local device test** -- Full flow on Drew's phone. Log a session, wait for trigger, open Insights tab, verify typewriter plays, verify content is belt-appropriate, verify skip works, verify revisit shows static text. (30 min)
- [ ] **TEST-2: Edge cases** -- Test 0 sessions (empty state), 1-2 sessions (building state), pull-to-refresh, error state, collapsed weeks expand/collapse. (15 min)
- [ ] **TEST-3: Belt tone verification** -- Generate insights for a white belt profile and a blue belt profile. Check vocabulary, tone, and framing against CONTENT_STRATEGY.md rules. (15 min)
- [ ] **TEST-4: Motivation verification** -- Generate insights for "Self-Defense" vs "Fitness" vs "Mental Health" training goals with same session data. Verify framing differs per PROMPT_ENGINEERING.md matrix. (15 min)

---

## Estimated Total

| Phase | Time |
|-------|------|
| Front-end (FE-1 through FE-8) | ~2.5-3 hours |
| Backend (BE-1 through BE-6) | ~2-2.5 hours |
| Testing (TEST-1 through TEST-4) | ~1.25 hours |
| **Total** | **~6-7 hours (2-3 sessions)** |

---

## Session End Checklist

After each build session:
- [ ] Update CHANGELOG.md
- [ ] Update ISSUES.md (mark DA-001 Done when tab is wired)
- [ ] Check off completed tasks above
- [ ] Run `npx tsc --noEmit`
- [ ] Tell Drew: test locally or TestFlight
