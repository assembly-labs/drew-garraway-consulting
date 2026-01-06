---
section: 3
subsection: "options"
chapter: 1
lesson: 1
title: "Options Basics"
description: "Understanding what options are and how they work"
topics:
  - What is an option
  - Calls vs. puts
  - Buyers vs. sellers
  - Rights vs. obligations
  - Contract specifications
estimated_time: 25
difficulty: beginner
calculation_heavy: false
last_updated: 2026-01-06
---

# Options Basics

## Introduction

On April 26, 1973, the Chicago Board Options Exchange opened for trading. That first day, 911 contracts changed hands—all of them call options on just 16 stocks. The traders on the floor probably didn't realize they were launching what would become one of the most important financial markets in the world.

Today, options trade in the billions of contracts annually. They're used for speculation, hedging, income generation, and complex strategies that would make those 1973 traders' heads spin. But underneath all that complexity, every option still does the same simple thing: it gives someone a choice.

That's what "option" means. A choice. And understanding who has that choice—and who doesn't—is the key to everything else.

## Learning Objectives

By the end of this lesson, you'll be able to:
- Define what an option contract is and identify its key components
- Distinguish between call options and put options
- Explain the difference between option buyers and sellers
- Identify who has rights and who has obligations in an options contract
- Understand basic contract specifications (size, expiration, strike price)

---

## What Is an Option?

An <span class="key-term">option</span> is a contract that gives the buyer the right—but not the obligation—to buy or sell an underlying asset at a specified price before a specified date.

Let's break that down:

- **Contract**: It's an agreement between two parties
- **Buyer has a right**: They can choose to do something, but don't have to
- **Underlying asset**: Usually stock, but can be indexes, ETFs, etc.
- **Specified price**: Called the <span class="key-term">strike price</span> or exercise price
- **Specified date**: Called the <span class="key-term">expiration date</span>

<div class="info-box">
  <div class="info-box__title">Real-World Analogy</div>
  <p>Think of a stock option like a coupon for a free pizza that expires in 30 days. You have the right to get that pizza at the stated price—but you don't have to use it. If a better deal comes along, you can let the coupon expire. The pizza shop, however, must honor the coupon if you present it.</p>
</div>

---

## Calls and Puts: The Two Types

There are only two types of options. Learn these cold:

### Call Options

A <span class="key-term">call option</span> gives the buyer the right to **BUY** the underlying stock at the strike price.

