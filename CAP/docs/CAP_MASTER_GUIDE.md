# CAP Platform - Master Implementation Guide
## Championship Athletic Prospects

**Last Updated:** October 19, 2024
**Version:** 1.0
**Project Status:** Pre-Development - Foundation Phase

---

## 🤖 INSTRUCTIONS FOR AI ASSISTANT (READ FIRST EVERY SESSION)

**When user starts a new session or asks to continue work, ALWAYS begin with:**

```
📋 CAP Project Context Check:
- Current Phase: [State what phase we're in based on BUILD_STATUS below]
- Last Completed: [List completed items from BUILD_STATUS]
- Working On: [Current in-progress items]
- Next Up: [Next pending items]
- Tech Stack Confirmed: Next.js 14 + Supabase + Netlify + shadcn/ui
```

**Before suggesting ANY code changes:**

1. ✅ **Scan existing code** using Glob/Grep to see what's already built
2. ✅ **Check BUILD_STATUS section** below to understand progress
3. ✅ **Reference CODE_PATTERNS section** to follow established conventions
4. ✅ **Never rebuild existing components** - always extend or modify
5. ✅ **Ask for clarification** if BUILD_STATUS conflicts with actual code

**If user says "continue building CAP":**
- Check the 🚧 In Progress section
- Confirm what they want to work on
- Don't assume - always verify

**Communication Protocol:**
- Start responses with context summary (as shown above)
- Before building, confirm: "I'll work on [X] using [Y pattern]. Correct?"
- After completing work, update BUILD_STATUS section in this guide
- Reference specific line numbers when discussing code (e.g., `auth.ts:42`)

---

## PART 1: AT-A-GLANCE (30 Second Context)

### What is CAP?
AI-powered platform for creating youth sports trading cards. Parents upload phone photos → AI enhances them → Select templates → Order printed cards.

### Core Value Proposition
- **For Parents:** Turn phone photos into professional trading cards in <5 minutes
- **For Kids:** Feel like real athletes with collectible cards
- **Differentiation:** AI background removal + bio generation + 5-day delivery

### Business Model
- **Tier 1 (Rookie):** $28 for 8-card pack - DIY with templates
- **Tier 2 (Pro):** $75 session + $28 cards - With photographer
- **Tier 3 (Championship):** $150+ - Premium with custom design

### Target Market
- **Primary:** Affluent suburban parents (ages 30-45, $75K-150K income)
- **Beachhead:** Greater Philadelphia (300K-400K youth athletes)
- **Goal:** 100 teams in 6 months, $10K/month revenue

### Tech Stack (LOCKED - Do Not Suggest Alternatives)
```yaml
Frontend: Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
Backend: Supabase (PostgreSQL + Auth + Storage + Realtime)
Hosting: Netlify (Functions + Edge Functions)
Payment: Stripe Checkout
AI: Replicate (background removal) + Claude API (bio generation)
Print: GotPrint API
```

### MVP Timeline
8 weeks to launch (Phases 1-6 detailed below)

---

## PART 2: PROJECT STRUCTURE

### Current Folder Organization

