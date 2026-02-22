# Chapter 9: Fundamentals of Options

_Series 7 Exam Weight: ~20-25 Questions (15-18%)_

---

## Section 1: Options Basics

In 1973, the Chicago Board Options Exchange opened its doors and changed finance forever. Before
then, options were obscure contracts traded informally between parties who barely trusted each
other. The CBOE standardized everything—strike prices, expiration dates, contract sizes—and created
a clearinghouse to guarantee every trade. Within a few years, options went from curiosity to
cornerstone of modern finance.

Options are among the most heavily tested topics on the Series 7. If you feel uncomfortable with
this content, review the material and move on to the next chapter, which covers more complex options
strategies.

### Why This Section Matters

Understanding options terminology is essential before attempting to understand options strategies.
Options are derivative securities whose value is based on the value of the underlying security.
Rights and warrants are also derivative securities. Rights and warrants are also derivatives linked
to a specific underlying stock. Options share some of the characteristics of these other
derivatives.

---

### Topic 1: Terminology and Uses of Options

Understanding the terminology will help you to master options. Options are securities whose
underlying value is based entirely from the value of the underlying investments to which they are
linked. For this reason, options are sometimes referred to as
<span class="key-term">derivatives</span>. These underlying assets can be individual stocks, baskets
of stocks, indexes, and even foreign currencies. An options' value will rise or fall in tandem with
its linked underlying investment.

There are 3 basic options strategies:

- **Speculation:** Making a bet on the future price of the underlying security
- **Hedging:** Protecting an existing long or short position—individual security or portfolio
- **Income generation:** Creating an additional income stream from existing long or short position

We will examine each of these strategies in depth and understand how the calculations work as we
progress through this chapter. Remember, don't worry about the math. The exam will likely focus more
on the "how" and "why" of a given option strategy as opposed to questions requiring you to do
extensive profit and loss calculations.

---

### Call Contract

An option is a contract between two parties. The buyer of the contract is called the option
<span class="key-term">holder</span>. The holder is also referred to as being "long" the contract.
The seller of the contract is called the option <span class="key-term">writer</span>. The writer is
also referred to as being "short" the contract.

When the contract is entered into, the buyer (holder) will pay an amount of money called a
<span class="key-term">premium</span> to the seller (writer). The premium is paid as consideration
for the writer making a promise regarding the underlying security. This promise is sometimes
referred to as the writer's <span class="key-term">obligation</span>. In return for paying the
premium, the buyer has the <span class="key-term">right</span> to expect that the obligation is met.

Notice these two important words: rights and obligation.

<div class="info-box">
  <div class="info-box__title">Options Terminology Flow</div>
  <p><strong>Contract Buyer</strong> → Contract Holder → Long the Contract</p>
  <p><strong>Contract Writer</strong> → Contract Seller → Short the Contract</p>
</div>

Rights are voluntary, meaning it is the buyer's choice whether to exercise the contract or not. The
writer does the money, so their obligation is mandatory. This means the writer MUST honor their
promise.

- Option buyers may <span class="key-term">exercise</span> to receive a security (call) or right
- Option writers <span class="key-term">receive premiums</span> and take on an
  <span class="key-term">obligation</span>

<div class="test-tip">
  <p><strong>Test Tip:</strong> Do not confuse the premium with the strike price of the underlying security. The strike price is a contractual term fixed throughout the contract's life. The premium represents the market price of the option. As the market price of the stock moves, the contract price is "reset" to adjust to its changing value. Additional shares are issued to existing shareholders, but this will result in a proportional reduction in the stock price.</p>
</div>

---

### What Is a Call Contract?

The owner type of option gives the holder the right to buy the underlying stock from the writer at a
fixed price at any time during the option's life. It also gives the holder the right to "call" the
security from the writer, making these types of contracts called <span class="key-term">call
options</span>. The writer MUST buy the stock from the holder at the agreed-upon contract price if
called upon to honor the contract.

<div class="critical-concept">
  <div class="critical-concept__label">Call Contract Rights and Obligations</div>
  <p><strong>Put Buyer</strong> = RIGHT to SELL (deliver) stock</p>
  <p><strong>Put Writer</strong> = OBLIGATION to BUY stock</p>
</div>

**Example of a Call Contract:**

A customer buys 1 XXX Jan 50 Call @ $5.

The customer has the right to buy 100 shares of XXX stock at $50 per share (the strike price) until
the contract expires in January, no matter what happens to XXX's market price. For this right, the
buyer would pay a premium of $5, which means $5 for each of the 100 shares, or $500.

---

### Put Contract

The second type of option gives the holder the right to sell the underlying stock to the writer at a
fixed price at any time during the option's life. It also gives the holder the right to "put" the
security to the writer, making these types of contracts called <span class="key-term">put
options</span>. The writer MUST buy the stock from the holder at the agreed-upon contract price if
called upon to honor the contract.

