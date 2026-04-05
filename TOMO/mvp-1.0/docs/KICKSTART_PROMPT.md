# TOMO MVP 1.0 — Kickstart Prompt

**Paste this into a new Claude Code session to resume work.**

---

PROJECT: TOMO MVP 1.0 — iOS TestFlight

Read these docs in order:
1. `/Users/drewgarraway/drew-garraway-consulting/TOMO/docs/mvp-1.0/README.md`
2. `/Users/drewgarraway/drew-garraway-consulting/TOMO/docs/mvp-1.0/FEATURE_SPEC.md`
3. `/Users/drewgarraway/drew-garraway-consulting/TOMO/docs/mvp-1.0/SHIP_PLAN.md`

## Context

- All planning is done. Docs are implementation-ready.
- iOS MVP Reviewer agent ran on Mar 8, 2026. Verdict: **GO WITH CHANGES**.
- Drew is a vibe coder building this entirely with Claude Code. Explain step-by-step.
- The goal is fastest path to TestFlight. Do not re-debate scope.

## Critical Fixes (from reviewer — must be applied to docs or code)

1. **Edge Function needs auth** — Add Supabase auth verification to the extraction Edge Function. Without it, anyone can burn the Anthropic API credits.
2. **AssemblyAI key must be server-side** — Route transcription calls through a Supabase Edge Function instead of calling AssemblyAI directly from the app. API key stays on the server.
3. **Add `updated_at` triggers** — Both `sessions` and `profiles` tables need a `BEFORE UPDATE` trigger to auto-set `updated_at`.
4. **Add PostHog to the ship plan** — It's in the tech stack but has no setup task. Add to Phase 3.
5. **Define bundle ID** — e.g. `com.assemblylabs.tomo`. Put it in app.json.
6. **Write privacy policy** — Required for TestFlight. Even a simple one-pager works.

## Recommendations (from reviewer)

- Ship email-only auth first. Add Apple Sign-In in Phase 3.
- Build text-only logging path before voice pipeline (it's the safe baseline).
- Week 4 (voice pipeline) will take 2 weeks. Start journal tasks in parallel.
- Spike `expo-audio` recording in Week 2 to confirm it works. Fall back to `expo-av` if not.
- Test AssemblyAI with real BJJ audio before writing code (upload to their playground).
- Consider deferring offline audio queue to v1.1.
- Add `partner_names TEXT[] DEFAULT '{}'` to sessions table (cheap now, expensive later).
- Deploy Edge Function in Week 2 and test with curl before the app needs it.

## What Drew Needs to Do First (Before Coding)

- [ ] Sign up for Apple Developer ($99) — 48hr activation
- [ ] Sign up for Supabase, AssemblyAI, Anthropic, Expo, Sentry, PostHog
- [ ] Install Xcode from Mac App Store (~12GB)
- [ ] Verify Node.js 18+ is installed
- [ ] Have a physical iPhone ready

## When Ready to Code

Start Phase 1: `npx create-expo-app@latest tomo`

Then follow SHIP_PLAN.md tasks 1.1 through 2.8, applying the critical fixes above as you go.
