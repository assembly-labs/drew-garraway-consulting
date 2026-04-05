# Gym Picker Sheet

Bottom sheet modal for temporarily switching to a different gym for this session.

**Code:** `tomo/src/components/GymPickerSheet.tsx`

## Elements

### Sheet Container
- Slides up from bottom (page sheet presentation)
- Dark background
- Covers most of the screen

### Sheet Header
- Left: **Cancel Button** (gray text) - closes sheet without changes
- Center: **Title** - "Switch Gym" (Inter Bold, 17px, white)
- Right: **Done Button** (gold text) - confirms selection, disabled until a gym is picked

### Subtitle
- "Training somewhere else today? Your home gym won't change."
- Small gray text (13px) explaining this is temporary

### Gym Search Input
- Auto-focused text input (keyboard opens immediately)
- Placeholder: "Search or add your gym"
- Autocomplete dropdown appears as you type (2+ characters)
- Matches show gym name + city/state
- If no match: your typed text becomes a custom gym
- Selected gym shows with a gold checkmark

## Behavior

- Only affects the current session being logged
- Your home gym on Profile stays the same
- Override shows as gold Gym Chip on Entry/Review phases
- Tap the "X" on the Gym Chip to reset back to home gym
