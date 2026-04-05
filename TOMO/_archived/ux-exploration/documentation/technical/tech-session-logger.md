# Session Logger - Technical Specification

## Architecture

### Components

| Component | Path | Purpose |
|-----------|------|---------|
| `VoiceFirstLogger.tsx` | `/prototype/src/components/features/VoiceFirstLogger.tsx` | Main orchestrator for session logging flow |
| `EntryPhase.tsx` | `/prototype/src/components/features/voice-logger/EntryPhase.tsx` | Initial form with quick context fields |
| `RecordingPhase.tsx` | `/prototype/src/components/features/voice-logger/RecordingPhase.tsx` | Voice capture with timer and prompts |
| `ProcessingPhase.tsx` | `/prototype/src/components/features/voice-logger/ProcessingPhase.tsx` | AI processing indicator |
| `ReviewPhase.tsx` | `/prototype/src/components/features/voice-logger/ReviewPhase.tsx` | Editable form with extracted data |
| `SuccessPhase.tsx` | `/prototype/src/components/features/voice-logger/SuccessPhase.tsx` | Confirmation with belt-personalized message |
| `ErrorPhase.tsx` | `/prototype/src/components/features/voice-logger/ErrorPhase.tsx` | Error handling with retry |

### State Management

Session logging uses local component state during the flow, then commits to database via API on save.

**Local State (during logging):**
```typescript
const [sessionData, setSessionData] = useState<SessionData>({
  ...DEFAULT_SESSION_DATA,
  trainingType: 'gi',
  durationMinutes: 90,
});
```

**SessionData Interface:**
```typescript
interface SessionData {
  // Auto-captured
  date: string;
  time: string;
  dayOfWeek: string;

  // Quick context
  trainingType: TrainingType | null;
  durationMinutes: number | null;

  // Learning section
  lessonTopic: string | null;        // What did coach teach?
  techniquesDrilled: string[];

  // Sparring section
  didSpar: boolean;
  sparringRounds: number | null;
  submissionsGiven: SubmissionCount[];
  submissionsReceived: SubmissionCount[];

  // Reflection
  workedWell: string[];
  struggles: string[];
  energyLevel: number | null;        // 1-5 scale

  // Raw input
  rawText?: string;
  voiceTranscript?: string;
}
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User completes ReviewPhase form                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  VoiceFirstLogger.handleSave()                              │
│                                                             │
│  Maps SessionData → SessionInsert:                          │
│  - trainingType → training_type                             │
│  - durationMinutes → duration_minutes                       │
│  - techniquesDrilled → techniques_drilled                   │
│  - workedWell → worked_well                                 │
│  - struggles → struggles                                    │
│  - lessonTopic → lesson_topic                               │
│  - energyLevel → energy_level                               │
│  - didSpar → did_spar                                       │
│  - sparringRounds → sparring_rounds                         │
│  - rawText → voice_transcript                               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  api.sessions.create(sessionInsert)                         │
│                                                             │
│  Saves to localStorage (prototype)                          │
│  Will save to Supabase (production)                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  If sparring data exists:                                   │
│  api.submissions.createBatch(submissionInserts)             │
│                                                             │
│  Expands SubmissionCount[] → individual SubmissionRecord[]  │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Status (Feb 2026)

### Features Completed

| Feature | Status | Notes |
|---------|--------|-------|
| Entry phase | ✅ | Smart defaults (Gi, 90 min) |
| Recording phase | ✅ | Timer, waveform, rotating prompts |
| Processing phase | ✅ | Mock extraction working |
| Review phase | ✅ | Full form with all fields |
| Success phase | ✅ | Belt-personalized messages |
| Error phase | ✅ | Retry logic |
| Lesson topic | ✅ | Added Feb 2026 |
| Energy level | ✅ | 1-5 picker, added Feb 2026 |
| Transcript display | ✅ | Collapsible, added Feb 2026 |
| Data alignment | ✅ | All fields mapped correctly |

### Features Pending

| Feature | Priority | Notes |
|---------|----------|-------|
| 90-second hard stop | High | Currently no time limit enforced |
| 80-second warning | High | Should show "10 seconds remaining" |
| White belt sparring lock | Medium | Currently shows full sparring section to all |
| Real voice transcription | Future | Requires AssemblyAI integration |
| Real AI extraction | Future | Requires Claude API integration |

## Database Schema

### Session Table

```typescript
interface Session {
  id: string;
  user_id: string;
  date: string;
  time: string | null;
  training_type: TrainingType;
  duration_minutes: number | null;

  lesson_topic: string | null;
  techniques_drilled: string[];

  did_spar: boolean;
  sparring_rounds: number | null;

  worked_well: string[];
  struggles: string[];
  energy_level: number | null;

  notes: string | null;
  voice_transcript: string | null;

  created_at: string;
  updated_at: string;
}
```

### Submission Table

```typescript
interface SubmissionRecord {
  id: string;
  session_id: string;
  user_id: string;
  technique_name: string;
  outcome: 'given' | 'received';
  body_region: BodyRegion;
  date: string;
  created_at: string;
}
```

## API Service

### Session Creation

```typescript
// In VoiceFirstLogger.tsx handleSave()
const sessionResult = await api.sessions.create({
  user_id: userId,
  date: sessionDate,
  training_type: sessionData.trainingType || 'gi',
  duration_minutes: sessionData.durationMinutes,
  did_spar: sessionData.didSpar,
  sparring_rounds: sessionData.sparringRounds,
  techniques_drilled: sessionData.techniquesDrilled,
  worked_well: sessionData.workedWell,
  struggles: sessionData.struggles,
  voice_transcript: sessionData.rawText || '',
  lesson_topic: sessionData.lessonTopic,
  energy_level: sessionData.energyLevel,
});
```

## Testing Checklist

### Data Capture
- [x] Training type saves correctly
- [x] Duration saves correctly
- [x] Techniques save to techniques_drilled field
- [x] Worked well captures user input
- [x] Struggles captures user input
- [x] Lesson topic captures user input
- [x] Energy level captures 1-5 value
- [x] Voice transcript displays in review
- [x] Submissions expand to individual records

### UI Elements
- [x] Transcript section is collapsible
- [x] "Show more/less" toggle works
- [x] Lesson topic input accepts text
- [x] Energy picker shows 5 options with labels
- [x] All existing fields still work

## Dependencies

- `@/services/api` - API abstraction layer
- `@/context/UserProfileContext` - User profile and belt level
- `@/hooks/useBeltPersonalization` - Belt-specific prompts and messages
- `@/types/database` - TypeScript interfaces

---

*Technical spec updated: February 8, 2026*
*Related PRD: /docs/product/_manual_product_requirements_doc/SESSION_LOGGER_PRD.md*
