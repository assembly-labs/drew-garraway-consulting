# Gather - Payments and Vendor Payout System

> **Comprehensive feature specification for multi-vendor marketplace payments**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Platform Recommendation: Stripe Connect](#platform-recommendation-stripe-connect)
3. [Feature Inventory by Flow](#feature-inventory-by-flow)
   - [Customer Checkout](#1-customer-checkout)
   - [Payment Processing](#2-payment-processing)
   - [Fee Calculation](#3-fee-calculation)
   - [Vendor Payouts](#4-vendor-payouts)
   - [Refunds and Cancellations](#5-refunds-and-cancellations)
   - [Disputes and Chargebacks](#6-disputes-and-chargebacks)
   - [Reporting and Analytics](#7-reporting-and-analytics)
   - [Tax and Compliance](#8-tax-and-compliance)
   - [Security and Fraud Prevention](#9-security-and-fraud-prevention)
4. [MVP vs Nice-to-Have Summary](#mvp-vs-nice-to-have-summary)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Fee Structure Recommendations](#fee-structure-recommendations)
7. [Technical Architecture](#technical-architecture)
8. [Open Questions](#open-questions)
9. [Sources](#sources)

---

## Executive Summary

Gather operates as a multi-vendor marketplace where customers purchase from multiple vendors (70+ at Berwyn) in a single transaction. The payment system must:

1. **Accept a single payment** from the customer
2. **Split funds** across multiple vendors based on their items
3. **Deduct platform fees** (market's commission)
4. **Pay vendors** on a weekly schedule after market day
5. **Handle refunds, substitutions, and disputes** gracefully
6. **Report taxes** (1099-K) for vendors exceeding thresholds

### Key Constraints

| Constraint | Implication |
|------------|-------------|
| 70+ vendors | Must automate onboarding and payouts |
| Weekly payouts after market day | Need to hold funds until pickup confirmed |
| Pickup-only model | Refunds tied to fulfillment status |
| MVP focus | Start simple, add complexity later |

---

## Platform Recommendation: Stripe Connect

### Why Stripe Connect?

After researching Stripe Connect, PayPal for Marketplaces, and other solutions, **Stripe Connect with Express accounts** is the recommended approach for Gather.

| Factor | Stripe Connect | PayPal Marketplaces |
|--------|----------------|---------------------|
| **Multi-vendor split payments** | Native support | Native support |
| **Vendor onboarding** | Stripe-hosted (Express) | Self-managed |
| **Dashboard for vendors** | Express Dashboard (limited) | Full PayPal |
| **Payout flexibility** | Daily/weekly/manual | Immediate/delayed |
| **1099-K reporting** | Built-in | Built-in |
| **Apple Pay / Google Pay** | Native | Limited |
| **Pricing** | 2.9% + $0.30 + $0.25/payout | Similar |
| **Developer experience** | Excellent | Good |
| **Market fit** | Used by DoorDash, Lyft, Instacart | More retail-focused |

### Recommended Account Type: Express

| Account Type | Control | Onboarding | Dashboard | Best For |
|--------------|---------|------------|-----------|----------|
| **Standard** | User owns | User self-manages | Full Stripe | SaaS platforms |
| **Express** | Shared | Stripe-hosted | Limited | **Marketplaces** |
| **Custom** | Platform owns | Platform-managed | None | White-label |

**Express accounts** are ideal for Gather because:
- Stripe handles KYC/identity verification
- Vendors get a simple dashboard to see payouts
- Platform controls payout timing (weekly after market)
- Lower integration complexity than Custom
- $2/active account/month + 0.25% per payout fee is acceptable

---

## Feature Inventory by Flow

### 1. Customer Checkout

#### Payment Method Support

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Credit/Debit Cards | P0 | Low | Accept Visa, Mastercard, Amex, Discover via Stripe Elements | Yes |
| Apple Pay | P0 | Low | One-tap checkout on iOS/Safari with Payment Request API | Yes |
| Google Pay | P0 | Low | One-tap checkout on Android/Chrome with Payment Request API | Yes |
| Guest Checkout | P0 | Low | No account required; email only for order confirmation | Yes |
| Saved Payment Methods | P2 | Medium | Store cards securely for returning customers (Stripe tokens) | No |
| Buy Now Pay Later (Affirm/Klarna) | P2 | Medium | Installment payments for larger orders | No |
| Link by Stripe | P1 | Low | One-click checkout for Stripe Link users | No |
| ACH Bank Transfers | P2 | Medium | Lower-fee option for high-value orders | No |

#### Checkout UX Features

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Unified Cart Checkout | P0 | Medium | Single payment for items from multiple vendors | Yes |
| Real-time Price Calculation | P0 | Low | Subtotal, fees, and total update as cart changes | Yes |
| Order Summary Review | P0 | Low | Clear breakdown of items, vendors, quantities before payment | Yes |
| Pickup Time Selection | P0 | Low | Choose time slot during checkout | Yes |
| Special Instructions Field | P1 | Low | Optional notes for pickup/substitutions | Yes |
| Promo Code / Discount Entry | P1 | Medium | Apply coupon codes at checkout | No |
| Cart Abandonment Recovery | P2 | Medium | Email reminders for incomplete checkouts | No |
| Order Minimum Enforcement | P1 | Low | Require minimum order amount (e.g., $15) to checkout | Yes |
| Real-time Inventory Check | P0 | Medium | Validate items still available before payment | Yes |
| Card Validation (Luhn check) | P0 | Low | Basic card number validation before submission | Yes |
| Address Autocomplete | P2 | Low | For future delivery; not needed for pickup MVP | No |

#### Payment Security

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| PCI-DSS Compliance | P0 | Low | Stripe Elements handles all card data; Gather never sees raw card numbers | Yes |
| 3D Secure 2.0 | P0 | Low | Strong Customer Authentication for fraud prevention (Stripe handles) | Yes |
| CVV Verification | P0 | Low | Require CVV for all card transactions | Yes |
| Address Verification (AVS) | P1 | Low | Verify billing address matches card | Yes |
| Velocity Checks | P1 | Medium | Limit transactions per card/email in time window | No |

---

### 2. Payment Processing

#### Core Processing

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Payment Intent Creation | P0 | Medium | Create Stripe PaymentIntent with split payment data | Yes |
| Payment Confirmation | P0 | Low | Handle successful payment and update order status | Yes |
| Payment Failure Handling | P0 | Medium | Display clear errors; allow retry without losing cart | Yes |
| Idempotency Keys | P0 | Low | Prevent duplicate charges on network issues | Yes |
| Webhook Integration | P0 | Medium | Listen to Stripe webhooks for payment status updates | Yes |
| Payment Metadata | P0 | Low | Store order ID, vendor IDs, item IDs in payment metadata | Yes |
| Multi-currency Support | P2 | Medium | Accept payments in currencies other than USD | No |

#### Authorization and Capture

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Immediate Capture | P0 | Low | Capture payment immediately on checkout | Yes |
| Auth-only / Delayed Capture | P2 | Medium | Authorize at checkout, capture at pickup (reduces refund friction) | No |
| Authorization Holds | P2 | Medium | Place hold on card; adjust final amount based on substitutions | No |

#### Payment Recovery

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Retry Failed Payments | P0 | Low | Allow customer to retry with same or different card | Yes |
| Card Update Notifications | P2 | Medium | Notify customers when saved cards expire | No |
| Dunning Management | P2 | High | Automated retry sequences for failed recurring payments | No |

---

### 3. Fee Calculation

#### Platform Fee Structure

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Percentage-based Commission | P0 | Low | Take X% of each vendor's subtotal (e.g., 10%) | Yes |
| Flat Per-Order Fee | P1 | Low | Add flat fee per order (e.g., $2.00 service fee) | Yes |
| Hybrid Fee (% + flat) | P1 | Low | Combine percentage and flat fee | No |
| Tiered Commission Rates | P2 | Medium | Different rates based on vendor volume or category | No |
| Promotional Fee Waivers | P2 | Medium | Temporarily reduce fees for new vendors or promotions | No |
| Category-based Fees | P2 | Medium | Different commission rates by product category | No |

#### Fee Display and Transparency

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Itemized Fee Display | P0 | Low | Show service fee as separate line item at checkout | Yes |
| Fee Breakdown in Receipts | P0 | Low | Include fee breakdown in order confirmation email | Yes |
| Vendor Fee Visibility | P1 | Low | Show vendors their commission rate in dashboard | No |
| Fee Calculator for Vendors | P2 | Low | Tool for vendors to estimate earnings after fees | No |

#### Payment Processing Fee Handling

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Stripe Fee Pass-through | P1 | Low | Decide who absorbs payment processing fees (platform vs vendor) | Yes |
| Net Revenue Calculation | P0 | Medium | Calculate vendor earnings after platform + Stripe fees | Yes |
| Fee Reconciliation | P1 | Medium | Track fees collected vs fees owed in reporting | No |

---

### 4. Vendor Payouts

#### Vendor Onboarding

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Stripe Express Onboarding | P0 | Medium | Vendors complete Stripe-hosted onboarding flow | Yes |
| Bank Account Verification | P0 | Low | Stripe verifies vendor bank accounts (micro-deposits or instant) | Yes |
| Identity Verification (KYC) | P0 | Low | Stripe collects SSN/EIN and verifies identity | Yes |
| Onboarding Status Tracking | P0 | Low | Track which vendors have completed onboarding | Yes |
| Onboarding Reminders | P1 | Low | Email vendors who haven't completed onboarding | No |
| Debit Card Payout Option | P1 | Low | Allow vendors to receive payouts to debit cards | No |
| Multiple Bank Accounts | P2 | Medium | Vendors can switch between bank accounts | No |

#### Payout Scheduling

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Weekly Payout Schedule | P0 | Medium | Process payouts every Monday for prior week's sales | Yes |
| Configurable Payout Day | P1 | Low | Admin can set which day of week payouts process | No |
| Hold Period Configuration | P0 | Low | Hold funds for X days after pickup before payout eligibility | Yes |
| Manual Payout Trigger | P1 | Medium | Admin can manually trigger payouts for specific vendors | No |
| Minimum Payout Threshold | P1 | Low | Only pay out if balance exceeds minimum (e.g., $25) | No |
| Payout Batching | P0 | Medium | Batch all vendor payouts for efficiency | Yes |

#### Payout Methods

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Standard Bank Transfer (ACH) | P0 | Low | 1-2 business day payout to bank account | Yes |
| Instant Payouts | P2 | Low | Immediate payout to debit card (1% fee) | No |
| Manual Check Payments | P2 | High | Paper checks for vendors without bank accounts | No |

#### Payout Notifications

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Payout Confirmation Email | P0 | Low | Email vendor when payout is initiated | Yes |
| Payout Arrival Notification | P1 | Low | Email when payout arrives (via Stripe webhook) | No |
| Payout Schedule Reminders | P2 | Low | Remind vendors of upcoming payout dates | No |
| Payout Failure Alerts | P0 | Low | Alert vendor and admin if payout fails | Yes |

#### Payout Calculation

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Order-level Split Calculation | P0 | Medium | Calculate each vendor's share of multi-vendor orders | Yes |
| Platform Fee Deduction | P0 | Low | Deduct platform commission before vendor payout | Yes |
| Refund Adjustment | P0 | Medium | Reduce payout if items were refunded | Yes |
| Dispute Reserve | P2 | High | Hold back percentage for potential chargebacks | No |
| Negative Balance Handling | P1 | Medium | Carry forward negative balance from refunds to next payout | No |
| Tip Distribution | P2 | Medium | Distribute customer tips to vendors or staff | No |

---

### 5. Refunds and Cancellations

#### Customer-Initiated Refunds

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Full Order Refund | P0 | Medium | Cancel entire order and refund full amount | Yes |
| Partial Order Refund | P0 | High | Refund specific items from multi-vendor order | Yes |
| Item-level Refunds | P0 | High | Refund individual items while keeping rest of order | Yes |
| Refund to Original Payment | P0 | Low | Refund back to card used for purchase | Yes |
| Store Credit Option | P2 | Medium | Offer store credit instead of card refund | No |
| Refund Request Window | P1 | Low | Allow refund requests only within X hours of pickup | Yes |

#### Staff/Admin-Initiated Refunds

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Unavailable Item Refund | P0 | Medium | Automatically refund items marked as unavailable | Yes |
| Substitution Price Adjustment | P1 | High | Adjust charge if substitution differs in price | No |
| Service Recovery Refund | P1 | Low | Issue goodwill refunds for poor experience | No |
| Batch Refund Processing | P2 | Medium | Process multiple refunds at once | No |

#### Refund Workflow

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Refund Reason Codes | P1 | Low | Categorize refund reasons for reporting | No |
| Refund Approval Workflow | P2 | Medium | Require admin approval for refunds over threshold | No |
| Automatic Refund Rules | P2 | High | Auto-refund for certain conditions (e.g., no-show vendor) | No |
| Refund Impact on Payout | P0 | Medium | Deduct refunded amounts from vendor's pending payout | Yes |

#### Refund Notifications

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Customer Refund Email | P0 | Low | Notify customer when refund is processed | Yes |
| Vendor Refund Notification | P1 | Low | Notify vendor when their item is refunded | Yes |
| Refund Timeline Display | P1 | Low | Show customer expected refund processing time (3-5 days) | Yes |

#### Cancellations

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Customer Self-Cancel | P1 | Medium | Allow customers to cancel order before cutoff time | Yes |
| Order Cutoff Enforcement | P0 | Low | Prevent cancellations after Friday 8pm (or configured time) | Yes |
| Vendor-Initiated Cancel | P1 | Medium | Allow vendors to request order cancellation | No |
| Cancellation Fees | P2 | Medium | Charge fee for late cancellations | No |
| No-Show Handling | P1 | Medium | Process unclaimed orders after pickup window closes | No |

---

### 6. Disputes and Chargebacks

#### Chargeback Handling

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Chargeback Notification | P0 | Low | Receive Stripe webhook on chargeback initiation | Yes |
| Chargeback Evidence Collection | P0 | Medium | Gather order details, pickup confirmation, QR scan for dispute | Yes |
| Evidence Submission | P0 | Medium | Submit evidence to Stripe for dispute response | Yes |
| Chargeback Dashboard | P1 | Medium | Admin view of all open disputes and their status | No |
| Dispute Resolution Timeline | P1 | Low | Track dispute deadlines and required actions | No |

#### Liability Assignment

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Platform-Absorbed Chargebacks | P1 | Low | Platform absorbs chargeback costs (simplest for vendors) | Yes |
| Vendor Chargeback Pass-through | P2 | High | Deduct chargeback costs from vendor payouts | No |
| Chargeback Reserve Fund | P2 | High | Hold percentage of payouts to cover potential chargebacks | No |
| Vendor Dispute Appeals | P2 | Medium | Allow vendors to appeal chargeback responsibility | No |

#### Dispute Prevention

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Clear Billing Descriptor | P0 | Low | Show "GATHER MARKET" on card statements | Yes |
| Order Confirmation Proof | P0 | Low | Store confirmation emails as evidence | Yes |
| QR Code Pickup Proof | P0 | Low | Log pickup confirmation as delivery proof | Yes |
| Customer Communication Logs | P1 | Medium | Store all customer communications for disputes | No |
| Fraud Detection Alerts | P2 | High | Flag suspicious orders before fulfillment | No |

---

### 7. Reporting and Analytics

#### Customer-Facing Reports

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Order History | P1 | Low | Customers can view past orders (if logged in) | No |
| Order Receipt/Invoice | P0 | Low | Downloadable PDF receipt per order | Yes |
| Order Status Tracking | P0 | Low | View current order status (pending, ready, picked up) | Yes |

#### Vendor-Facing Reports

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Earnings Dashboard | P1 | Medium | Vendor sees total earnings, pending payouts | No |
| Payout History | P1 | Low | List of all past payouts with details | No |
| Sales by Product | P2 | Medium | Breakdown of sales by individual product | No |
| Order History | P1 | Medium | Vendor sees all their fulfilled orders | No |
| Earnings Export (CSV) | P2 | Low | Download earnings data for vendor's records | No |
| Performance Comparison | P2 | High | Compare sales to market averages | No |
| Stripe Express Dashboard | P0 | Low | Vendors access Stripe's built-in dashboard for payout details | Yes |

#### Market Operator Reports

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| GMV Dashboard | P0 | Medium | Total gross merchandise value by period | Yes |
| Commission Earnings Report | P0 | Medium | Platform revenue from fees | Yes |
| Order Volume Report | P0 | Low | Orders by day/week/month | Yes |
| Revenue by Vendor | P1 | Medium | Sales breakdown by vendor | No |
| Payout Summary | P0 | Low | Total payouts made, pending, failed | Yes |
| Refund Summary | P1 | Low | Total refunds by reason and vendor | No |
| Chargeback Report | P1 | Low | Dispute outcomes and financial impact | No |
| Customer Acquisition Report | P2 | Medium | New vs returning customers | No |
| Basket Size Analysis | P1 | Low | Average order value trends | No |
| Category Performance | P2 | Medium | Sales by product category | No |
| Export All Data (CSV) | P1 | Low | Export transactions for accounting | Yes |

#### Financial Reconciliation

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Payment-to-Payout Reconciliation | P1 | High | Match customer payments to vendor payouts | No |
| Fee Reconciliation | P1 | Medium | Verify fees collected match expected | No |
| Stripe Balance Reconciliation | P1 | Medium | Match Stripe balance to expected amounts | No |
| Accounting Integration | P2 | High | Export to QuickBooks, Xero, etc. | No |

---

### 8. Tax and Compliance

#### 1099-K Reporting

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Vendor Tax ID Collection | P0 | Low | Collect SSN/EIN during vendor onboarding | Yes |
| 1099-K Threshold Tracking | P0 | Medium | Track vendor earnings against $20K/200 transaction threshold | Yes |
| Automatic 1099-K Filing | P1 | Low | Stripe handles 1099-K generation and filing | Yes |
| 1099-K Preview for Vendors | P2 | Medium | Show vendors their YTD earnings for tax planning | No |
| Tax Form Delivery | P0 | Low | Stripe delivers 1099-K to qualifying vendors | Yes |

#### Sales Tax

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Sales Tax Calculation | P1 | Medium | Calculate sales tax based on market location | No |
| Sales Tax Collection | P1 | Medium | Collect sales tax at checkout | No |
| Tax-Exempt Products | P2 | Medium | Mark certain products (produce) as tax-exempt | No |
| Sales Tax Remittance | P2 | High | File and remit collected sales tax to state | No |
| Integration with Tax Services | P2 | Medium | Connect to TaxJar or Avalara | No |

#### Compliance

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Terms of Service Acceptance | P0 | Low | Require vendor agreement to marketplace terms | Yes |
| Payment Terms Documentation | P0 | Low | Clear documentation of fee and payout policies | Yes |
| Audit Trail | P1 | Medium | Complete log of all financial transactions | No |
| Data Retention Policy | P1 | Low | Store financial records for required period (7 years) | No |

---

### 9. Security and Fraud Prevention

#### Payment Security

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Stripe Radar (Fraud Detection) | P0 | Low | Built-in machine learning fraud detection | Yes |
| Manual Review Queue | P2 | High | Flag suspicious orders for manual review | No |
| Card Testing Prevention | P1 | Medium | Detect and block card testing attacks | Yes |
| IP-based Risk Scoring | P2 | Medium | Factor location into fraud scoring | No |
| Device Fingerprinting | P2 | High | Track devices for repeat fraud attempts | No |

#### Account Security

| Feature | Priority | Complexity | Description | MVP |
|---------|----------|------------|-------------|-----|
| Staff Access Controls | P1 | Medium | Role-based access to financial data and actions | No |
| Payout Authorization | P2 | Medium | Require approval for payouts over threshold | No |
| Activity Logging | P0 | Low | Log all admin actions on payments and payouts | Yes |
| Two-Factor for Admin | P1 | Low | Require 2FA for admin access to payment settings | No |

---

## MVP vs Nice-to-Have Summary

### MVP Essential (P0)

These features are required for launch:

| Area | Feature |
|------|---------|
| **Checkout** | Card payments, Apple Pay, Google Pay, guest checkout |
| **Processing** | Single payment for multi-vendor cart, Stripe integration |
| **Fees** | Percentage commission, fee display at checkout |
| **Payouts** | Stripe Express onboarding, weekly ACH payouts |
| **Refunds** | Full and partial refunds, item-level refunds |
| **Disputes** | Chargeback notification, evidence submission |
| **Reporting** | Basic GMV, orders, payout summary |
| **Tax** | Vendor tax ID collection, 1099-K via Stripe |
| **Security** | PCI compliance via Stripe, fraud detection |

### Post-MVP (P1)

Add after initial launch:

- Saved payment methods
- Link by Stripe (faster checkout)
- Promo codes/discounts
- Order minimum enforcement
- Manual payout triggers
- Vendor earnings dashboard
- Refund reason tracking
- Vendor-facing order history

### Future (P2)

Long-term roadmap:

- BNPL (Affirm/Klarna)
- Instant payouts
- Tiered commission rates
- Negative balance handling
- Store credit system
- Advanced fraud prevention
- Accounting integrations
- Multi-currency support

---

## Implementation Roadmap

### Phase 1: Foundation (Month 3 of MVP)

**Goal:** Accept payments, hold funds

| Week | Deliverables |
|------|--------------|
| 1 | Stripe account setup, API keys, webhook endpoints |
| 2 | Stripe Elements integration (card input) |
| 3 | Apple Pay / Google Pay setup |
| 4 | PaymentIntent creation with multi-vendor split data |

### Phase 2: Vendor Setup (Month 3-4)

**Goal:** Onboard vendors to Stripe Connect

| Week | Deliverables |
|------|--------------|
| 5 | Stripe Connect Express account creation flow |
| 6 | Vendor onboarding UI and status tracking |
| 7 | Bank account verification handling |
| 8 | Admin view of vendor onboarding status |

### Phase 3: Payout System (Month 4)

**Goal:** Pay vendors weekly

| Week | Deliverables |
|------|--------------|
| 9 | Payout calculation logic (vendor share - commission) |
| 10 | Weekly payout job (cron or Vercel Cron) |
| 11 | Payout notifications (email to vendors) |
| 12 | Payout dashboard for admin |

### Phase 4: Refunds & Disputes (Month 5)

**Goal:** Handle exceptions gracefully

| Week | Deliverables |
|------|--------------|
| 13 | Full order refund flow |
| 14 | Partial/item-level refund flow |
| 15 | Refund impact on pending payouts |
| 16 | Chargeback handling and evidence collection |

### Phase 5: Reporting & Tax (Month 5-6)

**Goal:** Financial visibility and compliance

| Week | Deliverables |
|------|--------------|
| 17 | Basic GMV and order reporting |
| 18 | Commission earnings report |
| 19 | Payout history and reconciliation |
| 20 | 1099-K threshold tracking, Stripe tax integration |

---

## Fee Structure Recommendations

### Recommended: Hybrid Model

Based on industry research and Gather's context:

```
Platform Fee = 8% of vendor subtotal + $1.50 flat per order
```

**Rationale:**
- 8% is competitive (Amazon charges 8-15%, Instacart effective rate ~10%)
- Flat fee covers fixed costs (payment processing, pickup operations)
- Transparent and simple to explain

### Example Calculation

| Order | Customer Pays | Vendors Receive | Platform Earns |
|-------|---------------|-----------------|----------------|
| $50 order (3 vendors) | $50 + $1.50 = **$51.50** | $50 - ($4.00 commission) = **$46.00** | $4.00 + $1.50 = **$5.50** |
| Stripe fees (2.9% + $0.30) | | | -$1.79 |
| **Net platform revenue** | | | **$3.71** |

### Alternative Models Considered

| Model | Pros | Cons |
|-------|------|------|
| **Percentage only (12%)** | Simple | High % feels aggressive |
| **Flat only ($3)** | Predictable | Punishes small orders |
| **Tiered by volume** | Rewards growth | Complex to explain |
| **Free for vendors** | Easy onboarding | Not sustainable |

### Who Pays Stripe Fees?

**Recommendation:** Platform absorbs Stripe processing fees

- Simpler vendor payout calculation
- Standard practice for marketplaces
- Build fee structure to account for it

---

## Technical Architecture

### Payment Flow Diagram

```
Customer Checkout
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                    Stripe Payment                         │
│  ┌────────────────┐                                       │
│  │ PaymentIntent  │ ◄── Cart items, vendor splits,       │
│  │   $51.50       │     platform fee, customer email     │
│  └───────┬────────┘                                       │
│          │                                                │
│          ▼                                                │
│  ┌────────────────────────────────────────┐               │
│  │         Stripe Connect Transfers       │               │
│  │  ┌──────────┐ ┌──────────┐ ┌────────┐ │               │
│  │  │ Vendor A │ │ Vendor B │ │ Vendor │ │               │
│  │  │  $15.00  │ │  $22.00  │ │  $9.00 │ │               │
│  │  └──────────┘ └──────────┘ └────────┘ │               │
│  └────────────────────────────────────────┘               │
│                                                           │
│  Platform Account: $5.50 (fee revenue)                   │
└──────────────────────────────────────────────────────────┘
       │
       ▼
  Weekly Payout Job
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                 Vendor Payouts (ACH)                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Vendor A: $145.00 (week's earnings - refunds)    │    │
│  │ Vendor B: $312.00                                 │    │
│  │ Vendor C: $89.00                                  │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Database Schema Additions

```sql
-- Vendor payment account
CREATE TABLE vendor_stripe_accounts (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  stripe_account_id TEXT UNIQUE, -- acct_xxx
  onboarding_status TEXT, -- pending, complete, restricted
  payouts_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Payment records
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INTEGER,
  platform_fee_cents INTEGER,
  stripe_fee_cents INTEGER,
  status TEXT, -- pending, succeeded, failed, refunded
  created_at TIMESTAMP
);

-- Payout records
CREATE TABLE payouts (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id),
  stripe_payout_id TEXT UNIQUE,
  amount_cents INTEGER,
  period_start DATE,
  period_end DATE,
  status TEXT, -- pending, in_transit, paid, failed
  created_at TIMESTAMP,
  paid_at TIMESTAMP
);

-- Refund records
CREATE TABLE refunds (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  order_item_id UUID REFERENCES order_items(id),
  stripe_refund_id TEXT,
  amount_cents INTEGER,
  reason TEXT,
  initiated_by TEXT, -- customer, staff, system
  status TEXT, -- pending, succeeded, failed
  created_at TIMESTAMP
);

-- Chargeback records
CREATE TABLE chargebacks (
  id UUID PRIMARY KEY,
  payment_id UUID REFERENCES payments(id),
  stripe_dispute_id TEXT UNIQUE,
  amount_cents INTEGER,
  reason TEXT,
  status TEXT, -- needs_response, under_review, won, lost
  evidence_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
);
```

### Key API Endpoints

```
POST /api/checkout/create-payment-intent
  → Creates Stripe PaymentIntent with split amounts

POST /api/webhooks/stripe
  → Handles payment.succeeded, charge.refunded, charge.dispute.*

GET  /api/admin/payouts
  → List pending and completed payouts

POST /api/admin/payouts/trigger
  → Manually trigger payout run

POST /api/admin/refunds
  → Process refund for order or item

GET  /api/vendor/earnings
  → Vendor's earnings dashboard data

GET  /api/vendor/payouts
  → Vendor's payout history
```

---

## Open Questions

### Business Decisions Needed

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Who absorbs Stripe processing fees? | Platform / Vendors / Split | Platform |
| 2 | What is the platform commission rate? | 5-15% | 8% + $1.50 flat |
| 3 | What is the minimum order amount? | $0 / $15 / $20 | $15 |
| 4 | When do payouts occur? | Daily / Weekly / Bi-weekly | Weekly (Monday) |
| 5 | How long is the hold period before payout eligibility? | 0 / 2 / 7 days after pickup | 2 days |
| 6 | Who handles chargebacks financially? | Platform / Vendor | Platform |
| 7 | Do we offer instant payouts? | Yes (1% fee) / No | No for MVP |
| 8 | Do we collect sales tax? | Yes / No | No for MVP (research needed) |
| 9 | Refund policy window? | 24h / 48h / Same day | Before pickup only |

### Technical Decisions Needed

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | Stripe Connect account type? | Express / Custom | Express |
| 2 | How to handle substitution price differences? | Auto-refund / Manual / Ignore | Auto-refund difference |
| 3 | Auth-only or immediate capture? | Auth+Capture later / Immediate | Immediate for MVP |
| 4 | Store credit system? | Build custom / Use Stripe credits / Skip | Skip for MVP |

---

## Sources

### Stripe Connect and Multi-Vendor Payments
- [Stripe Connect Overview](https://stripe.com/connect) - Platform and marketplace payment solutions
- [Stripe Connect Documentation](https://docs.stripe.com/connect) - Official integration guides
- [Stripe Connect Account Types](https://docs.stripe.com/connect/accounts) - Standard vs Express vs Custom comparison
- [Stripe Split Payments Guide](https://stripe.com/resources/more/how-to-implement-split-payment-systems-what-businesses-need-to-do-to-make-it-work) - Implementation best practices
- [Stripe Marketplace Payouts](https://docs.stripe.com/connect/marketplace/tasks/payout) - Payout documentation
- [Stripe Instant Payouts](https://docs.stripe.com/connect/instant-payouts) - Instant payout feature details
- [Jeecart: Stripe Connect 2026 Guide](https://jeecart.com/what-is-stripe-connect/) - Comprehensive marketplace overview

### PayPal and Alternative Providers
- [PayPal Multiparty Payments](https://developer.paypal.com/docs/multiparty/) - Official developer documentation
- [PayPal Multi-Seller Payments](https://developer.paypal.com/docs/multiparty/checkout/multiseller-payments/) - Multi-vendor checkout
- [Sharetribe: PayPal for Marketplaces Overview](https://www.sharetribe.com/academy/marketplace-payments/paypal-for-marketplaces-overview/) - Feature comparison

### Fee Structures and Marketplace Economics
- [Marketplace Pricing Guide](https://fleexy.dev/blog/marketplace-pricing-set-optimal-service-fees-in-7-steps/) - Setting optimal fees
- [Commission vs Flat Fees](https://www.getmonetizely.com/articles/marketplace-pricing-taking-commissions-vs-flat-fees---what-saas-leaders-need-to-know) - SaaS marketplace pricing
- [Sharetribe: Commission/Take Rate](https://www.sharetribe.com/marketplace-glossary/commission-take-rate/) - Industry definitions
- [Marketplace Fee Comparison 2026](https://www.webgility.com/blog/marketplace-fees-amazon-ebay-etsy-walmart) - Amazon, eBay, Etsy, Walmart fees

### Chargebacks and Disputes
- [Chargeback Gurus: Marketplace Chargebacks](https://www.chargebackgurus.com/blog/chargebacks-online-marketplaces) - Dispute handling strategies
- [Rapyd: Marketplace Chargeback Prevention](https://www.rapyd.net/blog/8-marketplace-chargeback-reasons-how-to-reduce/) - Prevention best practices
- [Justt: Digital Marketplace Chargeback Risks](https://justt.ai/blog/digital-marketplaces-and-chargeback-risks/) - Risk management

### Refunds and Returns
- [Nautical: Multi-Vendor Payment Orchestration](https://www.nauticalcommerce.com/blog/multi-vendor-payment-orchestration) - Refund flow architecture
- [Trimplement: E-Commerce Refund Processing](https://trimplement.com/blog/2023/07/how-to-build-powerful-refund-processing-for-e-commerce/) - Technical implementation
- [CS-Cart: Marketplace Returns](https://www.cs-cart.com/blog/how-to-handle-order-returns-on-an-ecommerce-marketplace/) - Return policy best practices

### Tax Compliance (1099-K)
- [IRS: Understanding Form 1099-K](https://www.irs.gov/businesses/understanding-your-form-1099-k) - Official IRS guidance
- [Millan CPA: 1099-K Changes 2025](https://millancpa.com/insights/form-1099-k-changes-for-2025-what-businesses-and-sellers-must-know) - Updated thresholds
- [Trolley: 1099-K for Marketplaces](https://trolley.com/learning-center/irs-1099-k-payment-card-third-party-network-transactions/) - Compliance overview
- [Tax1099: Online Marketplace Reporting](https://www.tax1099.com/irs/tax-reporting-for-online-marketplace/) - Filing requirements

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-07 | Claude (PM Research) | Initial comprehensive payments spec |

---

*This document should be reviewed with Stripe documentation and legal counsel before implementation. Payment processing regulations vary by jurisdiction.*
