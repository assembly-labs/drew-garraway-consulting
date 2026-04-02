# iOS Payment & Subscription Strategy

## Decision: Let Apple Handle It

TOMO will use **Apple's StoreKit 2 / In-App Purchases** for all payment and subscription handling. We will not build custom payment infrastructure. This is both a compliance requirement and a strategic choice that simplifies our architecture, reduces risk, and builds user trust.

---

## 1. Why App Store Payments (Not Custom)

**Apple requires it.** Any app distributed through the App Store that sells digital goods or services (including subscriptions to app features) must use Apple's In-App Purchase system. There is no alternative for our use case. Building a custom payment flow would result in App Store rejection.

Beyond the requirement, there are strong practical reasons:

- **Payment processing is handled entirely by Apple.** We never touch credit card numbers, bank details, or payment tokens. Apple manages the transaction from initiation through settlement.
- **Receipts and refunds are managed by Apple.** Users request refunds through Apple directly. We do not need to build refund workflows or handle chargebacks.
- **Users trust Apple Pay.** Most iPhone users already have a payment method on file. The purchase flow is a single Face ID / Touch ID confirmation -- no typing card numbers.
- **PCI compliance is eliminated.** Because we never process, store, or transmit cardholder data, we have zero PCI DSS obligations. This removes an entire category of security and compliance work.
- **Apple takes a cut, but we get distribution.** Apple charges 15% for developers in the Small Business Program (under $1M annual revenue) or 30% above that threshold. This is the cost of App Store distribution, payment infrastructure, and global reach.

---

## 2. Subscription Tiers

TOMO uses a freemium model with two tiers:

### Free Tier
| Feature | Limit |
|---|---|
| Session logging | Unlimited |
| Training history | Last 30 days |
| Basic stats | Weekly summary only |
| Techniques library | Browse only |
| AI insights | None |
| Coach Share | None |

### Pro Tier -- $9.99/month or $79.99/year
| Feature | Access |
|---|---|
| Session logging | Unlimited |
| Training history | Unlimited (full archive) |
| All stats & analytics | Full dashboard, trends, heatmaps |
| Techniques library | Full access with personal notes |
| AI insights | Personalized recommendations, pattern detection |
| Coach Share | Generate shareable training reports for coaches |
| Priority support | In-app support channel |

**Annual pricing note:** $79.99/year is equivalent to ~$6.67/month, giving annual subscribers **2 months free** compared to monthly. This is prominently displayed in the paywall to drive annual conversions, which improves retention and LTV.

---

## 3. Implementation Approach

### Use RevenueCat SDK

We will use **RevenueCat** as an abstraction layer over StoreKit 2 rather than integrating StoreKit directly. RevenueCat is the industry-standard SDK for mobile subscription management.

**Why RevenueCat over raw StoreKit:**
- Handles receipt validation server-side (no need to build our own validation server)
- Manages subscription lifecycle: trials, renewals, cancellations, grace periods, billing retry
- Provides a single source of truth for subscription status
- Offers a webhook system that integrates with our Supabase backend
- Dashboards for revenue analytics, cohort analysis, and churn tracking
- If we ever ship Android, RevenueCat abstracts Google Play Billing as well

### Integration Architecture

```
[User taps "Subscribe"]
        |
        v
[RevenueCat SDK presents StoreKit purchase sheet]
        |
        v
[Apple processes payment via Face ID / Apple Pay]
        |
        v
[RevenueCat receives receipt, validates with Apple]
        |
        v
[RevenueCat webhook fires to our Supabase Edge Function]
        |
        v
[Supabase updates user profile: subscription_tier = "pro"]
        |
        v
[App queries Supabase for subscription status on launch]
```

### Key Implementation Details

- **Free tier requires no paywall interaction.** Users download the app, sign up, and immediately have full Free-tier access. No credit card required. No trial countdown.
- **Pro upgrade is triggered contextually.** When a user taps a Pro-only feature (e.g., AI insights, full history), the paywall screen appears. This is a "soft gate" -- the user sees what they are missing and can choose to upgrade.
- **Subscription status is stored in Supabase.** The `profiles` table includes a `subscription_tier` column (`free` or `pro`), a `subscription_expires_at` timestamp, and a `revenuecat_customer_id` for cross-referencing.
- **RevenueCat webhook keeps Supabase in sync.** On every subscription event (new purchase, renewal, cancellation, expiration, billing issue), RevenueCat sends a webhook to a Supabase Edge Function that updates the user's record. This ensures the backend is always authoritative.
- **The app also checks RevenueCat SDK on launch.** As a fallback, the app queries RevenueCat's SDK for the latest entitlement status each time it opens. This handles edge cases where a webhook might be delayed.

---

## 4. What We DON'T Build

Scope discipline is critical for a solo/small-team project. The following are explicitly out of scope:

- **No custom payment processing.** No Stripe, no Braintree, no direct credit card handling. Period.
- **No credit card forms.** Users never enter payment details in our app. Apple handles all payment UI.
- **No web-based payment portal.** There is no web version of TOMO at launch, so there is no need for web-based subscription management. If a web app is added later, we can evaluate Stripe for web-only purchases at that time.
- **No Android payment.** Google Play Billing is deferred until/unless an Android version is developed. RevenueCat supports it when the time comes, so the migration path is clear.
- **No promo code system.** Apple provides its own promo code mechanism for App Store subscriptions. We will use that rather than building a custom system.
- **No family sharing or gifting.** Deferred to a future version. StoreKit 2 supports Family Sharing for subscriptions, but it adds complexity we do not need at launch.

