# Gather Business Model & Go-to-Market Strategy

> **Purpose:** Revenue model, pricing tiers, unit economics, and go-to-market strategy. For KPIs and development timeline, see `PRD.md`.

---

## 1. Revenue Model

### 1.1 Tiered SaaS Subscriptions (Market Managers)

| Tier | Price | Vendor Limit | Features |
|------|-------|-------------|----------|
| **Free** | $0/mo | <10 vendors | Basic vendor management (land grab strategy) |
| **Starter** | $49/mo | 10-30 vendors | Full management + communications |
| **Professional** | $149/mo | 30-75 vendors | + SNAP/EBT, grant reporting, analytics |
| **Enterprise** | $299/mo | 75+ vendors | + multi-market, API access, custom reports |

**Pricing Philosophy:**
- Seasonal operations (88% of markets) — monthly billing, no annual lock-in
- Value demonstrated within first market day
- Free tier captures small markets, upgrades when they grow

### 1.2 Marketplace Transaction Fees (Phase 1+)

| Fee Type | Rate | Notes |
|----------|------|-------|
| **Marketplace transactions** | 2.5% | On all consumer orders |
| **SNAP/EBT processing** | 1.0% | Lower rate for accessibility |
| **Payment processing** | ~2.9% + $0.30 | Stripe fees (pass-through) |

### 1.3 Optional Vendor Subscriptions (Phase 2+)

| Tier | Price | Features |
|------|-------|----------|
| **Basic** | Free | Standard listing, order management |
| **Pro** | $29/mo | Featured placement, analytics, promotions |
| **Premium** | $99/mo | Priority search, marketing tools, bulk exports |

---

## 2. Unit Economics

### Customer Acquisition Cost (CAC)

| Channel | Estimated CAC |
|---------|---------------|
| Direct outreach (Carlo's network) | $200-400 |
| Referral from existing markets | $300-500 |
| Conference/association marketing | $800-1,200 |
| Content marketing (inbound) | $500-800 |
| **Blended target** | **<$1,000** |

### Lifetime Value (LTV)

**Assumptions:**
- Average revenue per market: $150/month (blended across tiers)
- Annual churn: 10%
- Average lifetime: 8.3 years

**LTV Calculation:**
```
LTV = Monthly Revenue x (1 / Monthly Churn Rate)
LTV = $150 x (1 / 0.0083)
LTV = $150 x 120 months
LTV = ~$16,200 (adjusted for churn pattern)
```

### Key Ratios

| Metric | Value | Benchmark |
|--------|-------|-----------|
| LTV:CAC ratio | 16:1 | Target >3:1 |
| Payback period | ~5 months | Target <12 months |
| Gross margin | 80%+ | SaaS benchmark |

### Breakeven Analysis

| Scenario | Markets Required | ARR |
|----------|-----------------|-----|
| Cover development costs | 30-40 | $54-72K |
| Cover development + operations | 50-60 | $90-108K |
| Profitable operation | 100+ | $180K+ |

---

## 3. Go-to-Market Strategy

### 3.1 Launch Strategy (Leveraging Carlo's Network)

**Phase 1: Pilot Markets**
1. **Berwyn Farmers Market** — Primary testbed (Carlo's market)
2. **4-5 additional Main Line corridor markets** — Carlo's existing relationships
3. **Document everything** — Time savings, vendor growth, operational improvements

**Phase 2: Case Study Development**
- Before/after metrics from pilot markets
- Video testimonials from Margaret personas
- Grant reporting time savings documentation

**Phase 3: Scale via Partnerships**
- Farmers Market Coalition (80% manager awareness)
- State farmers market associations
- University extension services (Penn State, Cornell, etc.)

### 3.2 Customer Acquisition Channels

| Channel | Priority | Notes |
|---------|----------|-------|
| **Direct outreach** | Highest | Carlo's peer-to-peer credibility |
| **Association partnerships** | High | FMC, state associations |
| **Referral program** | High | Markets earn credit for referrals |
| **Content marketing** | Medium | Grant guides, best practices |
| **Conferences** | Medium | FMC annual meeting, state events |
| **University extension** | Medium | Penn State, Cornell partnerships |

### 3.3 Target Market Density by State

| State | Direct Sales Volume | Priority |
|-------|---------------------|----------|
| California | $1.43B | High |
| Pennsylvania | $600M | Highest (home base) |
| New York | $584M | High |
| Michigan | $555M | Medium |
| Texas | $500M+ | Medium |
| Florida | $450M+ | Medium |

### 3.4 Competitive Positioning

**Key differentiator:** Gather is the only solution that serves all three stakeholder groups (managers, vendors, customers) with integrated operational tools AND consumer marketplace.

| Competitor | What They Do | What They Don't Do |
|------------|--------------|-------------------|
| Barn2Door | Individual farm e-commerce | No multi-vendor, no market management |
| LocalLine | Farm + hub sales | No market manager tools |
| MarketWurks | Market management | No consumer marketplace |
| Market Wagon | Consumer marketplace | No market management tools |

---

## 4. Funding Strategy

### 4.1 Preferred Path: Grant Funding

**Target grants (nonprofit structure):**

| Grant | Amount | Duration | Match |
|-------|--------|----------|-------|
| USDA LFPP Planning | $25-100K | 24 months | 25% |
| USDA LFPP Implementation | $100-500K | 36 months | 25% |
| USDA RFSI (state programs) | $10-100K | Varies | Varies |
| SBIR Phase I | $50-250K | 6-12 months | None |

### 4.2 Secondary Path: Angel/Pre-Seed

**Target investors:**
- Agricultural angels (farming background)
- Impact investors (local food focus)
- Local food advocates
- Regional accelerators (food-tech focus)

**Raise amount:** $50-150K
**Use of funds:** MVP development, pilot market operations

### 4.3 Current Resources

- **Budget:** ~$20K available
- **Team:** 3-person AI-augmented team
- **Timeline:** 6-month MVP target

---

## 5. Risk Factors & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Slow market adoption | Medium | High | Free tier, intensive onboarding |
| Competitor entry | Low | Medium | First-mover in integrated solution |
| Seasonal revenue volatility | High | Medium | Annual subscription discounts, off-season features |
| Tech complexity for users | Medium | High | Radical simplicity focus, white-glove onboarding |
| SNAP/EBT integration challenges | Medium | Medium | Phase implementation, partner with existing processors |

---

*Last updated: February 2026. For KPIs, development timeline, and phasing see PRD.md.*
