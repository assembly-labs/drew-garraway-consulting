# TOMO Design Review Plan

## Overview

Design review mood boards for all app pages and features, organized by phase. Each phase produces a standalone HTML file showing all UI variations across the 6 demo personas.

**Location:** `/docs/design-reviews/`

---

## Naming Convention

Each screen/element gets a unique reference ID:

| Prefix | Page/Feature |
|--------|--------------|
| `ONB` | Onboarding |
| `STATS` | Dashboard / Stats |
| `JRNL` | Journal (Session History) |
| `DTAIL` | Session Detail |
| `LIB` | Technique Library |
| `VID` | Video Recommendations |
| `INS` | Insights / Training Feedback |
| `PROF` | Profile Screen |
| `SET` | Settings |
| `LOG` | Session Logger |
| `PROG` | Belt Progress |

**Persona Suffixes:**
- `-WHITE-EXC` = Jake Thompson (White, Thriving)
- `-WHITE-RISK` = David Morrison (White, At-Risk)
- `-BLUE-EXC` = Marcus Chen (Blue, Progressing)
- `-BLUE-RISK` = Ryan Torres (Blue, Critical)
- `-PURPLE` = Sofia Rodriguez (Purple, Stable)
- `-BROWN` = Elena Kim (Brown, Refined)

---

## Phase 1: Onboarding & Tutorials (COMPLETE)

**File:** `tutorial-content-moodboard.html`

| ID | Screen | Personas |
|----|--------|----------|
| `ONB-01-A` | Welcome | All |
| `ONB-01-B` | Identity (Name + Belt) | All |
| `ONB-01-C` | Mic Permission | All |
| `ONB-01-D` | Ready | All |
| `VID-WHITE-EXCELLING` | Video Recs - Jake | White |
| `VID-WHITE-AT-RISK` | Video Recs - David | White |
| `VID-BLUE-EXCELLING` | Video Recs - Marcus | Blue |
| `VID-BLUE-AT-RISK` | Video Recs - Ryan | Blue |
| `VID-PURPLE-AVERAGE` | Video Recs - Sofia | Purple |
| `VID-BROWN-AVERAGE` | Video Recs - Elena | Brown |
| `SUPPORT-WHITE-AT-RISK` | "When It Gets Hard" - David | White |
| `SUPPORT-BLUE-AT-RISK` | "When It Gets Hard" - Ryan | Blue |

---

## Phase 2: Stats / Dashboard

**File:** `stats-moodboard.html`

### Primary Dashboard View (per persona)
| ID | Component | Description |
|----|-----------|-------------|
| `STATS-DASH-{PERSONA}` | Full Dashboard | Complete dashboard view |

### Stats Modules (belt-adaptive)

**Tier 1: White Belt Modules (Retention-Focused)**
| ID | Module | Description |
|----|--------|-------------|
| `STATS-SUMMARY` | DashboardSummaryCard | Sessions, hours, streak, belt |
| `STATS-WEEKLY` | WeeklyProgressRing | Apple Watch-style weekly goal |
| `STATS-HEATMAP` | CalendarHeatMap | GitHub-style training consistency |
| `STATS-DEFENSE` | DefenseFocus | Offense vs defense bar chart |

**Tier 2: Blue Belt Modules (Identity & Game)**
| ID | Module | Description |
|----|--------|-------------|
| `STATS-PAIRS` | TechniquePairings | Co-occurrence, emerging chains |
| `STATS-BLUES` | BluesDetector | Dropout risk + interventions |
| `STATS-TYPE` | SessionTypeDistribution | Gi vs No-Gi breakdown |
| `STATS-SPAR` | SparringPatternAnalysis | Sparring round distribution |
| `STATS-ACHIEVE` | AchievementTimeline | Belt promotions, milestones |

**Tier 3: Purple/Brown Belt Modules (Depth)**
| ID | Module | Description |
|----|--------|-------------|
| `STATS-JOURNEY` | YourJourney | Multi-year progression |
| `STATS-MASTERY` | TechniqueMastery | Specialization by proficiency |

**Universal Modules (All Belts)**
| ID | Module | Description |
|----|--------|-------------|
| `STATS-ROLLS` | RecentRolls | Recent subs received + defense tips |
| `STATS-ATTACK` | AttackProfile | Submission treemap + specialist name |
| `STATS-BREAK` | BreakthroughHero | AI-detected skill advancement |

---

## Phase 3: Journal

**File:** `journal-moodboard.html`

