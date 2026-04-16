# FEAT-010: Free-Form Reflections Journal

**Status:** Speccing
**Priority:** P0
**Created:** 2026-04-13
**Expands:** `PITCH.html` (approved Apr 12)

---

## Problem Statement

TOMO's structured extraction captures *what happened* in a session -- techniques drilled, positions worked, duration, sparring rounds. But it loses *why it mattered*. Users describe intent, frustration, breakthroughs, and coaching feedback in their voice recordings, but none of that qualitative signal survives extraction. It's discarded.

This creates two problems:

1. **The Insights feature is data-starved on qualitative signals.** Weekly debriefs can tell you "you drilled kimura 4 times this week" but can't say "you've been frustrated with your closed guard retention for 3 weeks and your coach told you to focus on hip movement." That second insight is 10x more valuable.

2. **Users lose their own context.** The thoughts you have walking out of the gym -- what clicked, what confused you, what your coach said that stuck -- are gone by tomorrow. There's no place to put them. The app treats every session as a data row, not a journal entry.

Reflections close this gap. They give users a place to talk through what they're thinking about their training without worrying about structure, and they feed that qualitative data back into the AI pipeline so Insights can actually coach.

---

## User Stories

- "After class I want to talk through what I'm thinking about my training without worrying about structure."
- "I want my weekly debrief to reference how I *felt*, not just what I drilled."
- "My coach told me something important today and I want to capture it before I forget."
- "I had a breakthrough rolling today and I want to describe what changed -- not just log the technique."
- "Sometimes I want to reflect on my training week without it being tied to a specific session."

---

## Requirements

### Core

1. **Freeform voice or text entry.** Reuses the existing voice pipeline (AssemblyAI transcription). User picks voice or text, same as session logging.
2. **Session-attached or standalone.** A reflection can be linked to a specific session (post-training debrief) or exist on its own (weekly reflection, random thought, coaching note).
3. **No structured extraction.** Unlike session logging, reflections are NOT parsed into techniques/positions/rounds. The raw text is the data. This is deliberate -- structure kills the journal impulse.
4. **AI-generated tags and summary.** After saving, AI reads the reflection and generates: (a) 3-5 theme tags (e.g., "frustration", "guard retention", "coach feedback", "breakthrough"), (b) a 1-2 sentence summary. These are stored alongside the raw text for Insights consumption.
5. **Reflections feed into Insights prompts.** Weekly, monthly, and quarterly insight generation receives reflection summaries as qualitative context (see Insights Integration below).
6. **Privacy-first.** Reflections are the most personal data in the app. RLS must scope to user_id. No sharing, no public surface, no coach visibility (unless future Coach Integration opts in).

### UX

7. **Quick capture.** From tap to recording/typing in under 2 seconds. No setup screens, no category pickers, no friction.
8. **Session attachment is optional and post-hoc.** User can attach a reflection to a session after the fact (e.g., "link this to Tuesday's class"). Not required at creation time.
9. **Reflection history is browsable.** Users can scroll through past reflections, filtered by date or session link.
10. **Edit and delete.** Users can edit reflection text or delete reflections entirely.

---

## Data Model

### New table: `reflections`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | |
| `user_id` | uuid | FK → auth.users, NOT NULL | Owner |
| `session_id` | uuid | FK → sessions, NULL | Linked session (optional) |
| `content` | text | NOT NULL | Raw reflection text (transcribed or typed) |
| `input_method` | text | NOT NULL, CHECK IN ('voice','text') | How the reflection was entered |
| `tags` | text[] | NULL | AI-generated theme tags |
| `ai_summary` | text | NULL | AI-generated 1-2 sentence summary |
| `audio_path` | text | NULL | Storage path for voice recording (if voice input) |
| `created_at` | timestamptz | NOT NULL, default now() | |
| `updated_at` | timestamptz | NOT NULL, default now() | |

**RLS policy:** Users can only read/write their own reflections (`user_id = auth.uid()`).

**Indexes:**
- `idx_reflections_user_created` on (user_id, created_at DESC)
- `idx_reflections_session` on (session_id) WHERE session_id IS NOT NULL

### Migration notes

- Table starts fully nullable on optional columns (tags, ai_summary, audio_path, session_id) per schema migration rules in CLAUDE.md.
- No constraints tightened until app build with reflection support is live for all testers.

---

## Insights Integration

Reflections become qualitative fuel for the Insights prompt pipeline. Here's how they're injected at each cadence:

### Weekly Insight

The weekly prompt already receives session data (techniques, duration, frequency). Add a new section:

```
## Reflections This Week
{For each reflection in the last 7 days, include:}
- Date: {created_at}
- Linked session: {session date + techniques, or "standalone"}
- Summary: {ai_summary}
- Tags: {tags joined}
```

**Limit:** Last 5 reflections (most recent), summarized. Full text is too long for the prompt window.

### Monthly Insight

Aggregate reflection tags across the month. Surface:
- Recurring themes (e.g., "frustration appeared in 6/8 reflections")
- Sentiment arc (are reflections trending positive or negative?)
- Coach feedback mentions (any reflection tagged "coach feedback")

### Quarterly Insight

Same as monthly but with longer trend lines. Highlight:
- Theme evolution (what was the user thinking about 3 months ago vs now?)
- Breakthrough moments (reflections tagged "breakthrough")
- Persistent struggles (themes that appear every month)

---

## AI Processing Pipeline

When a reflection is saved:

1. **If voice input:** Send audio to AssemblyAI for transcription (reuse existing `transcribeAudio` service). Store transcribed text in `content`.
2. **Generate tags + summary:** Call an edge function (new: `process-reflection`) that sends the reflection text to Claude Haiku with a prompt like:

```
You are analyzing a BJJ practitioner's training reflection. Generate:
1. 3-5 theme tags from this list: [frustration, breakthrough, coach-feedback, technique-focus, sparring-insight, injury-concern, motivation, goal-setting, mental-game, drilling-note, competition-prep, training-partner, class-observation]
2. A 1-2 sentence summary capturing the key insight.

Reflection: {content}
```

3. **Store results:** Update the reflection row with `tags` and `ai_summary`.
4. **No blocking:** Tag generation happens async. The reflection is saved immediately with content; tags/summary populate within a few seconds.

---

## UX Flow

### Entry Points

1. **Journal tab — floating action button.** The existing gold "+" button in the tab bar currently only logs sessions. Add a second option: "Add Reflection" (or use a long-press menu: quick tap = log session, long press = choose session or reflection).

2. **Session detail screen — "Add Reflection" link.** On any saved session, a link to attach a reflection. Pre-fills `session_id`.

3. **Insights tab — prompt.** After reading a weekly insight, a CTA: "Anything on your mind? Add a reflection." Contextual entry point when the user is already in a reflective mindset.

### Capture Screen

- Minimal. Dark background, large mic button (voice) or text area (text).
- Toggle between voice and text at top.
- Optional "Link to session" picker (shows recent sessions, searchable).
- Save button. No other fields.

### Reflection Detail

- Shows full text, tags (as pills), AI summary, linked session (tappable to navigate), date.
- Edit and delete actions.

### Reflection History

- Scrollable list, grouped by date (same pattern as Journal).
- Filter: "All" / "Session-linked" / "Standalone".
- Each card shows: date, first line of text, tags, linked session indicator.

---

## Success Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Reflection rate** | % of sessions with an attached reflection | 30% within 60 days of launch |
| **Standalone frequency** | Standalone reflections per active user per week | 1+ per week |
| **Insights quality** | User feedback on weekly insights (thumbs up rate) before vs. after reflections launch | +15% improvement |
| **Retention signal** | Users who reflect 2+ times/week vs. those who don't — compare 30-day retention | Reflectors retain 20% higher |
| **Time to capture** | Median time from tap to saved reflection | < 45 seconds (voice), < 90 seconds (text) |

---

## Open Questions

1. **Where does the reflection list live?** Options: (a) inside the Journal tab as a filter/toggle, (b) its own tab, (c) a sub-screen of Journal. Leaning toward (a) -- reflections are journal entries, just unstructured ones.
2. **Should reflections have a mood rating?** Could reuse the existing 5-dot mood UI from session success phase. Adds a quantitative signal with minimal friction. Leaning yes.
3. **Voice recording storage.** Do we store the audio file for playback later (like sessions) or discard after transcription? Storage cost vs. user value trade-off.
4. **Tag taxonomy.** The proposed tag list above is a starting point. Should it be fixed or should AI generate freeform tags? Fixed is better for aggregation; freeform is better for nuance.

---

## Dependencies

- Existing voice pipeline (AssemblyAI) -- reuse, no changes needed
- New edge function (`process-reflection`) -- lightweight, similar to existing extraction function
- Supabase migration for `reflections` table
- Insights prompt updates (weekly/monthly/quarterly templates)

## Out of Scope (for initial release)

- Sharing reflections with coaches
- Photo/video attachments
- Reflection templates or guided prompts
- Integration with external journaling apps
