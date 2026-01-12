# TOMO Development Strategy Analysis

**Date:** January 2026
**Purpose:** Evaluate pathways from web prototype to iOS App Store
**Audience:** Product owner evaluating contractor vs. DIY development

---

## Executive Summary

The TOMO prototype represents 40-50% of the total work needed for an App Store release. The remaining work breaks into four distinct workstreams with varying complexity and DIY potential. A hybrid approach—doing infrastructure and static screens yourself with Claude Code, then hiring a contractor for the voice pipeline—offers the best balance of cost, risk, and time.

---

## Current Asset Inventory

### What Already Exists

| Asset | Lines/Count | Reusability |
|-------|-------------|-------------|
| TypeScript/React code | ~51,000 | ~70% portable to React Native |
| React components | 60+ | High - logic transfers directly |
| Belt personalization engine | Complete | 100% - pure TypeScript |
| Design system tokens | Complete | Requires conversion to StyleSheet |
| SVG icons | 95+ | Requires react-native-svg conversion |
| Database schema (SQL) | Complete | 100% - ready to deploy |
| AI extraction prompts | Tested | 100% - API calls unchanged |
| UX flows | Validated | 100% - same user flows |
| User personas | 6 detailed | 100% - product reference |
| Documentation | 30+ files | 100% - development reference |

### What's Mocked (Not Real)

| Feature | Current State | Production Requirement |
|---------|---------------|----------------------|
| Voice recording | Simulated waveform | Native expo-av audio capture |
| Transcription | Hardcoded responses | AssemblyAI API integration |
| AI extraction | Hardcoded JSON | GPT-4 class API integration |
| Data persistence | localStorage | Supabase PostgreSQL |
| Authentication | Mock user object | Supabase Auth + Apple Sign-In |
| Offline support | None | AsyncStorage + sync queue |

---

## Four Workstreams: Detailed Breakdown

### Workstream 1: Backend Infrastructure (Supabase)

**Estimated Effort:** 15-20 hours
**DIY Potential:** 70-80%

| Task | Complexity | Hours | DIY? | Notes |
|------|------------|-------|------|-------|
| Create Supabase project | Low | 0.5 | Yes | Web UI, straightforward |
| Deploy database schema | Low | 1 | Yes | Copy-paste SQL from RFP |
| Configure Row Level Security | Medium | 4-6 | Caution | Security-critical, easy to get wrong |
| Set up email authentication | Low | 1 | Yes | Built-in Supabase feature |
| Configure Apple Sign-In | Medium | 3-4 | Caution | Requires Apple Developer Console setup |
| Create storage buckets | Low | 0.5 | Yes | For audio file uploads |
| Set up Edge Functions | Medium | 2-3 | Maybe | For AI extraction API calls |
| Environment configuration | Low | 1 | Yes | API keys, URLs |

**Risk Areas:**
- RLS policies: If misconfigured, users could access other users' data
- Apple Sign-In: Requires correct configuration in both Apple Developer Console and Supabase

**Recommendation:** Do this yourself with Claude Code guidance. Have a contractor review RLS policies before launch.

---

### Workstream 2: React Native App (Static Screens)

**Estimated Effort:** 40-60 hours
**DIY Potential:** 80-90%