### Session History (Feed View)
| ID | Screen | Description |
|----|--------|-------------|
| `JRNL-FEED-{PERSONA}` | Journal Feed | Belt-adaptive card complexity |
| `JRNL-EMPTY` | Empty State | No sessions logged |
| `JRNL-FILTER` | Filter Tabs | All / Gi / No-Gi |

### Journal Entry Cards (belt variations)
| ID | Belt | Card Content |
|----|------|--------------|
| `JRNL-CARD-WHITE` | White | Date, type, duration, lesson, notes |
| `JRNL-CARD-BLUE` | Blue | + techniques, rounds, worked/struggles |
| `JRNL-CARD-PURPLE` | Purple+ | + submissions given/received |

### Session Detail
| ID | Section | Description |
|----|---------|-------------|
| `DTAIL-HERO` | AI Narrative | Typewriter summary |
| `DTAIL-META` | Training Details | Type, duration, date/time |
| `DTAIL-TECH` | Techniques | Drilled techniques list |
| `DTAIL-SPAR` | Sparring | Partners, belts, outcomes |
| `DTAIL-INSIGHT` | Insights | Worked well / Struggles |
| `DTAIL-SUBS` | Submissions | Given / Received |
| `DTAIL-MOOD` | Energy & Mood | Rating sliders |
| `DTAIL-NOTES` | Notes | Free-form notes |

### Edit Sheets (bottom modals)
| ID | Edit Section | Fields |
|----|--------------|--------|
| `EDIT-TRAINING` | Training Details | Type, duration, rounds |
| `EDIT-TECH` | Techniques | Add/remove techniques |
| `EDIT-INSIGHT` | Insights | Worked well / Struggles |
| `EDIT-NOTES` | Notes | Session notes |
| `EDIT-MOOD` | Energy & Mood | Slider editing |
| `EDIT-SPAR` | Sparring | Round details |

---

## Phase 4: Tutorials / Technique Library

**File:** `library-moodboard.html`

### View Modes
| ID | View | Description |
|----|------|-------------|
| `LIB-FORYOU-{PERSONA}` | For You Tab | Personalized video picks |
| `LIB-BROWSE` | Browse Tab | Category grid |

### Position Categories (11)
| ID | Category |
|----|----------|
| `LIB-CAT-CLOSED` | Closed Guard |
| `LIB-CAT-HALF` | Half Guard |
| `LIB-CAT-OPEN` | Open Guard |
| `LIB-CAT-MOUNT` | Mount |
| `LIB-CAT-SIDE` | Side Control |
| `LIB-CAT-BACK` | Back Control |
| `LIB-CAT-PASS` | Guard Passing |
| `LIB-CAT-TAKE` | Takedowns |
| `LIB-CAT-TURT` | Turtle |
| `LIB-CAT-CLIN` | Clinch |
| `LIB-CAT-SUBS` | Submissions |

### Mindset Categories (5)
| ID | Category |
|----|----------|
| `LIB-MIND-BELT` | Belt Journey |
| `LIB-MIND-MENTAL` | Mental Game |
| `LIB-MIND-AGE` | Age & Longevity |
| `LIB-MIND-LIFE` | Lifestyle |
| `LIB-MIND-INJURY` | Injury & Recovery |

### Video Components
| ID | Component | Description |
|----|-----------|-------------|
| `LIB-VIDEO-HERO` | Hero Video Card | Large featured video |
| `LIB-VIDEO-COMPACT` | Compact Card | List view video |
| `LIB-VIDEO-PLAYER` | Full-Screen Player | YouTube embed modal |

---

## Phase 5: Insights / Training Feedback

**File:** `insights-moodboard.html`

### Insight States
| ID | State | Description |
|----|-------|-------------|
| `INS-READY-{PERSONA}` | Ready to Generate | New session logged |
| `INS-GENERATING` | Generating | Typewriter animation |
| `INS-COMPLETE-{PERSONA}` | Insight Displayed | Full insight with tips |
| `INS-ALREADY` | Already Generated | Come back tomorrow |
| `INS-EMPTY` | No Data | Need to log sessions first |

### Insight Components
| ID | Component | Description |
|----|-----------|-------------|
| `INS-TITLE` | Insight Title | AI-generated headline |
| `INS-BODY` | Insight Content | Coaching text |
| `INS-FOCUS` | Focus Areas | Key technique recommendations |
| `INS-VIDEO` | Recommended Videos | Links to UpNextVideos |

---

## Phase 6: Profile & Settings

**File:** `profile-settings-moodboard.html`