<div class="critical-concept">
  <div class="critical-concept__label">Put Contract Rights and Obligations</div>
  <p><strong>Call Buyer</strong> = RIGHT to BUY stock</p>
  <p><strong>Call Writer</strong> = OBLIGATION to SELL stock</p>
</div>

**Example of a Put Contract:**

A customer buys 1 XXX Jan 50 Put @ $5.

The customer has the right to sell 100 shares of XXX stock at $50 a share until the contract expires
in January, no matter what happens to XXX's market price. For this right, the investor must pay $500
per contract or $1,000 for all 5 contracts ($500 × 5 = $1,500).

---

### Topic 2: Put and Call Contract Outcomes

The holder of a contract has three choices regarding the contract:

- Exercise the option
- Leave the option to expire
- Trade the option

#### If the Contract Is Exercised

If a call contract is exercised, the holder buys the stock at the strike price from the contract
writer. The writer is assigned the contract is obligated to sell the underlying stock at the
agreed-upon strike price.

If a call option is exercised, the option writer must deliver the stock 1 business day after the
exercise date.

If a put option is exercised, the put writer must pay the strike price and buy the stock 1 business
day after the exercise date.

<div class="info-box">
  <div class="info-box__title">Call Exercise</div>
  <p><strong>Buyer</strong> pays cash → <strong>Writer</strong> sells stock to buyer → <strong>Buyer</strong> has the right to buy</p>
  <p><strong>Writer</strong> has the obligation to sell</p>
</div>

<div class="info-box">
  <div class="info-box__title">Put Exercise</div>
  <p><strong>Buyer</strong> sells stock to writer → <strong>Writer</strong> pays cash → <strong>Buyer</strong> has the right to sell</p>
  <p><strong>Writer</strong> has the obligation to buy</p>
</div>

Why is settlement one business day? The writer might need to go to the marketplace for the stock,
and a stock trade takes one business day to settle. Note that the OCC guarantees settlement on both
sides, so even if the writer is unable to fulfill their obligation.

Stock options are <span class="key-term">American style</span>, which means the contract can be
exercised at any time. In contrast, most index options are <span class="key-term">European
style</span>, which means the option can only be exercised at expiration.

#### If the Contract Is Left to Expire

If the holder of a contract allows the contract to expire, the premium paid is lost. The premium is
the maximum loss for both call and put buyers. Most options expire within 9 months of issuance. Some
options, known as <span class="key-term">Long-Term Equity AnticiPation Securities (LEAPS)</span>,
can have a maximum life of up to 39 months, but this is often approximated to 3 years.

#### If the Contract Is Traded

Options can be traded, just like stocks and bonds. When a buyer trades a contract, they sell the
contract to someone else before it expires. The buyer would profit if the premium received for
selling the contract exceeded what was originally paid for it. The holder would incur losses if the
premium received was below the contract's purchase price. Once the trade is completed, we would say
that the buyer has <span class="key-term">closed their position</span>.

Likewise, the seller of a contract can close their position by buying the same contract in the
market. The short (sold) position is netted against the long (bought) position in the market.

Options contracts are traded on option exchanges. For example, IBM stock is listed on the New York
Stock Exchange (NYSE). IBM option contracts trade on the Chicago Board Options Exchange (Cboe).

Both stock and options trade in 1 business day (T+1). The last day to trade an equity option is the
third Friday of the expiration month. Options expire at noon on Saturday, 11:59 p.m. (Eastern Time).
An option contract can also be exercised on that third Friday of the month.

Unlike stocks, options are not issued by a corporation with a fixed number of shares. Standardized
option contracts are created under rules set by the <span class="key-term">Options Clearing
Corporation (OCC)</span>. Is a subsidiary of the Cboe. The OCC creates options contracts and helps
to organize the clearing and settlement of these securities. The OCC issues the contracts,
guarantees the contracts, and acts as a clearinghouse for all listed options.

<span class="key-term">Position Limits:</span> A person who accumulates a large number of contracts
has "control" over 100 times that number of shares of stock. The OCC limits the number of positions
that any individual can take in a group of individuals, "acting in concert." The limit varies
depending on the trading volume of the underlying stock—the higher the trading, the higher the
limit. The limit is applied to one "side" of the market. Long calls and short puts are on the
bullish side of the market. Long puts and short calls are on the bearish side of the market.

<div class="info-box">
  <div class="info-box__title">Options Flow</div>
  <p><strong>Contract Buyer</strong> (premium $$$) → <strong>Options Clearing Corporation</strong> → <strong>Contract Seller</strong></p>
  <p><strong>Option Contract</strong> flows from Contract Seller through OCC to Contract Buyer</p>
