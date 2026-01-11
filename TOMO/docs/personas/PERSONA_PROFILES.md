# BJJ Journal - Persona Profiles

> **Purpose**: These profiles define the 6 test personas used throughout the prototype. They inform mock data generation, UI personalization testing, and voice/tone calibration.

---

## Persona Overview

| ID | Belt | Archetype | Name | Age | Status | Risk Level |
|----|------|-----------|------|-----|--------|------------|
| `white-excelling` | White | The Natural | Jake Thompson | 26 | Thriving | Low |
| `white-at-risk` | White | The Late Starter | David Morrison | 52 | Struggling | High |
| `blue-excelling` | Blue | The Dedicated Hobbyist | Marcus Chen | 34 | Progressing | Moderate |
| `blue-at-risk` | Blue | The Fading Fire | Ryan Torres | 31 | Declining | Critical |
| `purple-average` | Purple | The Grinder | Sofia Rodriguez | 28 | Stable | Low |
| `brown-average` | Brown | The Veteran | Elena Kim | 38 | Refined | Low |

---

## Profile Keys for Implementation

```typescript
type PersonaKey =
  | 'white-excelling'
  | 'white-at-risk'
  | 'blue-excelling'
  | 'blue-at-risk'
  | 'purple-average'
  | 'brown-average';
```

---

# White Belt Personas

---

## WHITE-EXCELLING: Jake Thompson - "The Natural"

### Demographics

| Field | Value |
|-------|-------|
| **Name** | Jake Thompson |
| **Age** | 26 |
| **Occupation** | Software Developer |
| **Location** | Austin, TX |
| **Prior Athletics** | College wrestler (D3), recreational CrossFit |
| **Why BJJ** | Friend invited him, fell in love immediately |

### BJJ Journey

| Field | Value |
|-------|-------|
| **Training Start** | 8 months ago |
| **Current Belt** | White |
| **Stripes** | 3/4 |
| **Gym** | Atos Austin |
| **Training Frequency** | 3-4x/week (consistent) |
| **Preferred Training** | 60% Gi, 40% No-Gi |
| **Sessions Logged** | 87 |
| **Current Streak** | 12 sessions |

### Training Stats

```yaml
Total Sessions: 87
Total Hours: 130
This Month:
  Sessions: 14
  Hours: 21
  Techniques Logged: 23
  Sparring Rounds: 42
Sparring Record:
  Wins: 45
  Losses: 38
  Draws: 22
Submissions Made:
  Guillotine: 12
  RNC: 8
  Arm Triangle: 6
  Kimura: 5
Submissions Received:
  Triangle: 9
  Armbar: 8
  RNC: 7
  Collar Chokes: 6
```

### Psychology Profile

**Mindset**: Confident but humble. Knows his wrestling gives him an advantage but recognizes he's still learning the "BJJ way." Eager to develop guard game since that's his weakness.

**Motivations**:
- Mastery - loves the technical depth
- Competition - wants to compete within 6 months
- Community - found his tribe at the gym
- Physical challenge - misses competing

**Struggles**:
- Over-relies on athleticism and wrestling base
- Gets impatient in bottom positions
- Sometimes muscles through instead of using technique
- Needs to slow down and learn submissions properly

**Strengths**:
- Exceptional body awareness from wrestling
- High training consistency
- Coachable - takes feedback well
- Good cardio, rarely gasses out

**Coach Feedback**: "Jake's got all the tools. Need to break some wrestling habits but he's on the fast track. Blue belt conversation in 2-3 months if he keeps this up."

### Risk Assessment

| Factor | Level | Notes |
|--------|-------|-------|
| **Overall Risk** | Low | Highly engaged, strong support system |
| **Attendance Risk** | Very Low | Never misses unless sick |
| **Plateau Risk** | Low | Still in rapid learning phase |
| **Injury Risk** | Moderate | Goes hard, needs to pace himself |
| **Social Risk** | Very Low | Well-integrated, multiple training partners |

### Journal Voice

Jake writes enthusiastically with technical detail. Uses BJJ terminology correctly. Focuses on what he learned and how to improve. Rarely negative, but honest about weaknesses.

**Sample Journal Entries**:

> "Great session today. Worked on my closed guard - still feels foreign coming from wrestling where you never want to be on your back. Coach showed me the hip bump to kimura sequence and I actually hit it in sparring! Got caught in a triangle twice though. Need to watch my posture."

> "No-gi today. My wrestling really shows here - felt comfortable on top all day. But Rafa swept me with an x-guard entry I didn't even see coming. Asked him to show me after class. That's what I need to learn."

