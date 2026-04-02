# Review Phase

Editable form showing everything extracted from your voice recording. Fix anything that's wrong, fill in what's missing, then save.

**Code:** `tomo/src/screens/SessionLoggerScreen.tsx` (ReviewPhase component)
**Phase:** Session Logging (phase 4 of 5)

## Elements

### Review Header
- Left: **Cancel Button** (text link, gray) - discards everything, back to Journal List
- Center: **Review Title** - "Review Session" (Inter Bold, 17px, white)
- Right: empty spacer (keeps title centered)
- Thin border below header

### Gym Chip
- Same as Entry Phase - pill button with map pin + gym name
- Tap to open Gym Picker Sheet
- Gold border if overridden, "X" to reset
- See [gym-chip.md](gym-chip.md)

### Detail Badges Row
- Two tappable badges side by side:
  - **Mode Badge:** Shows "Gi", "No-Gi", or "Other" + small edit icon
  - **Duration Badge:** Shows "90 min" + small edit icon
- Tap either badge to expand its inline editor (see below)

### Mode Editor (inline, conditional)
- Opens when you tap the Mode Badge
- Label: "TRAINING MODE"
- Three chips: "Gi", "No-Gi", "Other"
- Selecting one closes the editor and updates the badge

### Duration Editor (inline, conditional)
- Opens when you tap the Duration Badge
- Label: "DURATION"
- Six chips: 30, 45, 60, 75, 90, 120
- Selecting one closes the editor and updates the badge

### Warm-up Field
- Label: "WARM-UP"
- Two chips: "Yes", "No"
- Gold left border + gold tint background if unanswered (visual nudge to fill in)

### Techniques Field
- Label: "TECHNIQUES TRAINED / LESSON TOPIC"
- **Tag List:** Existing techniques shown as removable pill tags (tap X to remove)
- **Add Input:** Text input with placeholder "Add technique or topic (e.g. guard passing)"
- **Autocomplete Dropdown:** Appears when typing 2+ characters, shows matches from your history + built-in dictionary. "recent" badge on techniques you've logged before
- Gold left border + gold tint if empty

### Did You Spar Field
- Label: "DID YOU SPAR?"
- Two chips: "Yes", "No"
- Selecting "No" hides the sparring sections below

### Sparring Rounds (conditional, only if "Yes" to sparring)
- Label: "SPARRING ROUNDS"
- Seven chips: 1, 2, 3, 4, 5, 6, 7+
- Gold left border if no rounds selected

### Submissions Landed (conditional, only if sparring)
- Label: "SUBMISSIONS LANDED" (green text)
- **Tag List:** Green-tinted tags showing "Type (count)"
  - Tap a tag to +1 the count
  - Each tag has +/- buttons to adjust count
  - Long-press to enter jiggle mode (tags shake, red delete badges appear)
  - Tap delete badge to remove a submission
  - Tap outside jiggle area to stop jiggling
- **Add Input:** Text input with autocomplete, same pattern as techniques

### Got Caught (conditional, only if sparring)
- Label: "GOT CAUGHT" (red text)
- Same pattern as Submissions Landed but with red-tinted tags
- Tracks submissions your training partners got on you

### Injuries Field
- Label: "INJURIES" (orange text)
- **Tag List:** Orange-tinted removable tags
- **Add Input:** Text input, placeholder "Add injury (e.g. sore elbow)"
- Gold left border if empty

### Instructor Field
- Label: "INSTRUCTOR"
- Single text input, placeholder "Who taught class?"
- Gold left border if empty

### Session Type Chips
- Label: "SESSION TYPE"
- Four chips: "Regular Class", "Open Mat", "Comp Training", "Other"

### Voice Transcript (conditional, only if voice recording was used)
- Label: "VOICE TRANSCRIPT"
- Shows the raw text from your recording
- Italic gray text, max 200px height (scrollable)
- At the bottom of the form

### Save Session Button
- Full-width gold button at bottom of scroll
- Text: "Save Session" (black text on gold)
- Shows spinner while saving
- Disabled during save (slightly transparent)
- On success: moves to Success Phase
