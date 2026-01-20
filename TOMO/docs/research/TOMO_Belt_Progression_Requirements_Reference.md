# TOMO Belt Progression Requirements: Developer Reference

**Purpose:** This document provides the definitive reference for building belt progression features in TOMO. It answers: What does each belt level need to master to progress? What should we track? How do coaches actually evaluate readiness?

**Target Audience:** AI coding agents (Claude Code, Cursor, etc.), iOS developers, product managers

---

## Core Insight for App Design

BJJ belt progression has **no standardized curriculum**—coaches have complete discretion. However, patterns are consistent across academies:

- **Objective criteria:** Attendance, technique breadth/depth, sparring performance
- **Subjective criteria:** Attitude, ego management, being a good training partner
- **Critical finding:** Coaches rank mindset/attitude as MORE IMPORTANT than technical skill

**TOMO's role:** Support coach judgment with structured data and reflection tools. Never attempt to automate promotion decisions.

---

## White Belt → Blue Belt (1-2 years typical)

### What They Must Master

**Primary Focus: Survival (80% defense / 20% offense)**

| Category | Required Competencies |
|----------|----------------------|
| **Escapes** | 1+ escape from: mount, side control, back control |
| **Guard** | Understand closed guard; basic retention |
| **Submissions** | Recognize when they're in danger; tap early |
| **Movement** | Bridge, hip escape (shrimp), technical standup, breakfalls |
| **Sparring** | Survive progressively longer against blue belts without panic |
| **Mindset** | Control ego; accept constant tapping; show consistent attendance |

**Key Principle:** Roger Gracie's approach — "I first made it almost impossible for anybody to tap me out" before focusing on offense.

### Psychological Challenges

- **Overwhelm:** Processing massive information under physical duress
- **Ego management:** Being submitted 10+ times per session by everyone
- **Habit formation:** First 6 months = highest dropout risk (70-90% attrition)
- **Fear response:** Learning to stay calm while in danger positions

### What Indicates Readiness for Blue Belt

