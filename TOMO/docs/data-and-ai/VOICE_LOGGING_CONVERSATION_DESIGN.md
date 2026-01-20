# BJJ Voice Logging System

## Feature Specification v1.0

---

## Executive Summary

A voice-first training log that captures session details in under 2 minutes. Users talk naturally after class; AI extracts structured data; minimal follow-up questions fill critical gaps. The system prioritizes consistency over completeness—a sparse log today beats an abandoned app tomorrow.

---

## The Problem

BJJ practitioners know journaling helps. They don't do it anyway.

**Why:**
- Post-training exhaustion kills motivation for data entry
- Structured forms feel like homework after a hard session
- 70% of session details are forgotten within 24 hours
- Existing apps require too many taps, too many fields

**The result:** High download rates, low retention. Users abandon training journals within weeks.

---

## Design Philosophy

### Core Principle: Capture Something, Not Everything

A session entry is valuable if it contains:
- A timestamp (when did you train?)
- Any signal of what happened (duration, techniques, sparring—anything)

Completeness is a luxury. Consistency is the goal.

### The Friction Budget

Users have ~90 seconds of willingness post-training. Every question we ask spends that budget. We get 1-2 questions maximum before they abandon the flow.

**Implication:** The AI must be aggressive about inferring data, not conservative. When in doubt, save what we have and move on.

---

## Data Architecture

### Tier 0: Automatic (Zero User Effort)

| Field | Source | Notes |
|-------|--------|-------|
| Date | System timestamp | Override if user says "yesterday" |
| Day of week | Derived | Useful for pattern detection |
| Time of day | System timestamp | Morning/afternoon/evening classification |

### Tier 1: Minimum Viable Session (Must Have One)

| Field | Source | Why It Matters |
|-------|--------|----------------|
| Duration | Voice extraction or inference | Training volume is the #1 progress predictor |
| Training type | Voice extraction or one tap | Gi vs No-Gi determines technique context |
| Sparring (yes/no) | Voice extraction or inference | Distinguishes drilling from live application |

**Rule:** A session is saveable with Tier 0 + any single Tier 1 field.

### Tier 2: Progress Tracking (High Value, Optional)

| Field | Source | Why It Matters |
|-------|--------|----------------|
| Techniques worked | Voice extraction | Maps to curriculum, identifies gaps |
| Positions covered | Voice extraction | Builds positional heat map |
| Sparring outcomes | Voice extraction | Performance trending |
| What worked | Voice extraction | Confidence/success patterns |
| What didn't work | Voice extraction | Focus area identification |

### Tier 3: Context (Enrichment Only)

| Field | Source | Why It Matters |
|-------|--------|----------------|
| Training partners | Voice extraction | Skill-relative performance |
| Physical state | Voice extraction | Injury tracking, fatigue patterns |
| Energy/mood | Voice extraction | Correlates mental state to performance |
| Class type | Voice extraction | Competition class vs fundamentals vs open mat |

---

## The Capture Flow

### Phase 1: Voice Recording

**Trigger:** User opens app → taps "Log Training"

**Interface:**
```
┌─────────────────────────────────────────┐
│                                         │
│            ◉ Recording...               │
│                                         │
│           ~~~~ 0:47 ~~~~                │
│                                         │
│    "How was training? What'd you        │
│     work on?"                           │
│                                         │
│          [ Tap when done ]              │
│                                         │
└─────────────────────────────────────────┘
```

**Parameters:**
- Maximum recording: 5 minutes
- Typical recording: 60-90 seconds
- Minimum useful: 10 seconds
- Auto-stop on 3 seconds of silence (optional setting)

**What users actually say:**
> "Tuesday night, maybe hour and a half. Worked on knee slice passing, the version where you control the far arm. Rolled five rounds—got swept a lot from half guard, couldn't maintain the underhook. Tapped Jake with a collar choke, Sarah caught me in a triangle. Knee feels a little tight but nothing serious."

### Phase 2: AI Processing

**Duration:** 5-10 seconds

**Interface:**
```
┌─────────────────────────────────────────┐
│                                         │
│         Processing your session...      │
│                                         │
│              ◐ ◓ ◑ ◒                    │
│                                         │
└─────────────────────────────────────────┘
```

**AI Tasks:**
1. Transcribe audio to text
2. Extract structured data (see extraction rules below)
3. Identify missing Tier 1 fields
4. Generate summary card

### Phase 3: Summary Card Review

