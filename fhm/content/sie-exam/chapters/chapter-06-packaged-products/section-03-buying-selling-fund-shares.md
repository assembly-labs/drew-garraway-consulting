---
chapter: 6
section: 3
title: 'Buying and Selling Fund Shares'
description: 'Understanding NAV, POP, pricing mechanics, breakpoints, and sales discounts'
topics:
  - NAV and POP Pricing
  - Breakpoints
  - Letter of Intent
  - Rights of Accumulation
estimated_time: 30
difficulty: intermediate
last_updated: 2024-12-12
---

# Buying and Selling Fund Shares

## Introduction

The mechanics of buying and selling mutual fund shares differ fundamentally from trading stocks.
There's no bid-ask spread, no negotiating prices, and no exchange floor. Instead, there's a daily
calculation, a formula, and a pricing system designed to treat all investors fairly.

Understanding how fund pricing works—including the various discounts available—is essential for both
the SIE exam and for properly serving clients.

## Learning Objectives

By the end of this section, you'll be able to:

- Calculate NAV and understand the POP formula
- Explain the difference between open-end and closed-end fund pricing
- Apply breakpoint schedules to client purchases
- Understand Letter of Intent and Rights of Accumulation

---

## How Shares Are Issued

<div class="exam-focus">
  <div class="exam-focus__label">EXAM FOCUS - HIGH PRIORITY</div>
  <p><strong>This topic was marked WEAK on your practice exam.</strong> Focus on how open-end vs closed-end issuance works and the prospectus requirements.</p>
</div>

### Closed-End Funds

One-time stock issuance. After the IPO, shares trade continuously throughout the day on an exchange,
just like regular stocks.

### Open-End Funds

Continuous issuance of new shares and <span class="key-term">redemption</span> of old ones. Every
purchase creates shares; every sale destroys them.

### The Prospectus Question

<div class="critical-concept">
  <div class="critical-concept__label">EXAM TRAP - PROSPECTUS REQUIREMENTS</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Fund Type</th>
        <th>Prospectus Required?</th>
        <th>WHY (Key Reasoning)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Closed-End Fund</strong></td>
        <td>Only at IPO, NOT in secondary market</td>
        <td>Secondary trades are investor-to-investor</td>
      </tr>
      <tr>
        <td><strong>Open-End Fund</strong></td>
        <td>YES - EVERY purchase</td>
        <td>Always a PRIMARY offering (fund creates new shares)</td>
      </tr>
    </tbody>
  </table>
</div>

This is a common exam topic:

| Fund Type           | Prospectus Delivery                                             |
| ------------------- | --------------------------------------------------------------- |
| **Closed-End Fund** | No longer required once securities trade in secondary market    |
| **Open-End Fund**   | Required upon every purchase—it's a continuous primary offering |

<div class="info-box">
  <div class="info-box__title">Why the Difference?</div>
  <p>When you buy closed-end fund shares on the NYSE, you're buying from another investor, not the fund. When you buy open-end fund shares, you're always buying from the fund itself—hence the prospectus requirement.</p>
</div>

---

## Fund Pricing: NAV and POP

<div class="critical-concept">
  <div class="critical-concept__label">MASTER THESE FORMULAS</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Formula</th>
        <th>Calculation</th>
        <th>Exam Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>NAV</strong></td>
        <td>(Total Assets - Total Liabilities) / Shares Outstanding</td>
        <td>Computed DAILY</td>
      </tr>
      <tr>
        <td><strong>POP</strong></td>
        <td>NAV + Sales Charge</td>
        <td>What investors PAY to buy</td>
      </tr>
      <tr>
        <td><strong>Sales Charge %</strong></td>
        <td><strong>(POP - NAV) / POP</strong></td>
        <td>ALWAYS divide by POP, not NAV!</td>
      </tr>
    </tbody>
  </table>
</div>

### Net Asset Value (NAV)

