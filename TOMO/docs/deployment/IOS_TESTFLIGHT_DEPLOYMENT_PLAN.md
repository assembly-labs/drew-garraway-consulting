# BJJ Progress Tracker - iOS TestFlight Deployment Plan

## Executive Summary

This document outlines the complete path from our current React web prototype to a functioning iOS app on TestFlight. The current prototype is a polished web application with no native mobile capabilities or backend infrastructure. This plan addresses all gaps and provides a roadmap for deployment.

**Current State:** Production-quality web prototype (~10,500 lines of code)
**Target State:** iOS app ready for TestFlight testing
**Estimated Development Phases:** 4 phases

---

## Part 1: Current State Analysis

### What We Have (Assets)

| Category | Status | Notes |
|----------|--------|-------|
| UI/UX Design | ✅ Complete | Matrix design system, all screens built |
| Component Library | ✅ Complete | 43 React components, reusable patterns |
| User Flows | ✅ Complete | Onboarding, logging, history, progress |
| Data Models | ✅ Complete | Session, Technique, UserProfile types |
| Mock Data | ✅ Complete | Realistic sample data for all features |
| Brand Voice | ✅ Complete | Documented guidelines |
| Progressive Profiling | ✅ Complete | Smart data collection over time |

### What We're Missing (Gaps)

| Category | Status | Impact | Priority |
|----------|--------|--------|----------|
| Backend API | ❌ Missing | Critical - no data persistence | P0 |
| Database | ❌ Missing | Critical - data lost on app delete | P0 |
| User Authentication | ❌ Missing | Critical - no user accounts | P0 |
| Native Mobile App | ❌ Missing | Critical - can't submit to App Store | P0 |
| Real Voice Recording | ❌ Missing | High - core feature is mocked | P1 |
| Push Notifications | ❌ Missing | Medium - engagement feature | P2 |
| Crash Reporting | ❌ Missing | Medium - debugging in production | P2 |
| Analytics | ❌ Missing | Medium - usage insights | P2 |
| Offline Sync | ❌ Missing | Medium - gym usage pattern | P2 |
| Test Suite | ❌ Missing | Medium - quality assurance | P2 |

---

## Part 2: Technology Recommendations

### Mobile Framework: React Native with Expo

**Why Expo + React Native:**
1. **Code Reuse:** ~70% of our React components can be adapted
2. **Faster Development:** Pre-built native modules for common features
3. **Easier Deployment:** Expo Application Services (EAS) handles app builds
4. **Voice Support:** Excellent audio recording libraries available
5. **Over-the-Air Updates:** Push fixes without App Store review

**Alternative Considered:** Native Swift
- Pros: Best performance, full Apple feature access
- Cons: Complete rewrite, longer timeline, Swift expertise required
- Verdict: Not recommended for MVP timeline

### Backend Framework: Supabase

**Why Supabase:**
1. **Speed:** Database, auth, storage in one platform
2. **PostgreSQL:** Industry-standard, scalable database
3. **Built-in Auth:** Email, Apple Sign-In, social logins ready
4. **Real-time:** Live updates for future social features
5. **Edge Functions:** Serverless for voice transcription
6. **Cost:** Generous free tier, predictable scaling

**Alternative Considered:** Firebase
- Pros: Google backing, excellent documentation
- Cons: NoSQL complexity, vendor lock-in concerns
- Verdict: Supabase better for relational BJJ data

### Voice Transcription: AssemblyAI

**Why AssemblyAI (over OpenAI Whisper):**
1. **Better Proper Noun Handling:** 24% better accuracy on names/terms - critical for BJJ terminology (kimura, berimbolo, de la Riva)
2. **Lower Hallucination Rate:** 30% fewer hallucinations than Whisper - important when user is exhausted/mumbling
3. **Custom Vocabulary:** Can train on BJJ-specific terms for even better accuracy
4. **$50 Free Credits:** 135+ hours of transcription to test with (vs $5 for Whisper)
5. **Audio Intelligence Add-ons:** Topic detection could auto-categorize techniques
6. **99.95% Uptime SLA:** Production reliability guarantee
7. **Simple REST API:** Upload audio file → get transcript back

