# BJJ Progress Tracker - Data Requirements Analysis

**Purpose:** Define what data to collect from users, how to weight it, and how it maps to progression and belt promotion to help practitioners confidently track their BJJ journey.

**Last Updated:** December 21, 2025

---

## Executive Summary

Our research across 21 sources reveals that BJJ progression is uniquely **subjective and instructor-dependent** compared to other martial arts. This creates both a challenge and an opportunity: practitioners lack objective feedback on their progress, yet coaches evaluate based on patterns that *can* be quantified if the right data is captured.

**The core insight:** Successful belt promotion requires demonstrating competence across **four pillars**—Technical Proficiency, Sparring Performance, Consistency & Attitude, and Character & Community Contribution. Our app must capture data across all four to provide meaningful progress tracking.

---

## The Four Pillars of BJJ Progression

### Pillar 1: Technical Proficiency (Weight: 35%)

**What coaches look for:**
- Technique execution quality during drilling
- Ability to chain techniques together
- Defense proficiency from all major positions
- Position-appropriate skill depth (varies by belt)

**Data to capture:**

| Data Point | Priority | Collection Method | Why It Matters |
|------------|----------|-------------------|----------------|
| Techniques drilled | Critical | User input | Shows curriculum coverage |
| Reps per technique | High | User input | Volume correlates with retention |
| Technique notes/details | High | User input | Captures personal refinements |
| Technique proficiency self-assessment | Critical | User input (scale) | Tracks progression through stages |
| Position categories covered | High | Derived | Identifies gaps in game |
| Technique connections/chains | Medium | User input | Purple+ belt indicator |

**Proficiency Scale (implement as visual tracker):**
```
⬜ Not Aware     → Don't know the technique exists
🟡 Aware        → Have seen/know it exists
🟠 Demonstrable → Can perform on compliant partner
🟢 Applied      → Successfully landed in sparring
🔵 Teachable    → Can explain and troubleshoot for others
```

**Belt-specific technique requirements (from research):**

| Belt | Expected Technique Depth |
|------|-------------------------|
| White | Survival basics + 1 technique per major position |
| Blue | 2+ offensive/defensive options from every position, "ridiculously difficult to submit" |
| Purple | Connected game (not isolated techniques), personal style emerging |
| Brown | Efficiency over effort, counters during escapes, pressure mastery |
| Black | Economy of motion, complete conceptual understanding |

---

### Pillar 2: Sparring Performance (Weight: 30%)

**What coaches look for:**
- Performance against same-belt peers
- Defensive competence (surviving vs. higher belts)
- Problem-solving ability during rolls
- Composure under pressure
- Improvement trajectory over time

**Data to capture:**

| Data Point | Priority | Collection Method | Why It Matters |
|------------|----------|-------------------|----------------|
| Sparring partner name | Critical | User input | Enables trend analysis by opponent |
| Partner belt/skill level | Critical | User input | Context for outcomes |
| Partner size/weight | High | User input | Normalizes physical advantages |
| Outcome (sub win/loss, positional, draw) | Critical | User input | Performance tracking |
| Submission type (given/received) | High | User input | Technique effectiveness data |
| Roll context | Critical | User input | Prevents misinterpretation |
| Positions dominated/struggled | High | User input | Identifies strengths/weaknesses |
| Round duration | Medium | User input | Effort/intensity indicator |

**Roll Context Options (CRITICAL for accurate analysis):**
- A-Game (competing hard)
- Working new techniques
- Flow rolling
- Positional sparring
- Competition prep
- Recovering from injury

**Why context matters:** A higher belt "losing" to lower belts while working new techniques is NOT regression. Apps that track raw win/loss without context create misleading signals.

**Submission Success Rate Benchmarks (from competition data):**

| Submission | Success Rate | Notes |
|------------|--------------|-------|
| Collar Choke | 75.76% | Most effective when attempted |
| Bow and Arrow | 89% | Highest finishing rate |
| Armbar | 49.64% | Most attempted, 30% in Gi |
| RNC | 42.42% | More effective in No-Gi |
| Triangle | 38% | Moderate success |
| Kimura | 23.44% | Lower finishing rate |
| Heel Hook | 20% | Position-dependent |
| Guillotine | 9.52% | Surprisingly ineffective |