**Interface:**
```
┌─────────────────────────────────────────┐
│ TUE, DEC 17 • 7:30 PM                   │
│ Gi • ~90 min • 5 rounds                 │
├─────────────────────────────────────────┤
│                                         │
│ WORKED ON                               │
│ Knee slice pass (far arm control)       │
│                                         │
│ SPARRING                                │
│ ✓ Collar choke → Jake                   │
│ ✗ Triangle ← Sarah                      │
│                                         │
│ STRUGGLED WITH                          │
│ Half guard top — losing underhook       │
│                                         │
│ PHYSICAL                                │
│ Left knee: minor tightness              │
│                                         │
├─────────────────────────────────────────┤
│      [ Edit ]            [ Save ✓ ]     │
└─────────────────────────────────────────┘
```

**User action:** Review, optionally edit, tap save.

**Target time:** 15-30 seconds

### Phase 4: Conversational Gap-Fill (If Needed)

**Trigger:** Missing Tier 1 data that couldn't be inferred.

**Rules:**
1. Ask at most ONE follow-up question
2. Accept any answer—don't probe deeper
3. If user ignores or dismisses, save anyway

**Decision Tree:**

```
IF training_type unclear AND can't infer from gym default:
   → Show tap selector: [ Gi ] [ No-Gi ]
   
ELSE IF duration missing AND can't infer:
   → "About how long was class?"
   → Accept: number, "hour", "90 min", "long", "short"
   
ELSE IF techniques AND struggles both empty:
   → "Anything specific you worked on or that gave you trouble?"
   → Accept any response. Don't follow up.
   
ELSE:
   → Skip to save. We have enough.
```

**What we DON'T ask:**
- Number of sparring rounds (nice to have, not essential)
- Partner names (enrichment only)
- Injury details (only if they mention injury)
- Energy/mood (only extract if volunteered)

---

## AI Extraction Rules

### Extraction Targets

| Data Point | Signal Words/Patterns |
|------------|----------------------|
| Duration | "90 minutes," "hour and a half," "two-hour open mat," "quick class" |
| Training type | "gi class," "no-gi," "nogi," "submission only," "wrestling" |
| Techniques | Named moves: "armbar," "knee slice," "berimbolo," "RNC" |
| Positions | "from closed guard," "in mount," "from the back," "half guard" |
| Sparring rounds | "rolled five times," "did 6 rounds," "three 5-minute rounds" |
| Partners | Names in sparring context: "rolled with Jake," "Sarah caught me" |
| Submissions given | "tapped him," "got the choke," "finished," "submitted" |
| Submissions received | "got caught," "tapped to," "he got me," "caught me" |
| What worked | "felt good," "finally hit," "working well," "clicked" |
| What didn't | "kept getting," "couldn't," "struggled," "got passed" |
| Injuries | "knee is sore," "shoulder tight," "tweaked," "hurts" |
| Energy/mood | "exhausted," "felt strong," "low energy," "focused," "tired" |

### Inference Rules

**Training Type Inference:**
- Collar choke, lapel, sleeve grip → Gi
- Heel hook, leg lock without context → No-Gi
- Gym has default type → Use default if ambiguous

**Duration Inference:**
- "Class" with no modifier → Use gym's standard class length
- "Open mat" → 90-120 minutes typical
- "Quick session" → 45-60 minutes
- "Long day" → 2+ hours

**Sparring Inference:**
- Any mention of: rolling, rounds, tapped, caught, submitted, got swept → Sparring = Yes
- "Just drilling" → Sparring = No

### Extraction Confidence

The AI should extract aggressively and flag low-confidence interpretations for user review rather than asking clarifying questions.

**High confidence (auto-accept):**
- Explicit technique names
- Clear duration statements
- Named training partners

**Medium confidence (extract but allow easy edit):**
- Inferred training type
- Slang technique names
- Vague duration ("a while")

**Low confidence (skip or ask one question):**
- Ambiguous technique references ("that sweep")
- Unclear if drilling vs sparring

---

## Edge Cases

### User Says Almost Nothing

**Input:** "Good class tonight."

**Action:**
- Extract: Date (auto), implied attendance
- Infer: Duration from gym default, training type from gym default
- No follow-up questions
- Save as minimal entry

**Entry:**
```
TUE, DEC 17
Trained • [Gym default duration]
```

### User Mentions Multiple Sessions

**Input:** "Trained this morning and then went back for open mat tonight."

**Action:**
- Detect multiple sessions
- Ask: "Sounds like two sessions. Want to log them separately?"
- If yes → Create two entries, prompt for each
- If no → Combine into single "2x training day" entry

