# Series 7 Framework - Folder Structure

**Date:** January 6, 2026
**Purpose:** Define the complete directory structure for Series 7 exam prep materials, mirroring SIE patterns while adapting for Series 7 content depth.

---

## Design Principles

1. **Mirror SIE Patterns** - Use same naming conventions and organizational structure
2. **Weight by Exam Importance** - Section 3 (73%) gets deepest structure
3. **Scalable Design** - Easy to add content over time
4. **FHM Integration** - Lives within the FHM project structure

---

## Location Within FHM

```
fhm/
├── content/
│   ├── sie-exam/              # Existing SIE materials
│   └── series-7/              # NEW: Series 7 materials
└── pages/
    ├── sie/                   # Existing SIE pages
    └── series-7/              # NEW: Series 7 pages
```

---

## Complete Folder Structure

```
fhm/content/series-7/
│
├── README.md                              # User-facing course overview
├── README_ORGANIZATION.md                 # System documentation
├── CLAUDE.md                              # AI collaboration instructions
│
├── raw-notes/                             # Original study materials (Phase 1)
│   └── [topic]-notes.md
│
├── templates/                             # Reusable content templates
│   ├── section-template.md
│   ├── lesson-template.md
│   ├── quiz-template.md
│   ├── flashcard-template.md
│   └── calculation-worksheet-template.md
│
│
│ ═══════════════════════════════════════════════════════════════════
│ SECTION 1: SEEKS BUSINESS FOR BROKER-DEALER (9% - ~11 questions)
│ ═══════════════════════════════════════════════════════════════════
│
├── section-01-seeks-business/
│   ├── SECTION_CLAUDE.md                  # Section-specific instructions
│   ├── section-meta.json                  # Section metadata
│   ├── section-00-overview.md             # Section introduction & roadmap
│   │
│   ├── chapters/
│   │   ├── chapter-01-prospecting-customers/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-types-of-customers.md
│   │   │   ├── lesson-02-referral-methods.md
│   │   │   └── lesson-03-cold-calling-rules.md
│   │   │
│   │   ├── chapter-02-business-development/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-seminars-presentations.md
│   │   │   ├── lesson-02-advertising-communications.md
│   │   │   └── lesson-03-networking-strategies.md
│   │   │
│   │   └── chapter-03-compliance-prospecting/
│   │       ├── chapter-meta.json
│   │       ├── lesson-01-do-not-call-rules.md
│   │       ├── lesson-02-record-keeping.md
│   │       └── lesson-03-telemarketing-regulations.md
│   │
│   ├── practice/
│   │   ├── quiz-chapter-01.md
│   │   ├── quiz-chapter-02.md
│   │   ├── quiz-chapter-03.md
│   │   └── section-01-comprehensive.md
│   │
│   └── flashcards/
│       └── section-01-flashcards.json
│
│
│ ═══════════════════════════════════════════════════════════════════
│ SECTION 2: OPENS ACCOUNTS (11% - ~14 questions)
│ ═══════════════════════════════════════════════════════════════════
│
├── section-02-opens-accounts/
│   ├── SECTION_CLAUDE.md
│   ├── section-meta.json
│   ├── section-00-overview.md
│   │
│   ├── chapters/
│   │   ├── chapter-01-account-types/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-individual-accounts.md
│   │   │   ├── lesson-02-joint-accounts.md
│   │   │   ├── lesson-03-corporate-partnership.md
│   │   │   ├── lesson-04-trust-estate-accounts.md
│   │   │   └── lesson-05-custodial-accounts.md
│   │   │
│   │   ├── chapter-02-customer-profile/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-kyc-requirements.md
│   │   │   ├── lesson-02-financial-profile.md
│   │   │   ├── lesson-03-investment-objectives.md
│   │   │   ├── lesson-04-risk-tolerance.md
│   │   │   └── lesson-05-time-horizon-liquidity.md
│   │   │
│   │   ├── chapter-03-suitability/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-suitability-obligations.md
│   │   │   ├── lesson-02-reasonable-basis.md
│   │   │   ├── lesson-03-customer-specific.md
│   │   │   └── lesson-04-quantitative-suitability.md
│   │   │
│   │   └── chapter-04-account-documentation/
│   │       ├── chapter-meta.json
│   │       ├── lesson-01-new-account-forms.md
│   │       ├── lesson-02-customer-agreements.md
│   │       ├── lesson-03-margin-agreements.md
│   │       └── lesson-04-options-agreements.md
│   │
│   ├── practice/
│   │   ├── quiz-chapter-01.md
│   │   ├── quiz-chapter-02.md
│   │   ├── quiz-chapter-03.md
│   │   ├── quiz-chapter-04.md
│   │   └── section-02-comprehensive.md
│   │
│   └── flashcards/
│       └── section-02-flashcards.json
│
│
│ ═══════════════════════════════════════════════════════════════════
│ SECTION 3: PROVIDES INFO & MAKES RECOMMENDATIONS (73% - ~91 questions)
│ ═══════════════════════════════════════════════════════════════════
│ This is THE BIG SECTION - needs deepest structure
│
├── section-03-provides-info/
│   ├── SECTION_CLAUDE.md
│   ├── section-meta.json
│   ├── section-00-overview.md
│   │
│   ├── subsections/
│   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ EQUITY SECURITIES
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 01-equity-securities/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-common-stock/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-stock-basics.md
│   │   │   │   │   ├── lesson-02-voting-rights.md
│   │   │   │   │   ├── lesson-03-dividends.md
│   │   │   │   │   └── lesson-04-stock-splits.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-preferred-stock/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-preferred-features.md
│   │   │   │   │   ├── lesson-02-types-of-preferred.md
│   │   │   │   │   └── lesson-03-preferred-vs-common.md
│   │   │   │   │
│   │   │   │   ├── chapter-03-rights-warrants/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-preemptive-rights.md
│   │   │   │   │   ├── lesson-02-warrants.md
│   │   │   │   │   └── lesson-03-rights-vs-warrants.md
│   │   │   │   │
│   │   │   │   └── chapter-04-adrs-foreign/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       └── lesson-01-adrs-foreign-securities.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── equity-securities-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── equity-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ DEBT SECURITIES
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 02-debt-securities/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-bond-fundamentals/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-bond-basics.md
│   │   │   │   │   ├── lesson-02-pricing-yields.md
│   │   │   │   │   ├── lesson-03-yield-calculations.md
│   │   │   │   │   └── lesson-04-interest-rate-risk.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-corporate-bonds/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-corporate-bond-types.md
│   │   │   │   │   ├── lesson-02-secured-unsecured.md
│   │   │   │   │   ├── lesson-03-convertible-bonds.md
│   │   │   │   │   └── lesson-04-callable-bonds.md
│   │   │   │   │
│   │   │   │   ├── chapter-03-government-securities/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-treasury-securities.md
│   │   │   │   │   ├── lesson-02-agency-securities.md
│   │   │   │   │   └── lesson-03-mortgage-backed.md
│   │   │   │   │
│   │   │   │   └── chapter-04-money-markets/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       └── lesson-01-money-market-instruments.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── bond-calculations-worksheet.md
│   │   │   │   └── debt-securities-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── debt-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ MUNICIPAL BONDS (HEAVY FOCUS)
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 03-municipal-bonds/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-muni-fundamentals/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-municipal-bond-basics.md
│   │   │   │   │   ├── lesson-02-tax-advantages.md
│   │   │   │   │   └── lesson-03-tax-equivalent-yield.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-go-bonds/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-general-obligation.md
│   │   │   │   │   ├── lesson-02-taxing-authority.md
│   │   │   │   │   └── lesson-03-debt-limits.md
│   │   │   │   │
│   │   │   │   ├── chapter-03-revenue-bonds/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-revenue-bond-basics.md
│   │   │   │   │   ├── lesson-02-types-of-revenue.md
│   │   │   │   │   ├── lesson-03-bond-covenants.md
│   │   │   │   │   └── lesson-04-feasibility-studies.md
│   │   │   │   │
│   │   │   │   ├── chapter-04-muni-analysis/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-credit-analysis.md
│   │   │   │   │   ├── lesson-02-official-statement.md
│   │   │   │   │   └── lesson-03-ratings-insurance.md
│   │   │   │   │
│   │   │   │   ├── chapter-05-muni-trading/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-primary-market.md
│   │   │   │   │   ├── lesson-02-secondary-market.md
│   │   │   │   │   └── lesson-03-markups-pricing.md
│   │   │   │   │
│   │   │   │   └── chapter-06-msrb-rules/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       ├── lesson-01-msrb-overview.md
│   │   │   │       ├── lesson-02-political-contributions.md
│   │   │   │       └── lesson-03-customer-protection.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── muni-calculations-worksheet.md
│   │   │   │   └── municipal-bonds-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── muni-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ OPTIONS (COMPLEX - NEEDS DEEP STRUCTURE)
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 04-options/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-options-fundamentals/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-options-basics.md
│   │   │   │   │   ├── lesson-02-calls-puts.md
│   │   │   │   │   ├── lesson-03-rights-obligations.md
│   │   │   │   │   ├── lesson-04-premium-components.md
│   │   │   │   │   └── lesson-05-options-positions.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-options-pricing/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-intrinsic-value.md
│   │   │   │   │   ├── lesson-02-time-value.md
│   │   │   │   │   ├── lesson-03-in-out-at-money.md
│   │   │   │   │   └── lesson-04-breakeven-calculations.md
│   │   │   │   │
│   │   │   │   ├── chapter-03-basic-strategies/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-long-calls.md
│   │   │   │   │   ├── lesson-02-long-puts.md
│   │   │   │   │   ├── lesson-03-covered-calls.md
│   │   │   │   │   ├── lesson-04-protective-puts.md
│   │   │   │   │   └── lesson-05-naked-options.md
│   │   │   │   │
│   │   │   │   ├── chapter-04-spread-strategies/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-spread-basics.md
│   │   │   │   │   ├── lesson-02-bull-spreads.md
│   │   │   │   │   ├── lesson-03-bear-spreads.md
│   │   │   │   │   ├── lesson-04-debit-credit-spreads.md
│   │   │   │   │   └── lesson-05-calendar-spreads.md
│   │   │   │   │
│   │   │   │   ├── chapter-05-straddles-combinations/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-long-straddles.md
│   │   │   │   │   ├── lesson-02-short-straddles.md
│   │   │   │   │   └── lesson-03-combinations.md
│   │   │   │   │
│   │   │   │   ├── chapter-06-options-calculations/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-max-gain-loss.md
│   │   │   │   │   ├── lesson-02-breakeven-points.md
│   │   │   │   │   ├── lesson-03-spread-calculations.md
│   │   │   │   │   └── lesson-04-tax-implications.md
│   │   │   │   │
│   │   │   │   ├── chapter-07-index-options/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-index-option-basics.md
│   │   │   │   │   ├── lesson-02-settlement-differences.md
│   │   │   │   │   └── lesson-03-hedging-with-index.md
│   │   │   │   │
│   │   │   │   └── chapter-08-options-regulations/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       ├── lesson-01-options-account-approval.md
│   │   │   │       ├── lesson-02-occ-rules.md
│   │   │   │       └── lesson-03-position-limits.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── options-basics-quiz.md
│   │   │   │   ├── strategies-quiz.md
│   │   │   │   ├── calculations-worksheet.md
│   │   │   │   ├── max-gain-loss-drill.md
│   │   │   │   └── comprehensive-options-exam.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       ├── options-terms-flashcards.json
│   │   │       ├── strategies-flashcards.json
│   │   │       └── formulas-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ INVESTMENT COMPANIES
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 05-investment-companies/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-fund-types/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-open-end-funds.md
│   │   │   │   │   ├── lesson-02-closed-end-funds.md
│   │   │   │   │   └── lesson-03-uits.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-fund-operations/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-nav-calculations.md
│   │   │   │   │   ├── lesson-02-sales-charges.md
│   │   │   │   │   ├── lesson-03-share-classes.md
│   │   │   │   │   └── lesson-04-expense-ratios.md
│   │   │   │   │
│   │   │   │   └── chapter-03-fund-regulations/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       ├── lesson-01-1940-act.md
│   │   │   │       └── lesson-02-prohibited-practices.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── investment-companies-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── funds-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ VARIABLE PRODUCTS
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 06-variable-products/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-variable-annuities/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-annuity-basics.md
│   │   │   │   │   ├── lesson-02-accumulation-phase.md
│   │   │   │   │   ├── lesson-03-annuitization.md
│   │   │   │   │   └── lesson-04-death-benefits.md
│   │   │   │   │
│   │   │   │   └── chapter-02-variable-life/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       ├── lesson-01-variable-life-basics.md
│   │   │   │       └── lesson-02-vul-policies.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── variable-products-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── variable-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ RETIREMENT PLANS
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 07-retirement-plans/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-qualified-plans/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-qualified-basics.md
│   │   │   │   │   ├── lesson-02-401k-plans.md
│   │   │   │   │   ├── lesson-03-pension-plans.md
│   │   │   │   │   └── lesson-04-profit-sharing.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-iras/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-traditional-ira.md
│   │   │   │   │   ├── lesson-02-roth-ira.md
│   │   │   │   │   ├── lesson-03-contribution-limits.md
│   │   │   │   │   └── lesson-04-distributions.md
│   │   │   │   │
│   │   │   │   └── chapter-03-erisa/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       └── lesson-01-erisa-requirements.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── retirement-plans-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── retirement-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ MARGIN ACCOUNTS (CALCULATION HEAVY)
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 08-margin-accounts/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-margin-fundamentals/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-margin-basics.md
│   │   │   │   │   ├── lesson-02-regulation-t.md
│   │   │   │   │   └── lesson-03-margin-agreement.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-long-margin/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-initial-requirements.md
│   │   │   │   │   ├── lesson-02-sma-calculations.md
│   │   │   │   │   ├── lesson-03-maintenance-margin.md
│   │   │   │   │   └── lesson-04-margin-calls.md
│   │   │   │   │
│   │   │   │   ├── chapter-03-short-margin/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-short-selling-basics.md
│   │   │   │   │   ├── lesson-02-short-margin-requirements.md
│   │   │   │   │   └── lesson-03-short-calculations.md
│   │   │   │   │
│   │   │   │   └── chapter-04-combined-accounts/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       └── lesson-01-combined-equity.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── margin-calculations-worksheet.md
│   │   │   │   ├── sma-drill.md
│   │   │   │   └── margin-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       ├── margin-terms-flashcards.json
│   │   │       └── margin-formulas-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ DIRECT PARTICIPATION PROGRAMS
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 09-dpps/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-dpp-basics/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-limited-partnerships.md
│   │   │   │   │   ├── lesson-02-types-of-programs.md
│   │   │   │   │   └── lesson-03-tax-implications.md
│   │   │   │   │
│   │   │   │   └── chapter-02-dpp-analysis/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       ├── lesson-01-economic-viability.md
│   │   │   │       └── lesson-02-suitability.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── dpp-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── dpp-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ OTHER PACKAGED PRODUCTS
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 10-other-products/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-etfs-etns/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-etf-basics.md
│   │   │   │   │   └── lesson-02-etn-risks.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-reits/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   └── lesson-01-reit-basics.md
│   │   │   │   │
│   │   │   │   └── chapter-03-hedge-funds/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       └── lesson-01-hedge-fund-basics.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── other-products-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── other-products-flashcards.json
│   │   │
│   │   ┌─────────────────────────────────────────────────────────────
│   │   │ CUSTOMER RECOMMENDATIONS & ANALYSIS
│   │   └─────────────────────────────────────────────────────────────
│   │   ├── 11-analysis-recommendations/
│   │   │   ├── subsection-meta.json
│   │   │   ├── subsection-overview.md
│   │   │   │
│   │   │   ├── chapters/
│   │   │   │   ├── chapter-01-fundamental-analysis/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   ├── lesson-01-financial-statements.md
│   │   │   │   │   └── lesson-02-ratio-analysis.md
│   │   │   │   │
│   │   │   │   ├── chapter-02-technical-analysis/
│   │   │   │   │   ├── chapter-meta.json
│   │   │   │   │   └── lesson-01-technical-basics.md
│   │   │   │   │
│   │   │   │   └── chapter-03-economic-factors/
│   │   │   │       ├── chapter-meta.json
│   │   │   │       ├── lesson-01-economic-indicators.md
│   │   │   │       └── lesson-02-fiscal-monetary-policy.md
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   └── analysis-quiz.md
│   │   │   │
│   │   │   └── flashcards/
│   │   │       └── analysis-flashcards.json
│   │   │
│   │   └── section-03-practice/                  # Comprehensive Section 3 materials
│   │       ├── section-03-comprehensive-quiz.md
│   │       └── section-03-mini-exam.md
│
│
│ ═══════════════════════════════════════════════════════════════════
│ SECTION 4: PROCESSES TRANSACTIONS (7% - ~9 questions)
│ ═══════════════════════════════════════════════════════════════════
│
├── section-04-processes-transactions/
│   ├── SECTION_CLAUDE.md
│   ├── section-meta.json
│   ├── section-00-overview.md
│   │
│   ├── chapters/
│   │   ├── chapter-01-order-handling/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-order-types.md
│   │   │   ├── lesson-02-order-tickets.md
│   │   │   └── lesson-03-executing-orders.md
│   │   │
│   │   ├── chapter-02-trade-confirmation/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-confirmations.md
│   │   │   └── lesson-02-trade-reporting.md
│   │   │
│   │   ├── chapter-03-settlement/
│   │   │   ├── chapter-meta.json
│   │   │   ├── lesson-01-settlement-dates.md
│   │   │   ├── lesson-02-delivery-requirements.md
│   │   │   └── lesson-03-fails-to-deliver.md
│   │   │
│   │   └── chapter-04-customer-records/
│   │       ├── chapter-meta.json
│   │       ├── lesson-01-account-statements.md
│   │       └── lesson-02-record-retention.md
│   │
│   ├── practice/
│   │   ├── quiz-chapter-01.md
│   │   ├── quiz-chapter-02.md
│   │   ├── quiz-chapter-03.md
│   │   ├── quiz-chapter-04.md
│   │   └── section-04-comprehensive.md
│   │
│   └── flashcards/
│       └── section-04-flashcards.json
│
│
│ ═══════════════════════════════════════════════════════════════════
│ STUDY TOOLS
│ ═══════════════════════════════════════════════════════════════════
│
├── study-tools/
│   ├── README.md                          # How to use these tools
│   ├── progress-tracker.md                # Track what you've studied
│   ├── study-schedule.md                  # 8-10 week study plan
│   ├── formula-sheet.md                   # All calculations in one place
│   ├── exam-day-prep.md                   # Day-of-exam checklist
│   ├── common-mistakes.md                 # Frequently missed concepts
│   │
│   ├── calculation-drills/
│   │   ├── options-max-gain-loss.md
│   │   ├── options-breakeven.md
│   │   ├── margin-calculations.md
│   │   ├── bond-yield-calculations.md
│   │   └── tax-equivalent-yield.md
│   │
│   └── quick-reference/
│       ├── order-types-cheatsheet.md
│       ├── options-strategies-matrix.md
│       ├── account-types-comparison.md
│       └── regulation-timeline.md
│
│
│ ═══════════════════════════════════════════════════════════════════
│ PRACTICE EXAMS
│ ═══════════════════════════════════════════════════════════════════
│
├── practice-exams/
│   ├── README.md                          # How to use practice exams
│   │
│   ├── exam-01/
│   │   ├── exam-meta.json                 # Exam metadata
│   │   ├── questions.md                   # 125 questions
│   │   ├── answers.md                     # Answer key
│   │   └── explanations.md                # Detailed explanations
│   │
│   ├── exam-02/
│   │   ├── exam-meta.json
│   │   ├── questions.md
│   │   ├── answers.md
│   │   └── explanations.md
│   │
│   └── exam-03/
│       ├── exam-meta.json
│       ├── questions.md
│       ├── answers.md
│       └── explanations.md
│
│
│ ═══════════════════════════════════════════════════════════════════
│ RESOURCES
│ ═══════════════════════════════════════════════════════════════════
│
└── resources/
    ├── glossary.md                        # All key terms alphabetized
    ├── finra-rules-reference.md           # Key FINRA rules
    ├── external-resources.md              # Links to FINRA, official sources
    │
    └── cheat-sheets/
        ├── options-cheatsheet.md
        ├── margin-cheatsheet.md
        ├── muni-bonds-cheatsheet.md
        └── retirement-plans-cheatsheet.md
```

