# Series 7 Formula Sheet
## All Calculations in One Place

---

## Options Formulas

### Long Call
| Metric | Formula |
|--------|---------|
| **Max Gain** | Unlimited |
| **Max Loss** | Premium paid |
| **Breakeven** | Strike price + Premium |

### Long Put
| Metric | Formula |
|--------|---------|
| **Max Gain** | Strike - Premium (×100 for dollars) |
| **Max Loss** | Premium paid |
| **Breakeven** | Strike price - Premium |

### Short Call (Naked)
| Metric | Formula |
|--------|---------|
| **Max Gain** | Premium received |
| **Max Loss** | Unlimited |
| **Breakeven** | Strike price + Premium |

### Short Put
| Metric | Formula |
|--------|---------|
| **Max Gain** | Premium received |
| **Max Loss** | Strike - Premium (×100 for dollars) |
| **Breakeven** | Strike price - Premium |

### Covered Call
| Metric | Formula |
|--------|---------|
| **Max Gain** | (Strike - Stock Cost) + Premium |
| **Max Loss** | Stock Cost - Premium |
| **Breakeven** | Stock Cost - Premium |

### Protective Put
| Metric | Formula |
|--------|---------|
| **Max Gain** | Unlimited |
| **Max Loss** | (Stock Cost - Strike) + Premium |
| **Breakeven** | Stock Cost + Premium |

### Debit Spread
| Metric | Formula |
|--------|---------|
| **Max Gain** | Width of spread - Net premium paid |
| **Max Loss** | Net premium paid |

### Credit Spread
| Metric | Formula |
|--------|---------|
| **Max Gain** | Net premium received |
| **Max Loss** | Width of spread - Net premium received |

### Spread Breakeven
**Call Spread:** Lower strike + Net premium
**Put Spread:** Higher strike - Net premium

---

## Margin Formulas

### Initial Margin (Reg T = 50%)

**Long Margin:**
```
Margin Required = Market Value × 50%
Loan Amount = Market Value × 50%
```

**Short Margin:**
```
Margin Required = Short Market Value × 50%
Credit Balance = Short Proceeds + Margin Deposit
```

### Long Margin Equity
```
Equity = Market Value - Debit Balance
```

### Short Margin Equity
```
Equity = Credit Balance - Short Market Value
```

### SMA (Special Memorandum Account)
```
SMA increases when:
- Stock price rises (50% of increase)
- Dividends received
- Cash deposits
- Sale proceeds above loan value

SMA = Equity - (Market Value × 50%)
     (Only when equity > 50%)
```

### Buying Power
```
Buying Power = SMA ÷ Reg T
Buying Power = SMA ÷ 0.50
Buying Power = SMA × 2
```

### Maintenance Margin (Long)
```
Minimum Equity = 25% of Market Value

Margin Call when:
Equity < 25% of Market Value

Margin Call Trigger Price:
Debit Balance ÷ 0.75
```

### Maintenance Margin (Short)
```
Minimum Equity = 30% of Market Value

Margin Call when:
Equity < 30% of Market Value

Margin Call Trigger Price:
Credit Balance ÷ 1.30
```

---

## Bond Formulas

### Current Yield
```
Current Yield = Annual Interest ÷ Market Price

Example:
5% coupon, trading at 95 (950)
CY = $50 ÷ $950 = 5.26%
```

### Yield Relationships
**At Par:** Nominal = Current = YTM
**At Premium:** Nominal > Current > YTM
**At Discount:** Nominal < Current < YTM

Memory aid: **Premium Decreases Yield; Discount Increases Yield**

### Tax-Equivalent Yield
```
TEY = Municipal Yield ÷ (1 - Tax Bracket)

Example:
4% muni, 32% tax bracket
TEY = 0.04 ÷ (1 - 0.32) = 0.04 ÷ 0.68 = 5.88%
```

### Accrued Interest
```
Accrued Interest = (Annual Interest ÷ Days in Year) × Days Since Last Payment

Corporate bonds: 360-day year, 30-day months
Government bonds: Actual days
Municipal bonds: 360-day year, 30-day months
```

---

## Investment Company Formulas

### Net Asset Value (NAV)
```
NAV = (Total Assets - Liabilities) ÷ Shares Outstanding
```

### Public Offering Price (POP)
```
POP = NAV + Sales Charge
POP = NAV ÷ (1 - Sales Charge %)
```

### Sales Charge Percentage
```
Sales Charge % = (POP - NAV) ÷ POP
```

### Maximum Sales Charge
```
Maximum = 8.5% of POP

Can be reduced to:
8.5% - reinvestment = lower max
```

---

## Quick Reference Card

### Options Memory Aids

**Call Up, Put Down:**
- Call ITM when market ABOVE strike
- Put ITM when market BELOW strike

**Breakeven:**
- Calls: Add premium to strike
- Puts: Subtract premium from strike

**Max Loss for Buyers:** Premium paid
**Max Gain for Sellers:** Premium received

### Margin Memory Aids

**SMA × 2 = Buying Power**

**Maintenance Triggers:**
- Long: Debit ÷ 0.75
- Short: Credit ÷ 1.30

### Bond Memory Aids

**PDY / DIY:**
- Premium: Decreases Yield
- Discount: Increases Yield

**Yield Order (Premium):** Nominal > Current > YTM
**Yield Order (Discount):** YTM > Current > Nominal

---

## Critical Numbers

| Item | Number |
|------|--------|
| Options contract size | 100 shares |
| Reg T initial margin | 50% |
| Long maintenance margin | 25% |
| Short maintenance margin | 30% |
| Max mutual fund sales charge | 8.5% |
| Settlement (stocks/bonds) | T+1 |
| Regular IRA contribution limit | $7,000 (2024) |
| 401(k) contribution limit | $23,000 (2024) |

---

*Print this page. Review before the exam. Formulas should be automatic.*
