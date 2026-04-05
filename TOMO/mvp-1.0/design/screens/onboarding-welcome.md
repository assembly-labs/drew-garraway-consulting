# Welcome Screen

First screen new users see after signing up.

**Code:** `tomo/src/screens/onboarding/WelcomeScreen.tsx`
**Phase:** Onboarding (screen 1 of 4)

## Elements

### Progress Bar
- Thin bar at top showing 1/4 progress
- Auto-adjusts if screens are added/removed

### App Logo
- "TOMO" in large white text (Unbounded ExtraBold, 48px)
- "友" kanji below in gold (32px)
- Centered on screen

### Typewriter Tagline
- Cycles through 3 phrases with typing animation:
  1. "Your training. Remembered."
  2. "Every session. A lesson."
  3. "Let's roll."
- Gold blinking cursor at end
- Tap anywhere on the tagline area to skip the animation

### Get Started Button
- Full-width gold button at bottom
- Text: "Get Started" (black text on gold)
- Triggers medium haptic on tap
- Navigates to About You Screen
