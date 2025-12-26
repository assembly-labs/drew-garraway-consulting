# F*** This App! - Next Steps to Ship

This document outlines every step needed to take this MVP from development to production deployment.

---

## Phase 1: Local Development Setup

### 1.1 Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 1.2 Supabase Project Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** to get your URL and anon key
3. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
4. Configure Authentication:
   - Enable **Email/Password** in Authentication settings
   - Enable **Google OAuth** (optional):
     - Create OAuth credentials in Google Cloud Console
     - Add redirect URL: `https://your-supabase-url/auth/v1/callback`
   - Enable **Apple Sign-In** (optional):
     - Register app in Apple Developer Portal
     - Configure Sign in with Apple

### 1.3 Run Local Development Server

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Phase 2: Local Testing Workflow

### 2.1 Claude Code Iteration Process

After each improvement or change:

1. Make the code change
2. Run `npm run dev` if not already running
3. **Claude Code will open browser automatically**: `open http://localhost:3000`
4. Test the change manually
5. If issues found, iterate

### 2.2 Testing Checklist

**Authentication Flow:**
- [ ] Landing page loads correctly
- [ ] Email signup works
- [ ] Email login works
- [ ] OAuth login works (if configured)
- [ ] Onboarding carousel displays properly
- [ ] Logout works

**Game Creation Flow:**
- [ ] Create game with each preset (Family Friendly, Office Mode, Friend Group, Hardcore, Custom)
- [ ] Custom settings toggle correctly
- [ ] Invite code generates
- [ ] Game appears on home screen

**Join Game Flow:**
- [ ] Join via invite code
- [ ] Join via share link with `?code=` parameter
- [ ] Player appears in lobby
- [ ] Cannot join completed games

**Core Gameplay:**
- [ ] Curse button pulses and is clickable
- [ ] Player selector shows all players except self
- [ ] Report curse adds points to offender
- [ ] Report success animation plays with quip
- [ ] Around Kids toggle works (2x multiplier)
- [ ] Nice Word modal works and deducts points
- [ ] Real-time leaderboard updates

**Admin Controls:**
- [ ] Set nice word of the week
- [ ] Activate/deactivate cease-fire
- [ ] Remove players from game
- [ ] End game

**Stats & Profile:**
- [ ] Weekly stats load correctly
- [ ] Weekly recap modal displays
- [ ] Profile shows all-time stats
- [ ] Edit profile name works

### 2.3 Cross-Device Testing

Test on:
- [ ] Desktop Chrome
- [ ] Desktop Safari
- [ ] Desktop Firefox
- [ ] iOS Safari (most critical for PWA)
- [ ] Android Chrome
- [ ] Tablet

---

## Phase 3: Pre-Deployment Checklist

### 3.1 Code Quality

```bash
# Run all checks
npm run lint      # Should pass with only warnings
npm run build     # Should build successfully
```

### 3.2 Environment Variables for Production

Create the following in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL` - Your production Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your production Supabase anon key

### 3.3 Database Security

In Supabase Dashboard:
1. Enable **Row Level Security (RLS)** on all tables
2. Add appropriate policies (see `supabase/schema.sql` for examples)
3. Review API access settings

---

## Phase 4: Deployment (Cloudflare Pages)

### 4.1 Connect Repository

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`
   - **Node version:** 20 (recommended)

### 4.2 Environment Variables

Add production environment variables in Cloudflare dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4.3 Custom Domain (Optional)

1. Add custom domain in Cloudflare Pages settings
2. Configure DNS records
3. Enable HTTPS (automatic with Cloudflare)

### 4.4 Deploy

Push to main branch to trigger automatic deployment.

---

## Phase 5: Beta Testing

### 5.1 Internal Testing

1. Share production URL with 5-10 close friends/family
2. Create 2-3 test games across different presets
3. Play for 1-2 weeks to validate:
   - Real-time updates work at scale
   - No data corruption issues
   - UX is intuitive

### 5.2 Metrics to Track

Monitor in Supabase dashboard:
- Daily active users
- Games created per day
- Reports per game
- User retention (D1, D7, D30)

### 5.3 Collect Feedback

- Create a simple feedback form
- Ask testers about:
  - Confusing UI elements
  - Missing features
  - Bugs encountered
  - What they loved

---

## Phase 6: Iteration Based on Feedback

### 6.1 Priority Bug Fixes

Address any critical bugs found during beta.

### 6.2 UX Improvements

Based on feedback, consider:
- Notification timing
- Button placement
- Copy/messaging changes
- Missing confirmations

### 6.3 Feature Additions

Based on research, prioritize:
1. Streak freeze system
2. Better push notifications
3. Team-vs-team mode
4. Achievement system

---

## Phase 7: Native App Wrapper (Future)

### 7.1 Capacitor Setup

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

### 7.2 Push Notifications

Integrate OneSignal or Firebase Cloud Messaging.

### 7.3 App Store Submission

- iOS: TestFlight for beta, then App Store
- Android: Internal testing track, then Production

**Note:** May need alternative app name to avoid profanity filter issues.

---

## Quick Commands Reference

```bash
# Development
npm run dev                 # Start dev server
npm run lint               # Check for issues
npm run build              # Production build

# After changes, Claude Code will run:
open http://localhost:3000  # Open browser to test

# Deployment (if using Cloudflare CLI)
npm run pages:build        # Build for Cloudflare Pages
npm run pages:deploy       # Deploy to Cloudflare
```

---

## File Structure Reference

```
f_this_app/
├── src/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and constants
│   ├── stores/              # Zustand state
│   └── types/               # TypeScript types
├── internal/                # Internal docs
├── public/                  # Static assets
├── supabase/                # Database schema
├── NEXT-STEPS.md           # This file
├── SETUP.md                # Detailed setup guide
├── fta-prd.md              # Product requirements
└── fta-implementation-plan.md  # Full implementation plan
```

---

## Support

- **Project Docs:** See `internal/README.md` for project overview
- **Technical Setup:** See `SETUP.md` for detailed configuration
- **Product Specs:** See `fta-prd.md` for feature details
