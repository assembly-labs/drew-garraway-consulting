# Recording Phase

Live voice recording screen. User talks about their training session.

**Code:** `tomo/src/screens/SessionLoggerScreen.tsx` (RecordingPhase component)
**Phase:** Session Logging (phase 2 of 5)

## Elements

### Cancel Button
- Top-left text link: "Cancel" (gray text)
- If recording is short (under threshold): cancels immediately, back to Entry Phase
- If recording is longer: shows confirmation alert with "Keep Recording" / "Discard" options

### Gym Label
- Read-only display: map pin icon + gym name
- Small gray text, not tappable
- Just shows context so you remember which gym you selected

### Pulsing Circle
- Large circle (120x120) centered on screen
- Gold border (3px), transparent background
- "友" kanji inside (32px, gold, bold)
- Pulses with opacity animation (fades between full and half opacity)

### Session Timer
- Large timer display below the circle
- Shows elapsed recording time (e.g., "2:34")
- Unbounded ExtraBold font, 48px, white

### Recording Prompt
- Rotating prompt text below the timer
- Cycles through encouraging questions:
  - "What did you work on today?"
  - "How was training?"
  - "Any breakthroughs or struggles?"
  - "What techniques did you drill?"
- Changes every few seconds

### Stop Recording Button
- Gold button at bottom
- Stop icon (black) + text "Stop Recording" (black text on gold)
- Stops the mic, moves to Processing Phase
- Rounded corners (radius xl)
