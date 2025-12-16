---
chapter: 8
section: 1
title: "Order Tickets and Prohibited Trading Practices"
description: "Understanding order ticket requirements, Regulation SHO, and the trading practices that will get you fired (or worse)"
topics:
  - Order Ticket Requirements
  - Regulation SHO
  - Best Execution
  - Prohibited Trading Practices
  - Market Manipulation
estimated_time: 25
difficulty: intermediate
last_updated: 2024-12-16
---

# Order Tickets and Prohibited Trading Practices

## Introduction

In 2015, a trader at Citadel Securities fat-fingered an order and accidentally bought $15 billion worth of stock in a single trade. The firm caught the error and unwound the position within minutes—but not before it briefly moved markets and triggered a wave of confused calls to compliance departments across Wall Street.

The order ticket is where every trade begins. It's a deceptively simple document—just a few data fields—but it serves as the permanent record of what happened, when, and why. Get it wrong, and you've got a compliance nightmare. Get it really wrong, and you've got the SEC knocking on your door.

This section covers what goes on an order ticket, why each field matters, and the trading practices that regulators have explicitly banned because they're either unfair, manipulative, or both. These aren't academic concerns—the rules exist because people actually tried these schemes, and some still do.

## Learning Objectives

By the end of this section, you'll be able to:
- Identify the required information on order tickets
- Understand Regulation SHO and short sale requirements
- Distinguish between discretionary and market not held orders
- Recognize prohibited trading practices and market manipulation schemes
- Apply best execution requirements

---

## Order Ticket Requirements

Every trade starts with an order ticket. Before the days of electronic trading, these were literal paper tickets that traders would fill out by hand. Today, the "ticket" is usually a digital record, but the required information hasn't changed much.

### Essential Order Information

The order ticket must specify the following:

**Buy or Sell:**
- <span class="key-term">Buy</span> = taking a long position
- <span class="key-term">Sell long</span> = selling stock you already own
- <span class="key-term">Sell short</span> = selling borrowed shares (both "Sell" and "Short" are marked)

**Security Name:** Typically the ticker symbol—AAPL, not "Apple Inc."

**Order Size:** Number of shares (usually in round lots of 100), option contracts, or bonds

**Duration:**
- <span class="key-term">Day order</span> = expires at market close
- <span class="key-term">Good-til-canceled (GTC)</span> = remains active until filled or canceled

### Discretionary vs. Not Held Orders

Here's a distinction the exam loves:

A <span class="key-term">discretionary order</span> gives the representative authority to choose what security to buy and/or how much to trade. If a customer says, "Buy $10,000 of a good high-tech stock," that's discretionary—the rep picks the stock. Discretionary accounts require:
- Written power of attorney from the customer
- Principal approval before the account is opened
- Principal approval of each trade

But what if the customer says, "Buy 1,000 shares of XYZ when it looks good to you"? The security and amount are specified—only the timing and price are left to the rep's judgment. This is a <span class="key-term">market not held order</span>, which is not considered discretionary.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> The key to distinguishing discretionary from not held: if the security and amount are specified, it's not discretionary. The rep having discretion over price or timing alone doesn't make the order discretionary.</p>
</div>

### Additional Required Information

The ticket must also include:
- **Execution price:** For limit orders, stop orders, or stop-limit orders (not required for market orders)
- **Solicited or unsolicited:** Did the rep recommend the trade, or did the customer initiate it?
- **Manager approval:** All orders must be approved by a principal—promptly, which typically means by end of day
- **Rep's name:** Who handled the order
- **Customer name and account number:** Self-explanatory, but critical for record-keeping

### Alterations to Executed Orders

Under <span class="key-term">FINRA rules</span>, changing an executed order ticket isn't something you can do casually. Any alteration requires:
- Written approval from a branch manager or compliance officer
- Documentation of the essential facts and the reason for the change

This isn't bureaucratic box-checking—it prevents falsified records. If someone could quietly change order tickets after the fact, the entire audit trail becomes meaningless.

---

## Short Sales and Regulation SHO

When you sell stock you don't own—borrowing shares to sell now, hoping to buy them back cheaper later—you're <span class="key-term">selling short</span>. It's a legitimate trading strategy, but it's also been used for market manipulation since the 1600s.

<span class="key-term">Regulation SHO</span>, adopted by the SEC, requires that:
- Every order to sell must be marked as either a long sale or a short sale
- For short sales, the broker must locate the shares to be borrowed before the sale
- Borrowed shares must be delivered on settlement

The "locate" requirement matters. Before Reg SHO, some traders would short stocks without actually borrowing the shares, creating phantom supply that could drive down prices—a practice called "naked short selling." The rule forces brokers to confirm that shares can actually be delivered.

<div class="info-box">
  <p><strong>Why mark orders long or short?</strong> Regulators track short selling to monitor market stability. When short interest in a stock gets unusually high, it can signal that sophisticated traders see trouble ahead—or that manipulative activity is underway.</p>
</div>

---

## Prohibited Trading Practices

