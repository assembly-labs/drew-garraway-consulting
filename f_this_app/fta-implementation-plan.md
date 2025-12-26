# F*** This App! — Implementation Plan

## Philosophy

**Prototype First, Build Second.**

We validate every screen and flow with a clickable prototype before writing production code. This lets us test assumptions, gather feedback, and iterate cheaply before committing engineering resources to a full build.

---

## Phase Overview

| Phase | Focus | Duration | Output |
|-------|-------|----------|--------|
| **Phase 1** | Screen Design & Clickable Prototype | 1-2 weeks | Figma prototype, tested with 5-10 users |
| **Phase 2** | Prototype Validation & Iteration | 1 week | Revised prototype, confirmed UX |
| **Phase 3** | Technical Foundation | 1 week | Stack selected, project scaffolded, CI/CD ready |
| **Phase 4** | MVP Development | 3-4 weeks | Working PWA, core features functional |
| **Phase 5** | Beta Testing | 1-2 weeks | Bug fixes, polish, real-world validation |
| **Phase 6** | Native App Wrapper & Store Submission | 2-3 weeks | iOS + Android apps live |

**Total Timeline: 10-14 weeks** (prototype to app stores)

---

## Phase 1: Screen Design & Clickable Prototype

### Goal
Design all screens and create a clickable prototype that simulates the full user experience. No code yet—just validate the flow feels right.

### Screen Inventory

#### 1.1 Onboarding & Auth
| Screen | Description | Key Elements |
|--------|-------------|--------------|
| **Splash** | App launch screen | Logo, tagline, Dirty Mouth character peek |
| **Sign Up / Login** | Account creation | Social login (Google, Apple), email option |
| **Onboarding Carousel** | 3-4 slides explaining the game | Character intros, how scoring works, CTA to create/join game |

#### 1.2 Game Setup Flow
| Screen | Description | Key Elements |
|--------|-------------|--------------|
| **Home (No Active Game)** | Empty state, prompts to create or join | "Create Game" CTA, "Join Game" CTA, character illustration |
| **Create Game - Name** | Name the game | Text input, auto-generated funny name option |
| **Create Game - Preset Selection** | Choose rule preset | Cards: Family Friendly, Office Mode, Friend Group, Hardcore, Custom |
| **Create Game - Custom Rules** (if Custom) | Configure all settings | Toggles/dropdowns: multiplier days, immunity windows, streaks, nice word |
| **Create Game - Mode Selection** | Free-for-all vs Teams | Toggle or card selection |
| **Create Game - Team Setup** (if Teams) | Create teams, assign players later | Team name inputs, color selection |
| **Create Game - Invite Players** | Share invite link | Copy link button, share sheet, SMS/text option |
| **Join Game** | Enter via link or code | Code input field, or deep link auto-join |
| **Waiting Room / Lobby** | See who's joined before game starts | Player list, avatars, "Start Game" button (admin only) |

#### 1.3 Core Gameplay
| Screen | Description | Key Elements |
|--------|-------------|--------------|
| **Home (Active Game)** | Main gameplay hub | **Big Curse Button** (center), current score, leaderboard preview, game status bar |
| **Report Flow - Player Select** | Choose who cursed | Scrollable player list with avatars, recent curse count badges |
| **Report Flow - Confirm** | Confirm the report | Player name/avatar, "Report" and "Cancel" buttons, multiplier indicator if active |
| **Report Flow - Success** | Confirmation + character moment | Dirty Mouth quip, points animation, dismiss |
| **Around Kids Toggle** | Activate 2x mode | Toggle switch with explanation, visual state change |
| **Nice Word Modal** | Report using the nice word | Word displayed, "I Used It" button, remaining uses today |

#### 1.4 Leaderboard & Stats
| Screen | Description | Key Elements |
|--------|-------------|--------------|
| **Leaderboard (Full)** | All players ranked | Rank, avatar, name, score, streak indicator, "You" highlight |
| **Leaderboard - Teams View** (if Teams mode) | Team standings | Team scores, expandable to see individual members |
| **Weekly Recap Modal** | End of week summary | Winner callout, loser roast, personal stats, trends, character animations |
| **Player Detail** | Tap a player to see their stats | Total curses, curses this week, streak, reports filed |