```
CAP/
│
├── _docs/                          # Original research (READ-ONLY)
│   ├── _product/                   # PRD documents
│   ├── _research/                  # Market research
│   └── _ux/                        # UX specifications
│
├── docs/                           # Living documentation (THIS FILE)
│   └── CAP_MASTER_GUIDE.md        # You are here
│
├── app/                            # Next.js 14 App Router
│   ├── (auth)/                    # Auth route group
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify/
│   │
│   ├── (dashboard)/               # Protected routes
│   │   ├── dashboard/             # Main dashboard
│   │   ├── teams/                 # Team management
│   │   │   └── [teamId]/
│   │   │       ├── roster/        # Roster management
│   │   │       ├── photos/        # Photo upload
│   │   │       └── design/        # Card designer
│   │   └── orders/                # Order history
│   │
│   ├── checkout/                  # Checkout flow
│   ├── api/                       # Next.js API routes (minimal - prefer Netlify Functions)
│   ├── layout.tsx                 # Root layout with CAP branding
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles with CAP theme
│
├── components/                     # React components
│   ├── ui/                        # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── ...
│   │
│   ├── features/                  # Feature-specific components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── AgeVerification.tsx
│   │   │
│   │   ├── teams/
│   │   │   ├── TeamCard.tsx
│   │   │   ├── TeamForm.tsx
│   │   │   └── RosterTable.tsx
│   │   │
│   │   ├── photos/
│   │   │   ├── PhotoUploader.tsx
│   │   │   ├── PhotoProcessor.tsx
│   │   │   └── PhotoGallery.tsx
│   │   │
│   │   ├── cards/
│   │   │   ├── CardDesigner.tsx
│   │   │   ├── TemplateSelector.tsx
│   │   │   └── CardPreview.tsx
│   │   │
│   │   └── checkout/
│   │       ├── CartSummary.tsx
│   │       └── PaymentForm.tsx
│   │
│   └── shared/                    # Shared across features
│       ├── CAPHeader.tsx          # CAP branded header
│       ├── CAPFooter.tsx          # CAP branded footer
│       ├── CAPLogo.tsx            # CAP logo component
│       └── LoadingSpinner.tsx     # Loading states
│
├── netlify/                        # Netlify-specific code
│   ├── functions/                 # Serverless functions
│   │   ├── auth-signup.ts
│   │   ├── auth-verify-age.ts
│   │   ├── teams-create.ts
│   │   ├── photos-upload.ts
│   │   ├── photos-enhance.ts
│   │   ├── cards-generate-bio.ts
│   │   ├── orders-create.ts
│   │   └── print-submit.ts
│   │
│   └── edge-functions/            # Edge functions (image optimization)
│       └── image-transform.ts
│
├── lib/                            # Utilities and configuration
│   ├── supabase/
│   │   ├── client.ts              # Supabase client initialization
│   │   ├── server.ts              # Server-side Supabase client
│   │   └── types.ts               # TypeScript types from schema
│   │
│   ├── stripe/
│   │   ├── client.ts              # Stripe client
│   │   └── webhooks.ts            # Webhook handlers
│   │
│   ├── ai/
│   │   ├── replicate.ts           # Background removal
│   │   └── claude.ts              # Bio generation
│   │
│   ├── cap-config.ts              # CAP branding configuration
│   ├── constants.ts               # App constants
│   ├── utils.ts                   # Utility functions
│   └── validators.ts              # Zod schemas for validation
│
├── supabase/                       # Supabase configuration
│   ├── migrations/                # Database migrations
│   │   └── 001_initial_schema.sql
│   └── config.toml                # Supabase config
│
├── public/                         # Static assets
│   ├── cap-logo.svg               # CAP logo
│   ├── cap-icon-192.png           # PWA icon
│   ├── cap-icon-512.png           # PWA icon
│   └── manifest.json              # PWA manifest
│
├── tests/                          # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.local                      # Local environment variables (gitignored)
├── .env.example                    # Example env file (committed)
├── netlify.toml                    # Netlify configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
└── README.md                       # Project README
```

### Key File Locations (Quick Reference)

| What You Need | Where It Lives |
|---------------|----------------|
| Add new page | `/app/(dashboard)/[page-name]/page.tsx` |
| Add new component | `/components/features/[feature-name]/` |
| Add Netlify Function | `/netlify/functions/[verb-noun].ts` |
| CAP branding config | `/lib/cap-config.ts` |
| Database types | `/lib/supabase/types.ts` |
| Environment variables | `/.env.local` |
| Supabase migrations | `/supabase/migrations/` |
| shadcn/ui components | `/components/ui/` |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `PhotoUploader.tsx` |
| Netlify Functions | kebab-case, verb-noun | `photos-upload.ts` |
| Database tables | snake_case | `card_designs` |
| Database columns | snake_case | `created_at` |
| API endpoints | kebab-case | `/api/teams-create` |
| CSS classes | Tailwind utilities | `bg-cap-gold` |
| TypeScript types | PascalCase | `CAPUser` |
| Constants | SCREAMING_SNAKE | `MAX_PHOTO_SIZE` |

---

## PART 3: BUILD STATUS (Update After Each Session)

### ✅ Phase 0: Pre-Development (CURRENT)
- [x] PRD reviewed and understood
- [x] Market research reviewed
- [x] UX specifications reviewed
- [x] Master implementation guide created
- [ ] Folder structure initialized
- [ ] Git repository initialized
- [ ] Initial Next.js project scaffolded
- [ ] Netlify project created and linked

### 📋 Phase 1: Foundation (Weeks 1-2)
**Goal:** Core infrastructure and authentication

