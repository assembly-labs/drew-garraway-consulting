# Onboarding Flow - Technical Specification

## Architecture

### Components

| Component | Path | Purpose |
|-----------|------|---------|
| `Onboarding.tsx` | `/prototype/src/components/features/Onboarding.tsx` | Main onboarding flow (4 screens) |
| `GymPicker.tsx` | `/prototype/src/components/ui/GymPicker.tsx` | Searchable gym selector with manual entry |
| `UserProfileContext.tsx` | `/prototype/src/context/UserProfileContext.tsx` | Profile state management, onboarding completion |

### State Management

Onboarding uses local component state during the flow, then commits to `UserProfileContext` on completion.

**Local State (during onboarding):**
```typescript
type OnboardingStep = 'welcome' | 'about' | 'training' | 'start';

// Mandatory fields
const [name, setName] = useState('');
const [belt, setBelt] = useState<BeltLevel | null>(null);
const [stripes, setStripes] = useState<number | null>(null);
const [gym, setGym] = useState<GymSelection | null>(null);
const [targetFrequency, setTargetFrequency] = useState<number | null>(null);
const [loggingPreference, setLoggingPreference] = useState<'voice' | 'text'>('voice'); // Pre-selected

// Optional fields
const [trainingGoals, setTrainingGoals] = useState<TrainingGoal[]>([]);
const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
```

**Context State (after onboarding):**
```typescript
interface UserProfile {
  userId: string;
  name: string;
  belt: BeltLevel;
  stripes: number;
  gym: GymSelection | null;
  targetFrequency: number;
  loggingPreference: LoggingPreference;
  trainingGoals: TrainingGoal[];
  experienceLevel: ExperienceLevel | null;
  onboardingComplete: boolean;
  sessionCount: number;
  // ... progressive profiling fields
}
```

### Data Model

```typescript
// Belt levels
type BeltLevel = 'white' | 'blue' | 'purple' | 'brown' | 'black';

// Training goals (multi-select)
type TrainingGoal = 'competition' | 'fitness' | 'hobby' | 'mental';

// Experience levels (single-select)
type ExperienceLevel = 'new' | 'beginner' | 'intermediate' | 'experienced';

// Gym selection (from database or custom)
interface GymSelection {
  gymId: string;
  gymName: string;
  isCustom: boolean;
  city?: string;
  stateOrCountry?: string;
  affiliation?: string;
}

// Data passed to context on completion
interface OnboardingData {
  name: string;
  belt: BeltLevel;
  stripes: number;
  gym: GymSelection;
  targetFrequency: number;
  loggingPreference: 'voice' | 'text';
  trainingGoals?: TrainingGoal[];
  experienceLevel?: ExperienceLevel;
}
```

## Implementation Notes

### Updates Required (from approved prototype)

The existing `Onboarding.tsx` needs these updates to match the approved design:

1. **Add Step Counter**
   - Replace empty header space with text step counter
   - Format: `<span class="current">1</span> of 3`
   - Use JetBrains Mono font, 12px, gray-500 for "of 3", gold for current number
   - Welcome screen has no counter

2. **Pre-select Voice**
   - Initialize `loggingPreference` to `'voice'` instead of `null`
   - Show success section immediately on Screen 4

3. **Add Recommended Badge**
   - Add "Recommended" badge next to Voice option
   - Style: gold border, gold text, uppercase, 10px JetBrains Mono

4. **Add Settings Note**
   - Add "You can change this later in Settings" below preference cards
   - Style: centered, 13px, gray-500

### Screen-by-Screen Implementation

#### Screen 1: Welcome
- No changes needed
- No step counter (intro screen)

#### Screen 2: About You
- Add step counter: `1 of 3`
- Validation: `name.trim().length > 0 && belt !== null && stripes !== null`

#### Screen 3: Your Training
- Add step counter: `2 of 3`
- Validation: `gym !== null && targetFrequency !== null`
- Optional section clearly separated with divider

#### Screen 4: Get Started
- Add step counter: `3 of 3`
- Pre-select Voice with "Recommended" badge
- Show success section immediately (since Voice is pre-selected)
- Add settings note below preference cards

### Props Interface

```typescript
interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
  onStartLogging: () => void;
}
```

### Integration with App.tsx

```typescript
// In App.tsx
const { profile, completeOnboarding } = useUserProfile();

if (!profile.onboardingComplete) {
  return (
    <Onboarding
      onComplete={completeOnboarding}
      onStartLogging={() => navigate('/log')}
    />
  );
}
```

## Belt System Integration

The belt selected during onboarding activates the personalization system:

```typescript
import { useBeltPersonalization } from '@/hooks';

// After onboarding, belt-aware content is available throughout the app
const { profile, dashboard, chatbot } = useBeltPersonalization();
```

Key integration points:
- `profile.psychologyProfile` - Belt-specific struggles and motivations
- `dashboard.primaryMetric` - What to emphasize on dashboard
- `chatbot.toneProfile` - How AI assistant should communicate

## Testing

### Unit Tests

- [ ] Cannot proceed from About You without name
- [ ] Cannot proceed from About You without belt selection
- [ ] Cannot proceed from About You without stripe selection
- [ ] Cannot proceed from Training without gym selection
- [ ] Cannot proceed from Training without frequency selection
- [ ] Voice is pre-selected on Get Started screen
- [ ] Success section visible immediately on Get Started
- [ ] Optional fields can be skipped
- [ ] Back navigation preserves all entered data
- [ ] `onComplete` called with correct data structure
- [ ] `onStartLogging` called when primary CTA tapped

### Integration Tests

- [ ] Onboarding data persists to localStorage via UserProfileContext
- [ ] Profile marked as `onboardingComplete: true` after flow
- [ ] Belt personalization activates immediately after onboarding
- [ ] Session logger respects `loggingPreference` setting

### Manual Testing

1. Complete flow with all mandatory fields only
2. Complete flow with all optional fields filled
3. Test back navigation at each step
4. Test gym search, browse, and manual entry
5. Verify 56px touch targets on mobile viewport
6. Verify step counter displays correctly on each screen

## Dependencies

- `@/components/ui/Icons` - SVG icons (Mic, Edit, ChevronLeft, Check)
- `@/components/ui/GymPicker` - Gym selection component
- `@/context/UserProfileContext` - Profile state management
- `@/data/gyms` - Gym database

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Screen reader | All interactive elements have `aria-label` |
| Focus management | Auto-focus on name input (Screen 2) |
| Touch targets | 56px minimum for all primary actions |
| Color contrast | WCAG AA (4.5:1 minimum) |
| Keyboard nav | All buttons keyboard accessible |

## Performance

- No external API calls during onboarding
- All data stored locally until flow completion
- Single write to localStorage on completion
- Screen transitions use CSS (no JS animations)

---

*Technical spec for approved prototype: 2026-02-08-onboarding-flow.html*