| Task | Complexity | Hours | DIY? | Notes |
|------|------------|-------|------|-------|
| Initialize Expo project | Low | 1 | Yes | `npx create-expo-app` |
| Configure TypeScript | Low | 0.5 | Yes | Expo handles this |
| Set up React Navigation | Medium | 3-4 | Yes | Well-documented |
| Port design tokens to StyleSheet | Medium | 4-6 | Yes | Mechanical but tedious |
| Convert Icons.tsx to RN SVG | Medium | 6-8 | Yes | 95 icons, batch process |
| Port Dashboard.tsx | Low | 3-4 | Yes | Logic transfers, adapt styles |
| Port SessionHistory.tsx | Low | 2-3 | Yes | FlatList instead of map |
| Port SessionDetail.tsx | Low | 2-3 | Yes | ScrollView adaptation |
| Port ProfileScreen.tsx | Low | 2-3 | Yes | Form inputs differ slightly |
| Port Settings.tsx | Low | 2-3 | Yes | Switch components differ |
| Port TechniqueLibrary.tsx | Low | 2-3 | Yes | Search + FlatList |
| Port BeltProgress.tsx | Low | 2-3 | Yes | Visualization components |
| Port belt-system config | Low | 1 | Yes | Pure TypeScript, copy directly |
| Port UserProfileContext | Medium | 3-4 | Yes | Add Supabase client |
| Connect screens to Supabase | Medium | 6-8 | Yes | Replace localStorage calls |
| Build TabBar navigation | Low | 2 | Yes | Bottom tabs pattern |

**Key Differences: Web React vs React Native**

| Web Concept | React Native Equivalent |
|-------------|------------------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| CSS classes | `StyleSheet.create()` |
| CSS Variables | Theme object / constants |
| `onClick` | `onPress` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| Scrolling div | `<ScrollView>` or `<FlatList>` |
| CSS flexbox | Same, but `flexDirection: 'column'` is default |
| `className` | `style` prop |
| Hover states | Don't exist (touch-based) |

**Recommendation:** This is highly DIY-able. Claude Code can help convert components one by one. Start with Dashboard, get it working, then proceed through the list.

---

### Workstream 3: Voice Pipeline (Critical Path)

**Estimated Effort:** 60-100 hours
**DIY Potential:** 20-30%

| Task | Complexity | Hours | DIY? | Notes |
|------|------------|-------|------|-------|
| Audio recording setup | Medium | 6-8 | Caution | expo-av configuration |
| Recording UI (button states) | Medium | 4-6 | Yes | Start/stop/processing states |
| Waveform visualization | High | 10-15 | No | Requires native module or complex library |
| Audio file handling | Medium | 4-6 | Caution | File system, formats |
| Upload to AssemblyAI | Medium | 4-6 | Maybe | API integration, error handling |
| Polling for transcription | Medium | 3-4 | Yes | Async polling pattern |
| AI extraction API call | Medium | 3-4 | Yes | GPT-4 API call |
| Parse extraction response | Low | 2-3 | Yes | JSON handling |
| Review/edit UI | Medium | 8-12 | Maybe | Editable fields for each extracted value |
| Gap-fill questions UI | Medium | 4-6 | Maybe | Conditional follow-up prompts |
| Microphone permission flow | Medium | 4-6 | Caution | iOS permission lifecycle |
| Error handling (network) | High | 8-12 | No | Retry logic, offline detection |
| Error handling (permissions) | Medium | 4-6 | Caution | Permission denied flows |
| Error handling (transcription) | Medium | 4-6 | Caution | Failed transcription recovery |
| Testing across devices | High | 8-12 | Caution | Audio varies by device |

**Why This Is Hard:**

1. **Native audio APIs are complex** - Recording quality, file formats, interruption handling (phone calls), background audio, etc.

2. **Waveform visualization** - Real-time audio visualization requires either:
   - A native module that processes audio data
   - A library like `react-native-audio-api` (still maturing)
   - Faking it with animation (not ideal)

3. **Error states multiply** - Network fails, permission denied, transcription fails, AI extraction fails, user cancels mid-recording... each needs handling.

4. **Device variation** - Different iPhone models have different microphone characteristics.

**Recommendation:** Hire a contractor for this workstream. It's your core differentiator and the riskiest technical component.

---

### Workstream 4: iOS Polish & Deployment

**Estimated Effort:** 20-30 hours
**DIY Potential:** 50-60%

