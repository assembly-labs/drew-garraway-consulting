# Phase 4: Events Calendar Integration

## Overview
Build the "Events Calendar" page showing upcoming library events with registration functionality.

**Estimated Time:** 1 day  
**Priority:** MEDIUM

---

## Component Specifications

### 4.1 Navigation from Sidebar

**Trigger:**
- User clicks "Events Calendar" in sidebar under EVENTS section
- Sidebar auto-closes
- Navigate to `/events` route OR show as main content area

---

### 4.2 Page Layout

```
┌─────────────────────────────────────────────┐
│  ← Back              [List View] [Calendar]  │
│                                              │
│  Events Calendar                             │
│  Upcoming programs and activities            │
│                                              │
│  [Filter: All Events ▼] [Location: All ▼]   │
│                                              │
│  ━━━ THIS WEEK ━━━                          │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ OCT 10 • 6:00 PM                     │   │
│  │                                      │   │
│  │ 📚 Mystery Book Club                │   │
│  │ Discussion of "The Thursday Murder   │   │
│  │ Club" by Richard Osman              │   │
│  │                                      │   │
│  │ 📍 Main Branch - Community Room     │   │
│  │ 👥 12 registered • Spots available  │   │
│  │                                      │   │
│  │ [Register]                          │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ━━━ THIS MONTH ━━━                         │
│                                              │
│  [More event cards...]                       │
│                                              │
│  ━━━ LATER ━━━                              │
│                                              │
│  [More event cards...]                       │
└─────────────────────────────────────────────┘
```

---

### 4.3 Component Structure

```
EventsPage
├── Header
│   ├── Back button
│   ├── Page title: "Events Calendar"
│   ├── Subtitle: "Upcoming programs and activities"
│   └── View toggle: List / Calendar
├── Filters
│   ├── Event Type dropdown
│   └── Location dropdown
├── Event List (List View - default)
│   ├── THIS WEEK section
│   ├── THIS MONTH section
│   └── LATER section
│       └── EventCard components
└── Calendar View (alternative)
    ├── Month navigation (< October 2025 >)
    ├── Calendar grid
    └── Event details sidebar/modal
```

**EventCard Component:**
```
EventCard
├── Date/Time badge
├── Event icon (based on type)
├── Event title
├── Short description (2 lines max)
├── Location info
│   ├── Branch name
│   └── Room (if applicable)
├── Registration info
│   ├── Spots available / Waitlist / Full
│   └── Number registered
└── Action button
    ├── Register (if open)
    ├── Join Waitlist (if waitlist)
    └── Full (if full - disabled)
```

---

## Mock Data

### Create `/src/data/mockEvents.ts`