Now we get to the fun part: the practices that will end your career and potentially land you in prison. These rules exist because people actually tried—and sometimes still try—these schemes.

### Best Execution

When executing customer orders, a firm must obtain the <span class="key-term">best outcome</span> for the customer. Price matters, but it's not the only factor. Firms should consider:
- The character of the market (price, volatility, liquidity)
- The size and type of transaction
- The number of markets checked
- The firm's accessibility to various markets and quotation sources

Failure to provide best execution violates <span class="key-term">FINRA rules</span>. It's one of the most common violations regulators find.

### Customer Orders Have Priority

Simple rule: customer orders come first. A firm cannot give preference to its own proprietary trading account over customer orders—that's <span class="key-term">trading ahead</span>.

Example: Your firm holds a customer limit order to buy 100 shares of ABC at $21. The stock drops to $21 and becomes available. You cannot buy ABC for the firm's account at $21 before filling the customer's order.

### Front Running

<span class="key-term">Front running</span> is trading ahead of large block orders. If an institutional client is about to buy 500,000 shares—which will likely push the price up—the firm cannot buy shares for itself first and profit from the anticipated price movement.

This is insider trading adjacent. You're using non-public information about pending orders to trade ahead of the market impact.

### Trading Ahead of Research Reports

If your firm's research department is about to publish a report recommending XYZ stock—which will likely move the price—the firm cannot trade based on advance knowledge of that recommendation. Once the research is publicly disseminated, the restriction lifts.

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>The Chinese wall between research and trading exists because of spectacular conflicts of interest during the dot-com bubble. Analysts publicly recommended stocks while privately calling them garbage, generating investment banking fees for their firms. The 2003 Global Research Analyst Settlement extracted $1.4 billion in fines and fundamentally restructured how research departments operate.</p>
</div>

### Acting as Both Broker and Dealer

A firm can act as a <span class="key-term">broker (agent)</span> or a <span class="key-term">dealer (principal)</span> on a transaction—but not both. Why? Because:
- As broker, the firm earns a commission
- As dealer, the firm earns a markup or markdown

If you charge both a commission AND a markup on the same trade, that's a <span class="key-term">hidden profit</span>—and it's prohibited. The customer wouldn't know they're being double-charged.

### No Interpositioning

When your firm receives a customer order, you go to the market maker. You do not route the order through another firm that then goes to the market maker—unless doing so would result in a better price for the customer.

<span class="key-term">Interpositioning</span> a second firm adds an extra layer of costs (the second firm wants their cut too). It's only permitted when it genuinely benefits the customer, which is rare.

### Backing Away from a Firm Quote

If a market maker posts a quote, they must honor it. Posting a bid of $10.00 and then refusing to buy at that price when someone tries to sell is <span class="key-term">backing away</span>—and FINRA explicitly prohibits it. Your quote is your commitment.

---

## Market Manipulation

Manipulation of the market is prohibited in any form. Some schemes have been around since the South Sea Bubble of 1720. Here are the ones you need to know:

### Trading Pools (Pump and Dump)

A group of traders coordinates to buy a security at successively higher prices, creating the appearance of genuine demand. Outside investors see the activity, assume something good is happening, and pile in. At that point, pool members sell their shares at artificially inflated prices—leaving the latecomers holding the bag.

Also called <span class="key-term">circling</span> a stock or <span class="key-term">pump and dump</span>. It's fraud, full stop.

### Wash Trades (Painting the Tape)

<span class="key-term">Wash trades</span> involve buying and selling the same security repeatedly with no actual change in ownership. The purpose? Creating the appearance of trading activity where none exists. The trades "wash out"—you end up right where you started, but the consolidated tape shows volume that isn't real.

This is sometimes called <span class="key-term">painting the tape</span>—you're literally creating false entries on the trade reporting system.

### Marking the Close / Marking the Open

<span class="key-term">Marking the close</span> means trading at or near market close, or falsely reporting trades at the close, specifically to affect the closing price. Many derivatives, fund valuations, and margin calculations depend on closing prices—manipulating them has cascading effects.

<span class="key-term">Marking the open</span> is the same scheme at market open.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> For the exam, know that all market manipulation schemes share a common element: creating a false or misleading appearance of market activity or prices. The specific names matter less than understanding what makes the activity manipulative.</p>
</div>

---

## Summary

Important points to remember:

- **Order tickets** must include: buy/sell, security name, size, duration, price (for limit orders), solicited/unsolicited, manager approval, rep name, and customer info
- **Discretionary orders** require written authorization and principal approval; "market not held" orders are not considered discretionary
- **Regulation SHO** requires marking sales as long or short, and locating borrowed shares before short selling
- **Best execution** means obtaining the best overall outcome for customers—not just the best price
- **Customer orders have priority** over firm proprietary trading
- **Front running** and **trading ahead of research** exploit non-public information about pending activity
- **Hidden profits** occur when a firm acts as both broker and dealer on the same trade
- **Market manipulation** includes pump and dump, wash trades, and marking the close/open

