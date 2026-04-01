# FEAT-002: Insights Tab

**Priority:** P0
**Status:** Built, testing locally (front-end complete, backend edge function pending)
**Added:** 2026-03-28 (DA-001)
**Elevated to feature project:** 2026-03-30
**Owner:** Drew

---

## The Problem

TOMO's core value proposition is: you log training sessions, and TOMO gives you something back. Right now, it only takes. Users record sessions via voice, review structured data, and see a journal feed. But the app never reflects anything meaningful about their training patterns, progress, or game development.

The Insights feature -- the thing that transforms logged data into personalized coaching observations -- is fully built. 1,065-line screen, four edge functions, three database tables, a client-side pattern engine, complete type definitions. It was the #1 finding in the March 28 UX audit (Severity 4: Catastrophic). It's hidden from every user because it was never wired into navigation.

This isn't a "wire the tab" task. This is TOMO's core differentiator. It deserves proper product thinking before we connect the plumbing.

### Three problems this solves

1. **No return on investment.** Users put effort into logging sessions (voice recording, review, editing) but get nothing back. The Journal is a list of what they already know. There's no "aha" moment.

2. **No reason to come back.** After the novelty of voice logging wears off (~2 weeks), there's no pull. Session logging is a chore without a payoff. Insights create a reason to open the app even on rest days.

3. **No proof TOMO understands BJJ.** The belt personalization system adapts tone and vocabulary, but users never see TOMO demonstrate knowledge of their specific training. Insights that reference their actual techniques, sparring patterns, and consistency prove the app is paying attention.

### Who feels this most

| Persona | Pain | What insights fix |
|---------|------|-------------------|
| **Alex (white belt newcomer)** | "Am I even getting better?" | Weekly insight shows technique count growing, consistency building |
| **Jake (white belt survivor)** | Invisible progress | Monthly review names the game they're developing, validates effort |
| **Marcus (blue belt plateau)** | "I'm not improving" | Quarterly assessment identifies system-level patterns, new angles |
| **Sofia (purple belt grinder)** | Already tracks mentally, needs depth | Strategic observations she hasn't noticed herself |

## What Already Exists

The engineering work is done. This feature project focuses on the **product and UX layer** -- how to surface insights so users actually feel value.

### Built and ready

| Component | Location | Status |
|-----------|----------|--------|
| InsightsScreen (1,065 lines) | `tomo/src/screens/InsightsScreen.tsx` | Built, untested in production |
| Pattern engine (client-side) | `tomo/src/services/insights-engine.ts` | Built, no AI cost |
| Insights service (CRUD + orchestration) | `tomo/src/services/insights-service.ts` | Built |
| TypeScript types (476 lines) | `tomo/src/types/insights-types.ts` | Built |
| Weekly edge function (Haiku) | `tomo/supabase/functions/generate-weekly/` | Built, not deployed |
| Monthly edge function (Sonnet) | `tomo/supabase/functions/generate-monthly/` | Built, not deployed |
| Quarterly edge function (Opus) | `tomo/supabase/functions/generate-quarterly/` | Built, not deployed |
| Chat follow-up edge function | `tomo/supabase/functions/chat-with-insight/` | Built, not deployed |
| Database migration (3 tables, RLS) | `tomo/supabase/migrations/20260322100000_insights_tables.sql` | Written, not deployed |
| Typewriter + glow design (prototype) | `prototype/src/components/features/TrainingFeedback.tsx` | Built in web prototype |

### Not built

| Component | Notes |
|-----------|-------|
| TrendUp tab icon | Port from prototype Icons.tsx (MIT, Lucide lineart) |
| Navigation wiring | InsightsScreen not in MainTabNavigator |
| Generation triggers | No trigger after session save |
| UCD rebuild trigger | No trigger after session save |
| Typewriter hook (React Native) | Exists in web prototype, needs port |

## Existing Technical Documentation

All engineering specs live in `docs/insights/`. This feature project does NOT duplicate them -- it adds the product layer on top.

