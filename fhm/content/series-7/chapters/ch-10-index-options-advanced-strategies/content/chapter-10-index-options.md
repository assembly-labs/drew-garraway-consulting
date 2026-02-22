# Chapter 10: Index Options and Advanced Options Strategies

_Series 7 Exam Weight: ~10-15 Questions (8-12%)_

---

## Section 1: Index Options

In 1983, the CBOE introduced options on the S&P 100 index—the first cash-settled index option.
Instead of delivering 100 different stocks when exercised, the option simply paid out the difference
in cash. This innovation opened the door to portfolio hedging strategies that would have been
impossibly complex with individual stock options.

Today, index options are essential tools for institutional investors and sophisticated traders.
While Chapter 9 covered options on individual stocks, this chapter expands into index options and
multi-leg strategies that bet on volatility or stability rather than direction.

### Why This Section Matters

The material in this chapter is both lengthy and complex. Options content is only moderately tested
on the Series 7 Exam—allocate your study time accordingly. Focus on understanding the concepts
rather than memorizing every calculation.

---

### Topic 1: Index and ETF Options Uses and Examples

Index options cover baskets of stocks known as indexes. These options can be used to speculate on
the overall market direction or to hedge an existing portfolio. Another related option covers an
exchange-traded fund (ETF), which is another basket of stocks that can replicate either the
performance of an index or a certain aspect of the market (industry, market cap, geography, etc.).

Here are a few of the more popular index contracts:

#### Standard & Poor's 500 Index (SPX)

The Standard & Poor's (S&P) 500 Index is composed of the 500 largest companies (based on market
capitalization). Institutional investors frequently use SPX options.

#### Standard & Poor's 100 Index (OEX)

A sub-index of 100 stocks from the S&P 500 was created. It's called the S&P 100 Index (OEX).

#### Dow Jones Industrial Average Index Option (DJX)

The Dow Jones Industrial Average index option (DJX) covers the 30 stocks in the Dow Jones Industrial
Average.

#### NYSE Arca Major Market Index (XMI)

The New York Stock Exchange (NYSE) exchange-Exchange Arca Major Market Index (XMI) mimics the Dow
Jones Industrial Average (DJIA) and consists of 20 stocks, most of which are in the DJIA. The XMI
tracks the DJIA with 99% accuracy.

---

### S&P 100 Index (OEX) Options

Let's take a more detailed look at the mechanics of the OEX option.

The OEX index option is traded on the Chicago Board Options Exchange, and it mirrors price movements
in the broad market. Instead of owning 100 shares, the contract is said to have a "multiplier"
of 100.

#### Exercise Settles in Cash at Closing Index Value

There is no physical delivery of shares upon exercise or assignment. Exercise of index options
results in a settlement in cash. If the holder of a call exercises it, the writer must pay the
holder the difference between the strike price and the closing price. The OEX (or SPX) is used to
hedge a portfolio against a fall in market interest rates. TYX call options increase in value as
interest rates rise.

<div class="comparison-table">
  <table>
    <caption>OEX Options Quote Example</caption>
    <tr>
      <th>OPTION & NY CLOSE</th>
      <th>STRIKE PRICE</th>
      <th colspan="3">CALLS-LAST</th>
      <th colspan="3">PUTS-LAST</th>
    </tr>
    <tr>
      <th></th>
      <th></th>
      <th>SEP</th>
      <th>OCT</th>
      <th>NOV</th>
      <th>SEP</th>
      <th>OCT</th>
      <th>NOV</th>
    </tr>
    <tr>
      <td>495.64</td>
      <td>490</td>
      <td>12.75</td>
      <td>14.75</td>
      <td>17.50</td>
      <td>5.00</td>
      <td>11.00</td>
      <td>14.50</td>
    </tr>
    <tr>
      <td>495.64</td>
      <td>495</td>
      <td>8.50</td>
      <td>12.25</td>
      <td>14.75</td>
      <td>7.05</td>
      <td>11.75</td>
      <td>16.40</td>
    </tr>
    <tr>
      <td>495.64</td>
      <td>500</td>
      <td>5.05</td>
      <td>10.50</td>
      <td>...</td>
      <td>10.40</td>
      <td>...</td>
      <td>17.45</td>
    </tr>
  </table>
