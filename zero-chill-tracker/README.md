# ZERO CHILL

A simple, beautiful web app for tracking your daily chill vs no-chill days. Press the button only if today had ZERO CHILL.

## Features

- **Daily Check-In**: Giant red "ZERO CHILL" button as the main interaction
- **One-Button Tracking**: Press the button if you had zero chill, or mark it as chill
- **PWA Support**: Install as a standalone app on your phone
- **Visual Calendar**: Monthly calendar view with intuitive color coding
- **Monthly Statistics**: See your chill days, no-chill days, total tracked, and chill percentage
- **Data Persistence**: All data saved to localStorage (works offline)
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
- PWA (Progressive Web App) with Service Worker

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

## Installing as a Mobile App

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

## UX Flow

1. **Daily Check-In**: Open the app to see the giant "ZERO CHILL" button
2. **Press Button**: If you had zero chill today, press the red button → day marked as 0
3. **Alternative**: Press "Actually, it was chill 🤙" → day marked as chill
4. **Confirmation**: See your choice confirmed with animation
5. **View History**: Navigate to calendar to see your monthly progress
6. **Stats Dashboard**: Check your chill percentage and streaks

## UX Design Decisions

1. **Focus on Daily Interaction**: The main screen is optimized for quick daily logging
2. **Giant Button**: Impossible to miss, makes the primary action obvious
3. **Visual Feedback**: Immediate confirmation with smooth animations
4. **Secondary Calendar**: History view doesn't interfere with daily check-in
5. **PWA**: Feels like a native app with offline support
6. **Persistent Data**: Never lose your tracking data

## How It Works

The app uses a custom `useChillTracker` hook that:
- Manages state for all tracked days
- Persists data to localStorage automatically
- Provides setDay() for direct value setting
- Calculates monthly statistics

Each day can be in one of two states:
- `1`: Chill day (green with 🤙)
- `0`: No chill day (red with 0)

The daily check-in makes it easy to track in under 5 seconds!
