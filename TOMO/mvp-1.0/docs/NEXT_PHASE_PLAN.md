# TOMO — Next Phase Plan (Post-Session 17)

**Created:** 2026-03-17
**Status:** MVP feature-complete, voice pipeline working, 31/36 issues resolved
**Blocker:** Apple Developer account (pending)

---

## Phase 1: Polish Before People Touch It

*Before TestFlight goes out — this is your first impression.*

### App Icon + Launch Screen (P3-001)

Currently using Expo defaults. This is the single most important piece of unfinished work. TestFlight testers form their opinion in the first 2 seconds. A generic Expo icon signals "prototype" and changes how they evaluate everything else.

- **Icon:** Bold, simple glyph — the TOMO kanji (友) in gold on matte black. Matches the design language.
- **Launch screen:** Black background, gold mark, no text. Fast and confident.
- **This sets the tone for everything that follows.**

### Success State Choreography

After saving a session, the success phase auto-dismisses after 5 seconds. This is fine mechanically, but it's a missed emotional moment. Post-training, the user just did something hard — they trained AND they logged it.

- Subtle scale-up animation on the belt-personalized message (not a bounce — slow, confident reveal)
- Light haptic pulse (not the sharp "success" tap — something warmer, like `.soft`)
- Let the message breathe for 1-2 seconds before showing the dismiss countdown

### Empty State Quality

First TestFlight testers will see empty states before anything else. The Journal empty state has a CTA, which is correct. But the *tone* matters.

- "Log Your First Session" is functional
- "Just trained? Capture it while it's fresh." connects to the core value prop and matches the training partner voice
- Review all empty states for voice consistency

---

## Phase 2: Extraction Quality Validation

*The AI is the product — if extraction is wrong, nothing else matters.*

Before putting this in testers' hands, validate extraction accuracy on real-world audio. Not test recordings — actual post-training voice notes with background gym noise, exhausted speech patterns, and BJJ slang.

### Test Protocol (5 recordings minimum)

1. Record yourself after training — tired, natural, unscripted
2. Have a training partner record one (different accent, different vocabulary)
3. Record a deliberately messy one — "um"s, false starts, mid-thought corrections
4. Record a minimal one — "Trained gi for an hour, drilled arm bars, rolled three rounds"
5. Record a complex one — multiple techniques, submissions in both directions, injury mention

### What to Measure

| Field | Target | How to assess |
|---|---|---|
| `trainingMode` | 100% correct | Should never guess wrong |
| `techniquesDrilled` | >85% recall | Captures techniques mentioned, no hallucinated ones |
| `submissionsGiven` vs `submissionsReceived` | 100% direction accuracy | "I tapped him" vs "He tapped me" never confused |
| `durationMinutes` | >90% correct | "About an hour" = 60, "hour and a half" = 90 |
| `rawNotes` | Reads naturally | Sounds like something the user would write themselves |
| `injuries` | No false positives | Only flagged when explicitly mentioned |

**If accuracy is below 80% on real audio, that's the #1 priority before TestFlight.** No amount of UI polish compensates for an AI that puts words in the user's mouth.

---

## Phase 3: The Five Critical Test Flows

*Each of these must feel seamless before testers see it.*

| # | Flow | What to validate | Why it matters |
|---|---|---|---|
| 1 | **First launch -> onboarding -> first session** | Under 3 minutes total. No confusion, no dead ends. | If this fails, you lose them permanently. |
| 2 | **Voice-preference user, fast path** | Skips entry, records, review auto-populates | Power user flow — must be frictionless. |
| 3 | **Pipeline failure -> manual entry** | Network drops mid-transcription. User can still log. | Testers WILL have bad connections. Graceful degradation is trust. |
| 4 | **Edit after AI extraction** | Change a technique name, add a submission, fix duration | If editing is painful, users won't trust the AI to get close. |
| 5 | **Return visit — journal has sessions** | Sessions grouped correctly, detail view loads, narrative reads well | The "aha" moment — seeing training history accumulate. |

---

## Phase 4: TestFlight Deployment (Session 16)

*Blocked on Apple Developer account.*

Once the account activates:

1. EAS configuration + signing
2. Production build
3. TestFlight submission (24-48hr Apple review)
4. Invite 5-10 testers

### Tester Selection (prioritize diversity)

- At least one white belt
- At least one blue+ belt
- One who trains 4+ times/week
- One who trains 1-2x/week
- Mix of voice-preference and text-preference users

### Tester Instructions

Don't just say "try the app." Give a specific ask:

> "Log your next 3 training sessions using voice. After each one, check the review screen — did the AI get your techniques right? Did it miss anything? Text me what it got wrong."

This focuses feedback on what actually matters.

### Success Metrics (from TESTING_AND_REFINEMENT_STRATEGY.md)

- App installs on iOS 16+
- Download to first session < 3 minutes
- Voice transcription > 85% accuracy for BJJ terms
- Crash rate < 1%
- Cold start < 3 seconds
- 5+ testers complete 3+ sessions each
- AI extraction edit rate < 30%

---

## Phase 5: Post-TestFlight Enhancements

### v1.0.1 — Quick Fixes from Tester Feedback

- Extraction prompt tuning based on real failure patterns
- UI tweaks to review screen based on what people struggle to edit
- Any crash fixes from Sentry

### v1.1 — The Depth Update

| Enhancement | Why | Effort | Priority |
|---|---|---|---|
| **Stats Dashboard** | What makes people come back. Seeing training visualized is addictive. Streak counter, weekly heatmap, technique frequency. | High | P1 |
| **Belt celebration thresholds** | White belt hitting 10 sessions is a BIG deal. The app should know that. | Low | P1 |
| **Apple Sign-In** | Required for App Store. Faster onboarding. | Medium | P1 |
| **Technique autocomplete** | `getAutocompleteHistory()` already exists. Surface it during review. Users see their own vocabulary come back — builds trust. | Low | P1 |
| **Risk detection** | Belt system already has dropout risk models built. Surface a gentle nudge when frequency drops. | Medium | P2 |
| **Re-enable email confirmation** | Currently off for dev. Must re-enable before public launch. | Low | P1 |

### What to Cut from v1.1

- **Chatbot/AI coaching** — Too much surface area, save for v2
- **Video recommendations** — Needs content partnerships, not a code problem
- **Social features** — Tempting but premature before retention data exists

---

## The North Star

The app's competitive advantage isn't voice transcription or AI extraction — those are table stakes that'll get commoditized. The advantage is **understanding BJJ practitioners' psychology at each belt level**.

The belt personalization engine is built (risk detection, plateau psychology, celebration thresholds, journal analysis) but only ~39% wired up to the UI.

**v1.1 north star:** Every screen feels like it was built by someone who understands YOUR belt journey. A white belt opening the app should feel encouraged. A blue belt should feel understood. That's what makes someone keep logging sessions after the novelty wears off.

---

## Session 17 Hardening (Already Applied)

For reference, these fixes were applied this session:

1. **RLS migration** — All row-level security policies version-controlled and applied
2. **Edge function hardening** — 50KB transcript limit, 100MB audio limit, 30s Anthropic timeout, sanitized error responses
3. **Retry-on-401** — Client auto-retries edge function calls on token expiry
4. **BUG-031 fix** — extract-session redeployed with `--no-verify-jwt`
5. **Supabase CLI upgraded** to v2.78.1, `config.toml` created for declarative JWT settings

---

## Key Files

| Document | Location |
|---|---|
| This plan | `docs/mvp-1.0/NEXT_PHASE_PLAN.md` |
| Session 16 deployment guide | `docs/mvp-1.0/SESSION_16_PROMPT.md` |
| Feature spec (exact MVP scope) | `docs/mvp-1.0/FEATURE_SPEC.md` |
| Testing strategy | `docs/mvp-1.0/TESTING_AND_REFINEMENT_STRATEGY.md` |
| Open issues | `docs/mvp-1.0/tracking/ISSUES.md` |
| Changelog | `docs/mvp-1.0/tracking/CHANGELOG.md` |
| Belt personalization spec | `docs/product/BELT_PERSONALIZATION_SYSTEM.md` |
| Belt integration contracts | `docs/product/BELT_INTEGRATION_SPEC.md` |