</div>

---

### Opening and Closing Positions

When someone buys or sells a call or put, the buyer is said to be <span class="key-term">opening a
position</span>. The buyer of a call or put is opening a long position. The seller of a call or put
is opening a short position. The holder is making an <span class="key-term">opening purchase</span>;
the writer is making an <span class="key-term">opening sale</span>.

<span class="key-term">Closing a position</span> occurs when the holder or writer of an option takes
the opposite position on the same option contract.

<div class="comparison-table">
  <table>
    <caption>Ways to Open and Close Positions</caption>
    <tr>
      <th>Ways to Open a Position</th>
      <th>Ways to Close a Position</th>
    </tr>
    <tr>
      <td>To open a position - buy a call</td>
      <td>To close that position - sell the call</td>
    </tr>
    <tr>
      <td>To open a position - sell a call</td>
      <td>To close that position - buy the call</td>
    </tr>
    <tr>
      <td>To open a position - buy a put</td>
      <td>To close that position - sell a put</td>
    </tr>
    <tr>
      <td>To open a position - sell a put</td>
      <td>To close that position - buy a put</td>
    </tr>
  </table>
</div>

The closing of a position will likely result in a gain or a loss over time. It is likely the premium
of the option has gone up since inception in the market. This will reflect the rise in intrinsic
value of the option.

#### Open Interest

<span class="key-term">Open interest</span> refers to the number of option contracts (both calls and
puts) outstanding. Opening purchases and opening sales increase open interest, closing sales and
closing purchases decrease open interest. The greater the open interest, the greater the daily
trading volume in the issue.

---

### Summary: Options Basics

<div class="critical-concept">
  <div class="critical-concept__label">Section 1 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Terminology and uses of options</td>
      <td>Buyer, writer, contract, strike price, premium, expiration, speculation, hedging, income generation</td>
    </tr>
    <tr>
      <td>Put and call contract outcomes</td>
      <td>Expiration, exercise, traded</td>
    </tr>
  </table>
</div>

---

## Section 2: Options Pricing

In this section, we will examine how options are priced. The pricing of an option depends on the
relationship between the value of the underlying asset and the contract's strike price, another
factor affecting pricing is the time remaining until expiration; generally more time remaining until
expiration generally means an option costs more.

### Why This Section Matters

Understanding option pricing—intrinsic value, time value, in/out/at the money—is fundamental to
understanding when options should be exercised and what strategies make sense.

---

### Topic 1: Options Pricing

Just as the market price of stock is continuously fluctuating, the market price of options will rise
and fall in relation with the value of the underlying stock. For example, if a stock price rises in
value relative to other stocks, the price of call options of the underlying security. The strike
price is a contractual term fixed throughout the contract's life. The premium represents the market
price of the option. As the market price of the stock moves, the contract price is "reset" to adjust
to its changing value.

An option's price has 2 components: its intrinsic value and its time value.

<div class="critical-concept">
  <div class="critical-concept__label">Options Premium Formula</div>
  <p><strong>Premium = Intrinsic Value + Time Value</strong></p>
</div>

#### Intrinsic Value

A call is <span class="key-term">in the money (ITM)</span> if the market price is higher than the
strike price of the option. If a customer was to exercise, they would buy the stock at the strike
price and could potentially sell it for more money.

If a stock trades at $40, a $35 call has an intrinsic value of $5 since the holder has the right to
buy at $35 when the market price is $40.

**In the Money (Intrinsic Value) for Calls:**

The option has more intrinsic value when the market price of the stock falls below the strike price
of the option. So, if the market price is the stock falls below the strike price of the option, the
call is <span class="key-term">in the money</span>.

If the market price is less than $40, a $45 put has intrinsic value of $5 since the holder has the
right to sell at $45 when the market price is $40.

<div class="test-tip">
  <p><strong>Test Tip:</strong> There is no such thing as negative intrinsic value. Intrinsic value is either positive (in the money) or zero (at the money/out of the money). The option would have to sell for a premium where the buyer would exercise "in-the-money" options only, which is logical when answering an exam question.</p>
</div>

**In the Money (Intrinsic Value) for Puts:**

The option has more intrinsic value when the market price of the stock falls below the strike price
of the option. So, if the market price is lower than the strike price of the option, the put is
<span class="key-term">in the money</span>.

#### Time Value

The amount of intrinsic value is the amount by which the option is in the money.

<span class="key-term">Time value</span> represents the amount that options speculators are willing
to pay beyond intrinsic value. Increasing intrinsic value is good for the option buyer (speculators
are becoming more valuable, increasing intrinsic value) is bad for the writer because the likelihood
of being called/put their obligation is increasing.

