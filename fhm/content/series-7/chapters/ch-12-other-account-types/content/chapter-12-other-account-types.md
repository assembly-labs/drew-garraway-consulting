# Chapter 12: Other Account Types

*Series 7 Exam Weight: ~11% of exam (~14 questions)*

---

In October 1929, a Wall Street shoeshine boy reportedly offered stock tips to Joseph P. Kennedy, who took it as a sign that the market had gone too far. Whether the story is apocryphal hardly matters -- what happened next was real enough. When the market collapsed that autumn, the damage was amplified by leverage: investors had been buying stocks on as little as 10% margin, borrowing the other 90% from their brokers. A $10,000 portfolio built on $1,000 of actual cash became worthless in a matter of days, and the margin calls cascaded like dominoes through the financial system. Congress responded with the Securities Exchange Act of 1934, which gave the Federal Reserve Board the authority to regulate credit in the securities markets. The Fed exercised that authority through <span class="key-term">Regulation T</span>, setting the initial margin requirement at 50% -- a level where it has remained, with occasional adjustments, for decades. The logic was simple: if you want to speculate with borrowed money, you need to have real skin in the game.

This chapter covers the account types that go beyond the standard individual cash account: margin accounts and their intricate web of borrowing rules, fiduciary accounts where someone else manages money on a beneficiary's behalf, and the various joint, business, and options accounts that round out a broker-dealer's offerings. Together, these account types represent the infrastructure of how money actually moves through the securities industry -- and they account for roughly 14 questions on the Series 7.

### Why This Chapter Matters

The individual cash account from Chapter 11 is the foundation, but it's not how most of the industry actually operates. Margin accounts generate interest revenue for broker-dealers, fiduciary accounts protect vulnerable investors, and options accounts require their own approval process. Understanding these structures isn't just exam material -- it's the difference between knowing what a brokerage firm does and understanding how it makes money doing it.

---

## Section 1: Margin Accounts

A <span class="key-term">margin account</span> allows a customer to borrow either money or securities from a broker-dealer. By borrowing, the investor uses <span class="key-term">leverage</span> -- which can amplify returns but also amplify losses. In a cash account, risks and returns are lower because the customer pays 100% of the purchase price. Leverage changes the math entirely.

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>Before Regulation T, there was no federal floor on how much an investor needed to put down. Brokers set their own margin requirements, and competitive pressure drove them lower and lower. By the late 1920s, some brokers were lending 90% of the purchase price. When stock prices fell, the resulting margin calls forced mass liquidations, which drove prices even lower, which triggered more margin calls. The Fed's 50% requirement was designed to break this cycle by ensuring investors always had meaningful equity in their positions.</p>
</div>

Due to the risky nature of margin, not all account types are permitted to use leverage. <span class="key-term">Custodial, fiduciary, and retirement accounts</span> are generally ineligible for margin.

---

### Topic 1: Regulation T -- Buying on Margin

#### Initial Margin Requirements

<span class="key-term">Regulation T (Reg T)</span> is a Federal Reserve Board regulation that covers lending from broker-dealers to customers. It sets <span class="key-term">initial margin requirements</span> for marginable securities.

- In a **cash account**, the initial margin requirement is **100%** (you pay for everything)
- In a **margin account**, the broker-dealer may lend a customer up to **50%** of the purchase price of a marginable security

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <table>
    <tr><th></th><th>Long Position</th><th>Short Position</th></tr>
    <tr><td><strong>Stocks and convertibles</strong></td><td>50%</td><td>50%</td></tr>
  </table>
</div>

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>A customer buys 200 shares of ABC (NYSE-listed) at $50 per share. Total purchase: $10,000. Under Reg T, the initial margin requirement is 50% of $10,000 = <strong>$5,000</strong>. The customer deposits $5,000, and the broker-dealer lends the remaining $5,000.</p>
</div>

#### Exempt Securities

Not all securities fall under Reg T's jurisdiction. <span class="key-term">Exempt securities</span> are not covered by Reg T's initial margin rules. The major exempt securities are:

- U.S. government securities
- Agency issues
- Municipal issues
- Commercial paper

The Fed has no power to set initial margins for these securities. However, they are still marginable, subject to <span class="key-term">minimum maintenance requirements</span> set by FINRA.

While corporate bonds are nonexempt, the Fed does not set specific margins for them either, because their prices tend to be fairly stable. Only FINRA minimum maintenance margins apply to corporate bonds.

<div class="test-tip">
  <p><strong>Test Tip:</strong> "Exempt" from Reg T does not mean "not marginable." It means the Fed doesn't set the initial margin -- FINRA's maintenance requirements still apply. The exam tests this distinction.</p>
</div>

#### Deposit Requirements

Reg T deposits must be made within **2 business days of settlement**. Since a corporate security settles in 1 business day (T+1), the Reg T deposit must be made by **T+3**.

The deposit can be made in securities instead of cash. A customer may deposit fully paid marginable securities worth **twice the amount** of the call.

#### Marginable vs. Non-Marginable Securities

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <table>
    <tr><th>Category</th><th>Securities</th></tr>
    <tr><td><strong>Marginable securities</strong> -- can be purchased on margin</td><td>Exchange-listed securities (including Nasdaq and NYSE); U.S. government and agency securities; Investment-grade bonds and debentures; OTC securities on the Federal Reserve marginable securities list; Investment-grade money market instruments</td></tr>
    <tr><td><strong>Non-marginable securities</strong> -- cannot be purchased on margin</td><td>New issues publicly traded for fewer than 30 days; Mutual fund shares and investment contracts (e.g., variable annuities); Securities selling for less than $5 per share</td></tr>
    <tr><td><strong>Margin securities</strong> -- can be used as collateral on loans</td><td>Marginable securities; Mutual fund and UIT shares and investment contracts owned for at least 30 days; Any convertible debt security convertible into a margin security</td></tr>
  </table>
</div>

<div class="test-tip">
  <p><strong>Test Tip:</strong> Mutual fund shares cannot be <em>purchased</em> on margin because they are always considered new shares. But once held for 30 days, they can be used as <em>collateral</em> for a margin loan. The exam loves this distinction.</p>
</div>

---

### Topic 2: Regulation T -- Selling Short on Margin

#### Short Selling Basics

<span class="key-term">Short selling</span> is when an investor borrows securities from a broker-dealer and then sells them. This can **only** be done in a margin account.

The strategy works like this: a bearish investor sells borrowed securities at the current (high) price, hoping to repurchase them later at a lower price. After buying back the shares, they return them to the broker-dealer -- this is called <span class="key-term">covering</span> the short position. The difference between the sale price and the repurchase price is the customer's profit or loss.

