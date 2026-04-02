# TOMO MVP 1.0

Everything needed to design, develop, test, and ship TOMO lives here.

## Structure

| Folder | What's inside |
|--------|--------------|
| `app/` | iOS codebase (React Native, Expo, Supabase) |
| `design/` | Brand assets, icons, style guide, screen mockups |
| `docs/` | Feature specs, tracking, deployment, design reviews, AI strategy |

## Quick Access

| I need to... | Go to... |
|--------------|----------|
| Check bugs and open issues | `docs/tracking/ISSUES.md` |
| See what shipped recently | `docs/tracking/CHANGELOG.md` |
| See the feature backlog | `docs/features/README.md` |
| Build for TestFlight | `app/build.sh` |
| Run locally on device | `cd app && SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device` |
| View screen mockups | Open `design/screens/mockups.html` in browser |
| View screen element names | Open `design/screens/index.html` in browser |

## When MVP 1.0 is market-ready

Clone `app/` into a release package. This folder stays intact as the historical workspace.