---

## File Counts by Section

| Section | % of Exam | Chapters | Lessons | Quizzes | Est. Content |
|---------|-----------|----------|---------|---------|--------------|
| Section 1 | 9% | 3 | 9 | 4 | Light |
| Section 2 | 11% | 4 | 18 | 5 | Medium |
| Section 3 | 73% | 38+ | 95+ | 15+ | Heavy |
| Section 4 | 7% | 4 | 10 | 5 | Light |

**Section 3 Subsections:**
- Equity Securities: 4 chapters, ~10 lessons
- Debt Securities: 4 chapters, ~12 lessons
- Municipal Bonds: 6 chapters, ~15 lessons (heavy)
- Options: 8 chapters, ~25 lessons (heaviest)
- Investment Companies: 3 chapters, ~8 lessons
- Variable Products: 2 chapters, ~6 lessons
- Retirement Plans: 3 chapters, ~8 lessons
- Margin Accounts: 4 chapters, ~10 lessons (heavy calculations)
- DPPs: 2 chapters, ~5 lessons
- Other Products: 3 chapters, ~4 lessons
- Analysis: 3 chapters, ~5 lessons

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Section folder | `section-XX-kebab-name/` | `section-03-provides-info/` |
| Subsection folder | `XX-kebab-name/` | `04-options/` |
| Chapter folder | `chapter-XX-kebab-name/` | `chapter-01-options-fundamentals/` |
| Lesson file | `lesson-XX-kebab-name.md` | `lesson-01-options-basics.md` |
| Quiz file | `quiz-[scope].md` | `quiz-chapter-01.md` |
| Flashcard file | `[topic]-flashcards.json` | `options-terms-flashcards.json` |
| Meta file | `[scope]-meta.json` | `chapter-meta.json` |

---

## HTML Pages Structure (Future)

```
fhm/pages/series-7/
├── series-7-study-materials.html          # Main hub
├── series-7-flashcards.html               # Flashcard practice
├── series-7-practice-exam.html            # Practice tests
├── series-7-formula-drill.html            # Calculation practice
├── series-7-progress.html                 # Progress tracking
│
├── section-01/                            # Section 1 pages
├── section-02/                            # Section 2 pages
├── section-03/                            # Section 3 pages (most pages here)
│   ├── equity/
│   ├── debt/
│   ├── municipal/
│   ├── options/                           # Deep structure here
│   ├── [etc]/
└── section-04/                            # Section 4 pages
```

---

## Key Differences from SIE Structure

1. **Four-Section Organization** - Instead of chapter-based, organized by FINRA exam sections
2. **Subsection Layer** - Section 3 needs subsections for its 11 major topic areas
3. **Calculation Focus** - More worksheet files for margin, options, bonds
4. **Deeper Options Coverage** - 8 chapters vs. SIE's likely 1-2
5. **Formula Sheet Priority** - Central study tool for calculation-heavy exam

---

*Ready for Drew's review before proceeding to Phase 3: Implementation*
