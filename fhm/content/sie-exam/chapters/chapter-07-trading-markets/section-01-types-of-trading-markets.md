---
chapter: 7
section: 1
title: 'Types of Trading Markets'
description:
  'Understanding the four secondary markets, how securities trade, and the difference between
  brokers and dealers'
topics:
  - Overview of Trading Markets
  - First Market - Exchange Trading
  - Second Market - OTC Trading
  - Third Market - OTC Trading of Listed Securities
  - Fourth Market - Institutional Trading
  - Brokers vs. Dealers
  - Markups, Markdowns, and Commissions
estimated_time: 30
difficulty: intermediate
last_updated: 2024-12-14
---

# Types of Trading Markets

## Introduction

On May 17, 1792, twenty-four stockbrokers gathered under a buttonwood tree on Wall Street and signed
an agreement to trade securities only among themselves and to charge fixed commissions. That simple
handshake deal became the New York Stock Exchange.

Two centuries later, the trading floor that once echoed with shouting brokers has gone mostly
silent. Today, the vast majority of trades execute in milliseconds across computer networks
scattered around the world. The buttonwood tree is long gone, but the fundamental question remains
the same: where do buyers and sellers meet?

The answer, it turns out, is more complicated than you might expect. Securities don't trade in one
unified marketplace—they trade across a patchwork of exchanges, electronic networks, and private
systems, each with its own rules, participants, and quirks. Understanding this landscape is
essential for the SIE exam and for anyone working in the securities industry.

## Learning Objectives

By the end of this section, you'll be able to:

- Distinguish between primary and secondary markets
- Identify the four submarkets of the secondary market and their characteristics
- Explain the differences between auction markets and negotiated markets
- Understand the roles of brokers versus dealers and how each is compensated
- Apply the FINRA 5% markup policy and know its exceptions

---

## Overview of Trading Markets

Before diving into the four submarkets, let's establish the basic framework. Securities trade in two
broad categories:

The <span class="key-term">primary market</span> is where new issues are sold to the public for the
first time—think IPOs and new bond offerings. Money flows directly to the issuer. Once those
securities are in investors' hands, they enter the <span class="key-term">secondary market</span>,
where previously issued securities are traded among investors. The issuing company doesn't see a
dime from secondary market trades.

The secondary market is where things get interesting. It's divided into four distinct submarkets:

```
                    Secondary Market
                          |
    ┌─────────────┬───────────────┬─────────────┐
    |             |               |             |
First Market  Second Market  Third Market  Fourth Market
    |             |               |             |
 Exchanges      OTC           OTC Trading    Institutional
(NYSE, Nasdaq)  (Unlisted)    of Listed      (Dark Pools)
                              Securities
```

Each serves a different purpose, trades different securities, and operates under different rules.
Let's examine each one.

---

## First Market: Exchange Trading

The <span class="key-term">first market</span> consists of the major stock exchanges—structured,
standardized, regulated marketplaces where securities are bought and sold.

### Listing Standards

Not every company can trade on an exchange. Exchanges set <span class="key-term">listing
standards</span>—minimum requirements for share price, market capitalization, earnings history, and
corporate governance. Meet the standards, and your stock becomes <span class="key-term">listed
securities</span>. Fail to maintain them, and you get delisted.

Exchanges are <span class="key-term">self-regulatory organizations (SROs)</span>, meaning they
create and enforce their own rules under SEC oversight. Think of them as private clubs with strict
membership requirements and house rules.

### The New York Stock Exchange

The <span class="key-term">New York Stock Exchange (NYSE)</span> remains the world's largest stock
exchange by market capitalization. Over the years, it has absorbed other exchanges, including the
American Stock Exchange (AMEX), now renamed NYSE American. The NYSE itself is now owned by the
<span class="key-term">Intercontinental Exchange (ICE)</span>, which owns exchanges around the
world.

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>The NYSE operated as a member-owned nonprofit for over 200 years before going public in 2006. The shift to for-profit status was controversial—critics argued that exchanges shouldn't prioritize shareholder returns over market integrity. Supporters countered that competition required capital investment that only public ownership could provide.</p>
</div>