</div>

A customer who believes that the market will rise can buy an OEX call. Assume a customer takes the
following position:

**Buy 1 OEX Sep 490 Call @ $11.75**

The customer pays a premium of $11.75 times a multiplier of 100 = $1,175 for the contract. The
contract is in the money by $5.64 ($495.64 - $490.00), which equals a total of $11.75 for the
contract.

#### Upon Exercise, Seller Pays Buyer "In the Money" Amount Computed Based on Closing Index Value

If an index option is exercised, the seller must pay the holder the next business day. Notice that
the seller pays the holder the in-the-money amount; the settlement would be calculated from the
closing price, not the price at the moment of exercise.

If the contract is closed at or above $11.75 + $490 premium above the premium ($501.75), the holder
breaks even. If the OEX closes above $11.75, this is an increase in value of $.01 × 10,000 units of
currency = $100. All other things being equal, this increase in value would directly result in an
increase in the premium from $2.10 to $3.10, which equals an increase from $210 to $310—again, a
$100 increase in value.

#### No Adjustment for Splits or Dividends

Stock options are not adjusted for stock splits, stock dividends, or cash dividends. Since the
aggregate value of all company's shares is included in the index, a stock split or dividend has no
effect. The number of shares increases, while the market price per share decreases; however, the
total value of the company, as represented in the index, remains the same.

---

### Beta—Measures Volatility

Assume that one has a portfolio that tracks the market, but it consists of more volatile stocks. The
measure for volatility is called the <span class="key-term">beta</span>. If a portfolio moves in
line with the broader market as measured by the S&P 500 Index, the portfolio has a beta of 1. A beta
of 2 means the portfolio is twice as volatile, a beta of 3 means it's 3x as volatile, etc.

#### Can Use Beta-Weighted Contracts to Hedge Against Systematic Risk

To hedge a $1,000,000 portfolio with a beta of 2, one needs twice the number of contracts.
(Remember, if the index falls, one's portfolio falls at twice the rate; this is the risk that the
market will drop, taking the portfolio value with it. Market risk is also known as
<span class="key-term">systematic risk</span>.)

#### Cannot Hedge Against Nonsystematic Risk

Hedging with index contracts does not protect against nonsystematic risk. This is the risk that a
specific security may turn into a bad investment.

---

### Index LEAPS

Recall that LEAPS (Long-Term Equity AnticiPation Securities) are a type of option with a longer
period between issuance and expiration than regular options—up to 39 months. There are LEAPS for
various indexes. OEX LEAPS are American style, while virtually all other index LEAPS are European
style.

If a regular LEAPS equity contract is exercised, the actual underlying security must be delivered.
However, if an index LEAPS is exercised, the writer must pay the holder the in-the-money amount
(identical to the exercise of regular index options). For LEAPS index contracts, the multiplier
is 100.

---

### ETF Options

Exchange-traded funds (ETFs) are securities that track a basket of stocks like an index fund but
trade on stock market like an individual stock. An index fund is priced on the market's intraday
value of the securities that make up the fund, while an ETF is priced to match its actual
transaction. The underlying security is ETFs are priced based on supply and demand.

Like an equity option, an ETF option can be traded at any time of day at the prevailing market price
at the time of the trade. Additionally, an ETF option is American style; it settles in ETF shares,
not cash. Like index options, ETF options can be used to hedge systematic risk. If you are worried
about a market decline, you can buy a put on an ETF that tracks the market. Or, if you have a
portfolio of tech stocks and are worried the tech market (rather than the broader market) will fall,
you can buy a put on an ETF that tracks the market.

