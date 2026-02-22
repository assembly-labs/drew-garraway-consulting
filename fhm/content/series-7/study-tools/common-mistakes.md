# Common Mistakes on the Series 7

## Learn From Others' Errors

---

## Options Mistakes

### 1. Forgetting to Multiply by 100

**The Mistake:** Calculating option profit/loss using the quoted premium without multiplying by 100.

**Example:**

- Buy 1 call at $3, sell at $5
- WRONG: Profit = $2
- RIGHT: Profit = $2 × 100 = $200

**Memory Aid:** Options are ALWAYS quoted per share. One contract = 100 shares. ALWAYS multiply.

---

### 2. Confusing Buyer vs. Seller Breakeven

**The Mistake:** Both buyer and seller have the SAME breakeven point—it's the profit/loss that's
different.

**The Truth:**

- Long call BE = Strike + Premium (buyer needs stock above this)
- Short call BE = Strike + Premium (seller needs stock below this)
- Same number, different goals!

---

### 3. Getting Spread Direction Backwards

**The Mistake:** Calling a bull spread a bear spread (or vice versa).

**Remember:**

- **Bull spreads**: Want market to rise. Buy lower strike, sell higher strike (calls) OR sell higher
  strike, buy lower strike (puts)
- **Bear spreads**: Want market to fall. Buy higher strike, sell lower strike (calls) OR sell lower
  strike, buy higher strike (puts)

**Memory Aid:** Bull Call = Buy Lower. The word "Lower" has an "L" like "buLL"

---

### 4. Max Loss on Naked Short Calls

**The Mistake:** Saying max loss is "the stock price minus premium received"

**The Truth:** Max loss on uncovered short calls is UNLIMITED because the stock can rise
indefinitely.

---

## Margin Mistakes

### 5. Using Wrong Maintenance Percentages

**The Mistake:** Using 25% for both long and short positions.

**The Truth:**

- LONG positions: 25% maintenance
- SHORT positions: 30% maintenance

**Memory Aid:** "Shorts are riskier, so they require more." (30% > 25%)

---

### 6. SMA Calculation Errors

**The Mistake:** Thinking SMA is just excess equity.

**The Truth:** SMA only increases when equity exceeds Reg T requirement (50% of market value).
Calculate:

- Equity = Market Value - Debit
- Reg T Requirement = Market Value × 50%
- SMA = Equity - Reg T Requirement (only if positive)

---

### 7. Margin Call Trigger Formula Mix-Up

**The Mistake:** Using the wrong formula for long vs. short positions.

**Correct Formulas:**

- LONG trigger: Debit Balance ÷ 0.75
- SHORT trigger: Credit Balance ÷ 1.30

**Memory Aid:**

- Long: 75% (Debit ÷ 0.75)
- Short: 130% (Credit ÷ 1.30)

---

## Bond Mistakes

### 8. Yield Relationship Confusion

**The Mistake:** Getting the yield relationship backwards for premium/discount bonds.

**The Truth:**

- PREMIUM (price above par): Nominal > Current > YTM
- DISCOUNT (price below par): YTM > Current > Nominal

**Memory Aid:** "Premium Decreases Yields" (P-D-Y = N > C > YTM decreasing)

---

### 9. Tax-Equivalent Yield Math

**The Mistake:** Multiplying by the tax rate instead of dividing by (1 - tax rate).

**Correct Formula:** TEY = Municipal yield ÷ (1 - tax bracket)

**Example:**

- 4% muni, 32% bracket
- WRONG: 4% × 0.32 = 1.28%
- RIGHT: 4% ÷ (1 - 0.32) = 4% ÷ 0.68 = 5.88%

---

### 10. Accrued Interest Day Count

**The Mistake:** Using the wrong day count convention.

**The Truth:**

- Corporate & Municipal: 30/360 (30-day months, 360-day year)
- Government (T-bills, etc.): Actual/Actual (real calendar days)

---

## Municipal Bond Mistakes

### 11. GO vs. Revenue Backing

**The Mistake:** Confusing what backs each type of bond.

**The Truth:**

- **GO Bonds**: Backed by taxing power (property taxes)
- **Revenue Bonds**: Backed ONLY by project revenue (tolls, fees, etc.)

**Key Point:** Revenue bondholders CANNOT sue for taxes if project fails.

---

### 12. In-State vs. Out-of-State Tax Treatment