Traditionally, the NYSE operated as an <span class="key-term">auction market</span>. Buyers and
sellers submitted competing bids and offers, and the best prices won. The person running the
auction? The <span class="key-term">Designated Market Maker (DMM)</span>.

**DMMs** are wholesalers of securities assigned to specific stocks. They maintain orderly markets by
keeping track of outstanding orders and facilitating trades. When necessary, they'll buy or sell
from their own inventory to keep markets functioning smoothly. In exchange, they get first crack at
the spread.

### The Nasdaq Stock Market

While the NYSE clung to its trading floor, <span class="key-term">Nasdaq</span> went fully
electronic from the start. Launched in 1971 as the world's first electronic stock market, Nasdaq
operates as a <span class="key-term">negotiated market</span>.

The difference matters:

- **NYSE (auction)**: One DMM per stock, competing bids and offers
- **Nasdaq (negotiated)**: Multiple <span class="key-term">market makers</span> per stock, each
  posting their own prices

A Nasdaq stock might have dozens of market makers competing to offer the best prices. This
competition generally benefits investors—more market makers typically means tighter spreads.

### Price Transparency: CQS and the Consolidated Tape

With securities trading across multiple venues, how do investors know they're getting the best
price? Two systems help:

The <span class="key-term">Consolidated Quotation Service (CQS)</span> collects and displays current
price quotes from all exchanges and market makers. It shows where the best bid and offer prices are,
regardless of venue.

The <span class="key-term">Consolidated Tape</span> reports actual trades after they occur. When you
see stock prices scrolling across the bottom of a financial news channel, that's consolidated tape
data.

### Options Exchanges

Options have their own exchanges, including the <span class="key-term">Chicago Board Options
Exchange (Cboe)</span> and the <span class="key-term">Philadelphia Stock Exchange (PHLX)</span>.
Unlike stocks, options almost never trade over-the-counter. The <span class="key-term">Options
Clearing Corporation (OCC)</span> guarantees standardized options contracts—but only those created
on exchanges.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> Remember that the OCC only guarantees exchange-traded options. Custom OTC options (exotic derivatives) aren't covered—and aren't tested on the SIE.</p>
</div>

---

## Second Market: Over-the-Counter (OTC) Trading

The <span class="key-term">second market</span> is the over-the-counter market for securities that
don't trade on exchanges. Think of it as the secondary market's back alley—less regulated, less
transparent, and considerably more risky.

### Why Trade OTC?

Some companies can't meet exchange listing requirements. Others choose not to—going public on a
major exchange is expensive and comes with significant regulatory burdens. OTC trading offers an
alternative.

### Bond Trading

Here's a surprise: almost all bonds trade OTC, including:

- Corporate bonds
- U.S. government bonds
- Municipal bonds
- Money market instruments

The government securities market is loosely regulated by the Federal Reserve through its
relationship with primary dealers. Municipal securities fall under the
<span class="key-term">Municipal Securities Rulemaking Board (MSRB)</span>, which maintains
<span class="key-term">EMMA (Electronic Municipal Market Access)</span>—a public website for
municipal bond pricing and disclosure.

### OTC Markets Group

For OTC stocks, <span class="key-term">OTC Markets Group</span> operates the primary quotation
system. Important distinction: OTC Markets Group is not an exchange and not an SRO. It simply
displays quotes. Actual trades are negotiated dealer-to-dealer, often by phone or electronic
message.

OTC Markets Group organizes stocks into three tiers based on disclosure quality:

<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>Tier</th>
        <th>Description</th>
        <th>Disclosure Requirements</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>OTCQX</strong></td>
        <td>Best Market</td>
        <td>Highest standards, SEC reporting or equivalent</td>
      </tr>
      <tr>
        <td><strong>OTCQB</strong></td>
        <td>Venture Market</td>
        <td>Less-seasoned companies, annual verification</td>
      </tr>
      <tr>
        <td><strong>OTC Pink</strong></td>
        <td>Open Market</td>
        <td>Minimal to no disclosure required</td>
      </tr>
    </tbody>
  </table>
