# Session Logger - Product Requirements Document

**Feature:** Voice-First Session Logging (Journaling)
**Status:** Specification Complete
**Last Updated:** January 25, 2026
**Component:** `VoiceFirstLogger.tsx`

---

## Overview

### Purpose

Capture training session data at the critical post-training moment when information is fresh but users are physically and cognitively exhausted. Voice-first design minimizes friction while AI extraction reduces manual data entry.

### Core Value Proposition

> "90 seconds after class, just talk. We'll handle the rest."

Users have a **90-second window** of motivation post-training before fatigue wins. The logger must capture meaningful data within this window while the user is sweaty, tired, and possibly still in the gym parking lot.

### Design Philosophy

1. **Voice-first, not voice-only** - Voice is primary, but text/tap fallbacks always available
2. **Memory jogging** - Quick context fields (type, duration, spar) before recording help users recall details
3. **AI does the heavy lifting** - Transcription + extraction means users talk naturally, we structure it
4. **Editable everything** - AI makes mistakes; every extracted field is editable before save
5. **Respect exhaustion** - Large touch targets, minimal decisions, smart defaults
6. **Belt-aware prompts** - Prompts and field visibility adapt to user's belt level

### Success Metrics

| Metric | Target |
|--------|--------|
| Recording completion rate | >85% (start → submit) |
| Average recording duration | 30-60 seconds |
| Time from open to save | <90 seconds |
| Edit rate on extracted data | <30% (AI accuracy indicator) |
| Drop-off during recording | <10% |
| Voice vs. text-only usage | 70% voice / 30% text |

---

## Flow Summary

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ENTRY     │ ──▶ │  RECORDING  │ ──▶ │ PROCESSING  │ ──▶ │   REVIEW    │ ──▶ │  SUCCESS    │
│             │     │             │     │             │     │             │     │             │
│ Context +   │     │ Voice       │     │ AI extracts │     │ Edit fields │     │ Confirmation│
│ Record CTA  │     │ capture     │     │ data        │     │ + transcript│     │ + message   │
│             │     │ (max 90s)   │     │             │     │             │     │             │
│ OR          │     │             │     │             │     │             │     │             │
│ Text-only   │     │             │     │             │     │             │     │             │
│ save ──────────────────────────────────────────────────▶ │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Phases:**
1. **Entry** - Quick context (type, duration, spar) + prominent RECORD button + optional text-only path
2. **Recording** - Voice capture with timer, waveform, rotating prompts (max 90 seconds)
3. **Processing** - AI transcription + field extraction (3-5 seconds)
4. **Review** - Transcript display + all extracted fields editable
5. **Success** - Belt-personalized confirmation message
6. **Error** - Retry option if save fails

---

## Data Captured

### Required Fields (System-Set)

| Field | Source | Type |
|-------|--------|------|
| `id` | Generated | UUID |
| `userId` | Context | string |
| `createdAt` | System | ISO timestamp |
| `date` | System | YYYY-MM-DD |

### Core Fields (User/AI)

| Field | Entry Phase | AI Extracted? | Editable? | Required? |
|-------|-------------|---------------|-----------|-----------|
| `trainingType` | Pre-selected (default: gi) | Can override | Yes | Yes |
| `durationMinutes` | Pre-selected (default: 90) | Can override | Yes | Yes |
| `didSpar` | Pre-selected (default: null) | Can override | Yes | No |
| `transcript` | — | From voice | View only | If recorded |

### Detail Fields (AI-Extracted)

| Field | Description | AI Extracted? | Editable? | Belt Visibility |
|-------|-------------|---------------|-----------|-----------------|
| `techniquesDrilled` | Techniques worked on | Yes | Yes (chips) | All belts |
| `workedWell` | What clicked today | Yes | Yes (text) | All belts |
| `struggles` | What gave trouble | Yes | Yes (text) | Blue+ active, White greyed |
| `rawText` | Additional notes | Yes (overflow) | Yes (textarea) | All belts |

### Sparring Fields (AI-Extracted, Belt-Gated)

