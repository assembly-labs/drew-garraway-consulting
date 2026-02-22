# Chapter 8: Trade Processing and Settlement

_Series 7 Exam Weight: ~8-10 Questions (6-8%)_

---

## Section 1: Order Tickets, Prohibited Trading Practices, and Trade Reporting

In 1969, Wall Street nearly collapsed—not from a market crash, but from paperwork. Trading volume
had exploded, and back offices couldn't keep up. Firms had to close on Wednesdays just to process
the previous week's trades. The "Paperwork Crisis" led to the creation of the Depository Trust
Company and revolutionized how securities change hands.

Today, most trades settle in one business day. But the rules governing how trades are documented,
what practices are prohibited, and how transactions are reported remain central to the Series 7
exam.

### Why This Section Matters

Every trade generates documentation—order tickets that create an audit trail, confirmations that
inform customers, and reports that regulators use to monitor market integrity. Understanding these
requirements isn't just about compliance; it's about protecting clients and maintaining fair
markets.

---

### Topic 1: Order Tickets

To place a customer order in the secondary market, a registered representative fills out an order
ticket (this is done electronically). Certain information is required to be on the order ticket.

<div class="info-box">
  <div class="info-box__title">Sample Order Ticket</div>
  <table>
    <tr>
      <th>Field</th>
      <th>Example</th>
    </tr>
    <tr>
      <td>Action</td>
      <td>Buy (circle: Long / Short / Exempt)</td>
    </tr>
    <tr>
      <td>Size</td>
      <td>100 shares</td>
    </tr>
    <tr>
      <td>Order Type</td>
      <td>Day / DNR Discret.</td>
    </tr>
    <tr>
      <td>Name of Security</td>
      <td>ABC Common</td>
    </tr>
    <tr>
      <td>Price</td>
      <td>Mkt / Stop / Limit</td>
    </tr>
    <tr>
      <td>Customer Name</td>
      <td>Smith</td>
    </tr>
    <tr>
      <td>Account Number</td>
      <td>01487</td>
    </tr>
    <tr>
      <td>RR Number</td>
      <td>333</td>
    </tr>
    <tr>
      <td>Date</td>
      <td>3/17/2026</td>
    </tr>
    <tr>
      <td>Manager Approval</td>
      <td>(signature)</td>
    </tr>
  </table>
</div>

The order ticket must specify the following:

- **Buy or sell:** When stock is bought, a long position is taken. If a customer sells a long
  position (a stock they already own), it is called a long sale. If a customer sells borrowed
  shares, they are taking a short position in the stock. "Sell" and "Short" are circled on the
  ticket.

#### Short Sales Subject to Regulation SHO

Short sales of stock are subject to U.S. Securities and Exchange Commission (SEC)
<span class="key-term">Regulation SHO</span>. Reg SHO requires that every order ticket to sell is
marked as either a long sale or a short sale. If the sale is short, the securities to be borrowed
must be located by the broker, and the borrowed shares must be delivered on settlement. Later
revisions to Regulation SHO included rules that also cover long sales; however, short sales remain
the regulation's main focus.

#### Additional Required Information

In addition, the order ticket must contain the following information:

- **Security name:** Typically, using the ticker symbol for the stock
- **Order size:** The size of the order is specified—the number of shares of stock (in this case,
  100 shares), or the number of option contracts, or the number of bonds to be traded
- **Duration of the order:** Day order or good 'til canceled (GTC)
- **If the order is discretionary:** A discretionary order gives the representative the ability to
  choose what security to buy and how much. Such orders can only be placed in a discretionary
  account (where the customer has authorized a power of attorney to trade the account). A principal
  of the firm must approve, in advance, the opening of the account and any trades after they are
  made.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Regulators are especially concerned that discretionary accounts might be excessively traded (churned). Making a profit does not absolve the violation.</p>
</div>

For example, if a customer says, "Buy $10,000 of a good high-tech stock," that would be a
discretionary order, as the specific stock was not identified. But if the customer says, "Buy 1,000
shares of XYZ when it looks good to you the representative," that would not be discretionary, as the
stock and amount have been specified. Since the price or timing was not mentioned, this would be a
<span class="key-term">market not held order</span> and would need to be executed the same day.

Additional order ticket requirements:

- **Execution price:** For a limit order, stop order, or stop-limit order (not required for market
  orders when they are first entered)
- **Solicited/unsolicited:** Whether or not the representative solicited the order
- **Manager approval:** All orders must be approved by a principal of the firm promptly; this
  usually means by the end of the day
- **Name of the representative:** As well as the customer's name and account number

#### Alterations to Executed Order

