# Insights Build Plan

## Overview

Phased implementation plan. Each phase ships testable value. No phase depends on a future phase.

## Phase 1: Pattern Engine + UCD v1 (No AI)

**What ships:** Client-side aggregation service + basic Insights screen with computed data cards

**Files:**
- `tomo/src/services/insights-engine.ts` -- pattern computation
- `tomo/src/services/user-context.ts` -- UCD builder
- `tomo/src/types/insights-types.ts` -- all TypeScript types
- `tomo/src/screens/InsightsScreen.tsx` -- UI with static cards
- Navigation update: add 4th tab

**Test:** Open Insights tab -> see computed stats from existing sessions

**TestFlight milestone:** Users see basic analytics without any AI cost

## Phase 2: Weekly Haiku

**What ships:** AI-generated weekly insights

**Files:**
- `tomo/supabase/functions/generate-weekly/index.ts` -- edge function
- `tomo/supabase/migrations/YYYYMMDD_insights_tables.sql` -- DB migration
- Update InsightsScreen to show weekly AI cards
- Update `tomo/src/services/supabase.ts` -- insight CRUD

**Test:** Log 1+ session -> trigger weekly generation -> see AI insight card

**TestFlight milestone:** First AI-generated insights appear

## Phase 3: Monthly Sonnet + Context Cascade

**What ships:** Monthly reviews + Haiku gets monthly context

**Files:**
- `tomo/supabase/functions/generate-monthly/index.ts`
- Update InsightsScreen: monthly card + "Read Full Review" detail view
- Update insights-engine: monthly aggregation + context extraction
- Update generate-weekly: accept and use monthlyContext

**Test:** After 1 month with 5+ sessions -> generate monthly -> next weekly includes context

**TestFlight milestone:** Monthly reviews appear, weekly insights become context-aware

## Phase 4: Quarterly Opus + Full Cascade

**What ships:** Quarterly assessments + full priority cascade

**Files:**
- `tomo/supabase/functions/generate-quarterly/index.ts`
- Update InsightsScreen: premium quarterly card
- Update generate-monthly: accept quarterlyPriorities
- New screen: InsightDetailScreen.tsx for full-page reviews

**Test:** After 1 quarter with 2+ monthly reviews -> generate quarterly -> monthly and weekly reference priorities

**TestFlight milestone:** Complete tiered system operational

## Phase 5: Chat Follow-Up

**What ships:** 5-exchange conversations on any insight

**Files:**
- `tomo/supabase/functions/chat-with-insight/index.ts`
- New component: InsightChat.tsx
- Update InsightDetailScreen: "Ask about this" button
- DB: insight_conversations table (added in Phase 2 migration)

**Test:** Tap weekly insight -> ask question -> get response -> 5 exchanges -> closes

**TestFlight milestone:** Conversational depth available

## Phase 6: UCD Learning + Feedback Loop

**What ships:** Thumbs up/down on insights + UCD learns from chat patterns

**Files:**
- Update user-context.ts: chat preference analysis
- Update InsightsScreen: feedback thumbs UI
- Update supabase.ts: feedback CRUD

**Test:** Thumb up/down -> stored -> UCD updates -> next insights reflect preference

**TestFlight milestone:** System gets smarter with use

## Phase 7: Progressive Profiling (Future)

- Add age, gender, weight collection
- Competition history tracking
- Lineage/affiliation detection
- Semi-annual and annual Opus reviews
