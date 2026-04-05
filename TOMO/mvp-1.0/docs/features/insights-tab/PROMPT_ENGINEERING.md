# FEAT-002: Prompt Engineering -- The Insight Engine

**Created:** 2026-03-30
**Purpose:** How user data becomes personalized weekly insights. This is the brain of the feature.

---

## Data Inventory: What We Know About the User

### Currently Collected (Profile)

| Field | Source | Example | Used in prompt? |
|-------|--------|---------|-----------------|
| name | Onboarding | "Drew" | Yes (UCD) |
| belt | Onboarding | "blue" | Yes (primary routing) |
| stripes | Onboarding | 2 | Yes (UCD) |
| gym_name | Onboarding | "Alliance Paoli" | Yes (UCD) |
| gym_affiliation | Onboarding | "Alliance" | No |
| target_frequency | Onboarding | 4 | Yes (adherence calc) |
| training_goals | Onboarding | ["Fitness", "Mental Health"] | **Collected but NOT used in prompt** |
| experience_level | Onboarding | "intermediate" | **Collected but NOT used in prompt** |
| logging_preference | Onboarding | "voice" | No (internal) |
| session_count | Computed | 42 | Yes (totalSessionsAllTime) |

### Currently Collected (Per Session)

| Field | Source | Example | Used in prompt? |
|-------|--------|---------|-----------------|
| date | Logger | "2026-03-28" | Yes (week bounds) |
| training_mode | Logger | "gi" | Yes (mode breakdown) |
| session_kind | Logger | "class" | Yes (kind breakdown) |
| duration_minutes | Logger | 60 | Yes (total minutes) |
| did_spar | Logger | true | Yes (sparring rounds) |
| sparring_rounds | Logger | 3 | Yes |
| techniques_drilled | Logger/AI | ["half guard sweep", "armbar"] | Yes |
| submissions_given | Logger/AI | [{type: "armbar", count: 1}] | Yes |
| submissions_received | Logger/AI | [{type: "triangle", count: 2}] | Yes |
| injuries | Logger/AI | ["right knee soreness"] | Yes |
| instructor | Logger | "Coach Mike" | No (not in prompt) |
| lesson_topic | Logger | "guard passing" | No (not in prompt) |
| notes | Logger | "felt good today..." | Yes (sentiment analysis) |
| transcript | Voice AI | Full voice transcript | Yes (sentiment analysis) |

### Currently Computed (Pattern Engine)

| Field | Source | Example | Used in prompt? |
|-------|--------|---------|-----------------|
| sentiment | Pattern engine | "positive" | Yes |
| detectedPatterns | Pattern engine | ["guard-focused drilling"] | Yes |
| streakDays | Pattern engine | 4 | Yes |
| priorWeekDelta | Pattern engine | {sessionsDelta: +1} | Yes |
| newTechniques | Pattern engine | ["k-guard"] | Yes |
| recurringInjuries | Pattern engine | ["left knee"] | Yes |

---

## Data Gaps: What We Should Collect

These fields would dramatically improve insight personalization. Ranked by impact.

### High Impact -- Add to Onboarding

**1. Training Motivation (WHY they train)**

This is the biggest gap. Someone training for self-defense needs fundamentally different insight framing than someone training for mental health.

| Motivation | What they want to hear | What progress looks like to them |
|------------|----------------------|--------------------------------|
| **Self-defense** | "Your guard recovery is getting reliable" | Can they defend themselves? Escape bad positions? |
| **Fitness** | "220 minutes on the mat this week" | Volume, consistency, physical benchmarks |
| **Competition** | "Your submission ratio improved" | Performance metrics, winning, technique effectiveness |
| **Mental health** | "Three sessions this week -- that's your space" | Showing up, the ritual, stress relief |
| **Hobby/fun** | "Tried k-guard for the first time" | Exploration, variety, new experiences |
| **Self-improvement** | "You're more disciplined than last month" | Consistency trends, habit building, long-term arcs |

**Collection method:** Multi-select chips during onboarding (already have `training_goals` field -- just need to use it in the prompt and add better options).

**Current state:** `training_goals` IS collected in YourTrainingScreen but current options are: Competition, Fitness, Hobby, Mental Health, Other. These are close but should be refined:
- "Self-Defense" should be an explicit option (huge for white belts)
- "Self-Improvement / Discipline" should be an option
- "Social / Community" should be an option

**Prompt impact:** The training motivation becomes a lens for every insight. If motivation = "fitness", a consistency insight says "220 minutes this week -- that's a full workout schedule built into something you actually enjoy." If motivation = "mental health", the same data becomes "Three sessions this week. That's three times you chose the mat over the couch. The consistency itself is the win."

**2. Age Range**

Not exact age -- a range is enough. Training reality is dramatically different at 25 vs. 45.