<div class="comparison-table">
  <table>
    <caption>Index vs. ETF Options Comparison</caption>
    <tr>
      <th></th>
      <th>Broad-Based Index Option</th>
      <th>Narrow-Based Stock Index Option</th>
      <th>ETF Option</th>
    </tr>
    <tr>
      <td>Settlement Method</td>
      <td>Cash</td>
      <td>Cash</td>
      <td>Shares</td>
    </tr>
    <tr>
      <td>Last Day of Trading</td>
      <td>Thursday before 3rd Friday</td>
      <td>Thursday or Friday</td>
      <td>3rd Friday</td>
    </tr>
    <tr>
      <td>Exercise Style</td>
      <td>Mostly European</td>
      <td>Either European or American</td>
      <td>American</td>
    </tr>
    <tr>
      <td>When Settled</td>
      <td>a.m.</td>
      <td>a.m. or p.m.</td>
      <td>p.m.</td>
    </tr>
    <tr>
      <td>Expiration Date</td>
      <td>3rd Friday</td>
      <td>3rd Friday</td>
      <td>3rd Friday</td>
    </tr>
  </table>
</div>

---

### Summary: Index Options

<div class="critical-concept">
  <div class="critical-concept__label">Section 1 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Index options</td>
      <td>SPX, OEX, DJX options; cash settlement; no stock delivery</td>
    </tr>
    <tr>
      <td>ETF options</td>
      <td>American style; settle in shares; can hedge systematic risk</td>
    </tr>
    <tr>
      <td>Beta</td>
      <td>Measure of volatility relative to market</td>
    </tr>
  </table>
</div>

---

## Section 2: VIX, Interest Rate Index, and Foreign Currency Options

In this section, we will discuss Volatility Index (VIX) options. These contracts are designed to
track the underlying emotional sentiment within a market (confidence versus fear). These options can
be used to speculate on the overall market direction or to hedge an existing portfolio. We will also
look at foreign currency options, which are often used by corporations to mitigate currency risk in
their business dealings.

---

### Topic 1: VIX and Interest Rate Index Options

#### Volatility Index Options

"VIX" is the trading symbol for S&P Volatility Index options. This is a benchmark index that gauges
investor sentiment, commonly referred to as a "fear gauge." The VIX reflects investors' consensus
view of expected stock price volatility over the upcoming 30 days.

This option contract is the same as regular index options because the:

- Contract multiplier is $100
- Contract is only issued in European style
- Contract trades between 9:30 a.m.–4:15 p.m. ET (8:30 a.m.–3:15 p.m. CT)
- Exercise settlement occurs in cash the next business day, with the writer paying the holder any in
  the money amount

#### VIX Negatively Correlated to Stock Price Movements

Since the vast majority of investors trade from the long side, the "fear index" rises as markets
fall. Conversely, when markets are rising, the fear index falls. So, here's the surprising point—if
an investor thinks the market will be rising, they buy VIX puts. Why? Remember, they are betting the
fear level is falling as the market rises. If the investor believes the market will be falling, they
buy VIX calls. Why? Falling markets mean rising fear levels.

---

### Interest Rate Index Options Based on Yield Movement

The most commonly (if lightly) tested yield index option is the Cboe 30-Year Treasury Bond Yield
Index (TYX). The TYX can be used to hedge a bond portfolio against changes in market interest rates.
TYX call options increase in value as interest rates rise.

#### Premiums Move Opposite to Price-Based Options

These contracts are a minor test item with maybe 1 or 2 questions on the exam. The key points that
must be known about interest rate index options are:

- The contract value tracks interest rate movements, not the security's price—an important point. If
  market interest rates rise, call premiums rise and put premiums fall, and vice versa.
- To speculate on interest rate movements, buy calls (if you expect rising interest rates) or puts
  (if you expect falling interest rates).