> "Competed in the in-house tournament. Won 2, lost 1. The loss was to a blue belt by armbar - he just had better technique in the scramble. No shame in that. Fired up to get better."

### Key Metrics for Mock Data

```typescript
const jakeThompson = {
  id: 'white-excelling',
  key: 'white-excelling',
  displayName: 'Jake Thompson',
  contextProfile: {
    userId: 'jake-thompson-001',
    name: 'Jake',
    belt: 'white',
    stripes: 3,
    trainingStartDate: '2024-04-15', // 8 months ago
    currentBeltDate: '2024-04-15',
    gymName: 'Atos Austin',
    trainingGoals: ['competition', 'fitness'],
    targetFrequency: 4,
    birthYear: 1998,
    loggingPreference: 'voice',
    onboardingComplete: true,
    sessionCount: 87,
  },
  trainingStats: {
    totalSessions: 87,
    totalHours: 130,
    currentStreak: 12,
    longestStreak: 18,
    thisMonth: {
      sessions: 14,
      hours: 21,
      techniques: 23,
      sparringRounds: 42,
      targetSessions: 16,
    },
    sparringRecord: { wins: 45, losses: 38, draws: 22 },
  },
  progressSummary: {
    currentBelt: 'white',
    currentStripes: 3,
    timeAtBelt: '8 months',
    nextBelt: 'blue',
    overallCompletion: 78,
    estimatedTimeToPromotion: '2-3 months',
    strengths: ['Top control', 'Takedowns', 'Cardio', 'Consistency'],
    weaknesses: ['Guard retention', 'Submissions from bottom', 'Patience'],
  },
};
```

---

## WHITE-AT-RISK: David Morrison - "The Late Starter"

### Demographics

| Field | Value |
|-------|-------|
| **Name** | David Morrison |
| **Age** | 52 |
| **Occupation** | IT Manager |
| **Location** | Portland, OR |
| **Prior Athletics** | Recreational basketball in 30s, nothing since |
| **Why BJJ** | Midlife challenge, saw Jocko Willink podcast |

### BJJ Journey

| Field | Value |
|-------|-------|
| **Training Start** | 18 months ago |
| **Current Belt** | White |
| **Stripes** | 2/4 |
| **Gym** | Gracie Barra Portland |
| **Training Frequency** | 1-2x/week (declining) |
| **Preferred Training** | 80% Gi (easier on joints) |
| **Sessions Logged** | 47 |
| **Current Streak** | 1 session |
| **Last Session** | 9 days ago |

### Training Stats

```yaml
Total Sessions: 47
Total Hours: 70
This Month:
  Sessions: 3
  Hours: 4.5
  Techniques Logged: 4
  Sparring Rounds: 6
  Target Sessions: 8 (missing 63%)
Sparring Record:
  Wins: 12
  Losses: 48
  Draws: 15
Submissions Made:
  Americana: 4
  Kimura: 3
  RNC: 2
Submissions Received:
  Everything: "Too many to count"
```

### Psychology Profile

**Mindset**: Loves BJJ but constantly questions if he belongs. Compares himself to younger, more athletic training partners. Recovery takes 2-3 days now. Worried about injuries derailing him permanently.

**Motivations**:
- Health - wants to stay active into old age
- Mental challenge - loves the "chess match" aspect
- Community - enjoys the camaraderie
- Self-improvement - proving he can still learn new things

**Struggles**:
- Physical recovery - knee issues, shoulder tightness
- Progress feels painfully slow
- Getting smashed by people half his age
- Fitting training into busy work schedule
- Wife skeptical of "getting beat up at your age"

**Fears**:
- "Am I too old for this?"
- "What if I get seriously injured?"
- "I'll never be good at this"
- "The younger guys must think I'm a joke"

**Strengths**:
- Life experience, stays calm under pressure
- Genuinely coachable and humble
- Asks good questions
- When he's there, he's fully present

**Coach Feedback**: "David's doing fine for his situation. Just needs to stay consistent and not compare himself to the 25-year-olds. I worry when he misses weeks at a time."

### Risk Assessment

| Factor | Level | Notes |
|--------|-------|-------|
| **Overall Risk** | High | Multiple risk factors converging |
| **Attendance Risk** | High | 9 days since last session, declining trend |
| **Plateau Risk** | Moderate | Slow progress but still learning |
| **Injury Risk** | High | Managing knee, recovering slowly |
| **Psychological Risk** | High | Imposter syndrome, age-related doubts |
| **Life Risk** | Moderate | Work stress, spouse skepticism |

### Risk Signals Present

