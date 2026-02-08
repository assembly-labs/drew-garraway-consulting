# Gather — Complete Project Context for Claude Code

> **Purpose:** This is the single source of truth for Claude Code development on the Gather platform. It contains product requirements, market research context, brand guidelines, design system specifications, and architectural decisions. Reference this document before making any implementation decision.

---

## Project Structure

```
gather/
├── CLAUDE.md                   # THIS FILE - unified context for Claude Code
├── README.md                   # Project overview
├── PRD.md                      # Detailed product requirements
│
├── docs/                       # Detailed specifications
│   ├── FEATURE_ROADMAP.md      # 180 MVP features across 11 domains
│   ├── ADMIN_FEATURES.md       # Admin/manager feature specs
│   ├── CUSTOMER_FEATURES.md    # Customer-facing feature specs
│   ├── OPERATIONS_DASHBOARD_SPEC.md  # Operations dashboard design
│   ├── PAYMENTS_AND_PAYOUTS.md # Payment processing specs
│   └── REPORTING_AND_ANALYTICS.md    # Analytics feature specs
│
├── research/                   # Market research & analysis
│   ├── COMPETITIVE_ANALYSIS.md # Competitor profiles & positioning
│   ├── PERSONAS.md             # User personas (Margaret, Victor, Catherine)
│   ├── BUSINESS_MODEL.md       # Pricing, metrics, GTM strategy
│   ├── gather-research-review.html   # Visual research summary
│   ├── operations-questionnaire.html # Operations protocol questions for Carlo & Dara
│   └── next-steps-outline.html # Action items for Carlo & Dara
│
├── brand/                      # Brand identity & design system
│   ├── CLAUDE.md               # Brand folder context
│   └── BRAND_GUIDE.md          # Complete brand guide (voice + visual)
│
├── css/                        # Stylesheets
├── images/                     # Image assets
├── js/                         # JavaScript
├── prototype/                  # Working app prototype
└── robots.txt
```

**Key Documents by Purpose:**

| Need | Document |
|------|----------|
| Product requirements | `PRD.md` |
| Feature specifications | `docs/FEATURE_ROADMAP.md`, `docs/*_FEATURES.md` |
| User research | `research/PERSONAS.md` |
| Competitor analysis | `research/COMPETITIVE_ANALYSIS.md` |
| Business model | `research/BUSINESS_MODEL.md` |
| Operations protocol | `research/operations-questionnaire.html` |
| Brand voice & copy | `brand/BRAND_GUIDE.md` |
| Visual design | `brand/BRAND_GUIDE.md` (includes full design system) |

---

## 1. Product Overview

**Gather** is a three-sided marketplace and SaaS platform for farmers markets — think "Instacart for farmers markets." It serves market managers, vendors (farmers/makers), and customers through a unified platform that automates market operations and enables online pre-ordering with physical market pickup.

**Tagline:** "Good things from good people"

**Core Value Proposition:** Save time for all three stakeholder groups while strengthening the direct farmer-to-customer connection that makes farmers markets unique.

### 1.1 What Gather Is NOT

- **Not a wholesale-retail intermediary.** We do NOT buy inventory from farmers and resell it. Farmers keep their margins and customer relationships. The platform facilitates, never intermediates.
- **Not a delivery service.** Customers pick up at the physical market. No last-mile delivery. This is a deliberate architectural decision based on the catastrophic failures of Good Eggs ($200M+ burned), Farmigo ($26M burned), and Webvan ($800M bankruptcy) — all of which proved last-mile fresh food delivery economics are fundamentally broken.
- **Not competing with farmers.** We never take inventory risk, never hold perishable stock, never set prices. Vendors control everything about their products.

### 1.2 Why This Matters (Market Context)

The US has **8,140 operational farmers markets** generating **$1.1-1.7B annually** in direct consumer sales. The industry is technologically underserved:

- Only **15-25%** of markets use dedicated management software; 60-70% rely on spreadsheets and paper
- Market managers spend **40-60 hours/week** on administrative work, with **30-40%** of time consumed by vendor management alone
- Vendors face **30-45 day payment delays** in wholesale channels, with only **5%** of wholesale buyers paying promptly
- **51% of consumers** cite inconvenience (limited hours, weather dependency, can't pre-order) as the #1 barrier to shopping more at farmers markets
- Online pre-orders average **$59 per transaction** versus **$15-30 for walk-up** purchases — a 2-4x basket size advantage

### 1.3 Competitive Landscape (Why We Win)

| Platform | Serves | Gap We Fill |
|----------|--------|-------------|
| **Barn2Door** ($19.5M raised) | Individual farms only | No market management, no multi-vendor cart |
| **LocalLine** (Chipotle-backed) | Farms + food hubs | No market manager tools, no consumer marketplace |
| **GrazeCart** (acquired by POS Nation) | Individual farms | No multi-vendor support, no market management |
| **Market Wagon** | Consumer marketplace | Requires hub delivery, no market management tools |
| **MarketWurks** | Market management only | $1,500/location, no consumer marketplace |

**Gather is the only solution designed for the complete farmers market ecosystem — managers, vendors, AND customers — with both operational tools and consumer marketplace in one platform.**

### 1.4 Proof of Concept: Berwyn Farmers Market

Berwyn Farmers Market (Bronze Plaza, 511 Old Lancaster Road, Berwyn PA) serves as our validation model:

- **Managed by Culinary Harvest LLC** (co-founders Carlo Luciano and Sam Kennedy, both CIA-trained culinary professionals). Carlo is Gather's CEO & Operations lead.
- **70+ vendor network** with 25-30 rotating weekly — 140% growth in 3 seasons
- **Demographics:** Median household income $137,206, 76% bachelor's degree attainment, 39% earning $200K+
- **Operating model:** Sundays 9am-noon, May-December with winter markets. Already runs hybrid online ordering with Friday curbside pickup.
- **Already validated:** Online ordering with higher basket sizes, vendor rotation model, professional curation approach

---

## 2. User Personas & Stakeholder Context

### 2.1 Primary: Market Manager "Margaret"

**Demographics:** 48 years old, female (73% of managers are female), 87% White, bachelor's degree, mean tenure 4.4 years

**Tech Comfort:** Basic — uses email, Facebook, struggles with complex software. Tech reference points: Square, basic spreadsheets.

**Work Status:** Only 39% of markets employ paid managers. 60% rely exclusively on volunteers. Among paid positions, just 11.3% are full-time year-round.

**Critical Pain Points:**
- Drowning in paperwork — managing vendors via "4-inch binders" and spreadsheets
- SNAP/EBT processing requires manual token distribution and reconciliation — most time-consuming task
- Fee collection is entirely manual — tracking overdue payments, confronting vendors about late fees
- Grant reporting (USDA FMPP/LFPP) requires manual data compilation taking 40+ hours
- Communication scattered across email, phone, text — frequent missed messages and vendor conflicts
- No product catalog visibility — doesn't know what's available when

**Budget Reality:** Markets operate on $10,000-500,000 annually with technology spending under 5%. Even $30/month feels expensive for volunteer-run operations. Seasonal operations (88% seasonal, 71% Saturday-only) make annual subscriptions psychologically difficult.

**What Margaret Says:** "I'm drowning in paperwork." "I spend more time on admin than on actually running the market." "I can't prove our impact to funders."

**UX Design Implication:** Notion-clean, data-dense, keyboard-first. Professional tools that save time. Must demonstrate immediate value within the first market day to overcome change resistance.

### 2.2 Secondary: Vendor "Victor"

**Demographics:** Small family farm, <$150,000 gross income. 86-88% of all US farms are small family farms. 33% of direct-marketing farmers are 65+.

**Tech Comfort:** Low — only 36% of small farms use digital tools. Cost barriers (47-52%), unclear ROI (40%), complexity (32%), age/digital literacy gaps. 27% of direct-marketing farms lack reliable internet.

**Critical Pain Points:**
- Cash flow crisis: 51% report negative net farm income. 77% of household income from off-farm employment.
- Payment delays: Wholesale standard is 30-45 days. 47% of companies admit 1 in 10 payments are late. Only 5% pay promptly.
- Managing inventory across multiple sales channels (farmers market, CSA, on-farm stand, wholesale)
- 15-20% of time consumed by order management, invoicing, and delivery coordination
- No easy way to reach customers online

**What Victor Says:** "I need to get paid faster." "I spend more time on paperwork than farming." "I can't afford another subscription that doesn't pay for itself."

**UX Design Implication:** WhatsApp-simple, big-touch (56px minimum targets), offline-first. Must work in fields with unreliable connectivity. Setup must take under 5 minutes. Flat monthly fees, never percentage-based commissions.

### 2.3 Tertiary: Customer "Catherine"

**Demographics:** 35-45, household income $96,000+, bachelor's degree (77% of farmers market shoppers hold bachelor's degrees vs 32% nationally), 70-78% female.

**Shopping Behavior:**
- Average transaction: $28-42 per visit (urban/large markets: $50-62)
- Online pre-orders average $59 (2-4x walk-up)
- 34% attend weekly, 32% come 2-3 times monthly
- Credit card acceptance increases average purchase by $8-12
- Regular shoppers (6+ visits/year) spend $46.36/visit vs $33.19 for occasional visitors

**Motivation Ranking:**
1. Freshness (95-97%)
2. Supporting local farmers/economy (70-80%)
3. Quality and taste (94-95%)
4. Organic/production methods (60-75%)
5. Value for money — dead last (30-40%)