- [ ] Next.js 14 project setup
  - [ ] Install dependencies (Next.js, TypeScript, Tailwind, shadcn/ui)
  - [ ] Configure Tailwind with CAP theme colors
  - [ ] Set up absolute imports (@/components, @/lib)
  - [ ] Configure ESLint and Prettier

- [ ] Supabase Setup
  - [ ] Create Supabase project
  - [ ] Run initial database migration (users, teams, children, photos)
  - [ ] Configure Row Level Security (RLS) policies
  - [ ] Set up storage buckets (cap-photos, cap-logos)
  - [ ] Generate TypeScript types from schema

- [ ] Netlify Configuration
  - [ ] Create Netlify site
  - [ ] Link Git repository
  - [ ] Configure build settings
  - [ ] Set up environment variables
  - [ ] Test deployment pipeline

- [ ] Authentication System
  - [ ] Supabase Auth integration
  - [ ] Age verification flow (18+ only)
  - [ ] Email/password signup
  - [ ] Google OAuth (optional for MVP)
  - [ ] Password reset flow
  - [ ] Session management

- [ ] CAP Branding Setup
  - [ ] Create CAP logo component
  - [ ] Configure theme colors (Gold #FFD700, Blue #1E40AF)
  - [ ] Design system documentation
  - [ ] Typography settings (Inter for UI, Bebas Neue for display)

**Deliverable:** Users can sign up, verify age, and log in

### 📋 Phase 2: Photo Pipeline (Weeks 3-4)
**Goal:** Photo upload and AI enhancement

- [ ] Team Management
  - [ ] Create team form
  - [ ] Team color picker
  - [ ] Logo upload
  - [ ] Privacy settings (auto-delete, public/private)
  - [ ] Team dashboard

- [ ] Roster Management
  - [ ] Add champion (child) form
  - [ ] Roster table with edit/delete
  - [ ] CSV import functionality
  - [ ] COPPA-compliant data collection (first name only)
  - [ ] Parental consent tracking

- [ ] Photo Upload System
  - [ ] Drag-and-drop uploader component
  - [ ] Mobile camera integration
  - [ ] Bulk upload (up to 100 photos)
  - [ ] Upload progress indicators
  - [ ] File validation (JPG, PNG, HEIC, max 10MB)
  - [ ] Upload to Supabase Storage

- [ ] AI Enhancement Pipeline
  - [ ] Replicate API integration (background removal)
  - [ ] Photo quality scoring algorithm
  - [ ] Netlify Function: photos-enhance
  - [ ] Processing queue with status updates
  - [ ] Before/after preview toggle
  - [ ] Manual override options

- [ ] Photo Gallery
  - [ ] Display uploaded photos
  - [ ] Assign photos to champions
  - [ ] Filter by assigned/unassigned
  - [ ] Delete/replace photos

**Deliverable:** Users can upload photos and see AI-enhanced versions

### 📋 Phase 3: Card Designer (Weeks 5-6)
**Goal:** Card design and customization

- [ ] Template System
  - [ ] Create 5 initial templates (Championship Gold, Classic CAP, Modern Champion, Rookie Star, Elite Athlete)
  - [ ] Template data structure (JSON)
  - [ ] Template preview renderer
  - [ ] Sport-specific filtering
  - [ ] Style filtering (Championship/Classic/Rookie)

- [ ] Card Designer Interface
  - [ ] Template selector grid
  - [ ] Canvas preview (front/back)
  - [ ] Card flip animation
  - [ ] Player switcher tabs
  - [ ] Real-time preview updates

- [ ] Customization Tools
  - [ ] Team color pickers (apply to template)
  - [ ] Font selector
  - [ ] Text size slider
  - [ ] Photo crop/position adjuster
  - [ ] Apply to all champions button
  - [ ] Undo/redo functionality

- [ ] AI Bio Generation
  - [ ] Claude API integration
  - [ ] Bio generation prompt engineering
  - [ ] Age-appropriate content filter
  - [ ] Edit generated bio
  - [ ] Regenerate option
  - [ ] Netlify Function: cards-generate-bio

- [ ] Print File Generation
  - [ ] Export cards as print-ready PDFs
  - [ ] Bleed/trim mark inclusion
  - [ ] 300 DPI resolution
  - [ ] CMYK color conversion
  - [ ] Multi-card sheet layout

**Deliverable:** Users can design complete trading cards

### 📋 Phase 4: Commerce (Weeks 7-8)
**Goal:** Payment and order fulfillment

- [ ] Shopping Cart
  - [ ] Cart state management (Zustand)
  - [ ] Add to cart functionality
  - [ ] Quantity selection (8/16/24/48 packs)
  - [ ] Card stock options (Standard/Premium)
  - [ ] Promo code input
  - [ ] Price calculation with taxes

- [ ] Checkout Flow
  - [ ] Shipping address form
  - [ ] Delivery speed selection (Standard 5-7 days / Rush 2-3 days)
  - [ ] Stripe Elements integration
  - [ ] Apple Pay / Google Pay
  - [ ] Order review screen
  - [ ] Privacy notice (data deletion after 30 days)

- [ ] Payment Processing
  - [ ] Stripe Checkout session creation
  - [ ] Payment confirmation handling
  - [ ] Webhook setup (payment_intent.succeeded)
  - [ ] Order record creation in database
  - [ ] Netlify Function: orders-create

- [ ] Order Management
  - [ ] Order history page
  - [ ] Order status tracking
  - [ ] Order details view
  - [ ] Digital card downloads
  - [ ] Reorder functionality

- [ ] Email Notifications
  - [ ] Order confirmation email
  - [ ] Shipping notification
  - [ ] Delivery confirmation
  - [ ] SendGrid/Resend integration

- [ ] Print Fulfillment
  - [ ] GotPrint API integration
  - [ ] Automated order submission
  - [ ] Tracking number retrieval
  - [ ] Status updates
  - [ ] Netlify Function: print-submit

**Deliverable:** Users can purchase cards and track orders

### 📋 Phase 5: Polish & Launch (Week 9-10)
**Goal:** Production ready

- [ ] Additional Templates (15 more = 20 total)
- [ ] Mobile PWA features
  - [ ] Manifest.json configuration
  - [ ] Service worker for offline support
  - [ ] Install prompt
  - [ ] Push notifications setup

- [ ] Performance Optimization
  - [ ] Image optimization (Next.js Image component)
  - [ ] Code splitting
  - [ ] Bundle size analysis
  - [ ] Lighthouse score > 90

- [ ] Testing
  - [ ] Unit tests for critical functions
  - [ ] Integration tests for user flows
  - [ ] End-to-end tests (Playwright)
  - [ ] Cross-browser testing
  - [ ] Mobile device testing

- [ ] Privacy & Security
  - [ ] COPPA compliance audit
  - [ ] Data deletion automation (30-day cleanup job)
  - [ ] Security headers configuration
  - [ ] Rate limiting on APIs
  - [ ] Input sanitization review

- [ ] Analytics
  - [ ] Event tracking setup (Posthog/Mixpanel)
  - [ ] Conversion funnel monitoring
  - [ ] Error tracking (Sentry)
  - [ ] Performance monitoring

- [ ] Documentation
  - [ ] User help documentation
  - [ ] FAQ section
  - [ ] Privacy policy
  - [ ] Terms of service
  - [ ] Support contact form

**Deliverable:** Public launch ready

### 🔮 Future Phases (Post-MVP)
- [ ] Phase 6: Photographer Features (Semi-Pro tier)
- [ ] Phase 7: Premium Tier (Custom design services)
- [ ] Phase 8: Social Features (Sharing, galleries)
- [ ] Phase 9: Geographic Expansion
- [ ] Phase 10: Advanced Features (AR, NFTs, etc.)

---

## PART 4: CODE PATTERNS (Copy-Paste Reference)

### Pattern 1: Creating a New Page

```typescript
// app/(dashboard)/teams/page.tsx

import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'My Teams | CAP',
  description: 'Manage your championship teams',
};

export default async function TeamsPage() {
  // Server-side auth check
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch data
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('owner_id', session.user.id);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-display text-cap-gold mb-6">
        My Championship Teams
      </h1>
      {/* Component rendering */}
    </div>
  );
}
```

### Pattern 2: Creating a Netlify Function

```typescript
// netlify/functions/teams-create.ts

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event, context) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { name, sport, season, teamColors, userId } = JSON.parse(event.body!);

    // Validate input
    if (!name || !sport || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Create team
    const { data: team, error } = await supabase
      .from('teams')
      .insert({
        name,
        sport,
        season,
        team_colors: teamColors,
        owner_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        team,
        message: 'CAP team created successfully',
      }),
    };
  } catch (error) {
    console.error('Team creation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create team' }),
    };
  }
};
```

### Pattern 3: Creating a Feature Component

```typescript
// components/features/teams/TeamCard.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Upload, Palette } from 'lucide-react';
import Link from 'next/link';
import { Team } from '@/lib/supabase/types';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-cap-gold to-cap-secondary">
        <CardTitle className="text-white flex items-center justify-between">
          <span>{team.name}</span>
          <span className="text-sm font-normal bg-white/20 px-2 py-1 rounded">
            {team.sport}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{team.player_count || 0} Champions</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/teams/${team.id}/roster`}>
                <Users className="mr-2 h-4 w-4" />
                Roster
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/teams/${team.id}/photos`}>
                <Upload className="mr-2 h-4 w-4" />
                Photos
              </Link>
            </Button>
          </div>

          <Button className="w-full bg-cap-gold hover:bg-cap-gold/90" asChild>
            <Link href={`/teams/${team.id}/design`}>
              <Palette className="mr-2 h-4 w-4" />
              Design Cards
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Pattern 4: Supabase Database Query

```typescript
// lib/supabase/queries/teams.ts

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Team } from '../types';