#### 1.5 Profile & Settings
| Screen | Description | Key Elements |
|--------|-------------|--------------|
| **My Profile** | Personal stats and settings | Avatar, display name, all-time stats, badges/trophies |
| **Edit Profile** | Change name/avatar | Text input, avatar picker or upload |
| **Game Settings** | Current game options | Notification prefs, leave game, view rules |
| **Admin Panel** (game creator only) | Manage game | Edit rules, remove players, set nice word, trigger cease-fire, end game |

#### 1.6 Notifications & Modals
| Screen | Description | Key Elements |
|--------|-------------|--------------|
| **Push Notification Templates** | Design notification styles | Report received, 2x day starting, streak achieved, recap ready |
| **Cease-Fire Active Modal** | Overlay when immunity is on | Timer (if timed), explanation, character (Clean Mouth) |
| **Streak Celebration Modal** | Clean day/week achieved | Confetti, Clean Mouth character, badge earned |

---

### Prototype Tooling

**Recommended: Figma**
- Design screens with components (buttons, cards, inputs)
- Link screens with clickable hotspots
- Create prototype flows for each journey
- Share link for remote user testing

**Alternative: Framer**
- More interactive fidelity if we want micro-animations
- Slightly higher learning curve

---

### Prototype Test Plan

#### Test Scenarios (5-10 users)
Each tester walks through these flows while thinking aloud:

| # | Scenario | What We're Validating |
|---|----------|----------------------|
| 1 | Sign up and create a new game using "Family Friendly" preset | Onboarding clarity, preset selection UX |
| 2 | Invite 2 friends to the game | Invite flow friction, link sharing |
| 3 | Report another player for cursing | Curse button visibility, report flow speed |
| 4 | Activate "Around Kids" mode and report a curse | 2x toggle discoverability, multiplier clarity |
| 5 | Use the Nice Word of the Week | Bonus mechanic understanding, flow clarity |
| 6 | Check the leaderboard and your stats | Information hierarchy, data clarity |
| 7 | Receive and understand a push notification | Notification copy tone, action clarity |
| 8 | View end-of-week recap | Stats comprehension, emotional response to characters |

#### Feedback Capture
- Record sessions (with permission) or take live notes
- Post-test survey: ease of use (1-5), fun factor (1-5), confusion points
- Track: time to complete each flow, error rates, verbal feedback

---

### Phase 1 Deliverables

- [ ] All screens designed in Figma (or chosen tool)
- [ ] Clickable prototype with linked flows
- [ ] Character illustrations (can be placeholder/simple for prototype)
- [ ] 5-10 user tests completed
- [ ] Feedback synthesis document

---

## Phase 2: Prototype Validation & Iteration

### Goal
Analyze test feedback, identify friction points, iterate on designs, re-test if needed.

### Activities

| Task | Description |
|------|-------------|
| **Feedback Synthesis** | Consolidate all tester feedback into themes |
| **Friction Mapping** | Identify screens/flows with highest confusion or drop-off |
| **Design Iteration** | Revise problem screens, simplify flows |
| **Stakeholder Review** | Walk through revised prototype with core team |
| **Re-test (if needed)** | 2-3 additional tests on revised flows |
| **Lock UX** | Finalize screen designs for dev handoff |

### Phase 2 Deliverables

- [ ] Feedback synthesis document
- [ ] Revised Figma prototype (v2)
- [ ] UX sign-off — flows locked for development
- [ ] Design specs exported (spacing, colors, typography)

---

## Phase 3: Technical Foundation

### Goal
Select tech stack, scaffold project, set up infrastructure before feature development begins.

### Tech Stack Recommendation (MVP)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) + React | Fast PWA, SSR for SEO, great DX |
| **Styling** | Tailwind CSS | Rapid UI development, consistent design |
| **State** | Zustand or React Context | Lightweight, sufficient for MVP |
| **Backend** | Supabase | Auth, Postgres DB, real-time subscriptions, push notifications |
| **Push Notifications** | Supabase + OneSignal (or Firebase Cloud Messaging) | Cross-platform push |
| **Hosting** | Vercel | Seamless Next.js deployment, preview URLs |
| **Native Wrapper (Phase 6)** | Capacitor | Wrap PWA for iOS/Android stores with minimal code changes |

