# Phase 3: My Holds & Waitlist Management

## Overview
Build the "My Holds" page/section that shows items on hold with queue position, cancel/freeze functionality.

**Estimated Time:** 0.5 day  
**Priority:** MEDIUM

---

## Component Specifications

### 3.1 Navigation from Sidebar

**Trigger:**
- User clicks "My Holds (2)" in sidebar
- Sidebar auto-closes
- Navigate to `/account/holds` route OR show as main content area

---

### 3.2 Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Back                           [Filter]   │
│                                              │
│  My Holds                                    │
│  You have 2 items on hold                    │
│                                              │
│  ━━━ READY FOR PICKUP (1) ━━━               │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Cover] The Seven Husbands of...     │   │
│  │         by Taylor Jenkins Reid        │   │
│  │         📱 eBook                      │   │
│  │         ✅ Ready for pickup           │   │
│  │         Expires in 3 days             │   │
│  │         [Check Out Now]               │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ━━━ WAITING (1) ━━━                        │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ [Cover] Tomorrow, and Tomorrow...     │   │
│  │         by Gabrielle Zevin            │   │
│  │         📕 Physical                   │   │
│  │         You're #3 of 12 in line       │   │
│  │         Estimated wait: ~2 weeks      │   │
│  │         [Cancel Hold] [Freeze Hold]   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

### 3.3 Component Structure

```
HoldsPage
├── Header
│   ├── Back button
│   ├── Page title: "My Holds"
│   ├── Item count: "You have 2 items on hold"
│   └── Filter button (by status)
├── Holds List (grouped by status)
│   ├── Ready Section (collapsed if empty)
│   │   ├── Section header: "READY FOR PICKUP"
│   │   └── HoldCard components
│   ├── Waiting Section
│   │   ├── Section header: "WAITING"
│   │   └── HoldCard components
│   └── Coming Soon Section (collapsed if empty)
│       ├── Section header: "COMING SOON"
│       └── HoldCard components
└── Empty State (if no holds)
```

**HoldCard Component:**
```
HoldCard
├── Book cover thumbnail
├── Book info
│   ├── Title (clickable)
│   ├── Author
│   └── Format badge
├── Status info
│   ├── Status badge
│   ├── Status details (queue position / expiry / release date)
│   └── Estimated wait (if applicable)
└── Actions
    ├── Primary action (Check Out / I'll Pick It Up)
    └── Secondary actions (Cancel / Freeze / Notify Me)
```

---

## Mock Data

### Create `/src/data/mockHolds.ts`

```typescript
export const mockHolds = [
  {
    id: "hold_001",
    book: {
      id: "book_201",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      cover: "/covers/seven-husbands.jpg"
    },
    format: "ebook",
    status: "ready",
    placed_date: "2025-09-15",
    ready_date: "2025-10-03",
    expiry_date: "2025-10-09",
    days_until_expiry: 3,
    position: null,
    queue_length: null,
    estimated_wait: null
  },
  {
    id: "hold_002",
    book: {
      id: "book_202",
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      cover: "/covers/tomorrow.jpg"
    },
    format: "physical",
    status: "waiting",
    placed_date: "2025-09-20",
    ready_date: null,
    expiry_date: null,
    days_until_expiry: null,
    position: 3,
    queue_length: 12,
    estimated_wait: "~2 weeks"
  },
  {
    id: "hold_003",
    book: {
      id: "book_203",
      title: "Holly",
      author: "Stephen King",
      cover: "/covers/holly.jpg"
    },
    format: "audiobook",
    status: "waiting",
    placed_date: "2025-09-25",
    ready_date: null,
    expiry_date: null,
    days_until_expiry: null,
    position: 1,
    queue_length: 8,
    estimated_wait: "~1 week"
  },
  {
    id: "hold_004",
    book: {
      id: "book_204",
      title: "The Women",
      author: "Kristin Hannah",
      cover: "/covers/the-women.jpg"
    },
    format: "physical",
    status: "coming_soon",
    placed_date: "2025-10-01",
    ready_date: null,
    expiry_date: null,
    days_until_expiry: null,
    position: null,
    queue_length: null,
    estimated_wait: null,
    release_date: "2026-03-15"
  }
];
```

---

## UI Copy & Content

### Page Header
```
Title: "My Holds"
Item count (singular): "You have 1 item on hold"
Item count (plural): "You have {n} items on hold"
Zero items: "You have no holds"
```

### Section Headers
```
Ready: "READY FOR PICKUP ({count})"
Waiting: "WAITING ({count})"
Coming Soon: "COMING SOON ({count})"

Hide section if count is 0
```