**Critical Pain Points:**
- 51% cite inconvenience as primary barrier (limited hours, weather, can't pre-order)
- Can't attend Saturday morning markets due to work/family schedules
- Don't know what's available before going
- Can't complete full grocery shopping at one market
- SNAP/EBT customers excluded from online ordering (can't process EBT online)

**What Catherine Says:** "I would shop there more if I could pre-order." "I never know what's going to be available." "Saturday mornings don't work for our family."

**UX Design Implication:** Instacart-fresh, image-forward, thumb-first. Familiar shopping patterns from Instacart/DoorDash. Multi-vendor cart, search with filters, product recommendations.

---

## 3. Feature Requirements

### Phase 1: Core Market Management (MVP — Months 1-6)

The MVP focuses on capturing market manager workflow and establishing vendor/product data that powers Phase 2's marketplace.

#### 3.1 Vendor Management

**User Story:** As a market manager, I need to manage vendor applications and assignments without spreadsheets.

**Features:**
- Digital vendor applications with document upload (licenses, insurance, certifications)
- Automated application review workflow (approve/reject/waitlist)
- Stall assignment with visual market layout builder
- Vendor database: contact info, products, certifications, production methods
- Automated waitlist management (first-come or priority-based)
- Compliance tracking with expiration alerts (insurance, licenses, organic certs)
- Vendor attendance tracking (check-in/check-out)
- Seasonal vs. daily vendor categorization

**Acceptance Criteria:**
- Reduce vendor onboarding from 2 hours to 15 minutes
- Zero double-bookings of stall spaces
- 100% compliance documentation tracked with automated expiration alerts
- Vendor can be onboarded without manager assistance (self-service application)

**Data Model Notes:**
- Vendors have many-to-many relationship with Markets (a vendor can sell at multiple markets)
- Vendor profiles persist across seasons — historical data matters for grant reporting
- Certifications have expiration dates and document attachments

#### 3.2 Fee Collection & Financial Management

**User Story:** As a market manager, I need to collect and track vendor fees automatically.

**Features:**
- Automated fee calculation supporting multiple models:
  - Daily flat fee (e.g., $25/market day)
  - Seasonal fee (e.g., $500/season)
  - Percentage-based (e.g., 5% of sales)
  - Tiered by vendor type or stall size
- Online payment collection (ACH, credit card via Stripe Connect)
- Automated payment reminders (email + SMS) with escalation
- Overdue payment tracking and late fee application
- Financial reporting dashboard (revenue by period, outstanding balances, payment history)
- Vendor payout management for markets handling centralized sales
- Seasonal billing cycles aligned with market operations

**Acceptance Criteria:**
- 90% of fees collected on time (vs ~60% current manual process)
- Automated late fee application per market policy
- Real-time financial visibility for manager and market board
- Support for markets that bill weekly, monthly, or seasonally

**Technical Notes:**
- Use Stripe Connect for marketplace payments — enables direct vendor payouts
- Must handle partial payments and payment plans
- Financial reports must be exportable for board meetings and grant applications

#### 3.3 SNAP/EBT Integration

**User Story:** As a market manager, I need to process SNAP/EBT without manual token counting.

**Context:** 5,345 markets are SNAP-authorized. SNAP/EBT processing is the single most cited pain point for managers — requires physical terminals, manual token distribution to vendors, and reconciliation nightmares.

**Features:**
- Digital SNAP/EBT transaction processing
- Automated token-to-vendor reconciliation (replacing manual counting)
- USDA FNS reporting compliance (automated report generation)
- Market Match / Double Up Food Bucks program management
- State-specific incentive program support
- Real-time SNAP sales tracking by vendor

**Acceptance Criteria:**
- Reduce SNAP processing from 4+ hours to 30 minutes weekly
- 100% accurate USDA reporting
- Support for state-specific incentive programs (varies by state)
- Audit trail for all SNAP transactions

**Regulatory Notes:**
- Must comply with USDA FNS (Food and Nutrition Service) requirements
- Cannot process EBT online currently — this is a known industry limitation
- Market Match programs vary by state and funding source

#### 3.4 Communication Hub

**User Story:** As a market manager, I need to communicate with all vendors instantly.

**Features:**
- Broadcast announcements via SMS and email simultaneously
- Vendor-specific messaging (direct messages)
- Weather alerts and market cancellation notifications (with read receipts)
- Newsletter builder with templates (weekly market updates, seasonal announcements)
- Vendor bulletin board (shared information, policy updates)
- Automated reminders (upcoming market day, document expirations, fee due dates)

**Acceptance Criteria:**
- 95% message delivery rate
- Response/read tracking for critical announcements
- Mobile-optimized for field use (managers work on-site)
- Support for scheduled messages

**Technical Notes:**
- SMS via Twilio, email via SendGrid
- Must handle bulk sends without being flagged as spam
- Read receipt tracking for accountability

#### 3.5 Grant Reporting & Analytics

**User Story:** As a market manager, I need to generate grant applications and impact reports efficiently.

**Context:** 50-60% of markets are nonprofit-run. Grant funding (USDA FMPP, LFPP, RFSI) is a critical revenue source. Current grant reporting takes 40+ hours of manual data compilation.

**Features:**
- Pre-built USDA FMPP/LFPP report templates
- Automatic data compilation: vendor count, sales totals, demographics, SNAP redemptions
- Economic impact calculator (jobs supported, local dollar circulation)
- Customer survey tools (in-app and at-market)
- Attendance tracking (vendor and customer counts)
- Year-over-year comparison dashboards
- Export to PDF/Excel for grant submissions

**Acceptance Criteria:**
- Generate complete grant application data package in <1 hour (vs 40+ hours current)
- Automatically track all metrics required by USDA grant programs
- Historical data comparison across seasons

#### 3.6 Vendor Profile Management

**User Story:** As a market manager, I need rich vendor profiles that showcase producers to customers.

**Features:**
- Vendor business profiles: farm story, photos, certifications, production methods
- Product categories and seasonal availability calendars
- Production method tags: organic, pesticide-free, grass-fed, pasture-raised, non-GMO
- Farm location, size, and growing practices
- Social media links and website
- Vendor performance metrics (attendance rate, customer ratings)
- Public-facing vendor showcase pages (SEO-optimized)

**Acceptance Criteria:**
- 100% vendor profiles complete before market season
- Searchable/filterable vendor directory
- Public-facing pages for each vendor (drives SEO and discovery)
- Vendors can self-manage their profiles via mobile

**Data Model Notes:**
- Vendor profiles are the foundation for Phase 2's consumer marketplace
- Profile data feeds into search, filtering, and recommendation systems
- Photos should be optimized for fast loading (Cloudflare CDN)

#### 3.7 Product Catalog Management

**User Story:** As a market manager, I need visibility into what products are available at my market.

**Features:**
- Master product database with hierarchical categories:
  - Produce → Vegetables → Tomatoes → Heirloom Tomatoes
  - Meat → Beef → Ground Beef
  - Dairy → Cheese → Aged Cheddar
  - Baked Goods → Bread → Sourdough
  - Prepared Foods → Preserves → Strawberry Jam
  - Artisan/Crafts → Pottery, Soap, Textiles
- Seasonal availability tracking (per vendor, per product)
- Price range management (vendors set specific prices; market sees ranges)
- Product photos and descriptions
- Dietary attribute tags: vegan, gluten-free, allergen info, kosher, halal
- Inventory status: available, sold out, limited quantity
- Units of measure: per pound, per bunch, per dozen, each, per quart
- Bulk import via CSV for vendor convenience

**Acceptance Criteria:**
- Support 500+ product SKUs per market
- Real-time availability updates (vendor-managed)
- Searchable and filterable by category, vendor, dietary attribute, availability
- Product data structure supports Phase 2 marketplace search and discovery

**Data Model Notes:**
- Products belong to Vendors (one-to-many)
- Products have many-to-many relationship with dietary attributes/tags
- Price can vary by sales channel (market vs. online vs. wholesale)
- Inventory is per-channel (don't oversell market stock as online orders)

---

### Phase 2: Consumer Marketplace (Months 7-12)

Phase 2 builds the "Instacart for farmers markets" experience on top of Phase 1's vendor/product data foundation.

#### 3.8 Customer Shopping Experience

**User Story:** As a customer, I want to browse and shop the farmers market like I'm using Instacart.

**Browse & Discovery:**
- Market homepage with featured vendors and seasonal highlights
- Category browsing with visual hierarchy (Produce → Vegetables → Tomatoes)
- Vendor browsing (see all products from one farm)
- Search with filters: organic, price range, dietary needs, vendor, availability
- "What's in season" showcase (changes weekly/monthly)
- Product recommendations based on past purchases and browsing
- Visual grid layout with high-quality product photos
- "New this week" and "Popular" sections

**Product Details:**
- High-quality product images (multiple angles where applicable)
- Detailed descriptions including growing/production methods
- Vendor information card with farm story link
- Nutritional information where applicable
- Recipe suggestions and pairing recommendations
- Similar product recommendations ("You might also like...")
- Customer reviews and ratings
- Availability indicator (in stock, limited, sold out)

**Shopping Cart:**
- Multi-vendor cart consolidation (shop from 5 vendors, one checkout)
- Running total with applicable fees
- Quantity adjustments with real-time inventory checks
- Save for later / favorites list
- Quick reorder from past purchases
- Cart sharing (send shopping list to family member)
- Suggested add-ons based on cart contents

**Checkout:**
- Guest checkout option (reduce friction for first-time users)
- Saved payment methods for returning customers
- SNAP/EBT integration where technically possible
- Pickup time slot selection (aligned with market hours)
- Special instructions per vendor (e.g., "extra ripe avocados please")
- Tip option for vendors
- Order confirmation with pickup details and QR code

**Acceptance Criteria:**
- Browse to buy conversion rate >3%
- Cart abandonment <30%
- Average online basket size: $59 (validated by industry data)
- Search success rate >80% (users find what they're looking for)
- Page load time <2 seconds (image optimization critical)
- Full accessibility (WCAG 2.1 AA)

#### 3.9 Customer Account & Order Management

**Features:**
- Order history with one-tap reorder
- Favorite vendors and products
- Dietary preference settings (used for search filtering and recommendations)
- Weekly shopping lists
- Subscription options for regular items (weekly tomatoes, eggs, bread)
- Family account sharing
- Notification preferences (email, SMS, push)
- Real-time order status tracking
- Modification window (until vendor starts packing — typically day before market)
- Cancellation policy and refund processing
- Pickup reminders via SMS/email
- QR code for contactless pickup verification
- Substitution preferences (accept vendor's substitute, or cancel item)
- Post-purchase feedback and vendor ratings

#### 3.10 Vendor Order Management (Mobile-First)

**User Story:** As a vendor, I need to manage online orders from my phone while working on the farm.

**Features:**
- Push notifications for new orders
- Accept/reject orders (with reason codes for rejections)
- Mark items as packed/ready
- Update inventory in real-time (sync across all channels)
- Communicate with customers about substitutions
- View consolidated pickup list for market day
- Quick add new products via photo + voice-to-text description
- Earnings dashboard (today, this week, this month, this season)

**UX Requirements:**
- Huge touch targets (56px minimum)
- High contrast text
- Offline mode with sync when connectivity returns
- Simple binary choices (Accept / Reject, Ready / Not Ready)
- Success celebration animations (order completed, payment received)

#### 3.11 Marketplace Administration (Manager Tools)

**Vendor Controls:**
- Enable/disable vendors for online sales
- Set marketplace commission rates per vendor or market-wide
- Approve/reject product listings before they go live
- Manage vendor vacations and blackout dates
- Set minimum order quantities per vendor

**Product Controls:**
- Approve/reject product listings
- Flag inappropriate content
- Manage market-wide categories and tags
- Control featured products and seasonal highlights
- Manage "What's in season" calendar

**Order Management Hub:**
- Dashboard showing all pending, in-progress, and completed orders
- Vendor fulfillment status tracking
- Customer pickup check-in system
- Refund and cancellation processing
- Consolidated packing lists per vendor
- Substitution coordination between vendor and customer
- Order volume analytics by day, vendor, category

**Customer Service:**
- Customer communication center
- Issue resolution workflow
- Refund processing
- Customer feedback monitoring and response
- Abandoned cart recovery emails

---

## 4. Technical Architecture

### 4.1 Development Approach

**AI-Accelerated Development:**
- Claude Code for primary code generation (~70% of codebase)
- Human review and refinement of all AI-generated code
- 6-month MVP timeline (vs 18-month traditional estimate)
- Rapid prototyping and iteration

### 4.2 Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React / Next.js | Mobile-responsive, SSR for SEO, familiar ecosystem |
| Backend | Node.js / PostgreSQL | Proven stack, strong ecosystem, good for marketplace patterns |
| Payments | Stripe Connect | Marketplace payments, direct vendor payouts, handles splits |
| SMS | Twilio | Reliable delivery, good API |
| Email | SendGrid | Transactional + marketing emails |
| Hosting | AWS / Vercel | Scalable, cost-effective for early stage |
| Auth | Auth0 | Multi-role auth (manager, vendor, customer), social login |
| Search | Elasticsearch | Product search with faceted filtering |
| CDN | Cloudflare | Product image optimization and fast delivery |
| Analytics | Mixpanel | User behavior tracking, funnel analysis |

### 4.3 Key Technical Requirements

- **Offline capability:** Markets often have poor WiFi/cellular. Vendor app must work offline and sync when connected.
- **Mobile-first:** Managers work on-site via phones. Vendors work in fields. Customers browse on phones.
- **Simple UX:** Target users have low technical sophistication. Every interaction must be intuitive.
- **PCI compliance:** Payment processing requires PCI DSS compliance (Stripe handles most of this).
- **API-first:** All functionality exposed via API for future integrations and mobile apps.
- **Real-time sync:** Inventory updates must propagate across all channels immediately to prevent overselling.
- **Image optimization:** Product photos are central to marketplace experience. Must load fast on mobile.
- **Multi-tenancy:** Single codebase serves multiple markets with market-specific configuration.

### 4.4 Data Model (Core Entities)

```
Markets
  - id, name, slug, location (lat/lng, address), schedule, settings
  - manager_id (FK → Users)
  - organization_type (nonprofit, cooperative, municipal, private)
  - snap_authorized (boolean)
  - operating_season (start_date, end_date)
  - market_days (array of day/time pairs)

Vendors
  - id, business_name, slug, description, photos
  - farm_story, location, size_acres, production_methods
  - certifications (organic, GAP, etc.) with expiration dates
  - contact_info, social_media_links
  - status (active, pending, waitlisted, inactive)

MarketVendors (junction table)
  - market_id, vendor_id
  - stall_assignment, fee_structure
  - seasonal_start, seasonal_end
  - status (confirmed, pending, waitlisted)

Products
  - id, vendor_id (FK), name, slug, description
  - category_id (FK → Categories, hierarchical)
  - price, unit_of_measure, price_type (fixed, per_lb, per_unit)
  - photos (array), dietary_attributes (array)
  - seasonal_availability (month range)
  - inventory_count, inventory_status (available, limited, sold_out)

Categories (hierarchical/nested set)
  - id, parent_id, name, slug, icon, sort_order

Users
  - id, type (manager, vendor, customer), email, phone
  - profile (name, preferences, addresses)
  - auth_provider, auth_id

Orders
  - id, customer_id (FK → Users), market_id (FK)
  - status (pending, confirmed, packing, ready, picked_up, cancelled)
  - pickup_time_slot, pickup_date
  - total_amount, payment_status, payment_method
  - special_instructions

OrderItems
  - id, order_id (FK), product_id (FK), vendor_id (FK)
  - quantity, unit_price, subtotal
  - status (pending, confirmed, substituted, cancelled)
  - substitution_preference

Transactions
  - id, order_id (FK), amount, payment_method
  - stripe_payment_intent_id
  - status (pending, completed, refunded)
  - vendor_payout_status, vendor_payout_amount
```

### 4.5 Key Architectural Patterns

**Multi-vendor cart:** Orders contain items from multiple vendors. Each vendor sees only their items. Market manager sees the consolidated view. Stripe Connect handles payment splitting.

**Inventory sync:** Single source of truth for inventory. When a customer adds to cart, soft-reserve for 15 minutes. When order is confirmed, hard-deduct. Vendors can update inventory from mobile app, which syncs to marketplace immediately.

**Role-based access:**
- Market Manager: Full dashboard access, vendor management, order oversight, analytics
- Vendor: Own products, own orders, own earnings. No access to other vendors' data.
- Customer: Browse marketplace, place orders, manage account. No access to admin features.
- Super Admin (Gather team): Cross-market analytics, platform configuration

**Marketplace commission flow:**
1. Customer pays full amount via Stripe
2. Stripe holds funds
3. On order completion, Stripe splits: vendor share → vendor's connected account, platform fee → Gather's account, market commission → market's connected account
4. Vendor receives payout per configured schedule (next-day, weekly, etc.)

---

## 5. Design System Reference

### 5.1 Three Distinct Experiences

The platform serves three user types with fundamentally different needs. Each gets a tailored experience:

| Interface | Design Philosophy | Key Reference | Font | Min Touch Target |
|-----------|------------------|---------------|------|-----------------|
| Manager Dashboard | Notion-clean, data-dense, keyboard-first | Notion, Stripe, Shopify | Inter | 44px |
| Consumer Marketplace | Instacart-fresh, image-forward, thumb-first | Instacart, DoorDash | DM Sans | 44px |
| Vendor Portal | WhatsApp-simple, big-touch, offline-first | WhatsApp, Square | System | 56px |

### 5.2 Color Palette

**Primary Greens (Sage scale — earth to fresh growth):**
- `--sage-900: #1C3A13` → `--sage-50: #E8F5E9`
- Primary action color: `--sage-700: #2D5016` (dashboard), `--sage-500: #4A7C28` (marketplace accent)

**Golden Hour (warmth and sunshine):**
- `--gold-900: #E65100` → `--gold-50: #FFF9C4`
- Used for marketplace CTAs, badges, highlights

**Supporting Colors:**
- Success: `--mint-500: #3DDC97`
- Error: `--coral-500: #FF6B6B`
- Warning: `--honey-500: #FFD93D`
- Info: `--sky-500: #4ECDC4`
- SNAP/EBT: `--snap-blue: #0077BE`
- Organic badge: `--organic-green: #6B8E23`

**Key Gradients:**
- Golden Hour (marketplace hero): `linear-gradient(135deg, #FFE082 0%, #81C784 50%, #4CAF50 100%)`
- Field Fresh (dashboard accent): `linear-gradient(135deg, #66BB6A 0%, #4CAF50 25%, #43A047 50%, #2E7D32 100%)`
- Dawn (marketplace background): `linear-gradient(135deg, #F6F9FC 0%, #E8F5E9 50%, #FFF9C4 100%)`

**Layer-Specific Palettes:**
- Dashboard: `--dash-bg: #FFFFFF`, `--dash-sidebar: #FBFBFA`, `--dash-border: #E3E2E0`, `--dash-text: #37352F`, `--dash-muted: #787774`
- Marketplace: `--market-bg: #FFFEF7`, `--market-card: #FFFFFF`
- Vendor: `--vendor-bg: #FFFFFF`, `--vendor-primary: #2D5016`, `--vendor-success: #00A86B`

### 5.3 Typography

- **Dashboard:** Inter (14px body, 20px title, 12px label)
- **Marketplace:** DM Sans (16px body, 24px title, 40px hero)
- **Vendor:** System fonts (18px body, 20px title — larger for readability)
- **Monospace (data):** JetBrains Mono

### 5.4 Spacing

4px base unit: `--space-1: 4px` through `--space-32: 128px`

Container max-widths: Dashboard 1440px, Marketplace 1200px, Vendor 600px

### 5.5 Component Patterns

**Buttons:**
- Dashboard: Solid sage-700 background, subtle hover lift
- Marketplace: Golden gradient CTAs with glow shadow, mint-500 "Add to cart"
- Vendor: Large (56px min-height), high contrast, bold weight

**Cards:**
- Dashboard: White with 1px border, clean and data-focused
- Product Card: White with border-radius-lg, 4/3 aspect ratio image, hover lift, vendor name + product name + price/unit
- Vendor Order Card: 2px border, color-coded states (urgent=coral, complete=green)

**Navigation:**
- Dashboard: 240px sidebar with icon + label nav items
- Marketplace: Sticky header with search bar (pill-shaped), cart icon with badge
- Vendor: Fixed bottom tab bar (mobile-native pattern)

### 5.6 Icons

Lucide React icon library. Key icons by context:
- Navigation: Home, Store, Users, ShoppingBag, Calendar, Settings
- Actions: Plus, Edit2, Trash2, Save, Search, Filter
- Status: CheckCircle, XCircle, AlertTriangle, Clock
- Commerce: CreditCard, DollarSign, Receipt, Package

### 5.7 Accessibility Requirements

- Focus states: 2px solid sage-500 outline with 2px offset on `:focus-visible`
- Screen reader support: `.sr-only` class for visually hidden labels
- Reduced motion: Respect `prefers-reduced-motion` — disable animations
- Color contrast: All text meets WCAG 2.1 AA minimum (4.5:1 for body text)

---

## 6. Brand Voice Guidelines

### 6.1 Tone

**We sound like:** Mr. Rogers with a farmers market booth — warm, genuine, community-minded with a quiet rebellious undertone against industrial food systems.

**Key characteristics:**
- Warm and neighborly, never corporate or salesy
- Confident but never preachy
- Uses "neighbor" language, not "user" or "customer" language
- Celebrates the simple act of choosing local
- Subtly positions against industrial food without being combative

### 6.2 Core Messages

- **Primary tagline:** "Good things from good people"
- **Supporting:** "Real food from real neighbors"
- **Rebellion undertone:** "Every purchase at market is a vote for neighbors over corporations"

### 6.3 Stakeholder-Specific Messaging

**To Managers:** "You're creating a place where neighbors take care of each other. Let us handle the paperwork."

**To Vendors:** "You chose to make good things the right way for your neighbors. We're here to make that choice easier."

**To Customers:** "When you choose to Gather from local folks, you're saying no to food that traveled 1,500 miles and yes to food from 5 miles away."

### 6.4 Copy Guidelines

- Never say "users" — say "neighbors," "folks," or the specific role (manager, farmer, shopper)
- Never say "optimize" or "leverage" — say "help," "support," "make easier"
- Avoid corporate jargon entirely
- Use contractions — we're conversational
- Lead with freshness, community, and knowing your farmer
- Environmental messaging is gentle: "growing things the way nature intended" not "reducing carbon emissions"
- Price messaging: "Good things cost what they cost" — never apologize for premium pricing

---

## 7. Business Model & Metrics

### 7.1 Revenue Model

**Tiered SaaS Subscriptions (Market Managers):**
| Tier | Price | Vendor Limit | Features |
|------|-------|-------------|----------|
| Free | $0 | <10 vendors | Basic vendor management (land grab) |
| Starter | $49/mo | 10-30 vendors | Full management + communications |
| Professional | $149/mo | 30-75 vendors | + SNAP/EBT, grant reporting, analytics |
| Enterprise | $299/mo | 75+ vendors | + multi-market, API access, custom reports |

**Marketplace Transaction Fees (Phase 2):**
- 2.5% on marketplace transactions
- 1% on SNAP/EBT processing
- Optional vendor subscriptions: $29-99/month for premium features (featured placement, analytics)

### 7.2 Key Performance Indicators

**Phase 1 (Months 1-6):**
- Markets onboarded: 20
- Weekly active markets: 70% of onboarded
- Manager time savings: 20 hours/week per market
- Vendor satisfaction: NPS >50
- ARR: $36K ($150/month avg × 20 markets)
- Product listings: 50+ products per vendor

**Phase 2 (Months 7-12):**
- Markets: 100
- Marketplace GMV: $500K monthly
- Online basket size: $59 average
- ARR: $250K
- Browse-to-buy conversion: >3%
- Cart abandonment: <30%
- Customer monthly repeat rate: 40%

**Long-term Targets:**
- Year 1: 100 markets, $250K ARR
- Year 5: 500+ markets, $2-3M ARR

### 7.3 Unit Economics

- Target CAC: <$1,000 per market
- LTV at $150/month with 10% annual churn: $16,200
- LTV:CAC ratio target: 16:1
- Payback period: ~5 months
- Breakeven: 30-40 markets ($54-72K ARR covering development + operations)

---

## 8. Go-to-Market Strategy

### 8.1 Launch Strategy (Leveraging Carlo's Network)

1. **Pilot Markets:** 5 markets in Pennsylvania/Main Line corridor (Carlo's existing relationships with Berwyn and surrounding markets)
2. **Case Study Development:** Document time savings, vendor growth, and operational improvements
3. **Farmers Market Coalition Partnership:** 80% of managers have awareness of FMC — primary distribution channel
4. **State Association Outreach:** Target high-density states: Pennsylvania ($600M direct sales), New York ($584M), California ($1.43B), Michigan ($555M)

### 8.2 Customer Acquisition Channels

- **Direct:** Carlo's personal outreach to market managers (peer-to-peer credibility)
- **Partnerships:** State farmers market associations, university extension services (Penn State, Cornell)
- **Content:** Grant writing guides, market management best practices, "State of Local Food" reports
- **Conferences:** Farmers Market Coalition annual meeting, state-level market conferences
- **Referral:** Markets earn credit for successful referrals

### 8.3 Funding Strategy

**Preferred path: Grant funding through nonprofit structure**

Target grants:
- USDA LFPP Planning Grants: $25-100K (24 months, 25% match)
- USDA LFPP Implementation Grants: $100-500K (36 months, 25% match)
- USDA RFSI state programs: $10-100K for technology/infrastructure
- SBIR Phase I: $50-250K for technology R&D

Secondary: Angel/pre-seed ($50-150K) from agricultural angels, impact investors, local food advocates

---

## 9. Development Timeline

### Months 1-3: Foundation
- Core vendor management system
- Basic fee collection and tracking
- Communication hub (broadcast + direct messaging)
- Vendor profile creation
- Product catalog with categories
- 5 pilot markets with Carlo providing hands-on onboarding

### Months 4-6: Enhancement
- SNAP/EBT integration
- Grant reporting templates and auto-compilation
- Analytics dashboard (market health, vendor performance)
- Advanced vendor features (scheduling, compliance automation)
- 20 paying markets

### Months 7-9: Marketplace MVP
- Customer browsing interface (search, filter, category navigation)
- Multi-vendor shopping cart and checkout
- Vendor inventory management (real-time sync)
- Order management system (vendor + manager views)
- Test marketplace with Berwyn model first

### Months 10-12: Scale & Polish
- Mobile app launch (iOS/Android for customers and vendors)
- Advanced search with recommendations
- Customer accounts, favorites, reorder, loyalty
- Full marketplace rollout across onboarded markets
- 100 markets target
- Series Seed preparation

---

## 10. Critical Design & Development Principles

### 10.1 Always Remember

1. **Margaret can't figure out complex software.** If it takes more than 2 clicks or 30 seconds to understand, it's too complex for our primary user.

2. **Victor is standing in a field with spotty reception.** Offline-first for vendor features. Big buttons. No tiny text.

3. **Catherine expects Instacart quality.** The shopping experience must feel modern, fast, and familiar. No excuses for slow load times or confusing navigation.

4. **We facilitate, never intermediate.** Vendors control their products, prices, and customer relationships. The platform makes everything easier without taking anything away.

5. **Time is the universal currency.** Every feature must demonstrably save time for at least one stakeholder group. If it doesn't save time, question whether it belongs.

6. **Seasonal business, seasonal billing.** Don't force annual contracts on businesses that operate 20-26 weeks per year.

7. **Grant reporting is a feature, not an afterthought.** 50-60% of our target markets are nonprofits that survive on grants. Making grant reporting easy is a massive differentiator.

8. **The market research says NO to wholesale-retail, delivery, and inventory risk.** These are settled decisions based on extensive analysis. Don't revisit them.

### 10.2 What Failed Companies Teach Us

- **Good Eggs** ($200M+ burned): Premature scaling to multiple cities before proving unit economics. CEO: "The single biggest mistake we made was growing too quickly."
- **Farmigo** ($26M burned): Distribution logistics "much more complicated than anticipated." Abandoned fulfillment entirely.
- **Webvan** ($800M bankruptcy): Built massive infrastructure before proving product-market fit.
- **Lesson:** Start small, prove economics at one market, then scale methodically. Capital cannot fix fundamentally broken models.

### 10.3 What Berwyn Teaches Us

- Professional management with culinary expertise creates superior vendor curation
- Vendor rotation model (25-30 weekly from 70+ pool) enables flexibility and variety
- Hybrid online-physical model captures both convenience-seekers and in-person shoppers
- Affluent demographics support premium pricing without friction
- Community programming (music, kids activities, charity partners) drives attendance beyond shopping
- Extended season (May-December + winter) maintains habit formation

---

*This document should be kept current as product decisions evolve. Last updated: February 2026.*
