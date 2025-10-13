# Architecture Overview

## System Design

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Styling**: Inline styles with design tokens
- **Routing**: Manual screen management (no react-router)

### File Structure
```
prototype/src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── ProgressBar.tsx
│   ├── Toast.tsx
│   └── ExerciseConfigModal.tsx
│
├── constants/        # Design tokens
│   ├── colors.ts     # Color palette
│   ├── spacing.ts    # Spacing scale
│   └── typography.ts # Font styles
│
├── context/          # Global state management
│   └── AppContext.tsx
│
├── data/            # Static data & defaults
│   ├── exerciseLibrary.ts  # 8 exercises
│   ├── workoutPlans.ts     # 5 default plans
│   └── pushMessages.ts     # 15 motivational messages
│
├── hooks/           # Custom React hooks
│   ├── useTimer.ts           # Countdown timer
│   └── useExerciseTimer.ts   # Exercise-specific timing
│
├── screens/         # Full-page components
│   ├── WelcomeScreen.tsx
│   ├── ModeSelectionScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── PreFlightScreen.tsx
│   ├── ActiveWorkoutScreen.tsx
│   ├── WorkoutSummaryScreen.tsx
│   ├── WorkoutHistoryScreen.tsx
│   ├── PlanManagementScreen.tsx
│   ├── PlanCreationScreen.tsx
│   └── SettingsScreen.tsx
│
├── services/        # Business logic
│   └── StorageService.ts  # localStorage wrapper
│
├── App.tsx          # Root component & routing
└── main.tsx         # React entry point
```

---

## Data Flow

### 1. Storage Layer (`StorageService.ts`)
**Responsibilities:**
- Read/write to localStorage
- Data serialization (JSON)
- Type-safe storage operations

**Key Methods:**
- `savePlans()` - Persist workout plans
- `loadPlans()` - Retrieve workout plans
- `saveHistory()` - Store completed workouts
- `loadHistory()` - Get workout history
- `savePreferences()` - User settings

### 2. Context Layer (`AppContext.tsx`)
**Responsibilities:**
- Global state management
- CRUD operations for plans
- Workout session tracking
- User preferences

**Provides:**
- `plans[]` - All workout plans
- `addPlan()` - Create new plan
- `deletePlan()` - Remove plan
- `workoutHistory[]` - Past workouts
- `addWorkoutSession()` - Save completed workout
- `preferences` - User settings

### 3. UI Layer (Screens & Components)
**Responsibilities:**
- Consume context data
- Render UI
- Handle user interactions
- Navigate between screens

---

## Key Features

### Local-First Architecture
- **No backend required** - Fully client-side
- **Instant operations** - No network latency
- **Works offline** - Once loaded, no internet needed
- **Privacy** - All data stays in browser

### State Management Pattern
```
User Action → Component → Context → StorageService → localStorage
                 ↑                                        ↓
                 └────────── Context Update ──────────────┘
```

### Screen Routing
Currently using manual screen state management in `App.tsx`:
```typescript
type Screen =
  | 'welcome'
  | 'mode-selection'
  | 'dashboard'
  | 'pre-flight'
  | 'workout'
  | 'summary'
  | 'history'
  | 'plans'
  | 'create-plan'
  | 'settings';

const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
```

Simple but effective for MVP. Can migrate to react-router later if needed.

---

## Performance Considerations

### Build Optimization
- **Code splitting**: React vendor bundle separated
- **Tree shaking**: Unused code removed
- **Minification**: Production builds optimized
- **Source maps**: Available for debugging

### Runtime Optimization
- **Lazy updates**: State only updates when needed
- **Local storage caching**: Reduces re-reads
- **Memoization**: Timer hooks use React.memo patterns

---

## Mobile Optimization

### Touch-Friendly UI
- Large tap targets (48px minimum)
- Swipe gestures considered
- No hover states (mobile doesn't have hover)

### Performance
- Viewport meta tags prevent zoom issues
- CSS reset for consistent rendering
- -webkit-tap-highlight-color: transparent

### Browser Compatibility
- Tested on iOS Safari
- Tested on Chrome Android
- Uses standard Web APIs (no experimental features)

---

## Data Models

### Workout Plan
```typescript
interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: Exercise[];
  estimatedTime: number; // minutes
}
```

### Exercise
```typescript
interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  reps?: number;
  sets?: number;
  duration?: number; // seconds
  rest?: number; // seconds
}
```

### Workout Session
```typescript
interface WorkoutSession {
  id: string;
  planId: string;
  planName: string;
  startTime: Date;
  endTime: Date;
  completedExercises: number;
  totalExercises: number;
  completionPercentage: number;
  mode: 'Challenge' | 'Beast';
  // ... more tracking data
}
```

---

## Future Architectural Considerations

### When to Add Backend
Consider adding backend when:
- Multi-device sync needed
- Social features required
- Advanced analytics desired
- User authentication needed

**Recommended:** Firebase or Supabase for easy integration

### When to Add Router
Consider react-router when:
- Deep linking needed (share specific workout)
- Browser back button becomes important
- URL-based navigation required

### When to Add State Management Library
Consider Redux/Zustand when:
- Context becomes too complex
- Performance issues with re-renders
- Need for middleware (logging, persistence)

---

## Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **No `any` types**: Explicit typing required
- **Functional components**: No class components
- **Hooks**: Custom hooks for reusable logic

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '../components/Button';

// 2. Type definitions
interface Props {
  onSubmit: () => void;
}

// 3. Component
export function MyScreen({ onSubmit }: Props) {
  const [state, setState] = useState();

  // 4. Event handlers
  const handleClick = () => {...};

  // 5. Render
  return (...);
}
```

### File Naming
- Components: PascalCase (e.g., `Button.tsx`)
- Utilities: camelCase (e.g., `storageService.ts`)
- Constants: camelCase (e.g., `colors.ts`)
- Screens: PascalCase + Screen suffix (e.g., `DashboardScreen.tsx`)

---

## Testing Strategy (Future)

When adding tests, consider:
- **Unit tests**: Components, hooks, utilities
- **Integration tests**: Full user flows
- **E2E tests**: Critical paths (onboarding → workout → summary)

**Recommended tools:**
- Vitest (fast, Vite-native)
- React Testing Library
- Playwright (E2E)
