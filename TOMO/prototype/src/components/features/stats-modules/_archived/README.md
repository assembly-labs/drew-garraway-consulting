# Archived Stats Modules

These modules were archived on 2026-01-03 as part of a dashboard consolidation to reduce redundant content and improve information density.

## Why Archived

The Stats dashboard was showing the same data multiple times in different visualizations:
- Session count appeared 3 times for white belts
- Submission data appeared 6 different ways for blue belts
- Multiple motivational messages competed for attention

**Principle applied:** Show each insight ONCE, in the best possible way, then move on.

---

## JourneyTimeline.tsx (White Belt)

**Purpose:** Milestone tracking and dropout cliff positioning

**What it showed:**
- Session count + days active as twin hero stats
- Visual timeline with milestones (10, 25, 50, 75, 100 sessions)
- Progress bar to next milestone
- Dropout cliff callout with severity levels (DANGER ZONE, CRITICAL PERIOD, PAST THE CLIFF)
- Random motivational insights

**Why archived:**
- Session count already shown in Dashboard Hero
- "Days active" less actionable than session count
- Multiple progress visualizations were redundant
- Dropout cliff messaging was scary rather than motivating

**Replaced by:** `YourProgress.tsx` - simpler progress-to-50 bar with weekly/monthly stats

---

## ConsistencyScore.tsx (White Belt)

**Purpose:** Session count emphasis and streak tracking

**What it showed:**
- Session count as hero number
- "Progress to 50" bar with percentage
- 3-column stats grid: Current streak, This week, This month
- Personalized message based on session count milestones
- Motivational callout box

**Why archived:**
- Session count duplicated from Dashboard Hero
- Streak duplicated from main Streak Section
- Multiple motivational messages = noise

**Replaced by:** `YourProgress.tsx` - keeps progress-to-50 and weekly/monthly, removes duplicates

---

## YourStyle.tsx (Blue Belt)

**Purpose:** Submission balance and emerging style identification

**What it showed:**
- Style label hero (e.g., "AGGRESSIVE FINISHER", "DEFENSIVE STALWART")
- Submission balance bars (Given vs Received with ratio)
- Top 3 go-to attacks with drill counts
- Body region breakdown (Neck/Arms/Legs vertical bars)
- Random insight from module copy

**Why archived:**
- AttackProfile shows specialist nickname with more personality
- AttackProfile treemap shows body regions better
- AttackProfile "Your Weapons" shows top 5 attacks
- Submission balance shown in AttackProfile footer

**Replaced by:** `AttackProfile.tsx` - comprehensive submission story in one place

---

## VulnerabilityMap.tsx (Blue Belt)

**Purpose:** Show defensive weaknesses and provide defense suggestions

**What it showed:**
- "WHERE YOU GET CAUGHT" header with tap count
- Attack zones breakdown (Neck/Arms/Legs horizontal bars)
- Top 5 techniques catching user with frequency bars
- Defense suggestion bullets for most vulnerable region
- Insight about learning from taps

**Why archived:**
- RecentRolls provides BETTER defense coaching (video links + detailed paragraphs)
- AttackProfile "Watch Out For" shows top 5 vulnerabilities
- Body region data duplicated with YourStyle

**Replaced by:**
- `RecentRolls.tsx` - defense coaching with YouTube videos
- `AttackProfile.tsx` - "Watch Out For" section

---

## LongGame.tsx (Purple+ Belt)

**Purpose:** Multi-year progression visualization

**What it showed:**
- Years active hero number
- Sessions by year bar chart
- 4-stat grid: Total sessions, Mat hours, Sparring rounds, Techniques drilled
- Lifetime submission summary (given/received/ratio)
- Insight message

**Why archived:**
- Lifetime submissions already shown in AttackProfile footer
- Techniques drilled count was an approximation; TechniqueMastery has real data
- Session count and hours could be combined with submission trend data

**Replaced by:** `YourJourney.tsx` - merged LongGame + SubmissionTrends into one module

---

## SubmissionTrends.tsx (Purple+ Belt)

**Purpose:** Year-over-year submission trend analysis

**What it showed:**
- Submissions by year dual bar chart (given vs received)
- This year vs last year comparison table
- Trend indicators (offensive % change, defensive % change)
- Technique evolution (most improved, new additions, declining)
- Insight message

**Why archived:**
- Yearly submission data already in LongGame's yearlyData
- Year-over-year comparison was detailed but not actionable
- Technique evolution was the unique value worth keeping

**Replaced by:** `YourJourney.tsx` - merged with LongGame, keeps trend indicators and technique evolution

---

## Module Reduction Summary

| Belt | Before | After | Modules Archived |
|------|--------|-------|------------------|
| White | 3 | 2 | JourneyTimeline, ConsistencyScore → YourProgress |
| Blue | 4 belt-specific + 3 shared | 2 + 1 | YourStyle, VulnerabilityMap + Sparring Dominance grid + cards |
| Purple+ | 3 | 2 | LongGame, SubmissionTrends → YourJourney |

---

## If You Need to Restore

These modules are fully functional. To restore:
1. Move the `.tsx` file back to parent directory
2. Re-add export to `index.ts`
3. Import and render in `Dashboard.tsx`

Note: The data utilities these modules used are still exported from `../../../data/stats-modules`.