**Pricing:**
- Best tier: $0.0062/minute ($0.37/hour) - recommended for accuracy
- Nano tier: $0.002/minute ($0.12/hour) - budget option
- Estimated cost: ~$1.85/month per active user (100 sessions × 3 min)

**Alternative Considered:** OpenAI Whisper
- Pros: Slightly simpler API, good for clean audio
- Cons: Higher hallucination rate, no custom vocabulary, worse on proper nouns
- Verdict: AssemblyAI better for BJJ use case

### Hosting/Deployment: Cloudflare + Expo EAS

| Service | Use Case |
|---------|----------|
| Cloudflare Pages | Marketing website, web app version |
| Cloudflare Workers | API edge functions (optional) |
| Expo EAS Build | iOS/Android app compilation |
| Expo EAS Submit | App Store/TestFlight submission |
| Supabase Cloud | Database, auth, storage |

---

## Part 3: Third-Party Services Required

### Essential Services (Must Have for TestFlight)

| Service | Purpose | Cost (Estimate) |
|---------|---------|-----------------|
| Apple Developer Account | App Store access | $99/year |
| Expo (EAS) | Build and submit apps | Free tier available |
| Supabase | Database + Auth | Free tier (up to 500MB) |
| AssemblyAI | Voice transcription | ~$1.85/user/month (100 sessions × 3 min) |

### Recommended Services (Add Before Public Launch)

| Service | Purpose | Cost (Estimate) |
|---------|---------|-----------------|
| Sentry | Crash reporting | Free tier (5K events) |
| PostHog | Product analytics | Free tier (1M events) |
| RevenueCat | Subscription management | Free until revenue |
| Cloudflare | Web hosting, CDN | Free tier available |

### Optional Services (Future Enhancement)

| Service | Purpose | When Needed |
|---------|---------|-------------|
| OneSignal | Push notifications | User engagement phase |
| Algolia | Advanced search | Large technique library |
| Stripe | Payment processing | Monetization phase |

---

## Part 4: Development Phases

### Phase 1: Foundation (Weeks 1-3)

**Goal:** Backend infrastructure and authentication

**Tasks:**
1. Set up Supabase project
   - Create database tables (users, sessions, techniques)
   - Configure Row Level Security (data privacy)
   - Set up authentication (email + Apple Sign-In)

2. Initialize React Native/Expo project
   - Create new Expo project with TypeScript
   - Configure development environment
   - Set up EAS Build configuration

3. Migrate data models
   - Convert TypeScript interfaces to Supabase schema
   - Create database migration files
   - Set up seed data for testing

**Deliverables:**
- [ ] Supabase project with database schema
- [ ] Expo project with authentication flow
- [ ] User can sign up, log in, log out

---

### Phase 2: Core Features (Weeks 4-7)

**Goal:** Migrate all features to native app with real backend

**Tasks:**
1. Voice Recording Implementation
   - Integrate expo-av for audio recording
   - Connect to AssemblyAI for transcription
   - Configure custom vocabulary for BJJ terms
   - Build voice logger with real functionality

2. Session Logging
   - Connect session creation to Supabase
   - Migrate SessionLogger, TextLogger components
   - Implement session CRUD operations

3. Dashboard & History
   - Connect Dashboard to real user stats
   - Migrate SessionHistory with database queries
   - Implement SessionDetail view

4. User Profile
   - Connect profile to Supabase user table
   - Implement progressive profiling with backend
   - Migrate ProfileScreen, Settings

**Deliverables:**
- [ ] Working voice logger with transcription
- [ ] Sessions save to and load from database
- [ ] Dashboard shows real user statistics
- [ ] Profile data persists across sessions

---

### Phase 3: Polish & Platform Features (Weeks 8-10)

**Goal:** iOS-specific features and quality assurance

**Tasks:**
1. iOS Platform Integration
   - Request microphone permissions properly
   - Implement Apple Sign-In
   - Add haptic feedback for actions
   - Configure app icons and splash screen

2. Offline Support
   - Implement local caching with AsyncStorage
   - Add sync queue for offline sessions
   - Handle network status changes

