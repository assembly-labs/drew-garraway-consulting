---
chapter: 11
section: 1
title: "Margin Accounts"
description: "Understanding leverage, Regulation T requirements, margin calculations, and the mechanics of borrowing to invest"
topics:
  - Introduction to Margin Accounts
  - Regulation T: Buying on Margin
  - Regulation T: Selling Short on Margin
  - Regulation T for Cash Accounts
  - Restricted Margin Accounts and Minimum Maintenance
  - Opening a Margin Account
estimated_time: 35
difficulty: intermediate
last_updated: 2026-01-03
---

# Margin Accounts

## Introduction

In October 1929, you could buy $10,000 worth of stock with just $1,000 cash. Brokers happily lent the other 90%. When the market crashed, those loans came due. Investors who couldn't meet their margin calls were forced to sell—at any price—which pushed stocks lower, triggering more margin calls, forcing more sales. The cascade turned a market correction into the Great Depression.

That's why the Federal Reserve now sets the rules for borrowing to buy securities. The current answer to "how much can you borrow?" has been the same since 1974: 50%.

Customers can open different types of accounts at a broker-dealer. In a <span class="key-term">cash account</span>, a customer must deposit 100% of the purchase price of a security. A <span class="key-term">margin account</span> allows a customer to borrow either money or securities from a broker-dealer. The rules for both cash and margin accounts are governed by the Federal Reserve under <span class="key-term">Regulation T (Reg T)</span>. There are also additional Financial Industry Regulatory Authority (FINRA) requirements for the opening and maintenance of margin accounts.

A customer opens a margin account in order to borrow cash or securities from a broker-dealer. By borrowing, the investor is using <span class="key-term">leverage</span>. Leverage can provide greater returns but can also result in greater losses. Risks and returns are lower in a cash account, where the customer does not borrow money.

## Learning Objectives

By the end of this section, you'll be able to:
- Explain the difference between cash accounts and margin accounts
- Calculate initial margin requirements under Regulation T
- Distinguish between marginable and non-marginable securities
- Understand short selling mechanics and margin requirements
- Apply Reg T rules to cash account violations
- Calculate equity percentages and identify restricted accounts
- Know FINRA minimum maintenance requirements
- Identify the components of a margin agreement

---

## Regulation T: Buying on Margin

