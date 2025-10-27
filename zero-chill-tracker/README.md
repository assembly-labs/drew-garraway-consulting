# 0 Chill Tracker

A simple, beautiful web app for tracking your daily chill vs no-chill days.

## Features

- **Visual Calendar**: Monthly calendar view with intuitive color coding
- **Simple Tracking**: Click to cycle through states:
  - Untracked → 🤙 Chill (1) → 0 No Chill (0) → Untracked
- **Monthly Statistics**: See your chill days, no-chill days, total tracked, and chill percentage
- **Data Persistence**: All data saved to localStorage
- **Smooth Animations**: Built with Framer Motion for delightful interactions
- **Responsive Design**: Works great on mobile and desktop

## Color System

- **Green 🤙**: Chill day (value: 1)
- **Red 0**: No chill day (value: 0)
- **Gray**: Not tracked yet

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- localStorage (data persistence)

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## UX Design Decisions

1. **One-Click Interaction**: Click to cycle through all states, making tracking effortless
2. **Visual Feedback**: Immediate color changes and smooth animations provide clear feedback
3. **Monthly Stats**: Quick overview of your month at a glance
4. **Today Highlight**: Current day has a blue border for easy identification
5. **Month Navigation**: Easy navigation with prev/next buttons and "Today" shortcut
6. **Responsive Grid**: Calendar adapts beautifully to any screen size

## How It Works

The app uses a custom `useChillTracker` hook that:
- Manages state for all tracked days
- Persists data to localStorage automatically
- Provides helpers for toggling days and calculating stats

Each day can be in one of three states:
- `null`: Not tracked (default)
- `1`: Chill day (green with 🤙)
- `0`: No chill day (red with 0)

Click any day to cycle through these states!
