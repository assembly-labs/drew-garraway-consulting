# Phase 2: My Checkouts & Due Date Management

## Overview
Build the "My Checkouts" page/section that shows currently borrowed items with renewal functionality.

**Estimated Time:** 1 day  
**Priority:** HIGH

---

## Component Specifications

### 2.1 Navigation from Sidebar

**Trigger:**
- User clicks "My Checkouts (3)" in sidebar
- Sidebar auto-closes
- Navigate to `/account/checkouts` route OR show as main content area

---

### 2.2 Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Back                    [Sort ▼] [Filter]│
│                                              │
│  My Checkouts                                │
│  You have 3 items checked out                │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Cover] The Midnight Library          │   │
│  │         by Matt Haig                  │   │
│  │         📕 Physical                   │   │
│  │         Due: Oct 16, 2025 (10 days)   │   │
│  │         [Renew]                       │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Cover] Educated                      │   │
│  │         by Tara Westover              │   │
│  │         🎧 Audiobook                  │   │
│  │         Due: Oct 12, 2025 (6 days)    │   │
│  │         [Renew]                       │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Cover] Atomic Habits                 │   │
│  │         by James Clear                │   │
│  │         📱 eBook                      │   │
│  │         Due: Oct 9, 2025 (3 days)     │   │
│  │         Maximum renewals reached      │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

### 2.3 Component Structure

```
CheckoutsPage
├── Header
│   ├── Back button (returns to main search)
│   ├── Page title: "My Checkouts"
│   ├── Item count: "You have 3 items checked out"
│   └── Controls
│       ├── Sort dropdown
│       └── Filter buttons
├── Checkout List
│   └── CheckoutCard (repeated for each item)
│       ├── Book cover thumbnail
│       ├── Book info
│       │   ├── Title (clickable to book detail)
│       │   ├── Author
│       │   └── Format badge
│       ├── Due date info
│       │   ├── Due date
│       │   ├── Days remaining indicator
│       │   └── Status badge (if overdue/due soon)
│       └── Actions
│           └── Renew button (or disabled message)
└── Empty State (if no checkouts)
```

---

## Mock Data

### Create `/src/data/mockCheckouts.ts`

```typescript
export const mockCheckouts = [
  {
    id: "checkout_001",
    book: {
      id: "book_042",
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/covers/midnight-library.jpg"
    },
    format: "physical",
    checked_out_date: "2025-09-25",
    due_date: "2025-10-16",
    days_remaining: 10,
    renewals_used: 1,
    renewals_max: 3,
    can_renew: true,
    overdue: false
  },
  {
    id: "checkout_002",
    book: {
      id: "book_087",
      title: "Educated",
      author: "Tara Westover",
      cover: "/covers/educated.jpg"
    },
    format: "audiobook",
    checked_out_date: "2025-09-28",
    due_date: "2025-10-12",
    days_remaining: 6,
    renewals_used: 0,
    renewals_max: 3,
    can_renew: true,
    overdue: false
  },
  {
    id: "checkout_003",
    book: {
      id: "book_123",
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/covers/atomic-habits.jpg"
    },
    format: "ebook",
    checked_out_date: "2025-09-12",
    due_date: "2025-10-09",
    days_remaining: 3,
    renewals_used: 3,
    renewals_max: 3,
    can_renew: false,
    overdue: false
  },
  {
    id: "checkout_004",
    book: {
      id: "book_156",
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/covers/hail-mary.jpg"
    },
    format: "physical",
    checked_out_date: "2025-09-01",
    due_date: "2025-10-04",
    days_remaining: -2,
    renewals_used: 2,
    renewals_max: 3,
    can_renew: true,
    overdue: true
  }
];
```

---

## UI Copy & Content

### Page Header
```
Title: "My Checkouts"
Item count (singular): "You have 1 item checked out"
Item count (plural): "You have {n} items checked out"
```

### Empty State
```
Heading: "No items checked out"
Message: "You don't have any items checked out right now. Start exploring our catalog to find something great to read!"
CTA Button: "Browse Catalog"
```

### Due Date Labels
```
Due in future: "Due: Oct 16, 2025 ({n} days)"
Due today: "Due: Today"
Due tomorrow: "Due: Tomorrow"
Overdue: "Overdue by {n} days"
```

