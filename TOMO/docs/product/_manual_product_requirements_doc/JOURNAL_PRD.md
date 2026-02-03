# Journal Page PRD

**Last Updated:** January 25, 2026
**Status:** Draft
**Component:** `SessionHistory.tsx`, `JournalEntryCard.tsx`, `SessionDetail.tsx`

---

## Overview

The Journal page is the browsable history of all training sessions. Unlike Session Logging (exhausted user, 90-second window), the Journal is accessed in **relaxed browsing mode**—users have time, patience, and want depth.

### User Context

| Attribute | Value |
|-----------|-------|
| **User State** | Relaxed (at home, commuting) |
| **Time Tolerance** | Unlimited |
| **Cognitive Load** | Can handle complexity |
| **Primary Task** | Review, reflect, find patterns |
| **Touch Targets** | Standard 44px minimum |

### Jobs to Be Done

1. **Browse recent sessions** — Quick glance at what I've trained lately
2. **Find a specific session** — "What did I work on last Thursday?"
3. **Review patterns over time** — "How consistent have I been?"
4. **Edit a past entry** — Correct or enrich details I captured
5. **Delete a mistaken entry** — Remove duplicates or errors
6. **Add a forgotten session** — Backdate an entry I forgot to log

---

## First Principles Alignment

| Principle | Application to Journal |
|-----------|------------------------|
| #1 Reflection | Browse view surfaces patterns, enables monthly reflection |
| #10 Two States | This is RELAXED browsing—rich data, exploration encouraged |
| #9 Specificity | Show concrete data, not vague summaries |
| #11 Flashlight | Display training history without judgment or prescription |

---

## Current State vs. Proposed

| Aspect | Current State | Proposed State |
|--------|---------------|----------------|
| Visible entries | 6 max (prototype limit) | Unlimited (infinite scroll) |
| Date access | Today/Yesterday/This Week/Earlier | Month groupings with sticky headers |
| Delete entry | Not available | Via detail view overflow menu |
| Backdate entry | Not available | "Add Past Session" option |
| UI consistency | Gap between Review Phase and Journal | Aligned visual language |

---

## Feature Specifications

### 1. Entry Browsing (Infinite Scroll)

**Problem:** Users cannot access sessions older than ~1 week. Current "See More" button is non-functional.

**Solution:** Infinite scroll with intelligent grouping and lazy loading.

#### Grouping Logic

```
TODAY
└── [entries from today]

YESTERDAY
└── [entries from yesterday]

THIS WEEK
└── [entries from this week, excluding today/yesterday]

THIS MONTH (if different from this week)
└── [remaining entries from current month]

DECEMBER 2025
└── [all entries from that month, grouped by week if >7]

NOVEMBER 2025
└── [entries...]

... continues to earliest entry
```

#### Implementation Details

