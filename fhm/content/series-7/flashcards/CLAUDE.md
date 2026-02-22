# Series 7 Flashcards - Content Management Guide

## Overview

This guide explains how to add, modify, and manage flashcard content for the Series 7 exam
preparation system.

**Data File Location:** `/fhm/assets/data/series-7-flashcards.json` **HTML Page:**
`/fhm/pages/series-7/series-7-flashcards.html`

---

## Quick Start: Adding New Flashcards

When Drew provides content to add as flashcards, follow these steps:

### 1. Read the Current Data File

Always read the existing file first:

```
/fhm/assets/data/series-7-flashcards.json
```

### 2. Determine the Card ID

Card IDs follow this pattern: `s7-XXX` where XXX is a sequential number.

- Look at existing cards to find the highest ID
- Use the next available number

### 3. Add the New Card(s)

Add cards to the `cards` array in the JSON file. Each card must have:

```json
{
  "id": "s7-XXX",
  "front": "Question text here",
  "back": "Answer text here",
  "type": "term|formula|rule|comparison",
  "section": 1-4,
  "subsection": "subsection-id",
  "difficulty": "easy|medium|hard",
  "tags": ["tag1", "tag2"],
  "weight": 1.0
}
```

### 4. Update Metadata

Update the `meta.totalCards` count to reflect the new total.

---

## Card Schema Reference

### Required Fields

| Field        | Type   | Description                                               |
| ------------ | ------ | --------------------------------------------------------- |
| `id`         | string | Unique identifier (format: `s7-XXX`)                      |
| `front`      | string | Question/prompt shown on card front                       |
| `back`       | string | Answer shown on card back                                 |
| `type`       | string | Card type: `term`, `formula`, `rule`, or `comparison`     |
| `section`    | number | FINRA section (1-4)                                       |
| `subsection` | string | Topic subsection ID                                       |
| `difficulty` | string | `easy`, `medium`, or `hard`                               |
| `tags`       | array  | Array of tag strings                                      |
| `weight`     | number | Importance weight (1.0 = normal, higher = more important) |

### Optional Fields

| Field            | Type   | Description                         |
| ---------------- | ------ | ----------------------------------- |
| `memoryAid`      | string | Mnemonic or memory trick            |
| `example`        | string | Worked example for formula cards    |
| `related_lesson` | string | Reference to lesson (e.g., "3.4.2") |

---

## FINRA Section Reference

| Section | Name                   | Exam Weight | Description                                           |
| ------- | ---------------------- | ----------- | ----------------------------------------------------- |
| 1       | Seeks Business         | 9%          | Prospecting, cold calling, DNC rules                  |
| 2       | Opens Accounts         | 11%         | Account types, margin basics, documentation           |
| 3       | Provides Information   | 73%         | Products, recommendations, calculations (THE BIG ONE) |
| 4       | Processes Transactions | 7%          | Order types, settlement, trade processing             |

---

## Subsection IDs

Use these IDs for the `subsection` field:

| Subsection ID          | Section | Topic                 |
| ---------------------- | ------- | --------------------- |
| `prospecting`          | 1       | Prospecting customers |
| `account-types`        | 2       | Account types         |
| `margin-accounts`      | 2       | Margin accounts       |
| `equity-securities`    | 3       | Equity securities     |
| `debt-securities`      | 3       | Debt securities       |
| `options`              | 3       | Options basics        |
| `options-strategies`   | 3       | Options strategies    |
| `options-calculations` | 3       | Options calculations  |
| `municipal-securities` | 3       | Municipal securities  |
| `margin-requirements`  | 3       | Margin requirements   |
| `order-types`          | 4       | Order types           |

---

## Common Tags

Use these tags consistently:

### Importance Tags

- `high-yield` - Frequently tested, must-know
- `exam-critical` - Almost guaranteed on exam

### Topic Tags

- `options`, `margin`, `munis`, `bonds`, `orders`
- `accounts`, `regulations`, `calculations`

### Content Type Tags

- `formula` - Contains calculation
- `comparison` - Compares two concepts
- `rule` - Regulatory requirement

---

## Card Writing Guidelines

### Front (Question)

- Keep questions clear and concise
- Start with action words: "What", "How", "When", "Why"
- For formulas: "How do you calculate [X]?"
- For comparisons: "[A] vs. [B]: What's the key difference?"

### Back (Answer)

- **Lead with the direct answer**
- Add brief explanation only if needed
- For formulas: include the formula AND a quick example
- Keep to 2-3 sentences max

### Memory Aids

- Use mnemonics when natural
- Include word associations
- Reference patterns (e.g., "Call UP, Put DOWN")

---

## Example: Adding Options Cards

Drew says: "Add flashcards for straddle breakeven calculations"

```json
{
  "id": "s7-155",
  "front": "How do you calculate breakeven points for a LONG STRADDLE?",
  "back": "Two breakeven points: Strike + Total Premium and Strike - Total Premium. Stock must move enough in either direction to exceed combined premium cost.",
  "type": "formula",
  "section": 3,
  "subsection": "options-calculations",
  "difficulty": "hard",
  "tags": ["options", "formula", "breakeven", "straddle"],
  "weight": 1.4,
  "memoryAid": "Straddle = 2 breakevens (one up, one down). Add for up, subtract for down.",
  "example": "50 strike straddle, $3 call + $2 put = $5 total. BEs = $55 and $45"
}
```

---

## Weight Guidelines

| Weight  | Meaning        | Use For                                  |
| ------- | -------------- | ---------------------------------------- |
| 0.6-0.8 | Lower priority | Nice-to-know, less frequently tested     |
| 1.0     | Normal         | Standard exam content                    |
| 1.2-1.3 | Important      | Commonly tested topics                   |
| 1.4-1.5 | High priority  | Must-know, frequently tested, high-yield |

---

## Validation Checklist

Before saving changes, verify:

- [ ] Card ID is unique and follows `s7-XXX` format
- [ ] Both `front` and `back` are non-empty strings
- [ ] `section` is a number 1-4
- [ ] `subsection` matches one of the defined subsections
- [ ] `difficulty` is `easy`, `medium`, or `hard`
- [ ] `tags` is an array (even if empty: `[]`)
- [ ] `weight` is a positive number
- [ ] JSON is valid (no trailing commas, proper quotes)
- [ ] `meta.totalCards` is updated

---

## File Structure

```
fhm/
├── assets/
│   ├── data/
│   │   └── series-7-flashcards.json    # Main data file
│   └── js/
│       └── flashcards/
│           ├── series7-flashcard-data.js   # Data loader
│           ├── series7-flashcard-ui.js     # UI module
│           ├── flashcard-progress.js       # Progress tracking (shared)
│           └── flashcard-session.js        # Session management (shared)
├── pages/
│   └── series-7/
│       └── series-7-flashcards.html    # Flashcard page
└── content/
    └── series-7/
        └── flashcards/
            └── CLAUDE.md               # This file
```

---

## Testing Changes

After adding cards:

1. Run `npm run dev` from the `/fhm` directory
2. Navigate to the Series 7 flashcards page
3. Verify new cards appear in the session
4. Test flip and swipe functionality
5. Check that memory aids display on card back

---

## Related Documentation

- **Brand Voice:** `/fhm/design/brand/brand-voice.md`
- **Series 7 Framework:** `/fhm/content/series-7/CLAUDE.md`
- **SIE Flashcards (reference):** `/fhm/assets/data/flashcards.json`
