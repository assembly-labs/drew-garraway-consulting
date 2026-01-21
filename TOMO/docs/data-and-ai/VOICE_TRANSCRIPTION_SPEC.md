# Voice Transcription Specification

> **Purpose:** Technical specification for AssemblyAI integration, custom BJJ vocabulary, and accuracy requirements.
>
> **Status:** Active (MVP Implementation Guide)
>
> **Last Updated:** January 2026

---

## Overview

TOMO uses AssemblyAI for voice-to-text transcription. This document covers:
1. Why AssemblyAI (vs alternatives)
2. Integration architecture
3. Custom vocabulary for BJJ terminology
4. Accuracy targets and benchmarks
5. Cost management
6. Error handling and fallbacks

---

## Why AssemblyAI

| Factor | AssemblyAI | Whisper (OpenAI) | Deepgram |
|--------|------------|------------------|----------|
| **Proper noun accuracy** | 24% better | Baseline | Similar to Whisper |
| **Hallucination rate** | 30% lower | Higher | Similar |
| **Custom vocabulary** | Yes (boost words) | No | Yes |
| **Real-time streaming** | Yes | No (batch only) | Yes |
| **BJJ term handling** | Excellent with custom vocab | Poor without fine-tuning | Good |
| **Pricing** | $0.00025/sec ($0.015/min) | $0.006/min | $0.0044/min |

**Decision:** AssemblyAI's custom vocabulary support is critical for BJJ terminology. Without it, terms like "de la Riva," "berimbolo," and "omoplata" are frequently mistranscribed.

---

## Recording Specifications

### Audio Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Maximum duration** | 5 minutes (300 sec) | Cost control; longer recordings indicate rambling |
| **Typical duration** | 60-90 seconds | Matches 90-second friction budget |
| **Minimum useful** | 10 seconds | Anything shorter lacks meaningful content |
| **Sample rate** | 16kHz minimum | AssemblyAI requirement for accuracy |
| **Format** | AAC (preferred) or WAV | AAC for smaller files, WAV for max quality |
| **Channels** | Mono | Sufficient for voice; reduces file size |
| **Bitrate** | 128kbps (AAC) | Good balance of quality and size |

### File Size Estimates

| Duration | AAC (128kbps) | WAV (16kHz) |
|----------|---------------|-------------|
| 30 sec | ~480 KB | ~960 KB |
| 60 sec | ~960 KB | ~1.9 MB |
| 90 sec | ~1.4 MB | ~2.9 MB |
| 5 min | ~4.8 MB | ~9.6 MB |

### Auto-Stop Behavior

```typescript
interface RecordingConfig {
  maxDuration: 300;           // 5 minutes hard cap
  silenceTimeout: 3000;       // 3 seconds of silence triggers stop prompt
  silenceThreshold: -40;      // dB level considered silence
  showTimerAt: 240;           // Show countdown at 4 minutes
}
```

---

## Integration Approach: Batch vs Streaming

### Recommendation: **Post-Recording Batch** (Not Real-Time Streaming)

For TOMO's voice logging use case, **batch processing after recording completes** is the right choice.

### Why Batch Over Streaming

| Factor | Batch (Recommended) | Streaming |
|--------|---------------------|-----------|
| **Complexity** | Simple REST API | WebSocket management |
| **Recording length** | 60-90 sec typical | Better for 5+ min |
| **Accuracy** | Full context = better | Incremental = worse |
| **Error handling** | Retry whole request | Complex reconnection |
| **Offline support** | Queue and sync | Not possible |
| **Custom vocabulary** | Full support | Limited support |
| **Cost** | Same | Same |
| **User context** | Post-training, okay with 5-10 sec wait | Would need instant feedback |

### When Streaming Would Be Better

Streaming transcription makes sense when:
- User needs real-time feedback (e.g., live captioning)
- Recordings are very long (5+ minutes)
- Latency is more critical than accuracy

