# Gather - Product Requirements Document

> **One-Line Vision:** Instacart for farmers markets - browse, cart, checkout, pickup.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [The Problem](#the-problem)
3. [The Solution](#the-solution)
4. [User Personas](#user-personas)
5. [MVP Scope](#mvp-scope)
6. [Feature Specifications](#feature-specifications)
7. [User Flows](#user-flows)
8. [Data Model](#data-model)
9. [API Specification](#api-specification)
10. [Technical Architecture](#technical-architecture)
11. [Design Requirements](#design-requirements)
12. [Success Metrics](#success-metrics)
13. [Roadmap](#roadmap)
14. [Risks & Mitigations](#risks--mitigations)
15. [Open Questions](#open-questions)

---

## Executive Summary

### What We're Building

A web-based marketplace that lets customers:
1. Browse all products from a farmers market's vendors
2. Add items from multiple vendors to a single cart
3. Checkout with one payment
4. Pick up their order at the market

### Why It Matters

| Stakeholder | Current Pain | Our Solution |
|-------------|--------------|--------------|
| **Customers** | Can only shop Saturday 8am-1pm; don't know what's available | Shop online anytime; see real inventory |
| **Vendors** | Miss 51% of potential customers who can't attend | Reach everyone; predictable pre-orders |
| **Markets** | Can't compete with grocery delivery | Modern shopping experience |

### MVP Target

- **1 market:** Berwyn Farmers Market (70+ vendors)
- **6 months** to launch
- **$50K GMV** in first season
- **$59 average basket** (vs $28 in-person)

---

## The Problem

### Customer Perspective (Catherine)

Catherine lives 5 minutes from Berwyn Farmers Market. She wants to support Tom's Farm down the road instead of Whole Foods. But:

- She works Saturday mornings
- She doesn't know if heirloom tomatoes will be in stock
- By the time she arrives at 11am, the good stuff is gone
- She can't pre-order anything

**Result:** Catherine opens Instacart and orders from Whole Foods. She feels guilty, but convenience wins.

### The Numbers

| Stat | Source |
|------|--------|
| 51% of interested customers skip markets due to inconvenience | USDA Study |
| 40M+ Americans want to shop farmers markets but can't | Market Research |
| $2B+ in potential sales locked away | Calculated TAM |
| 2-4x larger basket sizes when shopping online | Berwyn pilot data |

---

## The Solution

### Core Value Proposition

**"Shop local from your couch. Pick up fresh at the market."**

### How It Works

```
Thursday Evening (Catherine at home)
├── Opens gather.market/berwyn
├── Browses: Produce → Tomatoes → Heirloom
├── Adds items from 5 different vendors
├── Checks out once ($75 total)
└── Selects pickup: Saturday 11am-12pm

Saturday Morning (Behind the scenes)
├── Vendors receive pick lists
├── Staff collects items from each vendor
└── Orders packed and labeled with QR codes

Saturday 11:30am (Catherine at market)
├── Shows QR code at pickup tent
├── Grabs her bag
└── Done in 3 minutes
```

---

## User Personas

### Primary: Catherine (Customer)

| Attribute | Value |
|-----------|-------|
| Age | 35-45 |
| Income | $96K+ household |
| Education | 77% bachelor's+ |
| Values | Local food, convenience, quality over price |
| Frustration | "I want to support local but I can't attend" |

**Jobs to Be Done:**
1. Know what's available before driving to market
2. Reserve items so they don't sell out
3. Shop when it's convenient, not just Saturday morning
4. Support local farms without sacrificing convenience

**Success Metrics:**
- Can complete checkout in <60 seconds
- Order is ready when they arrive
- Pickup takes <5 minutes

### Secondary: Market Staff (Operations)

| Attribute | Value |
|-----------|-------|
| Role | Market coordinator, volunteer, or Carlo himself |
| Tech Comfort | Moderate (can use Square, Google Sheets) |
| Constraints | Busy on market day, limited time for training |

**Jobs to Be Done:**
1. See all pending orders at a glance
2. Generate pick lists for vendors
3. Check in customers quickly
4. Handle substitutions and refunds

**Success Metrics:**
- Pick list accuracy: 99%
- Customer check-in: <30 seconds
- Zero lost orders

### Tertiary: Admin (Product Management)

| Attribute | Value |
|-----------|-------|
| Role | Carlo or Gather team member |
| Responsibility | Add products, manage inventory, configure market |

**Jobs to Be Done:**
1. Add/edit products with photos and descriptions
2. Toggle availability (in stock / out of stock)
3. Set pickup time windows
4. View basic sales reports

**Note:** In MVP, the Gather team manages products on behalf of vendors. Vendor self-service is Phase 2.

---

## MVP Scope

### In Scope

| Feature | Priority | Notes |
|---------|----------|-------|
| Customer storefront | P0 | Browse, search, filter products |
| Shopping cart | P0 | Multi-vendor, persistent |
| Checkout | P0 | Stripe, guest checkout, pickup selection |
| Order confirmation | P0 | Email with QR code |
| Staff order dashboard | P0 | View pending orders |
| Pick lists | P0 | Per-vendor, printable |
| Customer check-in | P0 | Scan QR, mark picked up |
| Admin product management | P0 | CRUD for products |
| Basic reporting | P1 | Orders, revenue, top products |

### Out of Scope (Phase 2+)

| Feature | Phase | Reason |
|---------|-------|--------|
| Vendor self-service portal | 2 | Requires vendor onboarding |
| Vendor mobile app | 2 | Web-first MVP |
| SNAP/EBT processing | 2 | Complex integration |
| Market manager dashboard | 3 | After marketplace proven |
| Native mobile apps | 4 | Web works fine for MVP |
| Multi-market support | 2 | Focus on Berwyn first |
| Delivery | Never (for now) | Pickup-only model |

---

## Feature Specifications

### F1: Customer Storefront

#### F1.1: Homepage

**URL:** `gather.market/berwyn` (or similar)

**Elements:**
- Market name and logo
- Market hours and location
- Hero banner (optional promotional)
- Search bar (prominent)
- Category navigation (horizontal scroll on mobile)
- Featured products section (curated by admin)
- Browse by vendor section (all vendors A-Z)
- Footer with market info

**Behavior:**
- Mobile-first responsive design
- Categories: Produce, Meat, Dairy, Eggs, Baked Goods, Prepared Foods, Beverages, Plants, Crafts, Other
- Vendor cards show: name, photo, tagline, product count

#### F1.2: Product Listing

**URL:** `gather.market/berwyn/products` or `/berwyn/category/produce`

**Elements:**
- Grid of product cards
- Filter sidebar (mobile: bottom sheet)
- Sort dropdown
- Results count
- Load more / pagination

**Product Card:**
```
┌─────────────────────┐
│ [Product Photo]     │
│                     │
├─────────────────────┤
│ Heirloom Tomatoes   │
│ Mitchell Farm       │
│ $4.50 / lb          │
│ [Add to Cart]       │
└─────────────────────┘
```

**Filters:**
- Category (multi-select)
- Vendor (multi-select)
- Dietary: Organic, Non-GMO, Gluten-Free, Vegan, etc.
- Price range
- Availability (show in-stock only toggle)

**Sort Options:**
- Popular (default)
- Price: Low to High
- Price: High to Low
- Vendor A-Z
- Newest

#### F1.3: Product Detail

**URL:** `gather.market/berwyn/products/:slug`

**Elements:**
- Large product photo (swipeable if multiple)
- Product name
- Vendor name (linked to vendor page)
- Price (per unit)
- Unit type (lb, each, bunch, pint, etc.)
- Description
- Dietary tags (chips)
- Availability status
- Quantity selector (- / + buttons)
- Add to Cart button
- "Also from this vendor" section

**Behavior:**
- Quantity defaults to 1
- Add to Cart shows confirmation toast
- Out of stock: button disabled, "Notify me" option (stretch)

#### F1.4: Vendor Page

**URL:** `gather.market/berwyn/vendors/:slug`

**Elements:**
- Vendor photo/logo
- Vendor name
- Tagline/description
- Location (farm location)
- "Our story" text (optional)
- All products from this vendor (grid)

#### F1.5: Search

**URL:** `gather.market/berwyn/search?q=tomatoes`

**Behavior:**
- Searches product names and descriptions
- Also searches vendor names
- Returns unified results
- Instant search with debounce (300ms)
- Empty state: "No results for 'xyz'. Try browsing by category."

### F2: Shopping Cart

#### F2.1: Cart Page

**URL:** `gather.market/berwyn/cart`

**Elements:**
- List of items grouped by vendor
- Each item: photo, name, quantity selector, unit price, line total, remove button
- Vendor subtotals
- Cart subtotal
- Service fee (if applicable)
- Total
- Proceed to Checkout button
- Continue Shopping link

**Behavior:**
- Persistent cart (localStorage + server sync if logged in)
- Guest carts expire after 7 days
- Real-time stock checking (show warning if item became unavailable)
- Empty cart: "Your cart is empty. Start shopping!"

#### F2.2: Cart Icon (Header)

**Behavior:**
- Shows item count badge
- Clicking opens cart page (or slide-out on desktop)
- Updates in real-time when items added

### F3: Checkout

#### F3.1: Checkout Page

**URL:** `gather.market/berwyn/checkout`

**Sections:**

**1. Contact Information**
- Email (required)
- Phone (optional, for pickup alerts)
- Option to create account

**2. Pickup Details**
- Pickup location (read-only, shows market address)
- Pickup date (next market day, e.g., "Saturday, June 7")
- Pickup time slot (dropdown)
  - 9:00am - 10:00am (12 slots available)
  - 10:00am - 11:00am (8 slots available)
  - etc.
- Special instructions (optional text field)

**3. Order Summary**
- All items with vendor, quantity, price
- Subtotal
- Service fee (e.g., "$3.00 service fee" or "5%")
- Total

**4. Payment**
- Stripe Elements (card input)
- Apple Pay / Google Pay buttons (if available)

**5. Submit**
- "Place Order" button
- Below: "By placing this order, you agree to our Terms of Service"

**Behavior:**
- Validate all fields before enabling Place Order
- Show loading state during payment processing
- On success: redirect to confirmation
- On failure: show error inline, stay on page

#### F3.2: Guest vs Account

**Guest Checkout:**
- No account required
- Order accessible via email link

**Account Benefits (optional in MVP):**
- Order history
- Saved payment methods
- Faster checkout

### F4: Order Confirmation

#### F4.1: Confirmation Page

**URL:** `gather.market/berwyn/orders/:id/confirmation`

**Elements:**
- Success message with checkmark
- Order number (e.g., #BFM-2024-0042)
- QR code (large, scannable)
- Pickup details
  - Location with map link
  - Date and time window
- Order summary (collapsed, expandable)
- "Add to Calendar" button (Google Cal, Apple Cal, .ics)
- "Questions? Contact us" link

#### F4.2: Confirmation Email

**Subject:** "Your Berwyn Farmers Market order is confirmed! #BFM-2024-0042"

**Content:**
- Order number
- QR code (as image)
- Pickup date/time/location
- Order summary table
- "Add to Calendar" links
- Market contact info

#### F4.3: Reminder SMS (Stretch)

**Timing:** Day before pickup, 9am

**Content:** "Reminder: Your Berwyn Farmers Market order is ready for pickup tomorrow between 11am-12pm. Show your QR code at the pickup tent!"

### F5: Staff Order Dashboard

#### F5.1: Orders List

**URL:** `admin.gather.market/orders` (or `/berwyn/staff/orders`)

**Access:** Authenticated staff users

**Elements:**
- Tab navigation: Pending | Packed | Picked Up | Cancelled
- Date filter (defaults to next market day)
- Table columns:
  - Order # (clickable)
  - Customer name
  - Pickup time
  - Items count
  - Total
  - Status
  - Actions
- Bulk actions: Mark as Packed, Print Pick Lists

**Behavior:**
- Real-time updates (new orders appear automatically)
- Sort by pickup time (default)
- Search by order # or customer email

#### F5.2: Order Detail

**URL:** `admin.gather.market/orders/:id`

**Elements:**
- Order header: #, customer, email, phone
- Status badge with timeline
- Pickup time slot
- Items table:
  - Product name
  - Vendor
  - Quantity
  - Unit price
  - Status (pending / packed / issue)
- Actions:
  - Mark item as packed (checkbox)
  - Mark item as unavailable
  - Substitute item
  - Issue partial refund
- Full order actions:
  - Mark as packed
  - Mark as picked up
  - Cancel order (with refund)
- Notes field (internal)

### F6: Pick Lists

#### F6.1: Pick List Generator

**URL:** `admin.gather.market/pick-lists`

**Elements:**
- Date selector
- Pickup time filter (or "All")
- Generate button
- Preview area

**Output Format (per vendor):**

```
PICK LIST: Mitchell Farm
Market: Berwyn Farmers Market
Date: Saturday, June 7, 2024
Generated: Friday, June 6, 2024 8:00pm

┌─────────────────────────────────────────────────────┐
│ Product             │ Qty │ Order # │ Packed? │
├─────────────────────────────────────────────────────┤
│ Heirloom Tomatoes   │ 2   │ #042    │ [ ]     │
│ Heirloom Tomatoes   │ 1   │ #057    │ [ ]     │
│ Cherry Tomatoes     │ 3   │ #042    │ [ ]     │
│ Sweet Corn (6-pack) │ 2   │ #061    │ [ ]     │
└─────────────────────────────────────────────────────┘

Total items: 8
For: 3 orders
```

**Behavior:**
- Print-optimized CSS (black & white, no margins)
- PDF download option
- Grouped by vendor
- Consolidated (same product from multiple orders grouped)

### F7: Customer Check-in

#### F7.1: Check-in Interface

**URL:** `admin.gather.market/checkin`

**Elements:**
- QR scanner button (opens camera)
- Manual order # input
- Last 5 check-ins list

**Scan Flow:**
1. Staff taps "Scan QR"
2. Camera opens
3. Customer shows QR code
4. System scans and shows order summary
5. Staff verifies items are in bag
6. Staff taps "Complete Pickup"
7. Success confirmation
8. Customer leaves happy

**Fallback:**
- Manual entry if QR won't scan
- Search by customer name/email

### F8: Admin Product Management

#### F8.1: Products List

**URL:** `admin.gather.market/products`

**Elements:**
- Search bar
- Filter by: vendor, category, availability
- Table: Photo, Name, Vendor, Price, Stock, Status, Actions
- Add Product button

#### F8.2: Product Editor

**URL:** `admin.gather.market/products/:id/edit` or `/products/new`

**Fields:**
- Name* (text)
- Vendor* (dropdown)
- Category* (dropdown)
- Price* (number)
- Unit type* (dropdown: each, lb, oz, pint, bunch, etc.)
- Description (textarea)
- Photo (upload, drag-drop)
- Dietary tags (multi-select chips)
- Availability* (toggle: In Stock / Out of Stock)
- Inventory count (number, optional - for future inventory tracking)

**Behavior:**
- Auto-save draft
- Preview mode
- Photo compression (max 1MB, 1200px wide)

### F9: Admin Settings

#### F9.1: Market Settings

**Fields:**
- Market name
- Logo upload
- Address
- Description
- Contact email
- Contact phone
- Social links

#### F9.2: Pickup Configuration

**Fields:**
- Market days (checkboxes: Mon-Sun)
- Market hours (start/end time per day)
- Pickup time slots:
  - Duration (e.g., 1 hour)
  - Max orders per slot
  - Lead time (orders close X hours before pickup)

#### F9.3: Fees

**Fields:**
- Service fee type: Percentage / Flat / None
- Service fee amount
- Minimum order (optional)

---

## User Flows

### Flow 1: Customer Places Order

```
[Homepage]
    → [Browse/Search]
    → [View Product]
    → [Add to Cart] (toast: "Added!")
    → (continue shopping or...)
    → [Cart Page]
    → [Proceed to Checkout]
    → [Enter Email]
    → [Select Pickup Time]
    → [Enter Payment]
    → [Place Order]
    → [Confirmation Page] ← Email sent
```

### Flow 2: Staff Prepares Orders

```
[Login]
    → [Orders Dashboard]
    → [Filter: Next Market Day]
    → [Generate Pick Lists]
    → [Print Pick Lists]
    → (distribute to vendors)
    → (vendors pack items)
    → [Staff collects items]
    → [Mark Orders as Packed]
```

### Flow 3: Customer Picks Up

```
[Customer arrives at market]
    → [Shows QR code]
    → [Staff scans QR]
    → [Order displayed]
    → [Staff hands over bag]
    → [Staff taps "Complete Pickup"]
    → [Customer leaves]
```

### Flow 4: Handling Issues

```
[Item unavailable]
    → [Staff marks item as "Unavailable"]
    → [System sends customer notification]
    → [Options: Substitute / Refund]
    → [Staff selects action]
    → [Customer notified of resolution]
```

---

## Data Model

### Entities

```
Market
├── id: uuid
├── name: string
├── slug: string (unique)
├── description: text
├── logo_url: string
├── address: string
├── lat: decimal
├── lng: decimal
├── contact_email: string
├── contact_phone: string
├── settings: jsonb (fees, hours, etc.)
├── created_at: timestamp
└── updated_at: timestamp

Vendor
├── id: uuid
├── market_id: uuid (FK → Market)
├── name: string
├── slug: string (unique per market)
├── description: text
├── photo_url: string
├── location: string (farm location)
├── contact_email: string
├── is_active: boolean
├── created_at: timestamp
└── updated_at: timestamp

Category
├── id: uuid
├── market_id: uuid (FK → Market)
├── name: string
├── slug: string
├── sort_order: integer
└── icon: string (optional)

Product
├── id: uuid
├── vendor_id: uuid (FK → Vendor)
├── category_id: uuid (FK → Category)
├── name: string
├── slug: string (unique per vendor)
├── description: text
├── price: decimal
├── unit_type: enum (each, lb, oz, pint, bunch, dozen, etc.)
├── photo_url: string
├── dietary_tags: string[] (organic, vegan, etc.)
├── is_available: boolean
├── inventory_count: integer (nullable)
├── sort_order: integer
├── created_at: timestamp
└── updated_at: timestamp

PickupSlot
├── id: uuid
├── market_id: uuid (FK → Market)
├── date: date
├── start_time: time
├── end_time: time
├── max_orders: integer
├── current_orders: integer
└── is_active: boolean

Order
├── id: uuid
├── market_id: uuid (FK → Market)
├── order_number: string (e.g., BFM-2024-0042)
├── customer_email: string
├── customer_name: string
├── customer_phone: string (nullable)
├── pickup_slot_id: uuid (FK → PickupSlot)
├── status: enum (pending, packed, picked_up, cancelled)
├── subtotal: decimal
├── service_fee: decimal
├── total: decimal
├── stripe_payment_id: string
├── qr_code: string (unique token)
├── special_instructions: text (nullable)
├── notes: text (internal staff notes)
├── created_at: timestamp
├── updated_at: timestamp
├── packed_at: timestamp (nullable)
└── picked_up_at: timestamp (nullable)

OrderItem
├── id: uuid
├── order_id: uuid (FK → Order)
├── product_id: uuid (FK → Product)
├── vendor_id: uuid (FK → Vendor)
├── product_name: string (snapshot)
├── quantity: integer
├── unit_price: decimal (snapshot)
├── line_total: decimal
├── status: enum (pending, packed, unavailable, substituted)
├── substituted_with: uuid (FK → Product, nullable)
└── notes: text (nullable)

User (Staff/Admin)
├── id: uuid
├── email: string (unique)
├── password_hash: string
├── name: string
├── role: enum (admin, staff)
├── market_id: uuid (FK → Market)
├── created_at: timestamp
└── last_login_at: timestamp
```

### Indexes

```sql
-- Performance-critical queries
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available) WHERE is_available = true;
CREATE INDEX idx_orders_market_status ON orders(market_id, status);
CREATE INDEX idx_orders_pickup_slot ON orders(pickup_slot_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_vendor ON order_items(vendor_id);
```

---

## API Specification

### Public Endpoints (Customer)

```
GET  /api/markets/:slug
     → Returns market info, categories, featured products

GET  /api/markets/:slug/products
     ?category=produce
     ?vendor=mitchell-farm
     ?dietary=organic,vegan
     ?search=tomatoes
     ?sort=popular|price_asc|price_desc
     ?limit=20&offset=0
     → Returns paginated products

GET  /api/markets/:slug/products/:productSlug
     → Returns product detail

GET  /api/markets/:slug/vendors
     → Returns all active vendors

GET  /api/markets/:slug/vendors/:vendorSlug
     → Returns vendor detail with products

GET  /api/markets/:slug/pickup-slots
     ?date=2024-06-07
     → Returns available pickup slots with capacity

POST /api/markets/:slug/orders
     Body: { items: [...], customer: {...}, pickup_slot_id, payment_method_id }
     → Creates order, processes payment, returns confirmation

GET  /api/orders/:id
     ?token=abc123
     → Returns order details (requires token for guest orders)
```

### Staff Endpoints (Authenticated)

```
GET  /api/admin/orders
     ?market_id=...
     ?status=pending,packed
     ?date=2024-06-07
     → Returns orders list

GET  /api/admin/orders/:id
     → Returns order detail

PATCH /api/admin/orders/:id
      Body: { status: "packed" | "picked_up" | "cancelled" }
      → Updates order status

PATCH /api/admin/orders/:id/items/:itemId
      Body: { status: "packed" | "unavailable", substituted_with?: productId }
      → Updates item status

GET  /api/admin/pick-lists
     ?market_id=...
     ?date=2024-06-07
     → Returns pick lists grouped by vendor

POST /api/admin/check-in
     Body: { qr_code: "..." }
     → Validates QR, returns order, marks as picked up
```

### Admin Endpoints (Authenticated)

```
CRUD /api/admin/products
CRUD /api/admin/vendors
CRUD /api/admin/categories
GET  /api/admin/reports/summary
     ?date_from=...&date_to=...
     → Returns order count, revenue, top products
```

---

## Technical Architecture

### Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | Next.js 14 (App Router) | SSR, API routes, modern React |
| **Language** | TypeScript | Type safety, better DX |
| **Styling** | Tailwind CSS + shadcn/ui | Fast development, consistent design |
| **Database** | PostgreSQL | Relational, proven, works with Prisma |
| **ORM** | Prisma | Type-safe queries, migrations |
| **Auth** | NextAuth.js or Clerk | Sessions, OAuth if needed |
| **Payments** | Stripe | Industry standard, Stripe Elements |
| **Hosting** | Vercel | Easy Next.js deployment, preview URLs |
| **Database Hosting** | Supabase or Railway | Managed Postgres, easy setup |
| **Email** | Resend or SendGrid | Transactional emails |
| **SMS (stretch)** | Twilio | Reminders, alerts |
| **File Storage** | Cloudflare R2 or S3 | Product images |
| **Analytics** | Mixpanel or PostHog | User behavior tracking |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                              │
│  ┌────────────────┐    ┌────────────────┐                  │
│  │  Next.js App   │    │  API Routes    │                  │
│  │  (React SSR)   │───▶│  (/api/...)    │                  │
│  └────────────────┘    └───────┬────────┘                  │
└─────────────────────────────────┼───────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         ▼                         │
        │  ┌──────────┐    ┌──────────┐    ┌──────────┐    │
        │  │ Postgres │    │  Stripe  │    │  Resend  │    │
        │  │(Supabase)│    │ Payments │    │  Emails  │    │
        │  └──────────┘    └──────────┘    └──────────┘    │
        │                                                   │
        │  ┌──────────┐    ┌──────────┐                    │
        │  │ R2 / S3  │    │  Twilio  │                    │
        │  │ (images) │    │  (SMS)   │                    │
        │  └──────────┘    └──────────┘                    │
        │                   EXTERNAL SERVICES              │
        └──────────────────────────────────────────────────┘
```

### Project Structure

```
gather-app/
├── app/
│   ├── [marketSlug]/
│   │   ├── page.tsx              # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx          # Product listing
│   │   │   └── [productSlug]/
│   │   │       └── page.tsx      # Product detail
│   │   ├── vendors/
│   │   │   └── [vendorSlug]/
│   │   │       └── page.tsx      # Vendor page
│   │   ├── cart/
│   │   │   └── page.tsx          # Cart
│   │   ├── checkout/
│   │   │   └── page.tsx          # Checkout
│   │   └── orders/
│   │       └── [orderId]/
│   │           └── confirmation/
│   │               └── page.tsx  # Order confirmation
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with auth
│   │   ├── orders/
│   │   │   └── page.tsx          # Orders dashboard
│   │   ├── products/
│   │   │   └── page.tsx          # Product management
│   │   ├── pick-lists/
│   │   │   └── page.tsx          # Pick list generator
│   │   └── check-in/
│   │       └── page.tsx          # QR check-in
│   ├── api/
│   │   ├── markets/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── admin/
│   │   └── webhooks/
│   │       └── stripe/
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn components
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── admin/
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── stripe.ts                 # Stripe client
│   ├── email.ts                  # Email helpers
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
└── styles/
    └── globals.css               # Tailwind + custom styles
```

---

## Design Requirements

### Mobile-First

- 70%+ of traffic expected on mobile
- Touch targets: 48px minimum
- Thumb-friendly: important actions in reach zone
- Fast: optimize images, lazy load below fold

### Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Time to Interactive | <3.5s |
| Cumulative Layout Shift | <0.1 |
| Lighthouse Score | >90 |

### Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigable
- Screen reader friendly
- Color contrast ratios met
- Focus indicators visible

### Brand Application

See `/design-system/DESIGN_SYSTEM.md` for:
- Color palette (sage green + golden hour)
- Typography (DM Sans + Inter)
- Component styles
- Spacing and layout

---

## Success Metrics

### North Star Metric

**Monthly GMV (Gross Merchandise Value)**

### MVP Targets (Month 6)

| Metric | Target | How We'll Measure |
|--------|--------|-------------------|
| Monthly GMV | $50,000 | Stripe dashboard |
| Monthly orders | 800-1000 | Database |
| Average basket | $59 | Total GMV / Orders |
| Unique customers | 500+ | Unique emails |
| Repeat rate (30-day) | 40% | Cohort analysis |
| Cart completion | 70%+ | Analytics funnel |
| Customer satisfaction | 4.8/5 | Post-order survey |
| Pickup time | <5 min | Staff tracking |
| Vendor participation | 30+ of 70 | Admin count |

### Leading Indicators

| Metric | Target |
|--------|--------|
| Homepage → Product view | >40% |
| Product view → Add to cart | >10% |
| Add to cart → Checkout | >60% |
| Checkout → Complete | >85% |

---

## Roadmap

### Phase 1: MVP - Instacart for Farmers Markets

**Duration:** 6 months
**Goal:** Prove customers will buy online at Berwyn

| Month | Focus | Deliverables |
|-------|-------|--------------|
| 1 | Foundation | Design system, wireframes, database schema, project setup |
| 2 | Storefront | Homepage, product listing, product detail, search |
| 3 | Commerce | Cart, checkout, Stripe integration, order confirmation |
| 4 | Operations | Staff dashboard, pick lists, check-in system |
| 5 | Admin | Product management, settings, basic reporting |
| 6 | Launch | QA, Berwyn pilot, iterate on feedback |

**MVP Success Criteria:**
- $50K GMV in first season
- 500+ unique customers
- 40% repeat rate
- <5 min average pickup time

---

### Phase 2: Vendor Self-Service

**Duration:** Months 7-12
**Goal:** Scale to 10 markets; vendors manage their own products

**Features:**
- Vendor login portal
- Product management (add/edit/photos)
- Order notifications
- Inventory management
- Basic analytics (sales, popular items)
- Multi-market inventory sync

**Customer Enhancements:**
- Account creation
- Order history
- Saved favorites
- Reorder functionality
- Dietary preferences

**Target:** 10 markets, $500K monthly GMV, 70% vendors self-managing

---

### Phase 3: Market Manager Dashboard

**Duration:** Months 13-18
**Goal:** Become indispensable to market operations

**Features:**
- Digital vendor applications
- Stall assignment (visual layout)
- Automated fee collection
- License/insurance tracking
- SNAP/EBT processing
- Grant reporting (USDA FMPP/LFPP)
- Broadcast communications
- Financial dashboards

**Target:** 100 markets, 20+ hours/week saved per manager

---

### Phase 4: Platform Ecosystem

**Duration:** Months 19-24
**Goal:** Network effects; Series A ready

**Features:**
- Native mobile apps (iOS/Android)
- Customer loyalty programs
- Subscription boxes
- Personalized recommendations
- Multi-market management
- API for integrations
- White-label options

**Target:** 500 markets, $3M monthly GMV, Series A fundraise

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Low customer adoption** | Medium | High | Pre-launch waitlist (500+); $10 first-order credit; market-day promotion |
| **Vendor resistance** | Medium | Medium | Start with 10 willing vendors; show sales data; we manage products initially |
| **Bad product photos** | High | Medium | Photo guidelines for staff; offer to photograph products; AI enhancement |
| **Inventory inaccuracy** | High | High | Conservative availability; easy "sold out" toggle; clear substitution flow |
| **Market day tech issues** | Medium | High | Offline fallback mode; paper backup pick lists; thorough pre-launch testing |
| **Stripe payment failures** | Low | High | Retry logic; clear error messages; manual charge fallback |
| **Staff training gaps** | Medium | Medium | Simple UI; video tutorials; on-site support at launch |

---

## Open Questions

### Product

1. **Service fee model:** 5% of order? Flat $3? Free for launch period?
2. **Minimum order:** Require $20 minimum? No minimum?
3. **Substitutions:** Allow vendor substitutes? Auto-refund? Customer approval?
4. **Tips:** Allow tips for vendors or market staff?
5. **Order cutoff:** When do pre-orders close? Friday 8pm? Saturday 8am?

### Operations

6. **Pickup logistics:** Centralized tent or per-vendor pickup?
7. **Vendor packing:** Who packs the orders - vendors or staff?
8. **Peak capacity:** How many orders can we handle on launch day?

### Technical

9. **Domain:** gather.market? getgather.com? berwynmarket.com?
10. **SNAP/EBT:** Essential for MVP or Phase 2?
11. **Offline mode:** Required for staff tools? How robust?

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-26 | Drew + Claude | Initial comprehensive PRD |

---

## Appendix

### A: Competitive Landscape

| Competitor | Focus | Pricing | Gap |
|------------|-------|---------|-----|
| **Barn2Door** | Individual farms | $99-299/mo per farm | Farms need own brand/marketing |
| **LocalLine** | Wholesale/food hubs | Per-hub pricing | Not optimized for market shopping |
| **MarketWurks** | Market management only | $50-150/mo | No customer marketplace |
| **Market Wagon** | Regional aggregator | 20%+ commission | Not market-specific; generic |
| **WhatsGood** | Local food discovery | Free/commission | Limited checkout; clunky UX |

**Gather's Position:** Market-first. One marketplace per market. Vendors don't need their own e-commerce. Built-in customer base. Low friction for everyone.

### B: Berwyn Market Data

| Metric | Value |
|--------|-------|
| Vendors | 70+ |
| Weekly visitors | ~2,000 |
| Average in-person basket | $28 |
| Online pilot basket | $59 |
| Season | May - November |
| Location | Berwyn, PA |

### C: Key Contacts

| Role | Name | Notes |
|------|------|-------|
| Market Manager | Carlo Luciano | Founder, domain expert |
| Lead Developer | TBD | AI-accelerated development |
| Design | TBD | Part-time, 6-8 weeks |

---

*"Instacart for farmers markets" - that's it. Everything else is Phase 2+.*
