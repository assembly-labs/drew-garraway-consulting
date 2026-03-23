# TOMO MVP 1.0 — Feature Specification

**Last Updated:** March 12, 2026 (v1.1)
**Status:** Implementation-ready
**Scope:** 5 core features for iOS TestFlight

> **v1.1:** Added `warmedUp`, `instructor` fields. Reordered session fields. Removed `workedWell`, `struggles`, `energyLevel`, `mood` from basics (deferred to v1.1+). Updated `trainingMode` to remove `'mixed'`/`'unknown'` — use `'other'`.

---

## Scope Summary

### In MVP 1.0

| # | Feature | Screens | Description |
|---|---------|---------|-------------|
| 1 | Onboarding | 4 | Full onboarding: name, belt, stripes, gym, frequency, preference + optionals |
| 2 | Session Logger | 5 phases | Voice recording > transcription > AI extraction > review > save |
| 3 | Journal | 1 + detail | Session list grouped by date, tap to detail |
| 4 | Session Detail + Edit | 1 + sheets | View full session, edit all fields, date editing, delete |
| 5 | Profile | 1 | View/edit core profile fields, logging preference, sign out |

### Deferred to v1.1+

- Stats Dashboard (all 19 modules)
- Technique Library
- Training Feedback / Insights page
- Belt Progress visualization
- Injury tracking (body part picker)
- Coach Share reports
- Progressive profiling (milestone-based questions)
- Payment / subscription
- Coaching intelligence queries (Sonnet-powered, e.g. "what's my guard passing problem?")
- Profile stats widgets (hours, streaks, member since)

---

## MVP Design Principles

### No Hard Belt-Based Field Locking

All users can review and edit all session fields regardless of belt level. Belt personalization in MVP is limited to:
- Copy and messaging tone (e.g. success messages, prompts)
- Suggested defaults and emphasis (e.g. default duration)
- Helpful examples in placeholder text

No fields are hidden, greyed out, or locked based on belt. This builds trust during TestFlight — users should see and control all their data. Belt-gated field visibility is a post-MVP consideration once we have tester feedback on whether it helps or confuses.

### Audio Privacy

All user voice recordings are stored in a **private** Supabase Storage bucket. Access uses short-lived signed URLs — never public URLs. See the audio storage section in the Session Logger spec for details.

**Retention policy (pre-App Store, must finalize):** MVP may temporarily retain audio files for transcription verification and debugging. A formal retention and deletion policy must be defined before any public App Store submission.

---

## 1. Onboarding

**Trigger:** First launch after sign-up (auth complete, no profile exists)
**Goal:** Collect profile data to enable personalization from session 1
**Target:** Complete in under 60 seconds

### Screen 1: Welcome
- App name, logo, one-line value prop
- "Get Started" CTA
- No data collected

### Screen 2: About You
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | Text input | Yes | First name only, used throughout app |
| `belt` | Picker (5 options) | Yes | White, Blue, Purple, Brown, Black |
| `stripes` | Picker (0-4) | Yes | Appears after belt selected |

### Screen 3: Your Training
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `gym` | Search/select | Yes | 120+ gyms database by affiliation. "My gym isn't listed" opens manual entry (name, city, state) |
| `targetFrequency` | Picker (3 options) | Yes | "1-2x/week", "3-4x/week", "5+/week" — stored as 2, 4, 5 |
| `trainingGoals` | Multi-select chips | No | Competition, Fitness, Hobby, Mental Health. Divider: "TELL US MORE (OPTIONAL)" |
| `experienceLevel` | Picker | No | New (<6 mo), Beginner (6mo-2yr), Intermediate (2-5yr), Experienced (5+yr) |

### Screen 4: Get Started
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `loggingPreference` | Toggle (2 options) | Yes | Voice or Text. Brief explanation of each |

- "Start Logging" CTA → navigates to main app (Journal tab)
- If voice selected, triggers iOS microphone permission dialog

### Data Model: UserProfile

