---
chapter: 8
section: 3
title: 'Distribution Dates'
description:
  'Understanding dividend dates, stock splits, and why timing matters more than you think'
topics:
  - Cash Dividend Dates
  - Ex-Date and Record Date
  - Stock Splits and Stock Dividends
estimated_time: 20
difficulty: intermediate
last_updated: 2024-12-16
---

# Distribution Dates

## Introduction

On the morning of October 16, 2023, Apple stock opened about $1.24 lower than it had closed the day
before—and nobody panicked. The drop wasn't bad news or a market crash. It was the ex-dividend date,
and the stock price simply adjusted to reflect the quarterly dividend payment.

Dividends seem simple: company pays money, shareholders receive money. But the mechanics of who gets
paid and when create a calendar of dates that trips up new investors constantly. Buy a stock one day
too late, and you miss the dividend entirely. Misunderstand how stock splits work, and you'll think
your position just doubled or crashed.

This section covers the distribution dates you'll see on the exam—declaration date, record date,
ex-date, and payment date—and explains why the T+1 settlement change merged what used to be two
separate dates into one. We'll also cover stock splits and stock dividends, which follow slightly
different rules.

## Learning Objectives

By the end of this section, you'll be able to:

- Identify the four key dates in a cash dividend distribution
- Determine the last day to buy stock and receive the dividend
- Explain why ex-date and record date are now the same for cash dividends
- Understand how stock splits and stock dividends affect share price
- Apply the different ex-date rules for splits versus cash dividends

---

## Cash Dividend Dates

When a company's board of directors decides to pay a cash dividend, they don't just mail checks
randomly. The announcement establishes a specific sequence of dates:

### The Four Key Dates

**Declaration Date:** The date the board announces the dividend—how much per share, who's eligible,
and when it will be paid.

**Record Date:** The date by which you must be an <span class="key-term">owner of record</span> to
receive the dividend. Your trade must have settled by this date.

**Ex-Date (Ex-Dividend Date):** The first date on which it's too late to buy the stock and receive
the dividend.

**Payment Date (Payable Date):** The date dividend checks are mailed (or electronic payments made)
to the owners of record.

### Sample Dividend Announcement

> **Monday, March 31, 20XX**
>
> The Board of Directors of Acme Manufacturing Company today declares a dividend of 50 cents per
> share to stockholders of record on April 8, 20XX. The dividend will be paid on April 23, 20XX.

From this announcement, we know:

- Declaration date: March 31
- Record date: April 8
- Payment date: April 23
- Ex-date: Also April 8 (same as record date under T+1 settlement)

### Ex-Date and Record Date Are Now the Same

Here's where the T+1 settlement change matters: with T+1 settlement, the
<span class="key-term">ex-date</span> and the <span class="key-term">record date</span> are now the
same day for cash dividends.

Previously, with T+2 settlement, the ex-date was one business day before the record date. You'd hear
about stocks going "ex-dividend" on a different day than the record date. That's no longer the case.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> On the exam, if you see "ex-date," think "record date." They're the same day for cash dividends now. The key is that you must buy the stock at least one business day BEFORE the record date for your trade to settle in time.</p>
</div>

### When Must You Buy to Receive the Dividend?

To receive the dividend, you must be an owner of record on the record date. Since regular way
settlement is T+1, your trade must occur at least one business day before the record date.

**Example using the Acme dividend:**

- Record date: Tuesday, April 8
- Last day to buy and receive dividend: Monday, April 7
- If you buy on April 8 (the record date itself), your trade settles April 9—too late

```
              APRIL
  S   M   T   W   T   F   S
         [1]  2   3   4   5
  6  (7) {8}  9  10  11  12
 13  14  15  16  17  18  19
 20  21  22 [23] 24  25  26
 27  28  29  30   1   2   3

[1] = Declaration Date (March 31 announced)
(7) = Last day to buy and receive dividend
{8} = Record Date / Ex-Date
[23] = Payment Date
```

### Sample Exam Question

**Question:** Sharon is going to purchase 100 shares of AAPL. If the record date is on Tuesday, July
15, by when must she purchase the shares to receive the dividend?

**Answer:** Monday, July 14. That's one business day before the record date. If she buys on or
before July 14, her trade settles by July 15, and she'll be an owner of record.

### Price Adjustment on Ex-Date

On the morning of the ex-date (which is now the record date), the stock price typically opens lower
by approximately the dividend amount. This makes sense: the company has announced it will pay out
cash, reducing its net worth by that amount.

If Acme closes at $50.50 on April 7, it might open around $50.00 on April 8 (reflecting the $0.50
dividend leaving the company). The shareholder who owned the stock gets a $50 stock plus $0.50
cash—same total value.

### Selling Dividends Is Prohibited

This price adjustment creates a trap for unsophisticated investors, and regulators know it.