- **Bullish investors** hope to buy low and sell high
- **Bearish investors** hope to sell high and buy low

Fiduciary and retirement accounts are typically **not permitted** to sell short due to the strategy's unlimited loss potential.

#### Initial Margin for Short Sales

The Reg T initial margin requirement for short sales is the same as for long purchases -- **50%**.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>A customer shorts 1,000 shares of XYZ stock at $10 per share. Trade value: $10,000. Reg T requires a deposit of 50%, or <strong>$5,000</strong>.</p>
</div>

#### Minimum Deposit Requirements

Margin accounts have a minimum equity requirement of <span class="key-term">$2,000</span>. But the rules differ depending on whether you're long or short:

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <table>
    <tr><th>Under $2,000 (Long)</th><th>Between $2,000-$4,000 (Long)</th><th>Over $4,000 (Long)</th><th>Any Amount (Short)</th></tr>
    <tr><td>100% deposit required</td><td>$2,000 deposit required</td><td>50% deposit required</td><td>$2,000 minimum (absolute)</td></tr>
  </table>
  <p>For short accounts, the $2,000 minimum equity is an <strong>absolute requirement</strong> regardless of trade size, because the strategy carries unlimited loss potential.</p>
</div>

---

### Topic 3: Regulation T for Cash Accounts

#### Payment Requirements

In a cash account, Reg T requires the broker-dealer to collect payment from the customer **promptly** -- no later than 2 business days after the settlement date.

<div class="calculation-box">
  <div class="calculation-box__label">Payment Timeline</div>
  <div class="calculation-box__formula">
    Regular way settlement = T+1 (trade date + 1 business day)<br>
    Reg T payment deadline = S+2 (settlement + 2 business days) = T+3
  </div>
</div>

#### Reg T Extensions

If payment is not collected by S+2, under exceptional circumstances, the firm may request a <span class="key-term">Reg T extension</span> from FINRA. If granted, the customer gets another 2 business days (or longer if a special request is made) to pay.

If the customer does not pay by either S+2 or the extension date (if one is granted), the firm is **obligated** to sell out that position and <span class="key-term">freeze the account</span> for **90 days**.

#### Frozen Accounts

When an account is <span class="key-term">frozen</span>, the customer can still trade -- but they can no longer borrow. They must have 100% of the required cash to pay for any transaction before placing it. After 90 days of compliance, the freeze is removed.

#### Free-Riding

<span class="key-term">Free-riding</span> is the prohibited practice of buying securities without intending to pay for them, then selling them on or before the settlement date to generate the cash needed to pay for the original purchase.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>XYZ will announce quarterly earnings in two days. A customer believes the news will be positive and decides to buy 1,000 shares of XYZ at $50 per share. The customer does not have $50,000 to pay for the stock but plans to sell it when the price rises. The customer is trying to take a "free ride" by using the broker-dealer's credit to buy stock, then using the sale proceeds to cover the purchase.</p>
  <p><strong>Consequences:</strong> The customer will not be allowed to keep profits from the trade, and their account will be frozen for 90 days. During the freeze, the customer cannot buy securities unless they already have sufficient cash in the account.</p>
</div>

<div class="test-tip">
  <p><strong>Test Tip:</strong> Free-riding = buying with no money, selling to generate the money, and trying to pocket the profit. The account gets frozen for 90 days, and the customer forfeits the profits. The exam tests this scenario regularly.</p>
</div>

---

### Topic 4: Restricted Margin Accounts and Minimum Maintenance Requirements

#### Restricted Margin Accounts

A <span class="key-term">restricted margin account</span> is one where the equity has fallen below 50% of the market value but remains above the minimum maintenance requirement.

<div class="calculation-box">
  <div class="calculation-box__label">Long Margin Account Equity Formulas</div>
  <div class="calculation-box__formula">
    Equity Value = Long Market Value (LMV) - Amount Owed Broker (Debit)<br>
    Equity Percentage = Equity Value / Long Market Value (LMV)
  </div>
</div>

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>A customer buys $80,000 worth of stock in a margin account, depositing the required $40,000 initial margin and borrowing $40,000 from the broker-dealer.</p>
  <p>The next day, the stock declines to $60,000:</p>
  <ul>
    <li>LMV = $60,000</li>
    <li>Debit = $40,000</li>
    <li>Equity = $60,000 - $40,000 = <strong>$20,000</strong></li>
    <li>Equity percentage = $20,000 / $60,000 = <strong>33.33%</strong></li>
  </ul>
  <p>Since equity has fallen below 50%, the account is now <strong>restricted</strong>. But here's the key: the restriction has minimal practical impact. The customer is not required to deposit more money, the account is not frozen, and they can still buy more stock by depositing only 50% of the new purchase price.</p>
</div>

#### Short Account Equity

In a short margin account, equity is calculated differently:

<div class="calculation-box">
  <div class="calculation-box__label">Short Margin Account Equity Formula</div>
  <div class="calculation-box__formula">
    Credit Balance = Short Market Value (SMV) + Equity<br>
    (The credit balance is the total value of the short sale plus the 50% deposited by the customer. SMV is the current market value of the shorted securities.)
  </div>
</div>

#### Minimum Maintenance Requirements

While a restricted account doesn't trigger any immediate action, there are limits to how far equity can fall. These limits are the <span class="key-term">minimum maintenance requirements</span> established by FINRA.

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>FINRA Minimum Maintenance Margin:</strong></p>
  <table>
    <tr><th></th><th>Long Position</th><th>Short Position</th></tr>
    <tr><td><strong>Stocks and convertibles</strong></td><td>25%</td><td>30%</td></tr>
  </table>
</div>

#### Margin Maintenance Call -- Long Stock Example

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>A customer buys $80,000 worth of stock in a margin account, depositing $40,000 and borrowing $40,000. The minimum maintenance requirement for a long position is 25% of market value, or $20,000 initially.</p>
  <p>A month later, the market value falls to $50,000:</p>
  <ul>
    <li>Market value = $50,000</li>
    <li>Debt owed = $40,000</li>
    <li>Equity = $50,000 - $40,000 = <strong>$10,000</strong></li>
    <li>Equity percentage = $10,000 / $50,000 = <strong>20%</strong></li>
  </ul>
  <p>This is below the 25% minimum. The customer receives a <span class="key-term">margin call</span> for the amount needed to restore equity to 25%:</p>
  <ul>
    <li>Required equity = 25% of $50,000 = $12,500</li>
    <li>Margin call = $12,500 - $10,000 = <strong>$2,500 in cash</strong> (or twice that amount, $5,000, in marginable securities)</li>
  </ul>
