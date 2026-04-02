# Profile Screen

Your personal info, training settings, gym, and sign-out.

**Code:** `tomo/src/screens/ProfileScreen.tsx`
**Tab:** Profile (fourth tab, right side)

## Elements

### Avatar
- Large circle (96px) at top
- Shows your initials on dark background (if no photo)
- Or uploaded profile photo
- Belt-colored border ring
- Tap to edit name and photo

### User Name
- Your first name (Inter Bold, 20px, white)
- Below avatar, tappable to edit

### Belt Badge
- Vertical colored bar (8px wide, your belt color)
- Text: "Blue Belt . 2 stripes" (or just "White Belt" if 0 stripes)
- Tappable to edit belt and stripes

### Settings Card
- **Belt Row:** Label "Belt", value "Blue Belt . 2 stripes", tappable
- **Training Target Row:** Label "Training Target", value "4x / week", tappable
- **Logging Preference Row:** Label "Logging Preference", value "Voice" or "Text", tappable
- **Sessions Logged Row:** Label "Sessions Logged", value number (read-only, monospace)

### Personal Info Card
- **Birthday Row:** Label "Birthday", shows calculated age "28 years old", tappable (opens date picker)
- **Gender Row:** Label "Gender", value "Male"/"Female" or "+ Add", tappable (two-chip toggle)
- **Body Weight Row:** Label "Body Weight", value "170 lb" or "77 kg", tappable (number input + unit toggle)

### Gym Card
- Shows your primary/home gym
- Gym name, session count at that gym
- "Change gym" gold button
- Tap to edit via gym search

### Gym History (collapsible)
- Timeline of all gyms you've trained at
- Grouped by month
- Each entry: gym name, date range, session count
- Tappable to edit notes about that gym

### Sign Out Button
- Bottom of screen
- Text: "Sign Out" (red text)
- Shows confirmation alert on tap
- Confirming signs you out and returns to Auth Screen