export async function getUserTeams(userId: string): Promise<Team[]> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('teams')
    .select(
      `
      *,
      children:children(count)
    `
    )
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching teams:', error);
    return [];
  }

  return data as Team[];
}

export async function createTeam(teamData: Partial<Team>): Promise<Team | null> {
  const supabase = createServerComponentClient({ cookies });

  const { data, error } = await supabase
    .from('teams')
    .insert(teamData)
    .select()
    .single();

  if (error) {
    console.error('Error creating team:', error);
    return null;
  }

  return data as Team;
}
```

### Pattern 5: Form with Validation (React Hook Form + Zod)

```typescript
// components/features/teams/TeamForm.tsx

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Zod schema
const teamFormSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  sport: z.string().min(1, 'Please select a sport'),
  season: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

export function TeamForm() {
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      sport: '',
      season: '',
      primaryColor: '#FFD700',
      secondaryColor: '#1E40AF',
    },
  });

  async function onSubmit(data: TeamFormValues) {
    try {
      const response = await fetch('/.netlify/functions/teams-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create team');

      const result = await response.json();
      console.log('Team created:', result);
      // Handle success (redirect, show toast, etc.)
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Thunder FC" {...field} />
              </FormControl>
              <FormDescription>Enter your team's name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sport</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-cap-gold hover:bg-cap-gold/90">
          Create Championship Team
        </Button>
      </form>
    </Form>
  );
}
```

### Pattern 6: State Management with Zustand

```typescript
// lib/stores/cart-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  cardDesignId: string;
  quantity: number;
  cardStock: 'standard' | 'premium';
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (cardDesignId: string) => void;
  updateQuantity: (cardDesignId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (cardDesignId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cardDesignId !== cardDesignId),
        })),

      updateQuantity: (cardDesignId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.cardDesignId === cardDesignId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      total: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'cap-cart-storage',
    }
  )
);
```

### Pattern 7: AI Integration (Claude API)

```typescript
// lib/ai/claude.ts

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface PlayerBioInput {
  firstName: string;
  position?: string;
  jerseyNumber?: number;
  sport: string;
  ageGroup?: string;
  stats?: Record<string, any>;
}

