---
chapter: 7
section: 0
title: "Chapter 7 One-Pager: Trading Markets"
description: "A rapid-fire study guide covering everything you need to know about trading markets for the SIE exam"
topics:
  - Quick Reference Guide
  - Four Markets Overview
  - Broker vs Dealer
  - Key Exam Concepts
estimated_time: 10
difficulty: intermediate
last_updated: 2024-12-16
---

# Chapter 7 One-Pager: Trading Markets

> **For the Active Trader:** You already know how to execute trades on TSLA, PLTR, and other favorites. This chapter is about understanding the *plumbing* behind those trades—where your orders actually go, who's on the other side, and how everyone gets paid. This knowledge is SIE exam gold.

---

## The Big Picture: Where Do Your Trades Actually Go?

When you click "Buy 100 shares of TSLA" on your brokerage app, your order enters a complex ecosystem. The SIE wants you to understand this ecosystem.

```
                        SECONDARY MARKET
                              |
        ┌──────────┬──────────┬──────────┐
        |          |          |          |
    1st MARKET  2nd MARKET  3rd MARKET  4th MARKET
        |          |          |          |
    Exchanges    OTC       OTC for      Dark Pools
   (NYSE/Nasdaq) Unlisted   Listed      (Institutions)
        |          |          |          |
      TSLA      Penny      Your TSLA   Fidelity sells
      PLTR      Stocks     could trade  1M AAPL shares
      AMD       Bonds      here too!    to Vanguard
```

**Primary Market** = IPOs (remember when PLTR went public at $10?)
**Secondary Market** = Everything after—where you trade daily

---

## The Four Markets Cheat Sheet

| Market | What Trades | How It Works | Real-World Example |
|--------|-------------|--------------|-------------------|
| **1st** (Exchanges) | Listed stocks, options | Auction (NYSE) or Negotiated (Nasdaq) | Your TSLA shares on Nasdaq |
| **2nd** (OTC) | Unlisted stocks, ALL bonds | Dealer-to-dealer negotiation | That sketchy penny stock, Treasury bonds |
| **3rd** (OTC of Listed) | Exchange-listed securities | ECNs compete with exchanges | Better fill on PLTR through an ECN |
| **4th** (Institutional) | Large blocks | Dark pools, direct trades | BlackRock moving $50M in NVDA |

### Key Exam Traps:
- **Almost ALL bonds trade OTC** (Second Market)—even Treasuries
- **Options trade on exchanges** (Cboe, PHLX)—NOT OTC
- **Third market = competition** for exchanges (this is why you sometimes get price improvement)
- **Dark pools = no public quotes** until after execution

---

## NYSE vs. Nasdaq: Know the Difference

| Feature | NYSE | Nasdaq |
|---------|------|--------|
| **Type** | Auction Market | Negotiated Market |
| **Who runs it** | DMM (Designated Market Maker) | Multiple Market Makers |
| **Per stock** | ONE DMM assigned | MANY market makers competing |
| **Your stocks** | Legacy companies, some ETFs | TSLA, PLTR, AMD, NVDA, most tech |

**Why this matters:** More market makers = more competition = tighter spreads (usually). That's why Nasdaq-listed tech stocks often have penny-wide spreads.

---

## Broker vs. Dealer: The Money Question

This is **HEAVILY TESTED**. You need to know this cold.

| | Broker (Agent) | Dealer (Principal) |
|---|----------------|-------------------|
| **Role** | Matchmaker | Counterparty |
| **Inventory** | None | Holds securities |
| **Risk** | Zero | Market risk |
| **Compensation** | **Commission** | **Markup/Markdown** |
| **Think of it as** | Real estate agent | Used car dealer |

### The Hidden Profit Rule (EXAM FAVORITE)
**A firm CANNOT charge BOTH commission AND markup on the same trade.**

It's one or the other:
- Acting as agent? → Commission
- Acting as principal? → Markup/markdown
- Both? → **PROHIBITED** (hidden profit)

---

## Markups, Markdowns & The Spread

As a trader, you know the bid-ask spread. Here's what's happening behind it:

```
Market Maker Quote: Bid $99.90 / Ask $100.10
                         |
            ┌────────────┴────────────┐
            |                         |
    You SELL at $99.90         You BUY at $100.10
    (maybe minus markdown)     (maybe plus markup)
            |                         |
    Dealer buys from you       Dealer sells to you
```