| Task | Complexity | Hours | DIY? | Notes |
|------|------------|-------|------|-------|
| App icon generation | Low | 1-2 | Yes | Tools auto-generate sizes |
| Splash screen | Low | 1-2 | Yes | Expo config |
| Offline detection | Medium | 2-3 | Yes | NetInfo library |
| Offline caching (read) | Medium | 4-6 | Maybe | AsyncStorage patterns |
| Offline sync queue (write) | High | 12-20 | No | Complex state management |
| Sentry integration | Low | 2 | Yes | Well-documented |
| PostHog integration | Low | 2 | Yes | Well-documented |
| App Store Connect setup | Medium | 3-4 | Caution | Many configuration steps |
| Privacy policy creation | Low | 2 | Yes | Templates available |
| App Store screenshots | Low | 2-3 | Yes | Simulator screenshots |
| App Store description | Low | 1-2 | Yes | Copy from RFP |
| TestFlight build (EAS) | Medium | 2-3 | Caution | First build often has issues |
| TestFlight submission | Low | 1 | Yes | Upload + wait |
| Handle App Review feedback | Variable | ? | Caution | May require code changes |

**Recommendation:** Skip offline sync for v1 (require internet connection). This removes the hardest task and gets you to TestFlight faster. Add it in v1.1 once you have real users.

---

## Strategic Options

### Option A: Full Contractor (RFP as Written)

**Cost:** $25,000 - $50,000
**Timeline:** 10-12 weeks
**Your Involvement:** Requirements, testing, feedback

**Pros:**
- Fastest path to market
- Professional handles all complexity
- You focus on product, not code

**Cons:**
- Highest cost
- Less knowledge transfer
- Dependent on contractor for future changes

---

### Option B: Hybrid Approach (Recommended)

**Cost:** $10,000 - $20,000
**Timeline:** 12-16 weeks (parallel work)
**Your Involvement:** 60-80 hours of development

**Phase 1: You Do (Weeks 1-4)**
- Set up Supabase, deploy schema
- Initialize Expo project
- Port static screens (Dashboard, History, Profile, etc.)
- Connect to Supabase for data persistence
- Basic navigation working

**Phase 2: Contractor Does (Weeks 4-10)**
- Voice recording implementation
- AssemblyAI integration
- AI extraction integration
- Review/edit flow
- Error handling

**Phase 3: You Do with Contractor Support (Weeks 10-14)**
- Integrate voice pipeline with your screens
- iOS polish (icons, splash)
- App Store submission
- TestFlight testing

**Pros:**
- 50-60% cost savings
- You understand the codebase
- Contractor focuses on hardest problems
- Knowledge transfer through collaboration

**Cons:**
- Longer timeline
- Requires your time investment
- Coordination overhead

---

### Option C: Full DIY with Claude Code

**Cost:** $500 - $1,000 (services only)
**Timeline:** 20-30 weeks (evenings/weekends)
**Your Involvement:** 150-200+ hours

**Pros:**
- Lowest cost
- Full understanding of codebase
- Complete control

**Cons:**
- Longest timeline
- Voice pipeline is risky
- May hit walls that require professional help
- Opportunity cost of your time

**Risk Mitigation:** Start with text-only logging (no voice) for v1. Ship to TestFlight, get users, add voice in v1.1.

---

### Option D: Text-First MVP (De-risk Voice)

**Cost:** $5,000 - $10,000 (or DIY)
**Timeline:** 6-8 weeks

Ship v1 with text logging only:
- All screens working
- Text-based session logging (your existing smart parsing)
- Full Supabase backend
- Real authentication

Add voice in v1.1:
- By then you have real user feedback
- You know if voice is actually the killer feature
- Contractor can focus solely on voice pipeline

**Pros:**
- Fastest to market
- Lowest risk
- Validates product before investing in voice
- Voice becomes a "big update" for marketing

**Cons:**
- Launches without key differentiator
- May feel incomplete
- Competitors still have no voice either

---

## Code Ownership & Transferability

### Critical Question: Can a contractor build in their accounts, then transfer to you?

**Short Answer:** Yes, but structure the engagement correctly from day one.

### What Needs to Be in YOUR Name