| Age Range | Insight adjustments |
|-----------|-------------------|
| 18-25 | Standard recovery expectations. Competition is natural. Higher session targets are realistic. |
| 26-35 | Work-life balance awareness. "2-3 sessions while managing a career is solid." |
| 36-45 | Recovery matters more. "Your body needs more time between sessions than it did at 25." Injury language gets more careful. |
| 46-55 | Longevity framing. "Sustainable training is the goal." Never push volume. Celebrate consistency over intensity. |
| 56+ | Respect for the commitment. "Being on the mat at this stage is uncommon and impressive." Focus on movement quality, not performance. |

**Collection method:** Optional chip during onboarding (or profile settings). "What's your age range?" with 5 options. Not required.

**Prompt impact:** Changes recovery language, session frequency framing, and injury urgency. A 45-year-old with knee soreness gets more cautious language than a 25-year-old.

**3. Gender**

Optional. Affects social dynamics context and some physical framing.

| Gender | Insight adjustments |
|--------|-------------------|
| Male | Default framing. Ego language can be more direct. |
| Female | Acknowledge the added social layer (being one of few women, rolling with larger partners). Never patronize. |
| Non-binary/Other | Neutral framing. No gendered assumptions. |
| Prefer not to say | Neutral framing. |

**Collection method:** Optional in profile settings. Not onboarding (too personal for day 1).

**Prompt impact:** Subtle tone shifts. A woman who notes "got smashed by a bigger partner" gets "size advantages are real -- technique is how you neutralize them over time" rather than just "tough rounds happen."

### Medium Impact -- Use What We Already Have

**4. Instructor + Lesson Topic (already collected, not used)**

We collect `instructor` and `lesson_topic` per session but don't pass them to the prompt. These are gold:
- "Coach Mike focused on guard passing this week" -- the insight can reference what the coach is teaching
- "Your instructor covered the same position two weeks running" -- signals intentional curriculum
- Different instructors teaching different things -- the insight can note variety

**5. Experience Level (already collected, not used)**

The `experience_level` field ("new", "beginner", "intermediate", "experienced") is collected but not in the prompt. Combined with belt, it gives much better calibration:
- White belt + "experienced" = someone who cross-trained from judo, wrestling, etc. Don't explain basic concepts.
- Blue belt + "new" = someone who got fast-tracked (unlikely but possible). May need more support.

**6. Gym Affiliation (already collected, not used)**

Knowing the gym's affiliation (Gracie Barra, Alliance, 10th Planet, etc.) tells us about training culture:
- 10th Planet = nogi-only, leg lock heavy
- Gracie Barra = structured curriculum, gi-focused
- Alliance = competition-focused

This is subtle but helps the insight feel gym-aware.

### Lower Priority -- Future Enhancement

**7. Training partner names** (mentioned in notes, could extract)
**8. Competition history** (dedicated tracker, FEAT-005)
**9. Weight class** (competition relevant)
**10. Physical limitations** (beyond injuries -- chronic conditions, mobility)

---

## The Prompt Architecture

### How Data Becomes an Insight

```
PROFILE DATA                    SESSION DATA                COMPUTED DATA
  name, belt, stripes            this week's sessions        sentiment analysis
  gym, affiliation               techniques, sparring        pattern detection
  training_goals                 submissions, injuries       streak calculation
  experience_level               notes, transcript           prior week delta
  age_range (new)                instructor, topic           recurring injuries
  gender (new)                   duration, mode, kind        adherence rate

         |                              |                         |
         v                              v                         v
    +-----------+              +------------------+       +----------------+
    |   USER    |              |   WEEK DATA      |       |   PATTERN      |
    |  CONTEXT  |              |   (structured)   |       |   ENGINE       |
    |  DOCUMENT |              |                  |       |   (client-side)|
    +-----------+              +------------------+       +----------------+
         |                              |                         |
         +------------------------------+-------------------------+
                                        |
                                        v
                            +------------------------+
                            |   SYSTEM PROMPT        |
                            |   (belt-routed,        |
                            |    motivation-aware,    |
                            |    age-adjusted)        |
                            +------------------------+
                                        |
                                        v
                            +------------------------+
                            |   CLAUDE HAIKU         |
                            |   (generate-weekly)    |
                            +------------------------+
                                        |
                                        v
                            +------------------------+
                            |   WEEKLY INSIGHT       |
                            |   2-3 observations     |
                            |   + focus next         |
                            +------------------------+
```

### The System Prompt

The system prompt lives in `generate-weekly/index.ts` in `buildSystemPrompt()`. It's built dynamically based on belt, training goals, age, and gender.

**Core philosophy:** Say the 1-3 most important things about their week. Not every data point needs coverage. Only what matters.

