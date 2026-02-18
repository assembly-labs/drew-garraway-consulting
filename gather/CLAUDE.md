# Gather — Claude Code Context

> **Purpose:** Quick-reference routing document for Claude Code. Points to the right source doc for any question. Does NOT duplicate content from other files.

---

## What Gather Is

A three-sided marketplace for farmers markets — "Instacart for farmers markets." Customers browse, cart, checkout online and pick up at the physical market. Serves market managers, vendors, and customers.

**Tagline:** "Good things from good people"

**What we are NOT:** Not a delivery service. Not a wholesale-retail intermediary. Not competing with farmers. Pickup-only, always. These are settled decisions — don't revisit them.

---

## Project Structure

```
gather/
├── CLAUDE.md              # THIS FILE - routing + principles
├── README.md              # Project overview
├── PRD.md                 # Product requirements, data model, API spec, architecture
│
├── docs/
│   └── FEATURE_SPEC.md    # Complete feature specs across all domains (180 MVP + future)
│
├── research/
│   ├── BUSINESS_MODEL.md           # Revenue model, unit economics, GTM strategy
│   ├── CARLO_CONVERSATION_PREP.md  # Drew's private meeting notes (NOT for sharing)
│   ├── EQUITY_TERM_SHEET_DREW.md   # Drew's equity/comp proposal draft
│   ├── dara-questionnaire-responses.md  # Dara's operations workflow answers
│   ├── operations-questionnaire.html    # Shareable questionnaire
│   ├── gather-research-review.html      # Visual research summary
│   ├── next-steps-outline.html          # Action items
│   ├── platform-questions-response.html # Platform Q&A
│   ├── philly-foodworks-competitive-analysis.html
│   ├── EQUITY_TERM_SHEET_DREW.html
│   └── gather-competitive-analysis.docx
│
├── brand/
│   └── BRAND_GUIDE.md     # Complete brand guide: voice, design system, components
│
├── css/, images/, js/, prototype/, robots.txt
```

---

## Where to Find What

| Question | Go To |
|----------|-------|
| MVP scope, phasing, data model, API spec | `PRD.md` |
| Feature details (any domain) | `docs/FEATURE_SPEC.md` |
| User personas (Margaret, Victor, Catherine) | `PRD.md` §2 |
| Competitive landscape | `PRD.md` Appendix A |
| Revenue model, pricing, unit economics | `research/BUSINESS_MODEL.md` |
| Go-to-market, funding strategy | `research/BUSINESS_MODEL.md` |
| Real-world operations workflow | `research/dara-questionnaire-responses.md` |
| Brand voice, copy guidelines | `brand/BRAND_GUIDE.md` |
| Design system (colors, fonts, components) | `brand/BRAND_GUIDE.md` |
| Stripe Connect implementation | `docs/FEATURE_SPEC.md` Part 5 |
| Reporting/analytics features | `docs/FEATURE_SPEC.md` Part 6 |

---

## Three UX Experiences

| Interface | Philosophy | Font | Touch Target |
|-----------|-----------|------|-------------|
| Manager Dashboard | Notion-clean, data-dense, keyboard-first | Inter 14px | 44px |
| Consumer Marketplace | Instacart-fresh, image-forward, thumb-first | DM Sans 16px | 44px |
| Vendor Portal | WhatsApp-simple, big-touch, offline-first | System 18px | 56px |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| State | Zustand, React Hook Form |
| Backend | Node.js, PostgreSQL, Prisma |
| Payments | Stripe Connect (Express accounts) |
| Auth | Auth0 |
| Email/SMS | SendGrid / Twilio |
| Hosting | Vercel + AWS |
| CDN | Cloudflare |

---

## MVP Scope (Phase 1, Months 1-6)

**Target:** Berwyn Farmers Market. $50K GMV, 500+ customers, $59 avg basket, 40% repeat rate.

**In scope:** Customer storefront, multi-vendor cart, Stripe checkout, guest checkout, pickup slots, order confirmation with QR, staff order dashboard, pick lists, QR check-in, admin product management, basic reporting.

**Out of scope:** Vendor self-service (Phase 2), SNAP/EBT (Phase 3), market manager dashboard (Phase 3), delivery (never).

**Authoritative MVP spec:** `PRD.md`

---

## Design & Development Principles

1. **Margaret can't figure out complex software.** 2 clicks or 30 seconds to understand, max.
2. **Victor is in a field with spotty reception.** Offline-first, big buttons, no tiny text.
3. **Catherine expects Instacart quality.** Fast, modern, familiar shopping UX.
4. **We facilitate, never intermediate.** Vendors control products, prices, relationships.
5. **Time is the universal currency.** Every feature must save time for someone.
6. **Seasonal business, seasonal billing.** No annual contracts for 20-week businesses.
7. **Grant reporting is a feature, not an afterthought.** 50-60% of markets are nonprofits.
8. **NO to delivery, wholesale-retail, and inventory risk.** Settled decisions.

### What Failed Companies Teach Us

- **Good Eggs** ($200M burned): Premature scaling before proving unit economics.
- **Farmigo** ($26M burned): Distribution logistics "much more complicated than anticipated."
- **Webvan** ($800M bankruptcy): Massive infrastructure before product-market fit.
- **Lesson:** Prove Berwyn first, then scale methodically.

### What Berwyn Teaches Us

- Professional curation creates superior vendor selection
- 70+ vendor pool with 25-30 rotating weekly = flexibility + variety
- Online ordering validated: higher basket sizes, convenience-seekers captured
- Affluent demographics ($137K median HHI) support premium pricing
- Extended season (May-Dec + winter) maintains customer habits

---

*PRD.md is the source of truth for product requirements. This file is a routing guide. Last updated: February 2026.*