### Empty State
```
Heading: "No holds yet"
Message: "You don't have any holds. Place a hold on popular titles to reserve them when they become available!"
CTA Button: "Browse Catalog"
Icon: 📚
```

### Status Details

**Ready for Pickup:**
```
Status badge: "✅ Ready for pickup"
Physical book: "Available at Main Branch. Expires in {n} days"
eBook/Audiobook: "Available to check out now. Expires in {n} days"
Expiring today: "Expires today!"
Expiring tomorrow: "Expires tomorrow"
```

**Waiting (In Queue):**
```
Status badge: "⏳ In queue"
Position (first): "You're next in line!"
Position (other): "You're #{position} of {total} in line"
Estimated wait: "Estimated wait: {time}"
Time options: "~1 week" | "~2 weeks" | "~3 weeks" | "~1 month" | "~2 months"
```

**Coming Soon (Not Yet Released):**
```
Status badge: "📅 Coming soon"
Details: "Not yet released. Available {date}"
Date format: "March 15, 2026"
Note: "We'll notify you when it's available"
```

### Action Buttons

**Ready Status (eBook/Audiobook):**
```
Primary: "Check Out Now"
Secondary: "Cancel Hold"
```

**Ready Status (Physical):**
```
Primary: "I'll Pick It Up" (just acknowledges, optional feature)
Secondary: "Cancel Hold"
```

**Waiting Status:**
```
Primary: "Cancel Hold"
Secondary: "Freeze Hold"
```

**Coming Soon Status:**
```
Primary: "Cancel Hold"
Secondary: "Notify Me" (toggle on/off)
```

### Confirmation Dialogs

**Cancel Hold:**
```
Title: "Cancel this hold?"
Message: "Are you sure you want to cancel your hold on '{book title}'? You'll lose your place in line."
Buttons: [Cancel Hold] [Keep Hold]
```

**Freeze Hold:**
```
Title: "Freeze hold for '{book title}'"
Message: "Your hold will be paused until the date you choose. You won't lose your place in line."
Date Picker: [Select date]
Note: "Maximum freeze: 60 days"
Buttons: [Freeze Hold] [Cancel]
Success Toast: "Hold frozen until {date}"
```

**Check Out Now (Digital):**
```
Toast: "Opening in Libby app..."
Note: In real implementation, this would deep link to OverDrive/Libby
For prototype: Show toast and remove from holds list
```

**Cancel Success:**
```
Toast: "Hold cancelled for '{book title}'"
```

---

## Interaction Patterns

### 3.4 Cancel Hold Flow

**When user clicks "Cancel Hold":**

1. **Show confirmation dialog**
   - Display book title in message
   - Two options: "Cancel Hold" (destructive) or "Keep Hold" (safe)

2. **If user confirms:**
   - Close dialog
   - Show loading state on card
   - Simulate API delay (1 second)
   - Remove item from holds list
   - Show success toast
   - Update badge count in sidebar

3. **If user cancels:**
   - Close dialog
   - No changes