<span class="key-term">NAV</span> is the fund's per-share value, computed daily:

- Add up all securities at current market prices
- Deduct fees and liabilities
- Divide by shares outstanding

```
NAV = (Total Assets - Total Liabilities) / Shares Outstanding
```

### Public Offering Price (POP)

When you buy mutual fund shares, you pay the <span class="key-term">POP</span>:

```
POP = NAV + Sales Charge (SC)
```

<div class="exam-focus">
  <div class="exam-focus__label">EXAM TRAP - 8.5% MAX</div>
  <p>The <strong>maximum sales charge is 8½% of POP</strong> (not of NAV). The exam will try to trick you on this. Always calculate sales charge as a % of POP.</p>
</div>

### Calculating Sales Charge

**Example:**

| NAV   | POP    |
| ----- | ------ |
| $9.15 | $10.00 |

```
Sales Charge = (POP - NAV) / POP
             = ($10.00 - $9.15) / $10.00
             = $0.85 / $10.00
             = 8.5%
```

<div class="test-tip">
  <p><strong>Test Tip:</strong> The sales charge is calculated as a percentage of the POP, not the NAV. This is a frequent exam question.</p>
</div>

---

## Open-End vs. Closed-End: A Comparison

<div class="critical-concept">
  <div class="critical-concept__label">KNOW THIS TABLE COLD</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Feature</th>
        <th>OPEN-END Fund</th>
        <th>CLOSED-END Fund</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Buy at</strong></td>
        <td>POP (NAV + sales charge)</td>
        <td>Market price + commission</td>
      </tr>
      <tr>
        <td><strong>Sell at</strong></td>
        <td>NAV (redeem with fund)</td>
        <td>Market price - commission</td>
      </tr>
      <tr>
        <td><strong>Pricing</strong></td>
        <td>FORWARD pricing (next NAV, typically 4 PM)</td>
        <td>CONTINUOUS throughout day</td>
      </tr>
      <tr>
        <td><strong>Premium/Discount</strong></td>
        <td>NO - Always at NAV</td>
        <td>YES - Can trade above or below NAV</td>
      </tr>
    </tbody>
  </table>
</div>

| Feature              | Open-End Fund                       | Closed-End Fund                  |
| -------------------- | ----------------------------------- | -------------------------------- |
| **Buy at**           | POP (NAV + sales charge)            | Market price + commission        |
| **Sell at**          | NAV                                 | Market price - commission        |
| **Pricing**          | Forward pricing (typically 4:00 PM) | Continuous throughout the day    |
| **Premium/Discount** | Always trades at NAV                | Can trade at premium or discount |

### Forward Pricing

<div class="exam-focus">
  <div class="exam-focus__label">FORWARD PRICING - KEY CONCEPT</div>
  <p><strong>Forward pricing</strong> means your order is filled at the NEXT calculated NAV. Order at 2:00 PM? You get the 4:00 PM price. This applies ONLY to open-end (mutual) funds.</p>
</div>

<span class="key-term">Forward pricing</span> means your order is filled at the next calculated NAV.
If you place an order at 2:00 PM, you get the 4:00 PM price. This prevents arbitrage that could harm
other shareholders.

---

## Breakpoints and Sales Discounts

### Why Breakpoints Exist

To charge the maximum 8½% sales charge, FINRA requires funds to offer volume discounts called
<span class="key-term">breakpoints</span>.

### Sample Breakpoint Schedule

| Purchase Amount    | Sales Charge |
| ------------------ | ------------ |
| $0 – $10,000       | 8½%          |
| >$10,000 – $20,000 | 7½%          |
| >$20,001 – $45,000 | 6½%          |
| >$45,001 – $65,000 | 5½%          |
| >$65,001+          | 5%           |

The exact breakpoints vary by fund—this is just an example. The principle is universal: buy more,
pay less.