**None of these apply to TOMO's session logging flow.** Users record for 60-90 seconds, then wait for processing. A 5-10 second processing wait is acceptable given they're about to review and edit anyway.

### Latency Requirements

| Phase | Target | Maximum |
|-------|--------|---------|
| Recording end → Upload start | <500ms | 1s |
| Upload (90 sec audio) | <3s | 5s |
| AssemblyAI processing | 5-8s | 15s |
| **Total transcription** | **<10s** | 20s |
| LLM extraction | 2-4s | 8s |
| **End-to-end** | **<15s** | 30s |

### Implementation: Batch Flow

```typescript
async function processVoiceRecording(audioUri: string): Promise<SessionData> {
  // 1. Upload audio (non-blocking UI shows "Processing...")
  const audioUrl = await uploadAudio(audioUri);

  // 2. Submit transcription job
  const transcriptId = await submitTranscription(audioUrl);

  // 3. Poll for completion (with timeout)
  const transcript = await pollTranscription(transcriptId, {
    maxAttempts: 30,
    intervalMs: 1000,
    timeoutMs: 30000,
  });

  // 4. Extract entities
  const sessionData = await extractEntities(transcript.text);

  return sessionData;
}
```

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         VOICE CAPTURE FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [User taps Record]                                                  │
│         ↓                                                            │
│  [expo-av captures audio]                                            │
│         ↓                                                            │
│  [Audio uploaded to AssemblyAI]                                      │
│         ↓                                                            │
│  [Transcription with custom vocabulary]                              │
│         ↓                                                            │
│  [Transcript returned]                                               │
│         ↓                                                            │
│  [NLP extraction to structured data]                                 │
│         ↓                                                            │
│  [Review screen shown to user]                                       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Technical Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Audio capture | expo-av | React Native audio recording |
| Audio format | AAC or WAV | AAC preferred for smaller file size |
| Upload method | Direct upload | Not streaming (simpler, sufficient for 60-90s recordings) |
| API | AssemblyAI REST API | `/v2/transcript` endpoint |
| Custom vocabulary | `word_boost` parameter | BJJ terms with boost weight |

### API Integration

```typescript
// AssemblyAI transcription request
const transcribeAudio = async (audioUrl: string): Promise<string> => {
  const response = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'Authorization': process.env.ASSEMBLYAI_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      word_boost: BJJ_VOCABULARY,
      boost_param: 'high', // 'low' | 'default' | 'high'
      language_code: 'en_us',
      punctuate: true,
      format_text: true,
    }),
  });

  const { id } = await response.json();
  return pollForCompletion(id);
};
```

---

## Custom Vocabulary (BJJ Terms)

AssemblyAI's `word_boost` parameter accepts an array of terms to prioritize during transcription. These terms receive higher probability weight in the speech recognition model.

### Submission Techniques (Chokes)

```typescript
const CHOKES = [
  // Gi chokes
  'cross collar choke',
  'bow and arrow choke',
  'baseball bat choke',
  'loop choke',
  'clock choke',
  'ezekiel choke',
  'paper cutter choke',
  'brabo choke',

  // No-gi chokes
  'rear naked choke',
  'RNC',
  'guillotine',
  'darce',
  'anaconda',
  'arm triangle',
  'head and arm choke',
  'north south choke',
  'von flue choke',
  'peruvian necktie',
  'Japanese necktie',
  'd\'arce', // alternate spelling
];
```

### Submission Techniques (Joint Locks)

```typescript
const JOINT_LOCKS = [
  // Armlocks
  'armbar',
  'arm bar',
  'kimura',
  'americana',
  'omoplata',
  'wrist lock',
  'bicep slicer',
  'straight armlock',

  // Leg locks
  'heel hook',
  'inside heel hook',
  'outside heel hook',
  'ankle lock',
  'straight ankle lock',
  'toe hold',
  'kneebar',
  'knee bar',
  'calf slicer',
  'estima lock',
  'aoki lock',
];
```