- Session gap > 7 days (currently at 9)
- Training frequency declined 40% over 3 months
- Journal mentions fatigue, pain, doubt
- Missed target frequency 3 weeks in a row
- Last 2 journal entries had negative sentiment

### Journal Voice

David writes shorter entries, often mentioning physical state. More hesitant language. Questions himself. But when he has a good session, genuine joy comes through.

**Sample Journal Entries**:

> "Only made it once this week. Knee was acting up after last Thursday. Did some positional sparring from guard. Got passed constantly. Everyone makes it look so easy. 47 years old and can't even hold closed guard."

> "Back after 10 days off. Felt like starting over. Forgot half of what I learned. Coach was nice about it but I could tell I was behind. Maybe I should just do the fundamentals class and skip sparring for a while."

> "Actually had a good one today. Escaped side control twice using the frame and hip escape we drilled. Small win but I'll take it. This is why I keep coming back. When it clicks, nothing else matters."

> "Tweaked my shoulder going for an underhook. Nothing serious but I'm 52, everything takes forever to heal. Wife gave me the look when I told her. Starting to wonder if this makes sense."

### Key Metrics for Mock Data

```typescript
const davidMorrison = {
  id: 'white-at-risk',
  key: 'white-at-risk',
  displayName: 'David Morrison',
  contextProfile: {
    userId: 'david-morrison-001',
    name: 'David',
    belt: 'white',
    stripes: 2,
    trainingStartDate: '2023-06-01', // 18 months ago
    currentBeltDate: '2023-06-01',
    gymName: 'Gracie Barra Portland',
    trainingGoals: ['fitness', 'mental'],
    targetFrequency: 2,
    birthYear: 1972,
    loggingPreference: 'text',
    onboardingComplete: true,
    sessionCount: 47,
  },
  trainingStats: {
    totalSessions: 47,
    totalHours: 70,
    currentStreak: 1,
    longestStreak: 6,
    thisMonth: {
      sessions: 3,
      hours: 4.5,
      techniques: 4,
      sparringRounds: 6,
      targetSessions: 8,
    },
    sparringRecord: { wins: 12, losses: 48, draws: 15 },
  },
  progressSummary: {
    currentBelt: 'white',
    currentStripes: 2,
    timeAtBelt: '18 months',
    nextBelt: 'blue',
    overallCompletion: 42,
    estimatedTimeToPromotion: '8-12 months',
    strengths: ['Coachable', 'Calm under pressure', 'Asks good questions'],
    weaknesses: ['Athleticism', 'Recovery time', 'Consistency', 'Guard retention'],
  },
  // Risk indicators
  riskSignals: {
    daysSinceLastSession: 9,
    attendanceTrend: 'declining',
    frequencyVsTarget: 0.38, // 38% of target
    recentSentiment: 'negative',
    injuryMentions: 2,
  },
};
```

---

# Blue Belt Personas

---

## BLUE-EXCELLING: Marcus Chen - "The Dedicated Hobbyist"

### Demographics

| Field | Value |
|-------|-------|
| **Name** | Marcus Chen |
| **Age** | 34 |
| **Occupation** | Marketing Manager |
| **Location** | Denver, CO |
| **Prior Athletics** | High school soccer, recreational runner |
| **Why BJJ** | Needed a physical hobby after desk job, friend's recommendation |

### BJJ Journey

| Field | Value |
|-------|-------|
| **Training Start** | 2.5 years ago |
| **Current Belt** | Blue |
| **Stripes** | 2/4 |
| **Time at Blue** | 10 months |
| **Gym** | 10th Planet Denver |
| **Training Frequency** | 2-3x/week (consistent) |
| **Preferred Training** | 50% Gi, 50% No-Gi |
| **Sessions Logged** | 247 |
| **Current Streak** | 8 sessions |

### Training Stats

```yaml
Total Sessions: 247
Total Hours: 370
This Month:
  Sessions: 11
  Hours: 16.5
  Techniques Logged: 18
  Sparring Rounds: 33
  Target Sessions: 12
Sparring Record:
  Wins: 124
  Losses: 108
  Draws: 67
Submissions Made:
  Guillotine: 28
  Triangle: 22
  Armbar: 19
  Kimura: 15
  RNC: 14
Submissions Received:
  RNC: 18
  Armbar: 16
  Leg Locks: 14
  Collar Chokes: 12
```

### Psychology Profile

**Mindset**: Working through the "Blue Belt Blues" but with healthy perspective. Recognizes the plateau is normal. Focused on developing his personal game rather than just collecting techniques. Married with one kid, so training time is precious.

**Motivations**:
- Self-improvement - wants to be a lifelong learner
- Stress relief - mat time is his meditation
- Community - deep friendships at the gym
- Competition - enters local tournaments 2-3x/year

