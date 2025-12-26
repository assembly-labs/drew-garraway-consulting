# Phase 2A: Retention & Virality Features

> **Sprint Focus:** Reduce churn, increase shareability, build habit loops
> **Status:** 📋 Planned
> **Estimated Effort:** 2-3 weeks total
> **Last Updated:** December 25, 2024

---

## Overview

Phase 2A focuses on three high-impact, low-effort features that directly address retention and organic growth. All three leverage proven mechanics from successful habit apps (Duolingo, Habitica, StepBet).

---

## Feature 1: Achievement Badges

### Summary
Unlock badges for specific accomplishments that display on profiles and can be shared.

### Badge Library

| Badge | Name | Requirement | Rarity |
|-------|------|-------------|--------|
| 🏆 | Clean Mouth Champion | Won 3 games | Uncommon |
| 🕵️ | Snitch King | Filed 100 reports | Common |
| 🔄 | Redemption Arc | Went from last place to first | Rare |
| 💪 | Ironman | 30-day clean streak | Epic |
| ✨ | Nice Word Ninja | Used nice word 50 times | Common |
| 💀 | Potty Mouth Legend | Most curses in a single week | Legendary |
| 🥇 | Undefeated | Won 5 games in a row | Epic |
| 👀 | Eagle Eye | Caught someone within 5 sec of cursing | Rare |
| 🏃 | Comeback Kid | Won after being 10+ points behind | Rare |
| 🎯 | Perfect Week | 0 curses + 3 nice words in one week | Epic |

### Implementation Notes

**Database Schema:**
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  rarity VARCHAR(20),
  criteria JSONB -- flexible criteria definition
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  game_id UUID REFERENCES games(id), -- which game earned it
  PRIMARY KEY (user_id, badge_id)
);
```

**UI Components:**
- Profile badge showcase (grid display)
- Badge unlock animation (modal + confetti)
- Badge tooltip with earn date and criteria
- "Share Badge" button → generates shareable image

### Why This Matters

| Factor | Impact |
|--------|--------|
| **Retention** | Collection mechanics drive long-term engagement |
| **Social Proof** | Badges create sharing moments and FOMO |
| **Identity** | Players develop personas ("I'm a snitch, that's my thing") |
| **Content** | Adds progression without changing core loop |

### Dev Effort: LOW (~3-5 days)
- Badge definitions and DB schema
- Trigger logic for badge unlocks
- Profile UI updates
- Unlock animation modal
- Share image generation

---

## Feature 2: Shareable Weekly Recaps

### Summary
Generate beautiful, branded image cards summarizing weekly performance for easy sharing on social media.

### Recap Card Content

**Winner Card:**
```
┌─────────────────────────────────────┐
│      🏆 WEEKLY CHAMPION 🏆          │
│                                     │
│         [Avatar]                    │
│      "Player Name"                  │
│                                     │
│   📊 FINAL SCORE: 3 points         │
│   🔥 Streak: 12 days                │
│   ✨ Nice Words: 5                  │
│                                     │
│   "Crushed it in [Game Name]"       │
│                                     │
│   [Sunny mascot celebrating]        │
│                                     │
│   F*** THIS APP! 🎮                 │
└─────────────────────────────────────┘
```

**Loser Card (Self-deprecating):**
```
┌─────────────────────────────────────┐
│      💀 POTTY MOUTH AWARD 💀        │
│                                     │
│         [Avatar]                    │
│      "Player Name"                  │
│                                     │
│   📊 FINAL SCORE: 47 points        │
│   ❌ Streak: broken on Day 2       │
│   🤬 Worst Day: Tuesday (12 pts)   │
│                                     │
│   "At least I'm consistent"         │
│                                     │
│   [Filthy Phil roasting]            │
│                                     │
│   F*** THIS APP! 🎮                 │
└─────────────────────────────────────┘
```

### Sharing Flow

```
[Week Ends]
    ↓
[Stats Recap Modal]
    ↓
[View Full Recap Card]
    ↓
[Share Button]
    ├── Copy Image
    ├── Share to Instagram Stories
    ├── Share to Twitter/X
    ├── Share to iMessage
    └── Save to Photos
