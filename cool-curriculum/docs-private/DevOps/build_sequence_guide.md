# Build Sequence Guide for Claude Code

## Objective
Build a functional prototype of the AI Lesson Planner with real LLM integration for Stage 1 (text generation) and mock outputs for Stage 2 (visual generation).

---

## Build Phases (Prioritized)

### Phase 1: Foundation & Core Shell (Build First)
**Deliverable:** Working application structure with navigation

**Tasks:**
1. **Set up React app structure**
   - Create component folders: `/components`, `/contexts`, `/utils`, `/pages`
   - Install dependencies: Tailwind CSS, lucide-react (icons), uuid
   
2. **Build AppContext (Global State)**
   - Create `AppContext.js` with Context Provider
   - State variables: `userSession`, `studentProfiles`, `rateLimitData`
   - Functions: `addProfile()`, `checkRateLimit()`, `recordRegeneration()`
   - Load from/save to localStorage on mount/updates

3. **Create basic routing**
   - Use React Router or simple state-based navigation
   - Routes: Dashboard, CreateMaterial, ProfileManager, Library

4. **Build shared components**
   - `Header` component with navigation
   - `Button` component (primary, secondary, disabled states)
   - `Modal` component (reusable wrapper)
   - `LoadingSpinner` component

**Acceptance Criteria:**
- ✓ App renders with header and navigation
- ✓ Can navigate between pages (even if empty)
- ✓ AppContext provides state to all components
- ✓ localStorage persistence works

---

### Phase 2: Profile Management (Build Second)
**Deliverable:** Functional student profile creation and storage

**Tasks:**
1. **Build ProfileManager page**
   - List view of existing profiles (empty state if none)
   - "Create New Profile" button opens modal

2. **Build ProfileForm component**
   - All form fields from spec (name, grade, characteristics, interests, reading level, notes)
   - Validation: name required, at least 1 interest selected
   - Save button generates UUID and stores in AppContext → localStorage
   - Cancel button closes modal

3. **Build ProfileCard component**
   - Display component showing profile summary
   - Used in ProfileList and ProfileSelector

**Test Data:** Create 2-3 hardcoded example profiles to seed the UI initially

**Acceptance Criteria:**
- ✓ Can create new profile with all fields
- ✓ Profiles persist across page refreshes
- ✓ Can view list of saved profiles
- ✓ Validation prevents invalid profiles

---

### Phase 3: Material Creation - Prompt Input (Build Third)
**Deliverable:** Prompt builder interface with profile selection

**Tasks:**
1. **Build PromptBuilder component**
   - Large textarea for freeform prompt (required field)
   - Collapsible "Optional Guides" section
   - Grade buttons (K-4), subject dropdown, material type selector
   - Language toggle (English/Spanish/Bilingual)

2. **Build ProfileSelector component**
   - Modal that opens from "Select Student Profiles" button
   - Shows saved profiles as selectable cards
   - Enforces max 3 selections
   - Disabled state when 3 selected
   - "Create New Profile" link opens ProfileForm

3. **Build RateLimitWarning component**
   - Checks rate limit before allowing generation
   - Shows countdown timer if limited (X minutes remaining)
   - Displays friendly message about token conservation

4. **Wire up "Generate Draft" button**
   - Validates prompt is not empty
   - Checks rate limit
   - If OK: navigate to DraftReview with loading state
   - Pass prompt + options to next phase

**Acceptance Criteria:**
- ✓ Prompt input validates before submission
- ✓ Can select up to 3 profiles
- ✓ Rate limit check works (mock initially, real in Phase 4)
- ✓ UI clearly shows required vs. optional fields

---

### Phase 4: LLM Integration - Stage 1 (Build Fourth) ⭐ CRITICAL
**Deliverable:** Real text generation from LLM API

**Tasks:**
1. **Create API utility functions** (`utils/llm.js`)
   - `buildPrompt(request)`: Constructs system + user prompt with profile context
   - `generateDraft(request)`: Calls LLM API (Claude or OpenAI)
   - `parseLLMResponse(rawText)`: Extracts JSON from response
   - Error handling for API failures

2. **Implement rate limiting logic** (`utils/rateLimit.js`)
   - `checkRateLimit()`: Returns allowed: boolean, minutesRemaining: number
   - `recordRegeneration(materialId)`: Stores timestamp in localStorage
   - `getRegenerationCount()`: Counts recent regenerations

3. **Set up API call flow**
   - When "Generate Draft" clicked → show loading state
   - Call LLM API with constructed prompt
   - Parse response into DraftOutput object
   - Handle errors gracefully (show error message, allow retry)
   - On success: navigate to DraftReview with data

4. **Environment variables**
   - Store API key securely (for prototype, can be in .env.local)
   - Note: In production, this would go through backend proxy

**LLM Prompt Template Example:**
```
You are an expert K-4 educator. Generate a worksheet for grade 2 math.

Output ONLY valid JSON in this exact format:
{
  "title": "string",
  "learningObjective": "string",
  "instructions": "string for students",
  "questions": [
    {"number": 1, "question": "text", "answer": "correct answer"}
  ]
}

Adapt content for this student profile:
Profile: Visual Learners Group A
- Interests: animals, nature, art
- Characteristics: visual_supports, scaffolding_needed
- Reading level: below_grade

Teacher's request: Create a worksheet about addition with regrouping using animal examples
```