<span class="key-term">Selling dividends</span>—enticing a customer to buy stock purely to receive
an upcoming dividend—is prohibited. Why? Because the customer doesn't actually benefit. They pay
full price for the stock, receive the dividend, and the stock drops by the dividend amount. Net
result: the same position they would have had if they bought after the ex-date, but now they owe tax
on the dividend.

Meanwhile, the broker collected a commission on a trade that generated no real value for the
customer. That's why it's prohibited.

<div class="info-box">
  <p><strong>The math:</strong> Buy stock at $50, receive $0.50 dividend, stock drops to $49.50. You have $50 total value. OR: Buy stock at $49.50 after ex-date. You have $49.50. The only difference? In the first scenario, you owe tax on that $0.50 "gain."</p>
</div>

---

## Dividend Dates Summary Table

<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>Declaration Date</th>
        <th>Ex-Date</th>
        <th>Record Date</th>
        <th>Payment Date</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>The date a company (1) declares it will pay a dividend and (2) sets the record date and payment date.</td>
        <td>The date on which it is too late to buy the stock in time to get the dividend. Since regular way settlement became T+1, this is the same as the record date.</td>
        <td>The date set by the company that determines who will receive a dividend. Buyers whose trades have settled on or before the record date will be entitled to the dividend.</td>
        <td>The date, set by the company, on which a declared stock dividend is scheduled to be paid; also known as the payable date.</td>
      </tr>
    </tbody>
  </table>
</div>

---

## Stock Splits and Stock Dividends

Stock splits and stock dividends look similar—both result in shareholders owning more shares at a
lower price—but they work differently from cash dividends.

### Forward Stock Splits

A <span class="key-term">forward stock split</span> increases the number of shares outstanding while
proportionally reducing the price. A 2-for-1 (2:1) split means:

- Every shareholder receives 2 new shares for each share owned
- The stock price is cut in half

If you owned 100 shares at $80 before a 2:1 split, you'd own 200 shares at $40 after. Total value:
$8,000 either way.

### Reverse Stock Splits

A <span class="key-term">reverse stock split</span> does the opposite: reduces shares outstanding
while increasing the price. A 1-for-10 reverse split means:

- Every 10 shares become 1 share
- The stock price multiplies by 10

Companies use reverse splits when their stock price gets too low—often to maintain exchange listing
requirements (exchanges have minimum price thresholds).

### Stock Dividends

A <span class="key-term">stock dividend</span> is similar to a forward split but typically smaller.
A 10% stock dividend gives shareholders 10 additional shares for every 100 owned. Like splits, the
price adjusts proportionally—no change in total value.

### The Critical Difference: Ex-Date for Splits and Stock Dividends

Here's where the exam can trip you up: the ex-date for stock splits and stock dividends is handled
differently than for cash dividends.

For cash dividends: Ex-date = Record date (same day under T+1)

For stock splits and stock dividends: Ex-date = The business day AFTER the payment date

Why the difference? With cash dividends, you want to know who gets the cash before it's paid. With
stock splits, the company issues new shares on the payment date—and only after those new shares
exist can the stock trade at the new, split-adjusted price. So the ex-date comes after the payment
date.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> This is a favorite exam topic. Remember:<br>
  • Cash dividends: Ex-date = Record date (under T+1)<br>
  • Stock splits/dividends: Ex-date = Day AFTER payment date</p>
</div>

### No Change in Total Value

Whether it's a forward split, reverse split, or stock dividend, the shareholder's total position
value doesn't change immediately. You end up with more (or fewer) shares at a proportionally
adjusted price.

The company isn't giving you free money—it's just slicing the pie into more (or fewer) pieces. The
total pie stays the same size.

<div class="info-box">
  <p><strong>Why do companies split stock?</strong> Mostly psychology. A $300 stock "feels" expensive to retail investors, even though buying 1 share of a $300 stock is economically identical to buying 3 shares of a $100 stock. Companies like Apple and Tesla have split specifically to make shares feel more accessible—even though fractional shares have made the issue largely moot.</p>
</div>

---

## Summary

Important points to remember:

- **Four dividend dates:** Declaration (announced), Record (must own by), Ex-date (too late to buy),
  Payment (checks mailed)
- **Ex-date = Record date** for cash dividends under T+1 settlement
- **Buy ONE business day before** the record date to receive the dividend
- **Stock price drops** by approximately the dividend amount on the ex-date
- **Selling dividends** (recommending purchases just for the dividend) is prohibited
- **Forward splits** increase shares, decrease price; **reverse splits** decrease shares, increase
  price
- **Stock dividends** are similar to small forward splits
- **Total value doesn't change** from splits or stock dividends
- **Ex-date for splits/stock dividends** is the day AFTER the payment date (different from cash
  dividends!)