**Struggles**:
- Feeling stuck sometimes - progress isn't as visible as white belt
- Balancing family time with training
- Getting caught by purple belts with techniques he "should" know
- Developing a coherent game vs collecting random techniques

**Strengths**:
- Excellent guard game, especially closed guard
- Good at slowing down athletic white belts
- Consistent despite life responsibilities
- Humble, keeps showing up

**Coach Feedback**: "Marcus is the kind of blue belt every gym needs. Shows up, works hard, helps the new guys. He's in the valley right now but he's handling it well. Third stripe coming soon."

### Risk Assessment

| Factor | Level | Notes |
|--------|-------|-------|
| **Overall Risk** | Moderate | Blue belt blues, but coping well |
| **Attendance Risk** | Low | Consistent despite busy life |
| **Plateau Risk** | Moderate | Normal blue belt plateau |
| **Injury Risk** | Low | Trains smart, taps early |
| **Life Risk** | Moderate | Family balance is real |

### Journal Voice

Marcus writes thoughtfully with good technical detail. Reflects on what's working and what isn't. Occasionally frustrated but generally positive. Mentions training partners and specific positions.

**Sample Journal Entries**:

> "Guard day. Worked closed guard sweeps - hip bump, scissor, flower. Hit the scissor sweep twice in sparring but got passed the other 4 times. My guard retention from open guard is still a problem. Need to work on frames."

> "Got smashed by a new purple belt. Humbling. He passed my guard like it wasn't there and finished with a baseball bat choke I didn't see coming. This is the plateau they talk about. Just gotta keep showing up."

> "Best session in a month. Everything clicked today. Swept a brown belt, submitted two white belts, survived against Professor for 3 minutes. These days remind me why I do this."

> "Only got one session this week - Sarah's work trip meant I had solo kid duty. But I made that session count. Focused on leg locks since that's where I'm weakest."

### Key Metrics for Mock Data

```typescript
const marcusChen = {
  id: 'blue-excelling',
  key: 'blue-excelling',
  displayName: 'Marcus Chen',
  contextProfile: {
    userId: 'marcus-chen-001',
    name: 'Marcus',
    belt: 'blue',
    stripes: 2,
    trainingStartDate: '2022-06-15', // 2.5 years ago
    currentBeltDate: '2024-02-20', // 10 months at blue
    gymName: '10th Planet Denver',
    trainingGoals: ['fitness', 'mental', 'community'],
    targetFrequency: 3,
    birthYear: 1990,
    loggingPreference: 'voice',
    onboardingComplete: true,
    sessionCount: 247,
  },
  trainingStats: {
    totalSessions: 247,
    totalHours: 370,
    currentStreak: 8,
    longestStreak: 24,
    thisMonth: {
      sessions: 11,
      hours: 16.5,
      techniques: 18,
      sparringRounds: 33,
      targetSessions: 12,
    },
    sparringRecord: { wins: 124, losses: 108, draws: 67 },
  },
  progressSummary: {
    currentBelt: 'blue',
    currentStripes: 2,
    timeAtBelt: '10 months',
    nextBelt: 'purple',
    overallCompletion: 55,
    estimatedTimeToPromotion: '14-20 months',
    strengths: ['Closed guard', 'Sweeps', 'Patience', 'Consistency'],
    weaknesses: ['Guard retention', 'Leg locks', 'Top pressure', 'Submissions from top'],
  },
};
```

---

## BLUE-AT-RISK: Ryan Torres - "The Fading Fire"

### Demographics

| Field | Value |
|-------|-------|
| **Name** | Ryan Torres |
| **Age** | 31 |
| **Occupation** | Financial Analyst |
| **Location** | Chicago, IL |
| **Prior Athletics** | College rugby, gym rat |
| **Why BJJ** | Wanted something more challenging than lifting |

### BJJ Journey

| Field | Value |
|-------|-------|
| **Training Start** | 3 years ago |
| **Current Belt** | Blue |
| **Stripes** | 1/4 |
| **Time at Blue** | 14 months |
| **Gym** | Carlson Gracie Chicago |
| **Training Frequency** | Was 4x/week, now 1x or less |
| **Preferred Training** | 70% Gi |
| **Sessions Logged** | 156 |
| **Current Streak** | 0 sessions |
| **Last Session** | 21 days ago |

### Training Stats

