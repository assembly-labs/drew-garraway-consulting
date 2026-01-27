# Gather - Claude Context

## What This Is

**Instacart for farmers markets.** Customers browse, cart, checkout, and pickup at the market.

MVP Focus: Berwyn Farmers Market (70+ vendors). Prove customers will buy online.

## Project Structure

```
gather/
├── PRD.md                      # THE source of truth - comprehensive product spec
├── CLAUDE.md                   # This file
├── css/
│   └── styles.css              # Base styles (design tokens, components)
└── design-system/
    └── DESIGN_SYSTEM.md        # Color, typography, spacing, components
```

## Key Documents

| Document | Purpose |
|----------|---------|
| `PRD.md` | Complete product requirements - features, data model, API, roadmap |
| `design-system/DESIGN_SYSTEM.md` | Brand colors, typography, components, accessibility |
| `css/styles.css` | CSS custom properties and component styles |

## Tech Stack (MVP)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (Supabase or Railway) |
| ORM | Prisma |
| Auth | NextAuth.js or Clerk |
| Payments | Stripe |
| Hosting | Vercel |
| Email | Resend |

## MVP Scope

**In Scope:**
- Customer storefront (browse, search, filter)
- Multi-vendor shopping cart
- Stripe checkout with pickup time selection
- Order confirmation with QR code
- Staff order dashboard
- Pick lists per vendor
- Customer check-in (QR scan)
- Admin product management

**Out of Scope (Phase 2+):**
- Vendor self-service portal
- SNAP/EBT processing
- Market manager dashboard
- Native mobile apps
- Delivery

## Design System

**Primary Colors:**
- Sage green: `#4A7C28` (--sage-500)
- Golden hour: `#FFB74D` (--gold-300)
- Text: `#37352F` (--dash-text)

**Typography:**
- Headings: DM Sans (700)
- Body: Inter (400)

**Key Principles:**
- Mobile-first (70%+ traffic)
- Touch targets: 48px minimum
- WCAG 2.1 AA accessibility
- <2s page load

## Roadmap Summary

| Phase | Duration | Goal |
|-------|----------|------|
| 1: MVP | Months 1-6 | Prove customers buy online at Berwyn |
| 2: Vendor Self-Service | Months 7-12 | Scale to 10 markets |
| 3: Manager Dashboard | Months 13-18 | 100 markets, SNAP/EBT |
| 4: Platform Ecosystem | Months 19-24 | Series A ready |

## Commands

When the app is built:

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npx prisma migrate dev` | Run database migrations |
| `npx prisma studio` | Open database GUI |

## Status

**Current Phase:** Pre-development (defining MVP)

**Next Steps:**
1. Finalize open questions in PRD.md
2. Set up Next.js project with Prisma
3. Build customer storefront (Month 2)

## Important Notes

- **Read PRD.md first** - it has all feature specs, data models, and API definitions
- **Design system is in `/design-system/`** - use those tokens for consistency
- **MVP = pickup only** - no delivery, no vendor self-service, no SNAP/EBT yet
- **Berwyn first** - single market focus until proven
