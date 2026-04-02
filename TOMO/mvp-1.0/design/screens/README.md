# TOMO Screen Reference

Use this folder as the shared vocabulary between you and Claude Code. When you want a change, reference the **screen name** and **element name** from these docs so there's zero ambiguity.

Example: "On the **Recording Screen**, make the **Session Timer** font smaller."

## All Screens

### Onboarding (first-time setup, 4 screens)

| Screen | File | What it does |
|--------|------|-------------|
| [Welcome Screen](onboarding-welcome.md) | WelcomeScreen.tsx | App logo, typewriter taglines, "Get Started" button |
| [About You Screen](onboarding-about-you.md) | AboutYouScreen.tsx | Name, belt, stripes, birthday, gender |
| [Your Training Screen](onboarding-your-training.md) | YourTrainingScreen.tsx | Gym picker, training frequency, goals, experience |
| [Get Started Screen](onboarding-get-started.md) | GetStartedScreen.tsx | Voice vs text preference, mic permission, chat payoff |

### Session Logging (5 phases, one screen)

| Phase | File | What it does |
|-------|------|-------------|
| [Entry Phase](session-entry.md) | SessionLoggerScreen.tsx | Pre-recording form: mode, kind, duration, spar toggle |
| [Recording Phase](session-recording.md) | SessionLoggerScreen.tsx | Live mic recording with timer and prompts |
| [Processing Phase](session-processing.md) | SessionLoggerScreen.tsx | Loading screen while voice is transcribed and analyzed |
| [Review Phase](session-review.md) | SessionLoggerScreen.tsx | Editable form with all extracted fields, save button |
| [Success Phase](session-success.md) | SessionLoggerScreen.tsx | Post-save quote (4 seconds), then back to Journal |

### Main App (tab bar screens)

| Screen | File | What it does |
|--------|------|-------------|
| [Journal List](journal-list.md) | JournalScreen.tsx | List of all logged sessions, filterable |
| [Session Detail](session-detail.md) | SessionDetailScreen.tsx | View and edit a saved session |
| [Insights](insights.md) | InsightsScreen.tsx | Weekly training insights with typewriter animation |
| [Profile](profile.md) | ProfileScreen.tsx | User info, belt, gym, settings, sign out |

### Other

| Screen | File | What it does |
|--------|------|-------------|
| [Auth Screen](auth.md) | AuthScreen.tsx | Sign in / sign up with email and password |

### Shared Components

| Component | File | Where it appears |
|-----------|------|-----------------|
| [Tab Bar](tab-bar.md) | MainTabNavigator.tsx | Bottom of every main app screen |
| [Post-Save Quote](post-save-quote.md) | PostSaveQuote.tsx | Full-screen quote after saving a session |
| [Gym Chip](gym-chip.md) | GymChip.tsx | Entry Phase, Review Phase, Session Detail |
| [Gym Picker Sheet](gym-picker-sheet.md) | GymPickerSheet.tsx | Modal for switching gyms temporarily |

## Workflows

See [workflows.md](workflows.md) for how screens connect and what triggers transitions.