### Guard Positions

```typescript
const GUARDS = [
  // Closed guards
  'closed guard',
  'full guard',
  'rubber guard',

  // Open guards
  'open guard',
  'spider guard',
  'lasso guard',
  'de la riva',
  'DLR',
  'reverse de la riva',
  'RDLR',
  'x guard',
  'single leg x',
  'SLX',
  'butterfly guard',
  'half butterfly',
  'k guard',
  'seated guard',
  'shin to shin',

  // Half guards
  'half guard',
  'deep half guard',
  'z guard',
  'knee shield',
  'lockdown',
  'quarter guard',

  // Inverted
  'inverted guard',
  'tornado guard',
  'berimbolo',
  'kiss of the dragon',
];
```

### Top Positions

```typescript
const TOP_POSITIONS = [
  'mount',
  'full mount',
  'low mount',
  'high mount',
  's mount',
  'side control',
  'side mount',
  'hundred kilos',
  'kesa gatame',
  'scarf hold',
  'north south',
  'knee on belly',
  'knee on chest',
  'back control',
  'back mount',
  'rear mount',
  'turtle',
  'front headlock',
  'crucifix',
];
```

### Sweeps and Transitions

```typescript
const SWEEPS = [
  'scissor sweep',
  'hip bump sweep',
  'flower sweep',
  'pendulum sweep',
  'elevator sweep',
  'overhead sweep',
  'sickle sweep',
  'lumberjack sweep',
  'tripod sweep',
  'technical standup',
  'wrestle up',
  'balloon sweep',
  'star sweep',
  'waiter sweep',
  'berimbolo',
  'baby bolo',
  'kiss of the dragon',
];
```

### Escapes

```typescript
const ESCAPES = [
  'hip escape',
  'shrimp',
  'elbow escape',
  'trap and roll',
  'upa',
  'bridge and roll',
  'frame',
  'framing',
  'underhook',
  'overhook',
  'whizzer',
  'granby roll',
  'inversion',
  'technical stand up',
];
```

### Takedowns and Wrestling

```typescript
const TAKEDOWNS = [
  'double leg',
  'single leg',
  'high crotch',
  'ankle pick',
  'arm drag',
  'snap down',
  'duck under',
  'fireman\'s carry',
  'body lock',
  'lat drop',
  'suplex',

  // Judo throws
  'osoto gari',
  'ouchi gari',
  'uchi mata',
  'seoi nage',
  'harai goshi',
  'tai otoshi',
  'tomoe nage',
  'foot sweep',
  'de ashi barai',
  'sasae',
  'kouchi gari',

  // Guard pulls
  'guard pull',
  'pull guard',
  'sit guard',
  'butt scoot',
];
```

### Guard Passing

```typescript
const PASSES = [
  'knee slice',
  'knee cut',
  'knee slide',
  'toreando',
  'toreando pass',
  'bullfighter pass',
  'leg drag',
  'x pass',
  'stack pass',
  'over under pass',
  'smash pass',
  'pressure pass',
  'long step pass',
  'headquarters',
  'float pass',
  'backstep',
  'leg weave',
  'body lock pass',
];
```

### General BJJ Terms

```typescript
const GENERAL_TERMS = [
  // Training types
  'gi',
  'no gi',
  'nogi',
  'no-gi',
  'submission only',
  'sub only',
  'open mat',
  'drilling',
  'positional sparring',
  'flow rolling',
  'competition class',
  'fundamentals',

  // Common phrases
  'rolled',
  'rolling',
  'sparring',
  'tapped',
  'tapped out',
  'submitted',
  'caught me',
  'got caught',
  'swept',
  'passed my guard',
  'guard passed',
  'took the back',
  'mount escape',
  'side control escape',

  // Belt levels
  'white belt',
  'blue belt',
  'purple belt',
  'brown belt',
  'black belt',
  'stripes',
  'promotion',

  // Body parts (injury context)
  'knee',
  'shoulder',
  'neck',
  'back',
  'elbow',
  'wrist',
  'fingers',
  'ribs',
  'hip',
  'ankle',

  // Instructors/Gyms (common references)
  'professor',
  'coach',
  'instructor',
];
```

