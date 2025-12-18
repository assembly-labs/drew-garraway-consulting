---
chapter: 8
section: 2
title: "Trade Clearing and Settlement"
description: "How trades actually get processed, from execution to final settlement, plus the archaic rules for physical certificates that somehow still exist"
topics:
  - Trade Clearing
  - The DTC and NSCC
  - Trade Settlement (T+1)
  - Good Delivery Requirements
  - Customer Confirmations
  - Accrued Interest
estimated_time: 30
difficulty: intermediate
last_updated: 2024-12-16
---

# Trade Clearing and Settlement

## Introduction

You click "buy" on your brokerage app, and a second later it says "filled." Done, right? Not even close.

Behind that one-second confirmation lies an intricate machinery of clearing corporations, depositories, and settlement systems processing trillions of dollars daily. Your shares don't actually become yours until settlement—and until May 2024, that took two full business days. Now it takes one, which sounds trivial until you realize the industry spent years and billions of dollars shaving off that single day.

This section covers what happens after you click the button: how trades get matched, verified, and ultimately settled. It's the plumbing of the financial system—invisible when it works, catastrophic when it doesn't. And yes, we'll cover the archaic rules for physical stock certificates, because the exam still tests them even though hardly anyone uses paper anymore.

## Learning Objectives

By the end of this section, you'll be able to:
- Explain the roles of the DTCC, DTC, NSCC, and OCC
- Distinguish between clearing firms and introducing firms
- Apply settlement timeframes for different security types
- Understand good delivery requirements for physical certificates
- Identify required information on customer confirmations
- Calculate accrued interest on bonds (conceptually—actual math isn't required)

---

## Trade Clearing

After a trade is executed, it must be <span class="key-term">cleared</span> and <span class="key-term">settled</span>. These are not the same thing:

- **Clearing** = verifying that both parties agree on the trade details and preparing for settlement
- **Settlement** = actually exchanging cash for securities

Think of clearing as making sure everyone agrees on what happened, and settlement as making it official.

### The Depository Trust Company (DTC)

The <span class="key-term">Depository Trust Company (DTC)</span> is essentially the vault where all securities positions are held. Member firms maintain accounts at the DTC containing:
- Securities they hold for their own accounts
- Securities they hold for customers
- Cash used to buy and sell securities

Here's the key insight: physical stock certificates still exist, but almost all securities are now held in <span class="key-term">book entry</span> form—electronic records rather than paper. The DTC holds the master records. When you "own" 100 shares of Apple, what you actually own is an entry in a database showing that your broker's account at the DTC includes 100 Apple shares credited to you.

### The National Securities Clearing Corporation (NSCC)

The <span class="key-term">National Securities Clearing Corporation (NSCC)</span> handles the clearing of corporate securities trades. Here's how it works:

1. Both sides of a trade (buying firm and selling firm) submit trade details to the NSCC
2. The NSCC compares the submissions to make sure they match
3. If they match, the trade proceeds to settlement
4. On settlement date, the NSCC instructs the DTC to adjust the firms' accounts

Both the DTC and NSCC are subsidiaries of the <span class="key-term">Depository Trust & Clearing Corporation (DTCC)</span>—the parent company that oversees the post-trade infrastructure.

### Clearing Firms vs. Introducing Firms

Not every brokerage firm handles its own clearing. The industry divides into:

<span class="key-term">Clearing firms</span> are large broker-dealers that clear and settle trades for themselves and their customers. They maintain relationships with the DTC and NSCC and handle all the back-office processing.

<span class="key-term">Introducing firms</span> are smaller broker-dealers that focus on customer relationships. They take orders from customers but rely on clearing firms to handle the actual processing. Think of a clearing firm as the factory, and an introducing firm as the sales office.

<div class="info-box">
  <p><strong>Why this matters:</strong> When you open an account at a smaller brokerage, your account may actually be carried at a larger clearing firm. Your statements might come from the clearing firm, not your broker. This can be confusing for customers—and occasionally for compliance purposes.</p>
</div>

### The Options Clearing Corporation (OCC)

The <span class="key-term">Options Clearing Corporation (OCC)</span> performs a similar function for options trades. When options trades occur, they're reported to the OCC, which records positions and guarantees contract performance.

The OCC guarantee is crucial: when you buy an option, you're not relying on some random counterparty to honor the contract. You're relying on the OCC, which stands between all buyers and sellers. This is why standardized exchange-traded options are far safer than custom OTC derivatives.

### Trade Comparisons and DK Notices

Once trades are submitted to the NSCC, each side sends a confirmation to the <span class="key-term">contra broker</span> (the firm on the other side of the trade). These confirmations are compared to ensure all terms match:

- Trade date
- Settlement date
- Size of trade
- Security traded
- Execution price
- <span class="key-term">CUSIP number</span> (a unique identifier assigned to all U.S. and Canadian registered securities)

If there's a discrepancy, the firm that spots it sends a <span class="key-term">DK (Don't Know) notice</span> to the other firm. Translation: "Your records don't match mine—figure it out." DK notices must be resolved within 20 minutes of receiving the mismatched trade report.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> Dealer-to-dealer trade confirmations do NOT include customer information or commission details. That information is between the firm and its customer, not between firms. Customer confirmations are a separate document.</p>
</div>

