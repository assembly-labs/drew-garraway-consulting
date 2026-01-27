# Journal Page - Handoff Status & Action Plan

**Last Updated:** January 25, 2026
**Status:** Planning Complete, Implementation Pending
**Related:** `JOURNAL_PRD.md` (same directory)

---

## Current State Assessment

| Asset | Status | Location | Gap |
|-------|--------|----------|-----|
| **Journal PRD** | Complete | `./JOURNAL_PRD.md` | Standalone, not integrated with main docs |
| **FEATURES.md** | Exists | `/docs/product/FEATURES.md` | Missing new Journal features |
| **Prototype Code** | Working | `/prototype/src/components/features/` | Missing: infinite scroll, delete, backdate, worked/struggles |
| **Types/Data Model** | Exists | `/prototype/src/types/` | Missing: `deleted_at`, `updated_at`, `created_at` |
| **API Contracts** | Implicit | N/A | Not formally documented for new features |
| **Design System** | Exists | `/docs/design-system/` | Missing: date picker, overflow menu patterns |

---

## New Features Defined in PRD

| Feature | Description | Complexity | Priority |
|---------|-------------|------------|----------|
| **Infinite Scroll** | Remove 6-entry limit, lazy load with month grouping | Medium | P1 |
| **Delete Session** | Soft delete via overflow menu in SessionDetail | Low | P1 |
| **Add Past Session** | Backdate entries via date picker (last 30 days) | Medium | P2 |
| **Date/Time Editing** | Edit session date in SessionDetail edit mode | Low | P2 |
| **Worked/Struggles Capture** | Add explicit input sections to Review Phase | Low | P2 |
| **Post-Save Summary Card** | Show mini JournalEntryCard after save | Low | P3 |

---

## Recommended Handoff Package

For a complete developer handoff, we need the following deliverables:

### 1. Documentation Updates (Required)

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Update FEATURES.md | Add all new Journal features with "Planned" status | Not Started |
| Update Data Models | Add `deleted_at`, `updated_at`, `created_at` fields | Not Started |
| Cross-reference PRD | Link from FEATURES.md to detailed PRD | Not Started |
| Regenerate feature-inventory.html | Update browsable HTML version | Not Started |

### 2. Component Specifications (Required)

Each new feature needs a spec covering:
- Component name and file location
- Props interface changes
- State management
- API calls required
- Error handling
- Accessibility requirements

| Component Spec | Status |
|----------------|--------|
| Infinite Scroll (SessionHistory) | Not Started |
| Delete Flow (SessionDetail) | Not Started |
| Overflow Menu (SessionDetail) | Not Started |
| Date Picker (new component) | Not Started |
| Add Past Session Flow | Not Started |
| Worked/Struggles Input (VoiceFirstLogger) | Not Started |
| Post-Save Summary Card | Not Started |

### 3. API Contracts (Required)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/sessions` | GET | Paginated list with `limit`, `offset` | Not Documented |
| `/sessions/:id` | PATCH | Soft delete (`deleted_at`) | Not Documented |
| `/sessions/:id` | PATCH | Update date/time | Not Documented |
| `/sessions` | POST | Create with backdated `date` | Needs Clarification |

### 4. Prototype Updates (Recommended)

| Feature | File(s) | Status |
|---------|---------|--------|
| Infinite scroll | `SessionHistory.tsx` | Not Started |
| Delete flow | `SessionDetail.tsx` | Not Started |
| Overflow menu | `SessionDetail.tsx` | Not Started |
| Add past session | `SessionHistory.tsx`, new `DatePicker.tsx` | Not Started |
| Worked/Struggles sections | `VoiceFirstLogger.tsx` | Not Started |
| Post-save summary | `VoiceFirstLogger.tsx` | Not Started |

### 5. Design System Additions (If Needed)

| Pattern | Use Case | Status |
|---------|----------|--------|
| Date Picker | Backdating, date editing | Not Defined |
| Overflow Menu (···) | SessionDetail actions | Not Defined |
| Sticky Section Header | Month groupings in list | Not Defined |
| Delete Confirmation Modal | Destructive action confirm | Partial (similar to discard modal) |

---

## Decision Points (Pending)

Before proceeding, decisions needed on:

| Question | Options | Recommendation |
|----------|---------|----------------|
| **Prototype depth** | A) Full implementation, B) Visual mocks only, C) Key flows only | C) P1 features working, P2/P3 as mocks |
| **Date picker approach** | A) Custom component, B) Library (react-datepicker) | B) Library for prototype, native picker for iOS |
| **Handoff priority** | A) API-first (backend dev), B) UI-first (frontend dev) | Depends on team structure |
| **Soft delete vs hard delete** | A) Soft (keep data), B) Hard (permanent) | A) Soft delete with `deleted_at` |

