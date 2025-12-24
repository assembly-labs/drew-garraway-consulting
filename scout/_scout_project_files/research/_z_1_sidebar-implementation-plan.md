# Librarian LLM - Sidebar Implementation Plan

## Phase 1: Sidebar Structure & Digital Library Card Modal
**Priority: HIGH | Estimated Time: 1 day**

### 1.1 Collapsible Sidebar Component

**Description:**
- Create a collapsible sidebar that slides in from the left
- Toggle button (hamburger menu ☰) in the top-left of the app header
- Sidebar should overlay the main content on mobile, push content on desktop (>768px)
- Smooth animation (300ms ease-in-out)
- Close on overlay click (mobile) or stay open (desktop)

**Component Structure:**
```
Sidebar
├── Header (logo/app name)
├── Search shortcut (optional - link back to main search)
├── MY ACCOUNT section
│   ├── Digital Library Card (clickable)
│   ├── My Checkouts (with badge count)
│   ├── My Reading History
│   ├── My Holds (with badge count)
│   └── My Fines (with amount)
├── EVENTS section
│   └── Events Calendar
└── Footer (Settings, Help links)
```

**Accessibility Requirements:**
- `role="navigation"` on sidebar
- `aria-label="Main menu"` 
- Trap focus when open (keyboard users can't tab to content behind sidebar)
- Escape key closes sidebar
- Focus management: when opening, focus first menu item; when closing, return focus to hamburger button

**States:**
- Open/Closed (controlled by parent App component)
- Active menu item (highlight current section)

---

### 1.2 Digital Library Card Modal

**Description:**
- Opens when user clicks "Digital Library Card" in sidebar
- Full-screen modal on mobile, centered card modal on desktop
- Shows a realistic library card design with:
  - Patron information
  - Barcode
  - Card number
  - Expiration date
  - Library logo/branding
- "Close" button (X in top-right)
- "Download Card" button (shows toast: "Feature coming soon!")

**Modal Structure:**
```
Modal Overlay (dark, 50% opacity)
└── Card Container
    ├── Close Button (top-right)
    ├── Library Logo/Name
    ├── Card Visual
    │   ├── Patron Name
    │   ├── Card Number
    │   ├── Barcode Image/SVG
    │   └── Expiration Date
    └── Action Buttons
        ├── Download Card (mock)
        └── Add to Apple Wallet (mock)
```

**Accessibility Requirements:**
- `role="dialog"` and `aria-modal="true"`
- `aria-labelledby="modal-title"`
- Focus trap within modal
- Escape key closes modal
- Focus management: return focus to "Digital Library Card" menu item on close

**Interaction:**
- Click overlay to close (optional)
- Escape key to close
- X button to close
- Prevent background scrolling when modal open

---

## Phase 2: My Checkouts & Due Date Management
**Priority: HIGH | Estimated Time: 1 day**

### 2.1 My Checkouts Page/Section

**Description:**
- Clicking "My Checkouts" navigates to a dedicated page OR expands inline in sidebar (your choice)
- Shows list of currently checked out items
- Each item displays:
  - Cover thumbnail
  - Title & Author
  - Format badge (📕 Print | 📱 eBook | 🎧 Audiobook)
  - Due date (with color coding: green if >7 days, yellow if 3-7 days, red if <3 days)
  - "Renew" button
  - Days remaining indicator
- Empty state if no checkouts

**Layout:**
- List view (not grid) for better scannability
- Sort options: "Due Date" (default) | "Title" | "Recently Checked Out"
- Filter by format (All, Physical, eBook, Audiobook)

**Interactions:**
- **Renew button:** Shows success toast "Renewed until [new date]" and updates due date
- **Max renewals:** Some items show "Maximum renewals reached" (disabled button)
- **Item click:** Opens book detail modal (similar to search results)

**Accessibility:**
- Each checkout item is a `<article>` with proper heading structure
- Due date urgency conveyed via text, not just color ("Due in 2 days" vs just red)
- Renew button has descriptive label: "Renew [Book Title]"

---

### 2.2 Badge Counts

**Description:**
- Show live counts next to "My Checkouts" and "My Holds" in sidebar
- Badge styling: small circle with number, colored background
- Updates when items are renewed, holds placed, etc.

**Examples:**
- "My Checkouts (3)"
- "My Holds (2)"
- "My Fines ($5.50)" - only show if > $0

---

## Phase 3: My Holds & Waitlist Management
**Priority: MEDIUM | Estimated Time: 0.5 day**

### 3.1 My Holds Page/Section

**Description:**
- Similar layout to My Checkouts
- Shows items on hold (reserved for user)
- Each item displays:
  - Cover thumbnail
  - Title & Author
  - Format badge
  - Status: "Ready for pickup" | "Position #3 in line"
  - Estimated availability: "Available in ~2 weeks"
  - "Cancel Hold" button
  - "Freeze Hold" button (optional - for when patron is traveling)
- Group by status: "Ready Now" section at top, "Waiting" section below

**Statuses:**
```
Ready for Pickup (green badge)
- "Expires in 3 days" countdown
- "Check Out Now" button (if eBook/audiobook)
- "I'll pick it up" confirmation (if physical)

In Queue (yellow badge)
- Position in line: "#3 of 12"
- Estimated wait: "~2 weeks"
- "Cancel Hold" button

Coming Soon (blue badge)
- "Not yet released - Available March 15, 2026"
- "Notify me" toggle
```

**Interactions:**
- **Cancel Hold:** Confirmation dialog → Remove from list → Show toast "Hold cancelled"
- **Check Out Now (digital):** Opens in OverDrive/Libby (show toast: "Opening in Libby app...")
- **Freeze Hold:** Shows date picker modal → Confirm → Update status to "Frozen until [date]"

---

## Phase 4: Events Calendar Integration
**Priority: MEDIUM | Estimated Time: 1 day**

### 4.1 Events Calendar View

**Description:**
- Opens as a dedicated page or modal
- Shows upcoming library events (story time, book clubs, author talks, workshops)
- Calendar view (month grid) + List view toggle
- Filter by: Event Type | Branch Location | Age Group
- Each event card shows:
  - Event title
  - Date & time
  - Location (branch name + room)
  - Brief description (1-2 lines)
  - Registration status: "Open" | "Waitlist" | "Full"
  - "Register" or "Add to Calendar" button

**Event Types (for filtering):**
- 📚 Book Clubs
- 👶 Children's Programs
- 🎨 Workshops & Classes
- 🎤 Author Events
- 💻 Technology Training
- 🎭 Cultural Events

**Calendar View:**
- Show current month by default
- Navigate prev/next month
- Events displayed as dots/badges on dates (click to see list)
- Color-coded by event type

**List View:**
- Chronological order (soonest first)
- Group by date: "Today" | "This Week" | "This Month" | "Later"
- Infinite scroll or pagination

**Interactions:**
- **Register button:** 
  - If open: Show registration form modal (name, email, # of attendees)
  - If waitlist: "Join Waitlist" confirmation
  - If full: Disabled with tooltip "Event is full"
- **Add to Calendar:** Downloads .ics file OR shows "Copy to clipboard" for event details

---

## Phase 5: My Reading History & My Fines
**Priority: LOW | Estimated Time: 0.5 day**

### 5.1 My Reading History

**Description:**
- Chronological list of books user has checked out (completed/returned)
- Privacy note at top: "Your reading history is private. You can delete it anytime."
- Each item shows:
  - Cover thumbnail
  - Title & Author
  - Date checked out
  - Format
  - Star rating (user can add retrospectively)
  - "Read Again" button (places hold if not owned)
- Search/filter: by year, format, genre, rating
- "Delete History" button (confirmation required)

**Empty State:**
- "Your reading history is empty. Start borrowing books to see them here!"
- "Search for books" CTA button

**Privacy Controls:**
- Toggle: "Remember my reading history" (on by default)
- "Delete All History" button with scary confirmation dialog
- "Delete This Item" on individual items

---

### 5.2 My Fines

**Description:**
- Shows current outstanding fines/fees
- Each fine displays:
  - Item title that caused fine
  - Fine type: "Late fee" | "Lost item replacement" | "Damaged item"
  - Amount
  - Date assessed
  - "Pay Online" button (mock)
- Total due at top (bold, prominent)
- Payment history accordion (expandable past payments)

**Fine Types:**
```
Late Fee
- Item: "Where the Crawdads Sing"
- Due date: Oct 1, 2025
- Days overdue: 5 days
- Amount: $2.50

Lost Item
- Item: "Educated"
- Replacement cost: $28.00
- Option to return item and void fee (if found)

Damaged Item
- Item: "Atomic Habits"
- Damage description: "Water damaged"
- Amount: $12.00
```

**Payment Flow (Mock):**
- Click "Pay Online" → Payment modal
- Show credit card form (non-functional)
- "Submit Payment" button → Success toast "Payment processed!" → Remove fine from list

**Zero Balance State:**
- "You have no outstanding fines. 🎉"
- "Your account is in good standing."

---

## Content Assets for Claude Code

### Copy/Microcopy

**Digital Library Card Modal:**
```
Title: "Your Digital Library Card"
Patron Name: "Alex Johnson" (randomize from list)
Card Number: "2491-3847-5820-1163"
Expiration: "Valid through December 2026"
Library Name: "Anytown Public Library"
Download Button: "Save to Device"
Apple Wallet Button: "Add to Apple Wallet"
Toast on click: "Feature coming soon in production!"
```

**My Checkouts:**
```
Page Title: "My Checkouts"
Empty State: "You don't have any items checked out. Search for something great to read!"
Due Soon Warning: "Due in 2 days"
Overdue Warning: "Overdue by 3 days"
Renew Success Toast: "Renewed! New due date: [date]"
Max Renewals Message: "This item has reached maximum renewals (3/3)"
```

**My Holds:**
```
Page Title: "My Holds"
Empty State: "You don't have any holds. Place a hold on popular titles to reserve them!"
Ready Status: "✅ Ready for pickup at Main Branch"
Queue Status: "You're #3 of 12 in line"
Estimated Wait: "Estimated wait: ~2 weeks"
Cancel Confirmation: "Are you sure you want to cancel this hold? You'll lose your place in line."
```

**Events Calendar:**
```
Page Title: "Upcoming Events"
Filter Label: "Filter by event type"
No Events Message: "No upcoming events match your filters. Check back soon!"
Registration Success: "You're registered! A confirmation email has been sent."
Waitlist Joined: "You've been added to the waitlist. We'll notify you if a spot opens up."
```

**My Reading History:**
```
Page Title: "My Reading History"
Privacy Notice: "📖 Your reading history is private. Only you can see this list, and you can delete it anytime."
Delete Confirmation: "Are you sure? This will permanently delete your entire reading history. This action cannot be undone."
Empty State: "Start your reading journey! Borrow books to build your history."
```

**My Fines:**
```
Page Title: "Fines & Fees"
Total Due Label: "Total Due:"
Zero Balance: "🎉 You have no outstanding fines! Your account is in good standing."
Late Fee Label: "Late Return Fee"
Lost Item Label: "Lost Item Replacement"
Payment Success: "Payment received! Your account has been updated."
```

---

### Mock Data Structures

**Checkout Item:**
```json
{
  "id": "checkout_001",
  "book_id": "book_042",
  "title": "The Midnight Library",
  "author": "Matt Haig",
  "cover": "/covers/midnight-library.jpg",
  "format": "physical",
  "checked_out_date": "2025-09-25",
  "due_date": "2025-10-16",
  "renewals_used": 1,
  "renewals_max": 3,
  "can_renew": true,
  "overdue": false
}
```

**Hold Item:**
```json
{
  "id": "hold_001",
  "book_id": "book_087",
  "title": "Tomorrow, and Tomorrow, and Tomorrow",
  "author": "Gabrielle Zevin",
  "cover": "/covers/tomorrow.jpg",
  "format": "ebook",
  "status": "waiting",
  "position": 3,
  "queue_length": 12,
  "estimated_wait": "~2 weeks",
  "placed_date": "2025-09-20",
  "ready_date": null
}
```

**Event:**
```json
{
  "id": "event_001",
  "title": "Mystery Book Club",
  "description": "Join us for a discussion of 'The Thursday Murder Club' by Richard Osman.",
  "date": "2025-10-20",
  "time": "18:00",
  "duration_minutes": 90,
  "location": "Main Branch - Community Room",
  "event_type": "book_club",
  "age_group": "adult",
  "capacity": 20,
  "registered": 12,
  "registration_status": "open",
  "image": "/events/book-club.jpg"
}
```

**Reading History Item:**
```json
{
  "id": "history_001",
  "book_id": "book_023",
  "title": "Educated",
  "author": "Tara Westover",
  "cover": "/covers/educated.jpg",
  "format": "audiobook",
  "checked_out_date": "2025-08-01",
  "returned_date": "2025-08-15",
  "user_rating": 5
}
```

**Fine:**
```json
{
  "id": "fine_001",
  "book_id": "book_056",
  "title": "Where the Crawdads Sing",
  "fine_type": "late_fee",
  "amount": 2.50,
  "assessed_date": "2025-10-06",
  "days_overdue": 5,
  "paid": false
}
```

---

## Implementation Order Recommendation

1. **Phase 1** (Start here): Sidebar + Digital Library Card modal - Gets the navigation structure in place
2. **Phase 2**: My Checkouts - Most frequently used feature
3. **Phase 3**: My Holds - Natural next step after checkouts
4. **Phase 4**: Events Calendar - Demonstrates community engagement
5. **Phase 5**: Reading History + Fines - Nice-to-haves for completeness

---

## Technical Notes for Claude Code

**State Management:**
- Store sidebar open/closed state in App.tsx
- Store mock user data (checkouts, holds, etc.) in a custom hook `useUserAccount.ts`
- Use React Context if data needs to be shared across many components

**Routing:**
- If using React Router, create routes for each section:
  - `/account/card`
  - `/account/checkouts`
  - `/account/holds`
  - `/account/history`
  - `/account/fines`
  - `/events`
- OR use modal/drawer approach for everything (simpler for prototype)

**Animation Libraries:**
- Framer Motion for smooth sidebar slide-in/out
- OR CSS transitions if keeping it lightweight

**Accessibility Testing:**
- Test with keyboard only (no mouse)
- Test with screen reader (VoiceOver on Mac, NVDA on Windows)
- Ensure all interactive elements have visible focus states

---

## Design Decisions (Finalized)

✅ **Sidebar behavior:** Auto-closes after any menu item selection (mobile AND desktop)
✅ **Date calculations:** Static/hardcoded dates - no dynamic calculation needed for demo
✅ **Events:** Generic mock events (not real library data)
✅ **Library branding:** Generic "Anytown Public Library" with simple placeholder styling

---

## Ready to Implement!

You can now give these specifications to Claude Code to build each phase. Start with Phase 1 for the sidebar foundation.

**Example prompt for Claude Code:**
"Using the Sidebar Implementation Plan artifact, implement Phase 1: Create the collapsible sidebar component and Digital Library Card modal. The sidebar should auto-close after any selection. Use static dates (no dynamic calculations needed). Keep library branding generic."

🚀