```typescript
export const mockEvents = [
  {
    id: "event_001",
    title: "Mystery Book Club",
    description: "Join us for a lively discussion of 'The Thursday Murder Club' by Richard Osman. Perfect for fans of cozy mysteries!",
    date: "2025-10-10",
    time: "18:00",
    duration_minutes: 90,
    location: {
      branch: "Main Branch",
      room: "Community Room"
    },
    event_type: "book_club",
    age_group: "adult",
    capacity: 20,
    registered: 12,
    registration_status: "open",
    image: "/events/book-club.jpg",
    facilitator: "Sarah Johnson, Librarian"
  },
  {
    id: "event_002",
    title: "Toddler Story Time",
    description: "Songs, stories, and fun for children ages 2-4 and their caregivers. No registration required!",
    date: "2025-10-12",
    time: "10:30",
    duration_minutes: 30,
    location: {
      branch: "Main Branch",
      room: "Children's Area"
    },
    event_type: "children",
    age_group: "toddler",
    capacity: 25,
    registered: 0,
    registration_status: "drop_in",
    image: "/events/story-time.jpg",
    facilitator: null
  },
  {
    id: "event_003",
    title: "Introduction to Excel",
    description: "Learn the basics of Microsoft Excel including formulas, formatting, and creating charts. Bring your laptop or use ours.",
    date: "2025-10-15",
    time: "14:00",
    duration_minutes: 120,
    location: {
      branch: "Main Branch",
      room: "Computer Lab"
    },
    event_type: "technology",
    age_group: "adult",
    capacity: 12,
    registered: 12,
    registration_status: "full",
    image: "/events/tech-training.jpg",
    facilitator: "Mike Chen, Technology Specialist"
  },
  {
    id: "event_004",
    title: "Author Talk: Jane Smith",
    description: "Local author Jane Smith discusses her new novel 'The River's Edge' followed by Q&A and book signing.",
    date: "2025-10-18",
    time: "19:00",
    duration_minutes: 60,
    location: {
      branch: "Main Branch",
      room: "Auditorium"
    },
    event_type: "author_event",
    age_group: "adult",
    capacity: 100,
    registered: 87,
    registration_status: "open",
    image: "/events/author-talk.jpg",
    facilitator: "Jane Smith, Author"
  },
  {
    id: "event_005",
    title: "Crafternoon: Fall Decorations",
    description: "Create beautiful autumn decorations using natural materials. All supplies provided. Ages 8+",
    date: "2025-10-20",
    time: "15:00",
    duration_minutes: 90,
    location: {
      branch: "West Branch",
      room: "Craft Studio"
    },
    event_type: "workshop",
    age_group: "family",
    capacity: 15,
    registered: 14,
    registration_status: "waitlist",
    image: "/events/craft.jpg",
    facilitator: "Emily Rodriguez, Program Coordinator"
  },
  {
    id: "event_006",
    title: "Chess Club",
    description: "Weekly chess meetup for players of all skill levels. Learn strategies and compete in friendly matches.",
    date: "2025-10-23",
    time: "18:30",
    duration_minutes: 120,
    location: {
      branch: "East Branch",
      room: "Meeting Room"
    },
    event_type: "recreation",
    age_group: "all_ages",
    capacity: 20,
    registered: 8,
    registration_status: "open",
    image: "/events/chess.jpg",
    facilitator: null
  },
  {
    id: "event_007",
    title: "Teen Anime & Manga Club",
    description: "Discuss your favorite anime and manga, watch new series, and make friends who share your interests!",
    date: "2025-10-25",
    time: "16:00",
    duration_minutes: 60,
    location: {
      branch: "Main Branch",
      room: "Teen Lounge"
    },
    event_type: "teen_program",
    age_group: "teen",
    capacity: 20,
    registered: 15,
    registration_status: "open",
    image: "/events/anime-club.jpg",
    facilitator: null
  },
  {
    id: "event_008",
    title: "Local History Lecture Series",
    description: "Explore the fascinating history of our town from 1850-1950. Presented by local historian Dr. Robert Williams.",
    date: "2025-11-05",
    time: "18:00",
    duration_minutes: 75,
    location: {
      branch: "Main Branch",
      room: "Auditorium"
    },
    event_type: "lecture",
    age_group: "adult",
    capacity: 50,
    registered: 23,
    registration_status: "open",
    image: "/events/history-lecture.jpg",
    facilitator: "Dr. Robert Williams, Historian"
  },
  {
    id: "event_009",
    title: "Preschool STEM Exploration",
    description: "Hands-on science activities for ages 3-5. This week: exploring magnets! Caregiver participation required.",
    date: "2025-11-08",
    time: "10:00",
    duration_minutes: 45,
    location: {
      branch: "West Branch",
      room: "Activity Room"
    },
    event_type: "children",
    age_group: "preschool",
    capacity: 15,
    registered: 10,
    registration_status: "open",
    image: "/events/stem-kids.jpg",
    facilitator: "Amanda Lee, Children's Librarian"
  },
  {
    id: "event_010",
    title: "Knitting Circle",
    description: "Bring your current project or start something new. All skill levels welcome. Share patterns and techniques!",
    date: "2025-11-12",
    time: "13:00",
    duration_minutes: 120,
    location: {
      branch: "East Branch",
      room: "Community Space"
    },
    event_type: "craft",
    age_group: "adult",
    capacity: 12,
    registered: 9,
    registration_status: "open",
    image: "/events/knitting.jpg",
    facilitator: null
  }
];
```

