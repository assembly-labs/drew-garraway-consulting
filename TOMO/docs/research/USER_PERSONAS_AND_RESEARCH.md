# User Research Synthesis

> **Market data, cognitive research, and design principles that inform our personas.**
>
> **For persona definitions, see:** `/docs/personas/TOMO_PERSONAS.md`
> **For messaging templates, see:** `/docs/research/MESSAGING_GUIDELINES.md`

---

## Executive Summary

**The Core Paradox:** Our users are *highly motivated* to improve at BJJ—they show up, get choked, and come back. Yet at the *exact moment* we need their data (post-training), they are physically depleted, cognitively impaired, and emotionally vulnerable.

This document synthesizes research that informs our persona definitions and design decisions. The goal: **make logging feel like less effort than skipping it.**

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
| White belt to Blue belt | ~80% never make it | First promotion is make-or-break |
| Blue belt | 60-70% quit after promotion | "Blue belt blues" is real |
| First 90 days of app use | 70% abandon fitness apps | UX friction, not motivation |
| Lifetime to black belt | Only 0.5-1% succeed | This is a long, hard journey |

**Source:** [BJJ Fanatics](https://bjjfanatics.com/blogs/news/what-percentage-of-bjj-white-belts-quit), [Heavy BJJ](https://heavybjj.com/this-is-why-majority-of-people-will-quit-brazilian-jiu-jitsu-at-white-and-blue-belt/)

---

## The Post-Training Cognitive State

Research confirms what every practitioner knows intuitively:

> "Mental fatigue has a negative effect on various sports skills of high-level athletes, including their technical and **decision-making skills**."
> — [PMC Mental Fatigue Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11673376/)

> "While the brain accounts for about 2% of body weight, it consumes over **20% of the body's energy** at rest. That number **increases** when attention is sustained, emotions are being regulated, or decisions are being made rapidly."
> — [Aypex Move](https://www.aypexmove.com/post/cognitive-load-and-athletic-fatigue-when-thinking-drains-the-body)

**Key insight:** After 60-90 minutes of physically and mentally demanding training, our users have depleted glucose, elevated cortisol, and diminished executive function. Asking them to fill out a form is asking them to do *more work* when they have nothing left.

---

## The User State Matrix

Every user exists in multiple *states*. The same person behaves completely differently based on context.

### Context-Aware Design Principle

**The "exhausted user" principle applies ONLY to session logging.** When users browse Stats, Techniques, or Journal pages, they are relaxed and can engage with rich, detailed content.

| App Feature | User State | Time Pressure | Design Approach |
|-------------|------------|---------------|-----------------|
| **Session Logging** | EXHAUSTED | 90 seconds | Minimal friction, voice-first |
| **Stats/Dashboard** | RELAXED | None | Rich visualizations, deep data |
| **Techniques Library** | RELAXED | None | Comprehensive content |
| **Journal/History** | RELAXED | None | Full entries, filtering |
| **Profile/Settings** | RELAXED | Low | Standard forms acceptable |

### The 90-Second Window

Internal research indicates users have approximately **90 seconds of willingness** to log post-training. After that, friction wins.

**If logging takes >90 seconds → User skips it → Data lost → Progress invisible → Motivation drops → Churn risk increases**

---

## The Exhausted User State (Session Logging Only)

> **Note:** This describes user state **only during session logging**—the post-training capture moment. It does NOT apply to browsing modes.

### Physical State

- Heart rate elevated (100-140 BPM)
- Core temperature elevated
- Sweating, possibly still in gi/rashguard
- Hands may be cramped from gripping
- Fingers swollen, grip strength depleted
- Potentially minor injuries (tweaked fingers, sore neck, mat burn)
- Dehydrated, electrolyte depleted
- Standing or leaning, not seated comfortably

### Cognitive State

- Executive function impaired by 20-40% (research-backed)
- Working memory reduced (can't hold multi-step instructions)
- Decision fatigue at peak
- Details from class already fading
- Attention span: 30-60 seconds
- Reading comprehension reduced
- Mental bandwidth: ONE THING at a time

### Emotional State

- **If rolled well:** Euphoric, confident, talkative
- **If rolled poorly:** Deflated, self-critical, quiet
- **Either way:** Tired of thinking, wants to be done
- Wants validation, not more questions
- Sensitive to criticism (even perceived)
- Low tolerance for friction

### Environmental Context

- Possibly in loud gym with music/chatter
- May be walking to car
- May have gym bag on shoulder
- May be checking messages from family
- May have poor cellular signal
- May be in poorly lit parking lot
- Definitely wants to leave soon

---

## Design Mandates by Context

### Session Logging (Exhausted User)

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

### Browse Mode (Relaxed User)

| Principle | Rationale |
|-----------|-----------|
| Rich data welcome | Users are curious and engaged |
| Dense information OK | Multiple sections, expandable details appropriate |
| Standard touch targets | 44px minimum is fine |
| Encourage exploration | Deep hierarchies enhance the experience |
| Long-form content appropriate | Coaching text and analysis are valued |

### Universal Principles

| Principle | Rationale |
|-----------|-----------|
| Progress, not perfection | Show consistency wins even when data is incomplete |
| No shame in gaps | "Welcome back" beats "You broke your streak" |
| High contrast, large text | Dark mode default. 16px minimum. |
| Offline-first | Many gyms have poor signal |

---

## Data Capture Tiers

For session logging, prioritize what we capture:

| Tier | Data | Priority |
|------|------|----------|
| **Tier 1 (Must)** | Date, type (gi/nogi), duration | Always capture |
| **Tier 2 (Should)** | Techniques, sparring rounds | Ask if time allows |
| **Tier 3 (Could)** | Partners, energy, mood, notes | Optional enrichment |

---

## Research Sources

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

## Related Documents

| Document | Purpose |
|----------|---------|
| `/docs/personas/TOMO_PERSONAS.md` | Canonical persona definitions |
| `/docs/research/MESSAGING_GUIDELINES.md` | Personalized messaging templates |
| `/docs/research/TOMO_Belt_Progression_Requirements_Reference.md` | Belt psychology deep dive |
| `/docs/research/sports-psychology-research.md` | Sports psychology research |
| `/docs/research/journaling-and-accountability-research.md` | Journaling efficacy research |
| `/docs/FIRST_PRINCIPLES.md` | Product first principles |
| `/docs/product/FEATURES.md` | Feature specifications |

---

*Document Version: 2.0*
*Last Updated: January 2026*
*Restructured to remove persona definitions (now in TOMO_PERSONAS.md)*