export async function generatePlayerBio(player: PlayerBioInput): Promise<string> {
  const prompt = `Generate a 2-sentence trading card bio for a youth athlete:

Name: ${player.firstName}
Sport: ${player.sport}
Position: ${player.position || 'Player'}
Jersey Number: ${player.jerseyNumber || 'N/A'}
Age Group: ${player.ageGroup || 'Youth'}
Stats: ${JSON.stringify(player.stats || {})}

Guidelines:
- Make it inspiring and confidence-building
- Use age-appropriate language
- Focus on potential and team contribution
- Avoid comparisons to professional players
- Keep it under 50 words total
- Make the player sound like a champion`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const textContent = message.content.find((block) => block.type === 'text');
  return textContent?.type === 'text' ? textContent.text : '';
}
```

### Pattern 8: Environment Variables Access

```typescript
// lib/config/env.ts

// Server-side only (Netlify Functions, Server Components)
export const serverEnv = {
  supabase: {
    url: process.env.SUPABASE_URL!,
    serviceKey: process.env.SUPABASE_SERVICE_KEY!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
  },
  replicate: {
    apiToken: process.env.REPLICATE_API_TOKEN!,
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
  gotprint: {
    apiKey: process.env.GOTPRINT_API_KEY!,
    ftpHost: process.env.GOTPRINT_FTP_HOST!,
    ftpUser: process.env.GOTPRINT_FTP_USER!,
    ftpPassword: process.env.GOTPRINT_FTP_PASSWORD!,
  },
};

// Client-side safe (prefixed with NEXT_PUBLIC_)
export const clientEnv = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};
```

---

## PART 5: ARCHITECTURE DECISIONS

### ADR-001: Why Next.js 14 with App Router?

**Decision:** Use Next.js 14 with App Router (not Pages Router)

**Context:**
- Need server-side rendering for SEO (landing pages)
- Want server components to reduce client-side JavaScript
- App Router is the future of Next.js
- Better TypeScript support

**Consequences:**
- ✅ Server components reduce bundle size
- ✅ Nested layouts for consistent UI
- ✅ Built-in loading/error states
- ❌ Steeper learning curve than Pages Router
- ❌ Some ecosystem libraries still Pages-focused

**Alternatives Considered:**
- Create React App: No SSR, poor SEO
- Remix: Less mature ecosystem
- Pages Router: Deprecated direction

---

### ADR-002: Why Netlify over Vercel?

**Decision:** Deploy on Netlify (not Vercel)

**Context:**
- Vercel is the "obvious" choice for Next.js
- Netlify offers similar features with different trade-offs
- Need serverless functions for API logic
- Want edge functions for image optimization

**Consequences:**
- ✅ Netlify Functions are simple to write
- ✅ Good free tier for MVP
- ✅ Easy environment variable management
- ✅ Built-in form handling (useful for contact forms)
- ❌ Vercel has better Next.js integration (made by same team)
- ❌ Slightly more configuration needed

**Alternatives Considered:**
- Vercel: Better Next.js integration but more expensive
- Railway: Good but less mature for Next.js
- AWS Amplify: Overly complex for MVP

---

### ADR-003: Why Supabase over Firebase?

**Decision:** Use Supabase for backend (not Firebase)

**Context:**
- Need auth, database, storage, and real-time features
- Want SQL database for complex queries
- Prefer open-source solution
- Need fine-grained access control (RLS)

**Consequences:**
- ✅ PostgreSQL is powerful and familiar
- ✅ Row Level Security for data privacy
- ✅ SQL migrations are version-controlled
- ✅ Self-hostable if needed later
- ✅ Great TypeScript support
- ❌ Slightly more complex than Firebase
- ❌ Smaller community than Firebase

**Alternatives Considered:**
- Firebase: Easier but NoSQL limits flexibility
- PlanetScale: SQL but no built-in auth/storage
- AWS Amplify: Too complex for MVP

---

### ADR-004: Why shadcn/ui over Material-UI?

**Decision:** Use shadcn/ui component library (not Material-UI/Chakra)

**Context:**
- Need consistent, accessible components
- Want to customize components easily
- Don't want large bundle size
- Prefer Tailwind-based styling

**Consequences:**
- ✅ Components are copied into your codebase (full control)
- ✅ Built on Radix UI (accessibility-first)
- ✅ Tailwind-based (matches our styling approach)
- ✅ Smaller bundle size (only import what you use)
- ❌ Less comprehensive than Material-UI
- ❌ Need to manually add components as needed

**Alternatives Considered:**
- Material-UI: Large bundle, opinionated styling
- Chakra UI: Good but more runtime JavaScript
- Headless UI: Too bare-bones, would need more custom work

---

### ADR-005: Why Zustand over Redux?

**Decision:** Use Zustand for client state management (not Redux/Context)

**Context:**
- Need to manage cart, UI state, user preferences
- Want simple API without boilerplate
- Don't need time-travel debugging
- Want TypeScript support

**Consequences:**
- ✅ Minimal boilerplate compared to Redux
- ✅ Hook-based API is intuitive
- ✅ Built-in persistence middleware
- ✅ Small bundle size (~1KB)
- ❌ Smaller ecosystem than Redux
- ❌ No dev tools (but not needed for MVP)

**Alternatives Considered:**
- Redux Toolkit: Too much boilerplate for simple state
- React Context: Re-render issues, no persistence
- Jotai/Recoil: More atomic, unnecessary complexity

---

### ADR-006: Why Replicate for AI vs Building Our Own?

**Decision:** Use Replicate API for background removal (not self-hosted models)

**Context:**
- Need high-quality background removal
- Don't want to manage ML infrastructure
- Want predictable costs
- Need reliability and uptime

**Consequences:**
- ✅ No infrastructure management
- ✅ Proven model quality (rembg/u2net)
- ✅ Pay-per-use pricing (scales with usage)
- ✅ Fast processing times
- ❌ External dependency (vendor lock-in)
- ❌ Per-image cost adds up at scale
- ❌ Less control over model customization

**Alternatives Considered:**
- Self-hosted Remove.bg: Infrastructure complexity
- Cloudinary AI: Higher cost per image
- Building our own: Requires ML expertise + GPU infrastructure

---

### ADR-007: Why GotPrint for Fulfillment?

**Decision:** Use GotPrint API for card printing (not Printful/Gelato)

**Context:**
- Need trading card-specific printing
- Want low per-unit cost ($0.17/card)
- Need 2.5" x 3.5" standard card size
- Want professional cardstock quality

**Consequences:**
- ✅ Lowest per-card cost found in research
- ✅ Trading card expertise (not generic printing)
- ✅ API available for automation
- ✅ Fast turnaround (2-4 days production)
- ❌ Requires FTP for file uploads (more complex)
- ❌ Less hand-holding than Printful
- ❌ Minimum order quantities to consider

**Alternatives Considered:**
- Printful: Easier API but $0.30+/card (too expensive)
- Gelato: Good international shipping but higher costs
- Local print shops: No API, manual process

---

### ADR-008: Why COPPA Compliance from Day 1?

**Decision:** Build COPPA-compliant data handling from the beginning

**Context:**
- Dealing with children under 13 (youth sports)
- COPPA requires verifiable parental consent
- Heavy fines for non-compliance ($43,280 per violation)
- Ethical responsibility to protect kids

**Strategy:**
- Only collect data from adults (parents/coaches)
- Minimal data for children (first name + jersey number only)
- No facial recognition without explicit consent
- Auto-delete photos after 30 days
- Clear privacy notices throughout app

**Consequences:**
- ✅ Legal protection from day 1
- ✅ Trust with parents (privacy-first brand)
- ✅ Easier to maintain compliance than retrofit
- ❌ More complex data model (separation of adult/child data)
- ❌ Limits some features (can't do social features for kids)

**Alternative:**
- Collect everything, deal with compliance later: REJECTED (too risky)

---

## PART 6: QUICK REFERENCE

### Environment Variables Checklist

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI APIs
REPLICATE_API_TOKEN=r8_...
ANTHROPIC_API_KEY=sk-ant-...

# Print Fulfillment
GOTPRINT_API_KEY=your-key
GOTPRINT_FTP_HOST=ftp.gotprint.com
GOTPRINT_FTP_USER=your-user
GOTPRINT_FTP_PASSWORD=your-password

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Schema Quick Reference

```sql
-- Core Tables
users          -- Parents/coaches (18+)
teams          -- Teams/rosters
children       -- Athletes (minimal data)
photos         -- Uploaded images (auto-delete after 30 days)
card_designs   -- Saved card designs
orders         -- Purchase orders
consent_log    -- Immutable audit trail
```

### API Endpoints

```
# Netlify Functions (all under /.netlify/functions/)
POST   /auth-signup           -- Create account
POST   /auth-verify-age       -- Verify 18+
POST   /teams-create          -- Create team
GET    /teams-get             -- Get user's teams
POST   /photos-upload         -- Upload photos
POST   /photos-enhance        -- AI enhancement
POST   /cards-generate-bio    -- Generate bio with Claude
POST   /orders-create         -- Create order
POST   /orders-checkout       -- Process payment
POST   /print-submit          -- Submit to GotPrint
```

### CAP Branding Colors

```css
/* Tailwind config - use these class names */
bg-cap-gold       /* Primary: #FFD700 */
bg-cap-secondary  /* Blue: #1E40AF */
bg-cap-accent     /* Red: #DC2626 */
bg-cap-success    /* Green: #059669 */
text-cap-gold
border-cap-gold
/* etc. */
```

### Typography

```css
font-ui        /* Inter - body text */
font-display   /* Bebas Neue - headings */
font-card      /* Graduate - card text */
```

### Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Run ESLint
npm run type-check             # TypeScript check

# Supabase
npx supabase start             # Start local Supabase
npx supabase db reset          # Reset local DB
npx supabase db push           # Push migrations
npx supabase gen types typescript # Generate TypeScript types

# Netlify
netlify dev                    # Run Netlify dev environment
netlify deploy                 # Deploy to preview
netlify deploy --prod          # Deploy to production

# Testing
npm run test                   # Run tests
npm run test:watch             # Watch mode
npm run test:e2e               # End-to-end tests
```