### Profile Screen
| ID | Section | Description |
|----|---------|-------------|
| `PROF-CARD-{PERSONA}` | Profile Card | Avatar, name, belt |
| `PROF-COMPLETE` | Completion Bar | Profile % complete |
| `PROF-STATS` | Training Stats | Years active, sessions |
| `PROF-BELT` | Belt History | Visual timeline |
| `PROF-NUDGE` | Profile Nudge | Progressive profiling card |

### Progressive Profiling Nudges
| ID | Milestone | Question |
|----|-----------|----------|
| `NUDGE-03` | Session 3 | Training start date |
| `NUDGE-05` | Session 5 | Stripes count |
| `NUDGE-07` | Session 7 | Gym name |
| `NUDGE-10` | Session 10 | Training goals |
| `NUDGE-12` | Session 12 | Target frequency |
| `NUDGE-15` | Session 15 | Current belt date |
| `NUDGE-18` | Session 18 | Birth year |

### Settings
| ID | Section | Description |
|----|---------|-------------|
| `SET-LOGGING` | Logging Preference | Voice vs Text toggle |
| `SET-NOTIF` | Notifications | Reminder toggles |
| `SET-DEMO` | Demo Mode | Persona switcher |
| `SET-ACCOUNT` | Account | Reset, export |
| `SET-INFO` | App Info | Version, legal |

---

## Phase 7: Session Logger

**File:** `logger-moodboard.html`

### Logger Flow
| ID | Phase | Description |
|----|-------|-------------|
| `LOG-ENTRY` | Entry | Core fields + Record button |
| `LOG-RECORD` | Recording | Voice capture, prompts |
| `LOG-PROCESS` | Processing | AI extraction spinner |
| `LOG-REVIEW` | Review | Filled form, editable |
| `LOG-SUCCESS` | Success | Confirmation message |

### Form Fields
| ID | Field | Description |
|----|-------|-------------|
| `LOG-TYPE` | Training Type | Gi / No-Gi / Open Mat |
| `LOG-DURATION` | Duration | Time picker |
| `LOG-SPAR` | Sparring | Yes/No toggle |
| `LOG-VOICE` | Voice Input | Microphone button |
| `LOG-TEXT` | Text Fallback | Textarea |

### Post-Session Messages (belt-adaptive)
| ID | Belt | Message Tone |
|----|------|--------------|
| `LOG-MSG-WHITE` | White | Encouragement, consistency |
| `LOG-MSG-BLUE` | Blue | Progress tracking, plateau |
| `LOG-MSG-PURPLE` | Purple | Depth, teaching |
| `LOG-MSG-BROWN` | Brown | Refinement, legacy |

---

## Phase 8: Belt Progress

**File:** `belt-progress-moodboard.html`

| ID | Section | Description |
|----|---------|-------------|
| `PROG-CURRENT-{PERSONA}` | Current Belt | Visual badge + time |
| `PROG-IBJJF` | IBJJF Requirements | Minimum time rules |
| `PROG-HISTORY` | Belt History | Promotion timeline |
| `PROG-VOLUME` | Session Volume | Total training stats |
| `PROG-ESTIMATE` | Next Belt Estimate | Honest projection |

---

## File Summary

| Phase | File | Status |
|-------|------|--------|
| 1 | `onboarding-moodboard.html` | COMPLETE |
| 2 | `stats-moodboard.html` | COMPLETE |
| 3 | `journal-moodboard.html` | COMPLETE |
| 4 | `library-moodboard.html` | COMPLETE |
| 5 | `insights-moodboard.html` | COMPLETE |
| 6 | `profile-settings-moodboard.html` | COMPLETE |
| 7 | `logger-moodboard.html` | COMPLETE |
| 8 | `belt-progress-moodboard.html` | PENDING |

---

## Source Files Reference

All design reviews pull styles and content from:

**Design System:**
- `/docs/design-system/styles.css` - Production CSS
- `/docs/design-system/tokens.md` - Token reference

**Components:**
- `/prototype/src/components/features/*.tsx` - Feature screens
- `/prototype/src/components/features/stats-modules/*.tsx` - Stats modules
- `/prototype/src/components/ui/*.tsx` - UI primitives

**Data:**
- `/prototype/src/data/personas.ts` - 6 test personas
- `/prototype/src/data/personaVideoRecommendations.ts` - Video content
- `/prototype/src/data/techniqueVideos.ts` - Video library
- `/prototype/src/config/belt-system/` - Belt personalization

---

## Review Process

1. **Open HTML in browser** to view full mood board
2. **Reference IDs** when providing feedback (e.g., "STATS-ATTACK needs...")
3. **Persona comparison** - scroll side-by-side to see belt variations
4. **Mobile preview** - phone frames show actual 375px viewport