Under Financial Industry Regulatory Authority (FINRA) rules, any alteration to an executed order
ticket:

- Must be approved in writing by a branch manager or compliance officer of the firm
- Must be documented in writing with the essential facts relating to the order and the reasons for
  the change

---

### Topic 2: Prohibited Trading Practices

#### Best Execution

When executing an order for a customer, a firm must obtain the best outcome for the customer.
Although price is important, it is not the only factor to consider in determining best execution.
The following factors should be considered in finding the best market:

- The character of the market for that security (price, volatility, liquidity)
- The size and type of transaction
- The number of markets checked
- Location and accessibility of the customer's broker-dealer to primary markets and quotation
  sources

Failure to provide the best execution would be a violation of FINRA rules. Keep in mind, however,
that a customer can choose to have their order directed to a different trading venue.

#### Customer Orders Have Priority

When executing an order for a customer, the firm cannot give preference to orders for the firm's own
account. This would be considered <span class="key-term">trading ahead</span> of the customer's
order. For example, if a firm holds a customer limit order to buy 100 shares of ABC @ $21, and the
stock becomes available at that price, the firm must buy the stock for that customer before it can
buy the stock at that price for the firm's account.

#### Front Running

When a firm receives a large block order from an institutional client, the firm cannot
<span class="key-term">front-run</span> the order by placing the firm's orders ahead of the block.

#### Trading Ahead of Research Reports

If a firm's research department is going to issue a report on a company that is likely to affect the
price of its stock, the firm cannot trade based on advance knowledge of the recommendation. Once the
recommendation is disseminated, the firm is no longer bound by this restriction.

#### Acting as Both Broker and Dealer for the Same Trade

FINRA prohibits a firm from acting as both an agent and principal in a single transaction. When a
firm acts as a broker or agent, it charges a commission to match a buyer with a seller. When a firm
acts as a dealer or principal on a trade, it will not charge a commission, but it will mark up or
mark down the price. A firm cannot charge both a commission and a markup or markdown on the same
transaction.

#### No Interpositioning

