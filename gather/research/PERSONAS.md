# Gather User Personas

> **Source:** Market research synthesis from USDA reports, Farmers Market Coalition data, and industry analysis. These personas inform all UX decisions.

---

## Overview

Gather serves three distinct stakeholder groups with fundamentally different needs, tech comfort levels, and usage contexts:

| Persona | Role | Priority | UX Philosophy |
|---------|------|----------|---------------|
| **Margaret** | Market Manager | Primary | Notion-clean, data-dense, keyboard-first |
| **Victor** | Vendor/Farmer | Secondary | WhatsApp-simple, big-touch, offline-first |
| **Catherine** | Customer/Shopper | Tertiary | Instacart-fresh, image-forward, thumb-first |

---

## Primary: Market Manager "Margaret"

### Demographics

- **Age:** 48 years old
- **Gender:** Female (73% of managers are female)
- **Race:** 87% White
- **Education:** Bachelor's degree
- **Tenure:** Mean 4.4 years managing markets

### Work Status

- Only **39% of markets** employ paid managers
- **60% rely exclusively on volunteers**
- Among paid positions, just **11.3% are full-time year-round**
- Most are part-time, seasonal, or volunteer

### Tech Comfort Level

**Basic** — uses email, Facebook, struggles with complex software.

**Tech reference points:**
- Square (POS)
- Basic spreadsheets
- Email and text messaging

### Budget Reality

- Markets operate on **$10,000-500,000 annually**
- Technology spending **under 5% of budget**
- Even **$30/month feels expensive** for volunteer-run operations
- **88% seasonal, 71% Saturday-only** — annual subscriptions feel wrong

### Critical Pain Points

| Pain Point | Details |
|------------|---------|
| **Drowning in paperwork** | Managing vendors via "4-inch binders" and spreadsheets |
| **SNAP/EBT processing** | Manual token distribution and reconciliation — most time-consuming task |
| **Fee collection** | Entirely manual — tracking overdue payments, confronting vendors about late fees |
| **Grant reporting** | USDA FMPP/LFPP requires manual data compilation taking 40+ hours |
| **Communication chaos** | Scattered across email, phone, text — frequent missed messages and vendor conflicts |
| **No product visibility** | Doesn't know what's available when |

### What Margaret Says

> "I'm drowning in paperwork."

> "I spend more time on admin than on actually running the market."

> "I can't prove our impact to funders."

### UX Design Implications

- **Notion-clean, data-dense, keyboard-first**
- Professional tools that save time
- Must demonstrate immediate value within the first market day
- Overcome change resistance by showing 2-click solutions
- **If it takes more than 2 clicks or 30 seconds to understand, it's too complex**

---

## Secondary: Vendor "Victor"

### Demographics

- **Farm Type:** Small family farm
- **Gross Income:** <$150,000
- **Age:** 33% of direct-marketing farmers are 65+
- **Farm Size:** 86-88% of all US farms are small family farms

### Tech Comfort Level

**Low** — only 36% of small farms use digital tools.

**Barriers to adoption:**
- Cost barriers (47-52%)
- Unclear ROI (40%)
- Complexity (32%)
- Age/digital literacy gaps
- **27% of direct-marketing farms lack reliable internet**

### Financial Reality

- **51% report negative net farm income**
- **77% of household income** comes from off-farm employment
- Farming is often a side business or retirement activity
- Cash flow is a constant crisis

### Critical Pain Points

| Pain Point | Details |
|------------|---------|
| **Cash flow crisis** | 51% negative net farm income, 77% rely on off-farm income |
| **Payment delays** | Wholesale standard is 30-45 days; only 5% pay promptly |
| **Multi-channel inventory** | Managing across farmers market, CSA, on-farm stand, wholesale |
| **Admin burden** | 15-20% of time consumed by order management, invoicing, coordination |
| **No online presence** | No easy way to reach customers online |

### What Victor Says

> "I need to get paid faster."

> "I spend more time on paperwork than farming."

> "I can't afford another subscription that doesn't pay for itself."

### UX Design Implications

- **WhatsApp-simple, big-touch (56px minimum targets), offline-first**
- Must work in fields with unreliable connectivity
- Setup must take **under 5 minutes**
- **Flat monthly fees, never percentage-based commissions**
- Simple binary choices (Accept/Reject, Yes/No)
- Success celebration animations when orders complete

---

## Tertiary: Customer "Catherine"

### Demographics

- **Age:** 35-45 years old
- **Gender:** 70-78% female
- **Household Income:** $96,000+
- **Education:** 77% hold bachelor's degrees (vs 32% nationally)
- **Shopping frequency:** 34% weekly, 32% 2-3x monthly

### Shopping Behavior

| Metric | Value |
|--------|-------|
| Average transaction (walk-up) | $28-42 per visit |
| Urban/large market average | $50-62 per visit |
| **Online pre-order average** | **$59** (2-4x walk-up) |
| Credit card uplift | +$8-12 per purchase |
| Regular shopper spend (6+ visits/year) | $46.36 vs $33.19 occasional |

### Motivation Ranking (What Drives Purchase)

1. **Freshness** (95-97%)
2. **Supporting local farmers/economy** (70-80%)
3. **Quality and taste** (94-95%)
4. **Organic/production methods** (60-75%)
5. **Value for money** — dead last (30-40%)

*Note: Price is NOT a primary driver. These customers are values-driven.*

### Critical Pain Points

| Pain Point | Details |
|------------|---------|
| **Inconvenience** | 51% cite as primary barrier (limited hours, weather, can't pre-order) |
| **Schedule conflicts** | Can't attend Saturday morning markets due to work/family |
| **No product visibility** | Don't know what's available before going |
| **Incomplete shopping** | Can't complete full grocery shopping at one market |
| **SNAP/EBT exclusion** | Can't process EBT online — excluded from convenience |

### What Catherine Says

> "I would shop there more if I could pre-order."

> "I never know what's going to be available."

> "Saturday mornings don't work for our family."

### UX Design Implications

- **Instacart-fresh, image-forward, thumb-first**
- Familiar shopping patterns from Instacart/DoorDash
- Multi-vendor cart with consolidated checkout
- Search with filters (organic, dietary, vendor)
- Product recommendations based on history
- **Page load time <2 seconds** (image optimization critical)
- Full accessibility (WCAG 2.1 AA)

---

## Persona Decision Matrix

Use this when making UX tradeoffs:

| If you're building for... | Prioritize... | Avoid... |
|---------------------------|---------------|----------|
| **Margaret (Manager)** | Data density, keyboard shortcuts, bulk actions | Wizards, hand-holding, excessive whitespace |
| **Victor (Vendor)** | Large touch targets, offline mode, instant feedback | Small text, complex forms, percentage fees |
| **Catherine (Customer)** | Beautiful photos, fast loading, familiar patterns | Unusual navigation, text-heavy pages, friction |

---

## Key Research Sources

- USDA NASS Census of Agriculture (2022)
- Farmers Market Coalition Annual Reports
- USDA ERS Farm Income & Wealth Statistics
- Agricultural Marketing Resource Center direct marketing studies
- Industry interviews with 20+ market managers

---

*Last updated: February 2025*
