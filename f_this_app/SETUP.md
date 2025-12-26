# F*** This App! - Setup Guide

The MVP is built! Here's what you need to do to get it running.

## What's Built

### Core Features
- Landing page with app branding
- Sign up / Login (Google, Apple, Email via Supabase)
- Onboarding carousel explaining the game
- Game creation flow with presets (Family Friendly, Office Mode, Friend Group, Hardcore, Custom)
- Join game via invite code
- Game lobby with real-time player list
- **THE BIG RED CURSE BUTTON** with pulsing animation
- Player selector for reporting curses
- Report success animation with Dirty Mouth quips
- Real-time leaderboard
- Team support with team leaderboards
- Around Kids mode (2x toggle)
- Nice Word of the Week bonus
- Weekly stats recap modal
- Profile page with all-time stats
- Admin panel (set nice word, cease-fire, end game, remove players)
- PWA manifest for installability

### Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Real-time)
- Framer Motion (animations)
- Zustand (state management)
- Cloudflare Pages ready

---

## Your Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for it to initialize (~2 minutes)

### 2. Configure Supabase Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** (it's on by default)
3. Enable **Google**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add your Supabase callback URL: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase
4. Enable **Apple** (optional):
   - Requires Apple Developer account
   - Follow Supabase's Apple OAuth guide

### 3. Run Database Schema

1. In Supabase, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it
4. This creates all tables, triggers, and RLS policies

### 4. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xyzabc.supabase.co`)
   - **anon/public** key (the long one starting with `eyJ...`)

### 5. Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 6. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Cloudflare Pages

#### Option A: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Create new project → Connect to GitHub
4. Select your repo
5. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
6. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Deploy!

#### Option B: Direct Deploy

```bash
npm run build
npm run pages:deploy
```

### 8. Update Supabase Redirect URLs

After deploying, update Supabase auth settings:

1. Go to **Authentication** → **URL Configuration**
2. Add your Cloudflare Pages URL to:
   - **Site URL**: `https://your-app.pages.dev`
   - **Redirect URLs**: `https://your-app.pages.dev/auth/callback`

---

## App Icons (Optional)

The PWA needs icons. You can generate them from a source image:

1. Create a 512x512 PNG logo
2. Use a tool like [RealFaviconGenerator](https://realfavicongenerator.net)
3. Place the generated icons in `public/icons/`

---

## Push Notifications (Post-MVP)

To enable push notifications:

1. Sign up at [OneSignal](https://onesignal.com)
2. Create an app
3. Add your OneSignal App ID to `.env.local`:
   ```
   NEXT_PUBLIC_ONESIGNAL_APP_ID=your-app-id
   ```
4. Implement notification handlers in the app

---

## What's Ready to Use

| Feature | Status |
|---------|--------|
| User authentication | ✅ Built |
| Game creation with presets | ✅ Built |
| Join via invite code | ✅ Built |
| THE BIG CURSE BUTTON | ✅ Built |
| Curse reporting flow | ✅ Built |
| Real-time scoring | ✅ Built |
| Leaderboards | ✅ Built |
| Teams mode | ✅ Built |
| Around Kids 2x mode | ✅ Built |
| Nice Word of the Week | ✅ Built |
| Streak tracking | ✅ Built |
| Weekly recap | ✅ Built |
| Admin controls | ✅ Built |
| PWA installable | ✅ Built |
| Cloudflare Pages ready | ✅ Configured |

---

## Database Tables Created

- `users` - Player profiles
- `games` - Game instances
- `teams` - Team definitions
- `game_players` - Players in each game
- `curse_reports` - Curse report logs
- `nice_word_logs` - Nice word usage logs

All tables have Row Level Security (RLS) enabled.

---

## File Structure

```
f_this_app/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── (auth)/             # Login, signup, onboarding
│   │   ├── (main)/             # Home, game, profile pages
│   │   └── auth/callback/      # OAuth callback handler
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── game/               # Game-specific components
│   │   └── characters/         # Mascot system
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   ├── utils/              # Helper functions
│   │   └── constants/          # Game presets, quips
│   ├── stores/                 # Zustand state
│   └── types/                  # TypeScript types
├── public/
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # App icons (add these)
├── supabase/
│   └── schema.sql              # Database schema
└── package.json
```

---

## Questions?

The app is ready to ship. Set up Supabase, add your keys, and you're live!

Good luck watching those mouths! 🤬