| Field | Description | AI Extracted? | Editable? | Belt Visibility |
|-------|-------------|---------------|-----------|-----------------|
| `sparringRounds` | Number of rolls | Yes | Yes (1-10 picker) | Blue+ active, White greyed |
| `submissionsGiven` | Subs you hit | Yes | Yes (picker) | Blue+ active, White greyed |
| `submissionsReceived` | Subs you took | Yes | Yes (picker) | Blue+ active, White greyed |

### Belt Visibility Rules

| Belt | Active Fields | Greyed/Locked Fields |
|------|---------------|----------------------|
| **White** | Type, Duration, Spar (Y/N), Techniques, Worked Well, Notes | Struggles, Rounds, Subs Given, Subs Received |
| **Blue+** | All fields active | None |

**Locked Field Display:**
```
┌──────────────────────────────────────┐
│  SPARRING DETAILS                    │
│  ┌────────────────────────────────┐  │
│  │  🔒 Unlocks at Blue Belt       │  │
│  │                                │  │
│  │  Track your rounds and         │  │
│  │  submissions once you're blue. │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Screen Specifications

### Phase 1: Entry

**Purpose:** Jog user's memory with quick context fields, provide prominent RECORD button, allow text-only path.

**Layout:**
```
┌────────────────────────────────────┐
│           ✕              Log Session│
├────────────────────────────────────┤
│                                    │
│  ┌────────────────────────────┐    │
│  │                            │    │
│  │      [ MIC ICON ]          │    │
│  │                            │    │
│  │     TAP TO RECORD          │    │
│  │   Tell me what you worked  │    │
│  │   on today                 │    │
│  └────────────────────────────┘    │
│                                    │
│  ─────────────────────────────     │
│  TRAINING TYPE                     │
│  ┌────────┐┌────────┐┌────────┐    │
│  │  Gi   ││ No-Gi ││Open Mat│    │
│  │  ●    ││       ││        │    │
│  └────────┘└────────┘└────────┘    │
│                                    │
│  DURATION                          │
│  ┌──────┐┌──────┐┌──────┐┌──────┐  │
│  │60 min││90 min││ 2 hrs││Other │  │
│  │      ││  ●   ││      ││      │  │
│  └──────┘└──────┘└──────┘└──────┘  │
│                                    │
│  DID YOU SPAR?                     │
│  ┌────────────┐┌────────────┐      │
│  │    Yes     ││     No     │      │
│  └────────────┘└────────────┘      │
│                                    │
│  ─────────────────────────────     │
│  WHAT YOU WORKED ON  optional      │
│  ┌──────────────────────────┐      │
│  │ + Half guard  + Armbar   │      │
│  │ + Sweeps     + Escapes   │      │
│  └──────────────────────────┘      │
│                                    │
│  NOTES  optional                   │
│  ┌──────────────────────────┐      │
│  │ Anything else...         │      │
│  └──────────────────────────┘      │
│                                    │
├────────────────────────────────────┤
│  ┌────────────────────────────┐    │
│  │       SAVE SESSION         │    │
│  └────────────────────────────┘    │
└────────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Header | Close button (✕) left, "Log Session" title center |
| Record button | Full-width, 120px height, gold border, mic icon 56px, tap target covers entire area |
| Type buttons | 3-up horizontal, 48px height, gold when selected |
| Duration buttons | 4-up horizontal, 48px height, gold when selected |
| Spar buttons | 2-up horizontal, 48px height, gold when selected |
| Technique chips | Quick-add from recent history, removable |
| Notes textarea | 3 rows, optional |
| Save button | Full-width, 56px height, gold background, disabled until Type+Duration selected |

**Smart Defaults:**
- Training Type: `gi` (pre-selected)
- Duration: `90` minutes (pre-selected)
- Did Spar: `null` (neither selected)

**Validation:**
- Save enabled when: `trainingType !== null && durationMinutes !== null`
- Recording enabled: Always (no validation required)

**Interactions:**
- Tap Record → Transition to Recording phase
- Tap Save → Skip recording, save with form data only, transition to Success
- Tap ✕ → Confirm discard, exit

---

### Phase 2: Recording

**Purpose:** Capture voice with minimal UI, rotating prompts to guide narration, enforce 90-second limit.