**The Mistake:** Assuming all munis are tax-free at all levels.

**The Truth:**

- Federal: Always exempt (except private activity bonds with AMT)
- State: Only exempt if issued by YOUR state
- Local: Usually exempt, varies by jurisdiction

---

## Investment Company Mistakes

### 13. NAV Calculation Errors

**The Mistake:** Forgetting to subtract liabilities OR dividing incorrectly.

**Correct Formula:** NAV = (Total Assets - Liabilities) ÷ Shares Outstanding

**Example:**

- Assets: $100M, Liabilities: $5M, Shares: 5M
- NAV = ($100M - $5M) ÷ 5M = $95M ÷ 5M = $19.00

---

### 14. Open-End vs. Closed-End Fund Trading

**The Mistake:** Thinking both trade the same way.

**The Truth:**

- **Open-end (mutual funds)**: Always trade at NAV (plus any sales charge)
- **Closed-end**: Trade on exchanges at market price (can be above OR below NAV)

---

### 15. Class A vs. Class C Share Confusion

**The Mistake:** Not understanding when each is appropriate.

**The Truth:**

- **Class A**: Front-end load. Better for long-term investors (lower ongoing fees)
- **Class C**: Level load. Better for shorter holding periods (no front load, but higher annual
  expenses)

---

## Suitability Mistakes

### 16. Institutional ≠ Accredited

**The Mistake:** Treating wealthy individuals as institutional customers.

**The Truth:**

- **Institutional**: Banks, insurance companies, registered investment companies, entities with
  $50M+ assets
- **Accredited**: Individuals meeting income/net worth thresholds for private placements

**Key Point:** A billionaire is still a RETAIL customer for FINRA purposes.

---

### 17. Three-Part Suitability

**The Mistake:** Only knowing "customer-specific" suitability.

**The Three Parts:**

1. **Reasonable-basis**: Firm must understand the product
2. **Customer-specific**: Product must be right for THIS customer
3. **Quantitative**: Trading frequency must be appropriate

---

## Order Mistakes

### 18. Limit Order Execution Price

**The Mistake:** Thinking limit orders execute exactly at the limit price.

**The Truth:**

- Buy limit: Execute at limit price OR LOWER
- Sell limit: Execute at limit price OR HIGHER

**Memory Aid:** BLiSS (Buy Limit is Set Below); SeLLS (Sell Limit is Set Above)

---

### 19. Stop Order Triggers

**The Mistake:** Thinking stop orders guarantee execution price.

**The Truth:**

- Stop orders become MARKET orders when triggered
- Execution price may differ from stop price
- Stop-LIMIT orders provide price protection but may not execute

---

## Settlement Mistakes

### 20. Wrong Settlement Date

**The Mistake:** Using old settlement rules.

**Current Rules (2024):**

- Stocks and corporate bonds: T+1
- Government securities: T+1
- Options: T+1
- Mutual funds: T+1 (at NAV calculated that day)

---

## General Test-Taking Mistakes

### 21. Rushing Through Calculations

**The Solution:**

- Write out the formula FIRST
- Plug in numbers SECOND
- Double-check your math THIRD
- Verify units make sense FOURTH

---

### 22. Not Reading "EXCEPT" Questions Carefully

**The Solution:**

- Circle or underline "EXCEPT," "NOT," "FALSE"
- Find the three TRUE statements
- The FALSE one is your answer

---

### 23. Second-Guessing Correct Answers

**The Truth:** Research shows first instincts are usually right. Only change an answer if you:

- Find a specific error in your reasoning
- Remember a specific fact you'd forgotten
- Misread the question

---

### 24. Running Out of Time

**Pacing Guide:**

- 225 minutes ÷ 135 questions = ~1.67 minutes/question
- Check at Q45: Should be ~75 min in
- Check at Q90: Should be ~150 min in
- Save 20-30 minutes for review

---

## The Big Picture

**Most Common Areas for Mistakes:**

1. Options calculations (especially spreads)
2. Margin mathematics
3. Bond yield relationships
4. Institutional vs. retail classification
5. Settlement dates

**Focus extra review time on these topics.**

---

## Remember

Making mistakes while studying is GOOD. Making the same mistake twice is BAD.

When you miss a practice question:

1. Understand WHY you missed it
2. Write down the correct rule/formula
3. Create a flashcard for it
4. Review it before the exam

---

_Don't memorize mistakes. Memorize corrections._