---

## UI Copy & Content

### Page Header
```
Title: "Events Calendar"
Subtitle: "Upcoming programs and activities"
Alternative subtitle: "Discover programs, classes, and community events"
```

### View Toggle
```
List View (default): "List"
Calendar View: "Calendar"
```

### Empty State
```
Heading: "No upcoming events"
Message: "Check back soon for new programs and activities!"
Alternative: "We're planning exciting events. Check back in a few days!"
Icon: 📅
```

### Section Headers (List View)
```
THIS WEEK: Events within next 7 days
THIS MONTH: Events 8-30 days away
LATER: Events more than 30 days away

Format: "━━━ THIS WEEK ━━━" (with emoji-style dividers)
```

### Event Type Icons
```
book_club: 📚
children: 👶
teen_program: 🎮
technology: 💻
workshop: 🎨
author_event: 🎤
lecture: 🎓
craft: ✂️
recreation: ⚽
all_ages: 👨‍👩‍👧‍👦
```

### Registration Status Labels
```
open: "Spots available"
waitlist: "Waitlist available"
full: "Event full"
drop_in: "Drop-in (no registration)"
```

### Registration Info Format
```
Open event: "{registered} registered • Spots available"
Nearly full (>75%): "{registered}/{capacity} registered • Few spots left"
Waitlist: "{registered}/{capacity} registered • Waitlist available"
Full: "Event full ({capacity}/{capacity})"
Drop-in: "Drop-in event • No registration needed"
```

### Action Buttons
```
Open: "Register"
Waitlist: "Join Waitlist"
Full: "Event Full" (disabled)
Drop-in: "Add to Calendar"
```

### Filter Labels
```
Event Type Dropdown:
- All Events (default)
- 📚 Book Clubs
- 👶 Children's Programs
- 🎮 Teen Programs
- 💻 Technology Classes
- 🎨 Workshops & Crafts
- 🎤 Author Events
- 🎓 Lectures

Location Dropdown:
- All Branches (default)
- Main Branch
- East Branch
- West Branch
- North Branch
```

### Registration Dialog
```
Title: "Register for {event title}"
Subtitle: "{date} at {time}"

Form fields:
- Name (required)
- Email (required)
- Phone (optional)
- Number of attendees (1-4, if applicable)
- Special accommodations (textarea, optional)

Terms:
"By registering, you agree to our event policies."

Buttons:
- Register
- Cancel

Success message:
"You're registered for {event title}! A confirmation email has been sent to {email}."
```

### Waitlist Dialog
```
Title: "Join Waitlist"
Message: "This event is currently full. We'll notify you if a spot opens up."

Form fields:
- Name (required)
- Email (required)
- Phone (optional)

Buttons:
- Join Waitlist
- Cancel

Success message:
"You've been added to the waitlist for {event title}. We'll email you if a spot becomes available."
```

### Calendar View (Month Grid)
```
Month navigation: "< October 2025 >"
Today button: "Today"
Event indicators: Small dots/badges on dates with events
Click date: Show events for that day in sidebar/modal
```

---

## Interaction Patterns

### 4.4 Event Registration Flow

**When user clicks "Register" button:**

1. **Show registration modal**
   - Display event details (title, date, time)
   - Registration form with required fields
   - Terms checkbox (optional for prototype)
   - "Register" and "Cancel" buttons

2. **If user submits form:**
   - Validate required fields
   - Show loading state
   - Simulate API delay (1-2 seconds)
   - Close modal
   - Show success toast
   - Update event card: increment registered count
   - Change button to "Registered ✓" (disabled)

3. **If user cancels:**
   - Close modal
   - No changes

