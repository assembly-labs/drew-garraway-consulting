# Insights Tab -- Claude Context

## Read First

Before working on this feature, read in this order:

1. This file (CLAUDE.md)
2. `README.md` in this folder -- problem statement, what exists, what doesn't
3. `STRATEGY.md` in this folder -- approach decision (check if one has been picked)
4. `docs/insights/CLAUDE.md` -- engineering rules, model routing, token budgets, non-negotiables
5. `docs/insights/INTEGRATION_PLAN.md` -- 10-step integration checklist with audit findings

## What This Folder Is

This is the **product layer** for the Insights feature. It lives alongside the existing `docs/insights/` engineering docs but focuses on UX strategy, user research, and phased delivery.

```
docs/features/insights-tab/    <-- Product strategy (this folder)
    README.md                  <-- Problem, status, dependencies
    STRATEGY.md                <-- UX approaches, tradeoffs, recommendation
    CLAUDE.md                  <-- This file
    SPEC.md                    <-- (future) Screen-by-screen UX spec
    TASKS.md                   <-- (future) Implementation steps

docs/insights/                 <-- Engineering specs (existing, don't duplicate)
    README.md                  <-- Architecture, data flow, costs
    BUILD_PLAN.md              <-- 7-phase technical plan
    INTEGRATION_PLAN.md        <-- Integration checklist + audit
    SCREEN_IMPLEMENTATION_PLAN.md  <-- Typewriter UI port spec
    SCHEMA.md                  <-- Database tables
    PERSONALIZATION.md         <-- UCD architecture
    CHAT_SPEC.md               <-- Conversation rules
    models/                    <-- Haiku, Sonnet, Opus prompt specs
```

## Rules for Working on This Feature

1. **Don't duplicate engineering docs.** If the answer is in `docs/insights/`, reference it -- don't copy it here.
2. **Product decisions live here.** Which approach, what ships when, UX spec, task ordering.
3. **Follow the features workflow.** Status updates go in `docs/features/README.md` backlog table. Progress goes in TASKS.md (once created). Bugs go in ISSUES.md.
4. **Read the approach decision before building.** If STRATEGY.md doesn't have a decision logged, ask Drew before starting implementation.
5. **The existing InsightsScreen may be rewritten.** Depending on which approach is chosen, the current 1,065-line screen may ship as-is (Approach B) or get a typewriter rewrite (Approach A). Check STRATEGY.md for the current plan.

## Key Constraints

- Edge functions MUST deploy with `--no-verify-jwt` (has caused P0 outages 3 times)
- Insights tab goes between Log (center) and Profile in the tab bar: Journal | [Log] | Insights | Profile
- Weekly insights need 1+ session that week. Monthly needs 5+ sessions and 2+ weekly insights. Quarterly needs 2+ monthly reviews.
- Pattern engine runs client-side (free, offline). Only the AI generation hits edge functions.
- Cost per user per year: ~$0.85 at full tiers. Weekly alone: ~$0.016/year.
- All insights defer to the user's coach. "Observations, not instructions."
