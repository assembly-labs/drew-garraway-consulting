# Session Detail

View and edit a saved session. Every section is tappable to edit.

**Code:** `tomo/src/screens/SessionDetailScreen.tsx`
**Reached from:** Tapping a session card on Journal List

## Elements

### Back Button
- Top-left arrow icon
- Returns to Journal List

### Date and Time Header
- Formatted date: "Monday, March 31, 2026"
- Tappable (small edit icon next to it)
- Opens date edit sheet

### Training Info Row
- **Mode Badge:** Colored pill showing "Gi" / "No-Gi" / "Other"
- **Kind Label:** "Class" / "Open Mat" / "Comp Training" / "Other"
- **Duration:** "90 min"
- **Rounds** (if sparred): "3 rounds"
- Small edit icon - tap to edit mode/kind/duration in one sheet
- Tappable as a group

### Gym Display
- Map pin icon + gym name
- Read-only (looked up from the gym ID saved with the session)
- Not tappable

### Notes Card
- Label: "MY NOTES" (uppercase, monospace)
- Gray left border (3px) to distinguish from AI content
- If empty: "Tap to add notes..." in gray placeholder text
- If filled: Full note text (Inter, 16px)
- Edit icon (gray)
- Tap to open notes edit sheet

### Lesson Topic Section
- Label: "LESSON TOPIC"
- Shows topic text, or "Not recorded" if empty
- Edit icon, tappable

### Techniques Section
- Label: "TECHNIQUES DRILLED"
- Tag pills showing each technique (gray background, white text)
- Or "No techniques recorded" if empty
- Edit icon, tappable

### Sparring Section (only if session had sparring)
- Label: "SPARRING"
- Rounds count display
- **Submissions Landed:** Green-colored list, "Type (count)" format
- **Got Caught:** Red-colored list, "Type (count)" format
- Each sub-section is editable via tap

### Injuries Section (only if injuries were logged)
- Label: "INJURIES"
- Orange/warning colored tags
- Edit icon, tappable

### Instructor Section
- Label: "INSTRUCTOR"
- Name text or empty state
- Edit icon, tappable

### Warm-up Section
- Label: "WARM-UP"
- "Yes" or "No" display
- Edit icon, tappable

### Transcript Toggle (only if session used voice input)
- Subtle toggle: mic icon + "View voice transcript"
- Collapsed by default (not prominent)
- When expanded: shows raw transcription text in italic gray
- Tap to toggle open/closed

### Delete Session Link
- Bottom of scroll, text link: "Delete this session"
- Red/negative colored text
- Tap shows confirmation alert: "Delete" (destructive) / "Cancel"
- Deleting removes the session and navigates back to Journal List

## Edit Sheets

Each editable section opens a bottom sheet modal with:
- Section-specific form controls
- "Save" button (applies changes to database)
- "Cancel" button (closes sheet, no changes)
- Toast notification on successful save