### Status Badges
```
Due Soon (yellow): "Due in 3 days or less"
Overdue (red): "Overdue"
No badge for normal items (>3 days remaining)
```

### Renew Button States
```
Available: "Renew"
Processing: "Renewing..."
Success: Show toast "Renewed! New due date: Oct 30, 2025"
Max renewals: "Maximum renewals reached (3/3)"
Error: Show toast "Unable to renew. Please contact the library."
```

### Format Badges
```
physical: "📕 Physical"
ebook: "📱 eBook"
audiobook: "🎧 Audiobook"
```

### Sort Options
```
Dropdown label: "Sort by"
Options:
- Due Date (default)
- Title (A-Z)
- Recently Checked Out
```

### Filter Options
```
Button labels:
- All Formats (default, count: 4)
- Physical (count: 2)
- eBook (count: 1)
- Audiobook (count: 1)
```

---

## Interaction Patterns

### 2.4 Renew Flow

**When user clicks "Renew" button:**

1. **Optimistic Update:**
   - Button shows "Renewing..." with spinner
   - Disable button during process

2. **Simulate API Call:**
   - Use `setTimeout()` for 1-2 second delay
   - Calculate new due date: current due date + 21 days

3. **Success State:**
   - Update due date in UI
   - Update `renewals_used` count
   - Show success toast: "Renewed! New due date: Oct 30, 2025"
   - Button returns to "Renew" state (if renewals remaining)
   - If max renewals now reached: Show "Maximum renewals reached (3/3)"

4. **Error State (simulate 10% of the time):**
   - Show error toast: "Unable to renew this item. Please try again or contact the library."
   - Button returns to "Renew" state

**Code Example:**
```typescript
const handleRenew = async (checkoutId: string) => {
  setRenewing(checkoutId);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 90% success rate
  if (Math.random() > 0.1) {
    // Success
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + 21);
    
    updateCheckout(checkoutId, {
      due_date: newDueDate.toISOString().split('T')[0],
      renewals_used: renewals_used + 1,
      can_renew: renewals_used + 1 < renewals_max
    });
    
    showToast(`Renewed! New due date: ${formatDate(newDueDate)}`);
  } else {
    // Error
    showToast("Unable to renew this item. Please try again.", "error");
  }
  
  setRenewing(null);
};
```

---

### 2.5 Due Date Color Coding

**Visual indicators (not color alone for a11y):**

```typescript
const getDueDateStatus = (daysRemaining: number) => {
  if (daysRemaining < 0) {
    return {
      color: 'red',
      badge: 'Overdue',
      icon: '⚠️',
      label: `Overdue by ${Math.abs(daysRemaining)} days`
    };
  } else if (daysRemaining <= 3) {
    return {
      color: 'yellow',
      badge: 'Due Soon',
      icon: '⏰',
      label: `Due in ${daysRemaining} days`
    };
  } else {
    return {
      color: 'green',
      badge: null,
      icon: '✓',
      label: `Due in ${daysRemaining} days`
    };
  }
};
```

**Important:** Use both color AND text/icons to convey urgency (WCAG compliance)

---

### 2.6 Sort & Filter

**Sort Dropdown:**
- Default: "Due Date" (soonest first)
- Persist selection in component state
- Re-render list when changed

**Filter Buttons:**
- Radio-style buttons (only one active at a time)
- Show count in parentheses: "eBook (2)"
- "All Formats" is default
- Filter client-side (no API call needed)

---

## Accessibility Requirements

### Screen Reader Announcements
```html
<!-- Checkout item -->
<article 
  aria-label="{title} by {author}, {format}, due {date}"
>
  <!-- content -->
</article>

<!-- Renew button -->
<button 
  aria-label="Renew {title}"
  aria-busy={isRenewing ? "true" : "false"}
>
  {isRenewing ? "Renewing..." : "Renew"}
</button>

<!-- Due date with status -->
<div aria-label="Due date: {date}. {status}">
  <span className="sr-only">{status}</span>
  Due: {date} ({daysRemaining} days)
</div>
```

### Keyboard Navigation
- Tab through all checkout cards
- Tab through all renew buttons
- Enter/Space to activate renew button
- Focus management: after renew, focus stays on button
- Escape key closes any modals/toasts

### Focus Indicators
- All interactive elements must have visible focus ring
- Use `focus:ring-2 focus:ring-blue-500` in Tailwind

