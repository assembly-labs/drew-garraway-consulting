# UI/UX Wireframes - Text Descriptions

## Design Principles
- **Educator-friendly:** Clear labels, minimal jargon, helpful tooltips
- **Scannable:** Visual hierarchy with headers, whitespace, grouping
- **Efficient:** Minimize clicks to common actions
- **Reassuring:** Show progress, confirm actions, explain limitations
- **Accessible:** WCAG AA contrast, keyboard navigation, clear focus states

## Color Palette (Tailwind CSS)
- **Primary:** Blue-600 (CTAs, active states) 
- **Secondary:** Gray-700 (text), Gray-200 (borders)
- **Success:** Green-600 (approvals, saved states)
- **Warning:** Yellow-500 (rate limits, cautions)
- **Error:** Red-600 (errors, validation)
- **Background:** White, Gray-50, Gray-100

---

## Screen 1: Dashboard (Landing Page)

```
┌────────────────────────────────────────────────────────────┐
│ Header: [Logo] AI Lesson Planner     [Profiles] [Library] │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ╔══════════════════════════════════════════════════╗   │
│   ║  Create Your First Lesson Material              ║   │
│   ║  [+ Create New Lesson] ← Big blue button        ║   │
│   ╚══════════════════════════════════════════════════╝   │
│                                                            │
│   Quick Actions:                                          │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │ 📚 My       │  │ 👥 Student  │  │ 🔍 Browse   │    │
│   │ Library     │  │ Profiles    │  │ Templates   │    │
│   │             │  │             │  │ (Soon!)     │    │
│   └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                            │
│   Recent Materials:                                       │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│   │ 📊       │ │ 🦁       │ │ 📖       │               │
│   │ Adding   │ │ Animal   │ │ Sight    │               │
│   │ Grade 2  │ │ Quiz     │ │ Words    │               │
│   │ Oct 1    │ │ Oct 5    │ │ Oct 8    │               │
│   └──────────┘ └──────────┘ └──────────┘               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Hero section: Centered, max-width 600px, padding 48px
- Quick action cards: 3-column grid on desktop, stack on mobile
- Recent materials: Horizontal scroll or 3-column grid
- Cards have subtle shadow (shadow-sm), rounded corners (rounded-lg)
- Hover states: lift effect (shadow-md) + border color change

**Interaction:**
- "Create New Lesson" → navigates to PromptBuilder
- Quick action cards → navigate to respective sections
- Recent materials → click opens VisualEditor in view mode

---

## Screen 2: PromptBuilder (Material Creation Input)

```
┌────────────────────────────────────────────────────────────┐
│ [← Back] Create New Lesson Material                       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   What would you like to create?                          │
│   ┌────────────────────────────────────────────────────┐ │
│   │                                                    │ │
│   │  [Large textarea - 6 rows]                        │ │
│   │  "Example: Create a worksheet about addition      │ │
│   │   with regrouping for 2nd graders who love       │ │
│   │   animals..."                                     │ │
│   │                                                    │ │
│   └────────────────────────────────────────────────────┘ │
│                                                            │
│   [▼ Optional: Guide my prompt] ← Collapsible section     │
│   ┌────────────────────────────────────────────────────┐ │
│   │ Grade Level:                                       │ │
│   │ [K] [1] [2] [3] [4] ← Button group               │ │
│   │                                                    │ │
│   │ Subject: [Math ▼] Material: [Worksheet ▼]        │ │
│   │ Language: [English] [Spanish] [Bilingual]        │ │
│   └────────────────────────────────────────────────────┘ │
│                                                            │
│   🎯 Differentiation Options:                             │
│   ┌────────────────────────────────────────────────────┐ │
│   │ ☐ Create variations for different students        │ │
│   │   [Select Student Profiles] ← Opens modal         │ │
│   │                                                    │ │
│   │   Selected: (0/3)                                 │ │
│   │   [No profiles selected yet]                      │ │
│   └────────────────────────────────────────────────────┘ │
│                                                            │
│   [Generate Draft] ← Primary blue button, right-aligned   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Max-width 800px, centered
- Textarea: Focus state with blue ring, 16px font size
- Optional guides: Smooth collapse/expand transition
- Button group: Active state with filled background
- Differentiation section: Light blue background (bg-blue-50)

**Validation States:**
- Prompt empty → Generate button disabled (gray, cursor-not-allowed)
- >3 profiles selected → Selector disabled with warning

**Rate Limit Warning (if triggered):**
```
┌────────────────────────────────────────────────────────┐
│ ⚠️ Generation Limit Reached                            │
│ You've used 3 regenerations in the last 10 minutes.   │
│ Next available in: 7 minutes                           │
│ This helps us conserve tokens and keep costs low!     │
└────────────────────────────────────────────────────────┘
```

