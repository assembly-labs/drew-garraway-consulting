# TOMO User Personas

> **Who we're building for. What they're experiencing. How to talk to them.**
>
> For feature specifications, see `/docs/product/FEATURES.md`

---

## Quick Reference

| ID | Persona | Belt | Priority | Core Need |
|----|---------|------|----------|-----------|
| `newcomer` | Alex Rivera | White (0-6mo) | PRIMARY | Survive the initial filter |
| `survivor` | Jake Thompson | White (6-18mo) | PRIMARY | Build toward blue belt |
| `plateau-warrior` | Marcus Chen | Blue | PRIMARY | Break through the plateau |
| `newcomer-female` | Maya Okonkwo | White (0-6mo) | SECONDARY | Belong + survive |
| `specialist` | Sofia Rodriguez | Purple | TERTIARY | Develop systems |
| `finisher` | Daniel Reyes | Brown | TERTIARY | Earn black belt |

---

## Market Prioritization

| Segment | % of Practitioners | Priority | Rationale |
|---------|-------------------|----------|-----------|
| White Belt (0-6mo) | 15-20% | **PRIMARY** | 70-90% quit—highest impact opportunity |
| White Belt (6-18mo) | 10-15% | **PRIMARY** | Continuation of newcomer success |
| Blue Belt | 35-40% | **PRIMARY** | Largest segment, highest revenue, clearest pain |
| Purple Belt | 20-25% | TERTIARY | Low dropout risk |
| Brown Belt | 10-15% | TERTIARY | Very low dropout risk |

**Design philosophy:** If it's too complex for an exhausted newcomer who just got destroyed in their 5th class, it's too complex.

---

## User States

Users exist in two fundamentally different states. Design must match context.

| Context | State | Time Budget | Implications |
|---------|-------|-------------|--------------|
| **Session Logging** | Exhausted | 90 seconds max | Voice-first, one question at a time, huge touch targets |
| **Everything Else** | Relaxed | Unlimited | Rich data welcome, exploration encouraged |

---

# PRIMARY PERSONAS

---

## 1. The Newcomer: Alex Rivera

**ID:** `newcomer`
**Belt:** White, 0-2 stripes
**Time Training:** 0-6 months
**Training Frequency:** 2-3x/week

> "I don't know if I can keep doing this. But I don't want to quit."

### Demographics

| Attribute | Value |
|-----------|-------|
| Age | 25-45 |
| Prior martial arts | None |
| How they found BJJ | Friend/coworker, YouTube, self-defense interest |

### What They're Experiencing

**Physically:**
- Gassing out within 5 minutes of warm-up
- Extreme full-body soreness (ribs, neck, fingers)
- Grip depletion mid-roll
- Even marathon runners struggle—BJJ cardio is unique

**Emotionally:**
- Pre-class anxiety (60% experience this)
- Constant ego destruction: submitted 10+ times per session
- The "Why am I doing this?" moment in the car after training

**Cognitively:**
- Position confusion: often don't know what position they're in
- Technique overload: shown 6 steps, forget steps 2-5
- 20-40% reduced decision-making capacity post-training

### Their Obstacles

| Obstacle | Manifestation |
|----------|---------------|
| **Habit formation** | Training feels optional; easy to skip |
| **Ego damage** | Getting tapped by smaller/older/newer people |
| **Progress invisibility** | "Am I even getting better?" |
| **Overwhelm** | Can't process technique complexity |
| **Injury** | First injury often triggers quit consideration |

### What Would Make Them Quit

| Reason | What They Need |
|--------|----------------|
| "I wasn't improving" | Visible micro-progress (survival time, position recognition) |
| "I kept getting hurt" | Injury awareness + return support |
| "I just stopped going" | Gentle re-engagement, not shame |
| "I didn't feel like I belonged" | Connection to coach and gym community |

### Messaging Guidelines

**DO say:**
- "Getting tapped is learning. Every tap is data."
- "10 sessions. That's more than 70% of people who try BJJ."
- "Surviving 2 minutes against someone is progress."

**DON'T say:**
- "Great job!" (too vague)
- "You're almost ready for promotion!" (outcome focus)
- "Your submission rate is improving!" (meaningless at this stage)