**Code Example:**
```typescript
const handleCancelHold = async (holdId: string, bookTitle: string) => {
  const confirmed = await showConfirmDialog({
    title: "Cancel this hold?",
    message: `Are you sure you want to cancel your hold on '${bookTitle}'? You'll lose your place in line.`,
    confirmText: "Cancel Hold",
    confirmStyle: "destructive"
  });
  
  if (confirmed) {
    setCancelling(holdId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    removeHold(holdId);
    showToast(`Hold cancelled for '${bookTitle}'`);
    setCancelling(null);
  }
};
```

---

### 3.5 Freeze Hold Flow

**When user clicks "Freeze Hold":**

1. **Show freeze dialog modal**
   - Title: "Freeze hold for '{book title}'"
   - Date picker (minimum: tomorrow, maximum: 60 days from now)
   - Helper text about not losing position
   - "Freeze Hold" and "Cancel" buttons

2. **If user confirms with date:**
   - Close dialog
   - Update hold status to "frozen" (visually grayed out)
   - Add "Frozen until {date}" badge
   - Show success toast
   - Change action button to "Unfreeze Hold"

3. **For prototype simplicity:**
   - Just show the modal with date picker
   - On confirm, show success toast
   - Optionally update UI to show frozen state
   - Don't implement full freeze/unfreeze logic

**Code Example:**
```typescript
const handleFreezeHold = async (holdId: string, bookTitle: string) => {
  const result = await showFreezeDatePicker({
    title: `Freeze hold for '${bookTitle}'`,
    minDate: tomorrow,
    maxDate: sixtyDaysFromNow
  });
  
  if (result.confirmed) {
    setFreezing(holdId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In full implementation: update hold with freeze date
    showToast(`Hold frozen until ${formatDate(result.date)}`);
    setFreezing(null);
  }
};
```

---

### 3.6 Check Out Now (Digital Items)

**When user clicks "Check Out Now" on ready eBook/audiobook:**

1. **Show loading toast:** "Opening in Libby app..."
2. **Simulate delay:** 1-2 seconds
3. **Remove from holds list**
4. **Show success toast:** "Checked out! Enjoy your book."
5. **Update badge count**

**Note:** In production, this would deep link to OverDrive/Libby. For prototype, just simulate the action.

---

### 3.7 Queue Position Updates

**Visual indicators for position:**

```typescript
const getPositionMessage = (position: number, total: number) => {
  if (position === 1) {
    return {
      message: "You're next in line! 🎉",
      color: "green",
      estimate: "Available soon"
    };
  } else if (position <= 3) {
    return {
      message: `You're #${position} of ${total} in line`,
      color: "yellow",
      estimate: "~1 week"
    };
  } else {
    return {
      message: `You're #${position} of ${total} in line`,
      color: "gray",
      estimate: `~${Math.ceil(position / 2)} weeks`
    };
  }
};
```

---

### 3.8 Expiration Warnings

**For "Ready" items, show urgency:**

```typescript
const getExpiryWarning = (daysRemaining: number) => {
  if (daysRemaining === 0) {
    return {
      message: "Expires today!",
      color: "red",
      urgent: true,
      icon: "⚠️"
    };
  } else if (daysRemaining === 1) {
    return {
      message: "Expires tomorrow",
      color: "orange",
      urgent: true,
      icon: "⏰"
    };
  } else if (daysRemaining <= 3) {
    return {
      message: `Expires in ${daysRemaining} days`,
      color: "yellow",
      urgent: false,
      icon: "⏰"
    };
  } else {
    return {
      message: `Expires in ${daysRemaining} days`,
      color: "gray",
      urgent: false,
      icon: null
    };
  }
};
```

---

## Accessibility Requirements

### Screen Reader Announcements

```html
<!-- Hold item -->
<article 
  aria-label="{title} by {author}, {format}, {status detail}"
>
  <!-- content -->
</article>

<!-- Ready item -->
<article 
  aria-label="{title} ready for pickup, expires in {n} days"
>
  <!-- content -->
</article>

<!-- Waiting item -->
<article 
  aria-label="{title} in queue, position {n} of {total}, estimated wait {time}"
>
  <!-- content -->
</article>

<!-- Action buttons -->
<button aria-label="Cancel hold for {title}">
  Cancel Hold
</button>

<button aria-label="Freeze hold for {title}">
  Freeze Hold
</button>

<!-- Status badge -->
<span 
  className="status-badge"
  role="status"
  aria-label="Status: {status text}"
>
  {icon} {status}
</span>
```

### Confirmation Dialogs

```html
<div
  role="alertdialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Cancel this hold?</h2>
  <p id="dialog-description">
    Are you sure you want to cancel your hold on '{title}'?
    You'll lose your place in line.
  </p>
  <button>Cancel Hold</button>
  <button>Keep Hold</button>
</div>
```

### Keyboard Navigation
- Tab through all hold cards
- Tab through all action buttons
- Enter/Space to activate buttons
- Escape closes dialogs
- Focus returns to triggering element after dialog closes

---

## Visual States

### Loading State
```
┌─────────────────────────────────────────┐
│  My Holds                                │
│  Loading your holds...                   │
│                                          │
│  [Skeleton Card]                         │
│  [Skeleton Card]                         │
└─────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────┐
│  My Holds                                │
│                                          │
│          📚                              │
│                                          │
│  No holds yet                            │
│                                          │
│  You don't have any holds. Place a hold │
│  on popular titles to reserve them when │
│  they become available!                  │
│                                          │
│  [Browse Catalog]                        │
└─────────────────────────────────────────┘
```

### Section Collapsed (if empty)
```
Ready section with 0 items: Hide completely
Waiting section with 2 items: Show with header
Coming Soon section with 0 items: Hide completely
```

### Cancelling State
```
┌──────────────────────────────────────┐
│ [Cover] Tomorrow, and Tomorrow...    │
│         Cancelling...                │
│         [Grey overlay]               │
└──────────────────────────────────────┘
```

### Success Toast (cancel)
```
┌─────────────────────────────────────────┐
│  ✓ Hold cancelled for 'Tomorrow, and...'│
└─────────────────────────────────────────┘
```

### Freeze Hold Dialog
```
┌─────────────────────────────────────────┐
│  Freeze hold for 'Tomorrow, and...'     │
│                                          │
│  Your hold will be paused until the     │
│  date you choose. You won't lose your   │
│  place in line.                          │
│                                          │
│  [Date Picker: Select date]             │
│  Maximum freeze: 60 days                 │
│                                          │
│  [Cancel] [Freeze Hold]                  │
└─────────────────────────────────────────┘
```

---

## Badge Count in Sidebar

### Update Sidebar Menu Item

The "My Holds" menu item should show live count:

```tsx
<MenuItem 
  label="My Holds"
  icon="⏰"
  count={mockHolds.length}
  href="/account/holds"
/>
```

**Display:**
- "My Holds (2)" when 2 items
- "My Holds" when 0 items (no badge)

---

## TypeScript Types

```typescript
// src/types/holds.ts

export type HoldStatus = 'ready' | 'waiting' | 'coming_soon' | 'frozen';

export interface HoldItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
  };
  format: 'physical' | 'ebook' | 'audiobook';
  status: HoldStatus;
  placed_date: string; // YYYY-MM-DD
  
  // Ready status fields
  ready_date?: string; // YYYY-MM-DD
  expiry_date?: string; // YYYY-MM-DD
  days_until_expiry?: number;
  
  // Waiting status fields
  position?: number;
  queue_length?: number;
  estimated_wait?: string;
  
  // Coming soon fields
  release_date?: string; // YYYY-MM-DD
  
  // Frozen fields (optional)
  frozen_until?: string; // YYYY-MM-DD
}

