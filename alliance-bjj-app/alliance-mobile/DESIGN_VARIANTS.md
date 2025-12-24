# ALLY BJJ Video Library - Mobile UI Design

## 3 Design Variants for 200+ YouTube-Embedded BJJ Videos

---

## Overview

This document presents three distinct mobile UI design variants for the ALLY BJJ Video Library. Each variant maintains the core functionality (Search, Browse, Suggested For You) while offering a unique visual identity and user experience.

### Philosophy
> **Suggest videos that showcase the techniques users need to work on.**

The system analyzes user training data—belt level, class attendance, sparring notes—to identify gaps and recommend targeted instructional content. This transforms passive video consumption into active skill development.

---

## Variant 1: DARK DOJO

### Visual Identity
**Bold, aggressive, competition-focused**

A high-contrast dark theme with neon accents inspired by elite training facilities and competition environments. Perfect for serious practitioners who train at night or prefer reduced eye strain.

### Color Palette
| Element | Color | Hex |
|---------|-------|-----|
| Background | Deep Black | `#0A0A0A` |
| Surface | Dark Gray | `#1A1A1A` |
| Primary Accent | Neon Red | `#FF3B3B` |
| Secondary | Gold | `#FFD700` |
| Tertiary | Cyan | `#00F5FF` |
| Text | Pure White | `#FFFFFF` |
| Muted Text | Gray | `#A0A0A0` |

### Typography
- **Headings**: Ultra-bold (900 weight), uppercase, 2px letter-spacing
- **Body**: Regular weight (400), high contrast
- **Accent Text**: Bold (700), 1px letter-spacing

### Key UI Elements
- **Cards**: Sharp 4px radius, 1px borders, red glow shadows
- **Buttons**: Angular, minimal radius, solid fills
- **Icons**: Outlined style, neon accent colors
- **Progress Bars**: Glowing red fills on dark tracks

### Ideal For
- Night-time training warriors
- Competition-focused practitioners
- Users who prefer dark mode interfaces
- Gyms with industrial/underground aesthetics

### Screenshot Reference Layout
```
┌─────────────────────────────────┐
│ ▣ ALLY                    🔔 📑 │
│   BJJ VIDEO LIBRARY             │
├─────────────────────────────────┤
│  🔍 Search │ ⊞ Browse │ ✨ For You │
├─────────────────────────────────┤
│ ▓▓▓ CATEGORIES ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │🛡    │ │➡    │ │✋    │     │
│ │Guards│ │Pass │ │Subs  │     │
│ │45 vid│ │38 vid│ │52 vid│     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │
│ ▓▓▓ EXPERT COACHES ▓▓▓▓▓▓▓▓▓▓ │
│ ○ ○ ○ ○                        │
│ Danaher Ryan Giles Jones       │
└─────────────────────────────────┘
```

---

## Variant 2: CLEAN ACADEMY

### Visual Identity
**Minimal, educational, Grapplers Guide-inspired**

A clean white layout with strategic gold accents that emphasizes readability and organization. Inspired by the Grapplers Guide interface—the gold standard for BJJ instructional platforms.

### Color Palette
| Element | Color | Hex |
|---------|-------|-----|
| Background | Off-White | `#FAFAFA` |
| Surface | Pure White | `#FFFFFF` |
| Primary | Black | `#000000` |
| Secondary | Gold | `#D4AF37` |
| Accent | Blue | `#2563EB` |
| Text | Near-Black | `#1A1A1A` |
| Muted Text | Gray | `#6B7280` |
| Border | Light Gray | `#E5E7EB` |

### Typography
- **Headings**: Bold (700 weight), 0.5px letter-spacing
- **Body**: Regular weight (400), optimal line height
- **Accent Text**: Semi-bold (600)

### Key UI Elements
- **Cards**: Soft 12px radius, subtle borders, light shadows
- **Buttons**: Rounded 8px, clean outlines or solid fills
- **Icons**: Outlined style, black or gold
- **Progress Bars**: Gold fills on light gray tracks

### Key Features
1. **Clean Vertical Layout**: Easy scanning of technique categories
2. **Category Lists**: Guards, Submissions, Escapes, etc.
3. **Expert Coach Grid**: Photo avatars with video counts
4. **Progress Trackers**: Weekly study goals
5. **Custom Playlists**: Favorites, Watch Later, Completed