**Acceptance Criteria:**
- ✓ LLM API call succeeds and returns text
- ✓ Response parsed into structured data
- ✓ Rate limiting prevents >3 calls in 10 minutes
- ✓ Error states handled gracefully
- ✓ Loading states show progress

---

### Phase 5: Draft Review & Editing (Build Fifth)
**Deliverable:** Interactive draft review with regeneration

**Tasks:**
1. **Build DraftReview component**
   - Display parsed LLM output (title, objective, instructions, questions)
   - If multiple profiles selected: tab navigation between variants
   - Each draft shown in clean, readable layout

2. **Implement inline editing**
   - Click title/objective/instructions to edit (contentEditable or textarea)
   - Questions editable individually
   - Save changes to component state

3. **Build Regenerate functionality**
   - "Regenerate" button checks rate limit first
   - If allowed: re-call LLM API with same prompt
   - Update draft with new response
   - Increment regeneration counter

4. **Build "Start Over" option**
   - Returns to PromptBuilder
   - Clears current draft
   - Does NOT count toward rate limit

5. **Build "Approve" button**
   - Validates draft has content
   - Navigates to VisualEditor (Stage 2)
   - Passes approved draft data

**Acceptance Criteria:**
- ✓ Draft content displays clearly
- ✓ Can edit text inline
- ✓ Regenerate works and respects rate limits
- ✓ Multiple variants shown in tabs (if applicable)
- ✓ Approve advances to next stage

---

### Phase 6: Visual Editor (Mock Output) (Build Sixth)
**Deliverable:** Mock visual representation of final material

**Tasks:**
1. **Build VisualEditor component**
   - Display banner: "Visual generation coming soon - this is a preview"
   - Show hardcoded mock worksheet based on material type
   - Use approved draft data to populate mock (title, some questions)

2. **Create mock visual templates**
   - Worksheet template: Header, instructions, question boxes, answer spaces
   - Quiz template: Multiple choice layout
   - Answer key template: Questions with answers shown

3. **Build toolbar**
   - Save button (non-functional, shows "Saved!" message)
   - Preview button (shows same content in modal)
   - Export button (shows "Export coming soon" message)
   - All buttons functional but don't actually process

4. **Add to mock library**
   - When "Save" clicked, store draft metadata to localStorage
   - Appears in Library page on next visit

**Acceptance Criteria:**
- ✓ Mock visual looks clean and professional
- ✓ Approved draft data populates mock correctly
- ✓ Toolbar buttons all interactive (even if limited function)
- ✓ Save action stores to library

---

### Phase 7: Dashboard & Library (Build Seventh)
**Deliverable:** Landing page with quick actions and library view

**Tasks:**
1. **Build Dashboard component**
   - Hero section with "Create New Lesson" CTA
   - "My Student Profiles" quick link
   - Recent materials preview (mock data + any saved from Phase 6)

2. **Build Library component**
   - Grid view of saved materials (mock + real saved)
   - Filter/sort options (grade, subject, date)
   - Click material → opens VisualEditor in view-only mode
   - Empty state if no materials

3. **Mock data for demonstration**
   - 3-5 hardcoded example materials
   - Mix of worksheets, quizzes, different grades

**Acceptance Criteria:**
- ✓ Dashboard is welcoming and clear
- ✓ Library shows materials in organized grid
- ✓ Mock data demonstrates variety
- ✓ Navigation between sections smooth

---

## Testing Checklist (Run After Each Phase)

### Functionality Tests
- [ ] All buttons clickable and provide feedback
- [ ] Forms validate inputs correctly
- [ ] Rate limiting enforces 3 regenerations/10 min
- [ ] localStorage persists data across sessions
- [ ] LLM API calls return expected format
- [ ] Error states show helpful messages
- [ ] Loading states appear during async operations

### UX Tests
- [ ] Navigation intuitive (no getting lost)
- [ ] Text readable (sufficient contrast, font size)
- [ ] Interactive elements have hover states
- [ ] Mobile responsive (at least tablet-friendly)
- [ ] No orphaned states (always a way forward/back)

### Edge Cases
- [ ] Empty states handled (no profiles, no library items)
- [ ] Invalid LLM responses parsed gracefully
- [ ] Rate limit edge (exactly at 10 minutes)
- [ ] Long prompt text doesn't break UI
- [ ] Special characters in inputs handled

---

## Known Limitations (Document for User)
1. **Stage 2 is mock** - Visual generation not yet implemented
2. **No real auth** - Session is browser-based only
3. **API key in client** - Not production-secure
4. **No backend** - Everything client-side for prototype
5. **localStorage limits** - Large libraries may hit browser limits
6. **Single device** - Data doesn't sync across devices

---

## Handoff Notes for Production
When transitioning to full build:
- Move API calls to backend proxy for security
- Replace mock library with database (Supabase)
- Implement Stage 2 visual generation with image AI
- Add user authentication (Auth0, Clerk, or Supabase Auth)
- Implement shareable profiles (requires backend)
- Add premium tier for unlimited variants
- Build export functionality (PDF generation)
- Add parent communication features (Feature 2 from docs)

---

## Priority if Time-Constrained
**Must Have:**
- Phases 1-5 (Foundation through Draft Review)
- Basic LLM integration working

**Nice to Have:**
- Phase 6 (Visual editor) can be simplified further
- Phase 7 (Dashboard) can use very basic layout

**Can Skip:**
- Advanced filtering in library
- Complex animations/transitions
- Detailed error logging