# Alliance BJJ App (Ally) - Claude Code Instructions

## Design System Workflow

**IMPORTANT:** When the user edits `design-system/styles.css`, always:

1. After any design system discussion or CSS changes, remind them:
   > "Would you like me to sync these changes to theme.js?"

2. When syncing, update these files to match the CSS `:root` variables:
   - `alliance-mobile/constants/theme.js` - React Native theme constants
   - `design-system/tokens.md` - Markdown documentation (update the tables)

3. The source of truth flow:
   ```
   design-system/styles.css (user edits here)
         ↓
   alliance-mobile/constants/theme.js (Claude syncs here)
   ```

## Project Structure

- `alliance-mobile/` - React Native Expo app
  - `constants/theme.js` - Design tokens for the app
  - `data/mockData.js` - Centralized prototype data
  - `screens/` - Screen components
  - `context/` - App state management

- `design-system/` - Visual design system reference
  - `index.html` - Open in browser to view design system
  - `styles.css` - **Source of truth** for design tokens (`:root` section)
  - `tokens.md` - Markdown reference

## Code Style

- ESLint + Prettier configured in `alliance-mobile/`
- Run `npm run lint` to check, `npm run format` to fix
- No TypeScript yet (plain JavaScript)

## Prototype Mode

This app is in prototype mode with mock data. No backend/API work yet.
All data comes from `data/mockData.js` and `context/AppContext.js`.