### Infrastructure Setup

| Task | Description |
|------|-------------|
| **Repo Setup** | GitHub repo, branch protection, PR templates |
| **Project Scaffold** | Next.js app with folder structure, Tailwind configured |
| **Supabase Project** | Create project, configure auth providers (Google, Apple, email) |
| **Database Schema** | Implement data model from PRD (users, games, reports, etc.) |
| **Environment Config** | .env files, secrets management |
| **CI/CD Pipeline** | GitHub Actions → Vercel auto-deploy on push to main |
| **Staging Environment** | Preview deployments for testing |

### Phase 3 Deliverables

- [ ] GitHub repo with scaffold
- [ ] Supabase project with auth working
- [ ] Database tables created
- [ ] CI/CD pipeline functional
- [ ] Staging URL live (empty shell)

---

## Phase 4: MVP Development

### Goal
Build the working PWA with all MVP features functional.

### Sprint Breakdown (3-4 weeks)

#### Sprint 1: Auth & Game Setup (Week 1)
| Feature | Tasks |
|---------|-------|
| **Auth** | Sign up, login, logout (Google, Apple, email) |
| **User Profile** | Create profile, set display name, avatar |
| **Create Game** | Name, preset selection, custom rules config |
| **Game Modes** | Free-for-all and Teams setup |
| **Invite Flow** | Generate invite link, join via link |
| **Lobby** | Waiting room, player list, start game |

#### Sprint 2: Core Gameplay (Week 2)
| Feature | Tasks |
|---------|-------|
| **Home Screen** | Active game state, big curse button, score display |
| **Report Flow** | Player selection, confirmation, success state |
| **Scoring Engine** | Calculate points, apply multipliers |
| **Around Kids Mode** | Toggle, 2x multiplier when active |
| **Leaderboard** | Real-time ranking, team view |
| **Cease-Fire** | Immunity windows, block reporting during |

#### Sprint 3: Bonus Mechanics & Engagement (Week 3)
| Feature | Tasks |
|---------|-------|
| **Nice Word of the Week** | Admin sets word, players report usage, point reduction |
| **Streak Tracking** | Clean day/week detection, rewards |
| **Push Notifications** | Report received, 2x day, streak, recap reminder |
| **Weekly Recap** | Stats calculation, modal display |
| **Character Integration** | Dirty Mouth / Clean Mouth copy and static images |

#### Sprint 4: Polish & Edge Cases (Week 4)
| Feature | Tasks |
|---------|-------|
| **Admin Panel** | Edit rules, remove players, end game |
| **Settings** | Notification prefs, leave game |
| **Empty States** | No games, no players, no reports yet |
| **Error Handling** | Network failures, validation errors |
| **Loading States** | Skeletons, spinners |
| **Responsive Design** | Mobile-first, tablet/desktop passable |
| **PWA Config** | Manifest, service worker, install prompt |

### Phase 4 Deliverables

- [ ] Fully functional PWA
- [ ] All MVP features working
- [ ] PWA installable on mobile devices
- [ ] Internal QA completed
- [ ] Ready for beta testers

---

## Phase 5: Beta Testing

### Goal
Real-world testing with actual friend groups. Find bugs, validate engagement, gather feedback.

### Beta Recruitment
- 3-5 friend/family groups (4-6 players each)
- Mix of demographics (families, coworkers, friend groups)
- Total: 15-30 beta users

### Beta Activities

| Activity | Description |
|----------|-------------|
| **Onboarding** | Provide beta link, brief instructions |
| **Gameplay Period** | 1-2 weeks of active play |
| **Feedback Collection** | In-app feedback button, weekly check-in survey |
| **Bug Tracking** | GitHub Issues or linear for bug reports |
| **Usage Analytics** | Track key events (games created, reports filed, DAU/WAU) |
| **Debrief Interviews** | 15-min calls with 5-10 beta users |

### Success Criteria for Beta
- Games stay active for full week (not abandoned)
- Average 10+ reports per game per week
- No critical bugs blocking gameplay
- Net Promoter Score (NPS) > 30
- Users say they'd play again