### Complete Vocabulary Export

```typescript
export const BJJ_VOCABULARY: string[] = [
  ...CHOKES,
  ...JOINT_LOCKS,
  ...GUARDS,
  ...TOP_POSITIONS,
  ...SWEEPS,
  ...ESCAPES,
  ...TAKEDOWNS,
  ...PASSES,
  ...GENERAL_TERMS,
];

// Note: This is a simplified subset. See AI_EXTRACTION_SPEC.md for the
// complete 450+ term vocabulary including:
// - Modern leg lock system (Danaher era)
// - 10th Planet terminology
// - Wrestling crossover terms
// - Common misspellings
// - No-gi slang
//
// AssemblyAI limit: 1000 words per request
// Full vocabulary is well within this limit
```

---

## Accuracy Targets

### Transcription Accuracy

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Overall WER** (Word Error Rate) | <15% | Standard metric |
| **BJJ term accuracy** | >85% | Custom vocabulary terms |
| **Proper noun accuracy** | >80% | Partner names, gym names |
| **Number accuracy** | >95% | Durations, rounds |

### Extraction Accuracy

| Metric | Target | Notes |
|--------|--------|-------|
| **Duration extraction** | >90% | "Hour and a half" → 90 minutes |
| **Training type extraction** | >95% | Gi vs No-gi |
| **Technique recognition** | >80% | Map to canonical names |
| **Sparring detection** | >95% | Yes/no from context |

### Benchmarking Process

1. **Test corpus:** 100 sample voice recordings (collected during beta)
2. **Ground truth:** Human-transcribed reference
3. **Automated comparison:** WER calculation, entity extraction accuracy
4. **Quarterly review:** Re-benchmark as vocabulary expands

---

## Cost Management

### Pricing Model

| Tier | Price | Use Case |
|------|-------|----------|
| **Nano** | $0.002/min | Development, testing |
| **Best** | $0.0062/min | Production (recommended) |

### Cost Projections

| Phase | Users | Sessions/User/Week | Avg Recording | Monthly Cost |
|-------|-------|-------------------|---------------|--------------|
| TestFlight | 10 | 3 | 90 sec | ~$3 |
| Launch | 100 | 3 | 90 sec | ~$28 |
| Growth | 1,000 | 3 | 90 sec | ~$280 |
| Scale | 10,000 | 3 | 90 sec | ~$2,800 |

### Cost Optimization Strategies

1. **Silence trimming:** Remove leading/trailing silence before upload
2. **Max recording length:** Cap at 5 minutes (300 seconds)
3. **Nano tier for testing:** Use lower accuracy tier in development
4. **Batch non-urgent:** Queue overnight batch processing for analytics

---

## Error Handling

### Transcription Failures

| Error | Cause | Handling |
|-------|-------|----------|
| `audio_too_short` | <1 second recording | Show: "Recording too short. Try again?" |
| `audio_too_long` | >5 minute recording | Truncate to first 5 minutes |
| `bad_audio_quality` | Background noise, low volume | Show: "Couldn't hear clearly. Try typing instead?" |
| `rate_limit` | API throttled | Queue and retry with exponential backoff |
| `api_error` | AssemblyAI down | Fall back to manual text entry |

### Fallback Flow

```
[Transcription fails]
       ↓
[Show error message]
       ↓
[Offer options:]
   - [Try Again] → Re-record
   - [Type Instead] → Manual text entry
   - [Save Anyway] → Save with timestamp only
```

### Offline Handling