3. Testing & Quality
   - Set up Sentry for crash reporting
   - Add basic analytics with PostHog
   - Manual testing on multiple devices
   - Fix iOS-specific UI issues

4. Performance Optimization
   - Optimize list rendering (FlatList)
   - Reduce bundle size
   - Profile and fix memory leaks

**Deliverables:**
- [ ] App works offline, syncs when online
- [ ] Crash reporting active
- [ ] App tested on iPhone 12, 13, 14, 15 sizes
- [ ] All iOS permissions handled gracefully

---

### Phase 4: TestFlight Submission (Weeks 11-12)

**Goal:** Submit to TestFlight, begin testing

**Tasks:**
1. App Store Connect Setup
   - Create app listing in App Store Connect
   - Add app metadata (description, screenshots)
   - Configure TestFlight settings
   - Add internal testers

2. Build & Submit
   - Create production build with EAS
   - Submit to TestFlight via EAS Submit
   - Address any App Store review feedback

3. Testing Coordination
   - Distribute TestFlight invites
   - Set up feedback collection (email/form)
   - Monitor crash reports
   - Plan iteration based on feedback

**Deliverables:**
- [ ] App available on TestFlight
- [ ] 5-10 internal testers onboarded
- [ ] Feedback collection system in place
- [ ] Known issues documented

---

## Part 5: Detailed Technical Requirements

### Database Schema (Supabase)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  belt_level TEXT NOT NULL DEFAULT 'white',
  stripes INTEGER DEFAULT 0,
  gym_name TEXT,
  training_start_date DATE,
  target_frequency INTEGER,
  logging_preference TEXT DEFAULT 'voice',
  onboarding_complete BOOLEAN DEFAULT false,
  session_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  training_type TEXT NOT NULL, -- 'gi', 'nogi', 'openmat'
  duration_minutes INTEGER,
  sparring_rounds INTEGER,
  techniques TEXT[], -- Array of technique names
  worked_well TEXT[],
  struggles TEXT[],
  notes TEXT,
  voice_transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technique library (user progress)
CREATE TABLE technique_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  technique_id TEXT NOT NULL, -- Reference to technique catalog
  proficiency TEXT DEFAULT 'learning', -- 'learning', 'developing', 'proficient', 'advanced'
  times_drilled INTEGER DEFAULT 0,
  times_used_live INTEGER DEFAULT 0,
  success_rate DECIMAL(3,2),
  notes TEXT,
  last_practiced DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, technique_id)
);
```

### Expo Configuration (app.json)

```json
{
  "expo": {
    "name": "BJJ Progress",
    "slug": "bjj-progress",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0D0D0D"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.bjjprogress.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSMicrophoneUsageDescription": "BJJ Progress needs microphone access to record your training notes using voice."
      }
    },
    "plugins": [
      "expo-av",
      "expo-apple-authentication"
    ]
  }
}
```

### Required NPM Packages

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-av": "~13.10.0",
    "expo-apple-authentication": "~6.3.0",
    "expo-secure-store": "~12.8.0",
    "expo-haptics": "~12.8.0",
    "@supabase/supabase-js": "^2.39.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-safe-area-context": "4.8.2",
    "@sentry/react-native": "^5.15.0",
    "posthog-react-native": "^3.0.0"
  }
}
```

---

## Part 6: Cost Estimates

### Development Costs (One-Time)

| Item | Low Estimate | High Estimate |
|------|--------------|---------------|
| Phase 1: Foundation | $8,000 | $15,000 |
| Phase 2: Core Features | $15,000 | $30,000 |
| Phase 3: Polish | $8,000 | $15,000 |
| Phase 4: Submission | $3,000 | $6,000 |
| **Total Development** | **$34,000** | **$66,000** |

*Note: Estimates assume hiring a senior React Native developer at $100-150/hour*

### Ongoing Costs (Monthly)

| Service | Free Tier | Growth (1K users) | Scale (10K users) |
|---------|-----------|-------------------|-------------------|
| Apple Developer | $8/mo | $8/mo | $8/mo |
| Supabase | $0 | $25/mo | $50/mo |
| AssemblyAI | $0 (free credits) | $185/mo | $1,850/mo |
| Sentry | $0 | $0 | $26/mo |
| PostHog | $0 | $0 | $0 |
| **Total Monthly** | **$8** | **$218** | **$1,934** |

