# TOMO Session 14 — Pickup Prompt

**Date:** 2026-03-14
**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/tomo/`

> **Tell Claude:** "Read `docs/mvp-1.0/SESSION_14_PROMPT.md` then start working through the next steps."

---

## Goal for This Session

Two connected UX improvements to the Review Screen (the form that appears after voice processing):

1. **Transcript panel** — move transcript to the TOP of the review screen so users can read what was captured while they fill in fields, rather than having to scroll to the bottom to find it.
2. **Empty field highlighting** — fields the AI left blank should be visually flagged so the user immediately knows what needs attention.

These are design-first decisions. **Explore strategy before writing code.** The implementation should follow from clear design choices, not the other way around.

---

## Current State of the Review Screen

File: `src/screens/SessionLoggerScreen.tsx` — the `ReviewPhase` component starts around line 685.

**Current field order (top to bottom):**
1. Mode + Duration badges (tappable)
2. Inline mode/warmup/spar editors (if tapping a badge)
3. Warm-Up toggle (Yes / No / Not recorded)
4. Techniques Drilled (tag input + list)
5. Did You Spar? (Yes / No toggle)
6. Sparring Rounds (number input, shown if didSpar=true)
7. Subs Landed (input + list)
8. Got Caught (input + list)
9. Injuries (tag input + list)
10. Instructor (text input)
11. Session Type (chip selector: class/open mat/drilling/competition/other)
12. Lesson Topic (text input)
13. Notes (multiline text input)
14. **VOICE TRANSCRIPT** (read-only text block — currently buried here at the bottom)
15. Save button

**The transcript is already wired and rendering** — it's just in the wrong place.

---

## Design Questions to Resolve Before Coding

### 1. Transcript Panel Design

**Option A — Sticky top card (collapsed by default)**
A compact card pinned above the scrollable field list. Shows first ~2 lines with a "Show full transcript" expand button. User can reference it while filling in any field without losing their scroll position. Collapses back when done.

**Option B — Top of scroll (always expanded)**
Transcript is the first thing in the ScrollView. User reads it, then scrolls down through the fields. Simple, no state needed, but the transcript pushes fields further down.

**Option C — Floating reference panel (side-by-side on large screens, tab-toggle on phone)**
Probably overkill for MVP. Skip.

**Recommended direction:** Option A or B. Decide which one to implement — or propose a variant. Key constraint: the transcript can be long (2–5 paragraphs of dense speech-to-text output). It must not dominate the screen on arrival.

---

### 2. Empty Field Highlighting

**What counts as "empty"?**

| Field | Empty condition |
|-------|----------------|
| `techniquesDrilled` | `[].length === 0` |
| `submissionsGiven` | `[].length === 0` |
| `submissionsReceived` | `[].length === 0` |
| `injuries` | `[].length === 0` |
| `lessonTopic` | `=== ''` |
| `instructor` | `=== ''` |
| `notes` | `=== ''` |
| `warmedUp` | `=== null` |
| `sparringRounds` | `null` AND `didSpar === true` |
| `trainingMode` | never empty (always has a value) |
| `sessionKind` | never empty (always has a value) |
| `durationMinutes` | never empty (always has a value, may be wrong) |
| `didSpar` | always has a value (defaults to false) |

Fields that are ALWAYS filled (by entry form or AI default) don't need highlighting: `trainingMode`, `sessionKind`, `durationMinutes`, `didSpar`.

**Visual treatment options:**

**Option A — Amber left border**
Empty fields get a 3px left border in `--color-gold` (`#F5A623`) and a subtle background tint (`rgba(245,166,35,0.06)`). Disappears the moment the user adds any content. Low visual noise, easy to scan.

**Option B — Inline "AI couldn't extract this — add it?" prompt text**
Show a secondary line beneath the field label: `"Not captured — tap to add"` in `colors.gray500`. The placeholder already does this for text inputs; this would add it as a label-level affordance for tag fields and toggles.

**Option C — Summary banner at top of review**
"3 fields weren't captured — they're highlighted below." Tapping the banner scrolls to the first empty field. Bold, directive, but adds visual complexity.

**Option D — Combination: amber border + summary count badge**
Compact count badge in the header ("3 empty"), plus amber border on individual fields.

**Recommended direction:** Pick one or two options and propose your rationale before implementing. The design system uses gold as the accent — using it for "attention needed" aligns with the existing palette and avoids introducing a new warning color for non-error states.

---

## Key Design Constraints

From `CLAUDE.md`:
- Dark theme — `#111111` background
- Gold accent — `#F5A623` for positive/attention (NOT red, which means error/negative)
- No emojis
- Font weight 500+ minimum (400 is prohibited)
- Touch targets 44px minimum for secondary, 56px for primary actions
- User is EXHAUSTED post-training — minimize visual noise, make the "done" path obvious

---

## Files to Read Before Starting

1. **`src/screens/SessionLoggerScreen.tsx`** — full file, especially:
   - `ReviewPhase` component (around line 685+)
   - `ReviewFields` interface (around line 54)
   - Current transcript display (around line 1025)
   - Current field styles (around line 1300+)

2. **`src/config/design-tokens.ts`** — color tokens, spacing, radius values

3. **`docs/mvp-1.0/FEATURE_SPEC.md`** — review screen spec (sections 3.3 and 3.4)

4. **`docs/mvp-1.0/tracking/ISSUES.md`** — check for any open issues that overlap

---

## Implementation Plan (after design decisions are made)

### Step 1 — Transcript panel
- Move transcript rendering from bottom of ScrollView to top
- Implement collapsed/expanded state with a toggle (if going Option A)
- Transcript panel should be visually distinct from the editable fields below it — use `colors.gray800` background, `colors.gray400` text, `JetBrains Mono` or `Inter` at 14px

### Step 2 — Empty field highlighting
- Create a helper `isFieldEmpty(review: ReviewFields, field: keyof ReviewFields): boolean`
- Apply conditional style to each field container based on empty state
- For tag/list fields: highlight the entire field container
- For text inputs: the amber border replaces the normal border on the input itself
- Highlighting should disappear reactively as the user fills in content (no manual dismiss)

### Step 3 — Optional: summary count
- If implementing a count badge or banner, add it to the ReviewPhase header row
- Badge should show count of empty fields and disappear when count reaches 0

### Step 4 — TypeScript + visual QA
- `npx tsc --noEmit` — 0 errors required
- Visual check: dark background, gold borders visible, no text contrast issues
- Exhaustion-mode check: is the review screen still fast and scannable with highlights?

---

## Session End Requirements (from CLAUDE.md)

Before ending the session:
1. Update `docs/mvp-1.0/tracking/CHANGELOG.md` with a dated Session 14 entry
2. Update `docs/mvp-1.0/tracking/ISSUES.md` — close anything resolved, add any new bugs
3. Run `npx tsc --noEmit` — must be clean
4. Update this file → `SESSION_15_PROMPT.md` with current state and next steps

---

## Open Issues Relevant to This Work

From ISSUES.md (open as of Session 13):
- `P3-005` — Accessibility labels (VoiceOver) — if touching field containers, add `accessibilityLabel` while you're in there
- `P3-004` — Terms of Service screen (separate work, not this session)
- `BLOCK-002` — Apple Developer account (still pending, not blocking this work)
