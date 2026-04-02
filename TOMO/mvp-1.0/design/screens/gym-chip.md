# Gym Chip

Pill-shaped button showing your gym. Appears on Entry Phase, Review Phase, and other screens.

**Code:** `tomo/src/components/GymChip.tsx`

## Elements

### Default State (home gym)
- Pill shape with rounded ends
- Map pin icon (14px, gray)
- Gym name text (truncated to one line if long)
- Dark gray background, thin gray border
- Tappable: opens Gym Picker Sheet

### Override State (different gym for this session)
- Same pill shape
- Map pin icon turns gold
- Gym name text turns gold
- Gold border, gold-tinted background
- **Reset Button:** Small circle with "X" on the right (36x36)
  - Tap to switch back to your home gym
  - Light haptic on tap

## Related

- **Gym Label:** Read-only version (no tap, no override). Small gray text with map pin. Used on Recording Phase.
- **Gym Picker Sheet:** Modal that opens when you tap the Gym Chip. See [gym-picker-sheet.md](gym-picker-sheet.md).