export interface CancelHoldConfirmation {
  holdId: string;
  bookTitle: string;
}

export interface FreezeHoldRequest {
  holdId: string;
  bookTitle: string;
  freezeUntil: string; // YYYY-MM-DD
}
```

---

## Responsive Design

### Mobile (<768px)
- Single column layout
- Stacked book info
- Cover thumbnail: 60px x 90px
- Full-width action buttons
- Stack buttons vertically if multiple

### Tablet (768px - 1024px)
- Single column layout
- Horizontal layout (cover left, info right)
- Cover thumbnail: 80px x 120px
- Inline action buttons

### Desktop (>1024px)
- Max width: 900px centered
- Cover thumbnail: 100px x 150px
- More padding/spacing

---

## Filter Options (Optional Enhancement)

If implementing filter button:

```
Filter Options:
- All Holds (default)
- Ready for Pickup
- In Queue
- Coming Soon
```

**Implementation:**
- Radio buttons or segmented control
- Client-side filtering (no API call)
- Update visible sections dynamically

---

## Testing Checklist

**Functionality:**
- [ ] Page displays all holds from mock data
- [ ] Holds grouped by status correctly
- [ ] Item count is accurate
- [ ] Cancel hold shows confirmation dialog
- [ ] Cancel hold removes item and shows toast
- [ ] Freeze hold shows date picker dialog
- [ ] Check Out Now (digital) removes item
- [ ] Empty sections are hidden
- [ ] Empty state displays when no holds
- [ ] Badge count in sidebar updates

**Accessibility:**
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces status correctly
- [ ] Focus management in dialogs
- [ ] Confirmation dialogs have proper ARIA
- [ ] Status conveyed via text, not just color

**Visual:**
- [ ] Responsive on mobile/tablet/desktop
- [ ] Ready items show expiry warning
- [ ] Queue position displays correctly
- [ ] Status badges have correct colors/icons
- [ ] Loading state during actions

**Edge Cases:**
- [ ] Single hold displays correctly
- [ ] Very long titles don't break layout
- [ ] Position #1 shows special "next in line" message
- [ ] Expiring today shows urgent warning
- [ ] Missing cover shows placeholder

---

## Implementation Notes for Claude Code

**Implementation Order:**
1. **Static layout first:** Build HoldCard with one hardcoded item
2. **Add mock data:** Load mockHolds and group by status
3. **Section rendering:** Implement collapsible sections
4. **Cancel flow:** Add confirmation dialog and removal
5. **Freeze flow:** Add date picker dialog (can be simplified)
6. **Check Out flow:** Add for digital items
7. **Polish states:** Empty state, loading, toasts
8. **Test accessibility**

**Simplifications for Prototype:**
- Freeze hold: Can show dialog but not fully implement frozen state
- Check Out Now: Just remove from list, don't actually integrate with Libby
- Date picker: Use native HTML date input or simple third-party component
- Position updates: Static, not dynamic

---

## Ready to Build Phase 3! 🚀

Give this to Claude Code:

**Prompt:**
"Using the Phase 3 implementation guide, build the My Holds page. Include holds grouped by status (ready/waiting/coming soon), cancel hold with confirmation dialog, freeze hold dialog, and check out functionality for digital items. Use static mock data and make it keyboard accessible."