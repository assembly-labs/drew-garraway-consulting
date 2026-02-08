# Gather Operations Dashboard - Feature Specification

> **Purpose:** Comprehensive feature list for the staff/operations side of Gather - designed for 2-4 market staff managing weekly pickup operations at farmers markets.

---

## Table of Contents

1. [Context & Constraints](#context--constraints)
2. [Feature Summary by Priority](#feature-summary-by-priority)
3. [Order Management](#1-order-management)
4. [Pick List System](#2-pick-list-system)
5. [Customer Check-in](#3-customer-check-in)
6. [Issue Resolution](#4-issue-resolution)
7. [Vendor Communication](#5-vendor-communication)
8. [Reporting & Analytics](#6-reporting--analytics)
9. [Settings & Configuration](#7-settings--configuration)
10. [Mobile & Offline Considerations](#8-mobile--offline-considerations)
11. [UX Patterns from Related Industries](#9-ux-patterns-from-related-industries)
12. [Implementation Recommendations](#10-implementation-recommendations)

---

## Context & Constraints

### Operational Reality

| Constraint | Detail |
|------------|--------|
| **Staff size** | 2-4 people on market day |
| **Frequency** | Once per week (Saturday) |
| **Timeline** | Orders come in Mon-Fri, fulfillment on Saturday morning |
| **Environment** | Outdoor market, potentially spotty wifi |
| **Devices** | Mix of tablets (primary), smartphones (backup), desktop (pre-market prep) |
| **Tech comfort** | Moderate - familiar with Square, Google Sheets |

### Key Staff Jobs

1. **Pre-Market (Fri evening/Sat morning):** Review orders, generate pick lists, distribute to vendors
2. **Market Setup (Sat 7-8am):** Collect packed items from vendors, organize by order
3. **Market Hours (Sat 8am-1pm):** Check in customers via QR, handle issues
4. **Post-Market (Sat 1-2pm):** Reconcile, handle no-shows, reporting

---

## Feature Summary by Priority

### MVP-Essential (P0)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Order list view | Low | See all orders with status, filters, search |
| Order detail view | Low | Full order info with item breakdown |
| Pick list generation | Medium | Generate printable lists grouped by vendor |
| QR code check-in | Medium | Scan customer QR to mark order picked up |
| Manual order lookup | Low | Search by order #, name, or email as QR fallback |
| Mark order packed | Low | Update status when vendor items collected |
| Basic substitution flow | Medium | Mark item unavailable, trigger customer notification |
| Simple refund trigger | Medium | Issue full or partial refund via Stripe |

### Important (P1)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Real-time order sync | Medium | New orders appear automatically via websockets |
| Bulk actions | Low | Select multiple orders to mark packed/generate lists |
| Order timeline | Low | Visual history of status changes with timestamps |
| Staff notes | Low | Internal notes per order (not visible to customer) |
| Issue flagging | Low | Mark orders with problems for follow-up |
| End-of-day summary | Medium | Quick stats: orders fulfilled, issues, revenue |
| Print-optimized views | Low | CSS for clean printing of pick lists and orders |
| Customer contact shortcuts | Low | One-tap call/SMS/email to customer |

### Nice-to-Have (P2)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Offline mode | High | Queue actions when offline, sync when reconnected |
| Vendor-specific dashboard view | Medium | Filter everything to single vendor perspective |
| Substitution suggestions | High | Suggest similar products when item unavailable |
| Batch check-in | Medium | Scan multiple orders quickly in sequence |
| Audio/haptic feedback | Low | Sound/vibration on successful scan |
| Time slot queue view | Medium | Kanban-style board organized by pickup window |
| Smart notifications | Medium | Alert staff when pickup slot approaching |
| Packing assistance | Medium | Guided step-by-step item collection |
| Photo documentation | Medium | Capture photos of issues for disputes |
| Customer wait time tracking | Medium | Track time from arrival to pickup completion |

### Future (P3)

| Feature | Complexity | Description |
|---------|------------|-------------|
| Multi-staff role assignment | High | Assign orders to specific staff members |
| Inventory sync | High | Real-time stock levels across all orders |
| Automated refunds | High | Auto-refund for unavailable items with rules |
| Customer self-check-in kiosk | High | Customer scans own QR at unattended station |
| Historical analytics | High | Week-over-week trends, vendor performance |
| API for vendor systems | High | Let vendors integrate with their own tools |

---

## 1. Order Management

### 1.1 Orders List View

**URL:** `/staff/orders`

**Priority:** P0 | **Complexity:** Low

**Description:** Central hub for viewing and managing all incoming orders. Staff spend most of their pre-market and market time here.

#### Elements

```
┌─────────────────────────────────────────────────────────────────┐
│ Orders                                            [+ New Order] │
├─────────────────────────────────────────────────────────────────┤
│ [Pending: 24] [Packed: 12] [Picked Up: 45] [Issues: 3] [All]   │
├─────────────────────────────────────────────────────────────────┤
│ Date: [Sat, Feb 8 ▼]  Pickup: [All Slots ▼]  Search: [______]  │
├─────────────────────────────────────────────────────────────────┤
│ [ ] Select All                      Sort: [Pickup Time ▼]      │
├─────────────────────────────────────────────────────────────────┤
│ [ ] #BFM-0042 │ Catherine S.  │ 11:00-12:00 │ 7 items │ $67.50 │
│     [Pending]                               │ Mitchell, Sunny  │
├─────────────────────────────────────────────────────────────────┤
│ [ ] #BFM-0043 │ Robert T.     │ 9:00-10:00  │ 3 items │ $28.00 │
│     [Packed]                                │ Mitchell         │
├─────────────────────────────────────────────────────────────────┤
│ [ ] #BFM-0044 │ Jennifer M.   │ 10:00-11:00 │ 5 items │ $52.25 │
│     [Issue: 1 item unavailable]             │ Tom's, Valley    │
└─────────────────────────────────────────────────────────────────┘
│ Bulk Actions: [Mark Packed] [Generate Pick Lists] [Export]     │
└─────────────────────────────────────────────────────────────────┘
```

#### Behavior

- **Tab counts update in real-time** as orders change status
- **Default view:** Next market day, Pending tab, sorted by pickup time
- **Real-time updates:** New orders appear automatically (websocket) with subtle highlight
- **Row shows:** Order #, customer name, pickup slot, item count, total, vendors involved
- **Issue badge:** Red dot/badge if any items have problems
- **Click row:** Opens order detail slide-out or full page

#### Filters & Sort

| Filter | Options |
|--------|---------|
| Status | Pending, Packed, Picked Up, Cancelled, Issues |
| Date | Calendar picker (defaults to next/current market) |
| Pickup Slot | All, 9-10am, 10-11am, 11-12pm, 12-1pm |
| Vendor | Multi-select (filters to orders containing vendor) |
| Search | Order #, customer name, email, phone |

| Sort | Description |
|------|-------------|
| Pickup Time (default) | Earliest first |
| Order Date | Most recent first |
| Total | Highest first |
| Customer Name | A-Z |

#### Bulk Actions

- **Mark as Packed:** Set multiple orders to packed status
- **Generate Pick Lists:** Create pick lists for selected orders
- **Export:** Download CSV for backup/reporting
- **Print:** Print selected order summaries

---

### 1.2 Order Detail View

**URL:** `/staff/orders/:id`

**Priority:** P0 | **Complexity:** Low

**Description:** Complete view of a single order with all items, customer info, and action controls.

#### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Orders            #BFM-2024-0042           [Actions ▼]│
├─────────────────────────────────────────────────────────────────┤
│ STATUS: [PENDING ▼]                                              │
│ ●───────────○───────────○───────────○                            │
│ Placed     Packed     Picked Up   Complete                       │
│ Jan 30     -          -           -                              │
│ 7:42pm                                                           │
├─────────────────────────────────────────────────────────────────┤
│ CUSTOMER                          PICKUP                         │
│ Catherine Sullivan               Saturday, Feb 8, 2025           │
│ catherine.s@email.com            11:00 AM - 12:00 PM             │
│ (610) 555-1234                   Berwyn Farmers Market           │
│ [📞 Call] [💬 SMS] [✉️ Email]     Pickup Tent A                   │
├─────────────────────────────────────────────────────────────────┤
│ ITEMS (7)                                             Subtotal   │
├─────────────────────────────────────────────────────────────────┤
│ Mitchell Farm                                                    │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ [✓] Heirloom Tomatoes    2 lb @ $4.50     $9.00     [Actions]││
│ │ [✓] Sweet Corn 6-pack    1 @ $6.00        $6.00     [Actions]││
│ │ [ ] Cherry Tomatoes      1 pint @ $5.00   $5.00 ⚠️  [Mark N/A]││
│ └──────────────────────────────────────────────────────────────┘│
│ Sunny Meadow Dairy                                               │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ [✓] Farm Fresh Eggs      2 doz @ $7.00    $14.00    [Actions]││
│ │ [✓] Whole Milk           1 gal @ $8.00    $8.00     [Actions]││
│ └──────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Subtotal:                                              $42.00   │
│ Service Fee:                                            $3.00   │
│ TOTAL:                                                 $45.00   │
├─────────────────────────────────────────────────────────────────┤
│ SPECIAL INSTRUCTIONS                                             │
│ "Please include extra napkins if possible. First time ordering!"│
├─────────────────────────────────────────────────────────────────┤
│ STAFF NOTES                                          [Add Note] │
│ • Jan 31, 10am - Called to confirm pickup time (Staff: Maria)   │
├─────────────────────────────────────────────────────────────────┤
│ TIMELINE                                                         │
│ Feb 1, 7:42pm  Order placed                                     │
│ Feb 1, 7:42pm  Confirmation email sent                          │
│ Feb 1, 7:43pm  Payment captured ($45.00)                        │
└─────────────────────────────────────────────────────────────────┘
│            [Mark All Packed]  [Complete Pickup]                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Item Actions

| Action | Description |
|--------|-------------|
| Mark Packed | Check item as collected from vendor |
| Mark Unavailable | Item not available; triggers substitution flow |
| Substitute | Replace with different product |
| Adjust Quantity | Change quantity (triggers partial refund if less) |
| Add Note | Internal note about specific item |

#### Order Actions (Actions Menu)

| Action | Description |
|--------|-------------|
| Mark as Packed | All items collected, order ready |
| Complete Pickup | Customer received order |
| Issue Refund | Open refund dialog |
| Cancel Order | Cancel with full refund |
| Resend Confirmation | Email customer their QR again |
| Print Order | Print-friendly version |
| Contact Customer | Call/SMS/Email shortcuts |

---

### 1.3 Order Status Management

**Priority:** P0 | **Complexity:** Low

**Description:** Clear status progression with visual timeline.

#### Status Flow

```
PENDING → PACKED → PICKED_UP → COMPLETE
    ↓
CANCELLED (with refund)

Any status can have ISSUE flag
```

| Status | Color | Description | Triggered By |
|--------|-------|-------------|--------------|
| Pending | Yellow | Order placed, awaiting fulfillment | Order creation |
| Packed | Blue | All items collected and ready | Staff action |
| Picked Up | Green | Customer received order | QR scan or manual |
| Complete | Gray | Order finalized (24hr after pickup) | Automatic |
| Cancelled | Red | Order cancelled with refund | Staff action |

#### Issue Flag

- **Separate from status** - any order can have issues
- **Triggers:** Item unavailable, customer no-show, payment problem
- **Visual:** Red warning badge on order row
- **Resolution:** Staff marks issue resolved with note

---

### 1.4 Quick Stats Header

**Priority:** P1 | **Complexity:** Low

**Description:** At-a-glance metrics shown at top of orders page.

```
┌────────────┬────────────┬────────────┬────────────┐
│   Today    │   Packed   │  Picked Up │   Issues   │
│    42      │    28      │     8      │     2      │
│  orders    │   ready    │  complete  │  pending   │
│  $2,847    │   67%      │    19%     │    ⚠️      │
└────────────┴────────────┴────────────┴────────────┘
```

---

## 2. Pick List System

### 2.1 Pick List Generator

**URL:** `/staff/pick-lists`

**Priority:** P0 | **Complexity:** Medium

**Description:** Generate consolidated pick lists for vendors. Vendors use these to know what to set aside for online orders.

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Pick Lists                                                       │
├─────────────────────────────────────────────────────────────────┤
│ Market Date: [Saturday, Feb 8 ▼]                                │
│ Pickup Slots: [All ▼] or [9-10am] [10-11am] [11-12pm] [12-1pm] │
├─────────────────────────────────────────────────────────────────┤
│ VENDORS WITH ORDERS (8)                                          │
├─────────────────────────────────────────────────────────────────┤
│ [✓] Mitchell Farm          15 items │ 12 orders │ [Preview]     │
│ [✓] Sunny Meadow Dairy     8 items  │ 7 orders  │ [Preview]     │
│ [✓] Tom's Organic Produce  22 items │ 18 orders │ [Preview]     │
│ [✓] Valley Bread Co.       6 items  │ 5 orders  │ [Preview]     │
│ [✓] Happy Hen Eggs         12 items │ 9 orders  │ [Preview]     │
│ ... (3 more)                                                     │
├─────────────────────────────────────────────────────────────────┤
│ [Generate All] [Generate Selected] [Print All] [Download PDFs]  │
└─────────────────────────────────────────────────────────────────┘
```

#### Pick List Format (Per Vendor)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PICK LIST                                     │
│                    Mitchell Farm                                 │
├─────────────────────────────────────────────────────────────────┤
│ Market: Berwyn Farmers Market                                    │
│ Date: Saturday, February 8, 2025                                │
│ Generated: Friday, Feb 7, 2025 at 8:00 PM                       │
│ Orders Close: Saturday, Feb 8 at 8:00 AM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ PRODUCT              QTY    ORDERS           PACKED              │
│ ─────────────────────────────────────────────────────────────── │
│ Heirloom Tomatoes                                                │
│   2 lb               ─      #042             [ ]                 │
│   1 lb               ─      #057, #061       [ ]                 │
│   3 lb               ─      #063             [ ]                 │
│   ─────────────────────────                                      │
│   TOTAL: 6 lb        4 orders                                   │
│                                                                  │
│ Cherry Tomatoes (pint)                                           │
│   1 pint             ─      #042, #058       [ ]                 │
│   2 pints            ─      #055             [ ]                 │
│   ─────────────────────────                                      │
│   TOTAL: 4 pints     3 orders                                   │
│                                                                  │
│ Sweet Corn (6-pack)                                              │
│   1 pack             ─      #042, #061, #067 [ ]                 │
│   2 packs            ─      #059             [ ]                 │
│   ─────────────────────────                                      │
│   TOTAL: 5 packs     4 orders                                   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ SUMMARY                                                          │
│ Total Products: 3                                                │
│ Total Items: 15                                                  │
│ Total Orders: 12                                                 │
│                                                                  │
│ Questions? Contact market staff: (610) 555-0000                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Behavior

- **Consolidation:** Group same products across orders
- **Grouped by product:** Not by order (easier for vendor to pick)
- **Checkboxes for packing:** Vendor checks off as they pack
- **Order references:** Show which orders each item belongs to
- **Print-optimized:** Black & white, no headers/footers, clean margins
- **PDF option:** Downloadable for email/sharing

---

### 2.2 Pick List Preview

**Priority:** P1 | **Complexity:** Low

**Description:** Preview pick list before printing/generating.

#### Features

- Modal or slide-out showing formatted pick list
- Toggle between "by product" and "by order" views
- Edit notes before generating
- Last generated timestamp

---

### 2.3 Vendor Pick List Distribution

**Priority:** P2 | **Complexity:** Medium

**Description:** Send pick lists directly to vendors.

#### Options

- **Email:** Send PDF to vendor email on file
- **SMS:** Text link to view pick list
- **Print station:** Print all pick lists in sequence
- **Scheduled send:** Auto-send Friday evening at X time

---

### 2.4 Pick List by Order (Alternative View)

**Priority:** P2 | **Complexity:** Low

**Description:** View pick lists organized by order instead of by product.

```
ORDER #BFM-0042 - Catherine S. (Pickup: 11:00-12:00)
├── Mitchell Farm
│   ├── [ ] Heirloom Tomatoes (2 lb)
│   └── [ ] Sweet Corn 6-pack (1)
├── Sunny Meadow Dairy
│   ├── [ ] Farm Fresh Eggs (2 doz)
│   └── [ ] Whole Milk (1 gal)
└── Tom's Organic
    └── [ ] Organic Kale (1 bunch)
```

Useful for staff when collecting items from vendors.

---

## 3. Customer Check-in

### 3.1 QR Code Scanner

**URL:** `/staff/check-in`

**Priority:** P0 | **Complexity:** Medium

**Description:** Primary interface for processing customer arrivals. Staff scans QR from customer's phone or printed confirmation.

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Customer Check-in                           [Manual Entry →]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌───────────────────────────────────┐                   │
│         │                                   │                   │
│         │                                   │                   │
│         │        📷 CAMERA VIEWFINDER       │                   │
│         │                                   │                   │
│         │     Point at customer's QR code   │                   │
│         │                                   │                   │
│         │                                   │                   │
│         └───────────────────────────────────┘                   │
│                                                                  │
│                    [Tap to Scan]                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ RECENT CHECK-INS                                                 │
│ ✓ #0042 Catherine S.    11:32am    $67.50                       │
│ ✓ #0038 Michael R.      11:28am    $42.00                       │
│ ✓ #0041 Sarah K.        11:25am    $89.25                       │
│ ✓ #0039 James L.        11:20am    $31.50                       │
│ ✓ #0037 Emily W.        11:15am    $55.00                       │
└─────────────────────────────────────────────────────────────────┘
```

#### Scan Result - Success

```
┌─────────────────────────────────────────────────────────────────┐
│                          ✓                                       │
│                    ORDER FOUND                                   │
├─────────────────────────────────────────────────────────────────┤
│ #BFM-2024-0042                                                   │
│                                                                  │
│ Catherine Sullivan                                               │
│ Pickup Window: 11:00 AM - 12:00 PM ✓ (on time)                  │
│                                                                  │
│ ITEMS (7)                                                        │
│ • Heirloom Tomatoes (2 lb) - Mitchell Farm                      │
│ • Sweet Corn 6-pack - Mitchell Farm                             │
│ • Cherry Tomatoes (1 pint) - Mitchell Farm                      │
│ • Farm Fresh Eggs (2 doz) - Sunny Meadow                        │
│ • Whole Milk (1 gal) - Sunny Meadow                             │
│ • Organic Kale (1 bunch) - Tom's Organic                        │
│ • Sourdough Loaf - Valley Bread                                 │
│                                                                  │
│ TOTAL: $67.50 (PAID)                                            │
├─────────────────────────────────────────────────────────────────┤
│ NOTES: "Extra napkins please"                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│           [✓ Complete Pickup]    [View Details]                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Scan Result - Issues

```
┌─────────────────────────────────────────────────────────────────┐
│                          ⚠️                                      │
│                    ORDER HAS ISSUES                              │
├─────────────────────────────────────────────────────────────────┤
│ #BFM-2024-0044                                                   │
│ Jennifer Martinez                                                │
│                                                                  │
│ ⚠️ 1 ITEM UNAVAILABLE                                            │
│ • Cherry Tomatoes - SUBSTITUTED with Grape Tomatoes             │
│   Customer notified via email                                    │
│                                                                  │
│ ⚠️ PARTIAL REFUND ISSUED                                         │
│ • $3.00 refunded for price difference                           │
├─────────────────────────────────────────────────────────────────┤
│ Adjusted Total: $49.25                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   [✓ Complete Pickup]  [View Details]  [Contact Customer]       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Error States

| State | Display | Action |
|-------|---------|--------|
| Invalid QR | "QR code not recognized" | Offer manual lookup |
| Already picked up | "Order already picked up at 10:45am" | Show who processed |
| Cancelled order | "This order was cancelled" | Show refund status |
| Wrong date | "Order is for next Saturday" | Confirm or reject |
| Not ready | "Order not yet packed" | Alert staff to pack |

---

### 3.2 Manual Order Lookup

**Priority:** P0 | **Complexity:** Low

**Description:** Fallback when QR won't scan (damaged, phone dead, forgot confirmation).

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Find Order                                              [× Close]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Search by:                                                       │
│ ○ Order Number   ● Customer Name   ○ Phone   ○ Email            │
│                                                                  │
│ [Catherine___________________________________] 🔍                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ MATCHING ORDERS (2)                                              │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ #0042  Catherine Sullivan                                    │ │
│ │ 11:00-12:00 │ 7 items │ $67.50 │ PACKED                     │ │
│ │ [Select This Order →]                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ #0028  Catherine Wright                                      │ │
│ │ 10:00-11:00 │ 3 items │ $28.00 │ PICKED UP ✓                │ │
│ │ [Already Picked Up]                                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Batch Check-in Mode

**Priority:** P2 | **Complexity:** Medium

**Description:** Fast mode for high-volume periods. Scan multiple orders in sequence without confirmation between each.

#### Features

- Continuous scanning mode
- Audio/haptic confirmation for each scan
- Counter showing orders processed
- Error handling without stopping flow
- Review mode to see all processed orders

---

### 3.4 Check-in Queue View

**Priority:** P2 | **Complexity:** Medium

**Description:** Visual queue of customers in current pickup window.

```
┌─────────────────────────────────────────────────────────────────┐
│ Current Window: 11:00 AM - 12:00 PM            12 orders total  │
├────────────────┬───────────────┬────────────────────────────────┤
│ WAITING (8)    │ IN PROGRESS(1)│ COMPLETED (3)                  │
├────────────────┼───────────────┼────────────────────────────────┤
│ Catherine S.   │ Robert M.     │ ✓ Sarah K.                     │
│ Michael R.     │ (Processing)  │ ✓ James L.                     │
│ Jennifer M.    │               │ ✓ Emily W.                     │
│ David K.       │               │                                │
│ Lisa P.        │               │                                │
│ (3 more...)    │               │                                │
└────────────────┴───────────────┴────────────────────────────────┘
```

---

### 3.5 Audio/Visual Feedback

**Priority:** P2 | **Complexity:** Low

**Description:** Clear feedback for scan results.

| Result | Audio | Visual | Haptic |
|--------|-------|--------|--------|
| Success | Pleasant chime | Green flash, checkmark | Short vibration |
| Issue | Warning tone | Yellow flash, alert icon | Double vibration |
| Error | Error buzz | Red flash, X icon | Long vibration |
| Already processed | Info tone | Gray, "Already done" | None |

---

## 4. Issue Resolution

### 4.1 Item Unavailable Flow

**Priority:** P0 | **Complexity:** Medium

**Description:** Handle when a product is not available from vendor.

#### Flow

```
[Staff marks item unavailable]
         ↓
[Choose resolution]
    ├── Refund item
    ├── Substitute with similar item
    └── Mark for customer decision
         ↓
[Customer notified via email/SMS]
         ↓
[Order updated with resolution]
```

#### Interface - Mark Unavailable

```
┌─────────────────────────────────────────────────────────────────┐
│ Item Unavailable                                        [× Close]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ UNAVAILABLE ITEM                                                 │
│ Cherry Tomatoes (1 pint) - $5.00                                │
│ From: Mitchell Farm                                              │
│ Order: #BFM-2024-0042 (Catherine S.)                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ RESOLUTION                                                       │
│                                                                  │
│ ○ Refund this item ($5.00)                                      │
│   Customer will be refunded automatically                        │
│                                                                  │
│ ● Substitute with similar item                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Search or select replacement:                            │   │
│   │ [grape tomatoes_______________________] 🔍               │   │
│   │                                                          │   │
│   │ SUGGESTED (same vendor)                                  │   │
│   │ • Grape Tomatoes (1 pint) - $4.50  [Select]             │   │
│   │ • Roma Tomatoes (1 lb) - $4.00  [Select]                │   │
│   │                                                          │   │
│   │ SIMILAR (other vendors)                                  │   │
│   │ • Cherry Tomatoes - Tom's Organic - $5.50  [Select]     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ○ Contact customer first                                        │
│   Put order on hold and notify customer to choose               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ADD NOTE (optional)                                              │
│ [Vendor sold out early - heavy demand this week___________]     │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│              [Cancel]                [Apply Resolution]          │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Substitution Management

**Priority:** P1 | **Complexity:** Medium

**Description:** Track and manage item substitutions.

#### Substitution Rules

| Scenario | Price Handling | Customer Notification |
|----------|---------------|----------------------|
| Substitute same price | No change | Email confirmation |
| Substitute lower price | Refund difference | Email + refund notification |
| Substitute higher price | Absorb difference | Email confirmation |
| No substitute available | Full item refund | Email + refund notification |

#### Substitution Record

```
Original: Cherry Tomatoes (1 pint) - $5.00
Replaced: Grape Tomatoes (1 pint) - $4.50
Difference: -$0.50 (refunded)
Reason: Original unavailable
Staff: Maria
Time: Feb 8, 8:30am
Customer Notified: Yes (email sent Feb 8, 8:31am)
```

---

### 4.3 Refund Processing

**Priority:** P0 | **Complexity:** Medium

**Description:** Issue full or partial refunds through Stripe.

#### Interface - Issue Refund

```
┌─────────────────────────────────────────────────────────────────┐
│ Issue Refund                                            [× Close]│
├─────────────────────────────────────────────────────────────────┤
│ Order #BFM-2024-0042                                             │
│ Customer: Catherine Sullivan                                     │
│ Original Total: $67.50                                          │
│ Already Refunded: $0.00                                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ REFUND TYPE                                                      │
│                                                                  │
│ ○ Full Refund ($67.50)                                          │
│   Cancel entire order and refund full amount                    │
│                                                                  │
│ ● Partial Refund                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Select items to refund:                                  │   │
│   │ [ ] Heirloom Tomatoes (2 lb)              $9.00         │   │
│   │ [ ] Sweet Corn 6-pack                     $6.00         │   │
│   │ [✓] Cherry Tomatoes (1 pint)              $5.00         │   │
│   │ [ ] Farm Fresh Eggs (2 doz)               $14.00        │   │
│   │ [ ] Whole Milk (1 gal)                    $8.00         │   │
│   │                                                          │   │
│   │ Or enter custom amount:                                  │   │
│   │ $ [_____]                                                │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│ Refund Amount: $5.00                                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ REASON (required)                                                │
│ [Item unavailable - vendor sold out________________] ▼          │
│                                                                  │
│ Internal Note:                                                   │
│ [High demand week, Mitchell ran out by 9am___________]          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Notify customer via email                                     │
│                                                                  │
│              [Cancel]                [Process Refund]            │
└─────────────────────────────────────────────────────────────────┘
```

#### Refund Reasons (Dropdown)

- Item unavailable - vendor sold out
- Item unavailable - quality issue
- Customer requested cancellation
- Order error - wrong item
- Order error - wrong quantity
- Pricing error
- Other (specify)

---

### 4.4 Customer No-Show Handling

**Priority:** P1 | **Complexity:** Medium

**Description:** Process orders when customers don't pick up.

#### Flow

```
[End of market day]
         ↓
[Identify unpicked orders]
         ↓
[Options per order]
    ├── Contact customer (call/SMS)
    ├── Hold for next week (perishables excluded)
    ├── Return items to vendors
    └── Issue refund (full or minus restocking fee)
```

#### No-Show Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Unpicked Orders - Feb 8, 2025                          3 orders │
├─────────────────────────────────────────────────────────────────┤
│ #0044 │ Jennifer M. │ 10-11am slot │ $52.25 │ No contact yet    │
│       [📞 Call] [💬 SMS] [Refund] [Hold]                         │
├─────────────────────────────────────────────────────────────────┤
│ #0051 │ David K.    │ 11-12pm slot │ $38.00 │ Left voicemail    │
│       [📞 Call] [💬 SMS] [Refund] [Hold]                         │
├─────────────────────────────────────────────────────────────────┤
│ #0058 │ Lisa P.     │ 12-1pm slot  │ $64.75 │ Customer en route │
│       [📞 Call] [💬 SMS] [Refund] [Hold]                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.5 Issue Log

**Priority:** P1 | **Complexity:** Low

**Description:** Track all issues for review and pattern identification.

#### Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ Issue Log                                   [Export] [Filter ▼] │
├─────────────────────────────────────────────────────────────────┤
│ Feb 8 │ #0042 │ Item unavailable │ Cherry Tomatoes │ Refunded  │
│ Feb 8 │ #0044 │ No-show          │ -               │ Pending   │
│ Feb 8 │ #0051 │ Item unavailable │ Organic Kale    │ Substituted│
│ Feb 1 │ #0038 │ Quality issue    │ Eggs            │ Refunded  │
│ Feb 1 │ #0029 │ No-show          │ -               │ Refunded  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Vendor Communication

### 5.1 Vendor Contact Directory

**Priority:** P1 | **Complexity:** Low

**Description:** Quick access to vendor contact info during market operations.

```
┌─────────────────────────────────────────────────────────────────┐
│ Vendors                                              [Search___]│
├─────────────────────────────────────────────────────────────────┤
│ Mitchell Farm                    Orders today: 12               │
│ Tom Mitchell │ (610) 555-1234 │ tom@mitchellfarm.com            │
│ [📞 Call] [💬 SMS] [✉️ Email] [View Orders]                       │
├─────────────────────────────────────────────────────────────────┤
│ Sunny Meadow Dairy               Orders today: 7                │
│ Sarah Chen │ (610) 555-5678 │ sarah@sunnymeadow.com             │
│ [📞 Call] [💬 SMS] [✉️ Email] [View Orders]                       │
├─────────────────────────────────────────────────────────────────┤
│ (more vendors...)                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.2 Vendor-Specific Order View

**Priority:** P2 | **Complexity:** Medium

**Description:** Filter all views to single vendor perspective.

#### Use Cases

- Staff assigned to specific vendors
- Troubleshooting vendor-specific issues
- Vendor asking questions about their orders

---

### 5.3 Pick List Delivery Tracking

**Priority:** P2 | **Complexity:** Low

**Description:** Track which vendors have received their pick lists.

```
┌─────────────────────────────────────────────────────────────────┐
│ Pick List Status - Feb 8                                         │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Mitchell Farm      │ Emailed Fri 8pm │ Opened Sat 6am         │
│ ✓ Sunny Meadow       │ Emailed Fri 8pm │ Opened Sat 6:15am      │
│ ⚠️ Tom's Organic      │ Emailed Fri 8pm │ Not opened             │
│ ✓ Valley Bread       │ Printed Sat 7am │ Delivered in person    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Reporting & Analytics

### 6.1 End-of-Day Summary

**Priority:** P1 | **Complexity:** Medium

**Description:** Quick recap of market day performance.

```
┌─────────────────────────────────────────────────────────────────┐
│ Market Day Summary                              February 8, 2025│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ORDERS                          │ REVENUE                        │
│ ──────────────────────────────  │ ─────────────────────────────  │
│ Total Orders:        45         │ Gross Sales:       $2,847.50   │
│ Picked Up:           42 (93%)   │ Refunds:              -$38.00  │
│ No-Shows:             2 (4%)    │ Service Fees:        +$135.00  │
│ Cancelled:            1 (2%)    │ Net Revenue:       $2,944.50   │
│                                 │                                │
│ ITEMS                           │ ISSUES                         │
│ ──────────────────────────────  │ ─────────────────────────────  │
│ Items Sold:          287        │ Unavailable Items:    4        │
│ Items Substituted:     6        │ Substitutions Made:   6        │
│ Items Refunded:        4        │ Refunds Issued:       3        │
│                                 │ Avg Resolution:       12 min   │
│                                 │                                │
│ TIMING                          │ TOP VENDORS                    │
│ ──────────────────────────────  │ ─────────────────────────────  │
│ First Pickup:        8:42am     │ 1. Mitchell Farm     $482.00   │
│ Last Pickup:        12:58pm     │ 2. Tom's Organic     $398.50   │
│ Avg Wait Time:       3.2 min    │ 3. Sunny Meadow      $356.00   │
│ Peak Hour:          10-11am     │ 4. Valley Bread      $287.25   │
│                                 │ 5. Happy Hen         $245.00   │
│                                 │                                │
├─────────────────────────────────────────────────────────────────┤
│ NOTES                                                            │
│ • High demand for tomatoes - Mitchell sold out by 9am           │
│ • 2 no-shows contacted, 1 rescheduled for next week             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Email Summary to Team] [Download PDF] [View Full Report]       │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6.2 Weekly/Monthly Reports

**Priority:** P2 | **Complexity:** Medium

**Description:** Aggregate reporting over time.

#### Metrics

| Category | Metrics |
|----------|---------|
| Orders | Total, average per week, growth % |
| Revenue | GMV, fees collected, refunds |
| Customers | Unique, repeat rate, average basket |
| Products | Top sellers, frequently unavailable |
| Vendors | Revenue by vendor, issue rate |
| Operations | Avg pickup time, issue resolution time |

---

### 6.3 Vendor Performance

**Priority:** P2 | **Complexity:** Medium

**Description:** Per-vendor analytics.

```
Mitchell Farm - Performance
├── Revenue: $2,156 (this month)
├── Orders: 48
├── Popular Items: Heirloom Tomatoes (32), Sweet Corn (28)
├── Availability Rate: 94%
├── Substitution Rate: 6%
└── Customer Rating: 4.8/5
```

---

### 6.4 Export & Integration

**Priority:** P2 | **Complexity:** Low

**Description:** Export data for external analysis.

#### Formats

- CSV (orders, items, customers)
- PDF (formatted reports)
- JSON (API access for integration)

---

## 7. Settings & Configuration

### 7.1 Staff Management

**Priority:** P1 | **Complexity:** Medium

**Description:** Manage staff access and roles.

```
┌─────────────────────────────────────────────────────────────────┐
│ Staff Members                                        [+ Invite] │
├─────────────────────────────────────────────────────────────────┤
│ Maria Garcia │ Admin │ maria@gather.market │ Active            │
│ [Edit] [Remove]                                                  │
├─────────────────────────────────────────────────────────────────┤
│ James Wilson │ Staff │ james.w@email.com │ Active               │
│ [Edit] [Remove]                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Volunteer 1 │ Check-in Only │ vol1@email.com │ Invited          │
│ [Resend Invite] [Remove]                                         │
└─────────────────────────────────────────────────────────────────┘
```

#### Roles

| Role | Permissions |
|------|-------------|
| Admin | All features + settings |
| Staff | Orders, pick lists, check-in, issues |
| Check-in Only | QR scanning only |
| Viewer | Read-only access |

---

### 7.2 Notification Settings

**Priority:** P1 | **Complexity:** Low

**Description:** Configure when/how staff get notified.

#### Options

- New order placed (real-time / hourly digest / off)
- Order cancelled
- Customer check-in
- Issue flagged
- End-of-day summary
- Pick lists ready to generate

---

### 7.3 Pick List Settings

**Priority:** P1 | **Complexity:** Low

**Description:** Configure pick list generation.

#### Options

- Auto-generate time (e.g., Friday 8pm)
- Auto-email to vendors
- Include order numbers (yes/no)
- Consolidate same products (yes/no)
- Sort by product name / vendor location

---

### 7.4 Check-in Settings

**Priority:** P1 | **Complexity:** Low

**Description:** Configure check-in behavior.

#### Options

- Require confirmation tap (yes/no)
- Auto-mark as picked up on scan
- Allow early pickup (before slot)
- Allow late pickup (after slot)
- Audio feedback (on/off)

---

## 8. Mobile & Offline Considerations

### 8.1 Device-Specific Layouts

**Priority:** P0 | **Complexity:** Medium

**Description:** Optimize for primary device types.

#### Device Matrix

| Device | Primary Use | Key Features |
|--------|-------------|--------------|
| Tablet (iPad) | Check-in station | Large touch targets, scanner, queue view |
| Phone | Mobile staff | Essential actions only, one-hand operation |
| Desktop | Pre-market prep | Full dashboard, reporting, settings |

#### Tablet Layout

- Large order cards
- Full-width scanner
- Bottom action bar
- Split view: scanner + order list

#### Phone Layout

- Simplified navigation
- Essential info only
- Swipe actions
- Bottom tab bar

---

### 8.2 Offline Mode

**Priority:** P2 | **Complexity:** High

**Description:** Function with limited connectivity.

#### Offline Capabilities

| Feature | Offline Behavior |
|---------|------------------|
| View orders | Cached from last sync |
| Scan QR | Works with cached order data |
| Mark picked up | Queued for sync |
| View pick lists | Cached PDFs |
| Process refunds | Queued, processed on reconnect |

#### Sync Behavior

- Auto-sync every 30 seconds when online
- Queue actions when offline
- Show sync status indicator
- Conflict resolution (server wins)

#### Visual Indicators

```
┌─────────────────────────────────────────────────────────────────┐
│ ⚠️ OFFLINE MODE                               Last sync: 2min ago│
│ Changes will sync when connection restored                       │
│ [3 actions pending sync]                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8.3 Progressive Web App (PWA)

**Priority:** P2 | **Complexity:** Medium

**Description:** Install as app on devices.

#### Features

- Add to home screen
- Full-screen mode
- Push notifications
- Offline support via service worker
- Auto-updates

---

## 9. UX Patterns from Related Industries

### 9.1 Restaurant POS Systems

**Source:** [Square](https://squareup.com/us/en/point-of-sale/restaurants), [GoTab](https://gotab.com/latest/best-restaurant-pos-systems-for-us-restaurants-in-2025-expert-reviews-and-gotabs-guide), [Hospitality Technology](https://hospitalitytech.com/pos-software-2025-key-trends-and-features-horizon)

| Pattern | Application to Gather |
|---------|----------------------|
| Kitchen Display System (KDS) | Show orders organized by pickup slot like kitchen tickets |
| Order routing | Route items to appropriate vendors automatically |
| Coursing | Group items by vendor for staged collection |
| Real-time expo management | Central dashboard showing order flow |
| Auto 86 (sold out) | One-tap to mark items unavailable |
| Split-screen views | Order list + active order detail simultaneously |
| Color-coded status | Immediate visual recognition of order states |
| Printer integration | Direct print to kitchen = direct email to vendor |

---

### 9.2 Warehouse Management Systems

**Source:** [Monday.com](https://monday.com/blog/project-management/warehouse-software/), [Deposco](https://deposco.com/blog/best-wms-software-of-2025-complete-guide-to-leading-warehouse-management-solutions/), [SKU Nexus](https://www.skunexus.com/best-warehouse-picking-software)

| Pattern | Application to Gather |
|---------|----------------------|
| Wave picking | Batch orders by pickup window for efficient collection |
| Multi-order picking | Collect for multiple orders in one vendor pass |
| Route optimization | Order pick lists by vendor booth location |
| Barcode validation | QR verification at collection and handoff |
| Pick-to-light | Highlight current item being collected |
| Slotting optimization | Suggest vendor visit order for efficiency |
| Digital checklist | Tap-to-confirm each item packed |
| Exception handling | Clear workflow when item not found |

---

### 9.3 Grocery Curbside/BOPIS

**Source:** [Mercatus](https://www.mercatus.com/fulfillment/), [Wynshop](https://wynshop.com/), [DispatchTrack](https://www.dispatchtrack.com/industries/grocery-delivery)

| Pattern | Application to Gather |
|---------|----------------------|
| Time slot management | Visual queue by pickup window |
| Customer arrival detection | Check-in triggers staff alert |
| Real-time status updates | Customer sees "being packed" → "ready" |
| Multi-zone picking | Staff assigned to vendor zones |
| Personal shopper app | Guided collection workflow |
| Substitution AI | Suggest similar items automatically |
| Contactless handoff | QR confirms without touching |
| Live stock sync | Real-time availability updates |

---

### 9.4 QR Check-in Systems

**Source:** [JoinIt](https://joinit.com/blog/top-qr-code-check-in-systems), [Qtrac](https://qtrac.com/blog/what-to-look-for-in-a-qr-code-check-in-system/), [Skedda](https://www.skedda.com/insights/qr-code-check-in)

| Pattern | Application to Gather |
|---------|----------------------|
| Instant confirmation | Audio + visual feedback within 1 second |
| Queue transparency | Customer knows their position |
| Wait time estimation | "Your order will be ready in ~3 min" |
| Contactless flow | Minimize physical interaction |
| Fallback options | Manual lookup when QR fails |
| Multiple scan devices | Any staff device can process |
| Offline capability | Cache orders for no-wifi scanning |
| Clear signage | Direct customers to correct area |

---

### 9.5 Returns/Refund UX

**Source:** [Baymard](https://baymard.com/blog/order-returns-ecommerce-ux), [ReturnGO](https://returngo.ai/)

| Pattern | Application to Gather |
|---------|----------------------|
| Progress visibility | Staff sees refund progress through stages |
| Quick resolution options | Pre-set refund reasons for speed |
| Customer notification | Auto-email on refund with timeline |
| Partial handling | Refund specific items, not whole order |
| Documentation | Capture reason and notes for review |
| Transparent timeline | Show when refund will process (3-5 days) |

---

## 10. Implementation Recommendations

### 10.1 MVP Build Order

**Month 4 (Operations Sprint)**

| Week | Focus | Features |
|------|-------|----------|
| 1 | Order views | List view, detail view, status management |
| 2 | Pick lists | Generator, print layouts, vendor grouping |
| 3 | Check-in | QR scanner, manual lookup, status update |
| 4 | Issues | Item unavailable, basic refund, notes |

### 10.2 Technical Considerations

| Area | Recommendation |
|------|----------------|
| Real-time | WebSocket for order updates (Pusher, Socket.io) |
| QR Scanning | html5-qrcode or zxing-js library |
| Printing | CSS print media queries + browser print |
| Offline | Service Worker + IndexedDB for order cache |
| Refunds | Stripe Refund API with webhook confirmation |

### 10.3 Testing Focus

| Scenario | Test Approach |
|----------|---------------|
| Spotty wifi | Throttle network, test queuing |
| High volume | Simulate 50+ orders, 20 quick check-ins |
| Edge cases | Duplicate scans, cancelled orders, partial refunds |
| Accessibility | Screen reader, keyboard nav, color contrast |
| Device variety | Test on actual tablets at market conditions |

### 10.4 Staff Training

| Topic | Format |
|-------|--------|
| Basic order flow | 5-min video walkthrough |
| Check-in process | In-person demo on market day |
| Issue handling | Decision tree reference card |
| Offline mode | Printed backup procedures |

---

## Appendix A: Key Measurements

### Success Metrics for Operations Dashboard

| Metric | Target | Measurement |
|--------|--------|-------------|
| Check-in time | <30 seconds | Time from scan to complete |
| Pick list accuracy | 99% | Items matched vs delivered |
| Issue resolution | <15 minutes | Time to close issue |
| Staff satisfaction | 4/5 | Post-season survey |
| Zero lost orders | 100% | All orders accounted for |

### Performance Targets

| Metric | Target |
|--------|--------|
| Page load | <2 seconds |
| QR scan response | <1 second |
| Order sync | <5 seconds |
| Offline function | Essential features work |

---

## Appendix B: Competitive Reference

| Platform | Strengths to Borrow | Gaps to Avoid |
|----------|---------------------|---------------|
| **Square KDS** | Visual order flow, real-time updates, one-tap actions | Over-complexity for simple operations |
| **DoorDash Merchant** | Clean order cards, issue handling, driver communication | Too delivery-focused |
| **Instacart Shopper** | Guided picking, substitution flow, customer chat | Requires constant connectivity |
| **Toast POS** | Kitchen ticket format, coursing, modifier handling | Restaurant-specific terminology |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-07 | Claude (UX Research) | Initial comprehensive spec |

---

*This document should be reviewed with market staff (Carlo) before development to validate workflows and identify missing edge cases.*