```yaml
Total Sessions: 156
Total Hours: 234
This Month:
  Sessions: 1
  Hours: 1.5
  Techniques Logged: 1
  Sparring Rounds: 3
  Target Sessions: 12 (hitting 8%)
Sparring Record:
  Wins: 72
  Losses: 89
  Draws: 41
Submissions Made:
  Guillotine: 18
  Armbar: 12
  RNC: 11
  Americana: 8
Submissions Received:
  Triangle: 22
  RNC: 18
  Armbar: 15
  Collar Chokes: 14
```

### Psychology Profile

**Mindset**: Started with fire, now questioning everything. Watches teammates who started at the same time with 3+ stripes or even purple belts. Feels left behind. Work got demanding after a promotion 8 months ago. Relationship ended 4 months ago. Everything feels hard.

**Motivations** (diminishing):
- Status - started wanting to be good at something
- Fitness - but hasn't been feeling fit lately
- Social - but feels disconnected from gym friends now

**Struggles**:
- Imposter syndrome: "I should be better by now"
- Time: 60+ hour work weeks, exhausted
- Comparison: Teammates passing him
- Isolation: Lost touch with training partners
- Spiral: Less training = worse performance = less motivation

**Fears**:
- "Everyone's noticed I've been gone"
- "I'll be the guy who used to train"
- "Maybe BJJ just isn't for me"
- "Starting over would be embarrassing"

**Internal Dialogue**:
- "I'll go next week when work calms down" (it never does)
- "What's the point, I'm so far behind now"
- "They're all better than me anyway"

**Coach Feedback**: "Ryan had so much potential. I've texted him a few times but he just says he's been busy. Classic blue belt burnout. Hope he comes back before it's too late."

### Risk Assessment

| Factor | Level | Notes |
|--------|-------|-------|
| **Overall Risk** | Critical | Multiple severe risk factors |
| **Attendance Risk** | Critical | 21 days since last session |
| **Plateau Risk** | High | Stopped before breakthrough |
| **Psychological Risk** | Critical | Imposter syndrome, isolation |
| **Life Risk** | High | Work stress, recent breakup |
| **Social Risk** | High | Disconnected from training partners |

### Risk Signals Present

- Session gap > 14 days (currently 21)
- Training frequency dropped 75% in 6 months
- Missed 11 of last 12 target sessions
- No response to coach check-in
- Last journal entry mentioned "maybe taking a break"
- Breaking streak after streak
- Declining sparring performance when present

### Journal Voice

Ryan's recent entries are short, defeated. Earlier entries (6+ months ago) were enthusiastic. The contrast is stark. Lots of "I" statements, self-criticism, and justifications for not training.

**Sample Journal Entries**:

**Recent (Struggling):**

> "Made it in after 3 weeks. Felt completely lost. Guys I used to beat are now beating me easily. What's the point."

> "Couldn't go again. Work thing ran late. Third week in a row. Coach texted me. Don't know what to say."

> "Watching my teammate get promoted to purple today. We started the same month. Barely have one stripe. Maybe I should just accept I'm not cut out for this."

**6 Months Ago (Different Person):**

> "Great training week - hit 4 sessions. Triangle is becoming money. Caught two purple belts with it this week. Feeling like I'm finally developing a game. Competition in 2 months!"

> "Entered my first tournament. Lost both matches but learned so much. Already registered for the next one."

### Key Metrics for Mock Data

```typescript
const ryanTorres = {
  id: 'blue-at-risk',
  key: 'blue-at-risk',
  displayName: 'Ryan Torres',
  contextProfile: {
    userId: 'ryan-torres-001',
    name: 'Ryan',
    belt: 'blue',
    stripes: 1,
    trainingStartDate: '2021-12-01', // 3 years ago
    currentBeltDate: '2023-10-15', // 14 months at blue
    gymName: 'Carlson Gracie Chicago',
    trainingGoals: ['fitness', 'competition'],
    targetFrequency: 3, // Was 4, lowered it hoping to hit it
    birthYear: 1993,
    loggingPreference: 'text',
    onboardingComplete: true,
    sessionCount: 156,
  },
  trainingStats: {
    totalSessions: 156,
    totalHours: 234,
    currentStreak: 0,
    longestStreak: 31,
    thisMonth: {
      sessions: 1,
      hours: 1.5,
      techniques: 1,
      sparringRounds: 3,
      targetSessions: 12,
    },
    sparringRecord: { wins: 72, losses: 89, draws: 41 },
  },
  progressSummary: {
    currentBelt: 'blue',
    currentStripes: 1,
    timeAtBelt: '14 months',
    nextBelt: 'purple',
    overallCompletion: 28,
    estimatedTimeToPromotion: 'Unknown - need consistency',
    strengths: ['Natural athleticism', 'Triangle', 'Guillotine'],
    weaknesses: ['Consistency', 'Guard passing', 'Composure', 'Follow-through'],
  },
  // Risk indicators
  riskSignals: {
    daysSinceLastSession: 21,
    attendanceTrend: 'critical_decline',
    frequencyVsTarget: 0.08, // 8% of target
    recentSentiment: 'negative',
    peakToCurrentRatio: 0.25, // Training at 25% of peak
    socialEngagement: 'withdrawn',
    coachOutreach: 'no_response',
  },
};
```