### Ideal For
- Educational institutions and academies
- Users who value clarity and organization
- Daytime/well-lit training environments
- Practitioners who prioritize learning structure

### Screenshot Reference Layout
```
┌─────────────────────────────────┐
│ ◉ ALLY                    🔔 📑 │
│   BJJ Video Library             │
├─────────────────────────────────┤
│  🔍 Search │ ⊞ Browse │ ✨ For You │
├─────────────────────────────────┤
│ CATEGORIES                      │
│ ┌───────────────┐ ┌────────────┐│
│ │ 🛡 Guards      │ │ ➡ Passing ││
│ │ 45 videos     │ │ 38 videos  ││
│ └───────────────┘ └────────────┘│
│ ┌───────────────┐ ┌────────────┐│
│ │ ✋ Submissions │ │ 🏃 Escapes ││
│ │ 52 videos     │ │ 31 videos  ││
│ └───────────────┘ └────────────┘│
│                                 │
│ EXPERT COACHES ─────────────────│
│ [Photo] [Photo] [Photo] [Photo] │
│  45      38      42      28     │
└─────────────────────────────────┘
```

---

## Variant 3: GRADIENT FLOW

### Visual Identity
**Modern, dynamic, Gen-Z appeal**

A contemporary design featuring purple-to-blue gradients with glass morphism effects. Appeals to younger practitioners and those who appreciate app-native, social media-inspired aesthetics.

### Color Palette
| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark Purple | `#0F0F23` |
| Surface | Glass (8% white) | `rgba(255,255,255,0.08)` |
| Primary | Violet | `#8B5CF6` |
| Secondary | Cyan | `#06B6D4` |
| Accent | Pink | `#F472B6` |
| Text | White | `#FFFFFF` |
| Muted Text | 70% White | `rgba(255,255,255,0.7)` |
| Border | 10% White | `rgba(255,255,255,0.1)` |

### Typography
- **Headings**: Extra-bold (800 weight), -0.5px letter-spacing (tight)
- **Body**: Regular weight (400)
- **Accent Text**: Semi-bold (600)

### Key UI Elements
- **Cards**: Generous 20px radius, glass effect, gradient shadows
- **Buttons**: Rounded 16px, gradient fills or glass backgrounds
- **Icons**: Filled style for active, outlined for inactive
- **Progress Bars**: Gradient fills (purple to cyan)
- **Backgrounds**: Subtle animated gradients

### Special Effects
- Glass morphism (backdrop blur)
- Gradient overlays on thumbnails
- Animated transitions
- Floating action buttons

### Ideal For
- Younger practitioners (Gen-Z, Millennials)
- Social media-savvy users
- Modern gym brands
- Apps targeting mobile-first audiences

### Screenshot Reference Layout
```
┌─────────────────────────────────┐
│ ◉ ALLY                    🔔 📑 │
│   BJJ Video Library             │
│═════════════════════════════════│
│  🔍 Search  ⊞ Browse  ✨ For You │
├─────────────────────────────────┤
│ ╭─────────────────────────────╮ │
│ │ ✨ YOUR TRAINING FOCUS      │ │
│ │                             │ │
│ │ Focus on: escapes,         │ │
│ │ guard passing, leg locks   │ │
│ ╰─────────────────────────────╯ │
│                                 │
│ ╭─────╮ ╭─────╮ ╭─────╮        │
│ │ 12  │ │2:45m│ │  3  │        │
│ │Vids │ │Time │ │Cats │        │
│ ╰─────╯ ╰─────╯ ╰─────╯        │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░ 65%            │
└─────────────────────────────────┘
```

---

## Core Features (All Variants)

### 1. Search Tab
- **Instant Search**: Real-time results as you type
- **Quick Filters**: Tap to search common terms
- **Trending Searches**: Popular queries from the community
- **Voice Search**: (Future) Speak your query

