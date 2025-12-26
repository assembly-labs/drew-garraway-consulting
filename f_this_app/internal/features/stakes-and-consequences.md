# Phase 2B: Stakes & Consequences

> **Sprint Focus:** Financial commitment + social consequences for maximum accountability
> **Status:** 📋 Planned
> **Dependencies:** Phase 2A (Retention & Virality)
> **Last Updated:** December 25, 2024

---

## Overview

Phase 2B introduces two powerful commitment mechanisms:
1. **Consequence Contracts** — Non-monetary stakes (dares, tasks, public embarrassment)
2. **Money Stakes** — Pool real money with winner takes the pot

These can work independently or together for maximum pressure.

---

## Feature 4: Consequence Contracts & Loser Dares

### The Big Idea

Before a game starts, players collectively agree on **consequences for the loser(s)**. This is "Truth or Dare meets habit tracking" — a unique differentiator no competitor offers.

### Consequence Tiers

**Tier 1 — Silly/Social:**
| Consequence | Example |
|-------------|---------|
| Hair dye | Dye hair a color chosen by winner |
| Ridiculous outfit | Wear to work/school for a day |
| Embarrassing photo | Post one chosen by the group |
| Karaoke | Sing a song chosen by winner at next gathering |
| Profile pic | Change to whatever winner chooses (1 week) |

**Tier 2 — Service:**
| Consequence | Example |
|-------------|---------|
| Buy dinner/drinks | Winner's choice of restaurant |
| Do chores | Winner's chores for a week |
| Designated driver | For a month |
| Make breakfast | For the family for a week |

**Tier 3 — Public Accountability:**
| Consequence | Example |
|-------------|---------|
| Apology video | Public apology posted to stories |
| Shame shirt | Wear "I have a potty mouth" t-shirt for a day |
| Social takeover | Let winner write a post from your account |

### User Flow

**Game Setup:**
```
[Create Game]
    ↓
[Set Rules (preset or custom)]
    ↓
[NEW: Set Consequences]
    ├── Browse preset consequences
    ├── Create custom consequence
    └── Set severity level (silly/service/public)
    ↓
[All Players Agree]
    ├── Each player taps "I Accept This Consequence"
    ├── Game can't start until ALL accept
    └── Consequence is locked & visible during game
    ↓
[Game Active]
```

**End of Game:**
```
[Game Ends]
    ↓
[Winner Announced with Celebration]
    ↓
[Loser Reminded of Consequence]
    ├── "Time to pay up! You agreed to: [Consequence]"
    ├── Deadline set (e.g., 7 days to complete)
    └── Countdown timer visible to all players
    ↓
[Completion Flow]
    ├── Loser marks complete (optional photo/video proof)
    ├── Winner confirms completion
    ├── Added to "Wall of Shame" (opt-in public gallery)
    └── Badge earned: "Paid My Dues"
    ↓
[Failure to Complete]
    ├── Public shaming notification to all players
    ├── Badge of dishonor on profile: "Welcher"
    └── Can't start new games until resolved
```

### Consequence Presets Library

**Categories:**
- 🎨 Appearance (hair, outfit, temporary tattoo)
- 🍽️ Food & Drink (buy dinner, cook for group)
- 🏠 Chores (cleaning, errands, tasks)
- 📱 Social Media (posts, profile changes)
- 🎤 Performance (karaoke, speech, dance)
- 💪 Physical (workout challenges, exercise)

**Community-Submitted:**
- User-submitted consequences (moderated)
- Upvote/downvote system
- "Trending" consequences section
- Filter by: severity, group type, indoor/outdoor

### UI Components

**Consequence Selection Screen:**
```
┌─────────────────────────────────────┐
│   📋 SET THE STAKES                 │
│                                     │
│   What happens to the loser?        │
│                                     │
│   [🎨 Appearance]  [🍽️ Food]        │
│   [🏠 Chores]      [📱 Social]      │
│   [🎤 Performance] [💪 Physical]    │
│                                     │
│   ────────── OR ──────────          │
│                                     │
│   [✏️ Create Custom Consequence]    │
│                                     │
│   Popular this week:                │
│   • "Dye hair loser's choice"       │
│   • "Buy winner lunch for a week"   │
│   • "100 burpees on video"          │
└─────────────────────────────────────┘
```

**Consequence Agreement Modal:**
```
┌─────────────────────────────────────┐
│   ⚠️ CONSEQUENCE AGREEMENT          │
│                                     │
│   If you LOSE this game, you        │
│   agree to:                         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ 🎨 DYE YOUR HAIR            │   │
│   │                             │   │
│   │ Color chosen by winner.    │   │
│   │ Must keep for 1 week.      │   │
│   │                             │   │
│   │ Deadline: 7 days after     │   │
│   │ game ends                   │   │
│   └─────────────────────────────┘   │
│                                     │
│   By tapping "I Accept," you        │
│   commit to this consequence.       │
│                                     │
│   [DECLINE]      [I ACCEPT ✓]       │
│                                     │
│   3 of 5 players have accepted      │
└─────────────────────────────────────┘
```