**The spread ($0.20) is the dealer's potential profit.**

When you're trading TSLA with a $0.01 spread, the market is liquid and competitive. When you see a $0.50 spread on some illiquid OTC stock, that's the cost of thin markets.

---

## FINRA's 5% Policy (It's NOT What You Think)

**Common misconception:** "Markups can't exceed 5%"
**Reality:** 5% is a *guideline*, not a hard cap

The actual standard: **"Fair and reasonable"**

- 3% on liquid stock? Could be excessive
- 7% on illiquid OTC stock? Might be reasonable

### Exam Exceptions:
- **Mutual funds:** Max 8.5% sales charge (not 5%)
- **Municipal bonds:** MSRB rules, not FINRA (but similar standard)

---

## Dark Pools & After-Hours: What You Need to Know

### Dark Pools
- **What:** Private trading systems, no public quotes
- **Why:** Prevents front-running of large orders
- **Who:** Institutional investors (not you... yet)
- **Exam point:** ~15-18% of equity volume runs through dark pools

### After-Hours Trading Risks (EXAM LOVES THIS)
Remember **"LWV"**:
- **L**ess liquidity
- **W**ider spreads
- **V**olatility amplified

You've probably seen TSLA move 5% after earnings in pre-market. That volatility is exactly what the SIE wants you to understand.

---

## Quick-Fire Definitions

| Term | Definition | Remember It |
|------|------------|-------------|
| **DMM** | Designated Market Maker (NYSE) | ONE per stock |
| **ECN** | Electronic Communication Network | Competes with exchanges |
| **ATS** | Alternative Trading System | Umbrella term (includes ECNs, dark pools) |
| **CQS** | Consolidated Quotation Service | Shows best prices across venues |
| **Consolidated Tape** | Reports trades after execution | The scrolling ticker on CNBC |
| **OCC** | Options Clearing Corporation | Guarantees exchange-traded options ONLY |
| **SRO** | Self-Regulatory Organization | Exchanges police themselves (under SEC) |

---

## Exam Question Patterns

**"Which market..."**
- Trades unlisted securities? → **Second (OTC)**
- Trades listed securities OTC? → **Third**
- Uses dark pools? → **Fourth**
- Is an auction market? → **First (NYSE specifically)**

**"Who regulates..."**
- Exchanges? → **Themselves (SROs) + SEC**
- OTC, Third, Fourth markets? → **FINRA**
- Municipal bonds? → **MSRB**

**"How is a _____ compensated?"**
- Broker/Agent → **Commission**
- Dealer/Principal → **Markup/Markdown**

**"What's prohibited?"**
- Commission + markup on same trade → **Hidden profit**
- Acting as both broker and dealer on same transaction → **Prohibited**

---

## Connect to Your Trading Experience

| What You Know | SIE Concept |
|---------------|-------------|
| Price improvement on fills | Third market ECNs competing with exchanges |
| Tight spreads on TSLA | Multiple Nasdaq market makers competing |
| Wide spreads on penny stocks | Illiquid OTC (Second Market) |
| Earnings moves in pre-market | After-hours trading volatility risk |
| Options on Cboe | First market, OCC-guaranteed |
| "Commission-free" trading | You're still paying (via spread/PFOF) |

---

## 5-Minute Pre-Exam Drill

1. **Four markets:** Exchanges → OTC Unlisted → OTC Listed → Dark Pools
2. **NYSE = Auction + DMM** / **Nasdaq = Negotiated + Market Makers**
3. **Broker = Commission** / **Dealer = Markup**
4. **Hidden profit = Commission + Markup = PROHIBITED**
5. **5% = guideline, not rule** / **Mutual funds = 8.5% max**
6. **After-hours = Less liquid, wider spreads, more volatile**
7. **Almost all bonds trade OTC** / **Options trade on exchanges**
8. **Dark pools = no public quotes**

---

## Ready to Dive Deep?

You've got the map. Now explore the territory in Section 7.1, where we'll break down each concept with full detail and more exam-style practice questions.

**Time estimate:** 30 minutes for the full section

---

*This one-pager is designed for active traders preparing for the SIE exam. For complete course materials, continue to Section 7.1: Types of Trading Markets.*
