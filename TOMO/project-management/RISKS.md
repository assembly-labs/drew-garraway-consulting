# Risks

**Last updated:** 2026-04-08

---

## Active Risks

### R-001: Solo builder bottleneck
**Likelihood:** High | **Impact:** Medium
**Description:** Drew is the only person building, designing, writing content, and managing the product. Any week he can't work, everything stops.
**Mitigation:** Keep scope ruthlessly small. Ship features that are "good enough to learn from." Don't let perfectionism slow the pipeline. PM bot helps prioritize so no time is wasted on low-value work.

### R-002: Beta tester drop-off
**Likelihood:** Medium | **Impact:** High
**Description:** Only 2 external testers (Drew + alexaharper925@gmail.com). If testers stop logging sessions, we lose the feedback loop needed to validate insights and coaching features.
**Mitigation:** Recruit 3-5 more testers from Alliance Paoli before building the insights tab. Real usage data matters more than feature completeness.

### R-003: Insights quality depends on session volume
**Likelihood:** Medium | **Impact:** High
**Description:** Weekly insights need enough logged sessions to say something meaningful. If a user logs once a week, the insight will be thin. If they log zero, it's empty.
**Mitigation:** Design insights to handle low-data gracefully (encouragement to log more, not empty states). Set minimum threshold (2+ sessions/week) for full insights. Below that, show a simpler "keep going" message.

### R-004: App Store rejection
**Likelihood:** Low | **Impact:** High
**Description:** Apple could reject for missing privacy policy, incomplete metadata, or perceived "low utility." Voice recording apps sometimes get extra scrutiny.
**Mitigation:** Prepare all metadata early (T-020 through T-025). Privacy policy must be live before submission. Test the full review flow with the apple@assemblylabs.co test account. Be ready for at least one rejection cycle.

### R-005: Voice transcription accuracy for BJJ terms
**Likelihood:** Low | **Impact:** Medium
**Description:** AssemblyAI handles most BJJ terms well (180-word boost list), but unusual technique names or accented speech could produce bad transcriptions that the AI then extracts incorrectly.
**Mitigation:** Monitor extraction edit rate. Target is under 30%. If it creeps above that, expand the word boost list or add post-processing corrections. The review phase lets users fix errors before saving.

### R-006: Supabase cost scaling
**Likelihood:** Low | **Impact:** Low (for now)
**Description:** Free tier covers current usage easily. But audio storage + edge function invocations could hit limits if user count grows past ~50-100 active users.
**Mitigation:** Not a concern until post-launch. Monitor usage dashboard monthly once on the App Store. Upgrade plan ($25/mo) when approaching limits.

### R-007: Schema migrations running ahead of app builds (MITIGATED)
**Likelihood:** Low (post-mitigation) | **Impact:** High
**Description:** Supabase migrations run against prod instantly, but TestFlight external builds take 24-48h to reach testers (Apple review gate). If a tightening constraint (NOT NULL, CHECK, FK) is added before every tester has the app build that populates it, older builds hit the constraint, fail silently, and strand users. This happened with `profiles.birth_date NOT NULL` in FEAT-008 (Mar 30) and stranded Rachel for 7 days (ONB-001).
**Mitigation:**
1. Two-phase migration rule adopted as hard rule (D-104). Documented in TOMO/CLAUDE.md under "CRITICAL: Schema Migration Rules" with pre-push checklist.
2. Service-layer error handling hardened: `profileService.create` now throws on error and reports to Sentry instead of silently returning null. Next silent-failure-class bug will surface in Sentry within minutes.
3. `handlePayoffComplete` re-verifies the saved profile and bounces the user back to the form with an error toast if the save didn't land.
**Residual risk:** Low. The rule is written down but relies on the operator (Drew or future Claude) to actually check the pre-push checklist. Consider automating: add a CI check that diffs migration files against the app build's code for mismatches.

---

## Resolved Risks

| ID | Risk | Resolution | Date |
|----|------|------------|------|
| (none yet) | | | |