**Priority ranking for what to say:**
1. Injury or recurring pain -- always first if present
2. A pattern they can't see -- repeated technique, recurring submission, shift from last week
3. A meaningful change -- volume up/down, new technique, a milestone

**Anti-patterns (built into prompt rules):**
- Never restate what they logged. They know. Tell them what it means.
- Never hedge ("it seems like"). State observations as facts.
- Never match enthusiasm to non-achievement. Two sessions isn't "amazing."
- Never sound like a fitness app notification. Sound like a training partner.

**Cold-start (first-ever insight):**
When `totalSessionsAllTime <= sessionsThisWeek`, the prompt adds a first-insight block:
- Acknowledge what they did concretely
- Share one real fact about development at their belt level
- Nudge: keep showing up, ask coach questions, pay attention to one thing
- 1-2 paragraphs max. Don't pretend to see patterns from one session.

**Output format:** `{ paragraphs: [{text, isWatch, defer?}], focusNext }` -- valid JSON, no markdown wrapping.

---

## New Data Fields to Add

### Onboarding Changes

**1. Refine training_goals options**

Current: Competition, Fitness, Hobby, Mental Health, Other

Proposed: Self-Defense, Fitness, Competition, Mental Health, Self-Improvement, Social / Community, Hobby

Multi-select (pick 1-3). These map directly to prompt routing blocks.

**2. Birthday (mandatory, 18+ gate)**

FEAT-008 decision: collect actual birthday during onboarding, not an age range.
- Date picker in AboutYouScreen
- Must be 18+ to proceed (age gate)
- Stored in profiles table as `birthday DATE`
- Age computed at prompt time from birthday (never store computed age)
- Prompt receives age bucket: "18-25", "26-35", "36-45", "46-55", "56+"
- Also enables: injury urgency calibration, recovery language, milestone ("1 year of training" anniversary detection)

**2b. Body weight (optional)**

New optional field in onboarding or profile settings:
- Number input in lbs (or kg toggle)
- Stored in profiles table as `weight_lbs NUMERIC`
- Useful for: competition weight class context, physical framing ("rolling with bigger partners"), future body composition tracking
- Prompt receives weight only if competition is a stated training goal

**3. Add gender field**

Collected during onboarding (AboutYouScreen, after name/belt/stripes):
- "Male", "Female", "Non-binary", "Prefer not to say"
- Optional but visible -- the chip selector is there, they can skip it
- Stored in profiles table as `gender TEXT`

### Session Data Changes

**4. Pass instructor + lesson_topic to the prompt**

These fields are already collected. The pattern engine just needs to aggregate them:
- `weekData.instructors`: unique instructor names this week
- `weekData.lessonTopics`: unique lesson topics this week

This requires a small change to `insights-engine.ts` to include these in the computed output.

### Profile Schema Migration

```sql
-- Add age_range and gender to profiles
ALTER TABLE profiles ADD COLUMN age_range TEXT;
ALTER TABLE profiles ADD COLUMN gender TEXT;
```

### Updated UCD Serialization

The user context document serialization (`user-context.ts`) should include:

```
Name: Drew
Belt: Blue (2 stripes), 14 months training
Gym: Alliance Paoli (Alliance affiliation)
Age: 36-45
Trains for: Fitness, Mental Health
Experience: Intermediate
Target: 4 sessions/week
...rest of computed patterns...
```

---

## Quality Checks

Before displaying any insight:

1. **Belt tone:** No "system" for white belts, no "great job showing up" for blue belts
2. **Specificity:** Could you swap any user's name in and it still reads the same? Too generic. Reject.
3. **Injury safety:** Every injury mention must defer to coach/doctor
4. **Focus Next:** Can they do this tomorrow without asking anyone? If not, rewrite.

---

## Implementation Priority

| Change | Effort | Impact | Phase |
|--------|--------|--------|-------|
| Use training_goals in prompt | Low (data exists, just wire it) | **High** | Phase 1 |
| Use experience_level in prompt | Low (data exists) | Medium | Phase 1 |
| Add instructor/lesson_topic to weekData | Low (data exists in sessions) | Medium | Phase 1 |
| Refine training_goals options | Low (chip label changes) | Medium | Phase 1 |
| Redesign system prompt (this doc) | Medium (prompt rewrite) | **High** | Phase 1 |
| Add birthday field (mandatory, 18+ gate) | Medium (date picker, validation) | **High** | Phase 1 (FEAT-008) |
| Add body weight field (optional) | Low (number input) | Low-Medium | Phase 1 (FEAT-008) |
| Add gender field to onboarding | Low (1 chip selector in AboutYouScreen) | Medium | Phase 1 |
| Motivation x Belt prompt routing | Medium (conditional blocks) | **High** | Phase 1 |
| Quality validation layer | Medium (post-generation check) | Medium | Phase 2 |