</div>

OTC securities—especially Pink Market stocks—are typically thinly traded, volatile, and highly
speculative. Many are <span class="key-term">penny stocks</span>, named for share prices measured in
pennies rather than dollars. If the OTC market is the back alley, the Pink Market is the dumpster
behind it.

---

## Third Market: OTC Trading of Exchange-Listed Securities

Wait—if a stock is listed on the NYSE, doesn't it have to trade there? Not necessarily.

The <span class="key-term">third market</span> is where listed securities trade over-the-counter,
outside the exchanges. This creates competition for traditional exchanges, often benefiting
institutional investors who can negotiate better prices for large orders.

### Electronic Communication Networks (ECNs)

Most third market trading happens through <span class="key-term">Electronic Communication Networks
(ECNs)</span>, a type of <span class="key-term">Alternative Trading System (ATS)</span>. ECNs are
broker-dealers that match buyers and sellers electronically, displaying prices and executing trades
without routing through an exchange.

ECNs serve primarily institutional investors and market makers, though some accept retail orders.
The key advantage: speed and potentially better pricing.

### Best Execution Requirement

Here's where it gets important: the SEC requires broker-dealers to route orders to wherever they'll
get the best price. If a third market maker offers a better price than the NYSE floor, the order
must go to the third market maker.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>Suppose you want to buy 1,000 shares of a stock listed on the NYSE. The NYSE is showing an ask of $50.05, but an ECN is offering the same shares at $50.02. Your broker must route your order to the ECN, saving you $30 on the trade.</p>
</div>

This best execution requirement fundamentally changed how markets work. It's why the NYSE trading
floor, once packed with thousands of brokers, now hosts mostly tourists and TV cameras.

---

## Fourth Market: Institutional Trading

The <span class="key-term">fourth market</span> is where institutions trade directly with each
other, cutting out brokers entirely. When Fidelity wants to sell a million shares of Apple to
Vanguard, they don't need an intermediary.

### Dark Pools

The most controversial fourth market venues are <span class="key-term">dark pools</span>—private
trading systems that don't display quotes publicly. The investing public has no knowledge of orders
or trades until after they execute.

Why the secrecy? Consider what happens when word gets out that a major institution wants to sell a
huge block of stock. Other traders front-run the order, selling ahead of the institution and driving
the price down. Dark pools prevent this by keeping orders hidden until execution.

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>Dark pools emerged in the 1980s but exploded after the SEC's Regulation NMS in 2005. By 2024, dark pools handle roughly 15-18% of all U.S. equity trading volume. Critics argue they create a two-tiered market where institutional investors get better information than retail investors. Defenders counter that they reduce market impact costs and ultimately benefit everyone through lower transaction costs.</p>
</div>

### After-Hours Trading

Many ATSs operate 24 hours a day, allowing trades when the NYSE and Nasdaq are closed. But
after-hours trading comes with significant risks:

- **Less liquidity**: Fewer buyers and sellers means harder execution
- **Wider spreads**: Less competition means you pay more to trade
- **Higher volatility**: Thin trading amplifies price swings
- **Stale prices**: Quotes may not reflect current market conditions

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> The exam loves to test after-hours trading risks. Remember: less liquid, wider spreads, more volatile.</p>
</div>

---

## The Four Markets: A Summary

<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>Market</th>
        <th>Type</th>
        <th>Securities Traded</th>
        <th>Regulator</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>First</strong></td>
        <td>Auction (exchanges)</td>
        <td>Exchange-listed</td>
        <td>Exchanges (NYSE, Nasdaq, Cboe)</td>
      </tr>
      <tr>
        <td><strong>Second</strong></td>
        <td>Negotiated (OTC)</td>
        <td>Unlisted</td>
        <td>FINRA</td>
      </tr>
      <tr>
        <td><strong>Third</strong></td>
        <td>Negotiated (OTC)</td>
        <td>Exchange-listed</td>
        <td>FINRA</td>
      </tr>
      <tr>
        <td><strong>Fourth</strong></td>
        <td>Negotiated (ATS/dark pools)</td>
        <td>Listed and unlisted</td>
        <td>FINRA</td>
      </tr>
    </tbody>
  </table>