| Requirement | Specification |
|-------------|---------------|
| Initial load | 10 entries |
| Load more threshold | 200px from bottom |
| Load increment | 10 more entries |
| Month dividers | Sticky header during scroll |
| Empty months | Skip (don't show "0 sessions" placeholders) |
| Loading indicator | Skeleton cards (existing `Skeleton` component) |
| End of list | "You've reached the beginning" message |

#### Visual Design

```
┌─────────────────────────────────────┐
│ [Log Session]                       │  ← Primary CTA (gold)
│ 47 sessions logged · 142 rounds     │  ← Stats summary
│ [Add past session]                  │  ← Secondary link (gray)
├─────────────────────────────────────┤
│ [All] [Gi] [No-Gi]                  │  ← Filter pills
├─────────────────────────────────────┤
│ TODAY                               │  ← Sticky group header
│ ┌─────────────────────────────────┐ │
│ │ Card: Today's session           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ YESTERDAY                           │
│ ┌─────────────────────────────────┐ │
│ │ Card: Yesterday's session       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ JANUARY 2026                        │  ← Month divider
│ ┌─────────────────────────────────┐ │
│ │ Card: Older session             │ │
│ └─────────────────────────────────┘ │
│ ... (infinite scroll continues)    │
└─────────────────────────────────────┘
```

#### Edge Cases

| Scenario | Behavior |
|----------|----------|
| No entries | Empty state (belt-specific message + Log Session CTA) |
| Filter applied, no matches | "No [Gi/No-Gi] sessions found" with clear filter link |
| Network error during load | "Couldn't load more sessions. Tap to retry." |
| Very old entries (>1 year) | Show year in month header: "January 2024" |

---

### 2. Single-Entry Operations

#### 2.1 View Session Detail

**Trigger:** Tap any entry card in the list

**Behavior:** Opens `SessionDetail.tsx` with full session data

**Current:** Already implemented and working

---

#### 2.2 Edit Session

**Trigger:** Tap "Edit" button in SessionDetail header

**Behavior:**
- Gold border appears indicating edit mode
- Sections become tappable
- Bottom sheets open for each section
- Changes are staged until explicit Save/Discard

**Current:** Already implemented and working

**One Addition:** Add date/time editing capability

| Field | Current | Proposed |
|-------|---------|----------|
| Date | Display only | Editable (date picker, limited to past only) |
| Time | Display only | Editable (time picker) |

**Rationale:** Users may log at the wrong time or want to correct the date after the fact.

**Date Editing Rules:**
- Cannot set future dates
- Date picker shows last 90 days by default
- Changing date moves entry to correct position in history
- Confirmation: "Move this session to [new date]?"

---

#### 2.3 Delete Session

**Status:** NOT IMPLEMENTED - New feature

**User Story:** As a user, I want to delete an entry I logged by mistake (duplicate, test entry, wrong session).

**Access Point:** Overflow menu (···) in SessionDetail header

**Flow:**

```
SessionDetail Header
┌──────────────────────────────────────────────┐
│ [← Back]                     [Edit] [···]    │
└──────────────────────────────────────────────┘
                                    ↓
                               ┌─────────────┐
                               │ Share       │
                               │ Export      │
                               │ ─────────── │
                               │ Delete      │  ← Red text
                               └─────────────┘
                                    ↓
                         ┌─────────────────────┐
                         │ DELETE SESSION?     │
                         │                     │
                         │ This will           │
                         │ permanently delete  │
                         │ this training       │
                         │ session from your   │
                         │ journal.            │
                         │                     │
                         │ [Cancel] [Delete]   │  ← Delete is red
                         └─────────────────────┘
                                    ↓
                         Returns to Journal with
                         toast: "Session deleted"
```

**Implementation Notes:**

| Requirement | Specification |
|-------------|---------------|
| Confirmation | Always required (destructive action) |
| Delete button color | `var(--color-negative)` (#ef4444) |
| After delete | Navigate back to Journal page |
| Toast | "Session deleted" (info style, not success) |
| Undo | Not supported (too complex for MVP) |
| Data behavior | Soft delete (keep in database with `deleted_at` timestamp) |

**Why no swipe-to-delete in list?**
- Accidental deletion risk too high
- Conflicts with potential swipe-to-edit gestures
- Delete should be deliberate, not quick

---

#### 2.4 Add Past Session (Backdating)

**Status:** NOT IMPLEMENTED - New feature

**User Story:** As a user, I want to log a session I forgot to log earlier (yesterday, last week).

**Access Point:** Secondary link below "Log Session" button

**Visual Design:**

```
┌─────────────────────────────────────┐
│ [Log Session]                       │  ← Primary (today's training)
│ 47 sessions logged · 142 rounds     │
│ Add a past session                  │  ← Subtle text link
└─────────────────────────────────────┘
```

**Flow:**

```
Tap "Add a past session"
         ↓
┌─────────────────────────────────────┐
│ WHEN DID YOU TRAIN?                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Date Picker]                   │ │
│ │ Showing: Last 30 days           │ │
│ │ Format: Scrolling calendar      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Cancel]              [Continue →]  │
└─────────────────────────────────────┘
         ↓
Standard VoiceFirstLogger flow
(with selected date pre-filled, not today)
         ↓
Session saved with correct historical date
```

**Date Picker Design:**

| Requirement | Specification |
|-------------|---------------|
| Date range | Last 30 days (expandable to 90 if needed) |
| Future dates | Blocked (grayed out, non-selectable) |
| Today | Shown but grayed out ("Use 'Log Session' for today") |
| Default selection | Yesterday |
| Format | Calendar month view with dots on existing training days |
| Visual hint | Days with existing sessions show small dot indicator |

**Why only 30 days?**
- Memory degrades significantly after 2-3 weeks
- If user needs to add sessions from months ago, they're probably doing data cleanup (different use case)
- Keeps UI simple and focused

**Why show existing session dots?**
- Helps user see gaps ("I trained Tuesday but didn't log it")
- Prevents accidental duplicates
- Visual context aids memory

---

### 3. Entry Card Design (Belt-Adaptive)

**Component:** `JournalEntryCard.tsx`

**Current:** Already implemented with belt-adaptive complexity

**Refinement Needed:** Ensure visual consistency with post-session Review phase

#### Data Display by Belt

| Field | White | Blue | Purple+ | Review Phase |
|-------|-------|------|---------|--------------|
| Date/time | Yes | Yes | Yes | Yes (editable) |
| Training type badge | Yes | Yes | Yes | Yes (editable) |
| Duration | Yes | Yes | Yes | Yes (editable) |
| Lesson topic/headline | Yes | Yes | Yes | N/A (techniques) |
| Techniques drilled | No* | Yes | Yes | Yes |
| Sparring rounds | No | Yes | Yes | Yes |
| Submissions given | No | No | Yes | Yes (Blue+) |
| Submissions received | No | No | Yes | Yes (Blue+) |
| Worked well (chips) | No | Yes | Yes | **ADD** |
| Struggles (chips) | No | Yes | Yes | Yes |
| Notes preview | Yes | No** | No** | Yes |

*White belts see techniques as part of headline if lesson_topic is empty
**Blue+ belts see worked_well/struggles chips instead of notes preview

#### Visual Consistency Requirements

The following elements should use **identical styling** across:
- `JournalEntryCard.tsx` (list view)
- `SessionDetail.tsx` (detail view)
- `ReviewPhase` in `VoiceFirstLogger.tsx` (post-logging review)

| Element | Style Specification |
|---------|---------------------|
| Training type badge | Same colors: Gi = blue, No-Gi = purple, Both = gold |
| Worked well chips | Green background `rgba(34, 197, 94, 0.15)`, green text |
| Struggles chips | Red background `rgba(239, 68, 68, 0.15)`, red text |
| Technique chips | Gold border, transparent background |
| Duration text | Gray-400, weight 500 |
| Submissions arrows | Green up arrow (given), Red down arrow (received) |

---

### 4. Review Phase Enhancement (VoiceFirstLogger)

**Problem:** The Review Phase captures Techniques, Notes, and Sparring details, but does NOT explicitly capture "What Worked" and "Struggles." These currently come from AI extraction only (mock data), but should be user-confirmable.

**Solution:** Add "What's Working" and "Needs Work" sections to Review Phase

#### Current Review Phase Structure

```
TRAINING TYPE     [Gi] [No-Gi] [Open Mat]
DURATION          [60m] [90m] [2h] [Other]
DID YOU SPAR?     [Yes] [No]
└── (if yes) SPARRING DETAILS
    ├── Rounds: [1-10 grid]
    ├── Subs Given: [SubmissionPicker]
    └── Submitted By: [SubmissionPicker]
WHAT YOU WORKED ON    [technique chips + add more]
NOTES                 [textarea]
```

#### Proposed Review Phase Structure

```
TRAINING TYPE     [Gi] [No-Gi] [Open Mat]
DURATION          [60m] [90m] [2h] [Other]
DID YOU SPAR?     [Yes] [No]
└── (if yes) SPARRING DETAILS
    ├── Rounds: [1-10 grid]
    ├── Subs Given: [SubmissionPicker]
    └── Submitted By: [SubmissionPicker]
WHAT YOU WORKED ON    [technique chips + add more]
─────────────────────────────────────────────
WHAT'S CLICKING       (optional, green-tinted section)
[chip input field]
"Hip bump timing" "Guard retention" [+ Add]

WHAT NEEDS WORK       (optional, red-tinted section)
[chip input field]
"Passing butterfly" [+ Add]
─────────────────────────────────────────────
NOTES                 [textarea]
```

#### New Section Design

**What's Clicking (Green Section)**

```css
background: rgba(34, 197, 94, 0.1);
border: 1px solid rgba(34, 197, 94, 0.3);
border-left: 3px solid var(--color-positive);
```

**What Needs Work (Red Section)**

```css
background: rgba(239, 68, 68, 0.1);
border: 1px solid rgba(239, 68, 68, 0.3);
border-left: 3px solid var(--color-negative);
```

**Input Behavior:**
- Pre-populated from AI extraction (if available)
- User can add/remove chips
- Chips are free-text (not dropdown)
- Suggestive hints based on recent struggles/wins
- Max 5 items per section (to keep it focused)
- Empty is fine (optional sections)

**Why add these explicitly?**
1. Creates consistent data capture → consistent display
2. User confirms/corrects AI extraction
3. Makes Journal cards more useful for Blue+ belts
4. Aligns with First Principle #1: Reflection

---

### 5. Session Summary (Post-Save)

**Problem:** After saving a session, users see a brief success screen with session count and a belt-specific message. This is good, but doesn't reinforce what data they just captured.

**Current Success Screen:**
```
[Large checkmark]
SESSION #48 LOGGED
"Keep showing up. Consistency compounds."
```

**Enhancement:** Add a quick summary card that previews how the entry will appear in their Journal.

**Proposed Success Screen:**

```
┌─────────────────────────────────────┐
│         [Green checkmark]           │
│        SESSION #48 LOGGED           │
│ "Consistency compounds."            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Today, 7:15 PM           [Gi]  │ │
│ │ 90 min · 5 rounds              │ │
│ │                                │ │
│ │ Knee slice pass                │ │
│ │ ✓ Hip bump timing              │ │
│ │ ✗ Passing butterfly            │ │
│ └─────────────────────────────────┘ │
│        Mini-preview card            │
│                                     │
│  Auto-dismiss in 3 seconds          │
│  or tap anywhere to continue        │
└─────────────────────────────────────┘
```

**Benefit:** Mental connection between "what I entered" and "what I'll see later"

**Implementation:**
- Same `JournalEntryCard` component, just rendered in success phase
- Transition: card fades in after checkmark animation completes
- Duration: 3 seconds, then auto-navigates to Journal page
- Tap anywhere: immediately navigates to Journal

---

## Data Model

> **Data Model:** The canonical Session type is defined in code at `/prototype/src/types/database.ts`. This document describes product requirements; code is the source of truth for field names and types.

### JournalEntry (Existing)

```typescript
interface JournalEntry {
  id: string;
  date: string;           // ISO date (YYYY-MM-DD)
  time: string | null;    // e.g., "18:30"
  training_type: 'gi' | 'nogi' | 'both';
  duration_minutes: number | null;

  // All belts
  lesson_topic: string | null;
  notes: string | null;

  // Blue+ belts
  techniques_drilled: string[];
  did_spar: boolean;
  sparring_rounds: number | null;
  worked_well: string[];
  struggles: string[];

  // Purple+ belts
  submissions_given: string[];
  submissions_received: string[];

  // Metadata
  created_at: string;
  updated_at: string;
  deleted_at: string | null;  // Soft delete
}
```

### Changes for New Features

| Field | Change | Reason |
|-------|--------|--------|
| `deleted_at` | Add (nullable timestamp) | Soft delete support |
| `updated_at` | Add (timestamp) | Track edits |
| `created_at` | Add (timestamp) | Track when originally logged vs. session date |

**Note:** `date` is the training session date. `created_at` is when the entry was logged. These differ for backdated entries.

---

## Implementation Priority

### Phase 1: Core Fixes (High Priority)

1. **Infinite scroll** — Remove 6-entry limit, implement lazy loading
2. **Month grouping** — Better temporal navigation for old entries
3. **Date editing** — Allow correcting session date in edit mode

### Phase 2: Entry Management (Medium Priority)

4. **Delete entry** — Via overflow menu in SessionDetail
5. **Add past session** — Date picker flow before VoiceFirstLogger

### Phase 3: UI Consistency (Medium Priority)

6. **Add Worked Well / Struggles to Review Phase** — Explicit capture
7. **Post-save summary card** — Visual reinforcement
8. **Style alignment audit** — Ensure chips, badges, colors match across views

---

## Accessibility Requirements

| Requirement | Specification |
|-------------|---------------|
| Touch targets | 44px minimum for all interactive elements |
| Screen reader | All cards announce: date, type, duration, key details |
| Keyboard nav | Arrow keys navigate list, Enter opens detail |
| Delete confirmation | Focus trapped in modal, Escape cancels |
| Loading states | Skeleton announces "Loading more sessions" |

---

## Open Questions

1. **Search?** — Should Journal have search functionality? (Find sessions mentioning "armbar")
   - *Recommendation:* Defer to future release. Filters + scroll handles 90% of cases.

2. **Export?** — Allow exporting session history as PDF/CSV?
   - *Recommendation:* Add to Settings page, not Journal. Low priority for MVP.

3. **Bulk operations?** — Select multiple sessions for batch delete?
   - *Recommendation:* No. Keeps UX simple. Delete one at a time is fine for rare cleanup.

4. **Offline?** — What happens if user browses Journal while offline?
   - *Recommendation:* Show cached entries with "Last synced" indicator. Defer new loads.

---

## Related Documents

- `/docs/FIRST_PRINCIPLES.md` — Especially #2, #10, #11
- `/docs/product/FEATURES.md` — Section 3 (Session History)
- `/docs/product/BELT_PERSONALIZATION_SYSTEM.md` — Card complexity by belt
- `SessionHistory.tsx`, `JournalEntryCard.tsx`, `SessionDetail.tsx` — Current implementation

---

*Document created: January 25, 2026*