### Success Metrics

| Metric | Target |
|--------|--------|
| 30-day retention | >45% |
| Sessions logged in first month | >8 |

---

## 2. The Survivor: Jake Thompson

**ID:** `survivor`
**Belt:** White, 2-4 stripes
**Time Training:** 6-18 months
**Training Frequency:** 3-4x/week

> "I made it this far. I'm not quitting now."

### Demographics

| Attribute | Value |
|-----------|-------|
| Age | 26-40 |
| Status | Survived the 70-90% dropout filter |
| Identity | Emerging "BJJ person" |

### What They're Experiencing

**Physically:**
- Body adapting; soreness manageable
- Can complete full class without dying
- Starting to feel when techniques "click"

**Emotionally:**
- Pride in having survived the initial filter
- New anxiety: "When will I get my blue belt?"
- Comparing to peers who started at the same time

**Cognitively:**
- Starting to recognize positions and predict attacks
- Building mental library of techniques
- Beginning to chain movements together

### Their Obstacles

| Obstacle | Manifestation |
|----------|---------------|
| **Sustaining momentum** | Initial excitement fading |
| **Blue belt anxiety** | "When will it happen? Am I good enough?" |
| **Peer comparison** | "That guy started after me and he's better" |
| **Mini-plateau** | First taste of "not improving" |
| **Relatedness dependency** | Gym community becomes make-or-break |

### What Would Make Them Quit

| Reason | What They Need |
|--------|----------------|
| "Blue belt is taking forever" | Process focus, not belt timeline |
| "I'm not improving anymore" | Progress visualization vs past self |
| "I don't feel like I belong" | Training partner connections |

### Messaging Guidelines

**DO say:**
- "18 months in. You're in the top 10-30% of people who ever tried BJJ."
- "Your escapes are building. You mentioned mount escape in 4 of your last 6 sessions."
- "Blue belt is coming. Focus on the process—the belt follows the work."

**DON'T say:**
- "You should be getting your blue belt soon!" (creates anxiety)
- "Other white belts at your level typically..." (peer comparison)
- "You're ready for promotion!" (not our call)

### Success Metrics

| Metric | Target |
|--------|--------|
| 6-month retention (from 6mo mark) | >65% |
| Session frequency | 3+/week average |
| Training partner diversity | >5 unique partners logged |

---

## 3. The Plateau Warrior: Marcus Chen

**ID:** `plateau-warrior`
**Belt:** Blue, 1-3 stripes
**Time at Belt:** 6 months - 3 years
**Training Frequency:** 3-4x/week

> "I used to be improving every week. Now I can't remember the last time I felt like I got better."

### Demographics

| Attribute | Value |
|-----------|-------|
| Age | 28-42 |
| Time training total | 2-5 years |
| Competition | Optional; some compete, many don't |

### What They're Experiencing: The Blue Belt Blues

Blue belt was the goal. They achieved it. Now what?

**The Crisis:**
- Black belt seems impossibly far (7-10 more years)
- Rapid discovery phase is over
- They're not terrible, but they're not good either
- They're... stuck

**Contributing Factors:**
| Factor | Description |
|--------|-------------|
| Goal completion | Blue belt was the target; achieved it; now rudderless |
| Loss of novelty | Everything feels familiar |
| Performance pressure | Higher belts stop going easy; white belts hunt them |
| Imposter syndrome | Getting tapped by white belts creates identity crisis |
| Progress invisibility | Improvement happening but they can't see it |

### Their Obstacles

| Obstacle | Manifestation |
|----------|---------------|
| **Invisible progress** | "I don't know if I'm getting better" |
| **Outcome fixation** | "When will I get purple?" |
| **Motivation erosion** | Training feels like a grind |
| **Technical gaps** | Know enough to know what they don't know |

### What Would Make Them Quit

| Reason | What They Need |
|--------|----------------|
| "I stopped improving" | Progress visualization proves otherwise |
| "The grind got boring" | Novelty, technique breadth visibility |
| "I got injured and never came back" | Injury tracking + return support |
| "My coach didn't notice my progress" | Bridge to coach conversation |

### Messaging Guidelines