```

### Implementation Notes

**Image Generation Options:**
1. **Server-side (recommended):** Use Puppeteer/Playwright to render HTML → PNG
2. **Client-side:** Use html2canvas or dom-to-image library
3. **API service:** Use Cloudinary or similar for templated images

**Storage:**
- Generate and cache recap images at week end
- Store in Supabase Storage or Cloudflare R2
- Keep for 30 days, then delete

### Why This Matters

| Factor | Impact |
|--------|--------|
| **Virality** | Shared content = free marketing |
| **Social Proof** | Public accountability amplifies commitment |
| **Fun** | Weekly roasts become anticipated social moments |
| **Brand** | Every share spreads Sunny and Filthy Phil |

### Dev Effort: LOW (~4-6 days)
- Recap card HTML/CSS templates
- Image generation pipeline
- Share button integrations
- Social media meta tags for link previews

---

## Feature 3: Streak Freeze & Recovery

### Summary
Allow players to earn or purchase "streak freezes" that protect their clean streak from a single slip-up.

### How to Earn Freezes

| Method | Freezes Earned |
|--------|----------------|
| 7-day clean streak | +1 freeze |
| Use nice word 5 times in one week | +1 freeze |
| Win a game | +1 freeze |
| Complete weekly challenge | +1 freeze |
| **Purchase** | $0.99 = 1 freeze, $1.99 = 3 freezes |

### How Freezes Work

```
[Player Gets Reported]
    ↓
[Has Freeze Available?]
    ├── YES → [Use Freeze?]
    │           ├── YES → Streak preserved, -1 freeze
    │           └── NO  → Streak broken, points added
    └── NO  → Streak broken, points added
```

### Freeze Limits

- Maximum 3 freezes stored at once
- Maximum 1 freeze used per week
- Freezes don't expire

### UI Elements

**Streak Display (with freeze indicator):**
```
🔥 14-day streak  ❄️ 2 freezes available
```

**Freeze Prompt (on report):**
```
┌─────────────────────────────────────┐
│   😱 YOU GOT REPORTED!              │
│                                     │
│   Your 14-day streak is at risk.   │
│                                     │
│   ❄️ Use a Streak Freeze?          │
│                                     │
│   [USE FREEZE]     [ACCEPT FATE]   │
│                                     │
│   You have 2 freezes remaining     │
└─────────────────────────────────────┘
```

### Implementation Notes

**Database Schema:**
```sql
ALTER TABLE game_players ADD COLUMN freeze_count INT DEFAULT 0;
ALTER TABLE game_players ADD COLUMN freeze_used_this_week BOOLEAN DEFAULT FALSE;

CREATE TABLE freeze_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_id UUID REFERENCES games(id),
  type VARCHAR(20), -- 'earned', 'purchased', 'used'
  reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Why This Matters

| Factor | Impact |
|--------|--------|
| **Retention** | Prevents rage-quits from broken streaks |
| **Engagement** | Creates new goals ("earn 2 more to get a freeze") |
| **Monetization** | Classic freemium hook |
| **Psychology** | Gives users sense of control and safety net |

**Research:** Duolingo's data shows users are **2.3x more likely** to engage daily once they have a 7-day streak. Streaks become identity. Breaking one causes churn.

### Dev Effort: LOW (~3-4 days)
- Freeze tracking in DB
- Earn logic triggers
- Report flow modification
- Freeze prompt UI
- (Optional) Purchase flow for premium

---

## Phase 2A Summary

| Feature | Dev Days | Primary Impact |
|---------|----------|----------------|
| Achievement Badges | 3-5 | Long-term retention |
| Shareable Recaps | 4-6 | Organic growth |
| Streak Freeze | 3-4 | Churn prevention |
| **TOTAL** | **10-15** | |

### Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| D7 Retention | — | 20%+ |
| D30 Retention | — | 15%+ |
| Social shares/user | 0 | 1.5+ |
| Streak freeze usage | — | 40% of eligible |
| Badge unlock rate | — | 3+ badges/user in first month |

---

## Next Steps

1. Finalize badge library and criteria
2. Design recap card templates (brand alignment)
3. Choose image generation approach
4. Implement freeze earning logic
5. QA across all flows
6. Ship to beta testers

---

*"These three features address the #1 challenge in habit apps: retention. If we nail Phase 2A, Phase 2B has a foundation to build on."*
