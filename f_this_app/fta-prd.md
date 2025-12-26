# F*** This App! — Product Requirements Document

## Overview

**Product Name:** F*** This App! (FTA)

**Tagline:** "The game where your dirty mouth costs you."

**Concept:** A social accountability game where players compete to curse the *least*. Like golf, the lowest score wins. Players manually report each other's slip-ups, creating peer accountability wrapped in playful competition.

**Tone:** Fun, provocative, but ultimately supportive. We roast you for cursing, but we're cheering for you to clean it up.

---

## Brand & Characters

### Dual Mascot System

| Character | Name (TBD) | Personality | Role |
|-----------|------------|-------------|------|
| **Clean Mouth** | e.g., "Sunny" | Wholesome, encouraging, slightly smug | Celebrates streaks, clean days, nice word usage |
| **Dirty Mouth** | e.g., "Filthy Phil" | Provocative, chaotic, Bad Rudi energy | Roasts high scorers, announces curse reports, trash talks |

These characters appear in push notifications, weekly recaps, and in-app moments to keep the tone balanced between accountability and entertainment.

---

## Core User Flow

```
1. CREATE/JOIN GAME
   └── Set game name, invite players, configure rules (or use preset)

2. GAMEPLAY (Active Game)
   └── Big "CURSE" button always visible
   └── Tap → Select player who cursed → Confirm
   └── Points added to that player's score

3. END OF PERIOD (Week/Game)
   └── Stats recap delivered
   └── Winner celebrated, losers roasted
   └── New period begins or game ends
```

---

## Feature List (MVP)

### 1. Game Setup & Configuration

**1.1 Create Game**
- Game name (custom or auto-generated funny name)
- Invite players via link, SMS, or in-app search
- Set game duration: 1 week, 2 weeks, 1 month, ongoing
- Set game mode: Free-for-all (individual) OR Teams

**1.2 Quick Start Presets**
Dropdown presets so users can start playing fast:

| Preset | Description |
|--------|-------------|
| **Family Friendly** | 2x points around kids (always on), Sunday 2x, nice word bonus enabled |
| **Office Mode** | Weekday-only scoring, 9-5 immunity on weekends |
| **Friend Group** | Standard scoring, no multipliers, pure chaos |
| **Hardcore** | No immunity windows, 2x holidays, streak bonuses aggressive |
| **Custom** | Full control over all settings |

**1.3 Configurable Rules (if Custom)**
- Point multiplier days (Sundays, holidays, custom days)
- "Around Kids" 2x toggle (manual activation during game)
- Immunity/Cease-fire windows (recurring or one-time)
- Streak rewards (clean day/week bonuses)
- Nice Word of the Week bonus (on/off, point value)

---

### 2. Core Gameplay

**2.1 The Curse Button**
- Large, prominent button on home screen
- Satisfying tap interaction (haptic feedback, animation)
- Color: Red, pulsing subtly — tempting to press

**2.2 Report Flow**
```
[TAP CURSE BUTTON]
       ↓
[PLAYER SELECTOR]
- Scrollable list of all players in game
- Player avatars + names
- Recent curse count shown
       ↓
[CONFIRMATION]
"Report [Player Name] for cursing?"
[CANCEL] [CONFIRM]
       ↓
[SUCCESS ANIMATION]
Dirty Mouth character appears with quip
Points added to reported player
Push notification sent to offender
```

**2.3 Scoring**
- Base: +1 point per curse (higher = worse)
- 2x Multiplier: Active on configured bonus days or "Around Kids" mode
- Lowest score at end of period wins

**2.4 Around Kids Mode**
- Toggle in-app during gameplay
- When active, all curses reported = 2x points
- Visual indicator shows it's active
- Any player can activate (honor system)

---

### 3. Bonus Mechanics

**3.1 Nice Word of the Week**
- Game admin (or system) sets a "nice word" at start of each week
- Examples: "Splendid," "Wonderful," "Gosh darn"
- Players can self-report using the word (separate button or flow)
- Earns negative points (reduces score) — "comeback mechanic"
- Limited uses per day to prevent gaming (e.g., max 3/day)

**3.2 Streak Rewards**
- Clean Day: 0 curses reported = small point reduction or badge
- Clean Week: 0 curses all week = significant point reduction + trophy
- Streaks displayed on player profile

**3.3 Immunity Windows (Cease-Fire)**
- Configured at game setup (e.g., "Sundays 8am-12pm" for church)
- No curse reports allowed during window
- Visual indicator when cease-fire active
- Can also be triggered ad-hoc by game admin

---

### 4. Teams Mode

**4.1 Team Setup**
- Divide players into 2+ teams at game creation
- Team names customizable
- Balanced or custom team assignment

**4.2 Team Scoring**
- Team score = sum of all team members' individual scores
- Lowest team score wins
- Individual leaderboard still exists within team

**4.3 Team Dynamics**
- Team chat (stretch goal)
- Cross-team reporting (you report opponents AND teammates)
- Team streak bonuses

---

### 5. Leaderboards & Stats

**5.1 Live Leaderboard**
- Always accessible from home screen
- Shows all players ranked by score (lowest first)
- Visual indicators: streaks, recent curse, multiplier status