The premium of an option is good for the option buyer (speculators will be more for in-the-money
options). Buyers want intrinsic value; sellers want time value (if the option is out of the money,
the option will expire worthless, and the writer will keep the premium).

<div class="test-tip">
  <p><strong>Test Tip:</strong> Buyers want more intrinsic value; sellers want time value (if option writer is concerned limited, when answering an exam question).</p>
</div>

#### Combining Intrinsic and Time Value

At any given expiration date, more in-the-money options will increase. On the last day of trading,
the option will either sell at its intrinsic value only (if ITM) versus at no intrinsic value only
if the option is out of the money, the option would have no intrinsic and no time value.

**Example:**

A customer buys 1 ABC Jan 50 Call @ $4 when the market price of ABC is $52. How much of the premium
is due to intrinsic value?

**Answer:** Since the contract is in the money by $2 when the market price ($52) minus the strike
price ($50), of the remaining $2 price is due to time value.

**As Contract Goes In the Money—Premium Increases**

As a contract value increases, there is an increase in value of the option contract. The premium is
affected by the intrinsic value of the option. As a contract moves out of the money, the premium is
the market falls to reflect the decreased likelihood.

**As Contract Goes Out of the Money—Premium Decreases**

The opposite is true when the option goes out of the money. As an out-of-the-money contract falls in
value because there is no intrinsic value, the bulk of the money contract would not be exercised.
The holder is out-of-the-money when the market price falls to reflect the strike price.

#### In and Out from Each Party's Perspective

Writers and buyers are looking for the money from the same thing. Yet buyers want the right to buy
(calls) or sell (puts) at a price that is perceived as only doing so when it would be worthwhile.
Since a call option buyer is seeking to lock in an in-the-money position at strike price.

**Whether a call option is in or out of the money:**

- If exercised, put writers would be forced to buy (have the stock put to them) at a price higher
  than the market
- If exercised, call writers would be forced to sell (deliver stock) at a price below the current
  market

Writers sell options with a current mark out of the money when they hope that the option will stay
worthless, and the writer's goal would be to keep the premium paid by the option buyer, not to be in
the money.

<div class="comparison-table">
  <table>
    <caption>Is the Option In or Out of the Money?</caption>
    <tr>
      <th>Option</th>
      <th>Market Price is Higher Than the Strike</th>
      <th>Market Price is Lower Than the Strike</th>
    </tr>
    <tr>
      <td>Call</td>
      <td>In the Money</td>
      <td>Out of the Money</td>
    </tr>
    <tr>
      <td>Put</td>
      <td>Out of the Money</td>
      <td>In the Money</td>
    </tr>
  </table>
</div>

---

### Summary: Options Pricing

<div class="critical-concept">
  <div class="critical-concept__label">Section 2 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Premium components</td>
      <td>Intrinsic value and time value</td>
    </tr>
    <tr>
      <td>Premium determinants</td>
      <td>Determined by the moneyness, in the money, at the money, out of the money</td>
    </tr>
  </table>
</div>

---

## Section 3: Speculative Strategies

In this section, we will examine how options are used to speculate on the direction of the
underlying asset. Options buyers gain if the market moves in their favor; options writers gain if
the underlying remains stable or moves against the buyer. The primary risks and rewards are
different for options buyers and options sellers. Buyers limit their loss to the premium paid, while
the sellers' gain is limited to the premium received. Strategies that profit from a rising market
are called bullish strategies. Strategies that profit from falling markets (bears) are bearish
strategies.

There are four speculative strategies:

<div class="comparison-table">
  <table>
    <tr>
      <th></th>
      <th>Long Call</th>
      <th>Short Call</th>
    </tr>
    <tr>
      <td>Market Bias</td>
      <td>Bullish</td>
      <td>Bearish</td>
    </tr>
    <tr>
      <td>Maximum Gain</td>
      <td>Unlimited</td>
      <td>Premium</td>
    </tr>
    <tr>
      <td>Maximum Loss</td>
      <td>Premium</td>
      <td>Unlimited</td>
    </tr>
    <tr>
      <td>Breakeven</td>
      <td>Strike + Premium</td>
      <td>Strike + Premium</td>
    </tr>
  </table>
</div>

<div class="comparison-table">
  <table>
    <tr>
      <th></th>
      <th>Long Put</th>
      <th>Short Put</th>
    </tr>
    <tr>
      <td>Market Bias</td>
      <td>Bearish</td>
      <td>Bullish</td>
    </tr>
    <tr>
      <td>Maximum Gain</td>
      <td>Strike - Premium</td>
      <td>Premium</td>
    </tr>
    <tr>
      <td>Maximum Loss</td>
      <td>Premium</td>
      <td>Strike - Premium</td>
    </tr>
    <tr>
      <td>Breakeven</td>
      <td>Strike - Premium</td>
      <td>Strike - Premium</td>
    </tr>
  </table>