</div>

---

## Brokers and Dealers: Two Hats, Different Rules

Most securities firms are registered as <span class="key-term">broker-dealers</span>, meaning they
can act in either capacity depending on the transaction. Understanding the difference matters—both
for the exam and for understanding how you're actually paying for trades.

### Acting as Broker (Agent)

When a firm acts as a <span class="key-term">broker</span>, it's functioning as an agent—a
matchmaker connecting buyers and sellers. Think of a real estate agent: they find buyers for sellers
and sellers for buyers, but they don't own the property.

As a broker:

- The firm holds no inventory
- Takes no market risk
- Earns a <span class="key-term">commission</span> for successful matches
- If no match is found, no compensation is earned

### Acting as Dealer (Principal)

When a firm acts as a <span class="key-term">dealer</span>, it trades from its own inventory as a
<span class="key-term">principal</span>. The firm is the counterparty to your trade—when you buy,
you're buying from them; when you sell, you're selling to them.

As a dealer:

- The firm maintains inventory
- Bears market risk if positions lose value
- Earns compensation through <span class="key-term">markups</span> and
  <span class="key-term">markdowns</span>
- Posts two-sided quotes showing willingness to buy and sell

### Understanding Spreads, Markups, and Markdowns

Market makers post <span class="key-term">two-sided quotes</span>: a <span class="key-term">bid
price</span> (what they'll pay to buy) and an <span class="key-term">ask price</span> (what they'll
accept to sell). The difference is the <span class="key-term">spread</span>.

<div class="info-box">
  <div class="info-box__title">Quote Example</div>
  <p>A market maker posts: Bid $9.90 / Ask $10.00</p>
  <ul>
    <li>If you sell, you'll receive around $9.90 (minus any markdown)</li>
    <li>If you buy, you'll pay around $10.00 (plus any markup)</li>
    <li>The $0.10 spread is the market maker's potential gross profit</li>
  </ul>
</div>

When dealing with retail customers, dealers typically:

- **Mark down** from the bid when buying from you
- **Mark up** from the ask when selling to you

These markups and markdowns are how dealers get paid—they're the equivalent of a broker's
commission.

### The Hidden Profit Rule

Here's a critical rule: a firm cannot act as both broker AND dealer on the same transaction.
Charging a commission while also taking a markup is called a <span class="key-term">hidden
profit</span> and is prohibited.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> This is heavily tested. Either commission (agent) OR markup/markdown (principal)—never both on the same trade.</p>
</div>

### Broker vs. Dealer Comparison

<div class="comparison-table">
  <table>
    <thead>
      <tr>
        <th>Characteristic</th>
        <th>Broker (Agent)</th>
        <th>Dealer (Principal)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Role</strong></td>
        <td>Middleman/matchmaker</td>
        <td>Trade counterparty</td>
      </tr>
      <tr>
        <td><strong>Inventory</strong></td>
        <td>None</td>
        <td>Holds securities</td>
      </tr>
      <tr>
        <td><strong>Risk</strong></td>
        <td>None</td>
        <td>Market risk on positions</td>
      </tr>
      <tr>
        <td><strong>Compensation</strong></td>
        <td>Commission</td>
        <td>Markup/Markdown</td>
      </tr>
    </tbody>
  </table>
</div>

---

## FINRA's 5% Markup Policy

<span class="key-term">FINRA</span> regulates corporate securities trading in the secondary market.
Its <span class="key-term">5% markup policy</span> sounds straightforward: don't charge more than
5%.

Except that's not actually what it says.