**Layout:**
```
┌────────────────────────────────────┐
│ ✕                       ● 0:42     │
│                                    │
│                                    │
│                                    │
│                                    │
│                                    │
│        What'd you work on?         │
│                                    │
│                                    │
│     ═══════════════════════════    │
│     [  audio waveform bars    ]    │
│     ═══════════════════════════    │
│                                    │
│                                    │
│                                    │
│  ┌────────────────────────────┐    │
│  │           DONE             │    │
│  └────────────────────────────┘    │
│                                    │
│        (tap when finished)         │
│                                    │
└────────────────────────────────────┘
```

**At 80 seconds (warning state):**
```
┌────────────────────────────────────┐
│ ✕                       ● 1:20     │
│                                    │
│         ┌──────────────┐           │
│         │  10 SECONDS  │           │
│         │  REMAINING   │           │
│         └──────────────┘           │
│                                    │
│     ═══════════════════════════    │
│     [  audio waveform bars    ]    │
│     ═══════════════════════════    │
│                                    │
│  ┌────────────────────────────┐    │
│  │           DONE             │    │
│  └────────────────────────────┘    │
│                                    │
└────────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Timer | Top-right, JetBrains Mono, red pulsing dot, MM:SS format |
| Cancel | Top-left, ✕ icon, 48px touch target |
| Prompt text | Center, Unbounded font, 28-36px, rotates every 4 seconds |
| Waveform | 12 bars, animated heights, gold color |
| Done button | Full-width, 56px height, white background, black text |
| 10s warning | Overlay message, pulse animation, countdown from 10 |

**Timer Behavior:**

| Time | Behavior |
|------|----------|
| 0:00 - 1:19 | Normal recording, timer counts up |
| 1:20 (80s) | Warning appears: "10 SECONDS REMAINING" |
| 1:21 - 1:29 | Countdown continues, warning persists |
| 1:30 (90s) | **Hard stop** - auto-transition to Processing |

**Rotating Prompts (4-second interval):**

Default prompts cycle through. Belt-personalized prompts override if available from `getSuggestedPrompts()`.

| Belt | Example Prompts |
|------|-----------------|
| White | "What'd you work on?", "Survive any tough spots?", "Any techniques click?" |
| Blue | "What techniques did you drill?", "How'd rolling go?", "Hit any subs?" |
| Purple+ | "What systems are you refining?", "Any teaching moments?", "Competition prep?" |

**Interactions:**
- Tap Done → Stop recording, transition to Processing
- Tap ✕ → Stop recording, discard audio, return to Entry (confirm first)
- 90 seconds reached → Auto-stop, transition to Processing

---

### Phase 3: Processing

**Purpose:** Show progress while AI transcribes and extracts data. Brief (3-5 seconds).

**Layout:**
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│                                    │
│                                    │
│            [SPINNER]               │
│                                    │
│            GOT IT                  │
│                                    │
│     Pulling out the details...    │
│                                    │
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Spinner | 64px, gold accent, rotating |
| Title | "GOT IT", Unbounded, 18px, uppercase |
| Subtitle | "Pulling out the details...", Inter, 16px, gray-400 |

**Timing:**
- Minimum display: 1.5 seconds (even if processing is faster)
- Maximum display: 10 seconds (timeout → error state with retry)
- Typical: 3-5 seconds

**No user interaction** - purely informational loading state.

---

### Phase 4: Review

**Purpose:** Display transcript and extracted data. All fields editable before final save.

**Layout:**
```
┌────────────────────────────────────┐
│         REVIEW SESSION             │
│   Edit anything that doesn't       │
│   look right                       │
├────────────────────────────────────┤
│                                    │
│  TRANSCRIPT                        │
│  ┌──────────────────────────────┐  │
│  │ "Worked on guard passing     │  │
│  │  today. Hit a knee slice     │  │
│  │  twice. Got caught in a      │  │
│  │  triangle from closed..."    │  │
│  │              Show more ▼     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────────────────────────     │
│  TRAINING                          │
│  ┌──────────────────────────────┐  │
│  │  Gi  •  90 min  •  Sparred   │  │
│  │                        Edit  │  │
│  └──────────────────────────────┘  │
│                                    │
│  TECHNIQUES WORKED                 │
│  ┌────────────────────────────┐    │
│  │ Knee slice pass       ✕    │    │
│  │ Guard passing         ✕    │    │
│  │ + Add technique            │    │
│  └────────────────────────────┘    │
│                                    │
│  WHAT WENT WELL                    │
│  ┌──────────────────────────────┐  │
│  │ "Hit knee slice twice,      │  │
│  │  guard passing felt solid"  │  │
│  │                        Edit │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─── SPARRING (5 rounds) ───       │
│  ┌──────────────────────────────┐  │
│  │  Rounds: [1][2][3][4][●][6] │  │
│  │                              │  │
│  │  Subs given:                 │  │
│  │  ┌────────┐ ┌────────┐       │  │
│  │  │RNC (1) │ │Armbar(1)│      │  │
│  │  └────────┘ └────────┘       │  │
│  │  + Add                       │  │
│  │                              │  │
│  │  Submitted by:               │  │
│  │  ┌──────────┐                │  │
│  │  │Triangle(1)│               │  │
│  │  └──────────┘                │  │
│  │  + Add                       │  │
│  └──────────────────────────────┘  │
│                                    │
│  NOTES                             │
│  ┌──────────────────────────────┐  │
│  │ "Knee feels tight but        │  │
│  │  nothing serious"            │  │
│  │                        Edit │  │
│  └──────────────────────────────┘  │
│                                    │
├────────────────────────────────────┤
│ ┌──────────┐  ┌─────────────────┐  │
│ │ Re-Record│  │      SAVE       │  │
│ └──────────┘  └─────────────────┘  │
└────────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Header | "REVIEW SESSION" + helper text |
| Transcript | Collapsible, 3 lines preview, "Show more" expands |
| Training summary | Single row with type/duration/spar, Edit button |
| Technique chips | Gold chips with ✕ to remove, + Add button |
| Text sections | workedWell, struggles, notes - inline text with Edit button |
| Sparring section | Expandable if didSpar=true, contains rounds + submissions |
| Submission picker | SubmissionPicker component for given/received |
| Re-Record button | Secondary, 1/3 width, outline style |
| Save button | Primary, 2/3 width, gold background |

