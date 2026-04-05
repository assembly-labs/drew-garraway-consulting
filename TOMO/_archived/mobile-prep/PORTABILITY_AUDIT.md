# Prototype Portability Audit

What can be reused from the web prototype (`prototype/src/`) in the React Native app, and what needs rewriting.

## Direct Copy (no changes needed)

These files are pure TypeScript with zero browser/React/CSS dependencies.

| File | What it is | Size |
|------|-----------|------|
| `data/gyms.ts` | 120+ gym database + search/filter functions | 243 lines |
| `config/belt-system/types.ts` | All belt personalization type definitions | 399 lines |
| `config/belt-system/belt-profiles.ts` | Psychology profiles per belt | check size |
| `config/belt-system/feature-adaptations.ts` | Dashboard/logger/chatbot adaptations per belt | check size |
| `config/belt-system/risk-signals.ts` | Dropout risk detection signals | check size |
| `config/belt-system/journal-patterns.ts` | Journal text analysis patterns | check size |
| `config/belt-system/index.ts` | Belt system barrel export | small |
| `types/database.ts` | All database type definitions | 627 lines |
| `types/auth.ts` | Auth type definitions | check size |

**Total: ~9 files, ~1,500+ lines of code you don't have to rewrite.**

The gym database (`gyms.ts`) is the one the ship plan estimated 1 hour for. It's actually zero effort — direct copy.

## Needs Updating (minor changes)

| File | What changes | Effort |
|------|-------------|--------|
| `types/database.ts` | `TrainingType` uses old combined values (`gi`, `nogi`, `openmat`, etc.). MVP splits into `trainingMode` + `sessionKind`. Add the new types, keep old ones for reference. | 30 min |
| `types/index.ts` | Barrel export — remove legacy re-exports, add new MVP types | 10 min |

## Rewrite Required (logic reusable, UI must change)

React Native doesn't use CSS, HTML, or DOM APIs. All UI components need full rewrites using React Native primitives (`View`, `Text`, `TouchableOpacity`, `StyleSheet`). But the **logic and data flow** inside many components is reusable.

### Components — Rewrite UI, Reuse Logic

| Component | Reusable Logic | Rewrite |
|-----------|---------------|---------|
| `Onboarding.tsx` | Flow structure, validation, field order | All JSX + styles |
| `SessionLogger.tsx` | State machine, data flow | All JSX + styles |
| `VoiceFirstLogger.tsx` | Prompt rotation, conversation flow | All JSX + recording API |
| `SessionHistory.tsx` | Date grouping logic, filter logic | All JSX + styles |
| `SessionDetail.tsx` | Section layout pattern | All JSX + styles |
| `EditSheet.tsx` | Edit flow pattern (staged changes, save/discard) | All JSX + bottom sheet |
| `EditSections.tsx` | Individual field edit logic | All JSX + styles |
| `ProfileScreen.tsx` | Profile display + edit flow | All JSX + styles |
| `LoginScreen.tsx` | Auth flow | All JSX + Supabase Auth |
| `GymPicker.tsx` | Search logic (already in gyms.ts) | All JSX + styles |
| `SubmissionPicker.tsx` | Submission selection logic | All JSX + styles |

### Components — Not Needed for MVP

These exist in the prototype but are explicitly deferred to v1.1+:

| Component | Why not needed |
|-----------|---------------|
| `Dashboard.tsx` | Stats dashboard — deferred |
| `BeltProgress.tsx` | Belt progress visualization — deferred |
| `TechniqueLibrary.tsx` | Technique catalog — deferred |
| `TrainingFeedback.tsx` | Training insights page — deferred |
| `AttackProfile.tsx` | Submission analytics — deferred |
| `UpNextVideos.tsx` | Video recommendations — deferred |
| `Settings.tsx` | Merged into Profile for MVP |
| `IconShowcase.tsx` | Dev tool, not user-facing |

### UI Primitives — Rewrite Required

| Component | Notes |
|-----------|-------|
| `Icons.tsx` | SVG icons — need `react-native-svg` conversion. Start with ~20 most-used. |
| `BeltBadge.tsx` | Simple colored badge — easy RN rewrite |
| `TrainingBadge.tsx` | Simple colored badge — easy RN rewrite |
| `Toast.tsx` | Use `react-native-toast-message` or similar RN library |
| `StatCard.tsx` | Not needed for MVP (stats deferred) |
| `Skeleton.tsx` | Loading skeleton — rewrite with RN Animated |
| `EmptyState.tsx` | Simple layout — easy RN rewrite |
| `ErrorState.tsx` | Simple layout — easy RN rewrite |
| `ProgressRing.tsx` | Not needed for MVP |

### Services — Full Rewrite

| File | Current | MVP Replacement |
|------|---------|----------------|
| `services/api.ts` | localStorage CRUD | Supabase client (`@supabase/supabase-js`) |
| `services/auth.ts` | Mock auth | Supabase Auth (email + Apple Sign-In) |

The API service pattern (`api.sessions.list()`, `api.profile.get()`) is good but the implementation is entirely localStorage. The Supabase version will use the Supabase JS client directly — simpler than maintaining the abstraction layer for MVP.

## Summary

| Category | Files | Lines (est.) | Effort |
|----------|-------|-------------|--------|
| Direct copy | ~9 | ~1,500 | 0 |
| Minor update | 2 | ~50 changes | 30 min |
| Logic reusable, UI rewrite | 11 components | varies | Bulk of work |
| Not needed for MVP | 8 components | skip | 0 |
| Full rewrite | 2 services | ~200 each | 2-3 hours |

**Bottom line:** ~1,500 lines copy directly. The belt system and gym database are free. All UI needs rewriting for React Native, but the business logic patterns are sound guides.
