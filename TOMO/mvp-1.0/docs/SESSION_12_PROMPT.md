# TOMO Session 12 — Pickup Prompt

**Date:** Continue from 2026-03-12 Session 11
**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/tomo/`
**Read first:** `docs/mvp-1.0/TESTING_AND_REFINEMENT_STRATEGY.md` — full plan with prioritized phases
**Then read:** `docs/mvp-1.0/tracking/ISSUES.md` and `docs/mvp-1.0/tracking/CHANGELOG.md`

---

## Where We Are

Voice pipeline working end-to-end. Extraction prompt rewritten with detailed field guide + few-shot example. UX audit completed — found 7 rendering gaps.

---

## Next Steps (from TESTING_AND_REFINEMENT_STRATEGY.md)

### Phase A — UI Fixes (Priority 1, ~3 hours)

7 rendering gaps found in the UX audit. Fix before any testing:

1. **Injuries invisible everywhere** — extracted + saved but zero UI. Add to review screen, session detail, and create edit sheet.
2. **Submissions not on review screen** — submissionsGiven/Received extracted but user can't verify before save. Add to review phase.
3. **Training mode/kind/duration read-only on review** — detail badges have no `onPress`. Voice-preference users can't correct AI mistakes. Make tappable.
4. **Submissions not editable in SessionDetail** — shown but no edit sheet. Add EditSubmissionsSheet.
5. **Training mode label bug** — review screen shows "Mixed" for "other". Fix ternary.
6. **Sparring rounds null guard** — journal card `session.sparring_rounds !== 1` without null check.
7. **Energy/mood no "not set" state** — detail shows 0 filled bars for null vs lowest.

### Phase B — Extraction Quality Testing (~2 hours)
Run 6 varied test recordings on device. Details in strategy doc.

### Phase C — End-to-End Test Flows (~2 hours)
6 full user flows on device. Details in strategy doc.

### Phase D — Apple Developer Setup (~2 hours)
EAS, Apple Sign-In, App Store Connect. Blocked until account activates.

### Phase E — TestFlight Submission (~2 hours)
Production build, submit, add testers.

---

## Open Issues

| ID | Priority | Description |
|----|----------|-------------|
| BLOCK-002 | P0 | Apple Developer account — expected Mar 12 |
| P2-008 | P2 | No storage DELETE RLS policy |
| P2-010 | P2 | Offline queue not wired into pipeline error path |
| LAUNCH-001 | P1 | Re-enable email confirmation before launch |
| BUG-002 | P3 | sentry.properties regenerated on prebuild |

---

## Key Commands

```bash
# Build to device
SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device 00008120-001E30192270201E

# TypeScript check
npx tsc --noEmit

# Deploy edge functions
npx supabase functions deploy transcribe-audio --no-verify-jwt
npx supabase functions deploy extract-session --no-verify-jwt
```
