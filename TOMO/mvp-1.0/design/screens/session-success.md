# Success Phase

Full-screen quote shown for 4 seconds after saving a session, then returns to Journal List.

**Code:** `tomo/src/screens/SessionLoggerScreen.tsx` (SuccessPhase component) + `tomo/src/components/PostSaveQuote.tsx`
**Phase:** Session Logging (phase 5 of 5)

## Elements

This phase is a wrapper around the [Post-Save Quote](post-save-quote.md) component.

### Post-Save Quote
- Full-screen overlay on black background
- Displays a martial arts quote for 4 seconds
- Quote is selected based on your belt level and gender
- Progress bar at bottom shows time remaining
- Double-tap anywhere to dismiss early
- After 4 seconds (or double-tap): navigates to Journal List

See [post-save-quote.md](post-save-quote.md) for full element details.

## Behavior

- Haptic success feedback fires right before this phase appears
- No checkmark or intermediate screen - quote appears immediately after save
- After quote dismisses, full form state is reset for the next session
- Navigation goes to Journal List (not back to Entry Phase)