---

# Purple Belt Persona

---

## PURPLE-AVERAGE: Sofia Rodriguez - "The Grinder"

### Demographics

| Field | Value |
|-------|-------|
| **Name** | Sofia Rodriguez |
| **Age** | 28 |
| **Occupation** | Physical Therapist |
| **Location** | San Diego, CA |
| **Prior Athletics** | High school volleyball, yoga |
| **Why BJJ** | Patient recommended it for her own fitness, got hooked |

### BJJ Journey

| Field | Value |
|-------|-------|
| **Training Start** | 5 years ago |
| **Current Belt** | Purple |
| **Stripes** | 1/4 |
| **Time at Purple** | 8 months |
| **Gym** | Atos HQ San Diego |
| **Training Frequency** | 4-5x/week (dedicated) |
| **Preferred Training** | 55% Gi, 45% No-Gi |
| **Sessions Logged** | 612 |
| **Current Streak** | 15 sessions |

### Training Stats

```yaml
Total Sessions: 612
Total Hours: 918
This Month:
  Sessions: 18
  Hours: 27
  Techniques Logged: 12
  Sparring Rounds: 54
  Target Sessions: 20
  Teaching Sessions: 3
Sparring Record:
  Wins: 298
  Losses: 189
  Draws: 145
Submissions Made:
  Armbar: 67
  Triangle: 54
  Bow and Arrow: 42
  Kimura: 38
  RNC: 35
  Heel Hook: 28
Submissions Received:
  RNC: 31
  Armbar: 28
  Heel Hook: 24
  Triangle: 19
```

### Psychology Profile

**Mindset**: Systems thinker. No longer chasing individual techniques but building interconnected games. Sees positions as problems to solve, not battles to win. Starting to understand the "teaching is learning" concept. Competes occasionally but not chasing medals - wants to test her systems.

**Motivations**:
- Mastery - pursuing depth over breadth now
- Teaching - enjoys helping lower belts click
- Community - deep roots at her gym
- Self-expression - her game is uniquely hers
- Competition - occasional, for testing purposes

**Struggles**:
- Perfecting existing skills vs. adding new ones
- Training partners know her game, harder to surprise
- Managing intensity - can train too hard
- The long road to brown belt

**Strengths**:
- Exceptional guard (lasso and spider specialist)
- Systems approach to positions
- Can articulate technique clearly
- Consistent, never misses unless sick
- Good competition mindset

**Current Focus**:
- Developing her leg lock game (playing catch-up)
- Improving top game (historically guard player)
- Learning to coach white belts during fundamentals class

**Coach Feedback**: "Sofia's becoming a complete player. Her guard is world-class for her level. Now she's filling in the gaps. She'll be a brown belt within 18 months if she keeps this up. Starting to give her teaching responsibilities."

### Risk Assessment

| Factor | Level | Notes |
|--------|-------|-------|
| **Overall Risk** | Low | Deeply committed, past danger zone |
| **Attendance Risk** | Very Low | Trains like it's her job |
| **Plateau Risk** | Low | Experiencing normal refinement phase |
| **Burnout Risk** | Moderate | May need to manage intensity |
| **Injury Risk** | Moderate | Trains hard, needs to pace |

### Journal Voice

Sofia writes analytically with clear technical language. Focuses on systems and concepts rather than individual techniques. Mentions teaching moments. Balanced between self-critique and recognition of progress.

**Sample Journal Entries**:

> "Worked on my lasso to omoplata to armbar sequence. The transition is getting smoother but I'm still telegraphing the switch. Need to disguise the grip break better. Purple belt Mike defended it three times today - he knows it's coming."

> "Taught the fundamentals class today. Explaining mount escapes to white belts made me realize I've been skipping a detail on the elbow-knee escape. Teaching is the best way to learn."

> "Competition prep. Did 8 hard rounds focusing on my A-game only. Armbar from guard is money. Triangle needs work - people are getting better at posture. Leg locks are coming along but not competition-ready yet."

> "Rolled with Professor today. Got destroyed as usual but I survived his leg lock sequence for the first time. He said my defense is getting 'annoying.' I'll take it."

### Key Metrics for Mock Data