**Code Example:**
```typescript
const handleRegister = async (eventId: string, formData: RegistrationForm) => {
  setRegistering(true);
  
  // Validate
  if (!formData.name || !formData.email) {
    showToast("Please fill in all required fields", "error");
    return;
  }
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Update event
  updateEvent(eventId, {
    registered: event.registered + (formData.attendees || 1),
    userRegistered: true
  });
  
  showToast(`You're registered for ${event.title}! Confirmation sent to ${formData.email}`);
  setRegistering(false);
  closeModal();
};
```

---

### 4.5 Waitlist Flow

**When user clicks "Join Waitlist":**

1. **Show waitlist modal**
   - Explain waitlist process
   - Simple form (name, email, phone)
   - "Join Waitlist" and "Cancel" buttons

2. **If user submits:**
   - Validate email
   - Show loading state
   - Simulate API delay (1 second)
   - Close modal
   - Show success toast
   - Change button to "On Waitlist ✓" (disabled)

**Code Example:**
```typescript
const handleJoinWaitlist = async (eventId: string, email: string) => {
  setJoiningWaitlist(true);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  updateEvent(eventId, {
    userOnWaitlist: true
  });
  
  showToast(`You've been added to the waitlist for ${event.title}`);
  setJoiningWaitlist(false);
  closeModal();
};
```

---

### 4.6 Calendar View Toggle

**When user clicks "Calendar" view toggle:**

1. **Switch layout** from list to calendar grid
2. **Show month grid** with current month (October 2025)
3. **Mark dates** that have events with small colored dots
4. **Click on date** to see events for that day

**For prototype simplicity:**
- Use a simple month grid layout
- Show colored dots for dates with events
- Click date opens a modal/sidebar with that day's events
- OR just keep list view and make calendar view a "coming soon" state

**Code Example (Simplified):**
```typescript
const EventCalendarView = ({ events }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const eventsOnDate = events.filter(e => 
    e.date === formatDate(selectedDate)
  );
  
  return (
    <div className="calendar-grid">
      {/* Month header */}
      <MonthNavigation />
      
      {/* Calendar grid */}
      <CalendarGrid 
        events={events}
        onDateClick={setSelectedDate}
      />
      
      {/* Selected date events */}
      {selectedDate && (
        <EventsSidebar 
          date={selectedDate}
          events={eventsOnDate}
        />
      )}
    </div>
  );
};
```

---

### 4.7 Filtering Events

**Event Type Filter:**
- Dropdown with event type options
- Filter events client-side by `event_type` field
- Update visible events list
- Show count: "Showing 5 events"

**Location Filter:**
- Dropdown with branch locations
- Filter by `location.branch` field
- Can combine with event type filter

**Code Example:**
```typescript
const [filterType, setFilterType] = useState<string>('all');
const [filterLocation, setFilterLocation] = useState<string>('all');

const filteredEvents = mockEvents.filter(event => {
  const typeMatch = filterType === 'all' || event.event_type === filterType;
  const locationMatch = filterLocation === 'all' || event.location.branch === filterLocation;
  return typeMatch && locationMatch;
});
```

---

### 4.8 Event Grouping (List View)

**Group events by time period:**

```typescript
const groupEventsByPeriod = (events: Event[]) => {
  const today = new Date();
  const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  return {
    thisWeek: events.filter(e => new Date(e.date) <= oneWeek),
    thisMonth: events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate > oneWeek && eventDate <= oneMonth;
    }),
    later: events.filter(e => new Date(e.date) > oneMonth)
  };
};
```

---

## Accessibility Requirements

### Screen Reader Announcements

```html
<!-- Event card -->
<article 
  aria-label="{title} on {date} at {time}, {location}, {registration_status}"
>
  <!-- content -->
</article>

<!-- Registration button -->
<button 
  aria-label="Register for {title}"
  aria-describedby="event-capacity-{id}"
>
  Register
</button>
<span id="event-capacity-{id}" className="sr-only">
  {registered} of {capacity} spots filled
</span>

<!-- Full event -->
<button 
  disabled
  aria-label="Event full - {title}"
>
  Event Full
</button>

