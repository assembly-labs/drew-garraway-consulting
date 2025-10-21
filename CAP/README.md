# CAP - Championship Athletic Prospects

> **AI-powered youth sports trading card platform**
> Parents create professional trading cards from phone photos in under 5 minutes

---

## 🤖 For AI Assistants: Quick Context

**BEFORE doing ANY work, read this:**

1. **Read the master guide:** `/docs/CAP_MASTER_GUIDE.md` (comprehensive implementation guide)
2. **Check current phase:** We are in **Phase 0: Pre-Development** (see BUILD_STATUS in master guide)
3. **Tech stack (DO NOT suggest alternatives):**
   - Next.js 14 + TypeScript + Tailwind + shadcn/ui
   - Supabase (database + auth + storage)
   - Netlify (hosting + functions)
   - Stripe + Replicate + Claude API

4. **Every session, start your response with:**
   ```
   📋 CAP Project Context:
   - Current Phase: [X]
   - Last Completed: [Y]
   - Working On: [Z]
   ```

5. **Follow patterns in master guide:** Don't rebuild—extend existing code

---

## 📁 Project Structure

```
CAP/
├── _docs/                    # Research & requirements (READ-ONLY)
├── docs/                     # Implementation guides (READ FIRST)
│   └── CAP_MASTER_GUIDE.md  # 👈 PRIMARY REFERENCE
├── app/                      # Next.js App Router
├── components/               # React components
├── netlify/                  # Serverless functions
├── lib/                      # Utils & config
├── public/                   # Static assets
└── supabase/                 # Database migrations
```

**Key files:**
- `/docs/CAP_MASTER_GUIDE.md` - Complete implementation guide (read first!)
- `/lib/cap-config.ts` - CAP branding configuration
- `/lib/supabase/client.ts` - Database client

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Netlify dev environment (with functions)
netlify dev

# Start local Supabase
npx supabase start
```

---

## 🎯 Current Status

**Phase:** Phase 0 - Pre-Development
**Next:** Initialize project structure and configure tools
**Timeline:** 8-week MVP to launch

See `/docs/CAP_MASTER_GUIDE.md` Part 3 (BUILD_STATUS) for detailed progress.

---

## 🏗️ MVP Features (8 Weeks)

### Phase 1: Foundation (Weeks 1-2)
- Authentication (Supabase Auth)
- Team/roster management
- Age verification (18+)
- COPPA compliance

### Phase 2: Photo Pipeline (Weeks 3-4)
- Photo upload (mobile-first)
- AI background removal (Replicate)
- Photo quality scoring
- Photo gallery

### Phase 3: Card Designer (Weeks 5-6)
- Template system (5 initial designs)
- Card customization
- AI bio generation (Claude)
- Print file generation

### Phase 4: Commerce (Weeks 7-8)
- Stripe checkout
- Order management
- GotPrint integration
- Email notifications

---

## 🎨 CAP Branding

**Colors:**
- Primary (Gold): `#FFD700` → `bg-cap-gold`
- Secondary (Blue): `#1E40AF` → `bg-cap-secondary`
- Accent (Red): `#DC2626` → `bg-cap-accent`

**Typography:**
- UI: Inter
- Display: Bebas Neue
- Cards: Graduate

**Voice:**
- Empowering ("Make your champions shine")
- Fast ("Cards in minutes, not days")
- Privacy-focused ("We protect your champions")

---

## 📋 Essential Documentation

1. **[CAP_MASTER_GUIDE.md](docs/CAP_MASTER_GUIDE.md)** - Complete implementation reference
2. **[PRD](docs/_product/cap-prd-mvp.md)** - Product requirements
3. **[Market Research](docs/_research/)** - Competitive analysis
4. **[UX Spec](docs/_ux/cap-ux-implementation-spec.md)** - UI/UX specifications

---

## 🔐 Privacy & Compliance

**COPPA-Compliant from Day 1:**
- Only adults (18+) create accounts
- Minimal child data (first name + jersey number only)
- Auto-delete photos after 30 days
- No facial recognition without consent
- Parental consent tracking

---

## 🛠️ Development Workflow

### Adding a New Feature

1. Check `/docs/CAP_MASTER_GUIDE.md` for existing patterns
2. Follow folder structure (feature components go in `/components/features/`)
3. Use shadcn/ui for UI components
4. Follow naming conventions (see master guide)
5. Update BUILD_STATUS in master guide when complete

### Creating a Netlify Function

```typescript
// netlify/functions/example-action.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Your code here
};
```

### Database Changes

```bash
# Create new migration
npx supabase migration new migration_name

# Edit /supabase/migrations/XXX_migration_name.sql

# Apply locally
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript > lib/supabase/types.ts
```

---

## 🧪 Testing

```bash
npm run test              # Unit tests
npm run test:watch        # Watch mode
npm run test:e2e          # End-to-end tests
```

**Critical flows to test:**
- User signup → team creation → photo upload → card design → checkout

---

## 🚢 Deployment

**Environment:** Netlify
**Live Site:** TBD
**Staging:** Auto-deploys on push to `develop`
**Production:** Auto-deploys on push to `main`

```bash
# Preview deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

---

## 📊 Success Metrics

**MVP Targets (Month 6):**
- 100 teams served
- 35-40% parent conversion rate
- <10 min time to first card
- NPS score >50
- 5-7 day delivery
- 65% net margin

---

## 🤝 Contributing

This is a solo project, but the structure is designed for collaboration.

**Code Style:**
- TypeScript strict mode
- ESLint + Prettier
- Follow patterns in master guide
- Comment complex logic

---

## 📞 Support

**For Development Questions:**
- Check `/docs/CAP_MASTER_GUIDE.md` first
- Reference code patterns in existing components
- Review architecture decisions (ADR sections)

---

## 🎯 The Mission

Make every kid feel like a champion. Build a platform that turns phone photos into professional trading cards in under 5 minutes—fast, beautiful, and privacy-first.

---

**Version:** 1.0
**Last Updated:** October 19, 2024
**Status:** Pre-Development

**Let's build something awesome! 🏆**
