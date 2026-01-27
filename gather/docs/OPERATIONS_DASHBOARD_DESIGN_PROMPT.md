# Operations Dashboard UX Design Prompt

## Context for Claude

You are designing the **Operations Dashboard** for Gather - an "Instacart for farmers markets" platform. This dashboard is used by market staff and operations coordinators who handle order fulfillment on market day.

### Required Reading

Before proposing UX strategies, thoroughly review these documents:

1. **`/gather/PRD.md`** - Complete product requirements including:
   - User personas (Market Staff, Admin)
   - Feature specs for F5 (Staff Order Dashboard), F6 (Pick Lists), F7 (Customer Check-in), F8 (Admin Product Management)
   - Data model (Orders, OrderItems, PickupSlots, Products, Vendors)
   - User flows for order preparation and customer pickup

2. **`/gather/design-system/DESIGN_SYSTEM.md`** - Brand and design tokens:
   - Color system (sage green + golden hour)
   - Typography (DM Sans headings, Inter body)
   - Components, spacing, accessibility requirements

3. **`/gather/CLAUDE.md`** - Project overview and tech stack

---

## The Operations Team

### Primary User: Market Staff (Operations Coordinator)

| Attribute | Value |
|-----------|-------|
| Role | Market coordinator, volunteer, or manager |
| Tech Comfort | Moderate (can use Square, Google Sheets) |
| Device | Tablet (iPad) primary, laptop secondary, phone for check-in |
| Environment | Outdoor market, variable lighting, often standing |
| Constraints | Busy on market day, limited time for training, needs glanceable info |

### Jobs to Be Done

1. **Before market day (Thursday-Friday):**
   - See all pending orders for Saturday
   - Generate and print pick lists for vendors
   - Identify any inventory issues

2. **Market day morning (Saturday 6am-9am):**
   - Distribute pick lists to vendors
   - Collect packed items from each vendor
   - Mark orders as packed
   - Handle substitutions/issues

3. **During market hours (Saturday 9am-1pm):**
   - Check in customers via QR scan
   - Handle walk-up issues (can't find order, partial pickup)
   - Process refunds if needed

### Success Metrics

- Pick list accuracy: 99%
- Customer check-in: <30 seconds
- Zero lost orders
- Staff can be trained in <15 minutes

---

## Key Workflows to Design

### Workflow 1: Order Monitoring

**When:** Thursday evening through Saturday morning
**Goal:** Staff needs to see what's coming and catch issues early

**Current pain points to solve:**
- Need at-a-glance view of order volume by time slot
- Need to identify items that might be unavailable
- Need to see if any pickup slots are overbooked

### Workflow 2: Pick List Generation & Distribution

**When:** Friday evening / Saturday morning
**Goal:** Get consolidated lists to each vendor so they can pack efficiently

**Requirements:**
- Group by vendor
- Consolidate same products across orders
- Print-friendly (black & white, clear checkboxes)
- Show order numbers for traceability

### Workflow 3: Order Packing & Tracking

**When:** Saturday morning before market opens
**Goal:** Track which orders are fully packed and ready

**Challenges:**
- Multiple vendors per order
- Staff collecting from 10-20 vendor booths
- Need to know when an order is complete
- Handle partial fills (vendor ran out)

### Workflow 4: Customer Check-in

**When:** During market hours
**Goal:** Fast, friendly pickup experience

**Requirements:**
- QR code scanning (camera-based)
- Manual order lookup fallback
- Show customer name and order contents
- One-tap "Complete Pickup"
- Handle edge cases: wrong day, already picked up, cancelled

### Workflow 5: Issue Resolution

**When:** Any time
**Goal:** Handle problems without blocking the line

**Scenarios:**
- Item unavailable: mark, notify customer, suggest substitute or refund
- Customer no-show: flag order, hold until end of market
- Duplicate pickup attempt: show already picked up timestamp
- Refund needed: partial or full

---

## Design Considerations

### Device & Environment

- **Primary device:** iPad (tablet) - used at pickup tent and while walking market
- **Secondary:** Laptop for pre-market prep
- **Tertiary:** Phone for quick check-ins

**Environmental constraints:**
- Outdoor, variable sunlight (needs high contrast)
- Often standing/walking (needs large touch targets)
- Noisy environment (visual feedback > audio)
- Gloves possible in cold weather (big buttons)

### Information Architecture Questions

1. Should orders and pick lists be separate views or unified?
2. How do we show order status progression visually?
3. What's the right balance of density vs. scannability?
4. How do we handle real-time updates (new orders during market)?

### Interaction Patterns to Consider

- Bulk actions (mark multiple orders as packed)
- Filters that persist across sessions
- Offline capability for check-in
- Quick search (order #, customer name, phone)

---

## Design Request

Please propose UX strategies for the Operations Dashboard, addressing:

### 1. Information Architecture
- How should the dashboard be structured?
- What are the primary views/screens?
- How does navigation work across workflows?

### 2. Dashboard Home / Overview
- What metrics and status indicators should be front and center?
- How do we show "health" of the upcoming market day?
- What actions are immediately accessible?

### 3. Order Management View
- How should orders be displayed (list, cards, table)?
- What filters and sorts are essential?
- How do we show order status progression?
- How do we handle bulk operations?

### 4. Pick List Experience
- How do we generate and present pick lists?
- Should there be a digital checklist mode vs. print-only?
- How do we track vendor completion?

### 5. Check-in Flow
- What's the optimal UI for QR scanning?
- How do we display order details for verification?
- What's the "happy path" interaction (fewest taps)?
- How do we handle errors gracefully?

### 6. Issue Resolution Patterns
- How do substitutions work in the UI?
- How do we surface and resolve inventory problems?
- What does the refund flow look like?

### 7. Mobile Responsiveness
- How does the experience adapt from tablet to phone?
- Which features are tablet-only vs. phone-friendly?

### 8. Visual Design Direction
- How do we apply the Gather design system to an ops tool?
- Should the ops dashboard feel different from customer-facing app?
- What color-coding or status indicators help at a glance?

---

## Deliverables Expected

1. **Sitemap / IA diagram** - showing all screens and their relationships
2. **Key screen concepts** - either wireframes or detailed descriptions
3. **Interaction patterns** - for core workflows (packing, check-in)
4. **Design system extensions** - any new components needed for ops tools
5. **Recommended tech approach** - how this fits with the existing prototype

---

## Constraints

- Must work on iPad Safari (no native app for MVP)
- Must be usable by volunteers with minimal training
- Must handle 100+ orders on a busy market day
- Should feel like a "tool" but still be pleasant to use
- Should align with Gather's warm, approachable brand

---

## Example Inspiration

Consider UX patterns from:
- **Toast POS** - restaurant order management
- **Square for Retail** - inventory and orders
- **Shopify POS** - order fulfillment
- **DoorDash Merchant** - order queue management
- **Linear** - clean, dense, keyboard-friendly (for power users)

---

*This prompt is designed to give Claude full context to propose thoughtful, comprehensive UX strategies for the Gather Operations Dashboard.*