---

## Action Plan

### Phase 1: Document (Immediate Priority)

**Goal:** Update single source of truth so all features are tracked

| Step | Task | Owner | Status |
|------|------|-------|--------|
| 1.1 | Update FEATURES.md Section 3 (Session History) with infinite scroll, delete, backdate | TBD | Not Started |
| 1.2 | Update FEATURES.md Section 4 (Session Detail) with date editing, delete access | TBD | Not Started |
| 1.3 | Update FEATURES.md Section 2 (Session Logger) with worked/struggles, post-save card | TBD | Not Started |
| 1.4 | Update FEATURES.md Data Models with new timestamp fields | TBD | Not Started |
| 1.5 | Add cross-reference to JOURNAL_PRD.md in FEATURES.md | TBD | Not Started |
| 1.6 | Regenerate feature-inventory.html | TBD | Not Started |

### Phase 2: Specify (Before Dev Handoff)

**Goal:** Create detailed specs developers can implement from

| Step | Task | Owner | Status |
|------|------|-------|--------|
| 2.1 | Write component spec: Infinite Scroll | TBD | Not Started |
| 2.2 | Write component spec: Delete Flow | TBD | Not Started |
| 2.3 | Write component spec: Add Past Session | TBD | Not Started |
| 2.4 | Write component spec: Review Phase Updates | TBD | Not Started |
| 2.5 | Document API contracts for all new endpoints | TBD | Not Started |
| 2.6 | Define date picker pattern for design system | TBD | Not Started |

### Phase 3: Prototype (Optional, Time Permitting)

**Goal:** Validate UX before committing to native development

| Step | Task | Owner | Status |
|------|------|-------|--------|
| 3.1 | Implement infinite scroll in SessionHistory.tsx | TBD | Not Started |
| 3.2 | Implement delete flow in SessionDetail.tsx | TBD | Not Started |
| 3.3 | Add "Add past session" link and flow | TBD | Not Started |
| 3.4 | Add Worked/Struggles to VoiceFirstLogger ReviewPhase | TBD | Not Started |
| 3.5 | Add post-save summary card | TBD | Not Started |

### Phase 4: Validate (Before Native Dev)

**Goal:** Ensure design works before building in native

| Step | Task | Owner | Status |
|------|------|-------|--------|
| 4.1 | Test all prototype flows on mobile viewport | TBD | Not Started |
| 4.2 | Gather stakeholder feedback | TBD | Not Started |
| 4.3 | Update specs based on learnings | TBD | Not Started |
| 4.4 | Final review of handoff package | TBD | Not Started |

---

## Files to Update/Create

### Updates to Existing Files

| File | Changes Needed |
|------|----------------|
| `/docs/product/FEATURES.md` | Add new features to Sections 2, 3, 4; update data models |
| `/prototype/src/types/database.ts` | Add `deleted_at`, `updated_at`, `created_at` to Session type |
| `/prototype/src/components/features/SessionHistory.tsx` | Infinite scroll, add past session link |
| `/prototype/src/components/features/SessionDetail.tsx` | Overflow menu, delete flow, date editing |
| `/prototype/src/components/features/VoiceFirstLogger.tsx` | Worked/Struggles sections, post-save card |

### New Files to Create

| File | Purpose |
|------|---------|
| `/prototype/src/components/ui/DatePicker.tsx` | Reusable date picker component |
| `/prototype/src/components/ui/OverflowMenu.tsx` | Reusable overflow menu component |
| `/docs/product/_manual_product_requirements_doc/JOURNAL_COMPONENT_SPECS.md` | Detailed component specifications |
| `/docs/product/_manual_product_requirements_doc/JOURNAL_API_CONTRACTS.md` | API endpoint documentation |

---

## Summary

**What's Done:**
- Comprehensive PRD with strategic decisions
- Feature prioritization (P1/P2/P3)
- UI consistency analysis
- Edge case documentation

**What's Next:**
1. Update FEATURES.md (immediate)
2. Create component specs (before handoff)
3. Update prototype (if time permits)
4. Validate and gather feedback

**Blocking Questions:**
- Who is the target developer (web prototype vs native iOS)?
- What's the timeline for handoff?
- Should prototype be fully functional or just visual reference?

---

*Document created: January 25, 2026*
