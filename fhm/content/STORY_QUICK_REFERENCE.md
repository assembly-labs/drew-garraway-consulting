# Story Quick Reference by Chapter

Fast lookup for content creation. See `story-database.json` for full details.

---

## Chapter 1: Regulatory Framework
**Core narrative**: "Every regulator exists because someone got burned."

| Story | One-liner | Use for |
|-------|-----------|---------|
| 1929 Crash | Market lost 89%, created SEC | Why disclosure requirements exist |
| Madoff | $65B Ponzi, SEC warned for 9 years | Why verification/custody matters |
| Glass-Steagall | Banks pushing bad bonds to depositors | Separation of activities |
| NASD→FINRA | 2007 merger closed regulatory gaps | Why unified SRO |

**Best opening hook**: Joseph Kennedy as first SEC chair ("set a thief to catch a thief")

---

## Chapter 2: Types of Securities
**Core narrative**: "Securities are formalized promises. Understanding what can go wrong is key."

| Story | One-liner | Use for |
|-------|-----------|---------|
| South Sea Bubble | Isaac Newton lost millions, "can't calculate madness" | Speculation vs. investment |
| Enron | "Most Innovative Company" 6 years running—while committing fraud | Why auditor rules exist |
| Tulip Mania | Futures traded more than the tulips | Early derivatives |
| Milken/Junk Bonds | Made $550M in one year, then convicted | Bond credit spectrum |

**Best opening hook**: South Sea Bubble + Newton quote

---

## Chapter 3: Customer Accounts
**Core narrative**: "Account rules protect customers from firms—and sometimes themselves."

| Story | One-liner | Use for |
|-------|-----------|---------|
| 1929 Margin | 10% down, margin calls cascaded crash | Origin of Reg T |
| Stanford Ponzi | Knighted by Antigua, $7B fraud | KYC importance |
| Churning Scandals | 300 trades/year in widow's account | Why suitability matters |

**Best opening hook**: 1929 margin collapse → "That's why Reg T requires 50%"

---

## Chapter 4: Suitability & Recommendations
**Core narrative**: "Suitability rules exist because brokers kept selling grandma high-risk investments."

| Story | One-liner | Use for |
|-------|-----------|---------|
| Dot-com Retail | Pets.com: IPO $11, Super Bowl ad, bankrupt in 9 months | Risk tolerance |
| Auction Rate 2008 | "Cash equivalents" froze overnight | Liquidity risk |
| Variable Annuity Abuse | 85-year-olds sold 15-year products | Age/time horizon |

**Best opening hook**: Pets.com timeline (vivid, brief, memorable)

---

## Chapter 5: Municipal & Government Securities
**Core narrative**: "Government debt seems safe—until cities and countries default."

| Story | One-liner | Use for |
|-------|-----------|---------|
| Detroit Bankruptcy | $18B, GO bondholders got 74 cents | Even GO bonds default |
| Orange County | Treasurer used astrology, lost $1.7B | Municipal oversight |
| Puerto Rico | $74B default, sold to mainland retirees | Tax benefits ≠ safety |
| Hamilton's Deal | Assumed state debts, moved capital to DC | Treasury origin |

**Best opening hook**: Detroit bankruptcy—"full faith and credit" still defaulted

---

## Chapter 6: Investment Companies
**Core narrative**: "Mutual funds democratized investing—but created new exploitation methods."

| Story | One-liner | Use for |
|-------|-----------|---------|
| Bogle/Index Fund | Called "un-American," now manages trillions | Passive investing origin |
| 2003 Timing Scandal | Funds let hedge funds extract billions from regular investors | NAV rules |
| First ETF (SPY) | Now most traded security in world | ETF structure |
| Reserve Fund 2008 | First to "break the buck" since 1994 | Money markets aren't risk-free |

**Best opening hook**: Bogle's "Folly" → $11M raised vs. $150M target → now trillions

---

## Chapter 7: Trading Markets
**Core narrative**: "From buttonwood tree to microsecond algorithms."

| Story | One-liner | Use for |
|-------|-----------|---------|
| Buttonwood 1792 | 24 brokers, price-fixing cartel (now illegal) | NYSE origin |
| Flash Crash 2010 | Dow -1000 pts in minutes, stocks at $0.01 | Circuit breakers |
| Knight Capital 2012 | $440M lost in 45 minutes, sold in a week | Operational risk |
| NASDAQ Odd-Eighth | Dealers colluded on spreads | Why decimalization |

**Best opening hook**: Flash Crash prices (Accenture at $0.01, Sotheby's at $99,999)

---

## Chapter 8: Trade Processing & Settlement
**Core narrative**: "What happens after you click 'buy' is a complex dance."

| Story | One-liner | Use for |
|-------|-----------|---------|
| GameStop 2021 | Robinhood raised $3.4B in 48 hours | Why T+1 matters |
| Paperwork Crisis 1968 | NYSE closed Wednesdays to catch up | Why DTC/book entry |
| Lehman Settlement | $500B processed in one week, system barely held | Counterparty risk |
| Stratton Oakmont | Wolf of Wall Street, 1000-broker boiler room | Pump and dump |

**Best opening hook**: GameStop/Robinhood—current, dramatic, directly led to T+1

---

## Cross-Chapter Themes

### "Why This Rule Exists" Stories
- Reg T → 1929 margin
- Circuit breakers → Flash Crash
- NAV rules → 2003 timing scandal
- Disclosure → 1929/Enron
- T+1 → GameStop

### Innovation Stories (Positive Framing)
- Index funds (Bogle)
- ETFs (SPY)
- Electronic trading (NASDAQ)
- Treasury securities (Hamilton)

### Cautionary Tales
- Madoff (verification)
- Knight Capital (operational risk)
- Orange County (oversight)
- Pets.com (speculation)

---

## Quotable Quotes

> "I can calculate the motion of heavenly bodies, but not the madness of people."
> — Isaac Newton (after losing fortune in South Sea Bubble)

> "Don't look for the needle in the haystack. Just buy the haystack."
> — John Bogle

> "Be fearful when others are greedy, and greedy when others are fearful."
> — Warren Buffett

> "Set a thief to catch a thief."
> — FDR (on appointing Joseph Kennedy as first SEC chairman)

---

## Adding Stories

When you find a new story, add to `story-database.json`:

```json
{
  "id": "short-id",
  "title": "Descriptive Title",
  "year": 2024,
  "type": "scandal|market_event|innovation|legislation",
  "summary": "2-3 sentences",
  "relevantConcepts": ["concept1", "concept2"],
  "memorableDetail": "The one thing they'll remember",
  "usageNote": "When to use this"
}
```