<div class="info-box">
  <div class="info-box__title">Important Exception</div>
  <p><strong>Investment clubs do NOT qualify for breakpoints.</strong> This is a commonly tested point.</p>
</div>

---

## Letter of Intent (LOI)

What if you plan to invest enough to qualify for a breakpoint, but not all at once?

A <span class="key-term">Letter of Intent</span> lets you:

- Qualify for breakpoints based on intended future purchases
- **Backdate 90 days** to include recent purchases
- Complete purchases over **13 months** (inclusive of the backdate period)

### If You Don't Complete the LOI

**No penalty**—your sales charge is simply recalculated at the actual level invested. You'll owe the
difference between what you paid and what you should have paid.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Asset appreciation and reinvested dividends do NOT count toward your LOI amount. Only new money counts.</p>
</div>

---

## Rights of Accumulation

For subsequent purchases, <span class="key-term">Rights of Accumulation</span> provide breakpoint
pricing based on:

- **Current market value** of existing holdings (including appreciation and reinvested dividends)
- Combined purchases across a **fund family**
- Combined purchases across **related accounts** (spouses, minor children, IRAs)

### LOI vs. Rights of Accumulation

| Feature                  | Letter of Intent          | Rights of Accumulation    |
| ------------------------ | ------------------------- | ------------------------- |
| **Looks at**             | Future intended purchases | Current accumulated value |
| **Time period**          | 13 months                 | Ongoing                   |
| **Appreciation counts?** | No                        | Yes                       |
| **Dividends count?**     | No                        | Yes                       |

---

## Other Sales Discounts

### Dividend Reinvestment at NAV

Any fund sold by a FINRA member must offer dividend reinvestment at NAV—no sales charge. The
dividend is still taxable, but you don't pay to reinvest it.

### Switching Within a Fund Family

Most fund families allow exchanges between funds without additional sales charges. Moving from ABC
Growth to ABC Bond? Usually free.

<div class="info-box">
  <div class="info-box__title">Tax Warning</div>
  <p>The IRS considers fund switches <strong>taxable events</strong>. You may owe capital gains tax even if no money left the fund family. The exchange is treated as a sale of the old fund and purchase of the new one.</p>
</div>

---

## Test Preparation

<div class="test-tip">
  <p><strong>Test Tip:</strong> Know how to calculate sales charges, when breakpoints apply, and the key differences between LOI and Rights of Accumulation. These are high-frequency exam topics.</p>
</div>

### Key Points to Remember

1. **POP = NAV + Sales Charge** (max 8.5% of POP)
2. **Forward pricing**: Orders filled at next calculated NAV
3. **LOI**: 90-day backdate, 13-month completion period
4. **Rights of Accumulation**: Based on current value including appreciation
5. **Investment clubs**: Do NOT qualify for breakpoints

### Practice Questions Preview

- Calculating sales charge as percentage of POP
- Determining which breakpoint applies to a purchase
- Scenarios involving LOI vs. Rights of Accumulation
- Tax implications of fund exchanges

---

## Summary

Mutual fund pricing centers on NAV (calculated daily) and POP (NAV plus sales charge). Open-end
funds use forward pricing and always trade at NAV, while closed-end funds trade continuously and can
trade at premiums or discounts.

Breakpoints, Letters of Intent, and Rights of Accumulation provide ways to reduce sales charges for
larger or ongoing investments. Understanding these mechanisms is essential for both the exam and
client service.

### Quick Reference

**Key Formulas:**

- NAV = (Total Assets - Total Liabilities) / Shares Outstanding
- POP = NAV + Sales Charge
- Sales Charge % = (POP - NAV) / POP

**Important Numbers:**

- Maximum sales charge: 8.5% of POP
- LOI backdate: 90 days
- LOI completion: 13 months

---

## Next Steps

- Proceed to Section 6.4: Fund Expenses and Share Classes
- Learn about 12b-1 fees and Class A, B, C shares
- Complete practice questions for this section
