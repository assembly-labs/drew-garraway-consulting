---
name: UX Enhancement — Font & Token Foundation
purpose: Paste-ready prompt to execute Steps 0-4 of the UX design preparation plan
created: 2026-03-11
use_when: Starting a Claude Code session to apply the UX font/token foundation
---

# UX Enhancement — Font & Token Foundation Pass

## Your Role

You are a React Native build agent executing a pre-approved UX enhancement plan. You make **style-only changes** — no logic, no state, no API calls, no component structure changes. Every edit is adding `fontFamily` to existing StyleSheet properties, updating style values, or adding new style exports. If a change would require modifying component JSX structure, props, state, hooks, or any import beyond `design-tokens`, STOP and flag it — it's out of scope.

## Project Context

**Project root:** `/Users/drewgarraway/drew-garraway-consulting/TOMO/`
**App code:** `tomo/` (Expo + React Native, TypeScript, iOS-only MVP)
**Design system docs:** `docs/design-system/tokens.md`
**Session tracking:** Update `docs/mvp-1.0/tracking/CHANGELOG.md` and `docs/mvp-1.0/tracking/ISSUES.md` when done

Before starting, read:
- `docs/mvp-1.0/tracking/ISSUES.md` — check for blockers
- `docs/mvp-1.0/tracking/CHANGELOG.md` — latest entry for context

## What's Already Done (Do NOT Redo)

- All 3 font families loaded in `App.tsx:38-52` via `expo-font` (10 weight variants)
- `design-tokens.ts` exists with colors, spacing, radius, typography exports
- All screens built and functional (8 screen files, 4 shared components, 3 navigators)
- Voice pipeline, auth, Supabase, haptics — all working. DO NOT TOUCH.

## The Problem

Fonts are loaded but **never applied**. No screen uses `fontFamily` in its StyleSheet. The `typography` presets in `design-tokens.ts` use generic family names (`'Unbounded'` + `fontWeight: '800'`) which won't resolve correctly on React Native — you must use the exact registered variant name (`'Unbounded-ExtraBold'`).

Additionally: chip styles are inconsistent across screens, card press states darken instead of lighten, and the Journal header says "TOMO" instead of "Journal".

## Registered Font Names (from App.tsx)

These are the EXACT strings you must use for `fontFamily`. No others.

```
Unbounded            → weight 500 (Medium)
Unbounded-Bold       → weight 700
Unbounded-ExtraBold  → weight 800
Unbounded-Black      → weight 900

Inter                → weight 500 (Medium)
Inter-SemiBold       → weight 600
Inter-Bold           → weight 700

JetBrains Mono           → weight 500 (Medium)
JetBrains Mono-SemiBold  → weight 600
JetBrains Mono-Bold      → weight 700
```

**Rule:** When you set `fontFamily` to a variant name, you must ALSO keep `fontWeight` set to the matching value. React Native on iOS uses both properties.

## Font Assignment Rules

Apply these consistently across ALL screens:

| Text type | Font family | Weight | Where used |
|-----------|-------------|--------|------------|
| Page titles (28px+) | `Unbounded-ExtraBold` | `'800'` | `phaseTitle`, `title`, `headerTitle`, `successTitle`, `name` |
| Logo text (48px) | `Unbounded-ExtraBold` | `'800'` | `logoText` on Auth + Welcome |
| Recording timer | `Unbounded-ExtraBold` | `'800'` | `recordingTimer` (48px) |
| Card titles (16-17px, weight 700) | `Inter-Bold` | `'700'` | `cardKind`, `reviewTitle`, `sheetTitle`, `modalTitle`, `gymName`, `optionTitle` |
| Button text (17px, weight 700) | `Inter-Bold` | `'700'` | `buttonText`, `recordButtonText`, `saveButtonText`, `stopButtonText` |
| Body text (14-16px, weight 500) | `Inter` | `'500'` | `description`, `subtitle`, `sectionText`, `narrativeText`, `optionDescription`, body text |
| Body semibold (15px, weight 600) | `Inter-SemiBold` | `'600'` | `rowValue`, `cancelText`, `sheetCancel`, `chipText`, `entryChipText`, `forgotPasswordText` |
| Labels (12px, uppercase, letter-spacing) | `JetBrains Mono-SemiBold` | `'600'` | `fieldLabel`, `sectionLabel`, `sheetFieldLabel`, `step`, `narrativeLabel`, `sectionHeader`, `tabLabel`, `dividerText` |
| Data values (13px, weight 600-700) | `JetBrains Mono-SemiBold` | `'600'` | `modeBadgeText`, `cardDuration`, `detailBadgeText`, `sessionCount`, `barLabel` |
| Chip numbers (16-20px, weight 700) | `Inter-Bold` | `'700'` | `smallChipText`, `stripeText`, `roundChipText`, `chipText` (number chips only) |
| Secondary text (13-15px, weight 500) | `Inter` | `'500'` | `cardTopic`, `cardTechniques`, `sparringText`, `emptyDescription`, `recordingHint`, `processingHint`, `pickerSubtext`, `gymMeta`, `versionText` |
| Links/accents (weight 600, gold) | `Inter-SemiBold` | `'600'` | `toggleModeLink`, `backLink`, `sheetSave`, `customGymButtonText` |
| Kanji/logo subtext (32px) | Leave as-is | — | `logoSubtext` (友 character — system font renders CJK better) |