### Useful File Paths

```
Config files:
  /.env.local
  /netlify.toml
  /next.config.js
  /tailwind.config.ts
  /tsconfig.json

Key components:
  /components/ui/              (shadcn components)
  /components/features/        (CAP features)
  /components/shared/          (shared UI)

Pages:
  /app/page.tsx                (landing)
  /app/(dashboard)/dashboard/  (main dashboard)
  /app/(auth)/login/           (login)

Functions:
  /netlify/functions/          (serverless)

Utils:
  /lib/cap-config.ts           (CAP branding)
  /lib/supabase/client.ts      (Supabase client)
  /lib/utils.ts                (utilities)
```

---

## APPENDIX A: Testing Strategy

### Unit Tests
- Utility functions (`/lib/utils.ts`)
- Validation schemas (Zod)
- State stores (Zustand)
- API functions

**Tools:** Vitest, React Testing Library

### Integration Tests
- User flows (signup → team creation → photo upload)
- API endpoints (Netlify Functions)
- Database operations

**Tools:** Vitest, Supabase Test Helpers

### End-to-End Tests
- Critical user journeys
  - Sign up and create first team
  - Upload photos and create cards
  - Complete purchase

**Tools:** Playwright

### Manual Testing Checklist
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test with slow 3G network
- [ ] Test with screen reader
- [ ] Test all payment flows
- [ ] Test error states