| Doc | What it covers |
|-----|----------------|
| `docs/insights/README.md` | Architecture overview, data flow, cost projections |
| `docs/insights/BUILD_PLAN.md` | 7-phase implementation plan |
| `docs/insights/INTEGRATION_PLAN.md` | 10-step integration checklist with audit results |
| `docs/insights/SCREEN_IMPLEMENTATION_PLAN.md` | Typewriter UI port from prototype |
| `docs/insights/SCHEMA.md` | Database tables, RLS, indexes |
| `docs/insights/PERSONALIZATION.md` | User Context Document architecture |
| `docs/insights/CHAT_SPEC.md` | 5-exchange conversation rules |
| `docs/insights/models/HAIKU_WEEKLY.md` | Weekly model spec (309 lines) |
| `docs/insights/models/SONNET_MONTHLY.md` | Monthly model spec (404 lines) |
| `docs/insights/models/OPUS_QUARTERLY.md` | Quarterly model spec (496 lines) |
| `docs/insights/CLAUDE.md` | Development rules and constraints |

## Files

| File | Purpose |
|------|---------|
| [STRATEGY.md](STRATEGY.md) | Three UX approaches, persona analysis, tradeoffs, recommendation |
| [CONTENT_STRATEGY.md](CONTENT_STRATEGY.md) | Belt-specific content rules -- what white belts vs. blue belts need to hear |
| [PSYCHOLOGICAL_PROFILES.md](PSYCHOLOGICAL_PROFILES.md) | Deep sports psychology reference -- dropout triggers, milestone moments, tone matrix, scenario bank, anti-patterns. Written from black belt/sports psych perspective. |
| [APPROVED_DESIGN.md](APPROVED_DESIGN.md) | **Locked design direction.** Message style, typewriter on first view, red border for injuries only. |
| [SPEC_FRONTEND.md](SPEC_FRONTEND.md) | Front-end dev spec -- InsightsScreen rewrite, typewriter hook, Icons, navigation, styles |
| [SPEC_BACKEND.md](SPEC_BACKEND.md) | Backend dev spec -- edge function, system prompt, database, trigger logic, testing |
| [EDGE_CASES.md](EDGE_CASES.md) | Every scenario before, between, and during insights -- gap handling, sparse data, generation failures |
| [BUILD_TONIGHT.md](BUILD_TONIGHT.md) | **ACTIVE BUILD PLAN** -- 13 steps, all edge cases, ship to TestFlight tonight |
| [TASKS.md](TASKS.md) | Original task breakdown (superseded by BUILD_TONIGHT.md) |
| SPEC.md | (superseded by SPEC_FRONTEND + SPEC_BACKEND) |

| [PROMPT_ENGINEERING.md](PROMPT_ENGINEERING.md) | **The brain of the feature.** Data inventory, prompt architecture, motivation x belt matrix, system prompt template, new data fields to collect |
| [DESIGN_PLAN.md](DESIGN_PLAN.md) | Pixel-level design spec -- every color, font, spacing, component anatomy |

### Visual References (open in browser)

| File | What it shows |
|------|---------------|
| [strategy-review.html](strategy-review.html) | Strategy doc formatted for reading |
| [ux-wireframes.html](ux-wireframes.html) | Phone-frame wireframes for all three approaches |
| [belt-insights-examples.html](belt-insights-examples.html) | Realistic insight content by belt level with side-by-side comparison |
| [design-prototype.html](design-prototype.html) | Earlier card-based prototype (superseded by v2) |
| [visual-direction-v2.html](visual-direction-v2.html) | **APPROVED design** -- message style, red for injuries, typewriter on first view |

Data model work is already complete in `docs/insights/SCHEMA.md`. No separate DATA_MODEL.md needed.

## Dependencies

- **FEAT-001 (Experience Intake)** benefits from Insights but is not a blocker. Insights work with zero prior context -- the empty states handle cold start gracefully.
- **DA-003 (Review Phase Redesign)** is independent but shipping alongside would create a stronger "before/after" moment for testers.
- **Belt Personalization System** is already built and integrated into all edge function prompts.

## Next Steps

1. Review and pick UX approach from STRATEGY.md
2. Write screen-by-screen spec (SPEC.md) for chosen approach
3. Create implementation tasks (TASKS.md) that reference both this spec and the existing `docs/insights/INTEGRATION_PLAN.md`
4. Build and ship