```typescript
// Queue recordings when offline
interface QueuedRecording {
  id: string;
  audioPath: string;  // Local file path
  timestamp: Date;
  status: 'queued' | 'uploading' | 'processing' | 'complete' | 'failed';
}

// Sync when connection restored
const syncQueuedRecordings = async () => {
  const queued = await getQueuedRecordings();
  for (const recording of queued) {
    try {
      await uploadAndTranscribe(recording);
      await markComplete(recording.id);
    } catch (error) {
      await markFailed(recording.id, error);
    }
  }
};
```

---

## Privacy and Data Retention

### Audio Storage

| Data | Retention | Notes |
|------|-----------|-------|
| Raw audio files | 7 days | Deleted after transcription verified |
| Transcripts | Permanent | Stored with session data |
| AssemblyAI processing | Per their policy | ~30 days then deleted |

### User Controls

- **Delete recording:** User can delete any session (removes transcript too)
- **Export data:** User can export all their data (GDPR compliance)
- **Opt-out:** User can disable voice logging, use text-only

---

## Implementation Checklist

### Phase 1: Basic Integration

- [ ] Set up AssemblyAI account
- [ ] Implement audio upload to AssemblyAI
- [ ] Implement polling for transcription completion
- [ ] Add custom vocabulary (`word_boost`)
- [ ] Display transcript in review screen

### Phase 2: Production Hardening

- [ ] Add error handling for all failure modes
- [ ] Implement offline queue
- [ ] Add retry logic with exponential backoff
- [ ] Set up cost monitoring alerts
- [ ] Implement audio silence trimming

### Phase 3: Accuracy Optimization

- [ ] Build test corpus (100 recordings)
- [ ] Measure baseline accuracy
- [ ] Tune vocabulary boost weights
- [ ] Add user feedback loop for corrections
- [ ] Quarterly accuracy benchmarking

---

## Testing Approach

### Testing BJJ-Specific Vocabulary

The primary challenge is ensuring AssemblyAI accurately transcribes BJJ terminology. Testing requires a systematic approach.

### Test Corpus Requirements

| Category | Minimum Samples | Coverage |
|----------|-----------------|----------|
| **Technique names** | 50 recordings | All major submissions, sweeps, passes |
| **Position names** | 30 recordings | Guards, top positions, leg entanglements |
| **Mixed terminology** | 20 recordings | Natural speech with multiple BJJ terms |
| **Accent variation** | 20 recordings | Different English accents |
| **Audio quality** | 20 recordings | Gym noise, car, outdoor, quiet room |

### Sample Test Recordings

Create recordings that specifically test vocabulary accuracy:

**Test Case 1: Submission Chain**
```
"Rolled with Marcus today, caught him with a darce from front headlock.
Almost had an anaconda earlier but he defended well. Finished Jake
with a bow and arrow choke from the back."
```
Expected extraction: `darce`, `anaconda`, `bow and arrow choke`, `front headlock`

**Test Case 2: Guard Work**
```
"Spent the whole class on de la riva. Worked the kiss of the dragon
to berimbolo sequence, then some baby bolo entries from single leg x."
```
Expected extraction: `de la riva`, `kiss of the dragon`, `berimbolo`, `baby bolo`, `single leg x`

**Test Case 3: Leg Lock Terminology**
```
"Did positional sparring from the saddle. Hit two inside heel hooks
and one outside heel hook. Got caught in a toe hold because I was
too focused on the kneebar."
```
Expected extraction: `saddle`, `inside heel hook`, `outside heel hook`, `toe hold`, `kneebar`

**Test Case 4: Japanese/Portuguese Terms**
```
"Professor taught osoto gari into kesa gatame. Drilled the escape
to butterfly guard, then uchi mata counter."
```
Expected extraction: `osoto gari`, `kesa gatame`, `butterfly guard`, `uchi mata`

### Accuracy Measurement

