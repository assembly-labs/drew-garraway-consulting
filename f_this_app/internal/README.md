# F*** This App! - Internal Documentation

> **Status:** MVP Complete | **Version:** 0.1.0 | **Last Updated:** December 25, 2024

---

## Recent Work: Testing & Demo Infrastructure (Dec 25, 2024)

### What Was Built

We created a comprehensive testing and demo environment to simulate all user journeys before shipping:

#### 1. Dev Mode System
- **Auth Bypass:** Added `?dev=true` query param and `dev_mode` cookie to bypass Supabase authentication
- **Mock Data Injection:** Zustand store auto-populates with test users, games, players, and stats
- **Middleware Update:** `src/middleware.ts` now checks for dev mode and allows access to protected routes

#### 2. UX Journey Map (`/ux-journey.html`)
Interactive HTML page mapping all user flows:
- 8 complete user journeys visualized as clickable flowcharts
- Tester notes (hover on `?` badges) explaining what to verify at each step
- Quick scenario cards for testing specific states (lobby, 2x mode, cease-fire, etc.)
- Direct links to all screens with dev mode enabled

#### 3. Product Marketing Page (`/product.html`)
Single-scrolling marketing page:
- Value proposition hook and gameplay explanation
- Interactive curse button demo
- Feature highlights, mascot introductions, scoring breakdown
- Use cases and social proof sections
- Final CTAs linking to signup and demo

#### 4. Dev Hub (`/dev`)
React page serving as navigation hub:
- Links to all app screens with mock data
- Test scenario guides (Full Game Flow, Admin Flow, Stats Flow)
- Mock data overview showing loaded test state

#### 5. Extended Mock Data
- `src/lib/dev/mock-data.ts` - Core mock users, games, players, reports
- `src/lib/dev/mock-scenarios.ts` - Multiple test scenarios (newUser, activePlayer, lobby, 2x mode, cease-fire, completed game)
- `src/lib/dev/use-dev-mode.ts` - Custom hook for pages to load mock data

### Files Created/Modified

| File | Purpose |
|------|---------|
| `src/app/dev/page.tsx` | Dev navigation hub |
| `src/lib/dev/mock-data.ts` | Core mock data |
| `src/lib/dev/mock-scenarios.ts` | Extended test scenarios |
| `src/lib/dev/use-dev-mode.ts` | Dev mode hook |
| `src/middleware.ts` | Auth bypass for dev mode |
| `public/ux-journey.html` | UX Journey map |
| `public/product.html` | Marketing page |
| `src/app/(main)/home/page.tsx` | Dev mode support added |
| `src/app/(main)/game/[gameId]/page.tsx` | Dev mode support added |
| `src/app/(main)/game/[gameId]/leaderboard/page.tsx` | Dev mode support added |
| `src/app/(main)/game/[gameId]/stats/page.tsx` | Dev mode support added |
| `src/app/(main)/profile/page.tsx` | Dev mode support added |

### How to Use

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/ux-journey.html (journey map)
3. Or: http://localhost:3000/dev (dev hub)
4. Or: http://localhost:3000/product.html (marketing page)
5. Any screen with `?dev=true` works without authentication

---

## What We've Built

### Core Concept
"F*** This App!" is a social accountability game where players compete to curse the LEAST (golf-style scoring). Friends report each other's slip-ups, creating peer accountability wrapped in playful competition with dual mascot characters (Sunny the Clean Mouth vs. Filthy Phil the Dirty Mouth).

### MVP Features (Complete)

#### Authentication & Onboarding
- Full authentication system (Google, Apple, Email via Supabase)
- Onboarding carousel explaining game mechanics
- Player profile with all-time statistics

#### Game Creation & Management
- Game creation flow with 5 presets:
  - **Family Friendly** - 2x points around kids, Sunday 2x, nice word bonus
  - **Office Mode** - Weekday-only scoring, weekends are immunity
  - **Friend Group** - Standard scoring, pure chaos mode
  - **Hardcore** - No immunity, aggressive streak bonuses
  - **Custom** - Full control over all settings
- Join games via invite code
- Game lobby with real-time player list

#### Core Gameplay
- **THE BIG RED CURSE BUTTON** with pulsing animation
- Player selector modal for reporting curses
- Report success animation with Dirty Mouth quips
- Real-time leaderboard (individual and team views)
- Team mode with team leaderboards
- "Around Kids" mode (2x multiplier toggle)
- Nice Word of the Week bonus system (-1 point comeback mechanic)
- Weekly stats recap modal
- Streak tracking (clean days/weeks)

#### Admin Features
- Set nice word of the week
- Cease-fire toggle
- End game functionality
- Remove players

#### Technical Infrastructure
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 with Framer Motion animations
- Zustand state management
- Supabase backend (Auth, PostgreSQL, Real-time)
- PWA manifest for mobile installability
- Cloudflare Pages deployment ready

---

## What's NOT Built Yet

Based on the implementation plan and research, these features are planned but not yet implemented:

### Phase 5: Beta Testing (Next Up)
- [ ] TestFlight/Play Console internal testing setup
- [ ] Analytics integration (user flows, retention tracking)
- [ ] Error monitoring and crash reporting
- [ ] User feedback collection mechanism
- [ ] Performance optimization based on real usage

### Phase 6: Native App Wrapper
- [ ] Capacitor integration for iOS/Android
- [ ] Push notifications via OneSignal
- [ ] App Store / Play Store submission
- [ ] App name finalization (avoiding profanity filters)

### Future Phases (Research-Validated)
- [ ] Money stakes / commitment contracts
- [ ] Anti-charity mechanism (money goes to org you hate if you fail)
- [ ] Team-vs-team competition mode
- [ ] Corporate wellness packages
- [ ] Audio detection (optional premium feature)
- [ ] Extended achievement system with unlockable content
- [ ] Streak freezes (earned or purchased)

---

## Where We Need to Go

### Immediate Priorities (Pre-Launch)

1. **Supabase Configuration**
   - Set up production Supabase project
   - Configure OAuth providers (Google, Apple)
   - Deploy database schema
   - Set up Row Level Security policies

2. **Environment Setup**
   - Configure production environment variables
   - Set up Cloudflare Pages deployment
   - Configure custom domain

3. **Testing**
   - Manual QA across all flows
   - Test real-time functionality under load
   - Cross-device/browser testing

### Short-Term Roadmap

1. **Beta Launch**
   - Deploy to limited friend groups for real-world testing
   - Collect feedback on gameplay loop
   - Monitor D1/D7/D30 retention metrics
   - Validate peer-reporting mechanic works socially

2. **Iterate on Feedback**
   - Tune notification frequency
   - Adjust point multipliers based on engagement
   - Expand mascot quip library based on usage patterns

3. **Native Wrapper**
   - Integrate Capacitor for app store deployment
   - Implement push notifications
   - Submit to TestFlight and Play Store internal testing

### Long-Term Vision

1. **Money Stakes (Phase 2 per Research)**
   - Legal review with gaming attorney
   - PayPal approval for payouts
   - Geo-restriction for restricted states
   - Commitment contract model (charity stakes first)

2. **Scale & Monetization**
   - Freemium model: $3.99/month or $29.99/year
   - Premium features: team creation, streak freezes, extended stats
   - Corporate wellness B2B packages (59% of companies integrate habit apps)

3. **Market Expansion**
   - Speech therapy partnerships
   - Religious organization outreach
   - Parenting community marketing

---

## Key Metrics to Track

Based on research, these are critical success indicators:

| Metric | Industry Average | Target |
|--------|------------------|--------|
| D1 Retention | 23% | 40%+ |
| D7 Retention | 10% | 20%+ |
| D30 Retention | 5-7% | 15%+ |
| Virality (invites/user) | 0.3 | 1.0+ |
| Session Length | 2-3 min | 3-5 min |

**Research Finding:** If D7 retention exceeds 15% and users consistently invite friends, the foundation exists for full product expansion.

---

## File Structure

```
f_this_app/
├── src/
│   ├── app/                    # Next.js pages and routes
│   │   ├── (auth)/             # Login, signup, onboarding
│   │   ├── (main)/             # Game flows, profile, settings
│   │   └── page.tsx            # Landing page
│   ├── components/             # React components
│   │   ├── game/               # Curse button, leaderboard, etc.
│   │   ├── ui/                 # Reusable UI components
│   │   └── characters/         # Mascot components
│   ├── lib/                    # Utilities and config
│   │   ├── constants/          # Presets, character quips
│   │   ├── supabase/           # Database client
│   │   └── utils/              # Helpers
│   ├── stores/                 # Zustand state management
│   └── types/                  # TypeScript definitions
├── internal/                   # Internal documentation
│   ├── README.md               # This file
│   └── research/               # Market research
├── fta-prd.md                  # Product Requirements Document
├── fta-implementation-plan.md  # 6-Phase Development Plan
└── SETUP.md                    # Developer setup guide
```

---

## Related Documents

- **[fta-prd.md](../fta-prd.md)** - Full product requirements and feature specs
- **[fta-implementation-plan.md](../fta-implementation-plan.md)** - Detailed 6-phase development plan
- **[SETUP.md](../SETUP.md)** - How to run locally and deploy
- **[research/](./research/)** - Market research and UX strategy report
- **[features/](./features/)** - Feature roadmap and detailed specs
  - [Feature Roadmap](./features/roadmap.md) - Full list of planned features
  - [Phase 2A: Retention](./features/phase-2a-retention.md) - Badges, recaps, streaks
  - [Phase 2B: Stakes](./features/stakes-and-consequences.md) - Money stakes + consequences

---

## Contact & Ownership

**Project Owner:** Drew Garraway Consulting
**Repository:** f_this_app (private)

---

*"The concept is sound. The market gap is real. Execution will determine everything."*