</div>

#### Short Account Margin Call

In a short margin account, a margin call is issued when equity drops below **30%**. A useful shortcut for finding the trigger point:

<div class="calculation-box">
  <div class="calculation-box__label">Short Account Margin Call Trigger</div>
  <div class="calculation-box__formula">
    Margin call trigger = Credit Balance / 1.3
  </div>
</div>

For example, a customer with a short margin account that has a credit balance of $130,000 will receive a margin call if the SMV rises above $130,000 / 1.3 = **$100,000**.

#### Long Account Margin Call Trigger

The same convention works for long accounts:

<div class="calculation-box">
  <div class="calculation-box__label">Long Account Margin Call Trigger</div>
  <div class="calculation-box__formula">
    Margin call trigger = Debit Balance / 0.75
  </div>
</div>

An account with a $50,000 debit balance will receive a margin call if its LMV falls below $50,000 / 0.75 = **$66,666.67**.

#### Meeting a Margin Call

When a margin call occurs, it must be met **promptly** -- typically within 3 business days, though depending on circumstances it could be anywhere from the same day to 5 business days. If the customer fails to provide the required equity, the broker-dealer will **sell the customer out**: liquidating enough stock to bring the account back to the required 25% minimum. The customer has **no control** over which securities are sold.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Broker-dealers can (and usually do) establish more stringent maintenance margin requirements than the 25% set by FINRA. On the exam, use FINRA's minimums unless told otherwise.</p>
</div>

#### Summary of Key Margin Requirements

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <table>
    <tr><th></th><th>Long Stock</th><th>Short Stock</th></tr>
    <tr><td><strong>Regulation T initial margin requirement</strong></td><td>50%</td><td>50%</td></tr>
    <tr><td><strong>FINRA minimum maintenance margin requirement</strong></td><td>25%</td><td>30%</td></tr>
  </table>
</div>

#### Special Memorandum Account (SMA)

When a security purchased on margin increases in value, the equity in the account increases as well. Equity above 50% of the market value is considered <span class="key-term">excess equity</span>.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>A customer purchases 1,000 shares of XYZ at $50 per share, depositing the initial margin of $25,000 (50%).</p>
  <p><strong>At purchase:</strong> $50,000 LMV = $25,000 loan + $25,000 equity</p>
  <p>Now assume the stock rises to $60 per share:</p>
  <p><strong>After increase:</strong> $60,000 LMV = $25,000 loan + $35,000 equity</p>
  <p>The Reg T amount for a $60,000 LMV is $30,000. The account has $5,000 of excess equity ($35,000 equity - $30,000 Reg T requirement = $5,000).</p>
</div>

#### SMA and Buying Power

Excess equity creates <span class="key-term">buying power</span> of **2 x SMA** (since the initial margin requirement is 50%).

<div class="calculation-box">
  <div class="calculation-box__label">SMA Buying Power</div>
  <div class="calculation-box__formula">
    Buying Power = 2 x SMA (Excess Equity)<br>
    Example: $5,000 SMA = $10,000 buying power (meeting the 50% margin requirement)
  </div>
</div>

The <span class="key-term">Special Memorandum Account (SMA)</span> amount can also be withdrawn from the account in cash. However, this withdrawal would be considered a **loan** and added to the amount the customer owes the broker-dealer.

---

### Topic 5: Other Types of Margin Accounts

#### Pattern Day Traders

Customers who engage in day-trading strategies take on a higher level of risk. Because day traders execute rapid "in and out" transactions on the same day, they typically end the day with no position -- and therefore would have no margin requirement under standard Reg T rules. Due to this elevated risk, these accounts require special client disclosures.

#### Pattern Day Trader Definition

FINRA defines a <span class="key-term">pattern day trader (PDT)</span> as anyone who executes **four or more day trades within five business days**. A day trade is a purchase and sale of the same security (or vice versa) on the same day. A purchase on one day followed by a sale the next day is **not** defined as a day trade.

#### $25,000 Minimum Equity

Instead of the standard $2,000 minimum equity, the minimum equity for a day-trading account is <span class="key-term">$25,000</span> -- a 12.5x premium over regular margin accounts.

#### Minimum Margin: 25% of Highest Intraday Market Value

Day traders must maintain a minimum margin of 25%, the same as regular accounts. The critical difference is **how it's computed**: because a day-trading account has no end-of-day market value, the 25% minimum is applied to the account's <span class="key-term">highest intraday market value</span>, but in no case less than $25,000.

#### Buying Power in Day-Trading Accounts

<div class="calculation-box">
  <div class="calculation-box__label">Day-Trading Buying Power</div>
  <div class="calculation-box__formula">
    Standard: Buying Power = 4 x Maintenance Excess (based on 25% min: 1 / 0.25 = 4)<br>
    With Outstanding Margin Call: Buying Power = 2 x Maintenance Excess
  </div>
</div>

Pattern day-trading accounts are subject to FINRA's minimum margin rules (not Reg T) since they typically don't carry securities positions into the next day. If the account is "flat" at the end of the day, buying power is simply four times the cash balance.

However, if the account has an **unsatisfied margin call outstanding**, buying power is reduced to **twice** the maintenance margin excess.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Pattern day trader = 4+ day trades in 5 business days. Minimum equity = $25,000. Buying power = 4x (or 2x with outstanding margin call). These three facts cover most exam questions on day trading.</p>
</div>

#### Portfolio Margin

Everything discussed so far uses the standard <span class="key-term">strategy-based margin</span> method, where a prescribed percentage is applied regardless of actual risk. This approach is conservative and doesn't account for hedging strategies or offsetting positions.

<span class="key-term">Portfolio margin</span> takes a different approach: it assesses the risk of the **entire account**, considering variables such as hedging strategies, protective options, and offsetting long and short positions.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>A customer buys 100 shares of ABC stock at $50 per share and buys a protective ABC 50 Put @ $5.</p>
  <p><strong>Under Reg T:</strong> 50% of the stock ($2,500) + 100% of the put premium ($500) = <strong>$3,000 deposit required</strong></p>
  <p><strong>Under portfolio margin:</strong> The maximum possible loss is $500 (the stock bought at $50 can be sold via the put at $50, so the only loss is the $500 premium). The margin requirement = <strong>$500</strong></p>
  <p>Portfolio margin dramatically reduces the requirement for hedged positions because it reflects the actual risk.</p>