## Execution Steps

### Step 0: Fix design-tokens.ts font mapping

Open `tomo/src/config/design-tokens.ts`. Make these changes:

1. **Update `fontFamilies`** to be a weight-aware lookup:

```typescript
export const fontFamilies = {
  display: {
    medium: 'Unbounded',
    bold: 'Unbounded-Bold',
    extraBold: 'Unbounded-ExtraBold',
    black: 'Unbounded-Black',
  },
  body: {
    medium: 'Inter',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  mono: {
    medium: 'JetBrains Mono',
    semiBold: 'JetBrains Mono-SemiBold',
    bold: 'JetBrains Mono-Bold',
  },
} as const;
```

2. **Update all `typography` presets** to use exact variant names:

```typescript
export const typography: Record<string, TextStyle> = {
  heroNumber: {
    fontFamily: 'Unbounded-Black',
    fontSize: fontSizes['5xl'],
    fontWeight: '900',
    lineHeight: fontSizes['5xl'] * lineHeights.none,
  },
  headline: {
    fontFamily: 'Unbounded-ExtraBold',
    fontSize: fontSizes['2xl'],
    fontWeight: '800',
    lineHeight: fontSizes['2xl'] * lineHeights.tight,
  },
  subheadline: {
    fontFamily: 'Unbounded-Bold',
    fontSize: fontSizes.xl,
    fontWeight: '700',
    lineHeight: fontSizes.xl * lineHeights.tight,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: fontSizes.base,
    fontWeight: '500',
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  bodySmall: {
    fontFamily: 'Inter',
    fontSize: fontSizes.sm,
    fontWeight: '500',
    lineHeight: fontSizes.sm * lineHeights.normal,
  },
  bodyBold: {
    fontFamily: 'Inter-Bold',
    fontSize: fontSizes.base,
    fontWeight: '700',
    lineHeight: fontSizes.base * lineHeights.normal,
  },
  label: {
    fontFamily: 'JetBrains Mono-SemiBold',
    fontSize: fontSizes.xs,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dataValue: {
    fontFamily: 'JetBrains Mono-Bold',
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
} as const;
```

3. **Add new shared style exports** at the bottom of the file (before the closing):

```typescript
// ===========================================
// SHARED COMPONENT STYLES
// ===========================================

export const chipStyles = {
  pill: {
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  square: {
    borderRadius: radius.lg,
    width: 48,
    height: 48,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.gray800,
    borderWidth: 1,
    borderColor: colors.gray700,
  },
  selected: {
    backgroundColor: colors.goldDim,
    borderColor: colors.gold,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.gray400,
  },
  textSelected: {
    color: colors.gold,
  },
} as const;

export const pressedStyles = {
  card: { backgroundColor: '#252525' },
  button: { opacity: 0.85 },
  subtle: { opacity: 0.7 },
} as const;
```

### Step 1: Update RootNavigator.tsx theme fonts

Open `tomo/src/navigation/RootNavigator.tsx`. Change lines 47-50:

```typescript
fonts: {
  regular: { fontFamily: 'Inter', fontWeight: '500' },
  medium: { fontFamily: 'Inter-SemiBold', fontWeight: '600' },
  bold: { fontFamily: 'Inter-Bold', fontWeight: '700' },
  heavy: { fontFamily: 'Unbounded-ExtraBold', fontWeight: '800' },
},
```

### Step 2: Update MainTabNavigator.tsx

1. Add `fontFamily: 'JetBrains Mono-SemiBold'` to `tabLabel` style (line 123)
2. Add `tabBarAccessibilityLabel: 'Log Session'` to LogTab screen options (around line 88)

