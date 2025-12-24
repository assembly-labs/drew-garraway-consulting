# Phase 5: My Reading History & My Fines

## Overview
Build "My Reading History" and "My Fines" pages showing past borrowing activity and outstanding fees.

**Estimated Time:** 0.5 day  
**Priority:** LOW (Nice-to-have for completeness)

---

## Part A: My Reading History

### A.1 Navigation from Sidebar

**Trigger:**
- User clicks "My Reading History" in sidebar under MY ACCOUNT section
- Sidebar auto-closes
- Navigate to `/account/history` route

---

### A.2 Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Back                  [Search] [Filter]   │
│                                              │
│  My Reading History                          │
│  📖 Your reading history is private          │
│                                              │
│  [Sort: Recent ▼]  [Filter: All Formats ▼]  │
│                                              │
│  ━━━ 2025 (5 books) ━━━                     │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Cover] The Midnight Library          │   │
│  │         by Matt Haig                  │   │
│  │         🎧 Audiobook                  │   │
│  │         Checked out: Sep 25, 2025     │   │
│  │         ⭐⭐⭐⭐⭐ (Your rating)       │   │
│  │         [Read Again] [Delete]         │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  [More items from 2025...]                   │
│                                              │
│  ━━━ 2024 (12 books) ━━━                    │
│                                              │
│  [Collapsed - Click to expand]               │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━          │
│  [Delete All History]                        │
└─────────────────────────────────────────────┘
```

---

### A.3 Component Structure

```
ReadingHistoryPage
├── Header
│   ├── Back button
│   ├── Page title: "My Reading History"
│   ├── Privacy notice (collapsible)
│   └── Controls
│       ├── Search box (search by title/author)
│       ├── Sort dropdown
│       └── Format filter
├── History List (grouped by year)
│   └── Year Sections (collapsible)
│       ├── Year header: "2025 (5 books)"
│       └── HistoryCard components
│           ├── Book info
│           ├── Checkout date
│           ├── Star rating (editable)
│           └── Actions (Read Again, Delete)
├── Privacy Controls (footer)
│   ├── Toggle: "Remember my reading history"
│   └── Button: "Delete All History"
└── Empty State
```

---

### A.4 Mock Data

**Create `/src/data/mockHistory.ts`**

```typescript
export const mockReadingHistory = [
  {
    id: "history_001",
    book: {
      id: "book_042",
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/covers/midnight-library.jpg"
    },
    format: "audiobook",
    checked_out_date: "2025-09-25",
    returned_date: "2025-10-05",
    user_rating: 5
  },
  {
    id: "history_002",
    book: {
      id: "book_087",
      title: "Educated",
      author: "Tara Westover",
      cover: "/covers/educated.jpg"
    },
    format: "physical",
    checked_out_date: "2025-08-01",
    returned_date: "2025-08-15",
    user_rating: 5
  },
  {
    id: "history_003",
    book: {
      id: "book_123",
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/covers/atomic-habits.jpg"
    },
    format: "ebook",
    checked_out_date: "2025-07-10",
    returned_date: "2025-07-24",
    user_rating: 4
  },
  {
    id: "history_004",
    book: {
      id: "book_156",
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/covers/hail-mary.jpg"
    },
    format: "physical",
    checked_out_date: "2025-06-05",
    returned_date: "2025-06-20",
    user_rating: 5
  },
  {
    id: "history_005",
    book: {
      id: "book_201",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "/covers/seven-husbands.jpg"
    },
    format: "ebook",
    checked_out_date: "2025-05-15",
    returned_date: "2025-05-29",
    user_rating: 4
  },
  {
    id: "history_006",
    book: {
      id: "book_302",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover: "/covers/sapiens.jpg"
    },
    format: "audiobook",
    checked_out_date: "2024-12-01",
    returned_date: "2024-12-20",
    user_rating: 4
  },
  {
    id: "history_007",
    book: {
      id: "book_305",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      cover: "/covers/silent-patient.jpg"
    },
    format: "physical",
    checked_out_date: "2024-11-10",
    returned_date: "2024-11-25",
    user_rating: 3
  },
  {
    id: "history_008",
    book: {
      id: "book_310",
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      cover: "/covers/crawdads.jpg"
    },
    format: "ebook",
    checked_out_date: "2024-10-15",
    returned_date: "2024-10-30",
    user_rating: 5
  }
];
```

---

### A.5 UI Copy & Content

**Page Header:**
```
Title: "My Reading History"
Privacy notice: "📖 Your reading history is private. Only you can see this list, and you can delete it anytime."
Item count: "You've read {n} books"
```

**Empty State:**
```
Heading: "No reading history yet"
Message: "Your reading history will appear here once you start borrowing books. We'll only track this if you choose to."
Toggle: "Remember my reading history" (currently OFF)
CTA: "Browse Catalog"
Icon: 📚
```

**Year Section Headers:**
```
Format: "━━━ {YEAR} ({count} books) ━━━"
Examples:
- "━━━ 2025 (5 books) ━━━"
- "━━━ 2024 (12 books) ━━━"
Collapsible: Click to expand/collapse
```

**Sort Options:**
```
Dropdown label: "Sort by"
Options:
- Most Recent (default)
- Oldest First
- Title (A-Z)
- Author (A-Z)
- Highest Rated
```

**Format Filter:**
```
Dropdown label: "Filter"
Options:
- All Formats (default)
- Physical Books
- eBooks
- Audiobooks
```

**Star Rating:**
```
Unrated: "Rate this book" (5 empty stars)
Rated: Show filled stars with tooltip "You rated this {n} stars"
Editable: Click stars to change rating
```

**Action Buttons:**
```
"Read Again" - Places hold on the book
"Delete" - Removes from history (confirmation required)
```

**Delete Confirmation Dialog:**
```
Title: "Delete from history?"
Message: "Remove '{book title}' from your reading history? This action cannot be undone."
Buttons: [Delete] [Cancel]
Success toast: "Removed from reading history"
```

**Delete All Confirmation:**
```
Title: "Delete entire reading history?"
Message: "This will permanently delete your entire reading history. This action cannot be undone. Are you absolutely sure?"
Warning: "⚠️ This will delete {n} items"
Buttons: [Delete All History] [Cancel]
Emphasis: Make "Delete All History" button red/destructive
Success toast: "Reading history deleted"
```

**Privacy Toggle:**
```
Label: "Remember my reading history"
Helper text: "When enabled, we'll keep a record of books you've borrowed. You can delete this history anytime."
On state: "✓ Reading history enabled"
Off state: "Reading history disabled"
```

---

### A.6 Interaction Patterns

**Rate a Book:**
```typescript
const handleRating = async (historyId: string, rating: number) => {
  // Optimistic update
  updateHistoryItem(historyId, { user_rating: rating });
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  showToast(`Rated ${rating} stars`);
};
```

**Read Again (Place Hold):**
```typescript
const handleReadAgain = async (bookId: string, title: string) => {
  setPlacingHold(bookId);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Add to holds (if holds system implemented)
  showToast(`Hold placed for '${title}'`);
  setPlacingHold(null);
};
```

**Delete Single Item:**
```typescript
const handleDelete = async (historyId: string, title: string) => {
  const confirmed = await showConfirmDialog({
    title: "Delete from history?",
    message: `Remove '${title}' from your reading history? This action cannot be undone.`,
    confirmText: "Delete",
    confirmStyle: "destructive"
  });
  
  if (confirmed) {
    setDeleting(historyId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    removeHistoryItem(historyId);
    showToast("Removed from reading history");
    setDeleting(null);
  }
};
```

**Delete All History:**
```typescript
const handleDeleteAll = async () => {
  const confirmed = await showConfirmDialog({
    title: "Delete entire reading history?",
    message: `This will permanently delete your entire reading history (${historyCount} items). This action cannot be undone. Are you absolutely sure?`,
    confirmText: "Delete All History",
    confirmStyle: "destructive",
    warning: true
  });
  
  if (confirmed) {
    setDeletingAll(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearAllHistory();
    showToast("Reading history deleted");
    setDeletingAll(false);
  }
};
```

---

## Part B: My Fines

### B.1 Navigation from Sidebar

**Trigger:**
- User clicks "My Fines" in sidebar (shows amount if >$0)
- Sidebar auto-closes
- Navigate to `/account/fines` route

---

### B.2 Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Back                                      │
│                                              │
│  Fines & Fees                                │
│  💳 Total Due: $5.50                         │
│                                              │
│  [Pay All Online]                            │
│                                              │
│  ━━━ CURRENT FINES (2) ━━━                  │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ Late Fee                              │   │
│  │ Where the Crawdads Sing               │   │
│  │                                       │   │
│  │ Due date: Oct 1, 2025                 │   │
│  │ Days overdue: 5                       │   │
│  │ Amount: $2.50                         │   │
│  │                                       │   │
│  │ [Pay This Fine]                       │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ Damaged Item Fee                      │   │
│  │ Atomic Habits                         │   │
│  │                                       │   │
│  │ Description: Water damaged            │   │
│  │ Amount: $3.00                         │   │
│  │                                       │   │
│  │ [Pay This Fine]                       │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ━━━ PAYMENT HISTORY ━━━                    │
│  [Show payment history]                      │
└─────────────────────────────────────────────┘
```

**Zero Balance State:**
```
┌─────────────────────────────────────────────┐
│  Fines & Fees                                │
│                                              │
│          ✅                                  │
│                                              │
│  You have no outstanding fines               │
│                                              │
│  Your account is in good standing.           │
│  Keep up the great library citizenship!      │
└─────────────────────────────────────────────┘
```

---

### B.3 Component Structure

```
FinesPage
├── Header
│   ├── Back button
│   ├── Page title: "Fines & Fees"
│   └── Total due (prominent)
├── Pay All Button (if balance > 0)
├── Current Fines Section
│   └── FineCard components
│       ├── Fine type
│       ├── Book title
│       ├── Details (dates, description)
│       ├── Amount
│       └── Pay button
├── Payment History (collapsible)
│   └── Past payments list
└── Zero Balance State (if no fines)
```

---

### B.4 Mock Data

**Create `/src/data/mockFines.ts`**

```typescript
export const mockFines = [
  {
    id: "fine_001",
    book: {
      id: "book_056",
      title: "Where the Crawdads Sing",
      cover: "/covers/crawdads.jpg"
    },
    fine_type: "late_fee",
    amount: 2.50,
    assessed_date: "2025-10-06",
    due_date: "2025-10-01",
    days_overdue: 5,
    paid: false,
    description: null
  },
  {
    id: "fine_002",
    book: {
      id: "book_123",
      title: "Atomic Habits",
      cover: "/covers/atomic-habits.jpg"
    },
    fine_type: "damaged_item",
    amount: 3.00,
    assessed_date: "2025-10-03",
    due_date: null,
    days_overdue: null,
    paid: false,
    description: "Water damaged - pages wrinkled"
  }
];

export const mockPaymentHistory = [
  {
    id: "payment_001",
    amount: 1.50,
    date: "2025-09-15",
    method: "credit_card",
    items: ["Late fee for 'Educated'"]
  },
  {
    id: "payment_002",
    amount: 5.00,
    date: "2025-08-20",
    method: "credit_card",
    items: ["Late fee for 'Project Hail Mary'", "Processing fee"]
  }
];
```

---

### B.5 UI Copy & Content

**Page Header:**
```
Title: "Fines & Fees"
Total due (>$0): "💳 Total Due: ${total}"
Zero balance: "✅ You have no outstanding fines"
```

**Zero Balance State:**
```
Icon: ✅ (large, green)
Heading: "You have no outstanding fines"
Message: "Your account is in good standing. Keep up the great library citizenship!"
Subtext: "Check your checkout history to stay on top of due dates."
```

**Fine Types:**
```
late_fee: "Late Fee"
damaged_item: "Damaged Item Fee"
lost_item: "Lost Item Replacement"
processing_fee: "Processing Fee"
```

**Fine Card Details:**

**Late Fee:**
```
Type: "Late Fee"
Book: "{title}"
Due date: "Oct 1, 2025"
Days overdue: "5 days"
Amount: "$2.50"
Note: "Return the item to stop additional charges"
```

**Damaged Item:**
```
Type: "Damaged Item Fee"
Book: "{title}"
Description: "{description}"
Amount: "${amount}"
Note: "Contact circulation desk if you have questions"
```

**Lost Item:**
```
Type: "Lost Item Replacement"
Book: "{title}"
Replacement cost: "${amount}"
Note: "If you find the item, return it to void this fee"
```

**Payment Buttons:**
```
"Pay This Fine" - Individual fine
"Pay All Online ($5.50)" - All fines at once
```

**Payment History:**
```
Section header: "━━━ PAYMENT HISTORY ━━━"
Collapsed by default: "[Show payment history]"
Expanded: List of past payments

Payment item format:
"Sep 15, 2025 • $1.50 • Credit Card"
"Late fee for 'Educated'"
```

---

### B.6 Payment Flow (Mock)

**When user clicks "Pay This Fine" or "Pay All Online":**

1. **Show payment modal**
   - Display total amount to pay
   - Mock credit card form (non-functional for prototype)
   - Terms/policies
   - "Submit Payment" button

2. **Payment Modal Content:**
```
┌─────────────────────────────────────────┐
│  Pay Fines                         [X]  │
│                                          │
│  Total Amount: $5.50                     │
│                                          │
│  Payment Method                          │
│  ⦿ Credit Card                          │
│  ○ Debit Card                           │
│                                          │
│  Card Number                             │
│  [____-____-____-____]                  │
│                                          │
│  Expiry Date          CVV                │
│  [MM/YY]              [___]             │
│                                          │
│  Name on Card                            │
│  [_____________________]                │
│                                          │
│  [Cancel] [Submit Payment]               │
└─────────────────────────────────────────┘
```

3. **On Submit:**
   - Show loading state
   - Simulate processing (2 seconds)
   - Show success message
   - Remove paid fines from list
   - Update total due
   - Show zero balance state if all paid

4. **Success Toast:**
```
"✓ Payment received! Your account has been updated."
```

**Code Example:**
```typescript
const handlePayment = async (fineIds: string[], amount: number) => {
  setProcessingPayment(true);
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mark fines as paid
  fineIds.forEach(id => markFinePaid(id));
  
  // Add to payment history
  addPaymentHistory({
    amount,
    date: new Date().toISOString(),
    method: 'credit_card',
    items: fineIds.map(id => getFineDescription(id))
  });
  
  showToast(`Payment received! Your account has been updated.`);
  setProcessingPayment(false);
  closeModal();
};
```

---

### B.7 Accessibility Requirements

**Reading History:**
```html
<!-- History item -->
<article 
  aria-label="{title} by {author}, checked out {date}, rated {rating} stars"
>
  <!-- content -->
</article>

<!-- Star rating -->
<div 
  role="group"
  aria-label="Rate this book"
>
  <button 
    aria-label="Rate 1 star"
    onClick={() => handleRating(1)}
  >
    ⭐
  </button>
  <!-- repeat for 2-5 stars -->
</div>

<!-- Delete all button -->
<button 
  aria-label="Delete all reading history - this action cannot be undone"
  className="destructive"
>
  Delete All History
</button>
```

**Fines:**
```html
<!-- Fine card -->
<article 
  aria-label="{fine_type} for {book}, amount ${amount}"
>
  <!-- content -->
</article>

<!-- Total due -->
<div 
  role="status"
  aria-live="polite"
  aria-label="Total amount due: ${total}"
>
  Total Due: ${total}
</div>

<!-- Payment modal -->
<form aria-label="Payment form">
  <label htmlFor="card-number">
    Card Number <span aria-label="required">*</span>
  </label>
  <input 
    id="card-number"
    type="text"
    required
    aria-required="true"
    aria-describedby="card-help"
  />
</form>
```

---

### B.8 TypeScript Types

```typescript
// src/types/history.ts

export interface ReadingHistoryItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
  format: 'physical' | 'ebook' | 'audiobook';
  checked_out_date: string; // YYYY-MM-DD
  returned_date: string; // YYYY-MM-DD
  user_rating: number; // 0-5, 0 = not rated
}

export type HistorySortOption = 
  | 'recent'
  | 'oldest'
  | 'title'
  | 'author'
  | 'rating';

// src/types/fines.ts

export type FineType = 
  | 'late_fee'
  | 'damaged_item'
  | 'lost_item'
  | 'processing_fee';

export interface Fine {
  id: string;
  book: {
    id: string;
    title: string;
    cover: string;
  };
  fine_type: FineType;
  amount: number;
  assessed_date: string; // YYYY-MM-DD
  due_date?: string; // For late fees
  days_overdue?: number;
  paid: boolean;
  description?: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  date: string; // YYYY-MM-DD
  method: 'credit_card' | 'debit_card' | 'cash' | 'check';
  items: string[]; // Descriptions of what was paid
}

export interface PaymentForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}
```

---

## Testing Checklist

**Reading History:**
- [ ] Page displays all history items
- [ ] Items grouped by year correctly
- [ ] Star rating displays and updates
- [ ] Read Again places hold (or shows appropriate action)
- [ ] Delete single item shows confirmation
- [ ] Delete all shows warning confirmation
- [ ] Search filters items
- [ ] Sort options reorder list
- [ ] Format filter works
- [ ] Empty state displays correctly
- [ ] Privacy toggle works

**Fines:**
- [ ] Page displays all unpaid fines
- [ ] Total calculates correctly
- [ ] Zero balance state displays when no fines
- [ ] Pay single fine shows payment modal
- [ ] Pay all shows payment modal with total
- [ ] Payment processing simulation works
- [ ] Fines removed after payment
- [ ] Payment history displays (if implemented)
- [ ] Fine details show correctly

**Accessibility:**
- [ ] Keyboard navigation works
- [ ] Star rating accessible
- [ ] Screen reader announces totals
- [ ] Confirmation dialogs have proper ARIA
- [ ] Payment form has labels
- [ ] Destructive actions clearly marked

---

## Implementation Notes for Claude Code

**Reading History:**
1. Start with static list of history items
2. Add star rating component (clickable stars)
3. Implement grouping by year
4. Add delete confirmation dialog
5. Add search/filter functionality
6. Add privacy controls at bottom
7. Polish empty state

**Fines:**
1. Start with static list of fines
2. Calculate total due
3. Add zero balance state
4. Create payment modal (mock form)
5. Implement payment simulation
6. Add payment history (optional)
7. Test total updates after payment

**Simplifications for Prototype:**
- Star rating: Just update local state, don't persist
- Read Again: Can show toast instead of actually placing hold
- Payment: Completely mocked - no validation needed
- Payment history: Can be simplified or skipped
- Search: Simple client-side filter by title/author

---

## Ready to Build Phase 5! 🚀

Give this to Claude Code:

**Prompt:**
"Using the Phase 5 implementation guide, build two pages: (1) My Reading History with star ratings, grouping by year, delete functionality, and search/filter options, and (2) My Fines showing outstanding fees with mock payment flow. Use static mock data and make both pages fully keyboard accessible."