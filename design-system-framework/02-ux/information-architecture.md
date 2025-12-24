# Information Architecture

> **Status:** Template — Fill in during 02-UX phase
>
> **Instructions:** Define how content and functionality is organized. The goal: users can find anything in 3 clicks/taps. Navigation should be predictable, not clever.

---

## IA Overview

**Product:** [Name]
**Platform:** [Web / Mobile / Both]
**Date:** [Date]
**Based on:** [User stories, flows, content inventory]

---

## Site/App Structure

*The complete hierarchy of screens/pages.*

```
[Product Name]
│
├── [Section 1: e.g., Home]
│   └── [Description of what's here]
│
├── [Section 2: e.g., Dashboard]
│   ├── [Subsection 2.1]
│   ├── [Subsection 2.2]
│   └── [Subsection 2.3]
│
├── [Section 3: e.g., Content Area]
│   ├── [List View]
│   ├── [Detail View]
│   └── [Create/Edit View]
│
├── [Section 4: e.g., Settings]
│   ├── [Profile]
│   ├── [Preferences]
│   └── [Account]
│
└── [Utility]
    ├── [Help]
    ├── [Support]
    └── [Legal]
```

---

## Navigation Model

### Primary Navigation

*Always visible. The main way users move between major areas.*

| Label | Destination | Icon (if applicable) | Notes |
|-------|-------------|----------------------|-------|
| [Label 1] | [Screen/Section] | [Icon name] | [Notes] |
| [Label 2] | [Screen/Section] | [Icon name] | [Notes] |
| [Label 3] | [Screen/Section] | [Icon name] | [Notes] |
| [Label 4] | [Screen/Section] | [Icon name] | [Notes] |

**Navigation pattern:**
- [ ] Bottom tab bar (mobile)
- [ ] Top navigation bar
- [ ] Side navigation (hamburger)
- [ ] Combination
- [ ] Other: [Describe]

**Maximum primary nav items:** [Recommended: 5 or fewer]

---

### Secondary Navigation

*Navigation within sections. Context-dependent.*

| Section | Secondary Nav Items |
|---------|---------------------|
| [Section 1] | [Sub-item 1], [Sub-item 2], [Sub-item 3] |
| [Section 2] | [Sub-item 1], [Sub-item 2] |
| [Section 3] | [Sub-item 1], [Sub-item 2], [Sub-item 3], [Sub-item 4] |

**Pattern:** [Tabs / Segmented control / Sidebar / Dropdown]

---

### Utility Navigation

*Always accessible but not primary. Settings, help, profile.*

| Item | Location | Access Method |
|------|----------|---------------|
| Profile/Account | [Location] | [How accessed] |
| Settings | [Location] | [How accessed] |
| Help | [Location] | [How accessed] |
| Logout | [Location] | [How accessed] |

---

### Contextual Navigation

*Navigation that appears based on context (e.g., back buttons, breadcrumbs).*

| Context | Navigation Elements |
|---------|---------------------|
| [Detail view] | [Back button, related items] |
| [Edit mode] | [Cancel, Save] |
| [Multi-step flow] | [Progress indicator, back/next] |

---

## Screen Inventory

*All screens in the product with their purpose.*

### Core Screens

| Screen | Purpose | Primary Action | Entry Points |
|--------|---------|----------------|--------------|
| [Home] | [Purpose] | [Action] | [How users get here] |
| [Dashboard] | [Purpose] | [Action] | [How users get here] |
| [List View] | [Purpose] | [Action] | [How users get here] |
| [Detail View] | [Purpose] | [Action] | [How users get here] |
| [Create/Edit] | [Purpose] | [Action] | [How users get here] |

### Supporting Screens

| Screen | Purpose | Primary Action | Entry Points |
|--------|---------|----------------|--------------|
| [Settings] | [Purpose] | [Action] | [Entry points] |
| [Profile] | [Purpose] | [Action] | [Entry points] |
| [Search Results] | [Purpose] | [Action] | [Entry points] |
| [Help] | [Purpose] | [Action] | [Entry points] |

### System Screens

| Screen | Purpose | Trigger |
|--------|---------|---------|
| [Login] | [Authentication] | [When] |
| [Onboarding] | [First-run experience] | [When] |
| [Error Page] | [Handle failures] | [When] |
| [Offline] | [No connection] | [When] |

---

## Content Types

*The different types of content that appear in the product.*

| Content Type | Description | Where It Appears | Template Needed |
|--------------|-------------|------------------|-----------------|
| [Type 1: e.g., "Session"] | [What it is] | [Screens] | [Yes/No] |
| [Type 2: e.g., "Note"] | [What it is] | [Screens] | [Yes/No] |
| [Type 3: e.g., "User Profile"] | [What it is] | [Screens] | [Yes/No] |
| [Type 4: e.g., "Notification"] | [What it is] | [Screens] | [Yes/No] |

### Content Type Details

#### [Content Type 1]

**Attributes:**
- [Attribute 1]: [Type - text, date, number, etc.]
- [Attribute 2]: [Type]
- [Attribute 3]: [Type]
- [Attribute 4]: [Type]

