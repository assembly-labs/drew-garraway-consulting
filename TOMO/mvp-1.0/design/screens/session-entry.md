# Entry Phase

Pre-recording form where you set up your session before recording.

**Code:** `tomo/src/screens/SessionLoggerScreen.tsx` (EntryPhase component)
**Phase:** Session Logging (phase 1 of 5)
**Skipped if:** User chose "Voice First" during onboarding (goes straight to Recording)

## Elements

### Cancel Button
- Top-left text link: "Cancel"
- Navigates back to Journal List
- No confirmation needed (nothing to lose yet)

### Screen Title
- "Log Your Training" (Unbounded ExtraBold, 28px, white)

### Gym Chip
- Pill-shaped button showing your current gym
- Map pin icon + gym name
- Tap to open Gym Picker Sheet (switch gym for this session only)
- If overridden: gold border, "X" button to reset
- See [gym-chip.md](gym-chip.md)

### Training Mode Chips
- Label: "TRAINING MODE"
- Three options: "Gi", "No-Gi", "Other"
- Large chips (56px height)
- Selected: gold background + gold border
- Unselected: dark gray background + gray border

### Session Kind Chips
- Label: "SESSION KIND"
- Four options: "Regular Class", "Open Mat", "Comp Training", "Other"
- Same chip style as Training Mode

### Duration Chips
- Label: "DURATION"
- Six options: 30, 45, 60, 75, 90, 120 minutes
- Smaller square chips (44x44)
- Default: 90 min

### Spar Toggle
- Label: "DID YOU SPAR?"
- Two chips: "Yes", "No"
- No default (starts unselected)

### Record Session Button
- Large gold button at bottom
- Text: "Record Session"
- Starts mic recording and moves to Recording Phase
- Triggers medium haptic

### Just Type It Link
- Text link below the record button: "Just type it"
- Smaller, gray text (44px touch target)
- Skips recording, goes straight to Review Phase with empty transcript

### Recording Prompt
- Random prompt displayed above the record button
- Rotates from: "What did you work on today?", "How was training?", etc.
- Sets the tone for what to talk about
