# Processing Phase

Loading screen while your voice recording is transcribed and analyzed.

**Code:** `tomo/src/screens/SessionLoggerScreen.tsx` (ProcessingPhase component)
**Phase:** Session Logging (phase 3 of 5)

## Elements

### Loading Spinner
- Large gold activity indicator, centered on screen

### Status Text
- Text below spinner describing what's happening
- Changes as pipeline progresses:
  - "Transcribing your session..."
  - "Analyzing..."
  - "Almost there..."

### Skip / Cancel Option
- Allows user to skip processing and go straight to Review Phase
- If skipped: Review Phase loads with empty extraction (user fills everything manually)

## Behavior

- Pipeline timeout: 150 seconds max
- If transcription or extraction fails, falls through to Review Phase with whatever data was captured
- If everything fails, Review Phase opens blank for manual entry