```typescript
interface TranscriptionTest {
  audioFile: string;
  groundTruth: string;           // Human-verified transcript
  expectedTerms: string[];       // BJJ terms that should be detected
  audioQuality: 'clean' | 'noisy' | 'muffled';
  accent?: string;
}

interface TestResult {
  wordErrorRate: number;         // Overall WER
  termAccuracy: number;          // % of BJJ terms correctly transcribed
  missedTerms: string[];         // Terms that were mistranscribed
  falsePositives: string[];      // Incorrectly detected terms
}

// WER calculation
function calculateWER(reference: string, hypothesis: string): number {
  const refWords = reference.toLowerCase().split(/\s+/);
  const hypWords = hypothesis.toLowerCase().split(/\s+/);

  // Levenshtein distance at word level
  const distance = levenshteinDistance(refWords, hypWords);
  return distance / refWords.length;
}

// BJJ term accuracy
function calculateTermAccuracy(
  expected: string[],
  transcript: string
): { accuracy: number; missed: string[] } {
  const lowerTranscript = transcript.toLowerCase();
  const found = expected.filter(term =>
    lowerTranscript.includes(term.toLowerCase())
  );

  return {
    accuracy: found.length / expected.length,
    missed: expected.filter(t => !found.includes(t)),
  };
}
```

### Testing Checklist

#### Pre-Integration Testing
- [ ] Create test corpus with 50+ recordings
- [ ] Verify AssemblyAI account and API key
- [ ] Test basic transcription without custom vocabulary
- [ ] Add BJJ vocabulary and compare accuracy
- [ ] Document baseline accuracy metrics

#### Integration Testing
- [ ] Test expo-av recording → upload flow
- [ ] Verify audio format compatibility (AAC, WAV)
- [ ] Test upload with various file sizes
- [ ] Verify polling mechanism with timeouts
- [ ] Test error handling (network failure, API errors)

#### Offline Testing
- [ ] Record while offline
- [ ] Verify local queue persistence
- [ ] Test sync when connection restored
- [ ] Verify order-preservation in queue
- [ ] Test queue with 5+ pending recordings

#### Performance Testing
- [ ] Measure upload latency (various connection speeds)
- [ ] Measure transcription latency (30s, 60s, 90s recordings)
- [ ] Test under rate limiting conditions
- [ ] Measure battery impact of recording

### Continuous Monitoring

After launch, track these metrics:

```typescript
interface TranscriptionMetrics {
  // Performance
  avgLatencyMs: number;
  p95LatencyMs: number;

  // Quality
  userEditRate: number;          // % of sessions where user edited transcript
  avgEditsPerSession: number;

  // Reliability
  failureRate: number;
  retryRate: number;
  offlineQueueSize: number;

  // Cost
  avgAudioLengthSec: number;
  monthlyTranscriptionMinutes: number;
  monthlyCost: number;
}
```

---

## iOS Implementation Notes

### expo-av Recording Setup

```typescript
import { Audio } from 'expo-av';

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

async function startRecording(): Promise<Audio.Recording> {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(RECORDING_OPTIONS);
  await recording.startAsync();

  return recording;
}
```

### Upload to AssemblyAI

```typescript
async function uploadAudio(localUri: string): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(localUri);

  if (!fileInfo.exists) {
    throw new Error('Recording file not found');
  }

  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Upload to AssemblyAI
  const response = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'Authorization': ASSEMBLYAI_API_KEY,
      'Content-Type': 'application/octet-stream',
    },
    body: Buffer.from(base64, 'base64'),
  });

  const { upload_url } = await response.json();
  return upload_url;
}
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `AI_EXTRACTION_SPEC.md` | LLM entity extraction from transcripts |
| `VOICE_LOGGING_CONVERSATION_DESIGN.md` | Full conversation flow and extraction rules |
| `DATA_AND_AI_BY_PAGE.md` | How transcription feeds into Journal page |
| `JOURNAL_DATA_CAPTURE_STRATEGY.md` | Three-tier data capture strategy |

---

*This document is the technical reference for voice transcription. For conversation flow and UX, see VOICE_LOGGING_CONVERSATION_DESIGN.md.*