---

## 5. Paywall Design

The paywall is the single most important revenue screen in the app. It must be clear, honest, and non-aggressive.

### When It Appears
- When a user taps a Pro-only feature (AI insights, full history, Coach Share, etc.)
- From a "Go Pro" button in the Settings screen
- Optionally, after a milestone moment (e.g., 30th session logged) as a gentle upsell

### Paywall Layout

```
+---------------------------------------+
|           [X] Close                    |
|                                        |
|         Unlock TOMO Pro                |
|   Train smarter with full access       |
|                                        |
|  +----------------------------------+  |
|  |  Feature        Free    Pro      |  |
|  |  --------------------------------|  |
|  |  Session logging  [check] [check]|  |
|  |  Training history  30 days  All  |  |
|  |  Full analytics    --     [check]|  |
|  |  AI insights       --     [check]|  |
|  |  Coach Share        --     [check]|  |
|  +----------------------------------+  |
|                                        |
|  [ Monthly | *Annual* ]    <-- toggle  |
|                                        |
|     $9.99/mo  |  $79.99/yr             |
|               |  (2 months free)       |
|                                        |
|  [  Try Pro Free for 7 Days  ]  <gold> |
|                                        |
|  Subscription renews automatically.    |
|  Cancel anytime in Settings.           |
|                                        |
+---------------------------------------+
```

### Key Paywall Principles

- **Feature comparison table** makes the value of Pro tangible. Users see exactly what they gain.
- **Annual plan is pre-selected** and highlighted with a "2 months free" badge to drive higher-LTV conversions.
- **"Try Pro Free for 7 Days"** is the primary CTA. Free trials significantly increase conversion rates. After 7 days, the subscription auto-renews at the selected price.
- **Apple Pay integration via StoreKit** means the purchase confirmation is a single Face ID scan. Minimal friction.
- **Transparent cancellation messaging** ("Cancel anytime in Settings") builds trust and reduces anxiety about committing.

---

## 6. Settings Integration

The Settings screen includes a **Subscription** section that provides transparency and control:

### Free Users See:
```
Subscription
  Current Plan: Free
  [Upgrade to Pro]  -->  (opens paywall)
```

### Pro Users See:
```
Subscription
  Current Plan: Pro
  Renews: March 15, 2026
  [Manage Subscription]  -->  (opens Apple subscription management)
  [Restore Purchases]
```

### Implementation Notes

- **"Manage Subscription" links to Apple's native subscription management screen.** This is opened via `UIApplication.shared.open(URL(string: "https://apps.apple.com/account/subscriptions")!)`. We do not build our own cancellation flow -- Apple handles it.
- **"Restore Purchases" is required by Apple.** This button triggers `RevenueCat.shared.restorePurchases()` and syncs the user's entitlements. It is essential for users who reinstall the app or switch devices.
- **Current plan and renewal date** are pulled from RevenueCat's SDK on the client side, with Supabase as the server-side fallback.

---

## 7. Cost Estimates

### RevenueCat Pricing
| Metric | Cost |
|---|---|
| Monthly Tracked Revenue under $2,500 | Free |
| Above $2,500 MTR | $0.01 per tracked event (purchase, renewal, etc.) |
| Dashboard, webhooks, analytics | Included |

For early-stage TOMO, RevenueCat is effectively **free** until we reach ~250 paying subscribers.

### Apple Commission
| Revenue Bracket | Commission |
|---|---|
| Under $1M annual App Store revenue | 15% (Small Business Program) |
| Over $1M annual App Store revenue | 30% |

TOMO will qualify for the **15% rate** for the foreseeable future.

### Net Revenue Per Subscriber

**Monthly subscriber ($9.99/mo):**
| | Amount |
|---|---|
| Gross | $9.99 |
| Apple commission (15%) | -$1.50 |
| **Net to TOMO** | **$8.49** |

**Annual subscriber ($79.99/yr = $6.67/mo effective):**
| | Amount |
|---|---|
| Gross | $79.99/yr |
| Apple commission (15%) | -$12.00/yr |
| **Net to TOMO** | **$67.99/yr ($5.67/mo)** |

### Break-Even Estimates

Assuming modest infrastructure costs (~$50/month for Supabase, hosting, and services):

- **~6 monthly subscribers** cover base infrastructure costs
- **~100 subscribers** generate ~$850/month net, supporting part-time solo development
- **~500 subscribers** generate ~$4,250/month net, approaching sustainable full-time revenue

These are conservative targets. The priority at launch is product quality and retention, not subscriber count. Good retention compounds; aggressive monetization before product-market fit does not.

---

## Summary

| Decision | Choice |
|---|---|
| Payment processor | Apple In-App Purchase (StoreKit 2) |
| Subscription SDK | RevenueCat |
| Backend sync | RevenueCat webhooks to Supabase Edge Functions |
| Free tier | Full app with limitations, no paywall on entry |
| Pro tier | $9.99/mo or $79.99/yr (2 months free) |
| Trial | 7-day free trial for Pro |
| Custom payment infrastructure | None. Apple handles everything. |
| Android payments | Deferred |
| Web payments | Deferred |

This approach lets us ship a subscription-ready app with minimal custom payment code, zero PCI burden, and maximum user trust. RevenueCat gives us the analytics and webhook infrastructure to keep our backend in sync without building it from scratch. Apple handles the rest.