<!-- View toggle -->
<div role="tablist" aria-label="View options">
  <button 
    role="tab"
    aria-selected={view === 'list'}
    aria-controls="events-list"
  >
    List
  </button>
  <button 
    role="tab"
    aria-selected={view === 'calendar'}
    aria-controls="events-calendar"
  >
    Calendar
  </button>
</div>
```

### Registration Form Accessibility

```html
<form aria-label="Event registration form">
  <label htmlFor="reg-name">
    Name <span aria-label="required">*</span>
  </label>
  <input 
    id="reg-name"
    type="text"
    required
    aria-required="true"
  />
  
  <label htmlFor="reg-email">
    Email <span aria-label="required">*</span>
  </label>
  <input 
    id="reg-email"
    type="email"
    required
    aria-required="true"
    aria-describedby="email-help"
  />
  <span id="email-help" className="help-text">
    We'll send confirmation to this email
  </span>
</form>
```

### Keyboard Navigation
- Tab through all event cards
- Tab through all action buttons
- Arrow keys navigate calendar dates (if calendar view)
- Enter/Space to activate buttons
- Escape closes modals
- Focus trap in registration modal

---

## Visual States

### Loading State
```
┌─────────────────────────────────────────┐
│  Events Calendar                         │
│  Loading events...                       │
│                                          │
│  [Skeleton Card]                         │
│  [Skeleton Card]                         │
│  [Skeleton Card]                         │
└─────────────────────────────────────────┘
```

### Empty State (No Events)
```
┌─────────────────────────────────────────┐
│  Events Calendar                         │
│                                          │
│          📅                              │
│                                          │
│  No upcoming events                      │
│                                          │
│  Check back soon for new programs        │
│  and activities!                         │
└─────────────────────────────────────────┘
```

### Empty State (Filtered - No Results)
```
┌─────────────────────────────────────────┐
│  Events Calendar                         │
│  [Filter: Book Clubs ▼] [All Branches]  │
│                                          │
│  No events match your filters            │
│                                          │
│  Try adjusting your filters or check     │
│  back later for new programs.            │
│                                          │
│  [Clear Filters]                         │
└─────────────────────────────────────────┘
```

### Registration Modal
```
┌─────────────────────────────────────────┐
│  Register for Mystery Book Club    [X]  │
│  October 10, 2025 at 6:00 PM            │
│                                          │
│  Name *                                  │
│  [__________________]                    │
│                                          │
│  Email *                                 │
│  [__________________]                    │
│  We'll send confirmation to this email   │
│                                          │
│  Phone (optional)                        │
│  [__________________]                    │
│                                          │
│  Number of attendees                     │
│  [1 ▼] (1-4)                            │
│                                          │
│  [Cancel] [Register]                     │
└─────────────────────────────────────────┘
```

### Success Toast (Registration)
```
┌─────────────────────────────────────────┐
│  ✓ You're registered for Mystery Book   │
│    Club! Confirmation sent.              │
└─────────────────────────────────────────┘
```

### Nearly Full Badge
```
Event card with badge:
┌──────────────────────────────────────┐
│ OCT 10 • 6:00 PM        [⚠️ NEARLY FULL]│
│ ...                                  │
└──────────────────────────────────────┘
```

---

## TypeScript Types

```typescript
// src/types/events.ts

export type EventType = 
  | 'book_club'
  | 'children'
  | 'teen_program'
  | 'technology'
  | 'workshop'
  | 'author_event'
  | 'lecture'
  | 'craft'
  | 'recreation'
  | 'all_ages';

export type AgeGroup = 
  | 'toddler'
  | 'preschool'
  | 'child'
  | 'teen'
  | 'adult'
  | 'family'
  | 'all_ages';

export type RegistrationStatus = 
  | 'open'
  | 'waitlist'
  | 'full'
  | 'drop_in';