| Asset | Why It Must Be Yours | Transfer Difficulty |
|-------|---------------------|-------------------|
| **Apple Developer Account** | App Store listing, certificates | Cannot transfer apps between accounts easily |
| **GitHub Repository** | Source code ownership | Easy - add as collaborator, then remove |
| **Supabase Project** | Database, user data, auth | Medium - can transfer project ownership |
| **AssemblyAI Account** | API keys, usage | Easy - just API keys |
| **Sentry/PostHog** | Analytics data | Easy - just API keys |
| **Domain (if any)** | DNS control | Easy - standard domain transfer |

### Recommended Contract Structure

**1. Code Ownership Clause**
```
All source code, documentation, and related materials produced
under this agreement shall be the sole property of [Your Company].
Contractor grants a perpetual, irrevocable license-free transfer
of all intellectual property rights upon final payment.
```

**2. Repository Setup**
- YOU create the GitHub repository
- Add contractor as collaborator
- Contractor pushes code to YOUR repo
- You own the entire git history

**3. Account Setup**
- YOU create Apple Developer account
- YOU create Supabase project
- Contractor uses YOUR API keys (shared securely)
- Contractor never has accounts you can't access

**4. Handoff Requirements**
Contractor must provide:
- README with setup instructions
- Environment variable documentation
- Deployment guide
- Architecture decisions document
- Known issues / technical debt log

**5. Knowledge Transfer Session**
- 2-hour video call walkthrough of codebase
- Recorded for future reference
- Q&A on any unclear areas

### Red Flags to Avoid

| Red Flag | Why It's Bad |
|----------|-------------|
| "I'll build in my account and transfer later" | May hold code hostage, transfer issues |
| "I'll use my standard boilerplate" | May have licensing restrictions |
| "Source code delivered at end" | No visibility during development |
| No git history, just final zip | Can't see how code evolved, harder to debug |
| "My deployment scripts are proprietary" | Vendor lock-in |

### Recommended Contract Terms

1. **Milestone-based payments** (not time-based)
2. **Code pushed to your repo after each milestone**
3. **Weekly progress demos** (15-min screen share)
4. **Source code ownership clause**
5. **30-day warranty period** for bugs
6. **Handoff documentation required before final payment**

---

## Immediate Action Items

### This Week
- [ ] Purchase Apple Developer Account ($99) - do this regardless of approach
- [ ] Create Supabase account (free tier)
- [ ] Create AssemblyAI account ($50 free credits)
- [ ] Create GitHub repository for native app (separate from prototype)

### If Going Hybrid/Contractor Route
- [ ] Finalize scope (with or without voice in v1)
- [ ] Add code ownership clause to RFP
- [ ] Specify all accounts must be in your name
- [ ] Request contractor portfolio with similar apps

### If Going DIY Route
- [ ] Initialize Expo project locally
- [ ] Deploy Supabase schema
- [ ] Start with Dashboard.tsx port
- [ ] Target: One screen working end-to-end in 2 weeks

---

## Appendix: Cost Breakdown by Approach

### Monthly Operating Costs (All Approaches)

| Service | Free Tier | Growth (100 users) | Scale (1000 users) |
|---------|-----------|--------------------|--------------------|
| Apple Developer | — | $8.25/mo ($99/yr) | $8.25/mo |
| Supabase | Yes | Free | $25/mo |
| AssemblyAI | $50 credit | ~$15/mo | ~$150/mo |
| Sentry | 5K events | Free | Free |
| PostHog | 1M events | Free | Free |
| **Total** | ~$8/mo | ~$23/mo | ~$183/mo |

### Development Cost Comparison

| Approach | Development Cost | Your Time | Timeline |
|----------|-----------------|-----------|----------|
| Full Contractor | $25K - $50K | 20-40 hrs | 10-12 weeks |
| Hybrid | $10K - $20K | 60-80 hrs | 12-16 weeks |
| DIY (with voice) | $0 | 150-200 hrs | 20-30 weeks |
| DIY (text-first) | $0 | 80-120 hrs | 8-12 weeks |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | Claude Code Analysis | Initial analysis |