---

## APPENDIX B: Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Lighthouse Score | > 90 | Lighthouse |
| Photo Upload (10 photos) | < 5s | Custom tracking |
| AI Enhancement per photo | < 10s | Replicate API time |
| Card Preview Generation | < 2s | Custom tracking |
| Checkout flow completion | < 30s | Analytics funnel |

---

## APPENDIX C: Security Checklist

- [ ] HTTPS enforced (automatic on Netlify)
- [ ] Environment variables secured (never in client code)
- [ ] Supabase RLS policies enabled on all tables
- [ ] API rate limiting implemented
- [ ] Input sanitization on all forms
- [ ] COPPA compliance verified
- [ ] 30-day auto-deletion job running
- [ ] Age verification enforced (18+)
- [ ] Parental consent tracked
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] SQL injection protection (using parameterized queries)
- [ ] XSS protection (React escapes by default, but verify)
- [ ] CSRF protection on state-changing operations
- [ ] Webhook signature verification (Stripe)

---

## APPENDIX D: Launch Checklist

### Pre-Launch
- [ ] All Phase 1-4 items completed
- [ ] 5 templates designed and tested
- [ ] GotPrint integration tested with test order
- [ ] Stripe in live mode with real payments tested
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Support email set up (support@cap.com or similar)
- [ ] Analytics tracking verified
- [ ] Error monitoring active (Sentry)
- [ ] SSL certificate verified
- [ ] Custom domain configured
- [ ] SEO metadata on all pages
- [ ] Social media preview images (og:image)