**DO say:**
- "Your guard retention has improved 23% over 3 months. That's real progress even when it doesn't feel like it."
- "Blue belt plateau typically lasts 18-36 months. You're at month 14. This is the hardest part."
- "You've logged 47 sessions focused on half guard. Something is building."

**DON'T say:**
- "You're almost ready for purple!" (outcome focus, creates anxiety)
- "Keep up the great work!" (too vague)
- "Other blue belts at your level typically..." (peer comparison)

### Success Metrics

| Metric | Target |
|--------|--------|
| 90-day retention | >70% |
| Process goals set | >60% of users |
| Coach Share usage | >30% |

---

# SECONDARY PERSONAS

---

## 4. The Newcomer (Female): Maya Okonkwo

**ID:** `newcomer-female`
**Belt:** White, 0-1 stripes
**Time Training:** 0-6 months
**Training Frequency:** 2-3x/week

> "I love this. But sometimes I wonder if there's a place here for me."

### Demographics

| Attribute | Value |
|-----------|-------|
| Age | 28 |
| % of practitioners | 10% (but growing 70%—fastest segment) |
| Why she started | Self-defense + mental challenge |

### What Makes Her Experience Different

Maya shares Alex's core journey but faces additional challenges.

**The Minority Experience:**
| Experience | Impact |
|------------|--------|
| Visibility | She's noticed; mistakes feel more public |
| Representation questions | "Am I here as a novelty?" |
| Unconscious accommodation | Partners go too easy (or compensate by going too hard) |
| Proving ground | Feels she must work harder to be seen as legitimate |

