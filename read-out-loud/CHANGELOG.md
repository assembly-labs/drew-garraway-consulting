# Read Out Loud - Changelog

## 2026-03-31 (Session 2) - Playback UX + Controls Polish

### Play Lag Fix
- **Prefetch first audio chunk**: After pasting/typing text, the app pre-generates the first Google TTS audio chunk in the background (2s debounce). Pressing play starts nearly instantly instead of waiting for the API round-trip.

### Auto-Scroll Behavior
- **User scroll override**: During playback, if you manually scroll the text to re-read something, auto-scroll pauses instead of yanking you back. A "Follow along" pill button appears at the bottom of the text area to snap back when ready.
- Auto-scroll resets when playback stops or restarts.

### Skip Buttons Redesign
- Replaced tiny chevron arrows with Spotify-style circular-arrow icons (48px, up from 44px)
- "15" label displayed inside each button so it's clear you're skipping 15 seconds
- Better touch targets and visual weight

### Action Button Layout
- Paste, Import, Save, MP3, and Clear buttons now sit in a single horizontal row (no more stacked groups)
- Clear button pushed to the far right for separation

### Cache
- All asset version strings bumped to `20260331e`

---

## 2026-03-31 - Major UX Overhaul + Bug Fixes

### Bug Fixes (Session Start)
- **Speech engine reliability**: Reduced chunk size from 30,000 to 2,000 chars to fix Chrome/Safari silently killing long utterances after ~15 seconds
- **"Smash the play button" fix**: Added `onstart` callback and `isLoading` flag so the UI knows when speech actually starts vs. when it was requested. Play button shows a spinner during loading and blocks duplicate presses
- **Chrome keepalive workaround**: Added pause/resume ping every 10 seconds to prevent Chrome's speech synthesis auto-pause bug
- **Update notification invisible**: Fixed `var(--success-color)` to `var(--success)` in app.js

### Layout Restructure
- **Controls moved to fixed bottom bar**: Play/pause, skip, stop, speed, and voice controls are now in a sticky footer that never scrolls. Always in thumb zone regardless of text length
- **Listen Mode**: Pressing play now transforms the UI -- action buttons and stats hide, header shrinks, text display gets larger typography (1.25rem, 2.0 line-height). "Edit" button in header exits back
- **Speed collapsed to badge**: Replaced permanently visible slider + 4 presets with a compact "1.0x" pill badge. Tap opens a popover with 6 presets + fine-tune slider
- **Voice selector compacted**: Now a small badge in the footer instead of a full-width button

### Accessibility (P0/P1)
- **Removed `user-scalable=no`**: Was blocking pinch-to-zoom, violating WCAG 1.4.4
- **Word highlight contrast fixed**: Changed from white-on-indigo (3.1:1) to dark-on-amber #fbbf24 (11:1 ratio)
- **Progress bar ARIA**: Added `role="progressbar"` with `aria-valuenow/min/max` and `aria-label`
- **Toast container**: Added `aria-live="polite"` for screen reader announcements
- **Focus management**: All modals now move focus on open, trap Tab cycling, and restore focus on close
- **Touch targets**: Close buttons bumped from 36px to 44px, library action buttons from 32px to 40px with 72px min-width
- **Voice button**: Added `aria-haspopup="dialog"`
- **Speed presets**: Added `aria-label` to all preset buttons

### UX Improvements
- **Click-to-seek on progress bar**: Users can click/tap anywhere on the progress bar to jump to that position
- **Skip forward/back buttons**: `<<` and `>>` buttons skip ~500 chars (~15 seconds). Arrow keys work too
- **Resume banner**: Replaced native `confirm()` dialog with a styled inline banner showing "Resume from X%" with Resume/Start Over buttons
- **All 7 native dialogs replaced**: Save title, clear confirm, resume, MP3 API key, MP3 generate, rename, delete -- all now use a custom styled dark-theme modal
- **Auto-save indicator**: Replaced repeating toast with a subtle inline "Saved" text that fades in/out next to stats
- **Empty state**: Added `.empty-state` CSS and helpful copy for empty library
- **Action button grouping**: Buttons visually grouped into input (Paste, Import), output (Save, MP3), and danger (Clear) with gaps between groups
- **Delete button styling**: Always shows danger color, not just on hover
- **Sample text on first visit**: Loads a short story excerpt so new users can immediately try play + highlighting
- **Offline indicator**: Shows "Offline - using device voices" banner when network drops
- **Paused visual state**: Play button gets a pulsing glow when paused mid-read to distinguish from idle
- **Keyboard shortcuts expanded**: Arrow keys for skip, +/- for speed adjustment

### Icon Fixes
- **Import button**: Changed from download-arrow icon (identical to MP3) to file-with-plus icon
- **MP3 button**: Changed from download-arrow icon to music note icon
- All action buttons now have visually distinct icons

### Speed Control Improvements
- Slider track thickened from 4px to 6px, thumb enlarged from 18px to 22px with accent glow
- Live speed readout ("Fine tune: 1.3x") above slider in popover
- Active state highlighting on preset buttons matching current speed
- 6 presets (added 0.75x and 1.25x) instead of 4

### Deployment Fixes
- **Service worker cache version bumped** from v2.5.0 to v3.2.0 -- existing users get fresh content
- **SW asset path matching fixed**: Uses `self.registration.scope` to resolve paths correctly in subdirectory deployments. Added `ignoreSearch: true` so `?v=` params don't bypass cache
- **SW offline navigation fallback fixed**: Uses scope-relative path instead of hardcoded `/index.html`
- **`_redirects` bug fixed**: Was redirecting `/read-out-loud/index.html` to monorepo root instead of project root. Removed broken redirect entirely
- **Manifest cleaned up**: Removed marketing tagline from `name`, split `"any maskable"` icon purpose into separate entries

### Files Changed
- `index.html` - Full restructure (playback bar moved to fixed footer, new modals, ARIA, icons)
- `css/styles.css` - Fixed bottom bar, listen mode, speed popover, confirm modal, resume banner, accessibility fixes
- `js/ui.js` - Major rewrite (listen mode, custom modals, focus trapping, seek, skip, speed popover, sample text, offline indicator)
- `js/speech.js` - Chunk size fix, onstart callback, keepalive, isLoading flag
- `js/app.js` - CSS variable fix
- `sw.js` - Cache version bump, path resolution fix, offline fallback fix
- `manifest.json` - Name cleanup, icon purpose split
- `_redirects` - Removed broken redirect