---

## Trade Settlement

<span class="key-term">Settlement</span> is when transactions officially complete—cash and securities actually change hands. The price was locked in on the trade date, but ownership doesn't transfer until settlement.

### Regular Way Settlement: T+1

As of May 2024, <span class="key-term">regular way settlement</span> for most securities is <span class="key-term">T+1</span>—one business day after the trade date. This applies to:
- Stocks
- Corporate bonds
- Municipal bonds
- U.S. government securities
- Listed options

If you buy stock on Monday, settlement occurs Tuesday. Buy on Friday, settlement is the following Monday (weekends and holidays don't count as business days).

<div class="historical-note">
  <div class="historical-note__label">Historical Context</div>
  <p>Settlement used to take five business days (T+5), then shortened to T+3 in 1995, then T+2 in 2017, and finally T+1 in 2024. Each reduction required massive infrastructure investment. The meme stock volatility of January 2021—when brokers restricted trading because they couldn't meet settlement obligations—accelerated the push to T+1.</p>
</div>

### Cash Settlement

<span class="key-term">Cash settlement</span> means same-day settlement, for trades entered before 2:30 p.m. ET.

Don't confuse cash settlement with trades in a cash account:
- A <span class="key-term">cash account</span> is a brokerage account where the customer pays in full (no borrowing)
- <span class="key-term">Cash settlement</span> is same-day settlement regardless of account type

Cash settlement is typically used for:
- **Index options** (you can't physically deliver "the S&P 500")
- **Commodity futures** (when physical delivery would be impractical—nobody actually wants 10 tons of pork bellies delivered)

### Other Settlement Types

**Seller's Option Settlement:** When the seller needs more time than regular way—perhaps physical certificates are in a safe deposit box and take longer to retrieve. The seller gives the buyer one day's notice of when securities will be delivered.

**Buyer's Option Settlement:** The reverse situation—when the buyer can't pay by regular way settlement.

**When, As, and If Issued Settlement:** For new securities that have been announced but aren't yet available for trading. The trade settles when the securities are actually issued.

---

## Good Delivery of Securities (Physical Certificates)

Yes, physical stock certificates still exist. And yes, the exam still tests the rules for delivering them, even though you'll rarely encounter paper certificates in practice.

For a physical delivery to be "good"—meaning the receiving party must accept it—several conditions must be met:

### Endorsement Requirements

Physical securities must be endorsed on the back by the registered owner, exactly as their name appears on the front. "John Q. Smith" on the certificate means the signature must be "John Q. Smith"—not "John Smith" or "J.Q. Smith."

Alternative: Use a <span class="key-term">stock power</span> or <span class="key-term">bond power</span>—a separate document that transfers ownership without signing the certificate itself. This is safer because the certificate and the signed transfer document can be mailed separately.

### Signature Guarantees (Medallions)

The customer's signature must be guaranteed by:
- A FINRA member firm
- A bank
- A savings institution

This <span class="key-term">signature guarantee</span> (sometimes called a <span class="key-term">medallion</span>) confirms the signer is who they claim to be. It's not the same as a notary seal—notaries verify signatures but don't guarantee the authority to transfer securities.

### Certificate Denominations

**Bonds:** Must be delivered in denominations of $1,000 (the minimum face amount) or multiples of $1,000, up to $100,000 maximum per certificate.

**Stocks:** Must be delivered in <span class="key-term">round lots</span> (100 shares) or certificates that can combine to make round lots.

Example: For a trade of 400 shares, these would all be good delivery:
- 1 certificate for 400 shares ✓
- 4 certificates of 100 shares each ✓
- 8 certificates of 50 shares each ✓ (two 50s = 100)

But 10 certificates of 40 shares each would NOT be good delivery because 40 + 40 + 40 = 120, which is an odd lot. The remaining 40-share certificates can't combine into round lots.

### Mutilated Securities

If a certificate is damaged, torn, or otherwise mutilated, it's not good delivery—unless accompanied by a validation letter from the transfer agent or issuer confirming the certificate's authenticity.

<div class="test-tip">
  <p><strong>💡 Test Tip:</strong> The math on good delivery comes up on the exam. Remember: all certificates must be able to combine into round lots of 100 shares. If you can't add them up to multiples of 100, it's not good delivery.</p>
</div>

---

## Customer Confirmations

In addition to dealer-to-dealer confirmations, firms must send confirmations to customers. Under FINRA rules, customer trade confirmations must be delivered no later than the completion of the transaction—which means by settlement date (T+1 for regular way transactions, same day for cash settlement).

### Required Information

Customer confirmations must include:
- Customer name and address
- Firm name, address, and telephone number
- Type of account (cash or margin)
- Name of security purchased or sold
- Size and price of trade
- Trade date and settlement date
- CUSIP number
- <span class="key-term">Accrued interest</span> (if a bond trade)
- Commission (if the firm acted as agent/broker)
- Whether the firm accepted <span class="key-term">payment for order flow</span>

### What's NOT Disclosed

Here's an important distinction: if the firm acts as a <span class="key-term">dealer (principal)</span>, the markup or markdown is generally NOT disclosed on the confirmation—except for principal transactions in Nasdaq stocks, where markup/markdown must be disclosed.

Why the different treatment? Nasdaq has required this disclosure since the 1990s following scandals involving excessive markups on OTC stocks.

### Additional Disclosure for Municipal Bonds

The <span class="key-term">Municipal Securities Rulemaking Board (MSRB)</span> requires additional disclosure for municipal bond transactions:
- Name of issuer, interest rate, maturity date, and whether callable
- Whether it's a limited tax general obligation (GO) bond
- If a revenue bond, the source of revenue
- Yield and dollar price
  - For noncallable bonds: yield to maturity
  - For callable bonds trading at a premium: <span class="key-term">yield to worst</span> (typically yield to first call date)

### Additional Information Upon Request

Additional information requested by a customer—such as the time of the trade or the name of the other party—must be provided within five business days of the request.

---

## Accrued Interest

Most bonds pay interest semi-annually, and that interest goes to the owner of record. When a bond is sold between interest payments, the seller is entitled to the interest that has accumulated since the last payment.

At settlement, the buyer pays the seller:
- The purchase price of the bond, PLUS
- <span class="key-term">Accrued interest</span> from the last payment date through the day before settlement

When the next interest payment arrives, the buyer receives the full six months of interest—even though they owned the bond for less time. The accrued interest payment compensates the seller for the interest they earned but won't receive.

### Calculation Methods

For exam purposes, you don't need to calculate actual accrued interest, but you should know the methods:

**Corporate and Municipal Bonds:** Use the 30/360 method—30 days per month, 360 days per year. This simplifies calculations.

**U.S. Treasury Securities:** Use actual/365—the actual number of days in each month and 365 days per year. More precise, more complicated.

### Bonds That Trade Flat

Some bonds trade <span class="key-term">flat</span>—meaning no accrued interest is added to the purchase price:

- **Zero-coupon bonds:** No periodic interest payments to accrue
- **Defaulted bonds:** The issuer isn't paying interest, so there's nothing to accrue
- **Income bonds:** Interest is only paid when the issuer has sufficient income

<div class="info-box">
  <p><strong>Think of it this way:</strong> Accrued interest exists because bond interest payments don't prorate automatically. If you sell a bond three months after an interest payment, you've "earned" three months of interest but the next payment goes entirely to the new owner. Accrued interest fixes that fairness problem.</p>
</div>

---

## Summary

Important points to remember:

- **Trade clearing** verifies both parties agree on trade terms; **settlement** is the actual exchange of cash and securities
- **DTC** holds securities positions in book entry form; **NSCC** clears corporate securities trades; both are DTCC subsidiaries
- **Clearing firms** handle back-office processing; **introducing firms** focus on customer relationships
- **OCC** clears and guarantees options contracts
- **DK notices** resolve trade discrepancies within 20 minutes
- **Regular way settlement** is **T+1** for stocks, bonds, and listed options
- **Cash settlement** is same day (for trades before 2:30 PM ET)
- **Good delivery** of physical certificates requires proper endorsement, signature guarantee (medallion), and round lot denominations
- **Customer confirmations** must include trade details, commissions (if agency), and accrued interest (if bonds)
- **Markups/markdowns** are NOT disclosed except for Nasdaq principal transactions
- **Accrued interest** is paid by buyer to seller; corporate/muni bonds use 30/360; Treasuries use actual/365
- **Flat bonds** (zeros, defaulted, income bonds) have no accrued interest