To hedge an existing Treasury security position:

- If long Treasuries, values fall when market interest rates rise. To have an offsetting profit from
  an interest rate index option when interest rates rise, buy calls to hedge.
- If short Treasuries, values rise when market interest rates fall. To have an offsetting profit
  from an interest rate index option when interest rates fall, buy puts to hedge.

The contracts trade like any other option, with regular-way settlement occurring on the next
business day. The contract multiplier is 100. The contracts are European style, with exercise
settlement occurring on the next business day in cash (no delivery of the underlying Treasury
securities).

---

### Topic 2: Foreign Currency Options

#### Interbank Market

Foreign currency values relative to the dollar affect U.S. business activity and, therefore, the
financial markets. Foreign currencies are traded in the "interbank" market. Trading is unregulated
between domestic and foreign banks, typically in very large units (with a minimum of $5,000,000).

#### Floating Exchange Rates, Central Bank Trading

Because exchange rates float, the value of currencies is determined in the marketplace. Central
banks are big players in this market and can readily drive prices up or down in the short term. If a
country feels its currency is undervalued, it will buy the currency in the market or raise interest
rates to attract financial capital. If it feels the currency is overvalued, it will sell the
currency in the market or lower interest rates.

#### Options on Foreign Currencies

Options on foreign currencies are traded on the Philadelphia Stock Exchange (PHLX). They can be used
to speculate on the direction of the currencies' values. For example, if you believe that the
Japanese yen will strengthen, buy yen calls. If you think that the Canadian dollar will weaken, buy
Canadian dollar puts.

Importers and exporters can also use these contracts. Suppose an importer needs to pay for a
shipment expected in 2 months from Britain in pounds. To protect against the pound rising (and hence
costing more dollars), he can buy pound calls and lock in a fixed cost for the currency.

<div class="comparison-table">
  <table>
    <caption>Currency Option Contracts</caption>
    <tr>
      <th>Foreign Currency</th>
      <th>Contract Size</th>
      <th>Premium</th>
    </tr>
    <tr>
      <td>Australian Dollar</td>
      <td>10,000</td>
      <td></td>
    </tr>
    <tr>
      <td>Canadian Dollar</td>
      <td>10,000</td>
      <td></td>
    </tr>
    <tr>
      <td>British Pound</td>
      <td>10,000</td>
      <td>Multiplier of 100</td>
    </tr>
    <tr>
      <td>Swiss Franc</td>
      <td>10,000</td>
      <td></td>
    </tr>
    <tr>
      <td>European Currency (Euro)</td>
      <td>10,000</td>
      <td></td>
    </tr>
    <tr>
      <td>Japanese Yen</td>
      <td>1,000,000</td>
      <td>Multiplier of 100</td>
    </tr>
  </table>
</div>

#### Exercise Settlement in Cash

Foreign currency option trades settle next business day through the Options Clearing Corporation
(OCC). The contracts are available only as European style, which can be exercised only at expiration
(but can still be traded). European-style options are more attractive to institutional writers of
contracts that do not want an unexpected exercise.

<div class="critical-concept">
  <div class="critical-concept__label">Epic: Export Puts—Import Calls</div>
  <p><strong>Exporters:</strong> When exporters sell a product ahead of delivery and payment (forward), they are at risk that there will be a fall in the strength of the foreign currency. They can hedge against a fall in the foreign currency with long puts.</p>
  <p><strong>Importers:</strong> When importers buy a product ahead of delivery and payment (forward), they are at risk that there will be a rise in the strength of the foreign currency. They can hedge against a rise in the foreign currency with long calls.</p>
</div>

---

### Summary: VIX, Interest Rate Index, and Foreign Currency Options