```typescript
const sofiaRodriguez = {
  id: 'purple-average',
  key: 'purple-average',
  displayName: 'Sofia Rodriguez',
  contextProfile: {
    userId: 'sofia-rodriguez-001',
    name: 'Sofia',
    belt: 'purple',
    stripes: 1,
    trainingStartDate: '2019-12-01', // 5 years ago
    currentBeltDate: '2024-04-15', // 8 months at purple
    gymName: 'Atos HQ San Diego',
    trainingGoals: ['competition', 'fitness', 'community'],
    targetFrequency: 5,
    birthYear: 1996,
    loggingPreference: 'voice',
    onboardingComplete: true,
    sessionCount: 612,
  },
  trainingStats: {
    totalSessions: 612,
    totalHours: 918,
    currentStreak: 15,
    longestStreak: 42,
    thisMonth: {
      sessions: 18,
      hours: 27,
      techniques: 12,
      sparringRounds: 54,
      targetSessions: 20,
      teachingSessions: 3,
    },
    sparringRecord: { wins: 298, losses: 189, draws: 145 },
  },
  progressSummary: {
    currentBelt: 'purple',
    currentStripes: 1,
    timeAtBelt: '8 months',
    nextBelt: 'brown',
    overallCompletion: 45,
    estimatedTimeToPromotion: '18-24 months',
    strengths: ['Guard (lasso/spider)', 'Armbars', 'Triangles', 'Teaching', 'Competition mindset'],
    weaknesses: ['Leg locks', 'Top pressure', 'Wrestling'],
  },
};
```

---

# Brown Belt Persona

---

## BROWN-AVERAGE: Elena Kim - "The Veteran"

### Demographics

| Field | Value |
|-------|-------|
| **Name** | Elena Kim |
| **Age** | 38 |
| **Occupation** | Owns a CrossFit gym |
| **Location** | Seattle, WA |
| **Prior Athletics** | College judo (2 years), CrossFit competitor |
| **Why BJJ** | Natural progression from judo, wanted ground game |

### BJJ Journey

| Field | Value |
|-------|-------|
| **Training Start** | 8.5 years ago |
| **Current Belt** | Brown |
| **Stripes** | 2/4 |
| **Time at Brown** | 18 months |
| **Gym** | Marcelo Garcia Seattle (affiliate) |
| **Training Frequency** | 3-4x/week |
| **Preferred Training** | 65% Gi, 35% No-Gi |
| **Sessions Logged** | 1,247 |
| **Current Streak** | 6 sessions |

### Training Stats

```yaml
Total Sessions: 1,247
Total Hours: 1,870
This Month:
  Sessions: 14
  Hours: 21
  Techniques Logged: 5
  Sparring Rounds: 42
  Target Sessions: 16
  Teaching Sessions: 6
Sparring Record:
  Wins: 589
  Losses: 312
  Draws: 284
Submissions Made:
  Bow and Arrow: 89
  Cross Collar: 72
  Armbar: 68
  Triangle: 61
  RNC: 58
  Loop Choke: 45
Submissions Received:
  Leg Locks: 52
  RNC: 41
  Armbar: 38
  Triangle: 32
```

### Psychology Profile

**Mindset**: In refinement mode. Not learning many new techniques - instead, perfecting what she has. Every roll is about making her game tighter, more efficient. Thinking about what her black belt means and what she'll contribute to the art. Spends significant time teaching and mentoring.

**Motivations**:
- Legacy - wants to be remembered as someone who gave back
- Mastery - the final polishing of her game
- Teaching - finds deep fulfillment in student breakthroughs
- Community - the gym is her second family
- Health - BJJ keeps her young

**Struggles**:
- Body doesn't recover like it used to
- Balancing gym ownership with training
- The weight of expectation (supposed to be good now)
- Keeping training fresh after 8+ years

**Strengths**:
- Complete game, no obvious weaknesses
- Exceptional choke game (collar work)
- Can roll light or hard as needed
- Reads opponents effortlessly
- Mentoring ability

**Current Focus**:
- Refining her pressure passing
- Working with the competition team
- Developing the gym's women's program
- Thinking about black belt readiness

**Coach Feedback**: "Elena is ready for black belt whenever she feels ready. Technically sound, great teacher, perfect ambassador for the art. She's taking her time and I respect that."

### Risk Assessment

| Factor | Level | Notes |
|--------|-------|-------|
| **Overall Risk** | Very Low | Deeply embedded, trains for life |
| **Attendance Risk** | Very Low | Training is non-negotiable |
| **Burnout Risk** | Low | Found sustainable rhythm |
| **Injury Risk** | Moderate | Body needs more care now |
| **Purpose Risk** | Low | Clear sense of purpose |