---

## Screen 3: ProfileSelector Modal

```
┌─────────────────────────────────────────────────────────┐
│ Select Student Profiles (0/3 selected)       [✕ Close] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐  ┌────────────────┐               │
│  │ ☐ Visual       │  │ ☑ Sports       │               │
│  │   Learners     │  │   Enthusiasts  │               │
│  │                │  │                │               │
│  │ Grade: 1-2     │  │ Grade: 2-3     │               │
│  │ 🎨 Art, Nature │  │ ⚽ Sports, Cars│               │
│  │ 📖 Below grade │  │ 📖 On grade    │               │
│  └────────────────┘  └────────────────┘               │
│                                                         │
│  ┌────────────────┐  ┌────────────────┐               │
│  │ ☐ IEP Group    │  │ ☐ ELL Students │               │
│  │   (Disabled)   │  │                │               │
│  │ Max 3 reached  │  │ Grade: K-1     │               │
│  │                │  │ 🌍 Bilingual   │               │
│  └────────────────┘  └────────────────┘               │
│                                                         │
│  [+ Create New Profile]                                │
│                                                         │
│  [Cancel]  [Apply Selection]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Modal: 600px wide, centered overlay with backdrop blur
- Profile cards: 2-column grid, 150px tall
- Selected state: Blue border (border-2 border-blue-600)
- Disabled state: Gray overlay, lower opacity
- Icons and emojis for quick visual identification

---

## Screen 4: DraftReview (Stage 1 Output)

```
┌────────────────────────────────────────────────────────────┐
│ [← Back to Edit] Draft Review                             │
├────────────────────────────────────────────────────────────┤
│  Tabs: [Standard Profile] [Sports Enthusiasts]           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  📄 Addition with Regrouping - Animal Edition             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Learning Objective: (editable on click)            │  │
│  │ Students will add two 2-digit numbers with         │  │
│  │ regrouping, using animal-themed examples to...     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  Instructions for Students:                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Look at the animal pictures below. Add the         │  │
│  │ numbers together. If you need to regroup, use...   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  Questions:                                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1. There are 23 rabbits and 19 more hop in.       │  │
│  │    How many rabbits in total? _____                │  │
│  │    Answer: 42                                      │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ 2. A zoo has 47 monkeys. 36 more arrive.          │  │
│  │    How many monkeys now? _____                     │  │
│  │    Answer: 83                                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ⚠️ Review carefully before continuing! AI may make       │
│     errors. You've used 1/3 regenerations.                │
│                                                            │
│  [✏️ Edit Text] [🔄 Regenerate] [✅ Looks Good]          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Max-width 900px, centered
- Content sections: White cards with shadow-sm, rounded-lg
- Editable sections: Light yellow bg on hover (bg-yellow-50)
- Question cards: Separated with borders, numbered prominently
- Buttons: Fixed bottom bar or floating action bar

**Regenerate Flow:**
1. Click "Regenerate" → check rate limit
2. If allowed: Show loading spinner, replace content
3. If blocked: Show rate limit warning

---

## Screen 5: VisualEditor (Stage 2 Mock)