---

## Visual States

### Loading State
```
┌─────────────────────────────────────────┐
│  My Checkouts                            │
│  Loading your items...                   │
│                                          │
│  [Skeleton Card]                         │
│  [Skeleton Card]                         │
│  [Skeleton Card]                         │
└─────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────┐
│  My Checkouts                            │
│                                          │
│          📚                              │
│                                          │
│  No items checked out                    │
│                                          │
│  You don't have any items checked out    │
│  right now. Start exploring our catalog  │
│  to find something great to read!        │
│                                          │
│  [Browse Catalog]                        │
└─────────────────────────────────────────┘
```

### Success Toast (after renew)
```
┌─────────────────────────────────────────┐
│  ✓ Renewed! New due date: Oct 30, 2025  │
└─────────────────────────────────────────┘
```

### Error Toast (renew failed)
```
┌─────────────────────────────────────────┐
│  ⚠️ Unable to renew this item.          │
│     Please try again or contact library │
└─────────────────────────────────────────┘
```

---

## Badge Count in Sidebar

### Update Sidebar Menu Item

The "My Checkouts" menu item should show live count:

```tsx
<MenuItem 
  label="My Checkouts"
  icon="📚"
  count={mockCheckouts.length}
  href="/account/checkouts"
/>
```

**Display:**
- "My Checkouts (3)" when 3 items
- "My Checkouts" when 0 items (no badge)
- Badge styling: small circle, blue/grey background

---

## TypeScript Types

```typescript
// src/types/checkouts.ts

export interface CheckoutItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
  format: 'physical' | 'ebook' | 'audiobook';
  checked_out_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  days_remaining: number;
  renewals_used: number;
  renewals_max: number;
  can_renew: boolean;
  overdue: boolean;
}

export type SortOption = 'due_date' | 'title' | 'recent';
export type FormatFilter = 'all' | 'physical' | 'ebook' | 'audiobook';
```

---

## Responsive Design

### Mobile (<768px)
- Single column layout
- Stacked book info
- Cover thumbnail: 60px x 90px
- Full-width renew button
- Hide sort/filter in collapsed menu

### Tablet (768px - 1024px)
- Single column layout
- Cover thumbnail: 80px x 120px
- Horizontal layout (cover on left, info on right)
- Inline renew button (right side)

### Desktop (>1024px)
- Same as tablet, with more padding
- Max width: 900px centered
- Cover thumbnail: 100px x 150px

---

## Testing Checklist

**Functionality:**
- [ ] Page displays all checkout items from mock data
- [ ] Item count is accurate
- [ ] Renew button works (shows loading → success toast)
- [ ] Max renewals message shows for items at limit
- [ ] Overdue items display correctly
- [ ] Sort dropdown changes order
- [ ] Filter buttons filter by format
- [ ] Empty state displays when no checkouts
- [ ] Click book title/cover opens book detail (if implemented)

**Accessibility:**
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces all content correctly
- [ ] Focus indicators visible on all interactive elements
- [ ] Due date status conveyed via text, not just color
- [ ] Renew button has descriptive aria-label

**Visual:**
- [ ] Layout responsive on mobile/tablet/desktop
- [ ] Due soon items show yellow badge
- [ ] Overdue items show red badge with warning icon
- [ ] Cover images load (or show placeholder)
- [ ] Format badges display correctly

**Edge Cases:**
- [ ] Single item checkout displays correctly (singular text)
- [ ] Very long book titles don't break layout
- [ ] Missing cover image shows placeholder
- [ ] Rapid clicking renew button doesn't duplicate requests

---

## Implementation Notes for Claude Code

1. **Start with static layout:** Build the CheckoutCard component first with one hardcoded item
2. **Add mock data:** Load from mockCheckouts array and map to components
3. **Implement renew:** Add the button click handler with toast notification
4. **Add sort/filter:** Implement client-side filtering logic
5. **Polish states:** Add loading, empty, and error states
6. **Test accessibility:** Run through keyboard and screen reader testing

---

## Ready to Build Phase 2! 🚀

Give this to Claude Code:

**Prompt:**
"Using the Phase 2 implementation guide, build the My Checkouts page. Include the checkout list with mock data, renew functionality with toasts, sort/filter options, and all the specified UI states. Make it fully keyboard accessible."