### Journal Voice

Elena writes reflectively with mature perspective. Focuses on refinement, teaching moments, and broader patterns. Less about winning/losing, more about quality of movement and connection.

**Sample Journal Entries**:

> "Rolled 6 rounds today. Focused on pressure passing - trying to make my top game as heavy as possible with less effort. The efficiency is coming. Used to fight for positions; now I try to make them inevitable."

> "Helped Sarah (blue belt) with her half guard. Watching her finally hit the sweep after weeks of drilling was the highlight of my week. This is what it's about now."

> "Competition class. Let the young purple belts work. My job was to give them good looks, not to prove anything. Caught myself going too hard once - had to dial it back. Ego never fully dies."

> "Thinking about black belt. What does it mean? Not sure I deserve it yet. Not the technique - that's there. Something else. Maybe I need to contribute more first. Professor says I'm ready. I'm not convinced."

> "Body felt rough this morning. Knee was talking to me. Did a light flow roll session instead of the planned hard sparring. At 38, I have to listen. This is how you train for decades."

### Key Metrics for Mock Data

```typescript
const elenaKim = {
  id: 'brown-average',
  key: 'brown-average',
  displayName: 'Elena Kim',
  contextProfile: {
    userId: 'elena-kim-001',
    name: 'Elena',
    belt: 'brown',
    stripes: 2,
    trainingStartDate: '2016-06-01', // 8.5 years ago
    currentBeltDate: '2023-06-15', // 18 months at brown
    gymName: 'Marcelo Garcia Seattle',
    trainingGoals: ['community', 'mental', 'fitness'],
    targetFrequency: 4,
    birthYear: 1986,
    loggingPreference: 'text',
    onboardingComplete: true,
    sessionCount: 1247,
  },
  trainingStats: {
    totalSessions: 1247,
    totalHours: 1870,
    currentStreak: 6,
    longestStreak: 58,
    thisMonth: {
      sessions: 14,
      hours: 21,
      techniques: 5,
      sparringRounds: 42,
      targetSessions: 16,
      teachingSessions: 6,
    },
    sparringRecord: { wins: 589, losses: 312, draws: 284 },
  },
  progressSummary: {
    currentBelt: 'brown',
    currentStripes: 2,
    timeAtBelt: '18 months',
    nextBelt: 'black',
    overallCompletion: 78,
    estimatedTimeToPromotion: '6-12 months (when ready)',
    strengths: ['Chokes', 'Pressure passing', 'Teaching', 'Game IQ', 'Composure'],
    weaknesses: ['Leg locks (generational gap)', 'Recovery time', 'Wrestling'],
  },
};
```

---

# Implementation Notes

## Using These Personas

### In Settings Demo Mode

The Settings component should offer a dropdown to select any of the 6 personas:

```typescript
const DEMO_PERSONAS = [
  { value: 'white-excelling', label: 'White (Excelling)', name: 'Jake Thompson' },
  { value: 'white-at-risk', label: 'White (At-Risk)', name: 'David Morrison' },
  { value: 'blue-excelling', label: 'Blue (Excelling)', name: 'Marcus Chen' },
  { value: 'blue-at-risk', label: 'Blue (At-Risk)', name: 'Ryan Torres' },
  { value: 'purple-average', label: 'Purple (Average)', name: 'Sofia Rodriguez' },
  { value: 'brown-average', label: 'Brown (Average)', name: 'Elena Kim' },
];
```

### Belt Personalization Integration

Each persona should trigger the appropriate belt-level adaptations:

| Persona | Belt System Profile | Dashboard Metric | Prompt Style | Risk Detection |
|---------|---------------------|-----------------|--------------|----------------|
| white-excelling | Survival Mode | session_streak | encouraging | Active |
| white-at-risk | Survival Mode | session_streak | encouraging | **Active + Triggered** |
| blue-excelling | Identity Crisis | technique_variety | neutral | Active |
| blue-at-risk | Identity Crisis | technique_variety | neutral | **Active + Critical** |
| purple-average | Systems Thinking | sparring_rounds | analytical | Minimal |
| brown-average | Refinement | teaching_sessions | analytical | Minimal |

### Mock Data Generation

Use the `contextProfile`, `trainingStats`, and `progressSummary` objects to populate:
- Dashboard stats modules
- Session history entries
- Belt progress visualizations
- Profile screens

### Journal Entry Generation

Use the "Journal Voice" section to generate consistent mock journal entries that match each persona's:
- Writing style
- Technical vocabulary level
- Emotional tone
- Focus areas

---