</div>

**Key facts about portfolio margin:**

- The most dramatic effect is reducing margin for **stock positions hedged by options** -- since the margin becomes the maximum potential loss
- Portfolio margin provides **no benefit** for long options positions or spread positions, where the margin already equals the maximum potential loss
- Portfolio margin can only be used for **equities, options, or derivatives positions** used as hedges -- it **cannot** be used for bond positions
- The basis for the margin requirement is "stress testing" securities positions using probability-based loss percentages based on historical volatility
- For most equities, the maximum portfolio margin is **15%** (vs. 50% under Reg T). If the position is "concentrated" (too large a percentage of the portfolio in a single security), the margin doubles to **30%**

#### Only Sophisticated Investors Qualify

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Portfolio Margin Minimum Equity Requirements:</strong></p>
  <ul>
    <li><strong>$100,000</strong> -- Individual customer accounts</li>
    <li><strong>$500,000</strong> -- Prime brokerage accounts</li>
    <li><strong>$5,000,000</strong> -- Accounts with unlisted derivatives or day-trading accounts (for customers who are not broker-dealers or futures firms)</li>
  </ul>
</div>

**Additional portfolio margin requirements:**

- The brokerage firm must get **prior approval from FINRA** and demonstrate it has sophisticated computer systems capable of computing and monitoring margin requirements on a **real-time, intraday basis**
- If a portfolio margin account has a margin deficiency at end of day, payment must be received within **3 business days**
- The account must be approved for **uncovered options writing** by a Registered Options Principal (ROP) -- either Series 4 or Series 9 licensed
- The customer must receive a **Portfolio Margin Risk Disclosure Statement** at or before the first transaction and must sign an acknowledgment that they have read and understand it

---

### Topic 6: Margin on Options and Leveraged ETFs

#### Margin on Long Options

<span class="key-term">Long options require 100% deposit of the premium</span>. No loans are permitted against long options -- which makes sense since the contract expires at a set date within the coming months. Minimum maintenance requirements do not apply since the positions are fully paid.

This treatment is the same whether a long call, long put, interest rate option, or foreign currency option is purchased.

#### LEAPS

<span class="key-term">LEAPS (Long-term Equity Anticipation Securities)</span> have initial expirations from 28-36 months in the future. Reg T requires that **75%** of the premium be deposited. This is also the minimum requirement. When LEAPS are within **9 months** of expiration (the same as a regular option), **100%** of the premium must be deposited.

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Options Margin Quick Reference:</strong></p>
  <ul>
    <li>Long options: <strong>100%</strong> of premium</li>
    <li>LEAPS (more than 9 months to expiration): <strong>75%</strong> of premium</li>
    <li>LEAPS (within 9 months of expiration): <strong>100%</strong> of premium</li>
  </ul>
</div>

#### Margin on Covered Stock Options

##### Short Call Covered by Stock Ownership

If a stock call is "covered" by owning the underlying stock, there is **no margin on the call itself** -- only on the long stock position (100% in a cash account, 50% in a margin account). If the customer is exercised, they simply deliver the stock they own.

##### Short Put Covered by Short Stock Position

A short put is considered covered if the customer has a **short stock position** in the same stock. The customer cannot lose on the short put: if the market falls, the short stock position generates an offsetting profit. (However, the customer still faces unlimited loss potential on the short stock itself.)

Once the short stock position is properly margined, there is **no additional margin requirement** on the short put.

<div class="info-box">
  <div class="info-box__title">Covered Put Examples</div>
  <p><strong>Example 1:</strong> A customer has a short position of 100 shares of ABC in a margin account. The customer sells 1 ABC Jan 50 Put @ $3. The short stock covers the short put, so <strong>no margin is required on the put</strong>. The customer receives $300 in premiums.</p>
  <p><strong>Example 2:</strong> On the same day in a margin account, a customer shorts 100 shares of ABC at $50 and sells 1 ABC Jan 50 Put @ $3. The customer must deposit 50% of $5,000, or $2,500 for the short stock. The short position covers the put (no margin on put). Since the customer receives $300 in premiums, the <strong>cash deposit is $2,200</strong>.</p>
</div>

#### Margin on Straddles and Spreads

##### Straddles

If a customer buys a straddle (buying an identical call and put on the same stock), they must deposit **100% of the combined premiums** because they are buying both contracts.

<div class="info-box">
  <div class="info-box__title">Real-World Example</div>
  <p>When ABC stock is at $51, a customer buys the following straddle:</p>
  <ul>
    <li>Buy 1 ABC Jan 50 Call @ $3</li>
    <li>Buy 1 ABC Jan 50 Put @ $4</li>
  </ul>
  <p>The customer must deposit the total premium: $3 + $4 = $700. This is also the <strong>maximum loss</strong> for the customer.</p>
</div>

<div class="test-tip">
  <p><strong>Test Tip:</strong> Deposits on short straddles are not tested on the Series 7. Focus on long straddles -- the deposit equals 100% of combined premiums.</p>
</div>

##### Spreads

Spreads are gain-limiting and risk-limiting positions where the customer buys and sells a contract on the same security with different strike prices or expirations. The key margin principle: **a customer cannot be required to put up more than they can lose**.

<div class="info-box">
  <div class="info-box__title">Spread Margin Examples</div>
  <p><strong>Debit Spread:</strong></p>
  <ul>
    <li>Buy 1 ABC Jan 50 Call @ $5</li>
    <li>Sell 1 ABC Jan 55 Call @ $3</li>
  </ul>
  <p>This is a <strong>long call spread</strong> (the long call has the higher premium). Net debit = $2. The deposit is $200, which equals the <strong>maximum potential loss</strong>.</p>

  <p><strong>Credit Spread:</strong></p>
  <ul>
    <li>Sell 1 ABC Jan 50 Call @ $5</li>
    <li>Buy 1 ABC Jan 55 Call @ $3</li>
  </ul>
  <p>This is a <strong>short call spread</strong> (the short call has the higher premium). Net credit = $2. The deposit is the difference in strike prices (5 points) minus the net credit (2 points) = $300. This is the <strong>maximum potential loss</strong>.</p>
</div>

#### Leveraged ETFs

<span class="key-term">Leveraged exchange-traded funds (ETFs)</span> are designed to generate multiples (e.g., 200%, 300%) of the performance of the underlying index or sector. Some are "short" or "inverse" leveraged ETFs, seeking to deliver performance opposite to the index. They use options, futures, and swaps to multiply returns -- which also means price swings can be dramatic.