**The Size/Strength Reality:**
Maya is 5'5", 135 lbs. Most training partners are 5'10"+, 180+ lbs.
- Techniques that rely on strength don't work
- She learns *proper* technique faster (strength isn't an option)
- Her "wins" look different—survival, escapes, positional control
- When she submits someone bigger, it's unambiguously technique

**The "Going Easy" Problem:**
> "I can't tell if I actually escaped or if he let me escape. That's the worst feeling—not knowing if any of this is real."

### Her Unique Obstacles

| Obstacle | Manifestation |
|----------|---------------|
| **Self-efficacy ambiguity** | "Did I earn that, or did he let me?" |
| **Social isolation** | Few or no other women at gym |
| **Belonging uncertainty** | "Is there a place here for me?" |
| **Feedback quality** | Patronizing praise vs honest assessment |

### Key Insight

For Maya, **relatedness** determines whether she stays. Finding one other woman to train with, or one trusted partner who gives honest feedback, changes everything.

### What Would Make Her Quit

| Reason | What She Needs |
|--------|----------------|
| "I never felt like I fit in" | Community connection, partner tracking |
| "I couldn't tell if I was improving" | Size-normalized progress visualization |
| "The app felt like it was made for men" | Inclusive language, relevant content |

### Messaging Guidelines

**DO say:**
- "You're learning technique without being able to rely on size. That's an advantage."
- "Progress against partners 50 lbs heavier looks different. You're building something real."
- "Surviving 3 minutes against someone much larger IS progress."

**DON'T say:**
- "Great job keeping up with the guys!" (patronizing)
- "Women in BJJ are so inspiring!" (othering)
- Generic encouragement without technical specifics

### Success Metrics

| Metric | Target |
|--------|--------|
| 30-day retention | >55% |
| Training partner tracking usage | >30% |

---

# TERTIARY PERSONAS

---

## 5. The Specialist: Sofia Rodriguez

**ID:** `specialist`
**Belt:** Purple, 1-2 stripes
**Time Training:** 4-7 years
**Training Frequency:** 3-5x/week

> "I know what I like. Time to master it."

### What They're Experiencing

Purple belts know all the techniques a black belt knows—the difference is experience.

**Characteristics:**
- Developing personal style ("I'm a half guard player who attacks with kimuras")
- Strategic thinking: "When and why" over "what"
- Teaching lower belts; running fundamentals classes
- Willing to lose while developing new aspects

### Their Obstacles

| Obstacle | Manifestation |
|----------|---------------|
| **Depth vs breadth** | Temptation to keep collecting techniques vs mastering systems |
| **Teaching integration** | New responsibility; often running fundamentals |
| **Competition pressure** | Expected to compete; medals matter more |

### Messaging Guidelines

**Tone:** Peer-level, analytical. They don't need encouragement—they need insight.

---

## 6. The Finisher: Daniel Reyes

**ID:** `finisher`
**Belt:** Brown, 2-3 stripes
**Time Training:** 8-12 years
**Training Frequency:** 4-5x/week

> "How do I close the gaps? How do I become the practitioner I want to be?"

### What They're Experiencing

Daniel has been training for 10 years. His techniques work on almost everybody. Now it's about closing gaps, refining details, and building legacy through teaching.

**Characteristics:**
- Mastery mindset: making existing techniques perfect
- Teaching integration: role model for entire academy
- Detail orientation: micro-adjustments, economy of motion
- Legacy thinking: "What will my black belt mean?"

### Their Obstacles

| Obstacle | Manifestation |
|----------|---------------|
| **Complacency** | "I'm good enough"—stops pushing |
| **Gap blindness** | Hard to see own weaknesses after 10 years |
| **Promotion anxiety** | "Am I ready? Does my coach think I'm ready?" |

### Messaging Guidelines

**Tone:** Peer-level, legacy-focused. Acknowledge the journey. Support refinement.

---

# Cross-Persona Reference

## Risk Detection Signals by Persona

| Persona | High Risk Signal | Response Tone |
|---------|------------------|---------------|
| `newcomer` | 7-day gap | Warm, welcoming: "We noticed you've been away..." |
| `survivor` | 10-day gap | Supportive: "Life happens. Your progress is still there." |
| `plateau-warrior` | 14-day gap + negative sentiment | Normalizing: "Plateaus are hard. This is part of the path." |
| `newcomer-female` | 7-day gap + no partners logged | Connection-focused: invite to connect |
| `specialist` | 21-day gap | Light touch: "When you're ready, your data is here." |
| `finisher` | 30-day gap | Minimal: they know what they're doing |

## Content Tone by Persona

| Persona | Tone | Vocabulary Level | Encouragement Style |
|---------|------|------------------|---------------------|
| `newcomer` | Warm, supportive | Basic BJJ terms | Normalize struggle |
| `survivor` | Validating | Intermediate | Celebrate consistency |
| `plateau-warrior` | Neutral, factual | Full technical | Data over cheerleading |
| `newcomer-female` | Warm, specific | Basic BJJ terms | Normalize + size context |
| `specialist` | Peer-level | Advanced | Minimal—they're self-motivated |
| `finisher` | Peer-level | Advanced | Legacy acknowledgment |

## Primary Metric by Persona

| Persona | Primary Dashboard Metric |
|---------|-------------------------|
| `newcomer` | Session count |
| `survivor` | Session streak |
| `plateau-warrior` | Technique breadth / Progress over time |
| `newcomer-female` | Session count + Training partners |
| `specialist` | Sparring patterns / Teaching hours |
| `finisher` | Gap closure / Teaching portfolio |

---

# Research Foundation

## Key Statistics

| Statistic | Value | Implication |
|-----------|-------|-------------|
| White belt 6-month attrition | 70-90% | Newcomer retention is highest-impact opportunity |
| Blue belt → black belt | 99% never make it | Blue belt is the critical retention crisis |
| Process goal effect size | d=1.36 | 10x more effective than outcome goals (d=0.09) |
| Habit formation | 66 days average | First 2 months are critical |
| Injury rate (lifetime) | 91% | #1 quit reason—must address |
| Coach-athlete relationship | β=0.556 | Strong predictor of performance |
| Staff touchpoints | 2/month = 33% churn reduction | Connection features matter |
| Female practitioner growth | 70% | Fastest-growing segment |

## Documents Referenced

| Document | Location |
|----------|----------|
| First Principles | `/docs/FIRST_PRINCIPLES.md` |
| Belt Progression Psychology | `/docs/research/TOMO_Belt_Progression_Requirements_Reference.md` |
| Sports Psychology Research | `/docs/research/sports-psychology-research.md` |
| Journaling Research | `/docs/research/journaling-and-accountability-research.md` |
| Features Specification | `/docs/product/FEATURES.md` |

---

*Last updated: January 2026*
*Review quarterly based on user research and behavioral data.*