*Note: AssemblyAI costs based on Best tier ($0.0062/min) × 100 sessions/user/month × 3 min avg. Nano tier ($0.002/min) would reduce costs by ~68%.*

---

## Part 7: Risk Assessment

### High-Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Voice transcription accuracy | Low | High | AssemblyAI custom vocabulary for BJJ terms; 24% better on proper nouns |
| App Store rejection | Low | High | Follow Apple guidelines strictly; prepare appeal |
| Expo limitations | Low | Medium | Evaluate eject option if needed |
| AssemblyAI API costs spike | Medium | Medium | Implement usage limits; use Nano tier for budget; monitor per-user usage |

### Medium-Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Development timeline slip | Medium | Medium | Buffer 2 weeks per phase |
| User adoption friction | Medium | Medium | Keep onboarding minimal; leverage web UX research |
| Performance issues | Low | Medium | Profile early; use React Native best practices |

---

## Part 8: Success Metrics for TestFlight

### Technical Success Criteria

- [ ] App installs and launches on iOS 15+
- [ ] User can complete onboarding in < 2 minutes
- [ ] Voice recording works reliably
- [ ] Transcription accuracy > 85% for BJJ terminology
- [ ] Sessions sync within 5 seconds on WiFi
- [ ] App crash rate < 1%
- [ ] Cold start time < 3 seconds

### User Testing Success Criteria

- [ ] 5+ testers complete at least 3 sessions each
- [ ] Net Promoter Score > 30 from testers
- [ ] Voice logging preferred by > 60% of testers
- [ ] No critical bugs blocking core flows
- [ ] Feedback indicates product-market fit signal

---

## Part 9: Immediate Next Steps

### This Week

1. **Apple Developer Account**
   - Enroll in Apple Developer Program ($99)
   - Set up App Store Connect account
   - Create app identifier

2. **Supabase Setup**
   - Create Supabase project
   - Set up initial database tables
   - Configure authentication

3. **Development Environment**
   - Install Expo CLI
   - Create new Expo project
   - Connect to Supabase

### Developer Hiring (If Needed)

**Recommended Profile:**
- 3+ years React Native experience
- Expo experience strongly preferred
- Supabase or similar BaaS experience
- iOS app store submission experience
- Located in timezone overlap for meetings

**Where to Find:**
- Toptal (vetted freelancers)
- Arc.dev (remote developers)
- Upwork (cost-effective, more screening needed)
- React Native Community Discord

---

## Appendix A: File Migration Map

| Current Web File | Native Equivalent | Migration Complexity |
|------------------|-------------------|---------------------|
| App.tsx | App.tsx + Navigation | Medium |
| Dashboard.tsx | screens/Dashboard.tsx | Low |
| SessionLogger.tsx | screens/SessionLogger.tsx | High (voice) |
| VoiceLogger.tsx | components/VoiceLogger.tsx | High (native audio) |
| TextLogger.tsx | components/TextLogger.tsx | Low |
| SessionHistory.tsx | screens/SessionHistory.tsx | Low |
| SessionCard.tsx | components/SessionCard.tsx | Low |
| Header.tsx | components/Header.tsx | Low |
| TabBar.tsx | navigation/TabNavigator.tsx | Medium |
| ProfileScreen.tsx | screens/ProfileScreen.tsx | Low |
| Settings.tsx | screens/Settings.tsx | Medium |
| UserProfileContext.tsx | context/UserContext.tsx | Medium |
| index.css | theme/tokens.ts + StyleSheet | Medium |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| TestFlight | Apple's beta testing platform for iOS apps |
| Expo | Framework that simplifies React Native development |
| EAS | Expo Application Services - cloud build and submit tools |
| Supabase | Open-source Firebase alternative with PostgreSQL |
| AssemblyAI | Speech-to-text AI service with custom vocabulary support |
| BaaS | Backend as a Service |
| RLS | Row Level Security - database-level access control |

---

*Document prepared for BJJ Progress Tracker iOS deployment*
*Last updated: December 2024*