When a firm gets an order, the firm cannot go through an intermediary firm, who in turn goes to the
market maker. In other words, a firm cannot interposition a second firm (who would earn a commission
on top of the first firm's commission) between itself and the market maker, unless doing so would
result in a better price for their customer.

#### Backing Away from a Firm Quote

When a market maker displays a quote, it is considered a <span class="key-term">firm quote</span>,
meaning that it is a binding offer to buy at the bid price or sell at the ask price. These firm
quotes are two-sided, meaning they have both bid and ask prices. Quotes will also include size,
which is the number of shares the market maker is willing to buy or sell at those prices. The size
is based on round lots (typically 100 shares). FINRA prohibits market makers from
<span class="key-term">backing away</span> from a firm quote. This means the firm cannot give a firm
quote and then fail to honor that quote.

#### Market Manipulation

Manipulation of the market is prohibited in any form. Various forms of market manipulation include:

- **Trading pools:** Groups of traders join to trade a security at successively higher and higher
  prices. As the pool inflates the price of the issue and other investors see the trading activity,
  outside investors jump in and buy. At which point the pool members jump out, and the price jumps
  back out at an artificially high price. Such schemes are also called stacking a stock or a
  <span class="key-term">pump and dump</span>.

- **Wash trades, painting the tape:** A firm buys and sells a security repeatedly to create the
  appearance of trading activity with no actual change in ownership. The trades will cancel each
  other out and are referred to as <span class="key-term">wash trades</span>. This prohibited
  activity is sometimes called <span class="key-term">painting the tape</span>, since a series of
  fictitious trades is being reported to the consolidated tape.

- **Marking the close, marking the open:**
  - Marking the close is trading at the close, or falsely reporting trades at the close, just to
    affect the stock's closing price.
  - Marking the open is trading at the open, or falsely reporting trades at the open, just to affect
    the stock's opening price.

- **Issuer manipulating its own stock:** Rule 10b-18 specifies when and how an issuer is permitted
  to repurchase its shares. Generally, issuers are prohibited from trading near the open or the
  close and are subject to volume limits on their purchases.

- **Spoofing:** Spoofing is when a trader tries to manipulate the market by placing large orders
  that try to convince others that a big buyer or seller has entered the market. These orders are
  quickly canceled and replaced with trades in the opposite direction. The trader is trying to trick
  others into buying or selling their stock based on this fake market interest.

---

### Topic 3: Trade Reporting

Trades in listed securities must be reported to the consolidated tape. All orders are reported at
their "net price" or commissions are not included. When a trade occurs on an exchange, it is
automatically reported. Over-the-counter (OTC) trades must be reported to one of FINRA's trade
reporting facilities (TRFs). This reporting requirement applies to all OTC equity and debt
securities. All OTC equity transactions must be reported within 10 seconds of execution. All bond
transactions must be reported within 15 minutes of execution.

#### FINRA's Alternative Display Facility (ADF)

Exchange-listed securities that trade over-the-counter may be displayed and reported on FINRA's
<span class="key-term">Alternative Display Facility (ADF)</span>. Market makers and Electronic
Communication Networks (ECNs) may also use this facility to display their quotes. The ADF is
particularly useful to ECNs that are not linked to Nasdaq's Market Center or another exchange.
Unlinked ECNs are physically unable to display quotes and report trades using the other equity TRFs.
Exchanges, such as the New York Stock Exchange (NYSE), operate their own trade reporting facilities
for listed securities traded over the counter.

The ADF collects and disseminates quotations and trade reports and compares trades, but it cannot
route orders or execute trades. As a display-only facility, all ADF market makers and ECNs are
required to provide their own electronic access to their quotes. This allows other market
participants to execute an order directly with the user.

#### OTC Reporting Facility (ORF)

All OTC transactions in non-listed equity and debt securities must also be reported on a designated
trade reporting facility. The <span class="key-term">Over-the-Counter Reporting Facility
(ORF)</span> reports the trades of non-exchange-listed securities, including OTC Link securities
(such as the Pink markets); non-exchange-listed American depositary receipts (ADRs); Canadian
issues; foreign securities; and non-exchange-listed direct participation program (DPP) securities.
The ORF also reports trades in restricted equity securities.

#### Fixed Income Reporting: Trade Reporting and Compliance Engine (TRACE)

Unlike stocks, bonds are not generally traded on exchanges. Instead, bond trading takes place
directly between broker-dealers, banks, mutual funds, and other market makers in a decentralized,
over-the-counter market. The <span class="key-term">Trade Reporting and Compliance Engine
(TRACE)</span> is FINRA's automated system for reporting trades in OTC debt securities. TRACE does
not accept quotes or execute trades; it only reports completed trades. Both the buy and the sell
side report TRACE trades, and trades must be reported within 15 minutes during regular business
hours.

Debt securities that are eligible for TRACE include:

1. Convertible and non-convertible corporate bonds
2. Investment-grade and high-yield bonds
3. U.S. dollar-denominated debt that requires registration with the SEC
4. U.S. Treasury securities
5. New issues and debt sold under SEC Rule 144A (these trades are not displayed)
6. U.S. dollar-denominated foreign sovereign debt

Debt securities that are not eligible for TRACE include municipal bonds and money market debt
securities. Exchange-listed debt securities traded on and reported to an exchange also do not have
to be reported to TRACE, nor do transactions resulting from the exercise or settlement of an option.

#### Municipal Security Trade Reporting

Municipal securities transactions are reported using the Municipal Securities Rulemaking Board's
(MSRB) <span class="key-term">Real-Time Transaction Reporting System (RTRS)</span>. Currently,
transactions must be reported as soon as practicable, but no later than 15 minutes after the
transaction occurs. Any customer transaction in a municipal security that is eligible for a
Committee on Uniform Securities Identification Procedures (CUSIP) number must be reported.

Both the buyer and seller must report the transaction. The required information reported to RTRS
includes:

- CUSIP number
- Trade date and settlement date
- Time of execution (Eastern Time)
- Dealer identifier (a unique broker symbol assigned by FINRA)
- Buy/sell indicator
- Agency/principal indicator
- Par value traded
- Dollar price and yield

Reported transactions are then posted to the <span class="key-term">Electronic Municipal Market
Access (EMMA)</span> system, which allows individuals to obtain information on recent prices and
price trends in municipal securities.

---

### Summary: Order Tickets, Prohibited Trading Practices, and Trade Reporting

<div class="critical-concept">
  <div class="critical-concept__label">Section 1 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Order tickets</td>
      <td>Required information for documentation and audit trail</td>
    </tr>
    <tr>
      <td>Prohibited trading practices</td>
      <td>Front running, painting the tape, trading ahead, and other forms of market manipulation</td>
    </tr>
    <tr>
      <td>Trade reporting</td>
      <td>TRACE for corporate bonds, RTRS/EMMA for municipal securities</td>
    </tr>
  </table>
</div>

---

## Section 2: Trade Clearing and Settlement

After a trade is executed, the trade must be cleared and settled. This clearing process involves
ensuring that both parties agree and that the trade has been correctly entered. Settlement consists
of the exchange of cash for securities.

### Why This Section Matters

Clearing and settlement are the plumbing of the financial system—unsexy but essential. When this
plumbing fails, as it nearly did in 1969 and again in 2008, the entire financial system can freeze.
Understanding how trades actually settle is fundamental to working in the industry.

---

### Topic 1: Trade Clearing and Settlement

Once a trade is executed, it must go through a process known as clearing and settlement. The
clearing of corporate securities trades is handled by the National Securities Clearing Corporation
(NSCC), which is owned by <span class="key-term">clearing firms</span>. These are the large
broker-dealers that clear and settle trades for themselves and their customers. Smaller firms are
known as <span class="key-term">introducing firms</span>. Introducing firms will take orders from
customers, but they will rely on clearing firms to handle the back office processing of the trades
and the safeguarding of their customers' securities.

#### Depository Trust Company (DTC)

The <span class="key-term">Depository Trust Company (DTC)</span> is where member firms hold all
securities positions. There are still physical certificates held at the DTC, but today almost all
securities are held in electronic <span class="key-term">book-entry</span> form. Member firms will
maintain accounts at the DTC that include the securities they hold for themselves and their
customers, as well as the cash accounts they use to buy and sell securities.

When a corporate securities trade occurs, the parties of the trade (buying firm and selling firm)
send their trade information to the NSCC. The NSCC then matches the terms of the trade between the
buyer and seller to ensure they agree. The NSCC will then send a report to the DTC, which will
adjust the firm's accounts on the settlement date.

Both the DTC and NSCC are subsidiaries of the Depository Trust and Clearing Corporation (DTCC).

#### Options Clearing Corporation (OCC)

The <span class="key-term">Options Clearing Corporation (OCC)</span> performs a similar function to
the DTC and NSCC. As options trades occur, they are reported to the OCC, which records the positions
on its books.

#### Introducing and Clearing Firm Agreement

The clearing agreement between an introducing firm and its clearing agent must specify the
responsibilities of each party. The clearing agreement can permit the introducing broker to execute
trades through firms other than clearing broker, with those trades being reported to the clearing
broker for settlement and clearance. This provision may be specified by the introducing firm, who in
turn wants the flexibility to direct a trade to a market maker and if it believes it can get a
better price for their customers.

#### Prime Brokerage Account

A prime brokerage account is often used by hedge funds to consolidate their trading activities
performed at executing firms. The hedge fund hires a clearing firm to consolidate these trades. When
performing trades, the executing firm will "give up" the name of its prime broker, and the executing
firm's clearing broker provides the clearing number of the prime broker when the trade is reported
for comparison and clearance. The executing broker "gives up" the name of the clearing prime broker
when the trade is reported for comparison and clearance. Thus, the executing broker provides the
"give-up" of the reported trade for comparison and clearance purposes. A give-up is used to move a
reported trade from the account of the executing member to the clearing member. It is a movement of
securities.

<div class="info-box">
  <div class="info-box__title">Introducing Broker Dealer sends all trades to the Clearing Broker-Dealer who will:</div>
  <ul>
    <li>Execute All Trades</li>
    <li>Settle All Trades</li>
    <li>Maintain Custody</li>
    <li>Provide Financing</li>
  </ul>
</div>

#### Trade Comparisons and Don't Know (DK) Notices

Firms must send confirmations to the <span class="key-term">contra broker</span>: the other side of
the trades. Each side of the trade will send a trade confirmation, which will be compared (matched)
against the other firm's trading record to verify that all the terms agree. If so, the clearing and
settlement process can proceed.

Comparisons for virtually all securities are now generated in real-time. The information on the
comparison details the specifics of the trade:

- Trade date
- Settlement date
- Side of trade
- Security traded
- CUSIP number (a unique identifying number assigned to all U.S. and Canadian registered stocks and
  bonds)

<div class="test-tip">
  <p><strong>Test Tip:</strong> There is no customer information or commission information on dealer-to-dealer trade confirmations. This information would be included in a customer confirmation.</p>
</div>

If a firm sees a discrepancy in the information provided, it will send a
<span class="key-term">Don't Know (DK)</span> notice to the other firm. The party in error is then
responsible for sending a corrected confirmation.

#### Trade Settlement

The settlement date is when transactions are officially completed, and cash and securities change
hands. Keep in mind that the price of the trade is determined on the trade date.

#### Regular Way Settlement: 1 Business Day

<span class="key-term">Regular way settlement</span> of all stock, corporate and municipal bonds,
U.S. government securities, ETFs, and listed options is the next business day
(<span class="key-term">T+1</span>).

#### Cash Settlement

<span class="key-term">Cash settlement</span> is a same-day settlement for trades entered before
2:30 p.m. ET.

Do not confuse cash settlement with a trade done in a cash account. Cash settlement is typically
used when the underlying asset is too cumbersome to deliver, unlike stock. The most common security
to use cash settlement is index options (because the indices cannot be delivered directly; instead
an investor receives a settlement in cash). In these accounts, delivery is made with the
understanding that the buyer will pay upon receipt of the securities. The seller must give the buyer
1 day's notice as to when they will deliver the securities, and settlement takes place on that
settlement day.

#### Seller's Option and Buyer's Option Settlement

<span class="key-term">Seller's option settlement</span> is used when the seller needs more time to
deliver than regular way settlement (T+1). For example, the seller may have physical securities held
in a safe deposit box, and it will take more than 1 day to deliver the securities. The seller must
give the buyer 1 day's notice as to when they will deliver the securities, and settlement takes
place more than one business day.

<span class="key-term">Buyer's option settlement</span> is also available for a buyer who can't pay
the regular way settlement date.

#### When, As, and If Issued Settlement

<span class="key-term">When, as, and if issued settlement</span> is used for new securities where
the issuance is announced, but the certificates are not yet available.

#### DVP/RVP Transactions

Another form of specialized account is a <span class="key-term">delivery versus payment (DVP)</span>
transaction, also known as a collect on delivery (COD). In these accounts, delivery is made with the
understanding that the buyer will pay upon receipt of the securities. The same arrangement from the
buyer's perspective is called <span class="key-term">receive versus payment (RVP)</span> or cash on
delivery (COD).

---

### Topic 2: Good Delivery of Securities (Physical Certificates)

Although there are few physical certificates left, the exam may test some of the legacy delivery
rules. On settlement, the securities must be delivered in <span class="key-term">good form</span>.
If the securities are not in good form, they may be rejected, and settlement will not take place.

For good delivery, the following conditions must be met:

- Physical securities must be endorsed on the back by the registered owner in the exact name
- An alternative is to use a signed stock power or bond power to transfer multiple certificates
- The customer's signature must be guaranteed. FINRA member firms, banks, and savings institutions
  can make <span class="key-term">signature guarantees</span>. Signature guarantees are also
  referred to as <span class="key-term">medallions</span>. **Note:** This is not the same as a
  notary seal.
- Registered bonds must be delivered in $1,000 minimum face amounts or multiples of $1,000, up to a
  maximum of $100,000 per bond
- Securities cannot be accepted if mutilated unless they are accompanied by a validation letter from
  the transfer agent or registrar
- Stock certificates must be delivered in round lots of 100 shares, or multiples of 100 on one
  certificate. If certificates of 100 shares are used, they must be able to add up to units of 100
  shares.

<div class="info-box">
  <div class="info-box__title">Good Delivery Examples</div>
  <p>For example, in a trade for 400 shares, 1 certificate of 400 shares is good delivery. 4 certificates of 100 shares are good delivery (4 × 100 = 400). However, 10 certificates of 40 shares are not considered good delivery since 40 + 40 = 80, which is an odd lot. In this case, the shares will need to be sent to the transfer agent, and new shares will be issued.</p>
</div>

#### Direct Registration System (DRS) and Book-Entry Registration

<div class="critical-concept">
  <div class="critical-concept__label">Important Note</div>
  <p>All these rules are still in place for the delivery of physical certificates, which exist for thousands of stock and bond issues. However, the industry is now moving toward paperless (book-entry) registration, where no more physical stock certificates are issued. The Direct Registration System (DRS), which is run by the Depository Trust Company (DTC), allows electronic registration of securities. DTC maintains custody of most physical securities and clears and settles trades through its National Securities Clearing Corporation (NSCC) subsidiary.</p>
</div>

DRS allows the investor to be registered directly on the books of the transfer agent without a
physical certificate being issued (which saves money and time). Instead of the physical certificate,
the investor receives a "statement of ownership"—essentially an account statement. These securities
positions are moved electronically when a trade occurs.

Over time, it is expected that DRS will replace physical certificates.

#### Closing Out a Position: Buy-Ins and Sell-Outs

Sometimes, a seller will fail to deliver securities by the settlement date. When this happens, the
seller is given 3 additional business days before the buying firm is allowed to close out the
position. If delivery has not occurred on this later date (T+4), the buyer may close out the
position by purchasing the securities in the open market. This type of close-out is called a
<span class="key-term">buy-in</span>. When a buy-in occurs, the original seller will be responsible
for any difference in price if the new shares prove more expensive than the original shares.
Additionally, the buying broker must provide written notice of the proposed buy-in no later than
their noon ET one business day before executing the buy-in (T+3).

Conversely, when a buying firm fails to settle the trade on time, the selling firm may immediately
close out the position by selling the securities to another party. This is called a
<span class="key-term">sell-out</span>. If the sell-out is made at a lower price, the buyer will be
responsible for the difference. Unlike buy-ins, sell-outs do not require any written notice to the
buyer and can be executed any time after the settlement date.

#### Clearly Erroneous Transactions

A clearly erroneous transaction is one where there is an obvious error in any term, including price,
number of shares, unit of trading, or identification of security. Both FINRA and the exchanges have
mechanisms in place to review trades, and both may, at their motion, declare a trade null and void.
Suppose a member chooses to appeal a decision. In that case, it must send its appeal request to the
Uniform Practice Code (UPC) Committee for FINRA decisions or the Market Operations Review Committee
(MORC) for Nasdaq decisions within 30 minutes of receiving the decision being appealed.

#### Error Accounts

Error accounts are used when an error occurs that the firm will need to cover. Examples include when
a firm purchases the wrong amount of a security or the wrong security for a customer, or if the
customer orders the wrong security, and the firm agrees to cover the error for the customer. The
purpose of an error account is to organize and track errors and resolve them quickly and
efficiently. A principal at the firm must approve any charges made to an error account before they
are officially made, and all such charges must be documented. Error accounts cannot be used for
proprietary trading or other trading.

Another method that is used to address broker-dealer errors is a <span class="key-term">cancel and
rebill</span>. This method is used in cases where an amount is mistakenly deposited in the wrong
account. For instance, a deposit was deposited in a cash account, but it was meant for a margin
account. In this case, the registered representative can transfer the transaction to the other
account with the permission of a principal. It is important to remember, however, that customers
cannot cancel orders once they have been executed.

---

### Topic 3: Customer Confirmations

In addition to confirmations sent between broker-dealers to confirm a trade, a confirmation must
also be sent to the customer who placed the order. Under FINRA rules, customer confirmations must be
sent no later than the completion of the transaction. Transactions are completed at settlement, with
T+1 for a regular way transaction or same-day for a cash transaction.

Customer confirmations must include the following information:

- Customer name and address
- Firm name, address, and telephone number
- Type of account (cash or margin)
- Name of security purchased or sold
- Size and price of trade
- Accrued interest if a bond trade
- Section 31 fee, if trade is an agency trade, the commission must be disclosed
- If the trade is a principal transaction, the markup or markdown is not disclosed except for
  principal transactions in fixed-income money
- Whether a payment for order flow was accepted
- Trade date and settlement date
- CUSIP number

For equity trades, a record of the trade time and the name of the counterparty must be kept and made
available to the customer upon written request.

The MSRB requires additional disclosure for municipal bond transactions:

- Name of issuer, interest rate, maturity date, and if the bond is callable
- If the bond is a limited tax general obligation (GO) bond
- If a revenue bond, the source of the revenue
- The yield and dollar price of the transaction
  - For transactions in callable issues, the security is priced to maturity, while premium bonds are
    priced to the first call date (referred to as yield to worst)
  - For transactions in callable issues, discount bonds are priced to maturity, while premium bonds
    are priced to the first call date
  - If the bonds are original issue discount (zero-coupon)
  - If the securities are not in normal units (normal units are $1,000 denominations or multiples up
    to $100,000 per bond)

Any additional information requested by a customer after receiving a confirmation (such as the time
of the trade or name of the other party to the trade) must be provided within five business days of
the request. Duplicate confirms may be sent to a third party upon written client request.

---

### Topic 4: Accrued Interest

#### Accrued Interest Is Paid by the Buyer to Seller at Settlement

Most bonds pay interest semiannually, and interest is paid to the owner of record, as of the payment
date. When a bond is traded, the owner of record is changed to the new owner.

When the owner sells a bond, they are entitled to the interest that has accrued since the last
semiannual interest payment was made. Therefore, the buyer must pay the seller the interest that has
accrued from the last payment date to the day before the trade is settled. This amount is added to
the price of the trade.

#### Accrued Interest Calculation

For test purposes, you do not need to calculate the amount of accrued interest payable on a given
bond transaction. However, you will need to understand that accrued interest is paid by the buyer to
the seller, as well as the method used for calculating accrued interest.

Here are the basic rules for calculating accrued interest:

- Interest accrues from the last payment to the day before the settlement date. (In other words,
  since the trade settles, the interest belongs to the buyer.)
- The method for calculating accrued interest for corporate and municipal bonds uses 30 days per
  month and 360 days per year.
- The method for calculating accrued interest for U.S. Treasury obligations uses the actual number
  of days in the month and 365 days per year.

#### Trading Flat

Bonds that do not make periodic interest payments (such as zero-coupon bonds, defaulted bonds, and
income bonds) trade <span class="key-term">flat</span>, which means that no accrued interest is
added to the price of the trade.

---

### Summary: Trade Clearing and Settlement

<div class="critical-concept">
  <div class="critical-concept__label">Section 2 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Broker-dealer operations</td>
      <td>Purchasing and sales, confirming, margin, custody, and corporate action departments</td>
    </tr>
    <tr>
      <td>Trade clearing</td>
      <td>Role of the Depository Trust Company (DTC) and Options Clearing Corporation (OCC)</td>
    </tr>
    <tr>
      <td>Trade settlement</td>
      <td>Regular way settlement and cash settlement</td>
    </tr>
    <tr>
      <td>Good delivery of securities</td>
      <td>Rules for delivering physical securities, signature guarantees</td>
    </tr>
    <tr>
      <td>Customer confirmations</td>
      <td>Required information</td>
    </tr>
    <tr>
      <td>Accrued interest</td>
      <td>Calculation methods for interest owed by the buyer to the seller</td>
    </tr>
  </table>
</div>

---

## Section 3: Distribution Dates

Several key dates are associated with distributions, such as a cash dividend or a stock split. Some
of these dates are tied to regular way settlement.

### Why This Section Matters

Understanding distribution dates—declaration, record, ex-dividend, and payment—is essential for
answering exam questions and advising clients. With T+1 settlement, the ex-date and record date are
now the same day, which simplifies things considerably.

---

### Topic 1: Cash Dividend Dates

When the board of directors decides to make a cash dividend, it makes an announcement. Here is a
sample announcement:

> **Monday, March 31, 20XX** The Board of Directors of Acme Manufacturing Company today declares a
> dividend of 50 cents per share to stockholders of record as of April 8, 20XX. The dividend will be
> paid on April 23, 20XX.

The board of directors has set three dates:

- **Declaration date:** This date the dividend is declared
- **Record date:** The date by which investors must be the owners of record (whose trades have
  settled on or before that date) to receive the dividend
- **Payment date:** The date the corporation's transfer agent will mail the dividend checks to the
  owners of record. Sometimes called the payable date.

#### Ex-Date and Record Date Are Now the Same Day for Cash Dividends

You may still hear the term <span class="key-term">ex-date</span>, which refers to the first date on
which it is too late to buy the stock in time to receive the dividend. With T+1 becoming regular way
settlement, the ex-date and the record date are now the same. On the exam, if you see "ex-date,"
think "record date."

<div class="critical-concept">
  <div class="critical-concept__label">Ex-Dividend Date Timeline</div>
  <table>
    <tr>
      <th>Declaration Date</th>
      <th>Ex-Date</th>
      <th>Record Date</th>
      <th>Payment Date</th>
    </tr>
    <tr>
      <td>The date a company decides it will pay a dividend and pays it</td>
      <td>The date by which it is too late to buy the stock in time to get the dividend. Since regular way settlement is T+1, this is the same as the record date.</td>
      <td>The date set by the company that determines who will receive the dividend. Buyers whose trades have settled on or before this date will receive the dividend.</td>
      <td>The date, set by the company, on which a declared dividend is scheduled to be paid, also known as payable date.</td>
    </tr>
  </table>
</div>

#### Trades Must Settle by the Record Date for the Buyer to Receive the Dividend

To be an owner of record for the distribution, a customer must have paid for the stock by the close
of business on April 8 (the record date). If the trade settles on or before the record date, the
buyer will be the owner of record and will receive the dividend.

In a regular way settlement (T+1 business day), the trade would need to have been made one business
day before the record date (on or before Tuesday, April 8) for the buyer to qualify for the
dividend.

<div class="test-tip">
  <p><strong>Test Tip:</strong> Be very careful when reading questions about dividends. A dividend might be declared in one year (e.g., Dec 2026), but payable in another year (e.g., Jan 2027). Be sure to make a question is asking for dividends declared in a given year vs. dividends paid in a given year.</p>
</div>

#### If Trades Settle after Record Date, the Buyer Will Not Receive the Dividend

The last day to buy and get the dividend is one business day before the record date. If the stock is
purchased after this date, the trade will settle after the record date, and no dividend will be
received by the buyer.

#### Price Adjustment and Selling Dividends

On the record date, the stock price typically opens for trading at a level reduced by the dividend
amount. This makes sense since the company has paid out a portion of its net worth, and so should be
worth less.

For this reason, <span class="key-term">selling dividends</span>, which entices a customer to buy
solely to receive a specified dividend, is prohibited. Unsophisticated investors may not realize
that the value of a cash dividend will be deducted from the share price. So, while the investor may
profit from the dividend, the broker receives their commission.

#### Due Bills

<span class="key-term">Due bills</span> are also required when a trade takes place before the
ex-date, but settlement does not take place until after the record date. The seller will receive the
dividend, but it belongs to the buyer. In this case, a due bill is generated, and the seller will be
required to forward the dividend to the buyer when it is paid.

---

### Topic 2: Stock Splits and Stock Dividends

#### Ex-Date for Stock Splits and Stock Dividends

A forward stock split involves increasing the number of shares outstanding. For example, a 2
(2-for-1) stock split would distribute 2 new shares for every share currently outstanding. As a
result, the price will be reduced on the payable date. For example, if they originally bought 100
shares at $40 and the stock split 2-for-1, the customer would now own 200 shares at a cost basis of
$20 per share.

A reverse stock split reduces the number of shares outstanding while raising the price of the stock.
There is no change in the total value of the outstanding shares as a result of a forward or reverse
split.

Stock dividends are like stock splits. Additional shares are issued to existing shareholders, but
this will result in a proportional reduction in the stock price. There is no immediate change in a
shareholder's overall position, and no taxes are due since no cash is received.

Unlike a cash dividend, the ex-date for a stock split is the payable date + 1 business day. On the
payable date, shareholders of record who still own the stock will receive their new shares. The next
day, the exchange will adjust the price of the shares based on the split ratio and will also adjust
the price and size of any outstanding orders.

---

### Summary: Distribution Dates

<div class="critical-concept">
  <div class="critical-concept__label">Section 3 Key Points</div>
  <table>
    <tr>
      <th>Topic</th>
      <th>Key Details</th>
    </tr>
    <tr>
      <td>Cash dividend dates</td>
      <td>Declaration date, record date, ex-dividend date, and payable date</td>
    </tr>
    <tr>
      <td>Stock splits and stock dividends</td>
      <td>Forward and reverse splits, ex-date, and tax status</td>
    </tr>
  </table>
</div>

---

## Chapter 8 Key Terms Glossary

| Term                       | Definition                                                                 |
| -------------------------- | -------------------------------------------------------------------------- |
| **Regulation SHO**         | SEC rule requiring short sale orders be properly marked and shares located |
| **Discretionary order**    | Order where rep chooses security and/or amount; requires POA               |
| **Best execution**         | Obligation to obtain best outcome for customer                             |
| **Front running**          | Prohibited practice of trading ahead of large customer orders              |
| **Trading ahead**          | Placing firm orders before customer orders                                 |
| **Wash trades**            | Fictitious trades with no change in ownership                              |
| **Painting the tape**      | Creating false appearance of trading activity                              |
| **Pump and dump**          | Manipulating price up then selling                                         |
| **Spoofing**               | Placing orders to mislead then canceling                                   |
| **TRACE**                  | Trade Reporting and Compliance Engine for corporate bonds                  |
| **RTRS**                   | Real-Time Transaction Reporting System for municipal securities            |
| **EMMA**                   | Electronic Municipal Market Access system                                  |
| **DTC**                    | Depository Trust Company; holds securities in book-entry form              |
| **OCC**                    | Options Clearing Corporation                                               |
| **Clearing firm**          | Firm that handles trade settlement and custody                             |
| **Introducing firm**       | Firm that takes orders but uses clearing firm for processing               |
| **Book-entry**             | Electronic form of securities ownership                                    |
| **Regular way settlement** | T+1 for most securities                                                    |
| **Cash settlement**        | Same-day settlement                                                        |
| **DVP/RVP**                | Delivery versus payment / Receive versus payment                           |
| **Good delivery**          | Securities meeting requirements for transfer                               |
| **Signature guarantee**    | Authentication of signature for transfer (medallion)                       |
| **Buy-in**                 | Forced purchase when seller fails to deliver                               |
| **Sell-out**               | Forced sale when buyer fails to pay                                        |
| **DK notice**              | Don't Know notice for trade discrepancies                                  |
| **Accrued interest**       | Interest owed by buyer to seller on bond trades                            |
| **Trading flat**           | Bonds trading without accrued interest                                     |
| **Declaration date**       | When dividend is announced                                                 |
| **Record date**            | Date determining who receives dividend                                     |
| **Ex-dividend date**       | First day buyer won't receive dividend (same as record date with T+1)      |
| **Payment date**           | When dividend is paid                                                      |
| **Due bill**               | Obligation to forward dividend to rightful owner                           |

---

_Chapter 8 covers what happens after a trade is executed. Master trade processing and settlement
before moving to Chapter 9: Fundamentals of Options, which introduces derivative securities._