```
┌────────────────────────────────────────────────────────────┐
│ [🔙 Back] Visual Editor                                    │
│ [💾 Save] [👁️ Preview] [📤 Export]  ← Toolbar            │
├────────────────────────────────────────────────────────────┤
│  ℹ️ Visual generation coming soon - this is a preview     │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │        MOCK WORKSHEET PREVIEW                      │  │
│  │  ╔════════════════════════════════════════════╗   │  │
│  │  ║  Addition with Regrouping - Animals       ║   │  │
│  │  ║  Grade 2 | Name: ________________         ║   │  │
│  │  ╚════════════════════════════════════════════╝   │  │
│  │                                                    │  │
│  │  Instructions:                                     │  │
│  │  Look at the pictures. Add the numbers.            │  │
│  │                                                    │  │
│  │  [🐰 rabbit icon] 23 + 19 = ____                 │  │
│  │  ┌─────┐                                          │  │
│  │  │Work │                                          │  │
│  │  │Space│                                          │  │
│  │  └─────┘                                          │  │
│  │                                                    │  │
│  │  [🐵 monkey icon] 47 + 36 = ____                 │  │
│  │  ┌─────┐                                          │  │
│  │  │Work │                                          │  │
│  │  │Space│                                          │  │
│  │  └─────┘                                          │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  This is a placeholder. Final version will include:       │
│  ✓ Custom illustrations                                   │
│  ✓ Interactive drag-and-drop (digital preview)            │
│  ✓ Print-optimized layout                                 │
│  ✓ Answer key generation                                  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Toolbar: Sticky top bar with action buttons
- Preview area: Centered, 8.5x11" aspect ratio simulation
- Mock worksheet: Border, padding, clean typography
- Banner: Blue background (bg-blue-100), dismissible

**Button Actions (Mock):**
- Save → Shows toast "Saved to library!" 
- Preview → Opens modal with same content
- Export → Shows "Export coming soon" modal

---

## Screen 6: ProfileManager

```
┌────────────────────────────────────────────────────────────┐
│ [← Back] Student Profiles                                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Manage learning profiles (no student names or PII)       │
│  [+ Create New Profile]  [📤 Share] (coming soon)         │
│                                                            │
│  Your Profiles:                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │ 👥 Visual Learners Group A        [✏️ Edit] [🗑️]│    │
│  │ Grade: 1-2 | Reading: Below Grade              │    │
│  │ Interests: 🎨 Art, 🌿 Nature, 🦋 Animals        │    │
│  │ Characteristics: Visual supports, Scaffolding   │    │
│  │ Created: Oct 1, 2025                            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
│  ┌──────────────────────────────────────────────────┐    │
│  │ ⚽ Sports Enthusiasts              [✏️ Edit] [🗑️]│    │
│  │ Grade: 2-3 | Reading: On Grade                  │    │
│  │ Interests: ⚽ Sports, 🚗 Automotive, 🏗️ Building│    │
│  │ Characteristics: Active learners                │    │
│  │ Created: Oct 5, 2025                            │    │
│  └──────────────────────────────────────────────────┘    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Layout Details:**
- Profile cards: Full-width, stacked vertically
- Each card: White bg, shadow-sm, padding 20px
- Icons/emojis: Large (24px) for visual scanning
- Edit/Delete: Icon buttons, hover state shows tooltip

**Empty State:**
```
┌────────────────────────────────────────────────────┐
│  No profiles yet!                                  │
│  Create student profiles to differentiate lessons  │
│  [+ Create Your First Profile]                     │
└────────────────────────────────────────────────────┘
```

---

## Screen 7: ProfileForm Modal

```
┌─────────────────────────────────────────────────────────┐
│ Create Student Profile                       [✕ Close] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Profile Name: *required                               │
│  [_____________________________]                       │
│  (e.g., "Visual Learners Group A")                    │
│                                                         │
│  Grade Range: *required                                │
│  [K] [1] [2] [3] [4] ← Multi-select buttons           │
│                                                         │
│  Learning Characteristics:                             │
│  ☐ IEP/504 accommodations    ☐ Visual supports        │
│  ☐ English Language Learners ☐ Scaffolding needed     │
│  ☐ Advanced/Gifted           ☐ Other: [_______]       │
│                                                         │
│  Interest Themes: *select at least one                 │
│  ☐ Sports    ☐ Animals    ☐ Space     ☐ Automotive    │
│  ☐ Nature    ☐ Music      ☐ Art       ☐ Food/Cooking  │
│  ☐ Technology ☐ Building  ☐ Fantasy   ☐ Science       │
│                                                         │
│  Reading Level:                                         │
│  ○ Below grade  ○ On grade  ○ Above grade              │
│                                                         │
│  Notes (optional):                                      │
│  [____________________________________]                 │
│  [____________________________________]                 │
│                                                         │
│  [Cancel]  [Save Profile]                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Validation:**
- Name field: Red border if empty on submit
- Interests: Show error message "Select at least one interest"
- Save button: Disabled until valid

---

## Responsive Behavior

**Desktop (>1024px):**
- Side-by-side layouts for form + preview
- 3-column grids for cards
- Fixed sidebar navigation

**Tablet (768-1024px):**
- 2-column grids
- Stacked form sections
- Collapsible navigation

**Mobile (<768px):**
- Single column, full-width
- Bottom navigation bar
- Simplified modals (full-screen)

---

## Interaction Patterns

**Loading States:**
- Spinner with text: "Generating draft... ~15 seconds"
- Progress bar if possible (mock progress)
- Skeleton screens for content loading

**Success Feedback:**
- Green toast notification (top-right)
- Checkmark icons
- Brief success message (auto-dismiss after 3s)

**Error Handling:**
- Red banner at top of form
- Inline validation messages below fields
- Retry button with clear action

**Hover States:**
- Cards: slight lift (transform: translateY(-2px))
- Buttons: background color shift, cursor pointer
- Links: underline, color change

**Focus States:**
- Blue ring (ring-2 ring-blue-500)
- High contrast for keyboard navigation
- Skip to content link for accessibility

---

## Accessibility Notes
- All interactive elements keyboard accessible (tab order logical)
- Color not sole indicator (use icons + text)
- Alt text for all images/icons
- ARIA labels for screen readers
- Sufficient contrast ratios (4.5:1 minimum)
- Error messages associated with form fields (aria-describedby)