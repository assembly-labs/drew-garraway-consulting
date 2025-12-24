# Alliance BJJ Mobile App

React Native mobile application for Alliance BJJ gym members.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

## Project Structure

```
alliance-mobile/
├── App.js                 # Root component with navigation setup
├── index.js               # Entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
│
├── constants/             # Design system (single source of truth)
│   ├── index.js           # Barrel export
│   └── theme.js           # Colors, typography, spacing, component styles
│
├── context/               # State management
│   └── AppContext.js      # App-wide state provider (prototype mode)
│
├── data/                  # Mock data (single source of truth)
│   ├── index.js           # Barrel export
│   └── mockData.js        # All prototype/demo data
│
├── screens/               # Screen components
│   ├── HomeScreen.js      # Dashboard with stats and next class
│   ├── ScheduleScreen.js  # Class schedule with filters
│   ├── CheckInScreen.js   # QR code check-in
│   ├── ProgressScreen.js  # Belt progression and techniques
│   ├── ProfileScreen.js   # User profile and settings
│   ├── PaymentsScreen.js  # Payment history and billing
│   ├── ClassDetailScreen.js # Detailed class information
│   └── LoginScreen.js     # Authentication (auto-login for prototype)
│
└── assets/                # Images and icons
    └── *.png              # App icons and images
```

## Architecture

### Design System (`constants/theme.js`)

All design tokens are centralized in a single file. When updating colors, typography, or spacing:

```javascript
import { colors, spacing, componentStyles } from '../constants';

// Use theme values
<View style={{ backgroundColor: colors.background, padding: spacing.lg }}>
  <Text style={{ color: colors.text.primary }}>Hello</Text>
</View>
```

**Key exports:**
- `colors` - Color palette (primary, backgrounds, text, status, belts)
- `typography` - Font sizes and weights
- `spacing` - Consistent spacing scale
- `borderRadius` - Border radius values
- `componentStyles` - Pre-built component styles (cards, buttons, inputs)

### Mock Data (`data/mockData.js`)

All prototype data is centralized here. When updating demo data:

```javascript
import { currentMember, trainingStats, scheduleClasses } from '../data';
```

**Key exports:**
- `currentMember` - User profile data
- `membershipInfo` - Billing and plan details
- `trainingStats` - Class attendance statistics
- `scheduleClasses` - Class schedule data
- `techniques`, `milestones` - Progress tracking data

### State Management (`context/AppContext.js`)

Uses React Context for app-wide state. Currently in **prototype mode** with static data.

```javascript
import { useAppContext } from '../context/AppContext';

function MyComponent() {
  const { user, checkInToClass } = useAppContext();
  // ...
}
```

### Navigation

Uses React Navigation with:
- **Tab Navigator** - Main app tabs (Home, Schedule, Check-In, Progress, Profile)
- **Stack Navigator** - Modal screens (ClassDetail, Payments, Login)

## Development Scripts

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS
npm run android    # Run on Android
npm run web        # Run in browser

npm run lint       # Run ESLint
npm run lint:fix   # Auto-fix linting issues
npm run format     # Format code with Prettier
npm run format:check  # Check formatting
```

## Design Iteration Workflow

When making design changes:

1. **Colors/Styling** → Update `constants/theme.js`
2. **Demo Data** → Update `data/mockData.js`
3. **Component Logic** → Update relevant screen in `screens/`

This ensures a single source of truth for each concern.

## Current Status: Prototype

This is a **UI prototype** with mock data. Features to implement before production:

- [ ] Real authentication (replace auto-login)
- [ ] API integration (replace mock data)
- [ ] Persistent storage (AsyncStorage)
- [ ] Error handling and error boundaries
- [ ] Push notifications
- [ ] Offline support

## Tech Stack

- **Framework:** React Native with Expo (~54.0)
- **Navigation:** React Navigation 7.x
- **Icons:** Expo Vector Icons (Ionicons)
- **State:** React Context
- **Styling:** React Native StyleSheet