### Step 3: Apply fonts to every screen

Go through each screen file and add `fontFamily` to every text style in the StyleSheet, following the Font Assignment Rules table above. **Do not change any JSX, props, state, hooks, handlers, or imports** (except adding design-tokens imports if a file doesn't already import what it needs).

Files to update (in this order):
1. `src/screens/AuthScreen.tsx`
2. `src/screens/onboarding/WelcomeScreen.tsx`
3. `src/screens/onboarding/AboutYouScreen.tsx`
4. `src/screens/onboarding/YourTrainingScreen.tsx`
5. `src/screens/onboarding/GetStartedScreen.tsx`
6. `src/screens/JournalScreen.tsx`
7. `src/screens/SessionLoggerScreen.tsx`
8. `src/screens/SessionDetailScreen.tsx`
9. `src/screens/ProfileScreen.tsx`

### Step 4: Additional style fixes (while you're in the files)

While editing each file in Step 3, also apply:

**JournalScreen.tsx:**
- Change the header `<Text>` content from `TOMO` to `Journal` (line 94, just the string inside the Text element)
- Update `headerTitle` style: `fontSize: 28`, remove `letterSpacing: 4` (keep `fontWeight: '800'`)
- Change `cardPressed.backgroundColor` from `colors.gray900` to `'#252525'`

**No other JSX changes in any file.**

### Step 5: Update documentation

Open `docs/design-system/tokens.md` and add a new section after the Typography section:

```markdown
### React Native Font Family Names

When using fonts in React Native StyleSheet, you MUST use the exact registered variant name.
Do NOT use generic family names with fontWeight — they won't resolve correctly.

| Intent | fontFamily value | fontWeight |
|--------|-----------------|------------|
| Unbounded Medium | `'Unbounded'` | `'500'` |
| Unbounded Bold | `'Unbounded-Bold'` | `'700'` |
| Unbounded ExtraBold | `'Unbounded-ExtraBold'` | `'800'` |
| Unbounded Black | `'Unbounded-Black'` | `'900'` |
| Inter Medium | `'Inter'` | `'500'` |
| Inter SemiBold | `'Inter-SemiBold'` | `'600'` |
| Inter Bold | `'Inter-Bold'` | `'700'` |
| JetBrains Mono Medium | `'JetBrains Mono'` | `'500'` |
| JetBrains Mono SemiBold | `'JetBrains Mono-SemiBold'` | `'600'` |
| JetBrains Mono Bold | `'JetBrains Mono-Bold'` | `'700'` |

### Pressed State Guidance

On dark themes, press states should LIGHTEN the element (`'#252525'` or `rgba(255,255,255,0.05)`), never darken. Darkening makes elements recede on press, which contradicts expected touch physics.

### Chip Standardization

Two chip variants exist in `design-tokens.ts`:
- **Pill** (`chipStyles.pill`): For filters, multi-select labels, text options. Uses `borderRadius: full`.
- **Square** (`chipStyles.square`): For number selectors, fixed-width options. Uses `borderRadius: lg`, fixed 48x48.
Both use `chipStyles.selected` for active state and `chipStyles.text` / `chipStyles.textSelected` for typography.
```

### Step 6: Verify and track

1. Run `npx tsc --noEmit` from `tomo/` — must pass with 0 errors
2. If possible, run `npx expo run:ios` and visually confirm fonts render on Auth screen and Journal
3. Update `docs/mvp-1.0/tracking/CHANGELOG.md` with a dated entry covering all changes
4. Update `docs/mvp-1.0/tracking/ISSUES.md` if any new issues are discovered

## Constraints (Non-Negotiable)

- **NEVER modify** component JSX structure, props interfaces, state variables, hooks, event handlers, navigation logic, or API calls
- **NEVER modify** files in `src/services/`, `src/hooks/`, `src/types/`, `src/data/`, `src/utils/`
- **NEVER modify** `App.tsx`, `app.json`, `package.json`
- **NEVER modify** Supabase Edge Functions or any backend code
- **NEVER add new files** — all changes go into existing files
- **NEVER remove existing styles** — only add `fontFamily` to them or update values as specified
- If TypeScript errors appear after your changes, fix them before moving to the next file
- The `logoSubtext` (友 kanji character) must NOT get a custom fontFamily — system font renders CJK correctly
- Keep `fontWeight` on every style that gets `fontFamily` — React Native iOS uses both properties together