```typescript
interface UserProfile {
  userId: string;
  name: string;
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: 0 | 1 | 2 | 3 | 4;
  gym: GymSelection;
  targetFrequency: number;
  loggingPreference: 'voice' | 'text';
  onboardingComplete: boolean;
  sessionCount: number;
  trainingGoals?: string[];
  experienceLevel?: 'new' | 'beginner' | 'intermediate' | 'experienced';
  createdAt: string;
}

interface GymSelection {
  gymId: string;
  gymName: string;
  isCustom: boolean;
  city?: string;
  stateOrCountry?: string;
  affiliation?: string;
}
```

### Supabase Table: `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  belt TEXT NOT NULL CHECK (belt IN ('white','blue','purple','brown','black')),
  stripes INTEGER NOT NULL DEFAULT 0 CHECK (stripes BETWEEN 0 AND 4),
  gym_id TEXT,
  gym_name TEXT NOT NULL,
  gym_is_custom BOOLEAN DEFAULT false,
  gym_city TEXT,
  gym_state TEXT,
  gym_affiliation TEXT,
  target_frequency INTEGER NOT NULL DEFAULT 4,
  logging_preference TEXT NOT NULL DEFAULT 'voice' CHECK (logging_preference IN ('voice','text')),
  onboarding_complete BOOLEAN DEFAULT false,
  session_count INTEGER DEFAULT 0,
  training_goals TEXT[], -- PostgreSQL array
  experience_level TEXT CHECK (experience_level IN ('new','beginner','intermediate','experienced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: users can only read/write their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

---

## 2. Session Logger (Voice Pipeline)

**Entry point:** "Log Session" button (prominent CTA on Journal page)
**Goal:** Capture session data in under 90 seconds via voice
**Fallback:** Text-only path bypasses recording and goes straight to review

### Phase 1: Entry Screen

Pre-recording selectors (in order):

| Field | Options | Default | Touch Target |
|-------|---------|---------|-------------|
| Training Mode | Gi / No-Gi / Other | Gi | 56px+ buttons |
| Duration | 60 / 90 / 120 min | 90 | 56px+ buttons |
| Warm-up | Yes / No | null (must select) | 56px+ buttons |
| Sparring | Yes / No | null (must select) | 56px+ buttons |

- Large "Record" button (80px, gold accent)
- "Type instead" text link below → skips to Review phase with empty fields
- Rotating prompt above record button (e.g. "How was training? What'd you work on?")

### Phase 2: Voice Recording

- **Library:** `expo-audio` (preferred). If blocked, use `expo-av` as temporary fallback and document why.
- **Format:** AAC (smaller than WAV)
- **Max duration:** 90 seconds (auto-stop with gentle notification)
- **UI:** Waveform visualization, elapsed timer, "Stop" button
- **Permissions:** iOS microphone permission required. Configure `NSMicrophoneUsageDescription` in app.json/app.config. If denied, redirect to text-only path with explanation.
- **Local storage:** Save recording to device file system before upload

### Phase 3: Transcription (AssemblyAI)

**Audio upload flow:**
1. Upload recording to **private** Supabase Storage bucket (`audio-recordings`, private, RLS-protected)
2. Generate a short-lived signed URL (e.g. 15 minutes expiry)
3. Send signed URL to AssemblyAI for transcription
4. Audio file is never publicly accessible

**API call:**
```typescript
// 1. Upload to private bucket
const { data: uploadData } = await supabase.storage
  .from('audio-recordings')
  .upload(`${userId}/${sessionId}.aac`, audioFile);

// 2. Get signed URL (15 min expiry)
const { data: signedUrlData } = await supabase.storage
  .from('audio-recordings')
  .createSignedUrl(`${userId}/${sessionId}.aac`, 900);

// 3. Send to AssemblyAI
const response = await fetch('https://api.assemblyai.com/v2/transcript', {
  method: 'POST',
  headers: {
    'Authorization': ASSEMBLYAI_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    audio_url: signedUrlData.signedUrl,
    word_boost: BJJ_VOCABULARY, // ~180 terms
    boost_param: 'high',
    language_code: 'en_us',
    punctuate: true,
    format_text: true,
  }),
});
const { id } = await response.json();
return pollForCompletion(id); // poll every 3s until status === 'completed'
```

**Custom vocabulary:** Full list at `docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md`. Includes:
- Chokes: rear naked choke, guillotine, darce, bow and arrow, ezekiel, baseball bat, loop, clock, brabo, anaconda, arm triangle, north south, von flue, peruvian necktie
- Joint locks: armbar, kimura, americana, omoplata, wrist lock, heel hook, ankle lock, toe hold, kneebar, calf slicer, estima lock
- Guards: closed guard, half guard, deep half, z guard, butterfly, spider, lasso, de la riva, reverse de la riva, x guard, single leg x, rubber guard, k guard
- Top positions: mount, side control, knee on belly, back control, north south, turtle, crucifix, kesa gatame
- Sweeps: scissor, hip bump, flower, pendulum, elevator, berimbolo, waiter, tripod
- Escapes: hip escape/shrimp, trap and roll/upa, frame, underhook, granby roll
- Takedowns: double leg, single leg, arm drag, snap down, osoto gari, uchi mata, seoi nage
- Passes: knee slice, toreando, leg drag, x pass, stack pass, body lock pass, smash pass
- General: gi, no-gi, rolling, tapped, drilling, flow rolling, positional sparring, professor, coach

**Error handling:**
| Error | Action |
|-------|--------|
| Audio too short (<1s) | "Recording too short. Try again?" |
| Bad audio quality | "Couldn't hear clearly. Try typing instead?" |
| API error/timeout | "Something went wrong. Type instead or try again?" |
| Offline | Queue recording locally, process when online |

**Processing time:** 3-8 seconds for 60-90s recording. Show animated loading state.

### Phase 4: AI Extraction (Claude Haiku 4.5)

**Architecture:** Supabase Edge Function receives transcript, calls Claude Haiku 4.5, returns structured JSON. Includes validation, error handling, and fallback.

**Extraction JSON Schema:**

```typescript
interface ExtractionResult {
  trainingMode: 'gi' | 'nogi' | 'other' | null;
  durationMinutes: number | null;
  warmedUp: boolean | null;
  techniquesDrilled: string[];
  didSpar: boolean | null;
  sparringRounds: number | null;
  submissionsGiven: { type: string; count: number }[];
  submissionsReceived: { type: string; count: number }[];
  injuries: string[];
  instructor: string | null;
  sessionKind: 'class' | 'open_mat' | 'drilling' | 'competition' | 'other' | null;
  lessonTopic: string | null;
  rawNotes: string | null;
}
```

**Extraction Prompt:**

```
You are a BJJ training session parser. Given a transcript from a Brazilian
Jiu-Jitsu practitioner describing their training session, extract structured
data into the JSON schema below.

Rules:
- Map technique names to canonical forms (e.g. "knee cut" -> "knee slice pass")
- Infer duration from natural language (e.g. "hour and a half" -> 90)
- Count submissions explicitly mentioned (e.g. "got caught twice" -> count: 2)
- Only extract what is explicitly stated or clearly implied
- If a field cannot be determined, use null
- Detect injury mentions from body part + pain/soreness language
- For trainingMode: "gi" if they mention gi/kimono, "nogi" if no-gi, "other" if unclear or both
- For warmedUp: true if they mention warming up, stretching, drilling before class. false if they say they skipped warmup. null if not mentioned.
- For instructor: Name of the coach/professor who taught. "Coach Dave taught" = "Coach Dave". null if not mentioned.
- For sessionKind: "class" for structured instruction, "open_mat" for open rolling, "drilling" for pure drilling, "competition" for tournament/comp, "other" if unclear

JSON Schema:
{
  "trainingMode": "gi" | "nogi" | "other" | null,
  "durationMinutes": number | null,
  "warmedUp": boolean | null,
  "techniquesDrilled": string[],
  "didSpar": boolean | null,
  "sparringRounds": number | null,
  "submissionsGiven": [{"type": string, "count": number}],
  "submissionsReceived": [{"type": string, "count": number}],
  "injuries": string[],
  "instructor": string | null,
  "sessionKind": "class" | "open_mat" | "drilling" | "competition" | "other" | null,
  "lessonTopic": string | null,
  "rawNotes": string | null
}

Respond with ONLY the JSON object, no explanation.
```

**Example input:**
> "Did about an hour and a half today, gi class. Coach Dave taught knee slice passing, I drilled it with Marcus. We warmed up for about 15 minutes. Rolled three rounds, got caught in a triangle, but I hit an armbar from closed guard which felt great. Shoulder is a little sore."

**Expected output:**
```json
{
  "trainingMode": "gi",
  "durationMinutes": 90,
  "warmedUp": true,
  "techniquesDrilled": ["knee slice pass"],
  "didSpar": true,
  "sparringRounds": 3,
  "submissionsGiven": [{"type": "armbar", "count": 1}],
  "submissionsReceived": [{"type": "triangle choke", "count": 1}],
  "injuries": ["shoulder soreness"],
  "instructor": "Coach Dave",
  "sessionKind": "class",
  "lessonTopic": "knee slice passing",
  "rawNotes": null
}
```

**Edge Function implementation (hardened):**
```typescript
// supabase/functions/extract-session/index.ts
import Anthropic from '@anthropic-ai/sdk';

const EXTRACTION_MODEL = 'claude-haiku-4-5-20251001'; // config — swap to sonnet if needed
const SCHEMA_VERSION = 1;

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

interface ExtractionResponse {
  success: boolean;
  data: ExtractionResult | null;
  error: string | null;
  metadata: {
    model: string;
    schema_version: number;
  };
}

Deno.serve(async (req) => {
  const { transcript, preSelectedMode, preSelectedDuration, preSelectedWarmup, preSelectedSpar } = await req.json();

  let extracted: ExtractionResult | null = null;
  let error: string | null = null;

  try {
    const message = await anthropic.messages.create({
      model: EXTRACTION_MODEL,
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `${EXTRACTION_PROMPT}\n\nTranscript:\n"${transcript}"`,
      }],
    });

    const rawText = message.content[0].text;

    // Parse with error handling
    try {
      const parsed = JSON.parse(rawText);
      extracted = validateExtraction(parsed); // throws if invalid
    } catch (parseErr) {
      error = `extraction_parse_failed: ${parseErr.message}`;
      // Return transcript so user can still manually fill fields
    }
  } catch (apiErr) {
    error = `extraction_api_failed: ${apiErr.message}`;
  }

  // Merge pre-selected values (user taps override AI extraction)
  if (extracted) {
    extracted.trainingMode = preSelectedMode || extracted.trainingMode;
    extracted.durationMinutes = preSelectedDuration || extracted.durationMinutes;
    extracted.warmedUp = preSelectedWarmup ?? extracted.warmedUp;
    extracted.didSpar = preSelectedSpar ?? extracted.didSpar;
  }

  const response: ExtractionResponse = {
    success: extracted !== null,
    data: extracted,
    error,
    metadata: {
      model: EXTRACTION_MODEL,
      schema_version: SCHEMA_VERSION,
    },
  };

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
});

function validateExtraction(raw: unknown): ExtractionResult {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('extraction is not an object');
  }
  const obj = raw as Record<string, unknown>;
  // Validate required array fields default to empty arrays
  return {
    trainingMode: ['gi','nogi','other'].includes(obj.trainingMode as string)
      ? obj.trainingMode as ExtractionResult['trainingMode'] : null,
    durationMinutes: typeof obj.durationMinutes === 'number' ? obj.durationMinutes : null,
    warmedUp: typeof obj.warmedUp === 'boolean' ? obj.warmedUp : null,
    techniquesDrilled: Array.isArray(obj.techniquesDrilled) ? obj.techniquesDrilled : [],
    didSpar: typeof obj.didSpar === 'boolean' ? obj.didSpar : null,
    sparringRounds: typeof obj.sparringRounds === 'number' ? obj.sparringRounds : null,
    submissionsGiven: Array.isArray(obj.submissionsGiven) ? obj.submissionsGiven : [],
    submissionsReceived: Array.isArray(obj.submissionsReceived) ? obj.submissionsReceived : [],
    injuries: Array.isArray(obj.injuries) ? obj.injuries : [],
    instructor: typeof obj.instructor === 'string' ? obj.instructor : null,
    sessionKind: ['class','open_mat','drilling','competition','other'].includes(obj.sessionKind as string)
      ? obj.sessionKind as ExtractionResult['sessionKind'] : null,
    lessonTopic: typeof obj.lessonTopic === 'string' ? obj.lessonTopic : null,
    rawNotes: typeof obj.rawNotes === 'string' ? obj.rawNotes : null,
  };
}
```

**Extraction failure UX:**
When extraction fails, the user is NOT blocked:
1. Show message: "We couldn't auto-fill your session details. You can fill them in manually."
2. Display the transcript (so they can reference what they said)
3. Show empty review form — all fields editable
4. User fills in fields manually and saves normally
5. Session is saved with `extraction_status: 'failed'` metadata

### Phase 5: Review Screen

All extracted fields displayed in editable form sections. **All fields are visible and editable for all belt levels.**

| Section | Fields | Edit Method |
|---------|--------|-------------|
| Training Mode | Gi / No-Gi / Other | Tappable badge |
| Duration | Minutes | Tappable badge |
| Warm-up | Yes / No | Toggle |
| Techniques | Techniques drilled/taught | Editable chips |
| Sparring | Did spar, rounds | Toggle + number picker |
| Submissions Landed | Type + count | Editable chips (if sparred) |
| Got Caught | Type + count | Editable chips (if sparred) |
| Injuries | Body part/description | Editable chips |
| Instructor | Who taught | Text input |
| Session Type | Class / Open Mat / etc | Tappable badge |
| Notes | Free text | Textarea |

- Full transcript shown in collapsible section at bottom
- "Save Session" primary CTA (80px, gold)
- "Discard" text link

Belt personalization on this screen is limited to:
- Prompt copy (e.g. white belts see "What techniques did you practice?" vs purple belts see "What positions did you work?")
- Suggested defaults (e.g. default duration varies by belt)
- No fields hidden or locked

### Phase 6: Success Screen

- Belt-personalized confirmation message
- Session count increment
- "View in Journal" CTA → navigates to journal
- Auto-dismiss after 5 seconds

### Data Model: Session

```typescript
interface Session {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  trainingMode: 'gi' | 'nogi' | 'other';
  durationMinutes: number;
  warmedUp: boolean | null;
  sessionKind: 'class' | 'open_mat' | 'drilling' | 'competition' | 'other';
  didSpar: boolean;
  sparringRounds?: number;
  techniquesDrilled: string[];
  submissionsGiven?: Submission[];
  submissionsReceived?: Submission[];
  injuries?: string[];
  instructor: string | null;
  lessonTopic?: string;
  notes?: string;
  transcript?: string;
  audioPath?: string; // private storage path, not a public URL
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // soft delete

  // Pipeline metadata (internal, not shown in UI)
  inputMethod: 'voice' | 'text';
  transcriptionStatus?: 'pending' | 'completed' | 'failed' | 'skipped';
  extractionStatus?: 'pending' | 'completed' | 'failed' | 'skipped';
  editedAfterAi: boolean;
  schemaVersion: number;
  extractionModel?: string;
  transcriptionError?: string;
  extractionError?: string;
}

interface Submission {
  type: string;
  count: number;
}
```

### Supabase Table: `sessions`

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME,
  training_mode TEXT NOT NULL DEFAULT 'other' CHECK (training_mode IN ('gi','nogi','other')),
  session_kind TEXT NOT NULL DEFAULT 'class' CHECK (session_kind IN ('class','open_mat','drilling','competition','other')),
  duration_minutes INTEGER NOT NULL,
  warmed_up BOOLEAN,
  did_spar BOOLEAN DEFAULT false,
  sparring_rounds INTEGER,
  techniques_drilled TEXT[] DEFAULT '{}',
  submissions_given JSONB DEFAULT '[]',
  submissions_received JSONB DEFAULT '[]',
  injuries TEXT[] DEFAULT '{}',
  instructor TEXT,
  lesson_topic TEXT,
  notes TEXT,
  transcript TEXT,
  audio_path TEXT, -- private storage path, NOT a public URL
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- soft delete

  -- Pipeline metadata (internal)
  input_method TEXT NOT NULL DEFAULT 'text' CHECK (input_method IN ('voice','text')),
  transcription_status TEXT CHECK (transcription_status IN ('pending','completed','failed','skipped')),
  extraction_status TEXT CHECK (extraction_status IN ('pending','completed','failed','skipped')),
  edited_after_ai BOOLEAN DEFAULT false,
  schema_version INTEGER NOT NULL DEFAULT 1,
  extraction_model TEXT,
  transcription_error TEXT,
  extraction_error TEXT
);

-- RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users insert own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own sessions" ON sessions FOR UPDATE USING (auth.uid() = user_id);

-- Index for fast journal queries
CREATE INDEX idx_sessions_user_date ON sessions(user_id, date DESC);
```

### Deferred to v1.1+

The following fields existed in v1.0 but are deferred to reduce capture friction for white/blue belts:

- `workedWell` / `struggles` (insight tracking)
- `energyLevel` / `mood` (1-5 ratings)

These will return as optional enrichment fields in a future version.

### Audio Storage

```sql
-- Private bucket — no public access
-- Created via Supabase dashboard or CLI
-- Bucket name: audio-recordings
-- Public: false

-- Storage RLS: users can only access their own recordings
CREATE POLICY "Users upload own audio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'audio-recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users read own audio" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'audio-recordings'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 3. Journal (Session History)

**Tab:** First tab in bottom navigation
**Purpose:** Browse all logged sessions

### Layout

- **Header:** "Journal" title + session count badge
- **CTA:** "Log Session" button (prominent, top or floating)
- **List:** Sessions grouped by: Today, Yesterday, This Week, This Month, Earlier
- **Filter:** Training mode toggle (All / Gi / No-Gi)
- **Empty state:** Encouragement message + "Log Your First Session" CTA

### Session Card

| Element | Source |
|---------|--------|
| Date + time | `session.date`, `session.time` |
| Training mode badge | `session.trainingMode` (color-coded) |
| Session kind label | `session.sessionKind` |
| Duration | `session.durationMinutes` |
| Lesson topic or first technique | `session.lessonTopic` or `session.techniquesDrilled[0]` |
| Sparring indicator | `session.didSpar` |

All cards show the same fields for all users. Belt level does not change card content in MVP.

**Tap action:** Navigate to Session Detail screen

### Query

```typescript
const { data: sessions } = await supabase
  .from('sessions')
  .select('*')
  .eq('user_id', userId)
  .is('deleted_at', null)
  .order('date', { ascending: false })
  .order('time', { ascending: false });
```

---

## 4. Session Detail + Edit

**Entry:** Tap session card in Journal
**Purpose:** View full session, edit any field, delete session

### Detail View Layout

1. **Header:** Date, time, training mode badge, session kind, duration
2. **AI Narrative Summary:** Natural language recap generated from session fields
3. **Sections** (each tappable to edit — all visible for all belts):
   - Training Mode (gi/nogi/other)
   - Duration
   - Warm-up (yes/no)
   - Techniques Drilled (chips)
   - Sparring Details (did spar, rounds, subs given/received)
   - Injuries
   - Instructor
   - Session Type (class/open mat/etc)
   - Notes
4. **Transcript** (collapsible, read-only)
5. **Delete** button (bottom, destructive style)

### Edit Flow

- Tap any section → bottom sheet modal slides up
- Edit fields within the sheet
- "Save" commits changes to Supabase (also sets `edited_after_ai = true` if session was AI-extracted)
- "Cancel" discards changes
- Toast confirmation on save

### Date/Time Editing

- Tap date in header → date picker (last 90 days, no future dates)
- Tap time → time picker
- Confirmation dialog: "Move this session to [new date]?"
- Session repositions in Journal list after save

### Delete Session

- Tap "Delete Session" at bottom of detail view
- Confirmation dialog: "Delete this session? This can't be undone."
- Soft delete: sets `deleted_at` timestamp (data preserved in DB)
- Navigate back to Journal with toast: "Session deleted"

### Update Query

```typescript
const { error } = await supabase
  .from('sessions')
  .update({
    training_mode: updatedFields.trainingMode,
    session_kind: updatedFields.sessionKind,
    duration_minutes: updatedFields.durationMinutes,
    edited_after_ai: true,
    // ... other fields
    updated_at: new Date().toISOString(),
  })
  .eq('id', sessionId)
  .eq('user_id', userId); // RLS safety
```

---

## 5. Profile

**Tab:** Third tab in bottom navigation
**Purpose:** View/edit core profile data. Minimal for MVP.

### Layout

1. **Avatar** with belt-colored border
2. **Name** (tappable to edit)
3. **Belt + Stripes** display (tappable to edit)
4. **Gym** display (tappable to edit)
5. **Settings Section:**
   - Logging preference (voice/text toggle)
6. **App Section:**
   - Privacy Policy link
   - Terms of Service link
   - Sign Out button

### What's NOT in MVP Profile

The following are stored in the data model but not surfaced in the MVP Profile UI:
- Total hours trained
- Current streak
- Member since date
- Target frequency display
- Training goals display
- Experience level display

These are v1.1 additions when the Stats Dashboard ships.

### Edit Flow

- Tap any editable field → inline edit or bottom sheet
- Changes save to Supabase `profiles` table immediately
- Toast confirmation on save

---

## Cost Summary (MVP 1.0)

### Development Phase

| Item | Cost |
|------|------|
| Apple Developer Account | $99/year |
| Supabase | Free tier |
| AssemblyAI | Free $50 credit |
| Claude API (Haiku) | ~$2-5 during development |
| Expo EAS | Free tier (15 builds/month) |
| Sentry | Free tier |
| **Total** | **~$99** |

### TestFlight Phase (10 users, per month)

| Item | Cost/month |
|------|-----------|
| AssemblyAI | ~$1 |
| Claude Haiku | ~$0.12 |
| Supabase | Free |
| **Total** | **~$1.12/month** |

---

## Related Documents

| Document | Location |
|----------|----------|
| Full feature inventory (93 features) | `docs/product/FEATURES.md` |
| Session Logger PRD | `docs/product/_manual_product_requirements_doc/SESSION_LOGGER_PRD.md` |
| Voice transcription spec + vocabulary | `docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md` |
| BJJ belt curriculum | `docs/domain-knowledge/BJJ_BELT_CURRICULUM.md` |
| Data capture strategy | `docs/data-and-ai/JOURNAL_DATA_CAPTURE_STRATEGY.md` |
| Voice conversation design | `docs/data-and-ai/VOICE_LOGGING_CONVERSATION_DESIGN.md` |
| Design system tokens | `docs/design-system/tokens.md` |
| iOS deployment plan | `docs/deployment/IOS_TESTFLIGHT_DEPLOYMENT_PLAN.md` |
| Gym database | `prototype/src/data/gyms.ts` |
| Belt personalization engine | `prototype/src/config/belt-system/` |
