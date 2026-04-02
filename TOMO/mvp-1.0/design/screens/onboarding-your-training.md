# Your Training Screen

Collects gym, training frequency, and optional goals/experience/weight.

**Code:** `tomo/src/screens/onboarding/YourTrainingScreen.tsx`
**Phase:** Onboarding (screen 3 of 4)

## Elements

### Back Button
- Top-left, goes back to About You Screen

### Progress Bar
- Shows 3/4 progress

### Screen Title
- "Your Training" (Unbounded ExtraBold, 28px, white)

### Location Permission Card
- Animated card that asks to enable location
- Header: map pin icon + "Find gyms near you"
- Explanation text about why location helps
- **Enable Location Button:** Gold, primary action
- **Skip Button:** Gray outline, secondary
- Card fades out and collapses after choice is made

### Gym Search Input
- Text input for finding your gym
- Placeholder: "Your home gym" or "Where are you training?"
- Autocomplete dropdown appears as you type (needs 2+ characters)
- Shows matching gyms with city/state info
- If no match found, treats your text as a custom gym name
- Selected gym shows with a gold checkmark

### Nearby Gyms List
- Only appears if location was granted and gyms were found
- Cards showing gym name, distance, city, state
- Tap a card to select that gym

### Training Target Picker
- Label: "TRAINING TARGET"
- Three pill buttons:
  - "1-2x / week"
  - "3-4x / week" (selected by default)
  - "5+ / week"
- Selected gets gold highlight

### Training Goals (optional)
- Label: "TRAINING GOALS"
- Multi-select chips: Competition, Fitness, Self-Defense, Mental Health, Community, Hobby
- Tap to toggle on/off
- Light haptic on each tap

### Experience Level (optional)
- Label: "EXPERIENCE LEVEL"
- Four options:
  - "< 6 months"
  - "6mo - 2yr"
  - "2 - 5yr"
  - "5+ yr"

### Body Weight (optional)
- Label: "BODY WEIGHT"
- Number input for weight value
- Unit toggle: "lb" / "kg"
- Shows your competition weight class based on gender

### Continue Button
- Full-width at bottom
- Enabled once gym is selected
- Navigates to Get Started Screen
