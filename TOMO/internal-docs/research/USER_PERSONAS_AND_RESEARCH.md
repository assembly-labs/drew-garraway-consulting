# User Personas & Research Synthesis

## Executive Summary

**The Core Paradox:** Our users are *highly motivated* to improve at BJJ—they show up, get choked, and come back. Yet at the *exact moment* we need their data (post-training), they are physically depleted, cognitively impaired, and emotionally vulnerable.

This document synthesizes internal research with market data to create actionable personas that inform every design decision. The goal: **make logging feel like less effort than skipping it.**

---

## Market Context

### BJJ Practitioner Demographics (2024-2025)

| Metric | Data | Source |
|--------|------|--------|
| Global practitioners | ~6 million | [Gitnux](https://gitnux.org/jiu-jitsu-statistics/) |
| US practitioners | 500K–1M | [Grappler's Graveyard](https://grapplersgraveyard.com/how-many-people-train-jiu-jitsu/) |
| Gender split | 90% male, 10% female (growing 70%) | [Gold BJJ](https://goldbjj.com/blogs/roll/statistics) |
| Average starting age | 29 years old | [BJJ Doc](https://bjjdoc.com/2025/04/12/new-stats-show-an-average-age-when-people-get-promoted-to-bjj-black-belt-as-39-years-old/) |
| Average practitioner profile | 30yo male, blue belt, 3.5 years training, 6 hrs/week | [WifiTalents](https://wifitalents.com/jiu-jitsu-statistics/) |
| Average age at black belt | 39 years old | [BJJ Doc](https://bjjdoc.com/2025/04/12/new-stats-show-an-average-age-when-people-get-promoted-to-bjj-black-belt-as-39-years-old/) |
| Time to black belt | 12-15 years average | [Gold BJJ](https://goldbjj.com/blogs/roll/statistics) |

### Dropout Crisis

| Stage | Dropout Rate | Implication |
|-------|--------------|-------------|
| First 6 months | 80-90% quit | Critical intervention window |
| White belt → Blue belt | ~80% never make it | First promotion is make-or-break |
| Blue belt | 60-70% quit after promotion | "Blue belt blues" is real |
| First 90 days of app use | 70% abandon fitness apps | UX friction, not motivation |
| Lifetime to black belt | Only 0.5-1% succeed | This is a long, hard journey |

**Source:** [BJJ Fanatics](https://bjjfanatics.com/blogs/news/what-percentage-of-bjj-white-belts-quit), [Heavy BJJ](https://heavybjj.com/this-is-why-majority-of-people-will-quit-brazilian-jiu-jitsu-at-white-and-blue-belt/)

### The Post-Training Cognitive State

Research confirms what every practitioner knows intuitively:

> "Mental fatigue has a negative effect on various sports skills of high-level athletes, including their technical and **decision-making skills**."
> — [PMC Mental Fatigue Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11673376/)

> "While the brain accounts for about 2% of body weight, it consumes over **20% of the body's energy** at rest. That number **increases** when attention is sustained, emotions are being regulated, or decisions are being made rapidly."
> — [Aypex Move](https://www.aypexmove.com/post/cognitive-load-and-athletic-fatigue-when-thinking-drains-the-body)

**Key insight:** After 60-90 minutes of physically and mentally demanding training, our users have depleted glucose, elevated cortisol, and diminished executive function. Asking them to fill out a form is asking them to do *more work* when they have nothing left.

---

## The User State Matrix

Before diving into personas, we must understand that every persona exists in multiple *states*. The same person behaves completely differently based on context.

### States Our Users Cycle Through

| State | Physical | Cognitive | Emotional | Design Implication |
|-------|----------|-----------|-----------|-------------------|
| **Pre-Training** | Energized, warming up | Focused, anticipating | Motivated, sometimes anxious | Can handle complexity |
| **During Training** | Engaged, sweating | Flow state or struggle | Competitive, learning | No app interaction |
| **Post-Training (0-5 min)** | Gasping, sweaty | Depleted, foggy | High (win) or low (humbled) | **CRITICAL CAPTURE WINDOW** |
| **Post-Training (5-30 min)** | Cooling down, showering | Slowly recovering | Reflective, social | Secondary capture window |
| **Post-Training (30+ min)** | Normal | Normal | Neutral, memory fading | Too late—details lost |
| **Evening/Next Day** | Sore, recovering | Normal | Disconnected from session | Review mode, not capture |

### The 90-Second Window

Internal research indicates users have approximately **90 seconds of willingness** to log post-training. After that, friction wins.

**If logging takes >90 seconds → User skips it → Data lost → Progress invisible → Motivation drops → Churn risk increases**

---

## Primary Personas

> **Canonical Source:** `/internal-docs/personas/PERSONA_PROFILES.md`
>
> The detailed persona profiles—including full demographics, psychology, journal voice samples, and TypeScript mock data—live in the personas folder. This section provides a summary for quick reference.

### Persona Overview

| Key | Belt | Archetype | Name | Age | Occupation | Status | Risk |
|-----|------|-----------|------|-----|------------|--------|------|
| `white-excelling` | White (3 stripes) | The Natural | Jake Thompson | 26 | Software Developer | Thriving | Low |
| `white-at-risk` | White (2 stripes) | The Late Starter | David Morrison | 52 | IT Manager | Struggling | High |
| `blue-excelling` | Blue (2 stripes) | The Dedicated Hobbyist | Marcus Chen | 34 | Marketing Manager | Progressing | Moderate |
| `blue-at-risk` | Blue (1 stripe) | The Fading Fire | Ryan Torres | 31 | Financial Analyst | Declining | Critical |
| `purple-average` | Purple (1 stripe) | The Grinder | Sofia Rodriguez | 28 | Physical Therapist | Stable | Low |
| `brown-average` | Brown (2 stripes) | The Veteran | Elena Kim | 38 | CrossFit Gym Owner | Refined | Very Low |

---

### Persona 1: Jake Thompson — "The Natural" (White, Excelling)

**The athletic newcomer who's progressing fast.**

- **Age:** 26 | **Location:** Austin, TX | **Belt:** White (3 stripes, 8 months)
- **Background:** College wrestler (D3), recreational CrossFit
- **Training:** 3-4x/week, 87 sessions logged, 12-session current streak
- **Mindset:** Confident but humble. Wrestling gives him an advantage but he knows he needs to develop guard.
- **Risk:** Low — highly engaged, strong consistency
- **Design needs:** Competition tracking, guard development focus, pacing reminders

---

### Persona 2: David Morrison — "The Late Starter" (White, At-Risk)

**The 50+ crowd discovering BJJ as a midlife pursuit.**

- **Age:** 52 | **Location:** Portland, OR | **Belt:** White (2 stripes, 18 months)
- **Background:** IT Manager, recreational basketball in 30s
- **Training:** 1-2x/week (declining), 47 sessions logged, 9 days since last session
- **Mindset:** Loves BJJ but constantly questions if he belongs. Recovery takes 2-3 days.
- **Risk:** High — multiple risk factors (age, injuries, declining attendance)
- **Design needs:** Large touch targets, injury tracking, consistency celebration, self-comparisons only

---

### Persona 3: Marcus Chen — "The Dedicated Hobbyist" (Blue, Excelling)

**The backbone of any gym. Balancing life with training.**

- **Age:** 34 | **Location:** Denver, CO | **Belt:** Blue (2 stripes, 10 months at blue)
- **Background:** Marketing Manager, high school soccer
- **Training:** 2-3x/week, 247 sessions logged, consistent despite family
- **Mindset:** Working through "Blue Belt Blues" with healthy perspective. Married with one kid.
- **Risk:** Moderate — normal blue belt plateau, coping well
- **Design needs:** Progress visualization for spouse, technique development focus, work-life balance support

---

### Persona 4: Ryan Torres — "The Fading Fire" (Blue, At-Risk)

**The blue belt who's slipping away.**

- **Age:** 31 | **Location:** Chicago, IL | **Belt:** Blue (1 stripe, 14 months at blue)
- **Background:** Financial Analyst, college rugby
- **Training:** Was 4x/week, now 1x or less. 21 days since last session.
- **Mindset:** Started with fire, now questioning everything. Work stress + recent breakup.
- **Risk:** Critical — 75% training frequency drop, imposter syndrome, isolation
- **Design needs:** Gentle re-engagement, no shame messaging, one-tap check-in option

---

### Persona 5: Sofia Rodriguez — "The Grinder" (Purple, Average)

**The systems thinker building a complete game.**

- **Age:** 28 | **Location:** San Diego, CA | **Belt:** Purple (1 stripe, 8 months at purple)
- **Background:** Physical Therapist, high school volleyball
- **Training:** 4-5x/week, 612 sessions logged, 15-session current streak
- **Mindset:** No longer chasing techniques—building interconnected systems. Starting to teach.
- **Risk:** Low — deeply committed, past the danger zone
- **Design needs:** Pattern analysis, teaching session tracking, competition prep mode

---

### Persona 6: Elena Kim — "The Veteran" (Brown, Average)

**The teacher and mentor preparing for black belt.**

- **Age:** 38 | **Location:** Seattle, WA | **Belt:** Brown (2 stripes, 18 months at brown)
- **Background:** CrossFit gym owner, college judo
- **Training:** 3-4x/week, 1,247 sessions logged, significant teaching time
- **Mindset:** In refinement mode. Thinking about legacy and what black belt means.
- **Risk:** Very Low — trains for life, found sustainable rhythm
- **Design needs:** Teaching session tracking, recovery/body awareness, mentee progress visibility

---

## Secondary Personas (Brief Profiles)

### "The Coach's Kid" — Tyler, 16
- **Context:** Trains because parents own the gym
- **Challenge:** Naturally talented but lacks intrinsic motivation
- **Design need:** Gamification might actually work here (youth segment)
- **Key insight:** Completely different UX needed for under-18

### "The Return Visitor" — James, 38
- **Context:** Trained 5 years ago, quit, now returning
- **Challenge:** Ego—he "knows" techniques but his body forgot
- **Design need:** Acknowledge prior experience while tracking new journey
- **Key insight:** "Returning white belt" is a unique psychological state

### "The Cross-Trainer" — Amir, 29
- **Context:** MMA fighter adding BJJ to his arsenal
- **Challenge:** Doesn't care about belts—cares about cage performance
- **Design need:** Different success metrics (MMA-relevant positions)
- **Key insight:** "Belt" is less meaningful to this segment

---

## The Exhausted User: A State Persona

Beyond who our users ARE, we must design for HOW they are at the critical moment.

### "The Post-Training State"

**This is everyone—Marcus, Sofia, David, Rachel—at 8:15pm, standing in the gym parking lot.**

#### Physical State
- Heart rate elevated (100-140 BPM)
- Core temperature elevated
- Sweating, possibly still in gi/rashguard
- Hands may be cramped from gripping
- Fingers swollen, grip strength depleted
- Potentially minor injuries (tweaked fingers, sore neck, mat burn)
- Dehydrated, electrolyte depleted
- Standing or leaning, not seated comfortably

#### Cognitive State
- Executive function impaired by 20-40% (research-backed)
- Working memory reduced (can't hold multi-step instructions)
- Decision fatigue at peak
- Details from class already fading
- Attention span: 30-60 seconds
- Reading comprehension reduced
- Mental bandwidth: ONE THING at a time

#### Emotional State
- **If rolled well:** Euphoric, confident, talkative
- **If rolled poorly:** Deflated, self-critical, quiet
- **Either way:** Tired of thinking, wants to be done
- Wants validation, not more questions
- Sensitive to criticism (even perceived)
- Low tolerance for friction

#### Environmental Context
- Possibly in loud gym with music/chatter
- May be walking to car
- May have gym bag on shoulder
- May be checking messages from family
- May have poor cellular signal
- May be in poorly lit parking lot
- Definitely wants to leave soon

### Design Mandates for This State

| Challenge | Mandate |
|-----------|---------|
| Swollen, clumsy fingers | Touch targets minimum 56px (ideally 80px) |
| Depleted decision-making | ONE question at a time, max 3 total |
| Fading memory | Capture essentials first, details optional |
| Short attention span | Complete flow in <90 seconds |
| Reduced reading ability | Icons > words. Large text. High contrast. |
| Emotional sensitivity | Neutral-positive feedback only |
| Environmental noise | Voice input must handle background sounds |
| Wanting to leave | Every screen must feel like progress |

---

## Key Moments Map

### The User Journey with Emotional/Physical Overlay

```
BEFORE CLASS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical:  ██████░░░░ Normal
Cognitive: ██████████ High capacity
Emotional: ████████░░ Anticipation, maybe anxiety

Opportunity: Show "last session" review. Preview what to work on.

DURING CLASS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical:  ██████████ Peak exertion
Cognitive: ██████████ Flow state or survival mode
Emotional: ██████████ Full engagement

Opportunity: None. Phone is in bag. User is training.

0-5 MINUTES POST-TRAINING ⚠️ CRITICAL WINDOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical:  ██████████ Exhausted, sweaty, hot
Cognitive: ████░░░░░░ 40% impaired
Emotional: ███████░░░ Variable (high or low based on session)

Opportunity: VOICE LOG. Capture essentials in 60 seconds.
Challenge: They want to leave. Every second counts.
Design: ONE tap to start. Talk. ONE tap to save. Done.

5-30 MINUTES POST-TRAINING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical:  ██████░░░░ Cooling down, changing
Cognitive: ██████░░░░ Recovering
Emotional: ██████░░░░ Reflective, social

Opportunity: Secondary capture. Edit/add details.
Challenge: Still has limited patience.
Design: Optional "add more" prompt, not required.

30+ MINUTES POST-TRAINING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical:  ████░░░░░░ Normal (maybe sore)
Cognitive: ████████░░ Recovering
Emotional: ████░░░░░░ Disconnected from session

Opportunity: Review what was captured. Feels good to see.
Challenge: Details are lost. Can't add what they don't remember.
Design: Show AI summary. Let them feel proud of logging.

NEXT DAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical:  ██░░░░░░░░ Sore, recovering
Cognitive: ██████████ Normal
Emotional: ██████░░░░ Neutral

Opportunity: Technique review before next class.
Challenge: They're at work. Limited time.
Design: Quick reference cards. 2-min review sessions.
```

---

## Design Principles Derived from Research

### 1. The 90-Second Rule
Every logging flow must complete in under 90 seconds. If it can't, it won't be used.

### 2. Talk, Don't Type
Voice-first input is mandatory for primary capture. Typing is for editing, not creating.

### 3. One Question at a Time
Never present more than one decision simultaneously. Tired brains can't parallel process.

### 4. Capture Essentials, Details Optional
**Tier 1 (Must):** Date, type (gi/nogi), duration
**Tier 2 (Should):** Techniques, sparring rounds
**Tier 3 (Could):** Partners, energy, mood, notes
Always capture Tier 1. Make Tier 2+ optional.

### 5. Progress, Not Perfection
Show users their consistency wins even when data is incomplete. "You logged 12 sessions this month" matters more than perfect technique tracking.

### 6. Celebrate the Grind
Acknowledge the hard thing they just did. "90 minutes on the mat. That's commitment." before asking for anything.

### 7. Fat Fingers, Big Targets
Minimum 56px touch targets. Primary actions 80px. Swollen, tired hands can't hit small buttons.

### 8. High Contrast, Large Text
Post-training vision is impaired. Dark mode default. High contrast. 16px minimum text.

### 9. Offline-First
Many gyms have poor signal. The app must work completely offline and sync later.

### 10. No Shame in Gaps
If they miss a day, don't punish them. "Welcome back" beats "You broke your streak."

---

## Persona-Driven Conversation Design

### Overview

Our AI outputs, prompts, and feedback messages should be **contextually personalized** based on user demographics and behavior. The same achievement means different things to different people. A 47-year-old training 2x/week is crushing it. A 27-year-old competitor training 2x/week may be slipping.

**Key Principle:** Celebrate relative progress, not absolute metrics.

---

### Personalized Feedback Framework

#### Training Frequency Benchmarks (By Age/Context)

| Age Group | "Solid" | "Strong" | "Elite" | Peer Comparison Base |
|-----------|---------|----------|---------|---------------------|
| 18-25 | 3x/week | 4x/week | 5-6x/week | Avg: 3.5x/week |
| 26-35 | 2-3x/week | 3-4x/week | 4-5x/week | Avg: 3x/week |
| 36-45 | 2x/week | 3x/week | 4x/week | Avg: 2.5x/week |
| 46-55 | 2x/week | 2-3x/week | 3x/week | Avg: 2x/week |
| 56+ | 1-2x/week | 2x/week | 3x/week | Avg: 1.5x/week |

**Competitor modifier:** +1-2 sessions expected across all age groups

#### Example Personalized Messages

**For David (47yo, Late Starter, 2x/week):**
```
"2 sessions this week. That's more consistent than 65% of
practitioners your age. Recovery matters—you're doing this right."
```

**For Marcus (34yo, Hobbyist, 3x/week):**
```
"3 sessions this week puts you in the top 40% of practitioners
balancing work and family. Solid commitment."
```

**For Sofia (27yo, Competitor, 4x/week):**
```
"4 sessions this week. On track for competition prep.
Consider adding an open mat for extra rounds."
```

**For Rachel (31yo, Skeptic, first week logging):**
```
"3 sessions captured. That's your baseline.
Let's see where you are in a month."
```

---

### Streak & Consistency Messaging

#### Streak Philosophy
- **Never punish gaps.** Life happens.
- **Celebrate consistency over intensity.** Showing up matters most.
- **Frame breaks as normal,** not failures.

#### Message Templates by Scenario

**Active Streak (Building):**
```
Week 2:  "Two weeks straight. Momentum is building."
Week 4:  "A full month on the mat. That's when habits stick."
Week 8:  "8 weeks. Most people quit by now. You didn't."
Week 12: "3 months consistent. This is who you are now."
```

**Streak Broken (Re-engagement):**
```
After 3-7 days:
"It's been a few days. Ready to get back?
Your [X] session streak was strong—let's build another."

After 1-2 weeks:
"Hey, it's been a minute. Everything okay?
One session resets everything. No pressure."

After 2-4 weeks (gentle intervention):
"We noticed you haven't trained in a while.
Life gets busy—that's okay. When you're ready, we're here."

After 4+ weeks (win-back):
"It's been over a month. If you're stepping away, that's valid.
If you want back in, your history is waiting. No judgment."
```

---

### Progress Comparisons (Contextual)

#### Belt Progression Context

**For younger practitioners (under 30):**
```
"18 months at blue belt. Average is 2-3 years.
You're tracking well—purple is coming."
```

**For older practitioners (over 40):**
```
"14 months at white belt. For practitioners who started
after 40, average time to blue is 18-24 months.
You're right on track."
```

**For competitors:**
```
"2 years at purple. Competition-focused practitioners
often spend 3-4 years here—depth over speed."
```

#### Sparring Performance Context

**After a tough session:**
```
"Rough rounds happen. You logged 5 today—
that's 5 more than the people who stayed home."
```

**Pattern detected (recurring struggle):**
```
"You've noted 'guard passing' as a struggle
in 4 of your last 6 sessions. Worth focusing on?"
```

**Positive pattern:**
```
"Triangle setups mentioned 3x this month.
Looks like it's becoming a go-to. Nice."
```

---

### Re-engagement Triggers & Interventions

#### Disengagement Signals

| Signal | Trigger | Intervention Level |
|--------|---------|-------------------|
| Missed 1 session vs. normal | 3 days past usual | None (normal variance) |
| Missed 2+ sessions | 7 days past usual | Gentle check-in |
| Training frequency dropped 50%+ | 2-week rolling avg | Supportive message |
| Zero sessions logged | 14+ days | Win-back sequence |
| App opened but no log | 3+ occurrences | Simplify CTA |

#### Intervention Messages by Persona Type

**For "The Grinder" (Competitor):**
```
"Training volume is down 40% from last month.
Competition in 6 weeks—intentional deload or life chaos?"
```

**For "The Dedicated Hobbyist":**
```
"Missed your usual Tuesday session.
Family stuff? Work crunch? Either way,
Thursday's class is still on the schedule."
```

**For "The Late Starter":**
```
"No sessions logged this week. If you're nursing an injury,
rest is training too. If you're just busy, one class
keeps the habit alive."
```

**For "The Skeptic":**
```
[Minimal intervention—they'll find pushy messages annoying]
"It's been a while. We're here when you're ready."
```

---

### Injury-Aware Messaging

#### When User Logs Injury

```
"Noted: [shoulder tweak]. Smart to track it.
Monitor it over next 2-3 sessions. If it persists,
consider letting coach know or seeing a physio."
```

#### Return After Logged Injury

```
"First session back after [shoulder] issue.
How did it feel? [Better / Same / Worse]"
```

#### High-Risk Patterns

```
"This is your 3rd shoulder-related note in 2 months.
Recurring issues often have root causes—worth investigating?"
```

---

### Celebration Calibration

#### Principle: Match Intensity to Achievement

| Achievement | Celebration Level | Example |
|-------------|-------------------|---------|
| First session logged | High | "First one in the books. That's the hardest step." |
| 10 sessions | Medium | "10 sessions logged. You're building something." |
| 50 sessions | High | "50 sessions. Most people never get here." |
| 100 sessions | Very High | "Triple digits. You're a lifer now." |
| 1-year anniversary | Very High | "One year on the mat. That's rarer than you think." |
| Belt promotion | Very High | "Purple belt. Years of work. Earned, not given." |

#### Anti-Patterns (What NOT to Do)

❌ "Amazing job logging today!!!!"  *(too much for daily action)*
❌ "You're CRUSHING it!!!!"  *(empty hype language)*
❌ "Streak broken :("  *(shame-based)*
❌ "You're behind your goals"  *(discouraging)*
❌ "Only 2 sessions this week?"  *(judgmental)*

---

### Implementation Notes for Future Features

1. **User Profile Enrichment:**
   - Capture age at signup (for peer comparison cohorts)
   - Infer training goals (competitor vs. hobbyist) from behavior
   - Track typical training days/times for anomaly detection

2. **Message Personalization Engine:**
   - Template system with persona-specific variants
   - Dynamic benchmark insertion (percentile calculations)
   - Tone adjustment based on user preference signals

3. **A/B Testing Framework:**
   - Test celebration intensity levels
   - Test re-engagement message timing
   - Track which messages correlate with return visits

4. **Coach Integration Considerations:**
   - Flag disengaged students to coaches (with user consent)
   - Let coaches customize intervention messages
   - Aggregate disengagement trends for gym owners

5. **Privacy Considerations:**
   - Age-based personalization should be opt-in or inferred
   - Never share individual data in peer comparisons
   - Allow users to disable motivational messages

---

## Appendix: Research Sources

### Market Demographics
- [Gold BJJ Statistics](https://goldbjj.com/blogs/roll/statistics)
- [WifiTalents BJJ Statistics 2025](https://wifitalents.com/jiu-jitsu-statistics/)
- [BJJ Doc - Belt Progression Age Data](https://bjjdoc.com/2025/04/12/new-stats-show-an-average-age-when-people-get-promoted-to-bjj-black-belt-as-39-years-old/)
- [Gitnux BJJ Statistics](https://gitnux.org/jiu-jitsu-statistics/)
- [Grappler's Graveyard - How Many Train](https://grapplersgraveyard.com/how-many-people-train-jiu-jitsu/)

### Dropout & Retention
- [BJJ Fanatics - White Belt Quit Rate](https://bjjfanatics.com/blogs/news/what-percentage-of-bjj-white-belts-quit)
- [Heavy BJJ - Why People Quit](https://heavybjj.com/this-is-why-majority-of-people-will-quit-brazilian-jiu-jitsu-at-white-and-blue-belt/)
- [White Belt Club - Why People Quit](https://www.whitebeltclub.com/articles/why-do-most-people-quit-bjj)

### Cognitive Fatigue Research
- [PMC - Mental Fatigue and Sports Performance](https://pmc.ncbi.nlm.nih.gov/articles/PMC11673376/)
- [Aypex - Cognitive Load and Athletic Fatigue](https://www.aypexmove.com/post/cognitive-load-and-athletic-fatigue-when-thinking-drains-the-body)
- [Journal of Applied Physiology - Mental Fatigue Impairs Performance](https://journals.physiology.org/doi/full/10.1152/japplphysiol.91324.2008)
- [PMC - Monitoring Training Load and Fatigue](https://pmc.ncbi.nlm.nih.gov/articles/PMC4213373/)

### UX for Fatigued Users
- [Toptal - Cognitive Overload UX](https://www.toptal.com/designers/ux/cognitive-overload-burnout-ux)
- [Stormotion - Fitness App UX](https://stormotion.io/blog/fitness-app-ux/)
- [Superside - Health & Fitness App UX Principles](https://www.superside.com/blog/ux-design-principles-fitness-apps)
- [Medium - Design for Fatigue](https://medium.com/@marketing_96275/design-for-fatigue-how-ux-ui-can-combat-digital-burnout-3e1fa6f56b7a)

### Training & Journaling Research
- [Carlos Machado - Power of Journaling](https://www.carlosmachado.net/blog/139969/strategize-to-optimize)
- [BJJ Logbook](https://bjjlogbook.com/)
- [Elite Sports - Training Frequency](https://www.elitesports.com/blogs/news/how-many-days-per-week-should-you-train-bjj)

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: UX Research Synthesis*
