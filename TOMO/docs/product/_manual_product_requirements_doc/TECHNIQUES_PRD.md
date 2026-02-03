# Techniques Page - Product Requirements Document

**Last Updated:** January 25, 2026
**Component:** `TechniqueLibrary.tsx`, `UpNextVideos.tsx`
**Status:** Prototype Complete - UI Polish Phase
**Live:** bjjj.pages.dev (Techniques tab)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Core User Value](#2-core-user-value)
3. [Page Structure](#3-page-structure)
4. [Feature Inventory](#4-feature-inventory)
5. [Data Architecture](#5-data-architecture)
6. [Content Management System](#6-content-management-system)
7. [Belt Personalization](#7-belt-personalization)
8. [Current Implementation Status](#8-current-implementation-status)
9. [UI Polish Opportunities](#9-ui-polish-opportunities)
10. [Design Specifications](#10-design-specifications)
11. [Related Files](#11-related-files)

---

## 1. Overview

### Purpose

The Techniques page serves as the **learning hub** of TOMO. Unlike session logging (capture mode) or dashboard (reflection mode), this page is for **deliberate study** when users are not exhausted.

### User Context

Users on this page are:
- At home, on the couch, or commuting
- Curious and wanting to learn
- NOT post-training exhausted
- Able to handle depth and complexity
- Often preparing for their next session

### Page Philosophy

> "Your coach knows your game best. Use these as starting points."

TOMO provides curated video instruction from world-class grapplers as **supplementary** learning. We never replace the coach—we augment the journey.

---

## 2. Core User Value

### Primary Use Cases

| Use Case | User Need | Feature |
|----------|-----------|---------|
| "What should I work on?" | Personalized guidance | For You recommendations |
| "How do I do X?" | Specific technique lookup | Search + Technique Detail |
| "I want to explore guards" | Positional browsing | Browse by Position |
| "I'm struggling mentally" | Psychological support | Mindset categories |
| "Who's a good instructor for this?" | Trusted sources | Priority Instructors |

### Success Metrics

- Time spent on page (engagement)
- Videos watched to completion
- Return visits to Techniques tab
- Techniques mentioned in subsequent journal entries (cross-feature correlation)

---

## 3. Page Structure

### Visual Hierarchy

```
┌─────────────────────────────────────────────────┐
│  SEARCH BAR                                     │
│  [Search techniques...]                    [X]  │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐               │
│  │  FOR YOU    │  │   BROWSE    │  ← Tab Toggle │
│  └─────────────┘  └─────────────┘               │
├─────────────────────────────────────────────────┤
│                                                 │
│  [TAB CONTENT AREA]                             │
│                                                 │
│  For You: Hero video + Level Up cards           │
│  Browse: Categories + Position grid             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Navigation Flow

```
Main View
├── Search (overlay results)
├── For You Tab
│   ├── Hero Video → Full-screen player
│   ├── Level Up Videos → Full-screen player
│   └── Support Videos (at-risk only) → Full-screen player
└── Browse Tab
    ├── Belt Suggestions → Position Detail
    ├── Position Grid → Position Detail
    │   └── Technique List → Technique Detail
    │       └── Video player + Progress + Key Points
    └── Mindset Categories → Mindset Detail
        └── Video list → Full-screen player
```

---

## 4. Feature Inventory

### 4.1 Global Features

| # | Feature | Description | Status | Priority |
|---|---------|-------------|--------|----------|
| T.1 | Search Bar | Find techniques and mindset videos | Done | Core |
| T.2 | Tab Toggle | Switch For You / Browse | Done | Core |
| T.3 | Full-Screen Video Player | In-app YouTube playback | Done | Core |

### 4.2 For You Tab

| # | Feature | Description | Status | Priority |
|---|---------|-------------|--------|----------|
| T.4 | Hero Video | Large personalized recommendation with one-liner | Done | Core |
| T.5 | Level Up Videos | 4 compact video cards below hero | Done | Core |
| T.6 | Support Videos | "When It Gets Hard" section for at-risk personas | Done | Core |
| T.7 | Coach Deferral | Reminder that coach is authority | Done | Core |
| T.8 | Training Feedback CTA | Link to AI insights | Done | Nice-to-have |

### 4.3 Browse Tab

| # | Feature | Description | Status | Priority |
|---|---------|-------------|--------|----------|
| T.9 | Video Stats Hero | "X Techniques with videos" count | Done | Nice-to-have |
| T.10 | Belt Suggestions | Top 4 positions for user's belt | Done | Core |
| T.11 | Position Grid | 11 position category cards | Done | Core |
| T.12 | Mindset Categories | 5 mental game category cards | Done | Core |
| T.13 | Featured Instructors | Video count by instructor | Done | Nice-to-have |

### 4.4 Position Detail View

| # | Feature | Description | Status | Priority |
|---|---------|-------------|--------|----------|
| T.14 | Back Navigation | Return to Browse | Done | Core |
| T.15 | Position Header | Name + technique count | Done | Core |
| T.16 | Belt Grouping | Techniques grouped by belt level | Done | Core |
| T.17 | Technique List | Scrollable technique buttons | Done | Core |
| T.18 | Proficiency Indicator | Colored dot showing user's level | Done | Core |

### 4.5 Technique Detail View

| # | Feature | Description | Status | Priority |
|---|---------|-------------|--------|----------|
| T.19 | Back Navigation | Return to Position | Done | Core |
| T.20 | Technique Header | Belt, category, name, description | Done | Core |
| T.21 | Primary Video | YouTube embed with instructor | Done | Core |
| T.22 | More Videos | Additional video options | Done | Nice-to-have |
| T.23 | Progress Card | Proficiency, times drilled, last practiced | Done | Core |
| T.24 | Log Practice Button | Persists to localStorage, updates TechniqueProgress | Done | Core |
| T.25 | Key Points | Bulleted execution tips | Done | Core |
| T.26 | Common Mistakes | Warning callout with errors to avoid | Done | Core |

### 4.6 Mindset Detail View

| # | Feature | Description | Status | Priority |
|---|---------|-------------|--------|----------|
| T.27 | Back Navigation | Return to Browse | Done | Core |
| T.28 | Category Header | Name + video count | Done | Core |
| T.29 | Video List | Full-width video cards | Done | Core |
| T.30 | Empty State | Message if no videos | Done | Core |

---

## 5. Data Architecture

### 5.1 Technique Data Model

```typescript
interface Technique {
  id: string;
  name: string;
  position: Position;              // closed-guard, mount, etc.
  category: TechniqueCategory;     // submission, sweep, pass, escape, etc.
  beltLevel: BeltLevel;            // white, blue, purple, brown, black
  description: string;
  keyPoints: string[];
  commonMistakes: string[];
  videoId?: string;                // Primary video ID
  relatedTechniques: string[];
  variations: string[];
  giNoGi: 'gi' | 'nogi' | 'both';
}
```

### 5.2 Progress Data Model

```typescript
interface TechniqueProgress {
  techniqueId: string;
  proficiency: 'learning' | 'developing' | 'proficient' | 'advanced';
  timesDrilled: number;
  lastDrilled: string;             // ISO date
  coachEndorsed: boolean;
  notes?: string;
}
```

### 5.3 Video Data Model

```typescript
interface TechniqueVideo {
  technique_id: string;            // Links to technique
  video_type: 'instructional';
  youtube_id: string;
  instructor: string;
  title: string;
  duration_seconds: number;
}
```

### 5.4 Data Files

| File | Purpose | Location |
|------|---------|----------|
| `techniques.ts` | 50+ technique definitions | `/data/techniques.ts` |
| `techniqueVideos.ts` | Curated video catalog | `/data/techniqueVideos.ts` |
| `personaVideoRecommendations.ts` | Persona-specific video configs | `/data/personaVideoRecommendations.ts` |

### 5.5 Position Categories

| ID | Display Name | Description |
|----|--------------|-------------|
| `closed_guard` | Closed Guard | Bottom with legs wrapped |
| `half_guard` | Half Guard | Control one leg |
| `open_guard` | Open Guard | Butterfly, DLR, spider |
| `mount` | Mount | Top position dominance |
| `side_control` | Side Control | Chest-to-chest control |
| `back_control` | Back Control | Hooks and seatbelt |
| `guard_passing` | Guard Passing | Get past the legs |
| `takedowns` | Takedowns | Wrestling and judo |
| `turtle` | Turtle | Attack and defend |
| `clinch` | Clinch | Standing control |
| `submissions` | Submissions | Finishing attacks |

### 5.6 Mindset Categories

| ID | Display Name | Description |
|----|--------------|-------------|
| `belt_journey` | Belt Journey | White belt to black belt psychology |
| `mental_game` | Mental Game | Competition, ego, flow state |
| `age_longevity` | Age & Longevity | Training over 40, recovery |
| `lifestyle` | Lifestyle | Work-life balance, motivation |
| `injury_recovery` | Injury & Recovery | Coming back, prehab |

---

## 6. Content Management System

### 6.1 Overview

The video library is managed via **Google Sheets** as a lightweight CMS. This allows the content manager to add, edit, and remove videos without touching code.

```
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│   Google Sheet      │  →   │  npm run sync-videos │  →   │  techniqueVideos.ts │
│   (you edit)        │      │  (manual command)    │      │  (app reads)        │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

**Key Decisions:**
- **Google Sheets** - Free, accessible from any device, familiar interface
- **Manual sync** - You run `npm run sync-videos` when ready to publish changes
- **Trusted entries** - No YouTube API validation; your entries are the source of truth

### 6.2 Google Sheet Structure

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `technique_id` | string | Yes | Links to technique in `techniques.ts` (e.g., `armbar-closed-guard`) |
| `youtube_id` | string | Yes | 11-character YouTube video ID (e.g., `dQw4w9WgXcQ`) |
| `title` | string | Yes | Video title as displayed in app |
| `instructor` | string | Yes | Instructor name (e.g., `John Danaher`) |
| `channel` | string | No | YouTube channel name |
| `duration_seconds` | number | No | Video length in seconds |
| `difficulty` | number | No | 1-10 scale (1=beginner, 10=elite) |
| `verified` | boolean | No | TRUE if manually verified working |
| `active` | boolean | Yes | FALSE = soft delete (hidden but recoverable) |
| `notes` | string | No | Internal notes (not shown in app) |

**Example Row:**
```
technique_id: armbar-closed-guard
youtube_id: abc123xyz99
title: The Perfect Armbar Setup
instructor: John Danaher
channel: Bernardo Faria BJJ Fanatics
duration_seconds: 847
difficulty: 3
verified: TRUE
active: TRUE
notes: Great for beginners, covers 3 entries
```

### 6.3 CRUD Operations

#### Adding a Video
1. Add a new row to the Google Sheet
2. Fill required fields: `technique_id`, `youtube_id`, `title`, `instructor`, `active=TRUE`
3. Run `npm run sync-videos` from `/prototype` directory
4. Commit and deploy: `npm run ship`

#### Editing a Video
1. Find the row in the Google Sheet
2. Update the fields you want to change
3. Run `npm run sync-videos`
4. Deploy

#### Soft Delete (Recommended)
1. Set `active = FALSE` on the row
2. Video is hidden from app but row remains for recovery
3. Run sync and deploy

#### Hard Delete
1. Delete the entire row from the sheet
2. Video is permanently removed
3. Run sync and deploy

### 6.4 Sync Workflow

```bash
# From /prototype directory
npm run sync-videos
```

**What the script does:**
1. Authenticates with Google Sheets API (uses stored credentials)
2. Fetches all rows where `active = TRUE`
3. Validates required fields are present
4. Generates `/prototype/src/data/techniqueVideos.ts`
5. Prints summary: X videos synced, Y skipped, Z errors

**Credentials Setup (one-time):**
1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account with read access
4. Download JSON credentials
5. Store as `/prototype/.google-credentials.json` (gitignored)

### 6.5 Content Guidelines

#### What Makes a Good Tutorial Video

| Criteria | Good | Avoid |
|----------|------|-------|
| Length | 5-15 minutes focused instruction | 30+ minute rambling sessions |
| Production | Clear camera angles, good audio | Shaky phone footage, echo |
| Instructor | Explains why, not just what | Silent drilling |
| Technique match | Exactly matches `technique_id` | Vaguely related content |
| Accessibility | English or subtitled | Non-subtitled foreign language |

#### Priority Instructors

Videos from these instructors are preferred:
1. **John Danaher** - Systematic, conceptual, excellent for all levels
2. **Gordon Ryan** - Practical application, competition-tested
3. **Lachlan Giles** - Clear explanations, great for defense
4. **Craig Jones** - Engaging, good for motivation content
5. **Bernardo Faria** - Fundamentals, pressure passing
6. **Andre Galvao** - Competition footage, modern game

#### Technique-to-Video Mapping Rules

- Each technique can have **multiple videos** (primary + alternatives)
- Primary video should be from priority instructor when available
- Secondary videos can show variations or different perspectives
- Mindset videos use `technique_id` format: `mindset-{category}-{topic}`

### 6.6 Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Video shows broken thumbnail | YouTube ID incorrect | Verify ID, check video is public |
| Sync fails with auth error | Credentials expired | Re-download credentials JSON |
| Video not appearing | `active = FALSE` or missing `technique_id` | Check sheet, ensure active and ID matches |
| Duplicate videos | Same `youtube_id` for multiple techniques | Intentional if video covers multiple techniques |

### 6.7 Future Enhancements

**Phase 2: Real-time CMS (if needed)**
- Migrate to Supabase or Airtable for real-time updates
- No manual sync required
- Admin dashboard for content management

**Phase 3: Community Contributions**
- Users can suggest videos
- Moderation queue in admin dashboard
- Credit system for contributors

---

## 7. Belt Personalization

### 7.1 For You Recommendations

The "For You" tab uses persona-specific video configurations:

| Persona | Hero Video Focus | Level Up Focus | Support Videos |
|---------|------------------|----------------|----------------|
| white-excelling | Fundamentals | Defense, escapes | None |
| white-at-risk | Motivation | Survival basics | Yes - "Keep showing up" |
| blue-excelling | Game development | Combinations | None |
| blue-at-risk | Blue belt blues | Plateau support | Yes - "Everyone struggles" |
| purple-average | Systems thinking | Teaching | None |
| brown-average | Refinement | Legacy | None |

### 7.2 Browse Suggestions by Belt

| Belt | Suggested Positions | Message |
|------|---------------------|---------|
| White | Closed Guard, Mount, Side Control, Back Control | "Start with the fundamentals. Master these positions first." |
| Blue | Half Guard, Open Guard, Guard Passing, Submissions | "Expand your game. Build on your foundation." |
| Purple | Open Guard, Guard Passing, Takedowns, Submissions | "Refine your A-game. Develop your signature style." |
| Brown | Clinch, Takedowns, Turtle, Submissions | "Polish the details. Fill gaps in your game." |
| Black | Submissions, Clinch, Takedowns, Turtle | "Master the subtle details. Share your knowledge." |

### 7.3 Content Gating (Planned)

| Category | White | Blue | Purple+ |
|----------|-------|------|---------|
| Basic Guards | Full | Full | Full |
| Advanced Guards | Locked | Full | Full |
| Leg Locks | Locked | Basic | Full |
| Advanced Systems | Locked | Locked | Full |

**Current Status:** Not implemented. All content visible to all belts.

### 7.4 Difficulty Filtering (Planned)

| Belt | Difficulty Range | Defense Priority | Conceptual Content |
|------|------------------|------------------|-------------------|
| White | 1-3 | YES | NO |
| Blue | 2-5 | NO | YES |
| Purple+ | 4-10 | NO | YES |

**Current Status:** Not implemented. No difficulty-based filtering exists. All content visible to all belts.

---

## 8. Current Implementation Status

### 8.1 What's Working Well

| Feature | Status | Notes |
|---------|--------|-------|
| Tab navigation | Done | Smooth toggle between For You / Browse |
| Search | Done | Finds both techniques and mindset videos |
| Full-screen video player | Done | Autoplay, escape to close, scroll lock |
| Position browsing | Done | 11 categories with technique lists |
| Mindset categories | Done | 5 categories with video content |
| Belt suggestions | Done | Dynamic based on user's belt |
| Technique detail | Done | Videos, key points, common mistakes |
| Progress display | Done | Proficiency, times drilled, last practiced |
| At-risk support | Done | "When It Gets Hard" section for struggling personas |
| YouTube thumbnail fallback | Done | 3-tier fallback chain with CSS placeholder |

### 8.2 Gaps & Issues

| Issue | Severity | Description |
|-------|----------|-------------|
| ~~Log Practice non-functional~~ | ~~Medium~~ | **Fixed** - Now persists to `bjj-practice-logs` localStorage |
| Video-technique mapping approximate | Low | Uses title matching, not proper IDs |
| Featured instructors static | Low | No tap action, display only |
| Content gating missing | Medium | All content visible regardless of belt |
| Difficulty filtering missing | Medium | No belt-appropriate filtering |
| Progress is read-only | Medium | Cannot update proficiency from this page |

### 8.3 Integration Status

| System | Integration | Notes |
|--------|-------------|-------|
| Belt Personalization Hook | 40% | Suggestions work, gating doesn't |
| Practice Tracking | Done | Log Practice persists to `bjj-practice-logs`, updates `TechniqueProgress` |
| Profile Context | Done | Belt and persona info available |
| Video Library | Done | Full catalog accessible |

---

## 9. UI Polish Opportunities

### 9.1 High Impact (Core Functionality)

#### ~~Log Practice Integration~~ DONE
- ~~**Current:** Button says "Log Practice" but does nothing~~
- **Implemented:** Creates `PracticeLog` entry in localStorage, increments `TechniqueProgress.times_drilled`, updates `last_practiced`
- **Data Spec:** See `/docs/data-and-ai/PRACTICE_TRACKING.md`

#### Proficiency Updates
- **Current:** Read-only display of proficiency
- **Fix:** Add tap-to-update or swipe gesture for quick updates
- **Simpler:** Infer proficiency from journal entries mentioning technique

### 9.2 Medium Impact (Polish)

#### Position Card Visual Enhancement
- Add subtle position icons or illustrations
- Show technique count on hover/press
- Add "New" badge for recently added content

#### Search Result Enhancement
- Show video thumbnail in search results
- Add instructor name to results
- Highlight matched text

#### Technique Detail Improvements
- Add "Related Techniques" navigation
- Show "Also practiced by" social proof
- Add bookmarking/favorites

### 9.3 Low Impact (Nice-to-Have)

#### Featured Instructors Tap Action
- Navigate to filtered view of that instructor's videos

#### Video Watch Tracking
- Track which videos user has watched
- Show "Watched" badge
- Resume playback position

#### Mindset Progress
- Track completion of mindset videos
- Suggest next video in series

---

## 10. Design Specifications

### 10.1 Layout

| Element | Specification |
|---------|---------------|
| Page padding | `var(--space-lg)` (24px) on sides |
| Tab toggle height | 52px |
| Search bar height | 56px |
| Position card min-height | 120px |
| Touch targets | 44px minimum, 56px preferred |

### 10.2 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Tab labels | Mono | xs | 700 |
| Section headers | Mono | xs | 700 |
| Position names | Heading | base | 600 |
| Technique names | System | base | 600 |
| Descriptions | Mono | xs | 500 |
| Video titles | Heading | xl (hero), sm (compact) | 700, 600 |

### 10.3 Colors

| Element | Color |
|---------|-------|
| Active tab | `var(--color-gold)` |
| Inactive tab | `var(--color-gray-500)` |
| Section headers | `var(--color-gold)` |
| Card backgrounds | `var(--color-gray-900)` |
| Card borders | `var(--color-gray-800)` |
| Position descriptions | `var(--color-gray-500)` |
| Proficiency - Learning | `var(--color-warning)` |
| Proficiency - Developing | `var(--color-gold)` |
| Proficiency - Proficient/Advanced | `var(--color-positive)` |
| Common Mistakes callout | `var(--color-negative)` |

### 10.4 Animations

| Element | Transition |
|---------|------------|
| Tab switch | 0.15s ease |
| Card hover | border-color 0.15s ease |
| Video overlay fade | 0.2s ease |
| Modal open | Body scroll lock |

---

## 11. Related Files

### 11.1 Components

| File | Purpose |
|------|---------|
| `/components/features/TechniqueLibrary.tsx` | Main page component |
| `/components/features/UpNextVideos.tsx` | For You tab content |
| `/components/ui/YouTubeEmbed.tsx` | Video player component |

### 11.2 Data

| File | Purpose |
|------|---------|
| `/data/techniques.ts` | Technique definitions |
| `/data/techniqueVideos.ts` | Video catalog |
| `/data/personaVideoRecommendations.ts` | Persona video configs |

### 11.3 Types

| File | Purpose |
|------|---------|
| `/types/techniqueVideos.ts` | Video type definitions |
| `/types/database.ts` | Belt, proficiency types |

### 11.4 Hooks

| File | Purpose |
|------|---------|
| `/hooks/useBeltPersonalization.ts` | Belt-adaptive behavior |

---

## Appendix A: Priority Instructors

The following instructors are prioritized for video content:

| Instructor | Specialty | Notes |
|------------|-----------|-------|
| John Danaher | Systems, conceptual | Primary for fundamentals |
| Gordon Ryan | No-gi, competition | Primary for practical application |
| Lachlan Giles | Escapes, leg locks | Primary for defense |
| Craig Jones | Submissions, humor | Primary for engagement |

---

## Appendix B: User Flow Diagrams

### B.1 Finding a Specific Technique

```
User wants to learn "Triangle Choke"
    ↓
Types in search bar
    ↓
Sees "Triangle" in results (Techniques section)
    ↓
Taps result
    ↓
Technique Detail opens
    ↓
Watches video from John Danaher
    ↓
Reviews key points
    ↓
Reads common mistakes
    ↓
(Optional) Taps "Log Practice" → Persisted to localStorage
```

### B.2 Browsing by Position

```
User wants to improve guard
    ↓
Taps "Browse" tab
    ↓
Sees "Suggested for [belt]" section
    ↓
Taps "Closed Guard"
    ↓
Position Detail shows techniques by belt
    ↓
Taps "Armbar from Closed Guard"
    ↓
Technique Detail opens
```

### B.3 Personalized Recommendations

```
User opens Techniques tab
    ↓
"For You" tab loads by default
    ↓
Hero video shows based on persona
    ↓
User watches hero video
    ↓
Scrolls to "Level Up" section
    ↓
Watches additional videos
    ↓
(At-risk only) Sees "When It Gets Hard" section
```

---

## Appendix C: Future Considerations

### C.1 Coach Integration
- Coach could mark techniques as "assigned homework"
- Student sees coach-assigned techniques prominently

### C.2 Curriculum Paths
- "30-Day Fundamentals" structured programs
- "Competition Prep" themed collections
- "Master Your Guard" focused series

### C.3 Community Features
- "Most watched this week" social proof
- "Trending at your gym" if gym data available
- "Your teammates are learning..." prompts

### C.4 AI Integration
- "Based on your last session, you should review..."
- "You mentioned struggling with X, here's a video"
- Voice search: "Show me triangle escapes"

---

*Document created: January 25, 2026*
*For questions, contact product team*