### Launch Day
- [ ] Final production deploy
- [ ] Test critical user flows on production
- [ ] Monitor error logs
- [ ] Monitor payment webhooks
- [ ] Have support coverage ready
- [ ] Announce to initial beta users

### Post-Launch (First Week)
- [ ] Daily error monitoring
- [ ] Track conversion funnel metrics
- [ ] Gather user feedback
- [ ] Fix critical bugs immediately
- [ ] Plan iteration based on feedback

---

## DOCUMENT VERSION CONTROL

**Version:** 1.0
**Created:** October 19, 2024
**Last Updated:** October 19, 2024
**Next Review:** After Phase 1 completion

**Changelog:**
- v1.0 (Oct 19, 2024): Initial master guide created

---

## 🎯 REMEMBER: The CAP Mission

We're building a platform that makes every kid feel like a champion. Keep the user experience simple, fast, and magical. Parents should be able to create beautiful trading cards in under 5 minutes using just their phone.

**Core Values:**
- ⚡ **Speed:** Fast AI processing, quick delivery
- 🎨 **Quality:** Professional-looking cards that kids are proud of
- 🔒 **Privacy:** COPPA-first, protect children's data
- 💛 **Delight:** Small touches that make parents smile (AI-generated bios, card flip animations)

Let's build something awesome! 🏆