### User Rambles for 5 Minutes

**Action:**
- Extract everything possible
- Prioritize Tier 1-2 data
- Summarize; don't transcribe verbatim
- Present consolidated summary card

### Technique Names Are Wrong or Slang

**Input:** "Hit that one sweep where you go under them"

**Action:**
- Log as stated: "Sweep (go under variation)"
- Optionally suggest: "Do you mean scissor sweep?"
- Accept correction or original phrasing
- Build user's personal terminology map over time

### User Mentions Injury

**Input:** "Tweaked my shoulder in that last round"

**Action:**
- Extract injury: shoulder, context (sparring)
- Flag for visibility in entry
- Offer: "Want to track this injury over time?" (one tap yes/no)
- If tracking → Add to injury log, prompt for severity

---

## Downstream Value

### What This Data Enables

| Insight | How It's Generated |
|---------|---------------------|
| Training consistency | Sessions per week, streaks, volume trends |
| Technique exposure | Which techniques logged, frequency, recency |
| Positional heat map | Where they train most/least |
| Sparring performance | Sub rate, tap rate, trends over time |
| Struggle patterns | "You've mentioned losing the underhook 4x this month" |
| Progress signals | "Your guard attacks have increased since October" |
| Coach summaries | "Here's what Drew's working on and where he's stuck" |
| Curriculum gaps | Techniques never logged vs. belt requirements |

### Feedback Generation Triggers

**Weekly summary:**
- Training volume vs. previous weeks
- Technique variety score
- Consistency streak status

**Pattern detection:**
- "You've logged scissor sweep 5 times but never hit it in sparring"
- "Mount escapes keep showing up in struggles—focus area?"

**Progress milestones:**
- "50 sessions logged!"
- "First submission from back this month"
- "Consistent 3x/week for 4 weeks straight"

---

## Success Metrics

### User Behavior

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Log completion rate | >80% of opened flows | Are we low-friction enough? |
| Time to save | <90 seconds median | Respecting the friction budget |
| 7-day retention | >60% | Are users coming back? |
| 30-day retention | >40% | Has the habit formed? |
| Sessions logged per active user | >2.5/week | Are we capturing real training? |

### Data Quality

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Tier 1 completion | >90% of entries | Can we track progress? |
| Technique extraction rate | >70% of entries | Can we map curriculum? |
| User edit rate on summary | <20% | Is AI extraction accurate? |

---

## Technical Requirements

### Voice Capture
- Audio format: AAC or WAV
- Upload: Stream or post-recording
- Transcription: Whisper API or equivalent
- Latency: <10 seconds end-to-end

### AI Extraction
- Model: GPT-4 class or fine-tuned extraction model
- Prompt: Structured extraction with BJJ domain knowledge
- Output: JSON matching data schema
- Fallback: Surface raw transcript if extraction fails

### Storage
- Session entries: User account database
- Voice recordings: Optional retention (privacy consideration)
- Transcripts: Stored for extraction improvement

### Offline Support
- Voice recording works offline
- Queue for upload when connection restored
- Local draft storage

---

## Future Enhancements (Post-MVP)

### Phase 2: Smart Defaults
- Learn user's typical training schedule
- Pre-fill training type based on day/time
- Suggest partners based on gym check-in data

### Phase 3: Technique Library
- Autocomplete technique names
- Link to curriculum requirements
- Video reference integration

### Phase 4: Coach Integration
- Share session summaries with coach
- Receive coach feedback on entries
- Coach-assigned focus areas appear in prompts

### Phase 5: Social/Team Features
- Training partner tagging
- Team training volume leaderboards
- Shared drilling logs

---

## Appendix: Sample Extraction Prompt

```
You are extracting structured data from a BJJ practitioner's voice note about their training session.

Extract the following fields. If a field cannot be determined, leave it null. Be aggressive about inferring—it's better to extract something than nothing.

Fields:
- duration_minutes (integer or null)
- training_type (enum: "gi", "nogi", "both", null)
- sparring (boolean or null)
- sparring_rounds (integer or null)
- techniques (array of strings)
- positions (array of strings)
- submissions_given (array of {technique, partner?})
- submissions_received (array of {technique, partner?})
- worked_well (array of strings)
- struggled_with (array of strings)
- training_partners (array of strings)
- injuries (array of {body_part, severity?, notes?})
- energy_level (enum: "high", "medium", "low", null)
- notes (string, anything else notable)

Transcript:
{transcript}

Output valid JSON only.
```

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial specification |