</div>

---

### Topic 1: Types of Speculative Strategies—Call Options

#### Long Call Strategy (Bullish) Holder Has Right to Buy the Underlying Security

Assume that a customer buys 1 ABC Jan 50 Call @ $5. During the life of the option, the customer has
the right to buy 100 shares of ABC stock at $50 per share, and they pay a premium of $5 per share
($500) for this right.

##### Maximum Gain = Unlimited

If the market price of the stock increases dramatically, the holder can exercise their option to buy
the stock at $50. They could then sell the stock in the market for a far higher price. The potential
gain is unlimited. This is calculated by the maximum potential loss.

##### Maximum Loss = Premium Paid

In the contract, the holder has the right to buy the underlying stock at the strike price of the
option. If a customer was to exercise, they would buy the stock at the strike price and could
potentially sell it for more money. In the example, the customer's maximum loss would be the premium
of $5 (or the premium paid). The cost of the call is the maximum potential loss.

<div class="test-tip">
  <p><strong>Test Tip:</strong> The call buyer has unlimited upside, while the call writer has unlimited downside.</p>
</div>

##### Breakeven = Strike Price + Premium

In the example, the customer buys 1 ABC Jan 50 Call @ $5. What is the maximum potential loss? What
is the maximum potential gain?

The customer pays a $5 per share premium. This amount is paid for the the debit side of the T-chart.
If nothing else happens and the contract expires, they lose the premium of $5 per share ($500).

Now we can see that the breakeven is at $55. When the stock is at $55, the customer calls their
maximum loss—the premium paid. The cost of the call is the maximum potential loss.

If the customer exercises the option, they pay out $50 for the stock (the debit is $55 in the debit
column). They sell the stock for $55 in the open market. They would break even if the stock price is
worth $55 per share. The breakeven is $55 per share.

##### Random Gain or Loss

Assume that the customer buys 1 ABC Jan 50 Call @ $5. The stock is now trading at $75 per share and
they exercise the contract and then sell the purchased shares. What is their net gain or loss?

The customer bought the stock at $50, and the $5 premium has been paid (debits). They sell the stock
for $75 (credit). The profit is $75 – $55 = $20 per share ($2,000 for 100 shares).

---

### Short Call Strategy (Bearish) Writer Has Obligation to Deliver (Sell) Shares at the Strike Price

Assume that a customer sells 1 ABC Jan 50 Call @ $5. If exercised, the customer must deliver (sell)
100 shares of ABC stock at $50. In return, they earned the premium of $500 (or $5 per share × 100
shares = $500).

##### Maximum Potential Gain = Premium Received

As an opposition, if the stock were trading at $50 or less, the contract would not be of value to
the contract buyer (why would they purchase stock @ $50 when they can buy the stock at $50 or less
in the open market). The writer would keep the $5 premium. The maximum potential gain for a call
writer is the premium received.

##### Maximum Potential Loss = Unlimited

The writer has sold (is short) the option. They sold the call at a price below its strike price. The
buyer, since the call writer is obligated to sell (deliver) stock at $50 when the stock may be worth
$100 or more per share. Short calls are extremely risky since there is no limit on how high the
stock can rise; the <span class="key-term">maximum potential loss is unlimited</span>.

<div class="info-box">
  <div class="info-box__title">Short Call Risk</div>
  <p>Sellers (also called writers) always assume counter party risk. What if the option writer owes the difference between the stock price and the strike price? If exercised, call writers would be forced to sell (deliver stock) at a price below the current market.</p>
</div>

##### Breakeven = Strike Price + Premium

A call writer has the same breakeven as a call buyer. Either would break even if the stock price
rises to the strike price plus premium. The only difference is when they make money: the buyer makes
money above the breakeven, and the seller makes money when the stock is below the breakeven.

**Example:**

A customer sells 1 ABC Jan 50 Call @ $5 when the market price of ABC is $51. What is the breakeven
point? What is the maximum gain?

**Answer:** The breakeven for a short put is strike price minus the premium. $50 + $5 = $55.

---

### Topic 2: Types of Speculative Strategies—Put Options

#### Long Put Strategy (Bearish) Holder Has Right to Sell Shares at the Strike Price

Assume the customer buys 1 ABC Jan 50 Put @ $5. The holder has the right to sell 100 shares of ABC
stock at $50. In return, they pay a premium of $500 (or $5 per share × 100 shares = $500).

##### Maximum Gain = Strike - Premium

If the stock's market price is $50 or higher, the put has no intrinsic value. An opposition, this
option will expire worthless. The put seller would keep the $500 premium. The breakeven for the
short put is the strike minus the premium, or $45. If the market price falls below $45, the seller
would lose money.