<div class="critical-concept">
  <div class="critical-concept__label">Section 2 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>VIX options</td>
      <td>Measure fear/volatility; negatively correlated to stock prices</td>
    </tr>
    <tr>
      <td>Interest rate index options</td>
      <td>Track yield movements; European style; cash settlement</td>
    </tr>
    <tr>
      <td>Foreign currency options</td>
      <td>PHLX traded; European style; Export puts, Import calls</td>
    </tr>
  </table>
</div>

---

## Section 3: Straddles and Combinations

In the last chapter, the strategies we covered involved making a bet on the direction of the
underlying asset. Straddles and combinations are used to bet on a stable or volatile market.

---

### Topic 1: Straddles and Combinations Defined

#### Long Straddle = Long Call + Long Put (Investor Wants Volatility)

When a customer buys a straddle, they purchase a call and a put on the same stock, having the same
strike price and expiration. Each option is referred to as a "leg" of the straddle. The investor has
to pay a double premium since two options were purchased. The investor realizes money on the call if
the market moves up. They make money on the put if the market moves down. If the market stays the
same, both the put and call expire "at the money," and they lose the combined premiums. As we'll
see, this strategy can be very dangerous if the market moves only a little.

#### Short Straddle = Short Call + Short Put (Investor Wants Stability)

When a customer sells a straddle, they sell a call and a put on the same stock, having the same
strike price and expiration. They receive a double premium since two options were sold. Investors
sell straddles when they expect high volatility, while investors who write a straddle profits if the
market stays relatively flat.

In many cases, a straddle is constructed using a single ticket. The order when creating a long
straddle is often a limit order as to the maximum debit to be paid for both options (legs) of the
straddle. When selling a straddle, the ticket is often placed as a limit as to the minimum credit
received when selling both options (legs). Alternatively, some investors prefer to "leg in" to a
straddle by opening each position separately. Conversely, they can "leg out" of the straddle by
closing out each side individually.

#### Straddles vs. Combinations

A long straddle or short straddle requires that the security, strike price, and expiration all be
the same. If the customer buys a call and a put on the same security with either different strike
prices or expirations, it is termed a <span class="key-term">long combination</span>. If they sell a
call and put on the same security with either different strike prices or expirations, it is termed a
<span class="key-term">short combination</span>.

#### Another Name for a Combination Is a "Strangle"

Also note that another name for a combination is a "strangle," which is a more descriptive name. For
example, a "long strangle" is the purchase of an out of the money call (as its strike price is
higher than the current market) and the purchase of an out the money put (as its strike price is
lower than the current market). Because they are out the money, the premiums paid are lower.
However, the market must move more sharply, either up or down, to be profitable, as compared to the
purchase of a long straddle.

<div class="info-box">
  <div class="info-box__title">Straddles vs. Combinations</div>
  <table>
    <tr>
      <td>Long Straddle</td>
      <td>Short Straddle</td>
      <td>Long Combination</td>
      <td>Short Combination</td>
    </tr>
    <tr>
      <td>Long Call + Long Put</td>
      <td>Short Call + Short Put</td>
      <td>Long Call + Long Put</td>
      <td>Short Call + Short Put</td>
    </tr>
    <tr>
      <td colspan="2">Same Strike Price and Expiration</td>
      <td colspan="2">Diff. Strike Price and/or Expiration</td>
    </tr>
  </table>
</div>

Combinations have essentially the same characteristics as straddles, and they can be easily
identified.

---

### Summary: Straddles and Combinations

<div class="critical-concept">
  <div class="critical-concept__label">Section 3 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Straddles</td>
      <td>Long straddle = volatility bet; Short straddle = stability bet</td>
    </tr>
    <tr>
      <td>Combinations/Strangles</td>
      <td>Different strike prices or expirations; similar characteristics</td>
    </tr>
  </table>
</div>

---

## Section 4: Spreads

In the last section, we covered straddles, which are composed of two different options (legs). The
investor either bought a call and a put or sold a call and a put to bet on volatility or neutrality.
In this section, we'll look at a different strategy that employs two options, called a spread.
Spread positions are typically limited-gain or limited-loss wagers that are either moderately
bullish or moderately bearish.