### 2. Browse Tab
- **Category Grid**: Visual cards for each technique category
  - Guards (Closed, Half, Open, Butterfly, DLR, Spider)
  - Guard Passing (Pressure, Speed, Body Lock, Leg Drag)
  - Submissions (Chokes, Armlocks, Leg Locks, Triangles)
  - Dominant Positions (Mount, Side Control, Back)
  - Escapes (Mount, Side, Back, Submission Defense)
  - Takedowns (Single Leg, Double Leg, Trips, Clinch)
  - Turtle & Wrestling
  - Fundamentals

- **Expert Coach Grid**: Instructor profiles with specialties
  - John Danaher (Leg Locks, Back Takes)
  - Gordon Ryan (Passing, Mount Control)
  - Lachlan Giles (Escapes, Leg Locks)
  - Craig Jones (Triangles, No-Gi)
  - Stephan Kesting (Fundamentals)

- **Playlists**: User-created collections
  - Favorites
  - Watch Later
  - Completed
  - Custom Playlists

### 3. Suggested For You Tab
- **Training Focus Banner**: AI-identified weak areas
- **Progress Tracker**: Weekly viewing stats and goals
- **Personalized Recommendations**: Based on:
  - Current belt level
  - Watched video history
  - Training attendance
  - Identified technique gaps

---

## Video Card Components

### Horizontal Card (List View)
```
┌──────────────────────────────────────┐
│ ┌───────────┐                        │
│ │ Thumbnail │ Title of the Video    │
│ │   12:30   │ Instructor Name       │
│ │    ✓      │ [Beginner] 245K views │
│ └───────────┘                        │
└──────────────────────────────────────┘
```

### Compact Card (Horizontal Scroll)
```
┌────────────┐
│ Thumbnail  │
│   12:30    │
├────────────┤
│ Title...   │
│ Instructor │
└────────────┘
```

### Video Detail Modal
- Full-width video player (YouTube embed)
- Title, instructor, duration, views
- Action buttons: Favorite, Watch Later, Share, Add to Playlist
- Description text
- Tags (clickable for related search)
- Belt level recommendations

---

## Progress Tracking Philosophy

### Why We Suggest Videos

The ALLY system doesn't just show random videos—it analyzes:

1. **Belt Level**: Appropriate difficulty for current rank
2. **Training History**: Classes attended, techniques drilled
3. **Viewing Patterns**: What you've watched and rewatched
4. **Weak Areas**: Positions where you struggle (self-reported or coach-identified)
5. **Competition Prep**: If preparing for a tournament, focus on specific areas

### Example Recommendation Logic

```
User: Blue Belt, 3 stripes
Training: Mostly Gi, 3x/week
Weak Areas: Side control escapes, guard retention
Last Watched: Triangle choke videos

Recommendations:
1. Side Control Escapes (Gap)
2. Guard Retention Concepts (Gap)
3. Triangle Setup Variations (Continue learning)
4. Mount Escapes (Blue belt essential)
5. Half Guard Sweeps (Belt-appropriate)
```

---

## Technical Implementation

### Theme Switching
The app supports runtime theme switching via a selector at the top of the screen. In production, this would be a user preference stored in AsyncStorage.

### Data Structure
Videos are organized by:
- `category`: Main technique category
- `subcategory`: Specific technique type
- `beltLevel`: Array of appropriate belts
- `difficulty`: beginner/intermediate/advanced
- `tags`: Searchable keywords

### YouTube Integration
Videos are embedded YouTube content. The app:
1. Shows thumbnail preview
2. Opens video in modal player
3. Tracks watch progress locally
4. Syncs with user's playlist preferences

---

## Recommended Variant Selection

| Gym Type | Recommended Variant |
|----------|---------------------|
| Traditional Academy | Clean Academy |
| Competition Team | Dark Dojo |
| Modern/Boutique Gym | Gradient Flow |
| Kids Program | Clean Academy |
| Online-Only School | Gradient Flow |

---

## Next Steps

1. **User Testing**: A/B test variants with real users
2. **Analytics Integration**: Track engagement per variant
3. **Personalization**: Allow users to choose their theme
4. **Coach Notes**: Add instructor commentary timestamps
5. **Offline Mode**: Download videos for travel
6. **Social Features**: Share progress with training partners

---

*Document Version: 1.0*
*Last Updated: December 2024*
*Author: ALLY Development Team*