The 5% is a guideline, not a cap. The actual rule requires that commissions and markups be "fair and
reasonable" based on the type and size of the transaction. A 3% markup on a large, liquid stock
might be excessive, while a 7% markup on a small, illiquid OTC stock might be reasonable.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> Two important exceptions to the 5% policy:</p>
  <ul>
    <li><strong>Mutual funds</strong> are exempt—their maximum sales charge is 8½%</li>
    <li><strong>Municipal bonds</strong> are exempt from FINRA's policy but subject to MSRB's similar "fair and reasonable" standard</li>
  </ul>
</div>

---

## Market Liquidity: Why It Matters

For markets to function, they need <span class="key-term">liquidity</span>—a ready supply of buyers
and sellers at all times. More participants means tighter spreads and better prices.

Compare:

- **NYSE blue chip**: Spread of $0.01 (Bid $4.25 / Ask $4.26)
- **OTC Pink stock**: Spread of $0.50 or more (Bid $1.00 / Ask $1.50)

The 50x difference in spread is the cost of illiquidity. That's why sophisticated investors care
deeply about where and how their orders execute—and why understanding trading markets matters for
your career.

---

## How Trades Actually Happen

Here's the reality that surprises many people: retail customers almost never trade directly with
market makers. The process works like this:

1. You place an order with your broker-dealer firm
2. The firm routes your order to their <span class="key-term">trading desk</span>
3. The trading desk finds the best available price
4. The trade executes electronically, usually in seconds
5. The firm charges a commission or markup for their service

Most retail investors are blissfully unaware of this process. They click "buy," the stock appears in
their account, and they never think about the dozen intermediaries who touched their order. Which,
frankly, is probably for the best.

---

## Test Preparation

### Key Points to Remember

1. **Primary vs. Secondary**: Primary = new issues to issuer; Secondary = existing securities
   between investors
2. **Four Markets**: First (exchanges), Second (OTC unlisted), Third (OTC listed), Fourth
   (institutional/dark pools)
3. **NYSE vs. Nasdaq**: Auction market with DMMs vs. negotiated market with multiple market makers
4. **Broker vs. Dealer**: Agent earns commissions, principal earns markups/markdowns
5. **Hidden Profit**: Cannot charge both commission AND markup on same transaction
6. **5% Policy**: Guideline, not rule; must be "fair and reasonable"; mutual funds and munis exempt
7. **After-hours risks**: Less liquid, wider spreads, more volatile

### Common Exam Questions

- Which market trades exchange-listed securities OTC? (Third market)
- What type of trading system doesn't display quotes? (Dark pools)
- How is a dealer compensated? (Markups and markdowns)
- What's the maximum sales charge for mutual funds? (8½%)
- Who regulates the second, third, and fourth markets? (FINRA)

---

## Summary

### Quick Reference

**Primary vs. Secondary Markets:**

- <span class="key-term">Primary market</span>: New securities sold by issuer
- <span class="key-term">Secondary market</span>: Existing securities traded among investors

**The Four Secondary Markets:**

- <span class="key-term">First market</span>: Regulated exchanges (NYSE, Nasdaq)
- <span class="key-term">Second market</span>: OTC trading of unlisted securities
- <span class="key-term">Third market</span>: OTC trading of exchange-listed securities
- <span class="key-term">Fourth market</span>: Direct institutional trading, dark pools

**Key Terms:**

- <span class="key-term">DMM</span>: Designated Market Maker (NYSE)
- <span class="key-term">ECN</span>: Electronic Communication Network
- <span class="key-term">ATS</span>: Alternative Trading System
- <span class="key-term">Dark pool</span>: Private trading venue without public quotes
- <span class="key-term">Spread</span>: Difference between bid and ask prices

**Compensation:**

- <span class="key-term">Commission</span>: Paid to brokers (agents)
- <span class="key-term">Markup/Markdown</span>: Earned by dealers (principals)
- <span class="key-term">5% policy</span>: FINRA guideline for fair compensation

---

## Next Steps

- Review Chapter 6: Packaged Products for context on how funds trade
- Proceed to Chapter 8: Customer Accounts
- Complete practice questions for this section
- Review flashcards for key terms

---

_Note: This content is part of the comprehensive SIE exam preparation course by Franklin Hugh Money.
For the complete course, visit the study materials page._
