# Gather - Reporting & Analytics Feature Specification

> **Purpose:** Comprehensive reporting and analytics capabilities to measure platform success, enable data-driven decisions, and provide actionable insights to all stakeholders.

---

## Table of Contents

1. [Overview](#overview)
2. [Stakeholder Needs Summary](#stakeholder-needs-summary)
3. [Feature Matrix by Audience](#feature-matrix-by-audience)
   - [Market Operator Reports (Carlo)](#market-operator-reports-carlo)
   - [Vendor Reports](#vendor-reports)
   - [Internal Analytics (Gather Team)](#internal-analytics-gather-team)
   - [Customer Insights](#customer-insights)
4. [MVP vs Phase 2+ Features](#mvp-vs-phase-2-features)
5. [Technical Considerations](#technical-considerations)
6. [Export & Delivery Options](#export--delivery-options)

---

## Overview

Gather's reporting system must serve four distinct audiences with different needs:

| Audience | Primary Goal | Access Method | Frequency |
|----------|--------------|---------------|-----------|
| **Market Operator (Carlo)** | Understand overall market health | Web dashboard | Daily/Weekly |
| **Vendors (70+)** | Know their sales performance | Email/Print (MVP), Portal (P2) | Weekly |
| **Gather Team** | Track business metrics & growth | Admin dashboard | Real-time |
| **Customer Analytics** | Understand shopping behavior | Internal analysis | Weekly/Monthly |

---

## Stakeholder Needs Summary

### Carlo (Market Operator)
- How much money flowed through the platform today/this week/this season?
- Which vendors are performing well vs struggling?
- Are customers coming back?
- How are pickup operations running?
- What should I tell vendors about the value of being online?

### Vendors
- How much did I sell this week?
- What are my top products?
- How does online compare to my in-person sales?
- When should I expect payout?

### Gather Team
- Are we hitting our $50K GMV target?
- Is the platform growing week-over-week?
- Where do customers drop off?
- What's our unit economics (fees collected, margin)?

### Customers (Indirect)
- Order history and receipts
- Spending summary (nice-to-have)

---

## Feature Matrix by Audience

---

## Market Operator Reports (Carlo)

### 1. Executive Dashboard

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-1 | **Daily Sales Summary** | P0 | Low | Total orders, GMV, and avg basket for current/previous day with comparison |
| MO-2 | **Weekly Performance Card** | P0 | Low | Week-to-date GMV, order count, unique customers, and WoW change percentage |
| MO-3 | **Season-to-Date Overview** | P0 | Medium | Cumulative GMV, total orders, unique customers since season start (May) |
| MO-4 | **Month Comparison Chart** | P1 | Medium | Line/bar chart comparing GMV across months (June vs July vs August, etc.) |
| MO-5 | **Year-over-Year Comparison** | P2 | Medium | Compare this season to last season (relevant after Year 2) |
| MO-6 | **Real-Time Order Ticker** | P2 | High | Live feed showing orders as they come in (market day mornings) |

### 2. Vendor Performance Reports

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-7 | **Vendor Leaderboard** | P0 | Low | Ranked list of vendors by GMV for selected period (day/week/month/season) |
| MO-8 | **Vendor Participation Rate** | P0 | Low | X of 70 vendors have products online; X vendors with sales this week |
| MO-9 | **Vendor Comparison Table** | P1 | Medium | Sortable table: vendor name, total sales, order count, avg basket, top product |
| MO-10 | **Zero-Sales Vendor Alert** | P1 | Low | Flag vendors with no sales in past 2 weeks (need attention) |
| MO-11 | **Vendor Growth Trends** | P2 | Medium | Week-over-week sales change per vendor (show who's growing/declining) |
| MO-12 | **Vendor Share of Wallet** | P2 | Medium | What % of total GMV does each vendor represent? Pie chart visualization |

### 3. Product Performance

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-13 | **Top 10 Products** | P0 | Low | Best-selling products by revenue and by units sold |
| MO-14 | **Category Breakdown** | P1 | Medium | GMV and order count by category (Produce, Meat, Dairy, etc.) |
| MO-15 | **Category Trends** | P1 | Medium | How category mix changes week to week (seasonal shifts) |
| MO-16 | **Product Velocity** | P2 | Medium | Items per order average; products added to cart most frequently |
| MO-17 | **Stock-Out Tracking** | P2 | High | Products marked unavailable; missed revenue estimate |
| MO-18 | **Price Point Analysis** | P2 | Medium | Distribution of items by price range; avg price per category |

### 4. Customer Metrics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-19 | **New vs Returning Customers** | P0 | Medium | Unique customers this week; % new vs returning (by email) |
| MO-20 | **Customer Count Growth** | P0 | Low | Running total of unique customers; week-over-week new customer acquisition |
| MO-21 | **Repeat Purchase Rate** | P1 | Medium | % of customers who order again within 30 days |
| MO-22 | **Customer Frequency Distribution** | P1 | Medium | Histogram: 1 order, 2-3 orders, 4-5 orders, 6+ orders |
| MO-23 | **Average Customer Lifetime Value** | P2 | High | Total spend per customer over time; CLV projection |
| MO-24 | **Customer Cohort Analysis** | P2 | High | Track cohorts by signup month; retention curves over time |
| MO-25 | **Geographic Distribution** | P2 | Medium | Customer zip codes on map; identify geographic reach |

### 5. Operations Reports

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-26 | **Pickup Slot Utilization** | P0 | Medium | Orders per time slot; identify popular/underutilized slots |
| MO-27 | **Order Status Summary** | P0 | Low | Count by status: Pending, Packed, Picked Up, Cancelled for current day |
| MO-28 | **Pickup Completion Rate** | P1 | Low | % of orders successfully picked up vs no-shows |
| MO-29 | **Average Pickup Time** | P1 | Medium | Time from customer arrival (QR scan) to completion |
| MO-30 | **Issue Tracking** | P1 | Medium | Count of unavailable items, substitutions, partial refunds |
| MO-31 | **Peak Hour Analysis** | P2 | Medium | When do most orders come in? When are pickups busiest? |
| MO-32 | **Staff Efficiency Metrics** | P2 | High | Orders processed per staff member; check-in speed |

### 6. Financial Reports

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| MO-33 | **GMV Summary** | P0 | Low | Total gross merchandise value for period |
| MO-34 | **Service Fee Revenue** | P0 | Low | Total fees collected (5% or flat fee) |
| MO-35 | **Vendor Payables Summary** | P0 | Medium | Amount owed to each vendor after fees (for manual payout) |
| MO-36 | **Refunds & Adjustments** | P1 | Medium | Total refunds issued; partial credits; cancellations |
| MO-37 | **Net Revenue Calculation** | P1 | Low | GMV - Refunds - Vendor Payments = Net to Market/Gather |
| MO-38 | **Payment Method Breakdown** | P2 | Low | Card vs Apple Pay vs Google Pay usage |
| MO-39 | **Failed Payment Log** | P2 | Medium | Transactions that failed; reasons; retry success rate |
| MO-40 | **Weekly Payout Report** | P1 | Medium | Exportable report for manual vendor payouts (CSV with amounts) |

---

## Vendor Reports

*Note: In MVP, vendors don't log in. Reports delivered via email/print by market staff.*

### 7. Weekly Vendor Sales Report (Email/Print)

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| V-1 | **Weekly Sales Summary** | P0 | Low | Total sales, order count, items sold for the week |
| V-2 | **Top 5 Products** | P0 | Low | Best-selling items by revenue for that vendor |
| V-3 | **Order List** | P0 | Low | List of orders containing their products (order #, date, items, amount) |
| V-4 | **Payout Amount** | P0 | Low | Amount to be paid after platform fee deduction |
| V-5 | **Week-over-Week Change** | P1 | Low | Sales this week vs last week (up/down percentage) |
| V-6 | **Product Performance Table** | P1 | Medium | All products with units sold, revenue, and rank |
| V-7 | **Customer Count** | P1 | Low | Number of unique customers who bought from this vendor |
| V-8 | **Average Basket (Vendor-Specific)** | P1 | Low | Avg spend per order on this vendor's products |
| V-9 | **Season-to-Date Summary** | P2 | Low | Cumulative sales since market season opened |
| V-10 | **Compare to Market Average** | P2 | Medium | How does this vendor compare to avg vendor performance? |

### 8. Vendor Self-Service Dashboard (Phase 2)

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| V-11 | **Real-Time Sales Dashboard** | P2 | High | Live view of today's orders, revenue, items sold |
| V-12 | **Sales Trend Chart** | P2 | Medium | Weekly sales over past 8-12 weeks as line chart |
| V-13 | **Product Analytics** | P2 | Medium | Click-through rates, add-to-cart rates, conversion per product |
| V-14 | **Inventory Performance** | P2 | High | Stock-out frequency; recommend restocking levels |
| V-15 | **Customer Demographics** | P2 | High | Anonymous insights: new vs returning, avg spend |
| V-16 | **Payout History** | P2 | Medium | Log of all payouts with amounts and dates |
| V-17 | **Price Optimization Hints** | P2 | High | Suggestions based on demand elasticity (advanced) |

---

## Internal Analytics (Gather Team)

### 9. Business Health Dashboard

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-1 | **North Star Metric: Monthly GMV** | P0 | Low | Current month GMV vs $50K target; progress bar |
| G-2 | **GMV Trend Line** | P0 | Medium | Daily/weekly GMV over time; identify trends |
| G-3 | **Orders Per Day** | P0 | Low | Order volume trend; identify growth patterns |
| G-4 | **Average Order Value (AOV)** | P0 | Low | Current AOV vs $59 target; trend over time |
| G-5 | **Unique Customers** | P0 | Low | Total unique customers; progress toward 500+ goal |
| G-6 | **Revenue (Platform Fees)** | P0 | Low | Total service fees collected; our actual revenue |
| G-7 | **Week-over-Week Growth** | P0 | Low | WoW % change in GMV, orders, customers |

### 10. Funnel Analytics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-8 | **Full Funnel Visualization** | P0 | High | Homepage -> Product View -> Add to Cart -> Checkout -> Complete |
| G-9 | **Homepage to Product View Rate** | P0 | Medium | Target: >40% |
| G-10 | **Product View to Add to Cart** | P0 | Medium | Target: >10% |
| G-11 | **Add to Cart to Checkout** | P0 | Medium | Target: >60% |
| G-12 | **Checkout to Complete** | P0 | Medium | Target: >85% |
| G-13 | **Cart Abandonment Rate** | P1 | Medium | % of carts created but not converted |
| G-14 | **Abandonment by Stage** | P1 | High | Where in checkout do people drop off? |
| G-15 | **Abandonment Recovery** | P2 | High | Track customers who abandon then return later |

### 11. Customer Acquisition & Retention

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-16 | **Weekly New Customer Count** | P0 | Low | First-time purchasers per week |
| G-17 | **30-Day Repeat Rate** | P0 | Medium | % of customers who order again within 30 days; target: 40% |
| G-18 | **Cohort Retention Table** | P1 | High | Grid showing retention by signup week over time |
| G-19 | **Customer Acquisition Source** | P2 | High | How did customers find us? (UTM tracking) |
| G-20 | **Referral Tracking** | P2 | High | Track referral codes; identify word-of-mouth |
| G-21 | **Reactivation Rate** | P2 | Medium | Customers who return after 60+ days of inactivity |

### 12. Platform Performance

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-22 | **Page Load Time** | P1 | Medium | Average load time for key pages |
| G-23 | **Error Rate** | P1 | Medium | % of sessions with errors; error log |
| G-24 | **Payment Success Rate** | P1 | Low | Successful vs failed payment attempts |
| G-25 | **QR Scan Success Rate** | P1 | Low | % of QR scans that work first try |
| G-26 | **Mobile vs Desktop Usage** | P1 | Low | Device breakdown; validate mobile-first strategy |
| G-27 | **Browser/OS Distribution** | P2 | Low | Identify any browser-specific issues |
| G-28 | **API Latency Monitoring** | P2 | High | Response times for critical endpoints |

### 13. Operational Efficiency

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-29 | **Pick List Accuracy** | P1 | Medium | % of orders fulfilled without issues |
| G-30 | **Substitution Rate** | P1 | Low | % of orders with substituted items |
| G-31 | **Cancellation Rate** | P1 | Low | % of orders cancelled; reasons breakdown |
| G-32 | **Refund Rate** | P1 | Low | % of GMV refunded; by reason |
| G-33 | **Time to Pack** | P2 | High | Average time from order to "packed" status |
| G-34 | **Customer Wait Time** | P2 | High | Average time customers wait after QR scan |

### 14. Market Expansion Readiness (Phase 2+)

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| G-35 | **Per-Market Comparison** | P2 | High | Compare metrics across multiple markets |
| G-36 | **Market Onboarding Progress** | P2 | Medium | Track new market setup milestones |
| G-37 | **Vendor Density Analysis** | P2 | Medium | Products/vendors per category; identify gaps |
| G-38 | **Market Saturation Metrics** | P2 | High | Penetration rate vs total market visitors |

---

## Customer Insights

### 15. Shopping Behavior Analytics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| C-1 | **Basket Composition** | P1 | Medium | Average items per order; common product combinations |
| C-2 | **Category Preferences** | P1 | Medium | Which categories dominate shopping carts? |
| C-3 | **Multi-Vendor Orders** | P1 | Low | % of orders from 1 vendor vs 2-3 vs 4+ vendors |
| C-4 | **Browse vs Buy** | P2 | High | Products viewed but not purchased (demand signals) |
| C-5 | **Search Analytics** | P2 | Medium | Top search terms; searches with no results |
| C-6 | **Filter Usage** | P2 | Medium | Which filters are used most? (dietary, vendor, price) |
| C-7 | **Time to Purchase** | P2 | High | Average time from first visit to first order |
| C-8 | **Session Depth** | P2 | Medium | Pages per session; time on site |

### 16. Customer Segmentation

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| C-9 | **High-Value Customers** | P1 | Medium | Top 10% by spend; VIP identification |
| C-10 | **At-Risk Customers** | P2 | High | Customers who haven't ordered in 30+ days |
| C-11 | **Category Affinity Segments** | P2 | High | Produce lovers, meat buyers, prepared food fans |
| C-12 | **Spending Tier Distribution** | P2 | Medium | Under $30, $30-60, $60-100, $100+ order breakdown |
| C-13 | **Pickup Behavior** | P2 | Medium | Early vs on-time vs late pickup patterns |

### 17. Customer Communication Analytics

| ID | Feature | Priority | Complexity | Description |
|----|---------|----------|------------|-------------|
| C-14 | **Email Open Rate** | P2 | Low | Confirmation email opens (via Resend) |
| C-15 | **Email Click Rate** | P2 | Low | Clicks on "View Order" or "Add to Calendar" |
| C-16 | **SMS Delivery Rate** | P2 | Low | Reminder SMS delivery/failure (if SMS enabled) |
| C-17 | **Unsubscribe Rate** | P2 | Low | Track opt-outs for marketing compliance |

---

## MVP vs Phase 2+ Features

### MVP-Essential (P0) - Launch Requirements

| Category | Features |
|----------|----------|
| **Market Operator** | Daily/weekly sales summary, vendor leaderboard, top products, new vs returning customers, pickup slot utilization, GMV summary, service fee revenue, vendor payables |
| **Vendor** | Weekly sales report (email/print), top products, order list, payout amount |
| **Internal** | North Star GMV tracking, funnel visualization, basic conversion rates, AOV, unique customers |
| **Export** | CSV export for all reports, PDF for vendor summaries |

### Phase 1.5 (P1) - Quick Wins After Launch

| Category | Features |
|----------|----------|
| **Market Operator** | Vendor comparison table, category breakdown, repeat purchase rate, pickup completion rate, issue tracking, refunds report |
| **Vendor** | Week-over-week change, product performance table, season-to-date |
| **Internal** | Cohort retention, cart abandonment, pick list accuracy, cancellation/refund rates |
| **Customer** | Basket composition, category preferences, multi-vendor order analysis |

### Phase 2+ (P2) - Scale & Sophistication

| Category | Features |
|----------|----------|
| **Market Operator** | YoY comparison, real-time ticker, vendor growth trends, CLV, geographic distribution, staff efficiency |
| **Vendor** | Self-service dashboard, real-time sales, price optimization |
| **Internal** | Acquisition source tracking, referrals, reactivation, API monitoring, multi-market comparison |
| **Customer** | Segmentation, at-risk identification, search/filter analytics |

---

## Technical Considerations

### Data Infrastructure

```
Event Tracking (Mixpanel/PostHog)
├── Page views with timestamps
├── Product interactions (view, add, remove)
├── Checkout funnel events
├── Search queries
└── Filter usage

Database Aggregations (PostgreSQL)
├── Pre-computed daily/weekly rollups
├── Materialized views for dashboards
├── Indexed queries for real-time data
└── Historical snapshots for trends

Caching Layer (Redis/Vercel KV)
├── Dashboard data (5-15 min cache)
├── Expensive aggregations
└── Rate limiting for exports
```

### Report Generation Architecture

```
Real-Time Reports
├── Query database directly
├── Lightweight aggregations
└── <5 second response time

Scheduled Reports
├── Background jobs (Vercel Cron)
├── Pre-compute expensive metrics
├── Email delivery (Resend)
└── PDF generation (React-PDF or Puppeteer)

Export Jobs
├── Async generation for large datasets
├── Signed URL download links
├── CSV and PDF formats
└── 24-hour expiry
```

### Dashboard Technology

| Component | Recommendation | Rationale |
|-----------|----------------|-----------|
| Charts | Recharts or Tremor | React-native, good Next.js support |
| Tables | TanStack Table | Sorting, filtering, export built-in |
| Date Pickers | date-fns + shadcn | Consistent with design system |
| PDF Export | react-pdf | Server-side PDF generation |
| CSV Export | papaparse | Client-side CSV creation |

---

## Export & Delivery Options

### Export Formats

| Format | Use Case | Implementation |
|--------|----------|----------------|
| **CSV** | Data analysis, vendor payouts, accounting | All reports |
| **PDF** | Printable summaries, vendor handouts | Weekly summaries, pick lists |
| **Excel** | Complex analysis with formulas | P2 - xlsx export |
| **JSON** | API integrations | P2 - for multi-market |

### Delivery Methods

| Method | Audience | Timing |
|--------|----------|--------|
| **Dashboard** | Market operator, Gather team | Real-time access |
| **Scheduled Email** | Vendors (MVP), all users (P2) | Weekly on Sunday/Monday |
| **On-Demand Email** | Any user | Self-serve export & email |
| **Print** | Vendors, operations | Pick lists, vendor summaries |
| **Push Notification** | Staff | Real-time alerts (P2 mobile) |

### Scheduled Report Cadence

| Report | Recipient | Frequency | Day/Time |
|--------|-----------|-----------|----------|
| Weekly Vendor Summary | Each vendor (via email) | Weekly | Sunday 6pm |
| Market Weekly Digest | Carlo | Weekly | Sunday 8pm |
| Gather Team Metrics | Internal | Weekly | Monday 9am |
| End-of-Season Report | All stakeholders | Once | After last market |

---

## Success Metrics for Analytics System

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | <2 seconds | 95th percentile |
| Report generation time | <10 seconds | PDF/CSV exports |
| Data freshness | <15 minutes | Time since last update |
| Report email delivery | >99% | Resend delivery rate |
| User adoption | 80% weekly login | Carlo accesses dashboard |
| Vendor satisfaction | 4.5/5 | Survey on report usefulness |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-26 | PM Analysis | Initial comprehensive feature list |

---

## Appendix A: Report Mockup References

### Daily Summary Card (MVP)
```
┌────────────────────────────────────────┐
│  TODAY: Saturday, June 7              │
├────────────────────────────────────────┤
│  Orders: 47          GMV: $2,832      │
│  Avg Basket: $60.26  Customers: 41    │
│                                        │
│  vs Last Saturday:                    │
│  Orders: +12%  GMV: +18%              │
└────────────────────────────────────────┘
```

### Vendor Leaderboard (MVP)
```
┌────────────────────────────────────────┐
│  TOP VENDORS THIS WEEK                 │
├────────────────────────────────────────┤
│  1. Mitchell Farm         $1,247      │
│  2. Sunrise Dairy          $892       │
│  3. Berwyn Bakery          $756       │
│  4. Green Valley Produce   $623       │
│  5. Happy Hen Farm         $545       │
└────────────────────────────────────────┘
```

### Funnel Visualization (MVP)
```
┌────────────────────────────────────────┐
│  CONVERSION FUNNEL - This Week        │
├────────────────────────────────────────┤
│  Homepage Visits     1,200   (100%)   │
│         ↓                              │
│  Product Views         576   (48%)    │
│         ↓                              │
│  Add to Cart          120   (10%)     │
│         ↓                              │
│  Checkout Start        84   (70%)     │
│         ↓                              │
│  Order Complete        72   (86%)     │
└────────────────────────────────────────┘
```

---

*This document should be reviewed alongside PRD.md to ensure alignment with overall product strategy.*