**5.2 End of Week Recap**
Delivered via push notification + in-app modal:

- 🏆 Winner announcement (Clean Mouth character celebrates)
- 💀 Biggest loser callout (Dirty Mouth character roasts)
- 📊 Personal stats:
  - Total curses this week
  - Curses reported by you
  - Multiplier curses (2x days)
  - Nice words used
  - Streak status
- 📈 Trend vs. last week
- 🗣️ Most-reported player
- 🕵️ Top snitch (most reports filed)

**5.3 All-Time Stats**
- Career curses
- Career wins
- Longest clean streak
- Lifetime nice words

---

### 6. Notifications & Engagement

**6.1 Push Notifications**
| Trigger | Message Example (Dirty Mouth voice) |
|---------|-------------------------------------|
| You got reported | "Ooooh [Name] caught you slipping! +1 point, potty mouth." |
| 2x day starting | "It's SUNDAY. Double points active. Watch your mouth. 😈" |
| Clean day achieved | "Well well well... a whole day without cursing? Boring, but impressive." |
| Weekly recap ready | "Week's over. Time to see who's the dirtiest of them all." |
| Nice word reminder | "This week's nice word is 'DELIGHTFUL.' Use it. Save yourself." |
| Cease-fire starting | "Cease-fire active. Your filthy mouth gets a break." |

**6.2 In-App Moments**
- Character animations on key actions
- Confetti for wins/streaks
- Shame animations for high scorers

---

### 7. User Profiles & Settings

**7.1 Player Profile**
- Display name
- Avatar (upload or select from presets)
- Current game stats
- All-time stats
- Badges/trophies earned

**7.2 Game Settings**
- Notification preferences
- Leave game option
- Mute specific players (still get reported, just no notifications)

**7.3 Admin Controls (Game Creator)**
- Edit game rules mid-game (with player notification)
- Remove players
- Set Nice Word of the Week
- Trigger ad-hoc cease-fire
- End game early

---

## Technical Considerations (MVP)

### Platform
- **MVP:** Mobile-first web app (PWA) for fastest cross-platform deployment
- **V2:** Native iOS + Android apps

### Backend Requirements
- User authentication (social login + email)
- Real-time score updates
- Push notification service
- Game state management
- Basic analytics/logging

### Data Model (Simplified)

```
USER
- id
- display_name
- avatar_url
- created_at

GAME
- id
- name
- creator_id
- mode (ffa | teams)
- preset_type
- settings (JSON: multipliers, immunity windows, etc.)
- status (active | completed)
- start_date
- end_date

GAME_PLAYER
- game_id
- user_id
- team_id (nullable)
- current_score
- streak_days

CURSE_REPORT
- id
- game_id
- reporter_id
- offender_id
- multiplier_applied
- points_awarded
- timestamp

NICE_WORD_LOG
- id
- game_id
- user_id
- word
- points_awarded
- timestamp

TEAM
- id
- game_id
- name
```

---

## MVP Scope Summary

### In Scope (MVP)
- [x] Create/join games via invite link
- [x] Quick-start presets (4-5 options)
- [x] Big curse button + player report flow
- [x] Basic scoring (+1 per curse)
- [x] 2x multiplier days (Sundays, holidays)
- [x] Around Kids 2x toggle
- [x] Immunity windows (preset)
- [x] Free-for-all mode
- [x] Basic teams mode
- [x] Live leaderboard
- [x] End of week stats recap
- [x] Nice Word of the Week bonus
- [x] Clean day/week streaks
- [x] Push notifications (key moments)
- [x] Dual mascot character presence (static images + copy)

### Out of Scope (Post-MVP)
- [ ] Audio monitoring / auto-detection
- [ ] Severity tiers (mild vs. hard curses)
- [ ] In-app team chat
- [ ] Native mobile apps
- [ ] Animated mascot characters
- [ ] Dispute/challenge system
- [ ] Custom curse word lists
- [ ] Integration with smart speakers/wearables
- [ ] Premium/paid features

---

## Success Metrics

| Metric | Target (MVP) |
|--------|--------------|
| Games created | 100 in first month |
| Avg. players per game | 4+ |
| Weekly active users (WAU) | 60% of registered |
| Curse reports per active game/week | 20+ |
| Week 2 retention | 40%+ |

---

## Open Questions

1. **Naming:** Is "F*** This App!" the final name? Consider app store implications.
2. **Monetization:** Free forever? Ads? Premium features later?
3. **Abuse prevention:** What stops mass false reporting? (MVP: honor system, V2: dispute flow)
4. **Character names:** Need to finalize Clean Mouth and Dirty Mouth character names and visual design.
5. **Holiday list:** Pre-configured or user-selected?

---

## Next Steps

1. **Finalize MVP feature set** — confirm nothing is missing
2. **Design mascot characters** — even simple versions for MVP
3. **Wireframe key screens** — Game setup, Home/Curse button, Report flow, Leaderboard, Stats recap
4. **Select tech stack** — Recommend for PWA: React/Next.js + Supabase or Firebase
5. **Build MVP sprint plan** — 2-4 week sprints

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: Drew + Claude*