##### Maximum Potential Loss = Premium

The premium paid of $5 (or the premium) is the maximum that the long put holder could lose.

##### Breakeven = Strike - Premium

To summarize: Strike ($50) - Put Price ($5) = Breakeven ($45)

The writer receives $50 (for selling the stock at the strike price). The writer also pays $5 for the
premium received. Puts are out of the money when the market price is HIGHER than the strike price.
Puts are in the money when the market price is LOWER than the strike price.

**Example:**

A customer buys 1 ABC Jan 50 Put @ $5 when the market price of ABC stock is 48. Since the holder has
an intrinsic value of $2 (strike price $50 – market price $48), they may wish to sell close to $5
(the premium they paid for the put). In this case, a loss would be $3 in the intrinsic value over
what they paid for the put. Any profit would be no profit at all.

---

#### Short Put Strategy (Bullish) Writer Has Obligation to Buy Shares at the Strike Price

Assume a customer sells 1 ABC Jan 50 Put @ $5. The customer must buy shares at $50 if the put is
exercised. The customer receives a premium of $5. In return, they earned the premium of $500.

##### Maximum Potential Gain = Premium Received

The writer can only lose the $5 premium; and still break even if the market price is at the put's
strike price. The premium of $5 is the maximum gain.

##### Maximum Potential Loss = Strike - Premium

The writer has sold the option. The sold (short) position is net positive only if the stock price
stays above the strike price. If the market falls to zero, they would have to buy the stock at $50
(a $50 loss), minus the $5 premium received. $50 - $5 = $45 is the maximum loss.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Note: The maximum loss for a short put investor is the breakeven × 100.</p>
</div>

##### Breakeven = Strike - Premium

**Short Put Example:**

A customer sells 1 ABC Jan 50 Put @ $5. What is the maximum potential gain?

If the put expires worthless, the seller earns the $5 premium. So this is a credit.

**Actual Gain or Loss:**

A customer writes 1 ABC Jan 60 Put @ $4. ABC stock falls to $45. If the put is exercised, what is
the seller's gain/loss?

The writer will need to buy the stock at $60 (the strike price), then must sell the stock at the
market price of $45. This is a loss of $15 per share. Add the premium of $4 received, and the total
loss is $11 per share ($1,100).

---

### Speculative Options Strategies Summary

<div class="comparison-table">
  <table>
    <caption>Speculative Options Strategies Summary Chart</caption>
    <tr>
      <th></th>
      <th>Long Call</th>
      <th>Short (Uncovered) Call</th>
    </tr>
    <tr>
      <td>Market Outlook</td>
      <td>Maximum Gain = Unlimited</td>
      <td>Maximum Gain = Premium</td>
    </tr>
    <tr>
      <td></td>
      <td>Maximum Loss = Premium</td>
      <td>Maximum Loss = Unlimited</td>
    </tr>
    <tr>
      <td></td>
      <td>Breakeven (BE) = SP + P</td>
      <td>Breakeven (BE) = SP + P</td>
    </tr>
    <tr>
      <td></td>
      <td>Bullish</td>
      <td>Bearish</td>
    </tr>
  </table>
</div>

<div class="comparison-table">
  <table>
    <tr>
      <th></th>
      <th>Long Put</th>
      <th>Short (Uncovered) Put</th>
    </tr>
    <tr>
      <td>Market Outlook</td>
      <td>Maximum Gain = BE × 100</td>
      <td>Maximum Gain = Premium</td>
    </tr>
    <tr>
      <td></td>
      <td>Maximum Loss = Premium</td>
      <td>Maximum Loss = BE × 100</td>
    </tr>
    <tr>
      <td></td>
      <td>Breakeven (BE) = SP - P</td>
      <td>Breakeven (BE) = SP - P</td>
    </tr>
    <tr>
      <td></td>
      <td>Bearish</td>
      <td>Bullish</td>
    </tr>
  </table>
</div>

In this chart, notice that the profit and loss for the buyer and writer of a given option is a
mirror image. For example:

- The call buyer has unlimited upside, while the call writer has unlimited downside
- The put buyer's maximum loss is the premium paid, while the put writer's maximum gain is the
  premium received
- Breakeven for both the put buyer and seller is the strike price - premium
- The rules concerning applies to buyers and sellers of puts. The put buyer's maximum gain is the
  put seller's maximum loss (breakeven × 100)

---

### Summary: Speculative Strategies

<div class="critical-concept">
  <div class="critical-concept__label">Section 3 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Call options</td>
      <td>Bullish: bearish, maximum gain, maximum loss, and breakeven</td>
    </tr>
    <tr>
      <td>Put options</td>
      <td>Bullish: bearish, maximum gain, maximum loss, and breakeven</td>
    </tr>
  </table>