---

### Topic 1: Spread Terminology and Identification

A spread position is the purchase of a call and sale of a call, or purchase of a put and sale of a
put:

- At different strike prices; or
- At different expirations; or
- With both the strike price and expiration being different

So, a spread is either a:

- <span class="key-term">Call spread</span>: An investor buys a call and sells a call
- <span class="key-term">Put spread</span>: An investor buys a put and sells a put

#### Debit and Credit Spreads

When the spread is created, one option is bought. The cost of the purchase is called a debit. The
other option is sold, and the money received on the sale is called the credit. When both positions
are established, the option investor will have a net debit (i.e., more money spent) or a net credit
(i.e., more money received). If creating the spread results in a net debit, it is called a
<span class="key-term">debit spread</span>. If creating the spread results in a net credit, it is
called a <span class="key-term">credit spread</span>.

#### Debit Call Spread (aka Long Call Spread)

Instead of buying a call, one can buy a call spread. For example:

|                          |          |
| ------------------------ | -------- |
| Buy 1 ABC Jan 50 Call @  | $7       |
| Sell 1 ABC Jan 60 Call @ | $3       |
|                          | $4 Debit |

This is a <span class="key-term">debit call spread</span> because it results in a net debit of $4
(one must pay $4, so one is a net buyer of the spread position). It is a <span class="key-term">long
call spread</span> because the long call premium is higher.

#### Credit Call Spread (aka Short Call Spread)

Instead of selling a call, one can sell a call spread. For example:

|                          |           |
| ------------------------ | --------- |
| Sell 1 ABC Jan 50 Call @ | $7        |
| Buy 1 ABC Jan 60 Call @  | $3        |
|                          | $4 Credit |

This is a <span class="key-term">credit call spread</span> because it results in a net credit. It is
a <span class="key-term">short call spread</span> because the short call premium is higher.

#### Debit Put Spread (aka Long Put Spread)

|                         |          |
| ----------------------- | -------- |
| Buy 1 ABC Jan 60 Put @  | $7       |
| Sell 1 ABC Jan 50 Put @ | $3       |
|                         | $4 Debit |

This is a <span class="key-term">debit put spread</span> because it results in a net debit. It is a
<span class="key-term">long put spread</span> because the long put premium is higher.

#### Credit Put Spread (aka Short Put Spread)

|                         |           |
| ----------------------- | --------- |
| Sell 1 ABC Jan 60 Put @ | $7        |
| Buy 1 ABC Jan 50 Put @  | $3        |
|                         | $4 Credit |

This is a <span class="key-term">credit put spread</span> because it results in a net credit. It is
a <span class="key-term">short put spread</span> because the short put premium is higher.

---

### Name Determines Bullish or Bearish Bias

Remember that "debit" is another way of saying the client has bought the spread, and "credit" means
the client has sold the spread. In all cases, the client is leaning in one direction (bullish or
bearish). Debit means that, on balance, the client is a buyer of options. Credit means that, on
balance, the client is a net seller of options.

<div class="comparison-table">
  <table>
    <caption>Debit and Credit Spreads</caption>
    <tr>
      <th>Type of Spread</th>
      <th>Side of Market</th>
      <th>Why?</th>
    </tr>
    <tr>
      <td>Debit Call</td>
      <td>Bull</td>
      <td>Net Buyer of Calls</td>
    </tr>
    <tr>
      <td>Credit Call</td>
      <td>Bear</td>
      <td>Net Seller of Calls</td>
    </tr>
    <tr>
      <td>Debit Put</td>
      <td>Bear</td>
      <td>Net Buyer of Puts</td>
    </tr>
    <tr>
      <td>Credit Put</td>
      <td>Bull</td>
      <td>Net Seller of Puts</td>
    </tr>
  </table>
</div>

---