---

### Pillar 3: Consistency & Attendance (Weight: 20%)

**What coaches look for:**
- Regular training (2-3+ sessions/week minimum)
- Sustained effort over months/years
- Meeting minimum time-in-grade requirements
- Training variety (gi/no-gi, drilling/sparring)

**Data to capture:**

| Data Point | Priority | Collection Method | Why It Matters |
|------------|----------|-------------------|----------------|
| Session date/time | Critical | User input | Attendance tracking |
| Session duration | High | User input | Mat time accumulation |
| Training type | Critical | User input | Training variety |
| Gym/location | Medium | User input | Tracks affiliations |
| Class type (fundamentals, advanced, etc.) | High | User input | Curriculum exposure |
| Current streak | High | Derived | Motivation indicator |
| Weekly/monthly session count | Critical | Derived | Consistency metric |
| Total mat hours | Critical | Derived | Time-in-grade proxy |

**IBJJF Minimum Time Requirements:**
- White → Blue: No minimum (typically 1-2 years)
- Blue → Purple: 2 years minimum
- Purple → Brown: 18 months minimum
- Brown → Black: 1 year minimum
- Black belt: Minimum age 19

**Exception:** World Champions at blue/purple/brown have no minimum time requirement.

**Attendance Benchmarks (from research):**
- Promotion readiness: 400-600 mat hours per belt
- Consistent training: 2-3 sessions/week minimum
- Competitor pace: 5-7 sessions/week

---

### Pillar 4: Character & Community (Weight: 15%)

**What coaches look for:**
- Ego management (tapping when caught, not getting upset)
- Coachability (openness to feedback)
- Mat etiquette (appropriate intensity, cleanliness)
- Helping teammates
- Positive contribution to academy culture

**Data to capture:**

| Data Point | Priority | Collection Method | Why It Matters |
|------------|----------|-------------------|----------------|
| Lower belts helped | Medium | User input | Teaching/mentoring indicator |
| Feedback received from coach | High | User input | Coachability tracking |
| Competition participation | Medium | User input | Commitment indicator |
| Goals and progress | High | User input | Self-awareness indicator |
| Self-reflection notes | Medium | User input | Ego/attitude indicator |
| Energy level | High | User input | Self-care awareness |
| Mood/mindset | Medium | User input | Mental game tracking |

**Coach Quote:** *"It's not about memorizing a certain set of techniques or being able to win matches—it's just as important to be someone who adds to the academy and benefits their training partners."*

---

## Injury Tracking (Critical for Long-term Success)

**Research finding:** 91.4% of practitioners sustain at least one injury. Those requiring >4 months recovery are 5.5x more likely to quit.

**Data to capture:**

| Data Point | Priority | Why It Matters |
|------------|----------|----------------|
| Injury location | Critical | Pattern identification |
| Injury type | High | Prevention insights |
| Severity (training modification needed) | Critical | Recovery tracking |
| Date occurred | High | Correlation with training load |
| Date resolved | High | Downtime tracking |
| How it happened | Medium | Prevention education |

**Most Common Injury Areas (from NIH study):**
- Fingers: 52.3%
- Neck: 50.8%
- Knees: 50.8%
- Shoulders: 49.2%
- Elbows: 38.5%
- Ankles: 36.9%

---

## Competition Data (Optional but Valuable)

**Key insight:** Competition is NOT required for belt advancement, but it accelerates development and provides unique assessment value.

**Data to capture:**

| Data Point | Priority | Why It Matters |
|------------|----------|----------------|
| Tournament name/date | Medium | Competition history |
| Division (belt/weight/age) | Medium | Context |
| Match results | Medium | Performance under pressure |
| Techniques used | High | What works in competition |
| Video links | Medium | Review and analysis |
| Lessons learned | High | Growth from competition |

---

## Data Weighting Model for Belt Readiness

Our app should calculate an overall "promotion readiness" score based on:

```
Readiness Score = (
  Technical Proficiency × 0.35 +
  Sparring Performance × 0.30 +
  Consistency × 0.20 +
  Character Indicators × 0.15
)
```

**Adjustments:**
- If minimum time requirement NOT met: Cap score at 75%
- If coach feedback exists: Weight coach assessment heavily
- Competition experience: +5% bonus to overall readiness
- Teaching/helping lower belts: +3% bonus (purple+ indicator)

---

## Data Entry Philosophy

**Critical insight from research:** Manual data entry burden causes most practitioners to abandon journaling despite understanding its value.

**Design principles:**

1. **Quick entry is non-negotiable** - Session logging must be possible in <60 seconds
2. **Prioritize frequency over depth** - Brief consistent entries beat detailed sporadic ones
3. **Smart defaults** - Pre-fill common values, remember preferences
4. **Offline-first** - Gyms often have poor connectivity
5. **Hybrid approach support** - Allow quick in-gym capture, detailed review later

**Entry tiers:**

| Tier | Time | What's Captured |
|------|------|-----------------|
| Quick Log | 30 sec | Date, type, duration, energy level |
| Standard | 60 sec | + techniques, sparring summary |
| Detailed | 3-5 min | + notes, specific rounds, reflections |

---

## Key Metrics Dashboard

**What practitioners want to see at a glance:**

1. **Training consistency** - Current streak, weekly average, monthly total
2. **Belt progress** - Time at current belt, requirements completion %
3. **Recent performance** - Last 5 sessions summary
4. **Technique coverage** - Positions with gaps
5. **Sparring trends** - Win rate, common submissions given/received
6. **Coach feedback** - Most recent notes from instructor
7. **Goals progress** - Active goals with completion %

---

## Data Privacy Considerations

**Research finding:** Some practitioners don't want sparring data visible to coaches or teammates.

**Privacy controls needed:**
- Private notes (never shared)
- Sparring data visibility settings
- Goal visibility settings (coach-visible or private)
- Profile visibility (public/gym-only/private)

---

## Integration Opportunities

**Future enhancements to reduce manual entry:**

1. **Gym management software sync** - Auto-import attendance from Zen Planner, Mindbody
2. **Competition platform import** - Smoothcomp, IBJJF results
3. **Wearable integration** - Heart rate, training load from Apple Watch/Garmin
4. **Video analysis (AI)** - Automated technique recognition from training footage

---

## Success Metrics for Our App

**User engagement targets:**
- Daily active users logging 3+ sessions/week
- <60 second average session log time
- 70% 30-day retention rate
- Users report feeling "more confident about progress"

**Outcome metrics:**
- Users feel promotion expectations are clearer
- Coaches find student progress data useful
- Practitioners identify and address game weaknesses
- Injury tracking leads to reduced training interruptions

---

## Sources Referenced

1. OpenSource BJJ - Belt Promotions
2. AG Jiu Jitsu - How Belt Promotions Work
3. White Belt Club - Belt System Explained
4. Progress JJ UK - Brown Belt Requirements
5. Performance Martial Arts Academy - Coach's Corner
6. Evolve Daily - What Promotions Mean
7. MartialTalk Forum - How Black Belts Learn to Promote
8. Digitsu - Tournament Importance for Skill Evaluation
9. BJJ World - IBJJF Rule Changes 2022
10. BJJEE - Belt System Advantages/Disadvantages
11. BJJ Blog - Submission Success Rates (7,567 submissions analyzed)
12. GrapplingAI Blog - Best BJJ Apps 2025
13. BJJ Notes - Notebook vs App Comparison
14. BJJ Notes - Complete Journal Guide
15. Kimura App - App Store Listing
16. Let's Roll BJJ - Journal Guide
17. NIH/PubMed - BJJ Injury Study

---

## Next Steps

1. **Update data models** in `prototype/src/data/` to reflect this analysis
2. **Design entry flows** that prioritize quick capture
3. **Build progress visualization** based on the four pillars
4. **Implement privacy controls** from day one
5. **Create belt readiness calculator** using weighted model
