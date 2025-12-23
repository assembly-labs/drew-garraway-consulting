# iOS TestFlight Deployment Checklist

## Quick Reference

**Current State:** Web prototype (React) - PRODUCTION READY
**Target:** iOS app on TestFlight
**Timeline:** 10-12 weeks
**Budget Range:** $34,000 - $66,000 (with developer)

---

## Pre-Phase: Web Prototype Readiness ✅ COMPLETE

### Infrastructure (Supabase-Ready)
- [x] TypeScript types match Supabase schema (`types/database.ts`)
- [x] API service layer abstraction (`services/api.ts`)
- [x] Auth service abstraction (`services/auth.ts`)
- [x] App config with feature flags (`config/app.ts`)
- [x] Centralized utilities (`utils/index.ts`)

### UI Components
- [x] Loading skeleton components (`ui/Skeleton.tsx`)
- [x] Toast notification system (`ui/Toast.tsx`)
- [x] 404 NotFound screen (`ui/NotFound.tsx`)
- [x] Error/Empty state components

### Accessibility
- [x] TabBar keyboard navigation (arrow keys)
- [x] ARIA labels on interactive elements
- [x] Focus states for all buttons
- [x] Screen reader support

### Design System
- [x] Matrix design tokens complete
- [x] All legacy CSS variables aliased
- [x] Animation keyframes centralized
- [x] Build passes with no errors

---

## Phase 1: Foundation (Weeks 1-3)

### Setup Accounts
- [ ] Purchase Apple Developer Account ($99/year)
- [ ] Create App Store Connect listing
- [ ] Create Supabase account (free tier)
- [ ] Create OpenAI API account (for voice transcription)
- [ ] Install Expo CLI locally

### Database Setup
- [ ] Create Supabase project
- [ ] Create `profiles` table
- [ ] Create `sessions` table
- [ ] Create `technique_progress` table
- [ ] Configure Row Level Security
- [ ] Set up email + Apple authentication

### Project Initialization
- [ ] Create new Expo project
- [ ] Configure TypeScript
- [ ] Connect to Supabase
- [ ] Set up basic navigation

**Phase 1 Complete When:** User can sign up, log in, see empty dashboard

---

## Phase 2: Core Features (Weeks 4-7)

### Voice Logging
- [ ] Integrate expo-av for recording
- [ ] Connect to OpenAI Whisper API
- [ ] Build voice recording UI
- [ ] Handle transcription display
- [ ] Add manual edit capability

### Session Management
- [ ] Create session in database
- [ ] Read sessions for history
- [ ] Update session details
- [ ] Delete sessions
- [ ] Migrate SessionCard component

### Dashboard
- [ ] Connect to real user stats
- [ ] Calculate streaks from database
- [ ] Show recent sessions
- [ ] Display training insights

### Profile & Settings
- [ ] Connect profile to database
- [ ] Implement progressive profiling
- [ ] Build settings screen
- [ ] Add logout functionality

**Phase 2 Complete When:** User can log a session with voice and see it in history

---

## Phase 3: Polish (Weeks 8-10)

### iOS Platform
- [ ] Configure app icons (1024x1024)
- [ ] Create splash screen
- [ ] Request microphone permission properly
- [ ] Add Apple Sign-In
- [ ] Implement haptic feedback

### Offline Support
- [ ] Cache sessions locally
- [ ] Queue changes when offline
- [ ] Sync when connection returns
- [ ] Show offline indicator

### Quality Assurance
- [ ] Set up Sentry crash reporting
- [ ] Add PostHog analytics
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 15 Pro Max (large screen)
- [ ] Fix any layout issues

**Phase 3 Complete When:** App works offline and has no critical bugs

---

## Phase 4: TestFlight Submission (Weeks 11-12)

### App Store Connect
- [ ] Write app description
- [ ] Prepare 6.5" screenshots (iPhone 15 Pro Max)
- [ ] Prepare 5.5" screenshots (iPhone 8 Plus)
- [ ] Set up TestFlight
- [ ] Add internal testers

### Build & Submit
- [ ] Run EAS build for iOS
- [ ] Submit to TestFlight via EAS Submit
- [ ] Monitor for review feedback
- [ ] Address any issues

### Testing
- [ ] Distribute TestFlight invites
- [ ] Create feedback collection form
- [ ] Monitor Sentry for crashes
- [ ] Document known issues

**Phase 4 Complete When:** App is live on TestFlight with active testers

---

## Technology Stack Summary

| Layer | Technology | Why |
|-------|------------|-----|
| Mobile App | React Native + Expo | Reuse React code, fast development |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage in one |
| Voice Transcription | OpenAI Whisper | Best accuracy for speech-to-text |
| Crash Reporting | Sentry | Industry standard, free tier |
| Analytics | PostHog | Privacy-friendly, free tier |
| Build/Deploy | Expo EAS | Handles iOS builds and submission |
| Web Hosting | Cloudflare Pages | Fast, free, your preference |

---

## Monthly Cost Projection

| Phase | Supabase | OpenAI | Apple | Total |
|-------|----------|--------|-------|-------|
| Development | Free | ~$10 | $8 | ~$18/mo |
| TestFlight (10 users) | Free | ~$20 | $8 | ~$28/mo |
| Launch (100 users) | Free | ~$50 | $8 | ~$58/mo |
| Growth (1000 users) | $25 | ~$100 | $8 | ~$133/mo |

---

## Key Contacts Needed

| Role | Purpose | When |
|------|---------|------|
| React Native Developer | Build the app | Phase 1 start |
| Apple Developer Account Owner | App Store access | Immediately |
| TestFlight Testers (5-10) | Beta testing | Phase 4 |

---

## Risk Mitigations

1. **Voice accuracy for BJJ terms**
   - Test with sample recordings early
   - Build a glossary prompt for Whisper

2. **App Store rejection**
   - Follow Human Interface Guidelines
   - Don't mention "beta" in app name

3. **Timeline slip**
   - Build in 2-week buffer per phase
   - MVP first, polish later

---

## Quick Decision Reference

**Q: React Native or Swift?**
A: React Native (Expo). Faster with our React codebase.

**Q: Firebase or Supabase?**
A: Supabase. Better for our relational data structure.

**Q: Custom backend or BaaS?**
A: Supabase (BaaS). Faster to market, scales well.

**Q: Expo managed or bare workflow?**
A: Managed. Simpler unless we hit limitations.

---

*See `IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md` for full details*