export interface LibraryEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24-hour)
  duration_minutes: number;
  location: {
    branch: string;
    room?: string;
  };
  event_type: EventType;
  age_group: AgeGroup;
  capacity: number;
  registered: number;
  registration_status: RegistrationStatus;
  image?: string;
  facilitator?: string;
  
  // Client-side state (not from API)
  userRegistered?: boolean;
  userOnWaitlist?: boolean;
}

export interface RegistrationForm {
  name: string;
  email: string;
  phone?: string;
  attendees?: number;
  accommodations?: string;
}

export type EventView = 'list' | 'calendar';

export interface EventFilters {
  eventType: string;
  location: string;
}
```

---

## Responsive Design

### Mobile (<768px)
- Single column event cards
- Full-width cards
- Stacked event info
- Hide event images (or small thumbnail)
- Filters collapse into menu

### Tablet (768px - 1024px)
- Two-column grid
- Show event images
- Side-by-side filters

### Desktop (>1024px)
- Three-column grid OR two-column with sidebar
- Large event images
- Calendar view more usable
- Max width: 1200px

---

## Calendar View Specifications (Optional)

If implementing full calendar view:

### Calendar Grid Layout
```
   October 2025
< SUN MON TUE WED THU FRI SAT >
    29  30   1   2   3   4   5
     6   7   8   9  10• 11  12•
    13  14  15• 16  17  18• 19
    20• 21  22  23• 24  25• 26
    27  28  29  30  31   1   2
```

**Indicators:**
- Blue dot: 1 event
- Orange dot: 2-3 events
- Red dot: 4+ events

**Click behavior:**
- Click date: Show events in sidebar OR open modal
- Click dot: Same behavior
- Keyboard: Arrow keys navigate dates, Enter to select

**For Prototype Simplicity:**
- Can skip full calendar view
- OR use a simple library like `react-calendar`
- Focus on list view as primary experience

---

## Testing Checklist

**Functionality:**
- [ ] Page displays all events from mock data
- [ ] Events grouped by time period correctly
- [ ] Event type filter works
- [ ] Location filter works
- [ ] Combined filters work
- [ ] Register button shows modal
- [ ] Registration form validates
- [ ] Registration updates event card
- [ ] Waitlist button works
- [ ] Full events show disabled button
- [ ] Drop-in events show correct messaging
- [ ] View toggle switches between list/calendar
- [ ] Empty states display correctly

**Accessibility:**
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces event details
- [ ] Registration form has proper labels
- [ ] Focus management in modals
- [ ] Required fields marked clearly

**Visual:**
- [ ] Responsive on mobile/tablet/desktop
- [ ] Event type icons display
- [ ] Registration status badges correct
- [ ] Nearly full events highlighted
- [ ] Event images load (or placeholders)
- [ ] Filters styled correctly

**Edge Cases:**
- [ ] Single event displays correctly
- [ ] No events shows empty state
- [ ] Filtered to zero events shows message
- [ ] Very long event titles don't break layout
- [ ] Past events can be hidden/shown
- [ ] Registration at capacity shows waitlist

---

## Implementation Notes for Claude Code

**Implementation Order:**
1. **Static list view:** Build EventCard component with hardcoded event
2. **Add mock data:** Load mockEvents and map to cards
3. **Event grouping:** Implement THIS WEEK / THIS MONTH / LATER sections
4. **Registration modal:** Add registration dialog with form
5. **Filters:** Implement event type and location dropdowns
6. **Polish states:** Empty states, loading, success toasts
7. **Calendar view (optional):** Add if time allows, or mark "coming soon"
8. **Test accessibility**

**Simplifications for Prototype:**
- Registration: Just show modal, don't persist anywhere
- Calendar view: Can skip or use simple library
- Images: Use placeholders or icons if needed
- Date/time: Static formatting, no timezone handling

---

## Ready to Build Phase 4! 🚀

Give this to Claude Code:

**Prompt:**
"Using the Phase 4 implementation guide, build the Events Calendar page with list view (default), event grouping by time period, registration modal with form validation, event type and location filters, and all specified UI states. Use static mock data with 10 diverse events and make it fully keyboard accessible."