<span class="key-term">Regulation T (Reg T)</span> is a Federal Reserve Board regulation that covers lending from broker-dealers to customers. It sets <span class="key-term">initial margin requirements</span> (the percentage of the security's purchase price that the customer must pay for with cash) for marginable securities. In a cash account, as opposed to a margin account, the initial margin requirement is 100%.

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>Before the Securities Exchange Act of 1934, margin requirements were set by individual exchanges—and they were shockingly low. In the 1920s, investors routinely bought stocks with 10% down. When the crash came, those undercapitalized positions collapsed like dominoes. Congress gave the Federal Reserve authority over margin requirements specifically to prevent another leverage-fueled catastrophe. The Fed experimented with different rates over the decades—it was 100% briefly in 1946—before settling on 50% in 1974, where it's remained ever since.</p>
</div>

Under Reg T, a broker-dealer may lend a customer up to 50% of the purchase price of a <span class="key-term">marginable security</span>.

<div class="critical-concept">
  <div class="critical-concept__label">INITIAL MARGINS SET BY REG T</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Long Position</th>
        <th>Short Position</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Stocks and convertibles</strong></td>
        <td>50%</td>
        <td>50%</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="info-box">
  <div class="info-box__title">Example: Buying on Margin</div>
  <p>A customer buys 200 shares of ABC (a New York Stock Exchange-listed stock) at $50 per share. Under Reg T, the <span class="key-term">initial margin requirement</span> is 50% of $10,000 = $5,000.</p>
  <p>To purchase the stock in a margin account, the customer would be required to provide $5,000 and the broker-dealer would lend the customer the additional $5,000.</p>
</div>

### Exempt Securities

<span class="key-term">Exempt securities</span> are not covered under Reg T. The major exempt securities are:

- U.S. government securities
- Agency issues
- Municipal issues
- Commercial paper

The Federal Reserve has no power to set initial margins for these securities. However, these securities are marginable subject to <span class="key-term">minimum maintenance requirements</span> set by the Financial Industry Regulatory Authority (FINRA). While corporate bonds are nonexempt, the Fed does not set margin requirements on these securities. Minimum initial and maintenance requirements are set by FINRA.

### Marginable vs. Non-Marginable Securities

Not all securities can be purchased on margin. Nasdaq and all exchange-listed securities are marginable, as are U.S. government and municipal bonds. Over-the-counter (OTC) securities are allowed only if they are listed on the Federal Reserve <span class="key-term">marginable securities list</span>.

Newly issued securities cannot be purchased on margin until they have been publicly traded at least 30 days. Because mutual fund shares are always considered new shares, they cannot be purchased on margin. But once mutual fund shares have been held for 30 days, they can be used as collateral for a margin loan.

<div class="critical-concept">
  <div class="critical-concept__label">MARGINABLE AND NON-MARGINABLE SECURITIES</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Securities</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Marginable securities</strong>—securities that can be purchased on margin</td>
        <td>
          <ul>
            <li>Exchange-listed securities (including Nasdaq and NYSE securities)</li>
            <li>U.S. government securities</li>
            <li>Investment-grade bonds and debentures</li>
            <li>OTC securities that are listed on the Federal Reserve marginable securities list</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>Non-marginable securities</strong>—securities that cannot be purchased on margin</td>
        <td>
          <ul>
            <li>New issues of securities that have been publicly traded for less than 30 days</li>
            <li>Mutual fund shares and investment contracts such as variable annuities</li>
            <li>Securities that sell for less than $5 per share</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><strong>Margin securities</strong>—securities that can be used as collateral on loans</td>
        <td>
          <ul>
            <li>Marginable securities</li>
            <li>Mutual fund and unit investment trust shares and investment contracts that have been owned for at least 30 days</li>
            <li>Any convertible debt security that can be converted into a margin security</li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

### Minimum Deposit Requirement

Margin accounts have a minimum equity requirement of $2,000. The rules work as follows:

<div class="critical-concept">
  <div class="critical-concept__label">MINIMUM DEPOSIT RULES</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Purchase Amount</th>
        <th>Deposit Required</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Less than $2,000</td>
        <td>100% of the purchase price</td>
      </tr>
      <tr>
        <td>$2,000 - $4,000</td>
        <td>$2,000</td>
      </tr>
      <tr>
        <td>Over $4,000</td>
        <td>50% (Reg T requirement)</td>
      </tr>
    </tbody>
  </table>
</div>

---

## Regulation T: Selling Short on Margin

<span class="key-term">Short selling</span> is when an investor borrows securities from a broker-dealer, and then sells them. This can only be done in a margin account.

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>Short selling has been controversial since the Dutch East India Company in the 1600s. During every market panic, someone blames the short sellers. After the 1929 crash, Congress considered banning the practice entirely. Instead, they opted for regulation. The logic for requiring margin on short sales is straightforward: when you short a stock, your potential loss is theoretically unlimited (the stock could rise forever), so the broker needs collateral to protect against that risk.</p>
</div>

A customer will use a short-selling strategy when they are bearish and believe that the price of the borrowed securities will fall. Their strategy is to sell the securities at the current high price, then buy the securities back at a cheaper price in the future. After they buy the shares at the hopefully lower price, they return them to the broker-dealer (<span class="key-term">covering</span> their short position). The difference between what they initially sold the shares for, and what they purchased them for, will be the customer's profit.

In summary:
- <span class="key-term">Bullish investors</span> hope to buy low and sell high.
- <span class="key-term">Bearish investors</span> hope to sell high and buy low.

The Reg T initial margin requirement is the same for buyers and short-sellers—50%.

<div class="info-box">
  <div class="info-box__title">Example: Short Selling</div>
  <p>A customer shorts 1,000 shares of XYZ stock. XYZ is currently trading at $10 per share. Reg T requires that the customer deposit 50% of the value of the trade, or $5,000.</p>
</div>

---

## Regulation T for Cash Accounts

Regulation T (Reg T) also applies to cash accounts. In a cash account, Reg T requires that the broker-dealer collect payment from the customer <span class="key-term">promptly</span>, which means no later than two business days after the settlement date.

In a stock trade, regular way settlement is one business day. So, Reg T requires payment by the customer within three business days after the trade (T+3), which is two business days after settlement (<span class="key-term">S+2</span>: Settlement + 2 business days).

### Reg T Extension

If payment is not collected by S+2, under exceptional circumstances, the firm may ask the Financial Industry Regulatory Authority (FINRA) for a <span class="key-term">Reg T extension</span>. If granted, this gives the customer another two business days (or longer if a special request is made) to pay.

If the customer does not pay on either "S+2" or the extension date, if one is granted, the firm is obligated to <span class="key-term">sell out</span> that position and <span class="key-term">freeze the account</span> for 90 days.

When an account is <span class="key-term">frozen</span>, the customer can still trade in the account. However, they can no longer borrow and must have 100% of the required cash to pay for the transaction. After 90 days, given that the customer complies, the freeze is removed.

### Free-Riding

<span class="key-term">Free-riding</span> is the prohibited practice of buying securities without intending to pay for them, and then selling them on or before the settlement date to generate the cash needed to pay for the original purchase.

<div class="info-box">
  <div class="info-box__title">Example: Free-Riding Violation</div>
  <p>XYZ will be announcing quarterly earnings in two days. A customer believes the news will be positive and decides to buy 1,000 shares of XYZ at $50 per share. The customer does not have the $50,000 to pay for the stock but plans to sell the stock when the price rises.</p>
  <p>The customer is trying to take a "free ride" by using the broker-dealer to buy the stock for them. Relying on money from the sale of stock to pay for the purchase of the same stock is a violation. The customer's account will be frozen for 90 days. During this time, the customer cannot buy securities unless they already have the cash in their account to pay for the transaction.</p>
</div>

---

## Restricted Margin Accounts and Minimum Maintenance Requirements

One final aspect of Regulation T (Reg T) relates to what is called a <span class="key-term">restricted margin account</span>. This is where the equity in the customer's account has fallen below 50%.

### Calculating Equity

The formula for determining equity (ownership value) in a margin account is:

<div class="critical-concept">
  <div class="critical-concept__label">EQUITY FORMULAS</div>
  <p><strong>Equity Value</strong> = Market Value of Security − Amount Owed Broker</p>
  <p><strong>Equity Percentage</strong> = Equity Value ÷ Market Value of the Security</p>
</div>

<div class="info-box">
  <div class="info-box__title">Example: Calculating Equity</div>
  <p>A customer buys $80,000 worth of stock in a margin account and deposits the required $40,000 initial margin requirement and borrows $40,000 from the broker-dealer. The next day, the stock's value declines to $60,000. How much equity does the customer now have?</p>
  <p>The market value is $60,000.</p>
  <p>The customer owes the broker-dealer $40,000.</p>
  <p>$60,000 − $40,000 = <strong>$20,000 of equity</strong></p>
  <p>What is the customer's equity percentage in the account?</p>
  <p>Equity of $20,000 ÷ stock's market value of $60,000 = an equity percentage of <strong>33.33%</strong></p>
</div>

Since the equity percentage has fallen below 50%, the account is now <span class="key-term">restricted</span>. But this restriction has little impact on the customer. They are not required to deposit any more money, the account is not frozen, and they can still buy more stock by depositing only 50% of the purchase price. However, there are limits to how far the equity percentage in an account can fall.

### Minimum Maintenance Requirements

These limits are the <span class="key-term">minimum maintenance requirements</span> that are set by the Financial Industry Regulatory Authority (FINRA).

Under FINRA's minimum maintenance requirements, customers must keep a certain percentage of equity in the account at all times:

<div class="critical-concept">
  <div class="critical-concept__label">FINRA MINIMUM MAINTENANCE MARGIN</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Position Type</th>
        <th>Long Position</th>
        <th>Short Position</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Stocks and convertibles</strong></td>
        <td>25%</td>
        <td>30%</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="info-box">
  <div class="info-box__title">Example: Long Position Maintenance</div>
  <p>A customer has 200 shares of ABC stock at $50 in a long account. The minimum maintenance margin requirement is 25% of $10,000 = $2,500. The customer will be called for additional margin if the equity in the account drops below $2,500.</p>
</div>

<div class="info-box">
  <div class="info-box__title">Example: Short Position Maintenance</div>
  <p>A customer has sold 200 shares of ABC stock at $50 in a short account. The minimum maintenance margin requirement is 30% of $10,000 = $3,000. The customer will be called for additional margin if the equity in the account drops below $3,000.</p>
</div>

Broker-dealers can, and usually do, establish more stringent (meaning higher) maintenance margin requirements than the 25% set by FINRA.

<div class="test-tip">
  <p><strong>Test-Taking Tip:</strong> For the purpose of the test, you will not be required to do any elaborate margin calculations. You will need to understand the basic requirements including the following:</p>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Requirement</th>
        <th>Long Stock</th>
        <th>Short Stock</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Regulation T initial margin requirement</strong></td>
        <td>50%</td>
        <td>50%</td>
      </tr>
      <tr>
        <td><strong>FINRA minimum maintenance margin requirement</strong></td>
        <td>25%</td>
        <td>30%</td>
      </tr>
    </tbody>
  </table>
</div>

### Special Memorandum Account (SMA)

When a security that has been bought on margin increases in value, the equity in the account also increases. When the equity in a margin account rises over 50% of the market value, the amount over 50% is referred to as <span class="key-term">excess equity</span>. Excess equity is put into a <span class="key-term">special memorandum account (SMA)</span>.

Excess equity creates buying power of <strong>2 × SMA</strong> (since the initial margin requirement is 50%). This means the customer could use their $5,000 of excess equity to buy $10,000 of stock (meeting the 50% margin requirement). In addition, the SMA amount could be withdrawn from the account in cash. But note that this withdrawal would be considered a loan and added to the amount that the customer owes the broker-dealer.

---

## Opening a Margin Account

To open a "cash" account, only the new account form is required. In a cash account, the customer agrees that they will pay in full for all purchases. To open a margin account, additional documentation is required.

### The Margin Agreement

Prior to opening a margin account, the customer must sign a <span class="key-term">margin agreement</span>. The margin agreement sets the terms and conditions between the customer and broker-dealer.

The agreement has three parts: the hypothecation agreement, the credit agreement, and the loan consent agreement.

<div class="critical-concept">
  <div class="critical-concept__label">COMPONENTS OF THE MARGIN AGREEMENT</div>
  <table class="comparison-table">
    <thead>
      <tr>
        <th>Component</th>
        <th>Purpose</th>
        <th>Required?</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Hypothecation Agreement</strong></td>
        <td>Customer pledges (hypothecates) securities to the brokerage firm as collateral. Firm holds securities in <span class="key-term">street name</span> (registered in the name of the firm). Allows broker-dealer to sell securities if account falls below minimum maintenance.</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><strong>Credit Agreement</strong></td>
        <td>Sets terms and conditions of the loan. States that interest on the loan balance will be based on the broker loan rate (e.g., call loan rate + 2%).</td>
        <td>Yes</td>
      </tr>
      <tr>
        <td><strong>Loan Consent Agreement</strong></td>
        <td>Allows broker-dealers to lend out a customer's margined securities to other customers for short-selling purposes.</td>
        <td>No (but typically included)</td>
      </tr>
    </tbody>
  </table>
</div>

The firm also has the right to repledge (<span class="key-term">rehypothecate</span>) the securities to a bank to raise funds. The Federal Reserve controls lending by banks to broker-dealers under <span class="key-term">Regulation U (Reg U)</span>. Funds are borrowed from the bank by the brokerage firm at the <span class="key-term">broker's call</span> (or <span class="key-term">call loan rate</span>). The call loan rate is the rate banks lend money to broker-dealers to fund the margin loans that brokers give to customers.

<div class="test-tip">
  <p><strong>Test-Taking Tip:</strong> Borrowing between banks and brokers is covered under Reg U. Borrowing between brokers and their customers is covered under Reg T.</p>
</div>

### Disclosure Requirements

Finally, alongside the margin agreement, noninstitutional customers opening a margin account must be given a <span class="key-term">credit disclosure statement</span> as well as a <span class="key-term">margin risk disclosure statement</span> explaining the risks of margin trading. This disclosure must be redelivered to margin customers annually.

<div class="info-box">
  <div class="info-box__title">Customer Signature Required</div>
  <p>Unlike opening a standard cash account (where a signature is NOT required), the margin agreement must be signed by the customer at or prior to settlement of the first trade in the account.</p>
</div>

---

## Summary

Margin accounts allow customers to leverage their investments by borrowing from broker-dealers. While this can amplify returns, it also amplifies losses—and creates obligations that can force sales at the worst possible times.

The regulatory framework—Reg T for initial requirements, FINRA rules for maintenance—exists because of hard lessons learned in 1929 and since. Every percentage requirement you memorize for the exam represents a guardrail against the kind of cascading failures that can turn individual losses into systemic crises.

### Key Points to Remember

1. **Cash account**: Customer pays 100% of purchase price
2. **Margin account**: Customer can borrow up to 50% under Reg T
3. **Initial margin (Reg T)**: 50% for both long and short positions
4. **Minimum maintenance (FINRA)**: 25% long, 30% short
5. **Minimum deposit**: $2,000 for margin accounts
6. **Reg T payment deadline**: S+2 (settlement + 2 business days)
7. **Frozen account**: 90 days, must pay 100% cash for trades
8. **Free-riding**: Buying without intent to pay, using sale proceeds to cover purchase
9. **Restricted account**: Equity below 50% but above maintenance
10. **Margin agreement**: Hypothecation (required), credit (required), loan consent (optional)
11. **Reg T**: Broker-to-customer lending; **Reg U**: Bank-to-broker lending

### Quick Reference - Key Terms

- <span class="key-term">Regulation T</span>: Federal Reserve rule governing broker-dealer lending to customers
- <span class="key-term">Initial Margin</span>: Percentage customer must deposit to purchase securities (50% for stocks)
- <span class="key-term">Maintenance Margin</span>: Minimum equity required to maintain a position (25% long, 30% short)
- <span class="key-term">Marginable Securities</span>: Securities that can be purchased on margin
- <span class="key-term">Street Name</span>: Securities registered in the broker-dealer's name, not the customer's
- <span class="key-term">Hypothecation</span>: Pledging securities as collateral for a margin loan
- <span class="key-term">Rehypothecation</span>: Broker repledging customer securities to a bank
- <span class="key-term">Short Selling</span>: Selling borrowed securities, hoping to buy back at lower price
- <span class="key-term">Covering</span>: Buying securities to return borrowed shares and close short position
- <span class="key-term">Free-Riding</span>: Prohibited practice of buying without intent to pay
- <span class="key-term">SMA</span>: Special Memorandum Account holding excess equity
- <span class="key-term">Call Loan Rate</span>: Rate banks charge broker-dealers for margin funding

---

## Next Steps

- Proceed to Section 11.2: Prime Brokerage and Portfolio Margin (if applicable)
- Review the margin calculation examples
- Practice identifying marginable vs. non-marginable securities