- Call buyers are **bullish**—they want the stock to go UP
- If the stock rises above the strike price, the call becomes valuable
- Memory aid: "**Call** the stock **to** you" (you're buying it)

### Put Options

A <span class="key-term">put option</span> gives the buyer the right to **SELL** the underlying stock at the strike price.

- Put buyers are **bearish**—they want the stock to go DOWN
- If the stock falls below the strike price, the put becomes valuable
- Memory aid: "**Put** the stock **to** someone else" (you're selling it)

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <table>
    <thead>
      <tr>
        <th>Option Type</th>
        <th>Buyer's Right</th>
        <th>Market Outlook</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Call</strong></td>
        <td>Right to BUY at strike</td>
        <td>BULLISH (wants price UP)</td>
      </tr>
      <tr>
        <td><strong>Put</strong></td>
        <td>Right to SELL at strike</td>
        <td>BEARISH (wants price DOWN)</td>
      </tr>
    </tbody>
  </table>
</div>

---

## Buyers and Sellers: Who's Who

Every option contract has two parties:

### The Buyer (Long Position)

- **Pays the premium** (the price of the option)
- **Has rights** (can choose whether to exercise)
- **Has limited risk** (can only lose what they paid)
- Also called: holder, owner, long

### The Seller (Short Position)

- **Receives the premium** (collects payment)
- **Has obligations** (must fulfill if buyer exercises)
- **Has higher risk** (particularly for naked calls)
- Also called: writer, short

<div class="historical-note">
  <div class="historical-note__label">Why "Writer"?</div>
  <p>The term "writer" comes from the early days of options when the seller literally wrote out the contract. The writer creates the option—they're the one taking on the obligation in exchange for premium income.</p>
</div>

---

## Rights vs. Obligations

This is the most important concept in options:

| Party | Has Rights? | Has Obligations? |
|-------|-------------|------------------|
| **Buyer (Long)** | YES—can exercise or not | NO—it's their choice |
| **Seller (Short)** | NO—must wait for buyer | YES—must perform if assigned |

### What This Means in Practice

**For Call Buyers:**
- If stock goes up: Can exercise and buy at the lower strike price
- If stock goes down: Let the option expire, lose only the premium

**For Call Sellers (Writers):**
- If stock goes up: Must sell at the lower strike price if assigned
- If stock goes down: Keep the premium, obligation disappears at expiration

**For Put Buyers:**
- If stock goes down: Can exercise and sell at the higher strike price
- If stock goes up: Let the option expire, lose only the premium

**For Put Sellers (Writers):**
- If stock goes down: Must buy at the higher strike price if assigned
- If stock goes up: Keep the premium, obligation disappears at expiration

<div class="test-tip">
  <p><strong>Test Tip:</strong> When a question asks about "maximum loss" or "maximum gain," always ask: Is this person the buyer or seller? Buyers can only lose what they paid. Sellers can only gain what they received (but might lose much more).</p>
</div>

---

## Contract Specifications

### Contract Size

One standard equity option contract covers **100 shares** of the underlying stock.

This is critical for calculations:
- Option premium of $3 = $300 per contract ($3 × 100)
- If you buy 5 contracts, you're controlling 500 shares

### Strike Price

The <span class="key-term">strike price</span> (or exercise price) is the price at which the option buyer can buy (call) or sell (put) the underlying stock.

Strike prices are standardized:
- Stocks under $25: $2.50 intervals
- Stocks $25-$200: $5 intervals
- Stocks over $200: $10 intervals

### Expiration

The <span class="key-term">expiration date</span> is when the option contract ends. After this date:
- The option ceases to exist
- Rights and obligations terminate
- Any remaining value is lost if not exercised

Standard equity options expire on the third Friday of the expiration month.

---

## The Four Basic Positions

Every options strategy starts with one of these four positions:

| Position | Direction | Pays/Receives | Wants Stock To... |
|----------|-----------|---------------|-------------------|
| **Long Call** | Bullish | Pays premium | Rise above strike |
| **Short Call** | Bearish/Neutral | Receives premium | Stay below strike |
| **Long Put** | Bearish | Pays premium | Fall below strike |
| **Short Put** | Bullish/Neutral | Receives premium | Stay above strike |

We'll explore each position in detail in the next lessons.

---

## Common Misconceptions

1. **Misconception**: Options are only for speculation
   - **Reality**: Options are used for hedging (protection), income generation, and leverage. Many conservative strategies use options.

2. **Misconception**: Buying options is extremely risky
   - **Reality**: Buying options has limited, defined risk (you can only lose the premium). Selling naked options is where unlimited risk exists.

3. **Misconception**: All options expire worthless
   - **Reality**: Statistics vary, but many options are closed before expiration. Whether an option expires worthless depends on the strategy—for sellers, that's often the goal.

---

## Test Preparation

<div class="test-tip">
  <p><strong>Test Tip:</strong> The exam loves to test rights vs. obligations. If a question asks what a call buyer CAN do, they have rights. If it asks what a put SELLER MUST do, they have obligations. Watch the language carefully.</p>
</div>

### Key Points to Remember

1. **Call = right to BUY; Put = right to SELL** (for the buyer)
2. **Buyers pay premium and have rights; sellers receive premium and have obligations**
3. **One contract = 100 shares** (always multiply premium by 100)
4. **Expiration = third Friday** of the expiration month

### Exam Traps to Avoid

- Confusing buyer vs. seller rights
- Forgetting to multiply by 100
- Mixing up bullish and bearish
- Not understanding that sellers MUST perform if exercised

---

## Summary

An option is a contract giving the buyer the right—but not the obligation—to buy (call) or sell (put) an underlying asset at a specified strike price before expiration. The buyer pays a premium for this right. The seller receives the premium but takes on the obligation to fulfill the contract if exercised.

Every options question on your exam starts with understanding these basics. Call buyers are bullish. Put buyers are bearish. Buyers have rights. Sellers have obligations. One contract equals 100 shares.

Get this framework solid, and the strategies and calculations will make sense.

### Quick Reference

**Key Terms:**
- <span class="key-term">Call Option</span>: Right to BUY at strike price
- <span class="key-term">Put Option</span>: Right to SELL at strike price
- <span class="key-term">Strike Price</span>: Exercise price of the option
- <span class="key-term">Premium</span>: Price paid for the option
- <span class="key-term">Expiration</span>: Date the option contract ends

**Critical Numbers:**
- 100 shares per contract
- Third Friday expiration (standard)

---

## Next Steps

- Complete the Lesson 1 Quiz
- Continue to Lesson 2: Calls and Puts in Depth
- Begin the Options Terms Flashcards
