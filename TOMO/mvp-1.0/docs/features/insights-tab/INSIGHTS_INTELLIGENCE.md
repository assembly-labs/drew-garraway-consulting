# FEAT-009: Insights Intelligence

**Status:** Exploring
**Priority:** P2 (build when retention matters)
**Depends on:** FEAT-002 (shipped), tester feedback on weekly insights
**Research:** `SPORTS_PSYCHOLOGY_RESEARCH.md` (same folder)

---

## What This Is

Psychology-informed enhancements to the Insights system. Each phase adds a new data input or detection capability that makes weekly debriefs smarter. None of these are needed for the current TestFlight MVP. They become important at 50+ active users when retention is a real metric.

---

## Phase 1.5 (First After Tester Feedback)

### Mood Rating
- Add 1-5 mood/vibe rating to post-session flow (one tap, optional)
- New field: `mood_rating INTEGER CHECK (1-5)` on sessions
- Feed into pattern engine as `moodTrend` (4-week trajectory) and `moodByMode` (gi vs nogi)
- Inject into weekly prompt as first-class data point
- **Why:** Enjoyment is the #1 predictor of habit formation (0.62 point increase in automaticity per 1-point valence score, PMC 2020, n=226). Declining mood over 3+ weeks = retention risk signal.

### "Tell Me More" Follow-Up
- Single "Tell me more" button below any weekly insight
- One exchange, Haiku, 200 tokens
- Tests chat architecture with minimal risk before full Phase 3
- **Why:** Research says people profit more from feedback when they ask for it. This is the "pull" mechanism.

---

## Phase 2 (After 50+ Users)

### Pre-Session Intention
- "What's your focus today?" prompt before training (one line of text or tap a recent technique)
- New field: `session_intention TEXT` (optional)
- Pattern engine tracks intention adherence rate
- Weekly prompt gets: "User set 3 intentions this week, followed through on 2"
- **Why:** Closes the deliberate practice loop. TOMO currently captures step 3 (reflect) but not step 1 (intend).

### Plateau Detection
- Compound signal in pattern engine:
  - 4+ weeks same top techniques (diversity stable/narrowing)
  - Frequency flat or declining over 3+ weeks
  - Mood declining (if available)
  - No new techniques in 3+ weeks
  - Account age 4-7 months (statistical danger zone)
- Inject `plateauSignal: true` into prompt context
- Prompt rule: surface invisible progress, name one thing better than 2 months ago, suggest one experiment
- **Why:** 90% quit before blue belt. The 5-6 month cliff is real. Proactive detection catches it before the user consciously thinks "I'm stuck."

### 6-Week Consistency Milestone
- Trigger: 6 consecutive weeks at or above target frequency
- Special milestone insight: "Six weeks of consistent training. Research says this is roughly where the habit starts becoming automatic."
- **Why:** 48% of people who reach 6 weeks form lasting habits (PNAS, n=30,110).

### Competition Session Routing
- When `kind: 'competition'` is logged, weekly prompt gets different routing
- More space, fewer observations, no submission ratios
- Focus shifts to what they chose to do (game plan) rather than outcomes
- **Why:** Competition losses hit at identity level. Training taps are "just another day." Different emotional handling needed.

---

## Phase 3 (Scale)

### Full Chat Follow-Up
- 5-exchange conversations (already built, not deployed)
- Tier-routed models (Haiku for weekly, Sonnet for monthly, Opus for quarterly)
- Deploy existing edge functions: `generate-monthly`, `generate-quarterly`, `chat-with-insight`

### Feedback Fading
- System gets quieter as user matures
- After 6+ months: consider biweekly insights, shorter output
- UCD gets `maturityLevel` derived from months active + sessions logged
- **Why:** Excessive feedback creates dependency. Autonomy increases with competence.

### Monthly + Quarterly Insights
- Deploy existing edge functions (already built)
- Monthly = Sonnet, 6 sections, coaching check-in
- Quarterly = Opus, strategic review, next quarter priorities
- Context cascades down: quarterly priorities inform monthly, monthly focus informs weekly

---

## Data Model Additions (All Phases)

| Field | Where | Type | Phase |
|---|---|---|---|
| `mood_rating` | Session | INTEGER 1-5 | 1.5 |
| `session_intention` | Session | TEXT (optional) | 2 |
| `plateauSignal` | WeeklyInsightInput | BOOLEAN | 2 |
| `hasCompetition` | WeeklyInsightInput | BOOLEAN | 2 |
| `experimentingUnderPressure` | WeeklyInsightInput | BOOLEAN | 2 |
| `defenseProgress` | WeeklyInsightInput | OBJECT | 2 |
| `moodTrend` | WeeklyInsightInput | ARRAY | 1.5 |
| `maturityLevel` | UCD | STRING | 3 |

---

## Decision Gate

Don't build any of this until:
1. Weekly insights have been tested by 5+ people for 2+ weeks
2. Tester feedback confirms content quality is good (the prompt works)
3. Retention becomes a real concern (users dropping off)

If the weekly prompt already resonates, Phase 1.5 (mood + "tell me more") is the highest-ROI next step. If content quality needs work, fix the prompt first.