**Display variations:**
- Card view: [What shows]
- List view: [What shows]
- Detail view: [What shows]

**Actions:**
- [Create / Edit / Delete / Share / etc.]

---

## URL Structure (Web)

*Clean, predictable, human-readable URLs.*

### Pattern
```
/[section]/[resource]/[id]/[action]
```

### Examples

| Screen | URL | Notes |
|--------|-----|-------|
| Home | `/` | Root |
| Dashboard | `/dashboard` | |
| List | `/[resources]` | Plural noun |
| Detail | `/[resources]/[id]` | |
| Create | `/[resources]/new` | |
| Edit | `/[resources]/[id]/edit` | |
| Settings | `/settings` | |
| Profile | `/settings/profile` | Nested under settings |

### URL Principles
- [ ] Lowercase only
- [ ] Hyphens for multi-word (not underscores)
- [ ] No trailing slashes
- [ ] IDs are opaque (slugs or UUIDs, not sequential)
- [ ] Deep links work independently

---

## Page States

*Every screen can be in multiple states. Define them all.*

### State Matrix

| Screen | Empty | Loading | Populated | Error | Offline |
|--------|-------|---------|-----------|-------|---------|
| [Dashboard] | [What shows] | [What shows] | [Normal] | [What shows] | [What shows] |
| [List] | [What shows] | [What shows] | [Normal] | [What shows] | [What shows] |
| [Detail] | N/A | [What shows] | [Normal] | [What shows] | [What shows] |
| [Create] | N/A | [What shows] | N/A | [What shows] | [What shows] |

### Empty State Principles
- [ ] Explain why it's empty
- [ ] Show how to add content
- [ ] Never leave users stranded

### Loading State Principles
- [ ] Show progress when known
- [ ] Show activity when unknown
- [ ] Consider skeleton screens

### Error State Principles
- [ ] Explain what happened
- [ ] Provide recovery action
- [ ] Never blame the user

---

## Search & Discovery

*How users find content.*

### Search

**Search scope:**
- [ ] Global (everything)
- [ ] Section-specific
- [ ] Both (with toggle)

**Search features:**
- [ ] Autocomplete/suggestions
- [ ] Recent searches
- [ ] Search filters
- [ ] Search within results

**Search results:**
- [ ] Grouped by type
- [ ] Sortable
- [ ] Filterable

### Filtering & Sorting

| Content Type | Filter Options | Sort Options |
|--------------|----------------|--------------|
| [Type 1] | [Filter 1], [Filter 2] | [Sort 1], [Sort 2] |
| [Type 2] | [Filter 1], [Filter 2] | [Sort 1], [Sort 2] |

### Browse/Discover

- [ ] Categories/tags
- [ ] Recent items
- [ ] Favorites/saved
- [ ] Recommendations
- [ ] Popular/trending

---

## Cross-References

*How content relates to other content.*

| From | To | Relationship | Display |
|------|-----|--------------|---------|
| [Type 1] | [Type 2] | [Relationship] | [How shown] |
| [Type 2] | [Type 3] | [Relationship] | [How shown] |

---

## Modals & Overlays

*Content that appears above the main UI.*

| Modal/Overlay | Purpose | Trigger | Dismissal |
|---------------|---------|---------|-----------|
| [Confirmation] | [Verify destructive action] | [Delete click] | [Confirm/Cancel] |
| [Quick create] | [Add item without leaving] | [+ button] | [Save/Cancel] |
| [Detail preview] | [Quick look without nav] | [Item hover/tap] | [Click outside] |

### Modal Principles
- [ ] Use sparingly
- [ ] Clear close mechanism
- [ ] Don't stack modals
- [ ] Consider mobile behavior

---

## Accessibility Navigation

*How users navigate without a mouse.*

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Skip links for main content
- [ ] Escape closes modals

### Screen Reader
- [ ] Landmarks defined (header, nav, main, footer)
- [ ] Headings hierarchy (h1 → h2 → h3)
- [ ] ARIA labels where needed

### Navigation Shortcuts (if applicable)
| Shortcut | Action |
|----------|--------|
| [Key] | [Action] |
| [Key] | [Action] |

---

## IA Validation

### 3-Click Test

For common tasks, can users complete them in 3 actions or fewer?

| Task | Start | Steps | Pass? |
|------|-------|-------|-------|
| [Core task 1] | [Start point] | [List steps] | [Yes/No] |
| [Core task 2] | [Start point] | [List steps] | [Yes/No] |
| [Core task 3] | [Start point] | [List steps] | [Yes/No] |

### Navigation Clarity

- [ ] Labels are clear and unambiguous
- [ ] Icons are recognizable (or have labels)
- [ ] Current location is always clear
- [ ] Users can always get back to home

---

## Checklist

Before proceeding:

- [ ] All screens are mapped
- [ ] Navigation hierarchy is logical
- [ ] Content types are defined
- [ ] All page states are considered
- [ ] Search/discovery is planned
- [ ] URL structure is clean (if web)
- [ ] Accessibility navigation is addressed
- [ ] 3-click test passes for core tasks

---

*Information architecture complete. Proceed to `content-strategy.md`*