**Transcript Behavior:**
- Default: Collapsed, showing first 3 lines with "Show more ▼"
- Expanded: Shows full transcript with "Show less ▲"
- Read-only (not editable)

**Sparring Section (if didSpar=true):**
- Rounds: Number picker 1-10
- Subs Given: SubmissionPicker component
- Subs Received: SubmissionPicker component

**Belt Gating in Review:**

For **White Belt** users, the Sparring section displays as:

```
┌──────────────────────────────────────┐
│  SPARRING DETAILS                    │
│  ┌────────────────────────────────┐  │
│  │        [ LOCK ICON ]           │  │
│  │                                │  │
│  │     Unlocks at Blue Belt       │  │
│  │                                │  │
│  │  Track rounds and submissions  │  │
│  │  once you earn your blue.      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

- Grey background (gray-900)
- Lock icon centered
- Encouraging message
- Not interactive

**Validation:**
- Save enabled when: `trainingType !== null && durationMinutes !== null`
- Same as Entry phase

**Interactions:**
- Tap "Show more" → Expand transcript
- Tap Edit on any section → Inline edit mode or modal
- Tap technique ✕ → Remove technique
- Tap "+ Add technique" → Add from suggestions or type custom
- Tap Re-Record → Discard current audio, return to Recording phase
- Tap Save → Save session, transition to Success

---

### Phase 5: Success

**Purpose:** Confirm save, display belt-personalized encouragement, provide navigation.

**Layout:**
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│                                    │
│           ┌─────────┐              │
│           │    ✓    │              │
│           └─────────┘              │
│                                    │
│      SESSION #48 LOGGED            │
│                                    │
│    "Great work today, Jake.        │
│     That's 12 sessions this        │
│     month - you're building        │
│     something real."               │
│                                    │
│                                    │
│  ┌──────────────────────────────┐  │
│  │      VIEW IN JOURNAL         │  │
│  └──────────────────────────────┘  │
│                                    │
│        Back to Dashboard           │
│                                    │
│                                    │
└────────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Checkmark | 100px circle, green (#22c55e), white check icon, scale-in animation |
| Title | "SESSION #N LOGGED", Unbounded, uppercase |
| Message | Belt-personalized from `getPostSessionMessage()`, Inter, gray-400 |
| Primary CTA | "VIEW IN JOURNAL", gold background, navigates to session detail |
| Secondary CTA | "Back to Dashboard", text link, gray-400 |

**Belt-Personalized Messages:**

| Belt | Example Messages |
|------|------------------|
| White | "You showed up. That's what matters at this stage. Keep building the habit." |
| Blue | "Another session in the books. You're pushing through the plateau—trust the process." |
| Purple | "Quality reps today. Your game is developing depth that only comes with time." |
| Brown | "Refinement mode. Every session at this level is polishing what's already sharp." |

**Animation:**
- Checkmark: `scale(0→1)` over 300ms with spring easing
- Content: `fadeIn` over 200ms after checkmark completes

**Auto-Navigation:**
- After 3 seconds, if user hasn't tapped anything, remain on screen (don't auto-navigate)
- User must explicitly choose next action

**Interactions:**
- Tap "View in Journal" → Navigate to SessionDetail for this session
- Tap "Back to Dashboard" → Navigate to Dashboard
- Swipe down → Navigate to Dashboard

---

### Phase 6: Error

**Purpose:** Handle save failures gracefully, preserve data, offer retry.

**Layout:**
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│                                    │
│           ┌─────────┐              │
│           │    !    │              │
│           └─────────┘              │
│                                    │
│        COULDN'T SAVE               │
│                                    │
│    Something went wrong. Your      │
│    data is still here—try again.   │
│                                    │
│                                    │
│  ┌────────────┐ ┌────────────────┐ │
│  │   CANCEL   │ │   TRY AGAIN    │ │
│  └────────────┘ └────────────────┘ │
│                                    │
│                                    │
└────────────────────────────────────┘
```