### Database Schema

```sql
-- Consequence templates
CREATE TABLE consequence_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  severity VARCHAR(20), -- 'silly', 'service', 'public'
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  is_approved BOOLEAN DEFAULT TRUE, -- for community submissions
  use_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game consequences
CREATE TABLE game_consequences (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  consequence_template_id UUID REFERENCES consequence_templates(id),
  custom_description TEXT, -- if custom
  deadline_days INT DEFAULT 7,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player agreement tracking
CREATE TABLE consequence_agreements (
  game_id UUID REFERENCES games(id),
  user_id UUID REFERENCES users(id),
  agreed_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (game_id, user_id)
);

-- Completion tracking
CREATE TABLE consequence_completions (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  loser_id UUID REFERENCES users(id),
  proof_url TEXT, -- photo/video URL
  completed_at TIMESTAMP,
  confirmed_by UUID REFERENCES users(id), -- winner confirms
  confirmed_at TIMESTAMP,
  is_disputed BOOLEAN DEFAULT FALSE
);
```

### Why This Matters

| Factor | Impact |
|--------|--------|
| **Lower Barrier** | Not everyone wants to risk money, but EVERYONE fears public embarrassment |
| **Viral Gold** | "Watch Alex dye his hair pink because he lost" = CONTENT |
| **Social Pressure** | Knowing the consequence makes every report feel weightier |
| **Shareability** | Proof photos/videos are inherently shareable |
| **Differentiation** | No habit app combines behavior tracking with dare mechanics |
| **Humor** | Aligns perfectly with our playful, roasting brand voice |

### Psychology Research

- **Public commitment** increases follow-through by 65% vs private goals
- **Social witnesses** create accountability pressure without financial stakes
- **Loss aversion** applies to social capital (reputation), not just money
- **Pre-commitment** (agreeing upfront) eliminates wiggle room later

### Viral Mechanics

**Built-in Sharing:**
- "Share Consequence" button throughout game
- Auto-generated "I'm on the hook for [X] if I lose" story cards
- Completion proof formatted for social sharing
- "Witness this consequence" invite links

**Wall of Shame Gallery:**
- Public opt-in gallery of completed consequences
- Vote on best/funniest consequences
- Weekly "Consequence of the Week" highlight
- Featured consequence stories in-app

### Revenue Opportunities

| Feature | Price |
|---------|-------|
| Custom consequence templates | $0.99 |
| Extended deadline (grace period) | $1.99 |
| "Consequence Insurance" (pay to escape) | $4.99 |
| AR filters for proof photos | $0.99 |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Players don't follow through** | Social pressure + badge of dishonor + game lock |
| **Consequences too extreme** | Severity tiers, moderation, community guidelines |
| **Bullying potential** | All players must agree; dispute option available |
| **Legal liability** | Clear terms: we track, we don't enforce |

---

## Feature 5: Money Stakes

### The Big Idea

Pool real money into games. Lowest score at the end of the period wins the pot (minus platform fee). Based on StepBet model that's paid out $200M+.

### Stake Options

| Stake Level | Per Player | Min Players | Platform Fee |
|-------------|------------|-------------|--------------|
| Low | $5 | 2 | 15% |
| Standard | $20 | 3 | 15% |
| High | $50 | 4 | 15% |
| Custom | $5-$100 | 2 | 15% |

### Money Flow

```
[Game Creation]
    ↓
[Set Stakes Amount]
    ↓
[Players Join + Pay via PayPal/Stripe]
    ↓
[Funds Held in Escrow]
    ↓
[Game Plays Out]
    ↓
[Game Ends]
    ├── Winner gets pot (minus 15% fee)
    ├── Tie: Split pot among tied players
    └── All quit: Refund minus 5% admin fee
    ↓
[Payout via PayPal]
```

### Anti-Charity Mode (Alternative)

Instead of winner taking the pot, loser's money goes to an organization they **hate**:
- Increases success rates by **630%** (Stickk research)
- Player selects their "anti-charity" at game start
- If they lose, donation is made automatically
- Receipt/proof provided

**Popular Anti-Charities (Example Categories):**
- Political organizations (opposite party)
- Sports team rivals' charities
- Controversial causes

### Legal Considerations

**Why This Isn't Gambling:**
- Gambling requires: consideration + prize + **chance**
- Our outcome is determined by **skill/effort**, not chance
- Similar to StepBet, DietBet, Stickk (all legal)

**State Restrictions:**
| State | Status |
|-------|--------|
| Utah | Block entirely (constitutional prohibition) |
| Florida | Block (wagering on skill games prohibited) |
| Arizona, Arkansas, Connecticut, Delaware, Louisiana, Montana, South Carolina, South Dakota, Tennessee | Restricted (geo-fence) |
| All others | Allowed |

**Required Steps:**
1. Legal review with gaming attorney
2. PayPal merchant approval (application required)
3. Geo-restriction infrastructure
4. Clear "commitment contract" framing (not betting)
5. 17+ age rating on app stores

### Payment Processing

**Option 1: PayPal (Recommended)**
- Used by StepBet, DietBet
- Requires merchant approval for this use case
- Supports payouts and refunds
- User familiarity