FINRA's concern is that increased volatility means traditional strategy-based margin won't sufficiently account for the expected risk. As a result, the FINRA Board of Governors can require leveraged ETFs to maintain more than normal margin.

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Leveraged ETF Margin Rule:</strong> The minimum margin requirement is multiplied by the ETF's leverage factor.</p>
</div>

<div class="info-box">
  <div class="info-box__title">Leveraged ETF Examples</div>
  <p><strong>Example 1 (200% leverage):</strong> A customer buys 100 shares of ABC ETF at $200/share. Reg T = 50% of $20,000 = $10,000. But FINRA sets minimum margin at 3x the 25% minimum = 75% of $20,000 = <strong>$15,000</strong>. The customer must deposit $15,000 (this is also the minimum maintenance requirement).</p>
  <p><strong>Example 2 (300% leverage):</strong> A customer buys 100 shares of XYZ ETF at $40/share. Reg T = 50% of $4,000 = $2,000. FINRA minimum = 3 x 25% = 75% of $4,000 = $3,000. In this case, the <strong>FINRA minimum ($3,000) exceeds Reg T ($2,000)</strong>, so the customer deposits $3,000.</p>
</div>

---

### Topic 7: Opening a Margin Account

#### Cash vs. Margin Account Opening

To open a cash account, only the new account form is required -- the customer agrees to pay in full for all purchases. To open a margin account, additional documentation is required. A principal must approve all accounts.

#### The Margin Agreement

