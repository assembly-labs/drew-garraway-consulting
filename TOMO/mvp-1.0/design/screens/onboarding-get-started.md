# Get Started Screen

Final onboarding screen. Logging preference, mic permission, and welcome chat.

**Code:** `tomo/src/screens/onboarding/GetStartedScreen.tsx`
**Phase:** Onboarding (screen 4 of 4, can't swipe back)

## Elements

### Progress Bar
- Shows 4/4 (complete)

### Screen Title
- "Ready to get rolling?"

### Screen Subtitle
- "Choose your logging style"

### Voice First Button
- Primary gold button
- Text: "Voice First"
- Selects voice as logging preference
- Triggers mic permission flow

### Type It In Button
- Secondary outline button
- Text: "Type It In"
- Selects text as logging preference
- Skips mic permission, goes straight to chat payoff

### Mic Permission Primer (voice path only)
- Modal that explains why the app needs mic access
- Description of how voice logging works
- **Allow Button:** System-style blue button, requests actual mic permission
- **Use Text Instead:** Gray fallback if they decline

### Chat Payoff Overlay
- Full-screen dark overlay after preference is set
- TOMO avatar: gold circle with "友" character
- Sequential chat bubbles with typing animation:
  1. "Hey {name}. {Belt} belt{stripes}, training at {Gym}. Got it."
  2. "After each session, just talk. I'll track your progress and spot the patterns."
  3. "Tell me how long you trained, what techniques you drilled, and how your rounds went..."
  4. "Like: 'Trained gi today for about an hour...'"
  5. "Let's get to work."
- Typing indicator (3 pulsing dots) between bubbles
- Each bubble fades in and types out character by character

### Start Training Button
- Appears after all chat bubbles finish
- Gold button: "Start Training"
- Navigates to the main app (Tab Bar, Journal tab)
- Medium haptic on tap