</div>

---

## Section 4: Protective Strategies

Options contracts can be used to hedge (protect against losses) a customer's stock position. The
four basic options positions can be used to either fully or partially manage a stock position.

<div class="comparison-table">
  <table>
    <caption>Hedging Strategies</caption>
    <tr>
      <th>Stock Position</th>
      <th>Option for Protection</th>
      <th>Market Bias (Based on Stock)</th>
    </tr>
    <tr>
      <td>Long Stock</td>
      <td>A protective put (buy a put for protection in a bearish market)</td>
      <td>Bullish</td>
    </tr>
    <tr>
      <td>Short Stock</td>
      <td>A protective call (buy a call for protection in a bullish market)</td>
      <td>Bearish</td>
    </tr>
  </table>
</div>

---

### Topic 1: Fully Hedge a Long Stock Position: Buy a Put

If a customer owns stock, they will lose money if the market drops. To protect against this, they
can hedge their position by purchasing a put option on the stock.

<div class="info-box">
  <div class="info-box__title">Long Stock + Long Put</div>
  <p>The long put stops downside loss on long stock while preserving upside potential.</p>
</div>

#### If Market Drops, Customer Can Sell Stock at the Strike Price

The customer buys 1 ABC Jan 50 Put @ $5 as a hedge. If the stock price drops, the customer can
always exercise the put and sell the stock for $50 regardless of the current market price.

##### Maximum Loss = Premium Paid

If the market price of the stock stays the same or rises, the customer is hedged or protected. They
will exercise the put and sell the stock at the strike price during the contract's life. If the
stock price rises, the option will expire with no value, and the customer will lose their $500
premium, while retaining the stock at a higher market price.

##### Maximum Potential Gain = Unlimited

In a rising market, the customer's potential gain grows unlimited. They would exercise and sell the
stock at the market's new higher price (the option premium loss is the protective strategy).

---

### Topic 2: Fully Hedge a Short Stock Position: Buy a Call

Conversely, if a customer has taken a short position in a security, they will lose money if the
market price of the stock rises. The potential loss on a shorted stock is unlimited. To hedge
against this, they can buy a protective call option on the stock.

Assume that a customer with short 100 shares of XXX stock at $60 also buys a call at a strike of $60
for a premium of $5 per share.

#### If Market Rises, Customer Can Buy Stock at the Strike Price

If the stock's market price is $60 or higher, the put has no intrinsic value, the option will expire
worthless, and they made $600 ($6,000 – call premium of $500) plus the $500 premium for the call.
They could have unlimited gains.

##### Maximum Loss = Premium Paid

If the customer is fully hedged, or protected. If the market price increases, they would exercise
their option and buy the stock at the strike price to close their short stock position. They saved a
potential loss and only lost the premium.

##### Maximum Gain = Initial Stock Price - Strike + Premium

Assume that the customer with short 100 shares of XXX stock at $70. They buy a call at $70 strike.
The customer can buy the stock at $70 no matter what happens. If the stock price rises, they call
the stock at $70. The maximum loss is the premium paid.

---

### Summary: Protective Strategies

<div class="critical-concept">
  <div class="critical-concept__label">Section 4 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Fully hedge a long stock position: Buy a Put</td>
      <td>Maximum loss = premium, maximum potential gain = unlimited</td>
    </tr>
    <tr>
      <td>Fully hedge a short stock position: Buy a Call</td>
      <td>Maximum loss = premium, maximum gain = strike - premium received</td>
    </tr>
  </table>
</div>

---

## Section 5: Options Income Strategies

Strategies involve selling (writing) option positions against an established stock position. The
premium received from selling the option enhances the yield from the underlying security. This
strategy will also provide a partial hedge. Contracts are sold for a partial hedge AND to generate
additional income. The amount of protection is limited to the amount of premium received.

An overriding factor in understanding income strategies is that the customer's stock position comes
first, and it determines their overall bullish or bearish bias. Writing an option gives extra income
from the stock position, but the investor's primary goal is to generate a gain from the stock
position. Income strategies are most effective when the stock price is expected to remain stable.
The customer does not anticipate big market swings and simply wants to generate additional income.
These strategies are not suitable in a volatile market.

---

### Topic 1: Covered Call Strategy = Long Stock + Short Call

The first income strategy is to sell a call option against a long stock position. Once again, this
strategy will generate additional income, but it will also limit the potential gain on the long
position. It will offer some protection (the option premium), but engaging in covered writing only
offers a partial hedge.

Assume a customer has sold short 100 shares of XXX stock at $70 and writes 1 XXX Jan 70 Call @ $5.

The customer's original position is:

- Sell Short 100 Shares of XXX @ $70
- Sell 1 XXX Jul 70 Call @ $5