- Can escape from all major positions with at least one technique
- Understands positional hierarchy (what's better/worse)
- Shows position awareness during rolls (knows where they are)
- Demonstrates controlled ego and calmness under pressure
- Maintains consistent attendance over 12-24 months
- Can survive extended rounds without panic or injury-causing behavior

### TOMO Features for White Belts

**Track:**
- Session attendance and consistency streaks
- Survival time in bad positions (trending upward over time)
- Fundamental movement competency self-ratings
- Position recognition accuracy ("I was in mount bottom" vs confused)
- Escape success rates from major positions

**Support:**
- Small win celebrations ("Survived mount 30 seconds longer than last month")
- Habit formation prompts (reminders after 2+ days without training)
- Overwhelm management through progressive disclosure
- Emergency escape technique quick reference
- Community connection features (find training partners at similar level)

**Avoid:**
- Comparison to other white belts (toxic during ego management phase)
- Offensive technique pressure (they're not ready yet)
- Complex analytics (they can't process this yet)

---

## Blue Belt → Purple Belt (2-4 years typical)

### What They Must Master

**Primary Focus: Breadth (60% defense / 40% offense)**

| Category | Required Competencies |
|----------|----------------------|
| **Guard (bottom)** | 2+ sweeps from closed/half guard; open guard familiarity (DLR, spider, butterfly basics); solid guard retention |
| **Guard (top)** | 2+ reliable guard passes; can open closed guard safely |
| **Top control** | Maintain mount and side control; apply effective pressure; basic back control with hooks |
| **Escapes** | 2 solid escapes from mount, back, side control; half guard recovery |
| **Submissions** | Armbar (guard + mount), triangle (guard), guillotine variations, kimura/americana, cross collar chokes (gi), RNC mastery |
| **Standing** | 1-2 fundamental takedowns; sprawl defense; safe guard pull |
| **Sparring** | Survive extended rounds with purple belts; competitive with blue belts; control white belts with technique not strength |

**Key Principle:** "Ridiculously difficult to submit" — defense must be rock solid before purple belt.

### Psychological Challenges: The Blue Belt Blues

**The Crisis:** Blue belt has the **highest dropout rate** (99% of blue belts never reach black). Contributing factors:

- **Goal completion:** Blue belt was the target; black belt seems impossibly far
- **Loss of novelty:** Rapid discovery phase ends; progress becomes subtle
- **Performance pressure:** Higher belts stop going easy; white belts actively hunt the new blue
- **Imposter syndrome:** Getting tapped by white belts creates identity crisis
- **Plateau reality:** Blue belt typically lasts 2-4 years—longest time at any belt

### What Indicates Readiness for Purple Belt

- Can attack AND defend from all major positions (minimum 1 viable technique each)
- Has developed specialist submissions that work consistently in sparring
- Demonstrates smooth movement and transitions (not just isolated techniques)
- Shows positional awareness with appropriate decision-making
- Begins teaching lower belts effectively
- Maintained consistent training through the "blue belt blues" plateau

### TOMO Features for Blue Belts

**Track:**
- Technique breadth matrix (positions × techniques with competency ratings)
- Sparring performance trends (position time distribution, submission rates, escape success)
- Training variety (guards explored, submissions attempted, takedowns practiced)
- Teaching activities (helped X white belts this month)
- Motivation indicators (training frequency over time, session notes sentiment)

**Support:**
- **Plateau detection:** Flag when training frequency drops or notes become negative
- **Novelty features:** "Try this technique you haven't drilled yet" suggestions
- **Performance goal templates:** "Escape side control 3x per session" vs belt goals
- **Blue belt blues acknowledgment:** Normalize the plateau; show it's temporary
- **Progress over time:** 3-month comparisons to past self, NOT to peers
- **Game development starter:** "Which guard do you want to specialize in?"

**Avoid:**
- Leaderboards (increases performance pressure during vulnerable phase)
- Belt promotion predictions (creates anxiety around uncontrollable outcome)
- Daily performance metrics (too granular; amplifies natural variation)

---

## Purple Belt → Brown Belt (1.5-3 years typical)

### What They Must Master

**Primary Focus: Systems & Identity (50% defense / 50% offense)**

| Category | Required Competencies |
|----------|----------------------|
| **Advanced guards** | Familiarity with ALL guard variants; specialization in 1-2 guard types; 3+ combination attacks from guard |
| **Guard passing** | Multiple passing systems (pressure, speed, combination); ability to pass at narrow windows; passing strategies vs different guards |
| **Submission mastery** | Specialist in 1+ choke, 1+ armlock, 1+ leglock (straight ankle minimum); triangle from guard/mount/back; submission chains and combinations |
| **Top game** | 3+ submissions from side/mount/back; pressure distribution mastery; transition chains between dominant positions |
| **Escapes** | Prevention-focused (stop bad positions early); extremely efficient escapes; early recognition and response |
| **Teaching** | Can explain techniques clearly; mentor lower belts; identify and correct common mistakes |
| **Game identity** | Developed personal style ("I'm a DLR player who berimbolos" or "I'm a pressure passer") |

**Key Principle:** "Purple belt knows all the techniques a black belt knows—it's the experience that makes the difference."

### Psychological Characteristics

- **Strategic thinking:** Shift from "what to do" to "when and why"
- **Teaching readiness:** Often running fundamentals classes
- **Depth over breadth:** Realizing you have enough techniques; need to master them
- **Relaxed confidence:** Less need to prove yourself constantly
- **Experimentation:** Willing to lose while developing new aspects of game

### What Indicates Readiness for Brown Belt

- Dangerous from any position with offensive threats
- Multiple signature techniques that work on almost everybody
- Complete positional systems with seamless transitions
- Effective teaching ability demonstrated through student progress
- Smooth, fluid movement (economy of motion emerging)
- Consistent performance against brown/black belts in training

### TOMO Features for Purple Belts

**Track:**
- Game specialization depth (guard type, passing style, submission preferences)
- Technique chains and combination effectiveness
- Strategic decision patterns (what worked when)
- Teaching frequency and quality indicators
- Competition preparation and performance (if applicable)
- Position-specific mastery (radar chart showing strengths across positions)

**Support:**
- **Game development visualization:** Show specialization depth in chosen areas
- **Chain attack mapping:** Visualize technique combinations that flow together
- **Teaching portfolio:** Log of classes taught, students mentored
- **Strategic analysis:** "You escape side control to half guard 80% of the time—let's track how that's working"
- **Experimentation tracking:** "Working on new technique" flag with separate success metrics
- **Competition prep tools:** If user competes, dedicated preparation workflow

**Avoid:**
- Pushing breadth over depth (purple needs to specialize, not generalize)
- Generic "work on weaknesses" advice (experimentation is normal here)
- Comparison to brown belts (discouraging during long purple belt journey)

---

## Brown Belt → Black Belt (1-2 years typical)

### What They Must Master

**Primary Focus: Refinement & Mastery (40% defense / 60% offense, both highly refined)**

| Category | Required Competencies |
|----------|----------------------|
| **Complete knowledge** | Deep understanding of ALL BJJ principles, techniques, positions; "almost nothing is unfamiliar" |
| **Signature techniques** | Multiple moves that work on almost anybody; techniques look effortless |
| **Top position mastery** | Masterful weight distribution; passes at narrowest opportunities; balance makes sweeping extremely difficult |
| **Counters** | Developed counter-attacks to all commonly encountered techniques |
| **Economy of motion** | Smooth, fluid, efficient movement; "Why make two movements when one will do?" |
| **Reduced reliance on strength** | Increased reliance on timing, leverage, and pressure |
| **Complete systems** | Every major position has multiple attack/defense/transition options |
| **Teaching mastery** | Can explain complex concepts; develop effective training methodologies |

**Key Principle:** "The refinement phase" — revisiting techniques with deeper understanding.

### Psychological Characteristics

- **Mastery mindset:** Focus on making existing techniques perfect
- **Leadership role:** Serving as role model for entire academy
- **Teaching integration:** Deepening understanding through teaching
- **Detail orientation:** Creating connections for maximum efficiency
- **Emotional regulation:** Demonstrates composure in all situations

### What Indicates Readiness for Black Belt

- Expert level of technical and practical skill with economy of motion
- Can refine even the most basic movements with sophisticated details
- No significant holes in game; adaptable to any opponent
- Demonstrates grace under pressure in training and competition
- Effectively teaches and mentors students of all levels
- Represents academy values and contributes to culture
- Minimum 1 year at brown belt (IBJJF requirement)
- Minimum age 19 years (IBJJF requirement)

### TOMO Features for Brown Belts

**Track:**
- Refinement metrics (technique efficiency, movement economy)
- Teaching and mentorship activities (students taught, classes led)
- Advanced positional analysis (micro-adjustments, timing windows)
- Competitive performance at elite level (if applicable)
- Contribution to academy/community (mentoring, event organization)
- Signature technique development (techniques that define their game)

**Support:**
- **Refinement focus:** Show technique efficiency trends over time
- **Teaching dashboard:** Students mentored, classes taught, curriculum developed
- **Advanced analytics:** Micro-positional analysis for elite performance
- **Mastery visualization:** Journey from white to brown with all accumulated knowledge
- **Legacy building:** Document contributions to academy/community
- **Black belt preparation:** Final requirements checklist (time, age, teaching hours)

**Avoid:**
- Treating brown belt as "almost black belt" (it's a distinct phase deserving respect)
- Pressure around "how close to black belt" (coaches decide timing)
- Generic beginner features (they've outgrown basic tracking)

---

## How Coaches Evaluate Readiness: Critical Factors

### The Evaluation Is Continuous, Not Event-Based

Unlike martial arts with formal tests, BJJ evaluation happens through **ongoing observation** over months/years. Coaches watch:

- Technique execution quality during drilling
- Performance under pressure in live sparring
- Reaction to adversity (getting beaten by lower belts)
- Interaction with training partners (safety, respect, encouragement)
- Response to coaching (implementing feedback vs ignoring)
- Attendance patterns (consistency, not just total hours)

### Objective Criteria Coaches Track

1. **Technique execution quality:** Proper mechanics, attention to detail, consistent performance
2. **Sparring performance:** Against same-belt peers, higher belts, lower belts (contextual evaluation)
3. **Attendance consistency:** 3-4x/week minimum for progression; gaps delay promotion
4. **Competition results:** Provides external validation BUT is not required (even for black belt)

### Subjective Criteria: Often MORE Important Than Technical Skill

1. **Attitude and ego management:** Most important factor according to coaches
2. **Being a good training partner:** Safe rolling, helping others improve, positive gym culture
3. **Coachability:** Following instruction, implementing feedback, asking good questions
4. **Teaching ability (higher belts):** Explaining clearly, demonstrating patience, developing curriculum
5. **Maturity and responsibility:** Ready for increased expectations of higher belt

### Common Reasons Promotions Are Delayed DESPITE Technical Competency

- Attitude issues (arrogance, disrespect, creating negative training environment)
- Inconsistent training (long breaks, gym-hopping, sporadic attendance)
- Poor ego management (getting visibly upset when submitted, dangerous rolling)
- Not helping lower belts (isolating rather than contributing to community)
- Relying on attributes (strength, size, youth) rather than technique
- Refusing to learn (not following instruction, staying in comfort zone)

### The "I Know It When I See It" Reality

John Danaher: "The extreme informality of the Brazilian style is a direct reflection of the fact that it is impossible to provide clear cut rules as to how people ought to be graded."

**Implication for TOMO:** We provide data that supports conversations between coach and student. We never tell coaches someone is "ready" or predict belt promotions. We give practitioners visibility into their own progress and help coaches see patterns across their roster.

---

## Psychology Research That Informs Feature Design

### Self-Determination Theory: The Motivation Foundation

Three psychological needs drive sustained motivation:

**Autonomy:** Feeling in control of your training choices
- **App implementation:** Let practitioners choose which techniques to focus on, set their own goals, manage training intensity
- **Avoid:** Mandatory activities, rigid prescribed paths, one-size-fits-all requirements

**Competence:** Experiencing mastery and effectiveness
- **App implementation:** Clear skill progressions, visible improvement metrics, small win celebrations
- **Avoid:** Comparing to others, unrealistic standards, focusing only on failures

**Relatedness:** Meaningful connection with coaches and training partners
- **App implementation:** Community features, coach communication channels, training partner connections
- **Avoid:** Isolating users, competitive leaderboards that damage relationships

### Goal-Setting Research: Process Goals Outperform Outcome Goals

| Goal Type | Example | Effect Size | When to Use |
|-----------|---------|-------------|-------------|
| **Process** | "Keep elbows tight during guard" | **d = 1.36** | Daily training focus |
| **Performance** | "Escape side control 3x per roll" | d = 0.44 | Weekly/monthly targets |
| **Outcome** | "Earn purple belt this year" | d = 0.09 | Long-term direction only |

**Critical finding:** Process goals produce **10x better results** than outcome goals.

**App implementation:**
- Default to process goals in daily/weekly goal setting
- Include performance goals for measurable milestones
- Acknowledge belt goals but don't make them the primary focus
- Encourage "How can I improve my guard retention?" vs "When will I get promoted?"

### Deliberate Practice: Quality Over Quantity

Research shows deliberate practice accounts for only **18% of variance** in sports performance—other factors (strategy, mental skills, relationships) matter enormously.

**Characteristics of deliberate practice:**
- Focused attention on specific weakness (not mindless repetition)
- Structured and systematic approach
- Immediate feedback for course correction
- Working at edge of ability (challenging but achievable)
- Clear improvement objectives

**App implementation:**
- Pre-session goal setting prompts ("What will you focus on today?")
- Post-session reflection ("Did you work on what you planned?")
- Specific technique drilling logs (not just "trained today")
- Video review integration for feedback
- Progress tracking on specific techniques over time

### Self-Efficacy: Building Confidence Through Mastery Experiences

Bandura's four sources of self-efficacy (ranked by impact):

1. **Mastery experiences (strongest):** Direct success in performing techniques
2. **Vicarious experiences:** Watching similar others succeed
3. **Verbal persuasion:** Coach encouragement and feedback
4. **Physiological states:** Managing anxiety, reading arousal as readiness

**App implementation:**
- Celebrate mastery moments (first successful sweep, first submission, first class taught)
- Show video examples of practitioners at similar level succeeding
- Enable structured coach feedback delivery
- Include breathing/meditation prompts for anxiety management
- Track physiological readiness indicators (sleep, energy, recovery)

### Metacognition and Reflection: Elite Athletes Plan, Monitor, Evaluate

Elite athletes engage in **structured reflection** that accelerates learning:

- **Planning:** Goal-setting before training sessions
- **Monitoring:** Self-assessment during performance
- **Evaluating:** Reflection on outcomes and patterns
- **Adjusting:** Modifying strategies based on feedback

**App implementation:**
- Pre-session planning prompts ("What's your focus today?")
- During-session capture (quick notes between rounds)
- Post-session reflection ("What worked? What didn't?")
- Weekly/monthly pattern analysis ("You've focused on guard passing 80% of sessions")
- Adjustment suggestions ("You've identified guard retention as a weakness 5 times—let's make it a monthly goal")

---

## Feature Prioritization Matrix

### Must-Have Features (All Belts)

| Feature | Why It Matters | Belt Focus |
|---------|---------------|------------|
| **Session logging** | Attendance = #1 objective metric coaches track | All |
| **Technique notes** | Captures what was learned while memory is fresh | All |
| **Reflection prompts** | Accelerates learning through metacognition | All |
| **Goal setting** | Process goals show 10x better results than outcome goals | All |
| **Progress over time** | Competence feedback drives intrinsic motivation | All |
| **Coach communication** | Quality relationship predicts progression | All |

### Belt-Specific Priority Features

**White Belt Critical:**
- Attendance streak tracking (habit formation)
- Survival time metrics (small wins)
- Position recognition tools (learning the map)
- Escape technique quick reference (emergency resource)
- "This is normal" content (normalizes struggle)

**Blue Belt Critical:**
- Plateau detection (dropout prevention)
- Technique breadth visualization (see the gaps)
- Performance goal templates (shift from belt obsession)
- Novelty suggestions (maintain engagement)
- Blue belt blues normalization (you're not alone)

**Purple Belt Critical:**
- Game specialization tracking (develop identity)
- Chain attack visualization (connect techniques)
- Teaching activity logging (new responsibility)
- Strategic pattern analysis (when/why vs what)
- Experimentation support (permission to lose while learning)

**Brown Belt Critical:**
- Refinement metrics (efficiency tracking)
- Teaching portfolio (document contributions)
- Advanced positional analysis (micro-adjustments)
- Mastery visualization (show the complete journey)
- Black belt requirements checklist (time, age, teaching hours)

### Features to Avoid (Anti-Patterns)

| Anti-Pattern | Why It Fails | What to Do Instead |
|--------------|-------------|-------------------|
| **Belt promotion predictions** | Coaches decide based on subjective factors apps can't measure | Show progress toward technical requirements; let coaches decide timing |
| **Peer comparison leaderboards** | Damages relatedness; creates toxic competition | Compare users to their past selves only |
| **"Ready for promotion" notifications** | Undermines coach authority; ignores attitude/mindset factors | Provide data coaches can review; never suggest readiness |
| **Daily performance graphs** | Natural variation creates false signals; increases anxiety | Show weekly/monthly trends; smooth fluctuations |
| **Mandatory features** | Violates autonomy need; reduces intrinsic motivation | Make everything optional with good defaults |
| **Generic "work harder" advice** | Ignores that plateaus are normal and necessary | Context-aware encouragement; normalize struggle |

---

## Data Model Implications

### Essential Data to Capture

**Session Level:**
- Date, duration, type (gi/no-gi/drilling/open mat)
- Techniques drilled (with self-assessment of proficiency)
- Sparring partners and outcomes (position time, submissions)
- Pre-session goals and post-session reflection
- Energy/mood indicators (simple 1-5 scale)

**Technique Level:**
- Technique name and category (guard, pass, submission, escape, takedown)
- Position it's executed from
- Current proficiency rating (learning/developing/proficient)
- Times drilled and times successfully applied in sparring
- Relationship to other techniques (chains/combinations)
- Coach endorsements (optional)

**Goal Level:**
- Goal type (process/performance/outcome)
- Target date or duration
- Progress indicators
- Achievement status
- Reflection on success/failure

**User Profile:**
- Current belt and stripes
- Time at current belt
- Home gym(s) and coach(es)
- Training frequency target
- Competition participation (optional)

### Coach-Visible vs Private Data

**Coach can see (with practitioner permission):**
- Attendance patterns
- Technique proficiency self-assessments
- Goals and progress
- Sparring performance trends
- Teaching activities
- Session reflections marked "share with coach"

**Always private to practitioner:**
- Mood/energy indicators
- Personal reflection notes marked "private"
- Injury details (HIPAA considerations)
- Self-doubt or negative self-talk entries

---

## Implementation Guidelines for AI Coding Agents

### Progressive Disclosure Philosophy

**White Belt View:** Simple, focused, encouraging
- Show only: attendance streak, next session goal, 1-2 key metrics
- Hide: complex analytics, technique breadth matrices, competitive features

**Blue Belt View:** Add breadth tracking
- Show: technique coverage matrix, sparring trends, goal progress
- Continue hiding: game specialization tools (not ready yet)

**Purple Belt View:** Add strategic analysis
- Show: game specialization depth, chain attack visualization, teaching logs
- Emphasize: depth in chosen areas, not breadth across all positions

**Brown Belt View:** Add refinement focus
- Show: efficiency metrics, teaching portfolio, mastery timeline
- Emphasize: economy of motion, legacy building, black belt preparation

### Motivation-Preserving Design Patterns

1. **Compare to past self, not peers:** "Your guard retention improved 23% in 3 months"
2. **Celebrate small wins:** "10-session streak—consistency builds skills"
3. **Normalize struggle:** "70% of white belts struggle with mount escapes for 6+ months"
4. **Process over outcome:** Default goal templates are process goals
5. **Autonomy support:** Every feature is optional; practitioners control their experience
6. **Competence feedback:** Show skill progression visually over time
7. **Relatedness features:** Connect practitioners with coaches and training partners

### What AI Agents Should NOT Attempt

- Predicting belt promotions (coaches decide based on unquantifiable factors)
- Scoring "attitude" or "ego" (subjective; requires human judgment)
- Automated "ready for promotion" flags (undermines coach authority)
- Comparing practitioners to each other without explicit consent (damages motivation)
- Rigid curriculum enforcement (academies vary; must be customizable)

---

## Academy-Specific Customization Points

While core features work across all academies, these elements require customization:

| Element | Why It Varies | Implementation Approach |
|---------|--------------|------------------------|
| **Technique curriculum** | 36 Gracie Combatives vs 400+ sport BJJ techniques | Modular curriculum system; academies can load their own |
| **Belt requirements** | Some academies have formal checklists; others don't | Optional curriculum mapping; works with or without |
| **Time-in-grade** | IBJJF minimums vs coach discretion | Show IBJJF minimums as reference; never enforce |
| **Competition** | Mandatory vs optional vs discouraged | Competition features entirely optional |
| **Gi vs No-Gi** | 10th Planet is 100% no-gi; others are gi-focused | Track both separately; let users hide irrelevant type |
| **Class counting** | Gracie Barra counts classes; most don't | Optional feature; defaults to time-based tracking |

---

## Success Metrics for TOMO

### User Retention (Primary Success Metric)

- **White belt 6-month retention:** >30% (baseline is 10-30%)
- **Blue belt retention through plateau:** >60% (baseline is 50%)
- **Purple belt continued engagement:** >80%
- **Brown belt active use:** >85%

### Engagement Quality

- **Session logging consistency:** >80% of training sessions logged
- **Reflection completion:** >50% of sessions include post-training reflection
- **Goal setting participation:** >70% of users set at least one goal per month
- **Coach interaction:** >40% of users exchange messages with coach monthly

### Outcome Indicators

- **Time to blue belt:** Show TOMO users progress at same or faster rate than non-users
- **Blue belt retention:** Reduce blue belt dropout rate by 10-15%
- **Coach satisfaction:** >80% of coaches find TOMO data useful for evaluations
- **Community perception:** Net Promoter Score >50

---

## Conclusion: What TOMO Does Differently

**TOMO respects that belt progression is human, not algorithmic.** We provide:

1. **Structured reflection tools** that accelerate learning (metacognition research)
2. **Process goal frameworks** that improve performance 10x vs outcome goals
3. **Objective data coaches value** (attendance, technique breadth, sparring trends)
4. **Belt-specific psychology support** (habit formation for whites, plateau management for blues, identity development for purples, refinement focus for browns)
5. **Motivation preservation** (autonomy, competence feedback, relatedness features)

**TOMO does NOT:**
- Predict belt promotions (coaches decide based on subjective factors)
- Replace coach judgment (we support conversations, not automate decisions)
- Create toxic competition (compare to past self, not peers)
- Standardize the unstandardizable (academies vary; we accommodate)

**The result:** Practitioners see their invisible progress. Coaches get useful data without losing authority. The journey from white to black belt becomes clearer without becoming rigid.