**UI Elements:**

| Element | Spec |
|---------|------|
| Icon | 100px circle, red (#ef4444), exclamation icon |
| Title | "COULDN'T SAVE", Unbounded, uppercase |
| Message | Reassuring, mentions data preserved |
| Cancel button | Secondary, outline style |
| Try Again button | Primary, gold background |

**Error Preservation:**
- All form data remains in state
- User can retry save without re-entering data
- If retry fails 3 times, offer "Save as Draft" (stores to localStorage)

**Interactions:**
- Tap "Try Again" → Attempt save again, show Processing briefly
- Tap "Cancel" → Confirm discard, return to Entry phase (data cleared)

---

## Belt Personalization Integration

### Integration Points

| Feature | Hook Used | Implementation |
|---------|-----------|----------------|
| Recording prompts | `getSuggestedPrompts()` | Override default prompts with belt-specific |
| Success message | `getPostSessionMessage()` | Display after save |
| Field visibility | `profile.belt` | Grey out sparring section for white belt |
| Prompt tone | Belt profiles | Encouraging (white), Neutral (blue), Analytical (purple+) |

### Recording Prompts by Belt

```typescript
// From belt-system, or fallback to defaults
const prompts = getSuggestedPrompts() || DEFAULT_PROMPTS;

const DEFAULT_PROMPTS = [
  "What'd you work on?",
  "Any techniques click today?",
  "How'd rolling go?",
  "Tap to anything?",
  "Tap anyone out?",
  "What gave you trouble?",
];
```

### Field Visibility Logic

```typescript
const isSparringUnlocked = ['blue', 'purple', 'brown', 'black'].includes(profile.belt);

// In Review phase:
{isSparringUnlocked ? (
  <SparringSection ... />
) : (
  <LockedFeatureCard
    title="Sparring Details"
    unlockAt="Blue Belt"
    message="Track rounds and submissions once you earn your blue."
  />
)}
```

---

## Data Model

> **Data Model:** The canonical Session type is defined in code at `/prototype/src/types/database.ts`. This document describes product requirements; code is the source of truth for field names and types.

### SessionData (Form State)

```typescript
interface SessionData {
  // Core fields (user-selected)
  trainingType: 'gi' | 'nogi' | 'openmat' | null;
  durationMinutes: number | null;
  didSpar: boolean | null;

  // Detail fields (AI-extracted, editable)
  techniquesDrilled: string[];
  workedWell: string;
  struggles: string;
  rawText: string;  // Notes/overflow

  // Sparring fields (AI-extracted, belt-gated)
  sparringRounds: number | null;
  submissionsGiven: SubmissionCount[];
  submissionsReceived: SubmissionCount[];

  // Transcript (from voice)
  transcript: string;
}

interface SubmissionCount {
  name: string;
  count: number;
}
```

### Session (Persisted Record)

```typescript
interface Session {
  id: string;
  user_id: string;
  date: string;                    // YYYY-MM-DD
  created_at: string;              // ISO timestamp

  training_type: 'gi' | 'nogi' | 'openmat';
  duration_minutes: number;
  sparring_rounds: number | null;

  techniques: string[];
  worked_well: string[];
  struggles: string[];
  voice_transcript: string;
}

interface Submission {
  id: string;
  session_id: string;
  user_id: string;
  technique_name: string;
  outcome: 'given' | 'received';
  date: string;
}
```

### AI Extraction Response

```typescript
interface AIExtractionResult {
  trainingType?: 'gi' | 'nogi' | 'openmat';
  durationMinutes?: number;
  didSpar?: boolean;
  techniquesDrilled?: string[];
  workedWell?: string;
  struggles?: string;
  sparringRounds?: number;
  submissionsGiven?: SubmissionCount[];
  submissionsReceived?: SubmissionCount[];
  notes?: string;
  confidence: number;  // 0-1, used for highlighting uncertain fields
}
```

---

## Edge Cases

### Recording Limits

| Scenario | Behavior |
|----------|----------|
| User stops at 5 seconds | Valid - process short recording |
| User stops at 0 seconds | Invalid - prompt "Say something first" |
| Timer reaches 80 seconds | Show "10 SECONDS REMAINING" warning |
| Timer reaches 90 seconds | Hard stop, auto-transition to Processing |
| User taps Cancel during recording | Confirm dialog: "Discard recording?" |

### AI Extraction Failures

| Scenario | Behavior |
|----------|----------|
| Can't detect training type | Keep user's pre-selected value |
| Can't extract any techniques | Show empty with "+ Add technique" prominent |
| Confidence < 0.6 on a field | Highlight field with subtle border |
| Complete extraction failure | Show transcript only, all fields manual |
| Transcription fails entirely | Show error, offer re-record |

### Network/Save Failures

| Scenario | Behavior |
|----------|----------|
| Save fails once | Show Error phase, offer retry |
| Save fails 3x | Offer "Save as Draft" to localStorage |
| Network offline | Detect before recording, queue for later sync |

### Validation Rules

| Field | Rule | Error Behavior |
|-------|------|----------------|
| Training Type | Required | Save button disabled |
| Duration | Required, must be > 0 | Save button disabled |
| Recording | Optional | Can save without recording |
| Techniques | Optional, array | Empty array OK |
| Notes | Optional, max 2000 chars | Truncate silently |

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Touch targets | 56px minimum for all primary actions, 48px for secondary |
| Font sizes | 14px minimum throughout, 12px only for labels |
| Color contrast | WCAG AA (4.5:1 minimum) |
| Screen reader | All elements have aria-labels, recording state announced |
| Recording feedback | Visual waveform + timer for deaf/HoH users |
| Focus management | Focus moves logically through phases |
| Reduced motion | Respect `prefers-reduced-motion` for animations |
| Voice fallback | Can complete entire flow without voice (text-only path) |

### ARIA Labels

```html
<button aria-label="Start voice recording">
<button aria-label="Stop recording and process">
<button aria-label="Remove technique: Armbar">
<button aria-label="Add submission">
<div role="timer" aria-live="polite" aria-label="Recording time: 42 seconds">
<div role="status" aria-live="polite">Processing your recording...</div>
```

---

## Testing Checklist

### Entry Phase
- [ ] Record button is prominent and tappable
- [ ] Training type defaults to Gi
- [ ] Duration defaults to 90 min
- [ ] Spar defaults to unselected (neither Yes nor No)
- [ ] Save button disabled until Type AND Duration selected
- [ ] Can save without recording (text-only path)
- [ ] Can add techniques from quick-add chips
- [ ] Can remove added techniques
- [ ] Notes field accepts text input
- [ ] Close button shows confirmation before discarding

### Recording Phase
- [ ] Timer starts at 0:00 and counts up
- [ ] Waveform animates during recording
- [ ] Prompts rotate every 4 seconds
- [ ] Belt-specific prompts appear when available
- [ ] Done button is large and prominent
- [ ] Cancel button works and confirms discard
- [ ] Warning appears at 80 seconds
- [ ] Hard stop at 90 seconds, auto-transitions to Processing
- [ ] Recording indicator (red dot) pulses

### Processing Phase
- [ ] Spinner animates
- [ ] Shows for minimum 1.5 seconds
- [ ] Times out after 10 seconds with error
- [ ] No user interaction possible

### Review Phase
- [ ] Transcript displays (collapsed by default)
- [ ] "Show more" expands transcript
- [ ] Training type/duration/spar editable
- [ ] Extracted techniques appear as chips
- [ ] Can remove techniques
- [ ] Can add techniques
- [ ] workedWell field displays and is editable
- [ ] Notes field displays and is editable
- [ ] Sparring section appears if didSpar=true
- [ ] Sparring section is locked for white belt with message
- [ ] Rounds picker works (1-10)
- [ ] Submission pickers work for given/received
- [ ] Re-Record button returns to Recording phase
- [ ] Save button saves and transitions to Success

### Success Phase
- [ ] Checkmark animates in
- [ ] Session count is correct
- [ ] Belt-personalized message displays
- [ ] "View in Journal" navigates to session detail
- [ ] "Back to Dashboard" navigates to dashboard

### Error Phase
- [ ] Error icon displays
- [ ] Message reassures data is preserved
- [ ] "Try Again" attempts save again
- [ ] "Cancel" confirms and discards

### Belt Personalization
- [ ] White belt sees sparring section locked
- [ ] Blue belt sees all fields active
- [ ] Recording prompts match belt level
- [ ] Success message matches belt level

### Edge Cases
- [ ] Very short recording (5 seconds) processes correctly
- [ ] 0-second recording shows error
- [ ] Network failure shows Error phase
- [ ] Retry after failure works
- [ ] Offline detection queues session for sync

---

## Related Documents

- `/docs/product/FEATURES.md` - Section 2 (Session Logger)
- `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` - Belt psychology profiles
- `/docs/product/BELT_INTEGRATION_SPEC.md` - Integration contracts
- `/docs/personas/PERSONA_PROFILES.md` - Test personas
- `/prototype/src/components/features/VoiceFirstLogger.tsx` - Implementation
- `/prototype/src/components/ui/SubmissionPicker.tsx` - Submission picker component

---

## Implementation Notes

### Current State (Prototype)

The `VoiceFirstLogger.tsx` implementation is **85% complete** per this spec:

| Feature | Status | Notes |
|---------|--------|-------|
| Entry phase | ✅ Done | Smart defaults, record button prominent |
| Recording phase | ⚠️ Partial | Missing 80s warning and 90s hard stop |
| Processing phase | ✅ Done | Mock extraction working |
| Review phase | ⚠️ Partial | Missing transcript display |
| Success phase | ✅ Done | Belt-personalized messages working |
| Error phase | ✅ Done | Retry logic working |
| Belt gating | ⚠️ Partial | Sparring visible to all, needs lock state for white |

### MVP Priorities

1. **Add 90-second limit** with 80-second warning
2. **Add transcript display** in Review phase (collapsible)
3. **Add belt gating visuals** for sparring section

### Production Swap Points

| Mock | Production |
|------|------------|
| `MOCK_EXTRACTED_DATA` | AssemblyAI transcription + Claude extraction |
| `api.sessions.create()` | Supabase insert |
| `localStorage` | Supabase + offline sync |

---

*Last updated: January 25, 2026*
