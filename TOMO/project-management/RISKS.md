# Risks

**Last updated:** 2026-04-02

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

---

## Resolved Risks

| ID | Risk | Resolution | Date |
|----|------|------------|------|
| (none yet) | | | |