### Vertical, Horizontal, and Diagonal Spreads

As mentioned, in addition to different premiums, the spread legs can differ as far as strike price,
expiration month, or both.

#### Price Spreads (Vertical)

If each leg of the spread has different strike prices, the spread is called a price spread or a
"vertical" spread. An example of a price spread is:

|                          |     |
| ------------------------ | --- |
| Buy 1 ABC Jan 50 Call @  | $7  |
| Sell 1 ABC Jan 60 Call @ | $3  |

Notice how the strike prices are stacked vertically, one above the other. We can also see that there
is a debit of $4, so, this is a debit call vertical spread.

#### Calendar Spreads (Horizontal or Time)

If each leg of the spread has different expiration dates, the spread is called a calendar spread, a
time spread, or a "horizontal" spread.

|                          |          |
| ------------------------ | -------- |
| Sell 1 ABC Jan 70 Call @ | $4       |
| Buy 1 ABC Apr 70 Call @  | $6       |
|                          | $2 Debit |

We can also see that there is a debit of $2, so, this is a debit call horizontal spread.

#### Diagonal Spread

A spread where both the price (vertical) and time (horizontal) are different is called a diagonal
spread (combining a horizontal and vertical gives a diagonal).

|                          |           |
| ------------------------ | --------- |
| Buy 1 ABC Jan 70 Call @  | $4        |
| Sell 1 ABC Apr 60 Call @ | $11       |
|                          | $7 Credit |

We can also see that there is a credit of $7, so, this is a credit call diagonal spread.

---

### Summary: Spreads

<div class="critical-concept">
  <div class="critical-concept__label">Section 4 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Spread terminology</td>
      <td>Call and put spreads; debit and credit spreads; bullish/bearish</td>
    </tr>
    <tr>
      <td>Spread types</td>
      <td>Vertical (price), Horizontal (calendar/time), Diagonal</td>
    </tr>
  </table>
</div>

---

## Chapter 10 Key Terms Glossary

| Term                     | Definition                                                    |
| ------------------------ | ------------------------------------------------------------- |
| **Index option**         | Option on a basket of stocks; settles in cash                 |
| **SPX**                  | S&P 500 Index option                                          |
| **OEX**                  | S&P 100 Index option                                          |
| **Cash settlement**      | Paying the in-the-money amount rather than delivering stock   |
| **Beta**                 | Measure of volatility relative to the market                  |
| **Systematic risk**      | Market risk that can be hedged with index options             |
| **Nonsystematic risk**   | Company-specific risk; cannot be hedged with index options    |
| **ETF option**           | Option on exchange-traded fund; settles in shares             |
| **VIX**                  | Volatility Index; "fear gauge"                                |
| **TYX**                  | 30-Year Treasury Bond Yield Index                             |
| **PHLX**                 | Philadelphia Stock Exchange; trades currency options          |
| **European style**       | Can only exercise at expiration                               |
| **Long straddle**        | Long call + long put; same strike/expiration; volatility bet  |
| **Short straddle**       | Short call + short put; same strike/expiration; stability bet |
| **Combination/Strangle** | Call + put with different strikes or expirations              |
| **Call spread**          | Buy a call and sell a call                                    |
| **Put spread**           | Buy a put and sell a put                                      |
| **Debit spread**         | Net cost to establish; buyer of spread                        |
| **Credit spread**        | Net credit to establish; seller of spread                     |
| **Vertical spread**      | Different strike prices; price spread                         |
| **Horizontal spread**    | Different expirations; calendar/time spread                   |
| **Diagonal spread**      | Different strikes AND expirations                             |
| **Bull spread**          | Debit call or credit put; profits if market rises             |
| **Bear spread**          | Credit call or debit put; profits if market falls             |

---

_Chapter 10 covers index options and advanced multi-leg strategies. These concepts build on the
fundamentals from Chapter 9 and complete your options knowledge for the Series 7 exam._