### Phase 5 Deliverables

- [ ] Beta test completed (1-2 weeks)
- [ ] Bug list triaged and critical bugs fixed
- [ ] Feedback synthesis document
- [ ] Final polish pass based on feedback
- [ ] Production-ready PWA

---

## Phase 6: Native App Wrapper & Store Submission

### Goal
Wrap the PWA for iOS and Android app stores using Capacitor, submit for approval.

### Why Capacitor?
- Reuses 95%+ of PWA code
- Native access for push notifications, haptics
- Single codebase for both platforms
- Faster than rebuilding in Swift/Kotlin

### Native Wrapper Tasks

| Task | Description |
|------|-------------|
| **Capacitor Setup** | Add Capacitor to Next.js project |
| **iOS Build** | Configure Xcode project, signing, capabilities |
| **Android Build** | Configure Android Studio project, signing |
| **Native Plugins** | Push notifications, haptic feedback, share sheet |
| **App Icons & Splash** | Generate all required sizes |
| **Store Assets** | Screenshots, descriptions, keywords, preview video |

### App Store Submission

#### Apple App Store
| Task | Notes |
|------|-------|
| **Apple Developer Account** | $99/year, enroll if not already |
| **App Store Connect** | Create app listing |
| **TestFlight** | Internal testing before public submit |
| **Review Submission** | Expect 1-3 day review, possible rejection for name (have backup) |
| **Name Consideration** | May need clean version: "FTA!" or "Potty Mouth" or similar |

#### Google Play Store
| Task | Notes |
|------|-------|
| **Google Play Console** | $25 one-time, enroll if not already |
| **Store Listing** | Create app listing, upload assets |
| **Internal Testing Track** | Test before production |
| **Review Submission** | Usually faster than Apple, 1-2 days |

### Phase 6 Deliverables

- [ ] Capacitor builds working for iOS and Android
- [ ] Apps submitted to both stores
- [ ] Apps approved and live
- [ ] Launch announcement ready

---

## Resource Requirements

### Team (Minimum Viable)
| Role | Responsibility | Time Commitment |
|------|----------------|-----------------|
| **Product/Design** | Figma designs, prototype, UX decisions | Part-time (Phase 1-2), advisory after |
| **Full-Stack Dev** | Build everything | Full-time (Phase 3-6) |
| **QA/Beta Coordinator** | Test recruitment, feedback synthesis | Part-time (Phase 5) |

### Tools & Costs (Estimated)
| Tool | Cost |
|------|------|
| Figma | Free (starter) or $15/mo |
| Supabase | Free tier (MVP), ~$25/mo at scale |
| Vercel | Free tier (MVP), ~$20/mo at scale |
| OneSignal | Free tier (10k users) |
| Apple Developer | $99/year |
| Google Play | $25 one-time |
| **Total MVP Cost** | ~$150-200 (excluding labor) |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| App name rejected by stores | Have 2-3 backup names ready ("FTA!", "Potty Mouth Battle", "Clean Mouth Club") |
| Low engagement in beta | Add more game mechanics, increase notification frequency, revisit character voice |
| Abuse/false reporting | V1: honor system. V2: add dispute flow, rate limiting |
| Scope creep | Ruthlessly cut to MVP list, park everything else in "Post-MVP" |
| Tech issues with Capacitor | PWA remains functional fallback, users can add to home screen |

---

## Summary Timeline

```
Week 1-2:   Phase 1 — Design & Prototype
Week 3:     Phase 2 — Validate & Iterate
Week 4:     Phase 3 — Technical Foundation
Week 5-8:   Phase 4 — MVP Development
Week 9-10:  Phase 5 — Beta Testing
Week 11-13: Phase 6 — Native Apps & Store Launch
```

**Target: Prototype testable in 2 weeks. App stores in ~13 weeks.**

---

## Next Immediate Actions

1. **Confirm this plan** — Any adjustments before we start?
2. **Choose prototype tool** — Figma recommended, confirm or pick alternative
3. **Start screen designs** — I can generate wireframes/mockups to accelerate Phase 1
4. **Identify beta testers early** — Start recruiting friend groups now

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: Drew + Claude*