Before opening a margin account, the customer must sign a <span class="key-term">margin agreement</span>, which sets the terms and conditions between the customer and the broker-dealer. The agreement has three parts:

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>The Three Parts of a Margin Agreement:</strong></p>
  <ol>
    <li><strong>Hypothecation Agreement</strong> -- The customer pledges (hypothecates) purchased securities to the brokerage firm as collateral. Securities are held in <span class="key-term">street name</span> (registered in the firm's name). The agreement allows the broker-dealer to sell the securities if the account falls below minimum maintenance.</li>
    <li><strong>Credit Agreement</strong> -- Sets the terms and conditions of the loan, including that interest on the loan balance will be based on the broker loan rate (e.g., call loan rate plus 2%).</li>
    <li><strong>Loan Consent Agreement</strong> -- Allows the broker-dealer to lend out a customer's margined securities to other customers for short-selling purposes. This agreement is <strong>NOT required</strong>, but it is typically included in the margin agreement.</li>
  </ol>
</div>

#### Rehypothecation

The firm also has the right to <span class="key-term">repledge (rehypothecate)</span> the securities to a bank to raise funds. The Federal Reserve controls lending by banks to broker-dealers under <span class="key-term">Regulation U (Reg U)</span>. Funds are borrowed from the bank at the <span class="key-term">broker's call rate</span> (also called the call loan rate) -- the rate at which banks lend money to broker-dealers to fund margin loans.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Reg U = borrowing between banks and brokers. Reg T = borrowing between brokers and customers. The exam tests this distinction frequently. Think: "U" for "Upstream" (banks to brokers) and "T" for "To customers" (brokers to customers).</p>
</div>

#### Special Disclosures for Pattern Day-Trading Accounts

Before opening a day-trading account, the firm must provide a disclosure statement covering:

- Day trading can be extremely risky
- Be wary of exaggerated claims about potential profits
- Day trading requires knowledge of securities markets and firm operations
- Day trading will generate substantial commissions for the firm
- Day trading on margin can result in losses greater than one's investment
- Persons who day trade for others must be registered as an investment adviser or broker-dealer

#### Credit and Risk Disclosure Statements

Noninstitutional customers opening a margin account must also receive a <span class="key-term">credit disclosure statement</span> and a <span class="key-term">margin risk disclosure statement</span> explaining the risks of margin trading. This disclosure must be **redelivered annually**.

#### Customer Signature

The customer must sign the margin agreement **at or before the settlement of the first trade** in the account.

---

## Section 2: Fiduciary Accounts

A <span class="key-term">fiduciary account</span> is one where a third party acts for, and in the best interest of, the account owner. The fiduciary standard is the highest duty of care in the financial world -- it means putting someone else's interests ahead of your own, every single time. Types of fiduciary accounts include custodial accounts, guardian accounts, and trust accounts.

---

### Topic 1: Requirements for Fiduciary Accounts

#### Documentation

Fiduciary accounts generally cannot be opened unless the proper documentation appointing the fiduciary is received by the firm. Since the fiduciary is a third party, only they are permitted to trade in the account. The fiduciary cannot give trading authorization to another person (unless the account documentation specifically permits this, such as allowing an outside registered investment adviser to manage the account).

#### Cash Accounts Only

Fiduciary accounts are generally **prohibited from margin transactions** -- only cash accounts are permitted. To open a margin account for a fiduciary, the documents appointing the fiduciary must **specifically authorize** margin transactions.

#### The Prudent Person Rule and Legal List

Each state often limits fiduciaries in the types of investments they can make. State law requires fiduciaries to follow either:

- The <span class="key-term">prudent person rule</span>: only investments that a prudent individual would make are permitted
- A <span class="key-term">legal list</span>: a specific list of permissible investments provided by the state

Under these standards:
- **Aggressive options strategies** (e.g., naked call writing) are **prohibited**
- **Conservative options strategies** (e.g., covered call writing, buying protective puts) are **permissible**

#### Power of Attorney

A <span class="key-term">power of attorney (POA)</span> is not a type of account but a mechanism for granting authorization to a third party.

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Power of Attorney Types:</strong></p>
  <ul>
    <li>A <strong>full POA</strong> allows trading AND the ability to make withdrawals</li>
    <li>A <strong>durable POA</strong>: if the grantor becomes mentally incompetent, the person with POA <strong>retains control</strong> over the account</li>
    <li>A <strong>nondurable POA</strong>: if the grantor becomes mentally incompetent, the power <strong>ceases</strong></li>
    <li><strong>Any POA terminates</strong> upon the death of the grantor</li>
    <li>An <strong>incarcerated individual</strong> (a person in prison) can still grant a POA to someone to manage their financial affairs</li>
  </ul>
</div>

<div class="test-tip">
  <p><strong>Test Tip:</strong> Durable POA survives mental incompetence; nondurable POA does not. But BOTH terminate upon death. The exam tests the incompetence distinction more than the death rule.</p>
</div>

---

### Topic 2: Types of Fiduciary Accounts (Custodial Accounts)

#### Custodial Accounts

<span class="key-term">Custodial accounts</span> are accounts where a third party manages the account on behalf of a beneficiary, most often a minor. The third party must manage the account in the best interest of the beneficiary.

#### UGMA and UTMA

Two custodial account types appear on the exam: the <span class="key-term">Uniform Gifts to Minors Act (UGMA)</span> and the <span class="key-term">Uniform Transfers to Minors Act (UTMA)</span>.

Key rules:
- An adult must open and manage the account on behalf of a minor
- **One custodian, one minor** -- the minor and custodian do not need to be related, but the custodian must be an adult
- The **minor is the official owner** of the account and its assets; the custodian manages the account
- These are **NOT joint accounts** -- all assets are the property of the minor
- Custodians have third-party trading authorization; minors cannot trade in the account
- Dividends, interest, and capital gains are considered <span class="key-term">unearned income</span>

#### Tax Treatment (Kiddie Tax)

The account must be opened under the **minor's Social Security number**. A portion of earnings is taxable at the minor's rate; above a certain threshold, the **parent's/guardian's tax rate** applies. Regardless of the rate, the taxes are the **child's responsibility**. These rules are called the <span class="key-term">kiddie tax</span>.

#### Irrevocable Gifts

Gifts can be made to the account by other adults, but all gifts are <span class="key-term">irrevocable</span> -- they cannot be withdrawn or reversed once given. Gifts can be either cash or fully paid securities.

#### Death of Minor

In the event of the minor's death, the account assets transfer to the **minor's estate** -- not directly to the parents.

#### Fiduciary Duties of the Custodian

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Custodian Rules:</strong></p>
  <ul>
    <li>Must follow the <strong>prudent person rule</strong></li>
    <li>May withdraw funds only for the <strong>benefit of the minor</strong> or to reimburse documented expenses</li>
    <li>Account must be a <strong>cash account</strong> -- no margin</li>
    <li>Securities cannot be used as <strong>collateral on a loan</strong></li>
    <li>Must <strong>reinvest cash</strong> earned in the account within a reasonable time</li>
    <li>May <strong>NOT write naked calls</strong></li>
    <li>Minors may <strong>sue custodians</strong> for mismanagement</li>
  </ul>
</div>

#### UGMA Accounts

Under UGMA, full rights to account assets transfer to the minor upon reaching the **age of majority** in their state of residence. The minor is always the legal owner, and the account uses the minor's Social Security or tax ID number.

UGMA investments are limited to **financial assets** -- stocks, bonds, mutual funds, etc. Investments **cannot** include real estate, collectibles, or uncovered derivative products.

#### UTMA Accounts

UTMA accounts are similar to UGMA but with two important differences:

1. **Broader asset range** -- UTMA accounts can include real estate and other non-financial assets
2. **Delayed transfer** -- The custodian can delay the transfer of assets beyond the age of majority, but **no later than age 25** (actual age limits vary by state)

#### ABLE Accounts

Do not confuse UGMA/UTMA accounts with <span class="key-term">Achieving a Better Life Experience (ABLE) accounts</span>, which are designed to allow people with disabilities and their families to save for the future. An ABLE account can be established for either a child or an adult, provided they have a disability that began **before the age of 46**.

#### Guardian Accounts

A <span class="key-term">legal guardian</span> is a person appointed by a court to protect the assets of a minor or an incompetent adult. To open a <span class="key-term">guardian account</span>, the firm must obtain a copy of the **court order** appointing the guardian. The account cannot be opened only in the name of a minor or incompetent adult.

---

### Topic 3: Trust Accounts

#### Overview

<span class="key-term">Trust accounts</span> are most commonly used to ensure the smooth passing of assets to heirs upon death. They may also minimize estate and inheritance taxes, or provide for a minor child or a loved one with a disability.

#### Key Parties

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Three Parties in a Trust:</strong></p>
  <ul>
    <li><strong>Grantor</strong> (also: trustor, donor, settlor) -- the person who sets up the trust and puts assets into it</li>
    <li><strong>Trustee</strong> -- the person appointed to manage the assets</li>
    <li><strong>Beneficiary</strong> -- the person who will eventually receive the assets (can be a minor, adult, or mentally incompetent adult)</li>
  </ul>
</div>

Like estate accounts, trust accounts are custodial accounts because the trustee manages the account on behalf of the beneficiaries. The trustee has trading authority, but a third party can also have trading authority **if listed in the trust agreement**.

#### Trust Agreement

When opening a trust account, the firm must obtain a copy of the <span class="key-term">trust agreement</span>. The agreement specifies what transactions the trustee is authorized to perform. These accounts **cannot be margin accounts** unless specifically authorized by the trust agreement.

<div class="test-tip">
  <p><strong>Test Tip:</strong> The trustee -- not the grantor or the beneficiaries -- is the person from whom the representative must take instructions. The trustee must follow the instructions in the trust agreement or will. This trips people up when the grantor wants to make changes.</p>
</div>

#### Revocable vs. Irrevocable Trusts

A <span class="key-term">revocable living trust</span> can be revoked (eliminated) at any time before death by the person who owns the assets (the trustor). If revoked, ownership reverts back to the original owner. The grantor may appoint themselves as trustee.

An <span class="key-term">irrevocable trust</span>, once set up, **cannot be undone or revoked**. Irrevocable trusts are typically given their own tax identification numbers and treated as separate taxpayers. Any income earned within the trust is subject to annual taxation.

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>The Key Tax Difference Between Trust Types:</strong></p>
  <ul>
    <li>Assets in an <strong>irrevocable trust</strong> are <strong>NOT included</strong> in the grantor's estate for estate tax purposes</li>
    <li>Assets in a <strong>revocable trust</strong> <strong>ARE included</strong> in the trustor's estate for tax purposes</li>
  </ul>
  <p>For both types, the trustee is a fiduciary who must put the beneficiary's interests first and manage assets prudently.</p>
</div>

(If you're wondering why anyone would choose a revocable trust given the tax disadvantage, the answer is flexibility. Some people value the ability to change their mind more than the estate tax savings -- a very human impulse that no regulation can account for.)

#### Living vs. Testamentary Trusts

- <span class="key-term">Living trusts</span>: Created while a person is living
- <span class="key-term">Testamentary trusts</span>: Initiated upon a person's death, according to the terms of a will. The instructions are carried out by a trustee

<div class="test-tip">
  <p><strong>Test Tip:</strong> Testamentary trusts do NOT avoid probate -- a court must substantiate the claims within the will. Living trusts, particularly revocable living trusts, do avoid probate. The exam tests this distinction.</p>
</div>

#### Charitable Trusts

A <span class="key-term">charitable trust</span> is for customers who want to leave part of or all their estate to a charity.

A <span class="key-term">charitable remainder trust (CRT)</span> works as follows: assets are given to the charity before the donor's death, but the donor receives a **fixed amount of income** from the assets periodically until death. After death, the remainder of the assets belong to the charity. A CRT is **irrevocable**.

---

## Section 3: Joint, Business, and Options Accounts

Several additional account types appear on the Series 7. Joint accounts involve more than one owner. Business accounts serve partnerships, corporations, or investment advisers managing accounts on behalf of clients. Options accounts follow specific rules established by the Chicago Board Options Exchange (Cboe) and the Options Clearing Corporation (OCC).

---

### Topic 1: Joint Accounts

#### General Rules

When more than one party is named on an account:

- New account information must be obtained **for each party**
- **All parties** are allowed access and may make trades independently
- Checks issued must be payable **to all parties** on the account
- Social Security numbers are collected from each owner, but joint accounts report taxable events under a **primary tax identification number** belonging to one owner
- Each owner is responsible for their respective tax bill (in many cases, each party claims half of gains or losses)

#### Two Types of Joint Account Ownership

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>1. Joint Tenants with Right of Survivorship (JTWROS):</strong></p>
  <ul>
    <li>Each party owns an <strong>undivided interest</strong> in the account</li>
    <li><strong>Bypasses probate</strong> -- if one party dies, the survivor becomes sole owner</li>
    <li>Most commonly used by <strong>married couples</strong></li>
  </ul>
  <p><strong>2. Tenancy in Common (TIC):</strong></p>
  <ul>
    <li>Each party specifies a <strong>percentage interest</strong> in the account</li>
    <li>If one party dies, their percentage interest passes to their <strong>estate</strong> (can be willed to anyone)</li>
    <li>Most commonly used by <strong>business partners</strong></li>
  </ul>
</div>

#### Transfer-on-Death (TOD)

<span class="key-term">Transfer-on-death (TOD)</span> is not an account type but a designation that allows the owner to pass an account to a beneficiary upon death. The owner keeps complete control of the account during their lifetime. Similar to JTWROS, a TOD designation **avoids probate**.

---

### Topic 2: Business Accounts

#### Corporate Accounts

To open a corporate account, the firm must receive a copy of the <span class="key-term">corporate resolution</span>, which must permit accounts to be opened and designate individuals with trading authorization. A corporate tax identification number is required. Firms may also request a copy of the corporate charter.

#### Limited Liability Company (LLC) Accounts

An <span class="key-term">LLC</span> combines the benefits of a sole proprietorship or partnership with those of a corporation. Starting an LLC requires filing <span class="key-term">articles of organization</span> with the secretary of state, including a statement of purpose and expected duration (an LLC may exist perpetually or have a specific termination date).

To open an account, an LLC must provide a copy of their articles or certificate of organization. If the LLC has only one member, that member's Social Security number can be used in place of an employer identification number.

#### Partnership Accounts

To open a partnership account, the firm must obtain a copy of the <span class="key-term">partnership agreement</span>. Like a corporate resolution, it must allow for opening the account and name the partners authorized to trade.

#### Investment Adviser Accounts

An <span class="key-term">investment adviser</span> provides investment advice for a fee and is considered a fiduciary. An investment adviser account is typically held in the **customer's name**, but the adviser has discretionary authority.

When an adviser has many customers, they might open an <span class="key-term">omnibus account</span> -- an account held in the adviser's name containing all its customers' securities. To open an omnibus account, the investment adviser must fill out individual new account forms for each customer, along with a third-party trading authorization (since the customer is granting POA to the adviser).

#### Wrap Accounts

A <span class="key-term">wrap account</span> provides investment advice and a certain number of brokerage transactions in a single package. The investment adviser trades accounts for clients, charging an **annual management fee**. Confirmations and statements go to both the customer and the adviser.

Wrap accounts are defined as an **advisory product** because they charge either a flat fee or a percentage of assets. To offer advisory products, a representative must be **dually registered** as a FINRA broker-dealer representative and a <span class="key-term">registered investment adviser (RIA)</span> representative.

#### Institutional Accounts

An <span class="key-term">institutional account</span> is held by a bank, investment company, registered investment adviser, or any other business or individual with total assets of at least <span class="key-term">$50 million</span>.

Institutional accounts are considered sophisticated investors who do not need retail-level protections. The suitability obligation is fulfilled if:

- The broker-dealer reasonably believes the institutional customer can **evaluate risk independently**
- The customer affirms it is **exercising independent judgment** when evaluating the broker-dealer's recommendations

---

### Topic 3: Options Accounts

#### Cboe Requirements

The Chicago Board Options Exchange (Cboe) has its own requirements for opening options accounts, similar to FINRA's but with specific additions.

#### Required Information

To open an options account, the customer must be asked specifically about:

- Investment objective
- Investment experience
- Financial situation
- Financial needs
- Marital status
- Net worth
- Liquid net worth
- Estimated annual income

If the customer **refuses to disclose** any of this information, the representative must note "not disclosed" for each such item. The Cboe states it is then up to the approving manager to decide whether the account should be opened.

#### Options Agreement

Cboe requires the customer be sent a copy of the <span class="key-term">options agreement</span>. By signing, the customer agrees to abide by trading restrictions imposed by the member firm and to comply with OCC rules (e.g., position limits, exercise limits). If the customer's financial situation changes materially, the options agreement must be amended.

#### Account Approval

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>Options Account Approval Process:</strong></p>
  <ol>
    <li>The registered representative signs the new account form, indicating the information is true and accurate</li>
    <li>After assessing suitability, a <span class="key-term">Registered Options Principal (ROP)</span> must approve in writing the customer's account for options transactions</li>
    <li>A FINRA-registered <span class="key-term">Branch Office Manager (BOM)</span> may <strong>initially approve</strong> an options account, but <strong>ultimate approval</strong> must come from a ROP</li>
  </ol>
</div>

#### Options Disclosure Document (ODD)

The customer must also receive an <span class="key-term">Options Disclosure Document (ODD)</span> created by the OCC. This must be delivered **by the date of the principal's approval**.

#### The 15-Day Rule

<div class="critical-concept">
  <div class="critical-concept__label">MEMORIZE THIS</div>
  <p><strong>The 15-Day Return Rule:</strong></p>
  <ul>
    <li>Once approved, the customer may begin trading immediately</li>
    <li>The customer must return the <strong>signed options agreement</strong> within <strong>15 days</strong> of the account being opened</li>
    <li>If not received within 15 days: the customer <strong>cannot open new positions</strong> but <strong>may close</strong> existing positions</li>
    <li>If the agreement is subsequently received, the restriction is removed</li>
  </ul>
</div>

#### Options Accounts for Associated Persons

If a representative of another firm wishes to open an options account at another member firm, they must first receive **written approval from their employer**. If approved, all statements and confirmations will be **automatically sent** to the employing broker-dealer.

<div class="test-tip">
  <p><strong>Test Tip:</strong> The options account approval chain is: RR signs the form, BOM may give initial approval, but the ROP gives final approval. The ODD must be delivered by the date of the principal's approval, and the signed options agreement must be returned within 15 days. These timing requirements are heavily tested.</p>
</div>

---

## Chapter Summary

<div class="critical-concept">
  <div class="critical-concept__label">Key Takeaways</div>
  <p><strong>Reg T Initial Margin:</strong> 50% for both long and short positions on stocks and convertibles. Exempt securities (governments, agencies, munis, commercial paper) are not subject to Reg T initial margins but are subject to FINRA maintenance. Deposit due by T+3 (S+2). Can deposit fully paid marginable securities worth 2x the call amount instead of cash.</p>
  <p><strong>Marginable vs. Non-Marginable:</strong> Exchange-listed, Nasdaq, government, and municipal securities are marginable. Non-marginable: new issues traded less than 30 days, mutual fund shares, securities under $5/share. Mutual fund shares held 30+ days can be used as collateral but never purchased on margin.</p>
  <p><strong>Short Selling:</strong> Can only be done in a margin account. 50% initial margin. $2,000 absolute minimum equity (regardless of trade size). Fiduciary and retirement accounts may not sell short.</p>
  <p><strong>Cash Account Rules:</strong> Payment due by S+2 (T+3). Reg T extension available from FINRA under exceptional circumstances (additional 2+ business days). Failure to pay = sell-out and 90-day freeze. Free-riding: buying without intent to pay, selling to generate cash -- results in loss of profits and 90-day freeze.</p>
  <p><strong>Restricted Accounts:</strong> Equity below 50% but above minimum maintenance. No action required from customer -- can still trade with 50% deposit on new purchases. Long equity formula: LMV - Debit = Equity. Short equity: Credit Balance = SMV + Equity.</p>
  <p><strong>Minimum Maintenance:</strong> Long = 25%, Short = 30%. Long margin call trigger = Debit / 0.75. Short margin call trigger = Credit Balance / 1.3. Margin calls must be met promptly (typically 3 business days). If unmet, broker-dealer sells out positions -- customer has no control over which securities are sold. Firms can set higher maintenance than FINRA's minimum.</p>
  <p><strong>SMA and Buying Power:</strong> Excess equity = equity above 50% of LMV. Buying power = 2x SMA. SMA can be withdrawn as cash (but it becomes a loan added to the debit balance).</p>
  <p><strong>Pattern Day Traders:</strong> 4+ day trades in 5 business days. $25,000 minimum equity. 25% maintenance based on highest intraday value. Buying power = 4x maintenance excess (2x with outstanding margin call). Special risk disclosures required before opening.</p>
  <p><strong>Portfolio Margin:</strong> Risk-based (not strategy-based). Dramatically reduces margin for hedged stock positions. No benefit for long options or spreads. Cannot be used for bonds. Max 15% for most equities (30% if concentrated). Minimum equity: $100K individual, $500K prime brokerage, $5M for unlisted derivatives/day trading. Requires FINRA approval for the firm, ROP approval for the account, risk disclosure statement, and 3-day deficiency payment.</p>
  <p><strong>Options Margin:</strong> Long options = 100% of premium. LEAPS = 75% (100% within 9 months of expiration). Covered calls (own the stock) = no margin on call. Covered puts (short the stock) = no margin on put. Straddles = 100% of combined premiums. Debit spreads = net debit. Credit spreads = difference in strikes minus net credit. Leveraged ETFs = minimum margin multiplied by leverage factor.</p>
  <p><strong>Margin Agreement:</strong> Three parts -- hypothecation (pledge securities), credit (loan terms), loan consent (lending to short sellers, NOT required). Rehypothecation = firm repledges to bank under Reg U. Customer signature required at or before settlement of first trade. Annual redelivery of credit and risk disclosures.</p>
  <p><strong>Fiduciary Accounts:</strong> Cash only (unless documents specifically authorize margin). Prudent person rule or legal list. No naked calls. Durable POA survives mental incompetence; nondurable does not. All POAs terminate at death. Incarcerated individuals can still grant POA.</p>
  <p><strong>Custodial Accounts (UGMA/UTMA):</strong> One custodian, one minor. Minor is legal owner. Irrevocable gifts only. Kiddie tax applies (minor's SSN). Cash account only -- no margin, no collateral, no naked calls. UGMA: financial assets only, transfers at age of majority. UTMA: broader assets (including real estate), transfer can be delayed to age 25. Minor's death: assets go to minor's estate, not parents. ABLE accounts: for disabilities beginning before age 46.</p>
  <p><strong>Trust Accounts:</strong> Grantor (trustor/donor/settlor), trustee, beneficiary. Trust agreement required. Cash only unless trust agreement authorizes margin. Revocable trust: assets included in grantor's estate for tax purposes. Irrevocable trust: assets excluded from estate -- may have own tax ID. Living trusts created during life. Testamentary trusts created upon death (do NOT avoid probate). CRT: irrevocable, donor receives income until death, charity gets remainder.</p>
  <p><strong>Joint Accounts:</strong> JTWROS = undivided interest, bypasses probate, survives death (common for spouses). TIC = specified percentage interest, passes to estate on death (common for business partners). TOD designation avoids probate. All parties get access; checks payable to all.</p>
  <p><strong>Business Accounts:</strong> Corporate = corporate resolution + tax ID. LLC = articles of organization. Partnership = partnership agreement. Investment adviser = customer's name but adviser has discretion; omnibus account for multiple clients. Wrap account = advisory product, requires dual registration. Institutional = $50M+ in assets, reduced suitability obligations.</p>
  <p><strong>Options Accounts:</strong> Must ask about objectives, experience, financial situation, needs, marital status, net worth, liquid net worth, and income. ROP gives final approval (BOM may give initial approval). ODD delivered by date of principal's approval. Signed options agreement due back within 15 days (or customer can only close positions). Associated persons need written employer approval; statements automatically sent to employer.</p>
</div>