If the market stays at $70, the put will expire worthless. The customer still has the same short
stock position and has earned the $5 premium.

#### Limited Gain on the Long Position

The premium received from the covered call limits the upside potential of the long position. If the
stock rises above the strike price, the customer will be required to sell the stock at the strike
price (the contract will be exercised), and the customer will be required to purchase the stock at
the strike price.

#### Limited Hedge

Conversely, if the market rises, the put expires, and the investor keeps the $5 premium. But they
are still short the stock. In a rising market, the maximum loss is theoretically an infinite amount.
By selling the put, the investor gained a partial hedge, or partial protection. But that protection
is limited to the amount of the premium.

<div class="comparison-table">
  <table>
    <caption>Income Strategies Summary Chart</caption>
    <tr>
      <th>Stock Position</th>
      <th>Option for Income</th>
      <th>Market Bias</th>
    </tr>
    <tr>
      <td>Long stock</td>
      <td>Sell a call against the owned stock (covered call writing)</td>
      <td>Neutral to mildly bullish</td>
    </tr>
    <tr>
      <td>Short stock</td>
      <td>Sell a put against the short stock (covered put writing)</td>
      <td>Neutral to mildly bearish</td>
    </tr>
  </table>
</div>

---

### Topic 2: Covered Put Strategy = Short Stock + Short Put

The second income strategy is to sell a put option against a short stock position. Once again, this
strategy will generate additional income, but it will also limit the potential gain on the short
position. It will offer some protection (the option premium), but engaging in covered writing only
offers a partial hedge.

Assume a customer has sold short 100 shares of XXX stock at $70 and writes 1 XXX Jan 70 Put @ $5.

#### Limited Gain on the Short Position

The customer does not enjoy the gain on the short stock position since they are obligated to buy at
the same price they shorted the stock for, which was $70. In this case, they only earned the premium
of $5 per share.

#### Limited Hedge

Conversely, if the market rises, the put expires, and the investor keeps the $5 premium. But they
are still short the stock. In a rising market, the maximum loss is theoretically an infinite amount.
By selling the put, the investor gained a partial hedge, or partial protection. But that protection
is limited to the amount of the premium.

---

### Summary: Options Income Strategies

<div class="critical-concept">
  <div class="critical-concept__label">Section 5 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Covered call strategy = Long Stock + Short Call</td>
      <td>Generates income, limits upside, provides partial protection</td>
    </tr>
    <tr>
      <td>Covered put strategy = Short Stock + Short Put</td>
      <td>Generates income, limits downside profit, provides partial protection</td>
    </tr>
  </table>
</div>

---

## Chapter 9 Key Terms Glossary

| Term                       | Definition                                                   |
| -------------------------- | ------------------------------------------------------------ |
| **Option**                 | Contract giving holder right to buy or sell at fixed price   |
| **Call option**            | Right to buy underlying security at strike price             |
| **Put option**             | Right to sell underlying security at strike price            |
| **Holder/Buyer**           | Party with rights; pays premium                              |
| **Writer/Seller**          | Party with obligation; receives premium                      |
| **Premium**                | Price paid for option contract                               |
| **Strike price**           | Fixed price at which option can be exercised                 |
| **Expiration date**        | Last date option can be exercised                            |
| **Exercise**               | Using the right granted by the option                        |
| **American style**         | Can be exercised any time before expiration                  |
| **European style**         | Can only be exercised at expiration                          |
| **OCC**                    | Options Clearing Corporation; guarantees contracts           |
| **Intrinsic value**        | Amount option is in the money                                |
| **Time value**             | Premium amount beyond intrinsic value                        |
| **In the money (ITM)**     | Option has intrinsic value                                   |
| **Out of the money (OTM)** | Option has no intrinsic value                                |
| **At the money (ATM)**     | Strike price equals market price                             |
| **Long call**              | Bullish; right to buy; unlimited gain, limited loss          |
| **Short call**             | Bearish; obligation to sell; limited gain, unlimited loss    |
| **Long put**               | Bearish; right to sell; limited gain and loss                |
| **Short put**              | Bullish; obligation to buy; limited gain and loss            |
| **Covered call**           | Long stock + short call; income strategy                     |
| **Covered put**            | Short stock + short put; income strategy                     |
| **Protective put**         | Long stock + long put; hedging strategy                      |
| **Protective call**        | Short stock + long call; hedging strategy                    |
| **LEAPS**                  | Long-Term Equity AnticiPation Securities; long-dated options |
| **Open interest**          | Number of outstanding option contracts                       |
| **Position limits**        | Maximum contracts one party can hold                         |

---

_Chapter 9 introduces the fundamentals of options. Master these concepts before moving to Chapter
10: Index Options and Advanced Options Strategies, which covers more complex multi-leg strategies._