**Option 2: Stripe (Backup)**
- May reject as "skill gaming" (see 2023 esports crackdown)
- Application required; uncertain approval
- Better developer experience if approved

### Database Schema

```sql
-- Money games
CREATE TABLE money_games (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  stake_amount DECIMAL(10,2) NOT NULL,
  total_pot DECIMAL(10,2) DEFAULT 0,
  platform_fee_percent DECIMAL(5,2) DEFAULT 15.00,
  payout_status VARCHAR(20) DEFAULT 'pending',
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  game_id UUID REFERENCES games(id),
  type VARCHAR(20), -- 'stake', 'payout', 'refund'
  amount DECIMAL(10,2),
  payment_provider VARCHAR(20), -- 'paypal', 'stripe'
  provider_transaction_id VARCHAR(100),
  status VARCHAR(20), -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP DEFAULT NOW()
);

-- User payment methods
CREATE TABLE user_payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider VARCHAR(20),
  provider_customer_id VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Why This Matters

| Factor | Impact |
|--------|--------|
| **Effectiveness** | Financial stakes improve success by 300% |
| **Differentiation** | No curse app has this; StepBet model proven |
| **Revenue** | 15% platform fee is industry standard |
| **Motivation** | Anti-charity mechanism increases success by 630% |

---

## Feature 6: Head-to-Head Quick Challenges

### The Big Idea

Challenge a single friend to a 24-hour or weekend curse-off. Quick, low-commitment PvP with optional stakes.

### Challenge Types

| Type | Duration | Best For |
|------|----------|----------|
| Quick | 24 hours | Dinner bets, road trips |
| Weekend | Fri 6pm - Sun 6pm | Weekend plans |
| Work Week | Mon 9am - Fri 5pm | Office challenges |
| Custom | 1-7 days | Flexible |

### Flow

```
[Challenge a Friend]
    ↓
[Select Opponent]
    ↓
[Set Duration]
    ↓
[Set Stakes (Optional)]
    ├── None (bragging rights only)
    ├── Consequence (from library)
    └── Money ($5-$50)
    ↓
[Opponent Accepts]
    ↓
[Challenge Active]
    ├── Both can report each other
    ├── Live score visible
    └── Notifications on reports
    ↓
[Time Ends]
    ↓
[Winner Announced]
    ├── Badge: "1v1 Champion"
    └── Stakes resolved
```

### UI Components

**Challenge Invite:**
```
┌─────────────────────────────────────┐
│   ⚔️ YOU'VE BEEN CHALLENGED!        │
│                                     │
│   [Opponent Avatar]                 │
│   @OpponentName                     │
│                                     │
│   wants to see who has the          │
│   cleaner mouth this weekend.       │
│                                     │
│   Duration: 48 hours                │
│   Stakes: Loser buys dinner         │
│                                     │
│   [DECLINE]      [ACCEPT ⚔️]        │
└─────────────────────────────────────┘
```

### Why This Matters

| Factor | Impact |
|--------|--------|
| **Accessibility** | Not everyone can commit to week-long games |
| **Engagement** | Quick wins create dopamine hits |
| **Onboarding** | Great way to convert a skeptical friend |
| **Competition** | 1v1 is the most intense format |

---

## Combining Stakes

### The Killer Feature: Money + Consequences

For maximum accountability, combine both mechanisms:

**Option A: Winner Gets Both**
- Winner gets the pot
- AND loser does the consequence

**Option B: Consequence Instead of Money**
- No money stakes
- But consequence is mandatory
- Lower barrier to entry

**Option C: Buy Your Way Out**
- Loser can pay to escape consequence
- Winner gets the escape fee instead
- Creates interesting end-game dynamics

---

## Phase 2B Summary

| Feature | Dev Weeks | Primary Impact | Dependencies |
|---------|-----------|----------------|--------------|
| Consequence Contracts | 2-3 | Virality, engagement | None |
| Money Stakes | 3-4 | Revenue, effectiveness | Legal review, PayPal approval |
| Head-to-Head | 1-2 | Activation, virality | Consequence contracts |
| **TOTAL** | **6-9** | | |

### Success Metrics

| Metric | Target |
|--------|--------|
| Games with consequences | 60%+ |
| Consequence completion rate | 85%+ |
| Money games adoption | 20% of active users |
| Average pot size | $50+ |
| 1v1 challenges/week | 2+ per active user |
| Viral shares from consequences | 3+ per game |

---

## Implementation Order

1. **Consequence Contracts** (no money, lower risk)
   - Consequence library + templates
   - Agreement flow
   - Completion tracking
   - Wall of Shame

2. **Head-to-Head Challenges** (uses consequences)
   - 1v1 game mode
   - Quick duration options
   - Consequence integration

3. **Money Stakes** (requires legal, payment infrastructure)
   - Legal review
   - PayPal merchant application
   - Geo-restriction system
   - Payment flow
   - Payout system

---

*"The research is clear: financial commitment + social accountability = 3x success rates. These features make the stakes real."*
