/**
 * TOMO — Session Extraction Edge Function
 *
 * Takes a transcript from a BJJ training session and uses Claude Haiku
 * to extract structured data (techniques, sparring, duration, etc.).
 *
 * SECURITY: Requires a valid Supabase JWT. Only authenticated users can call this.
 *
 * HOW IT WORKS:
 * 1. App sends the transcript + any pre-selected fields (mode, kind, duration, sparring)
 * 2. This function calls Claude Haiku to parse the transcript into structured JSON
 * 3. Pre-selected fields override whatever the AI extracted
 * 4. Returns the structured data (or an error with the transcript so user can fill manually)
 *
 * SETUP:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *   supabase functions deploy extract-session
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

// --- Configuration ---
// Change this to swap models. Use dated IDs so behavior doesn't change unexpectedly.
const EXTRACTION_MODEL = 'claude-haiku-4-5-20251001';
const SCHEMA_VERSION = 2;
const MAX_TRANSCRIPT_BYTES = 50_000; // 50 KB — ~12,000 words, well beyond any 90s voice session
const ANTHROPIC_TIMEOUT_MS = 30_000; // 30s — fail fast if Claude is slow

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// --- Types ---

interface ExtractionResult {
  durationMinutes: number | null;
  trainingMode: 'gi' | 'nogi' | 'other' | null;
  warmedUp: boolean | null;
  sessionKind: 'class' | 'open_mat' | 'competition_training' | 'other' | null;
  techniquesDrilled: string[];
  didSpar: boolean | null;
  sparringRounds: number | null;
  submissionsGiven: { type: string; count: number }[];
  submissionsReceived: { type: string; count: number }[];
  injuries: string[];
  instructor: string | null;
  lessonTopic: string | null;
  rawNotes: string | null;
}

interface ExtractionResponse {
  success: boolean;
  data: ExtractionResult | null;
  error: string | null;
  metadata: {
    model: string;
    schema_version: number;
  };
}

// --- Extraction Prompt ---

const EXTRACTION_PROMPT = `You are a BJJ training session parser. Extract structured data from voice transcripts of Brazilian Jiu-Jitsu practitioners describing their training.

FIELD GUIDE:

- trainingMode: "gi" if they mention gi, kimono, or collar/lapel grips. "nogi" if they say no-gi, nogi, or mention rash guard/spats without gi. null if not mentioned (do NOT guess).
- durationMinutes: Total session length. "hour and a half" = 90, "about an hour" = 60. If they only mention rolling/drilling time, estimate total session (usually add 15-20 min for warmup).
- warmedUp: true if they mention warming up, stretching, doing a warmup drill, or any pre-class activity. false if they explicitly say they skipped warmup or were late. null if not mentioned.
- sessionKind: "class" = regular structured class with instruction/lesson. "open_mat" = free rolling, open gym. "competition_training" = comp prep, tournament training, competition-focused drilling or rounds. "other" if unclear. Default to "class" only if they describe a lesson/technique being taught.
- techniquesDrilled: Specific techniques they practiced, drilled, or used during rolls. Keep the practitioner's own phrasing — do NOT rename techniques. Include positions, sweeps, passes, submissions, escapes, and takedowns. "We worked on mount escapes" = ["mount escapes"]. "Drilled arm bars from closed guard" = ["armbar from closed guard"].
- didSpar: true if they mention rolling, sparring, live rounds, or going live. false if they explicitly say no sparring. null if not mentioned.
- sparringRounds: Number of rounds. "did 5 rounds" = 5. "rolled a few times" = null (too vague). Only set if a specific number is stated.
- submissionsGiven: Submissions THEY successfully got on someone. "I tapped him with a triangle" = [{"type": "triangle", "count": 1}]. "Got two armbars" = [{"type": "armbar", "count": 2}].
- submissionsReceived: Submissions where THEY got tapped/caught. "Got caught in a guillotine" = [{"type": "guillotine", "count": 1}].
- injuries: Physical complaints. "My knee is bothering me" = ["knee soreness"]. "Tweaked my shoulder" = ["shoulder tweak"]. Only include if they mention pain, soreness, injury, or a body part hurting. Return empty array [] if no injuries mentioned — the app will display "None" by default.
- instructor: Name of the coach or professor who taught class. "Coach Dave" = "Coach Dave". "Professor showed us" = null (no name). null if not mentioned.
- lessonTopic: The main topic of the class/session if one is mentioned. "Today we worked on half guard" = "half guard". "Coach showed us a kimura series" = "kimura series". null if no clear topic.
- rawNotes: A clean, readable summary of the full session in 1-3 sentences. Capture the overall narrative — what they did, how it went, any notable moments. This is NOT a copy of the transcript — it's a concise journal entry written in first person.

IMPORTANT RULES:
1. Only extract what is explicitly stated or clearly implied. Do NOT invent details.
2. Use empty arrays [] when no items are mentioned for that field.
3. Keep the practitioner's own words and phrasing — do not rename or "correct" technique names.
4. Voice transcripts are messy — handle filler words, false starts, and speech-to-text errors gracefully.
5. If the transcript is very short or unclear, extract what you can and use null/[] for the rest.

EXAMPLE INPUT:
"Had a great class tonight, about an hour and a half. We worked on half guard sweeps, specifically the dog fight position and the underhook sweep. Did some situational sparring from half guard for like 20 minutes then three rounds of rolling after. I hit the underhook sweep twice which felt awesome. Got caught in a darce choke though, need to watch my head position. Left knee is a little sore."

EXAMPLE OUTPUT:
{"durationMinutes":90,"trainingMode":null,"sessionKind":"class","warmedUp":null,"techniquesDrilled":["half guard sweeps","dog fight position","underhook sweep"],"didSpar":true,"sparringRounds":3,"submissionsGiven":[],"submissionsReceived":[{"type":"darce choke","count":1}],"injuries":["left knee soreness"],"instructor":null,"lessonTopic":"half guard sweeps","rawNotes":"Great class working on half guard sweeps and the dog fight position. Hit the underhook sweep twice during situational sparring. Got caught in a darce and need to work on head position. Left knee a little sore."}

Respond with ONLY the JSON object, no markdown, no explanation.`;

// --- Validation ---

function validateExtraction(raw: unknown): ExtractionResult {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('extraction is not an object');
  }
  const obj = raw as Record<string, unknown>;

  return {
    durationMinutes: typeof obj.durationMinutes === 'number' ? obj.durationMinutes : null,
    trainingMode: ['gi', 'nogi', 'other'].includes(obj.trainingMode as string)
      ? (obj.trainingMode as ExtractionResult['trainingMode'])
      : null,
    warmedUp: typeof obj.warmedUp === 'boolean' ? obj.warmedUp : null,
    sessionKind: ['class', 'open_mat', 'competition_training', 'other'].includes(obj.sessionKind as string)
      ? (obj.sessionKind as ExtractionResult['sessionKind'])
      : null,
    techniquesDrilled: Array.isArray(obj.techniquesDrilled) ? obj.techniquesDrilled : [],
    didSpar: typeof obj.didSpar === 'boolean' ? obj.didSpar : null,
    sparringRounds: typeof obj.sparringRounds === 'number' ? obj.sparringRounds : null,
    submissionsGiven: Array.isArray(obj.submissionsGiven) ? obj.submissionsGiven : [],
    submissionsReceived: Array.isArray(obj.submissionsReceived) ? obj.submissionsReceived : [],
    injuries: Array.isArray(obj.injuries) ? obj.injuries : [],
    instructor: typeof obj.instructor === 'string' ? obj.instructor : null,
    lessonTopic: typeof obj.lessonTopic === 'string' ? obj.lessonTopic : null,
    rawNotes: typeof obj.rawNotes === 'string' ? obj.rawNotes : null,
  };
}

// --- Main Handler ---

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth Check ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Parse Request ---
    let transcript: string;
    let preSelectedMode: string | undefined;
    let preSelectedKind: string | undefined;
    let preSelectedDuration: number | undefined;
    let preSelectedSpar: boolean | undefined;

    try {
      const body = await req.json();
      transcript = body.transcript;
      preSelectedMode = body.preSelectedMode;
      preSelectedKind = body.preSelectedKind;
      preSelectedDuration = body.preSelectedDuration;
      preSelectedSpar = body.preSelectedSpar;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!transcript || typeof transcript !== 'string') {
      return new Response(JSON.stringify({ error: 'transcript is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (new TextEncoder().encode(transcript).length > MAX_TRANSCRIPT_BYTES) {
      return new Response(
        JSON.stringify({ error: `Transcript too large (max ${MAX_TRANSCRIPT_BYTES / 1000}KB)` }),
        { status: 413, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Call Claude ---
    let extracted: ExtractionResult | null = null;
    let error: string | null = null;

    try {
      const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

      // Use AbortController for timeout — fail fast if Claude is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);

      let message;
      try {
        message = await anthropic.messages.create(
          {
            model: EXTRACTION_MODEL,
            max_tokens: 1024,
            system: EXTRACTION_PROMPT,
            messages: [
              {
                role: 'user',
                content: `<transcript>\n${transcript}\n</transcript>`,
              },
            ],
          },
          { signal: controller.signal }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      if (!message.content || message.content.length === 0) {
        throw new Error('Claude returned empty content');
      }

      let rawText = message.content[0].type === 'text' ? message.content[0].text : '';

      // Strip markdown code fences if present (e.g. ```json ... ```)
      rawText = rawText.trim();
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      try {
        const parsed = JSON.parse(rawText);
        extracted = validateExtraction(parsed);
      } catch (parseErr) {
        console.error('Extraction parse failed:', parseErr, '| raw:', rawText.slice(0, 500));
        error = 'extraction_parse_failed';
      }
    } catch (apiErr) {
      console.error('Extraction API failed:', apiErr);
      error = 'extraction_api_failed';
    }

    // --- Merge Pre-Selected Values ---
    if (extracted) {
      if (preSelectedMode) extracted.trainingMode = preSelectedMode as ExtractionResult['trainingMode'];
      if (preSelectedKind) extracted.sessionKind = preSelectedKind as ExtractionResult['sessionKind'];
      if (preSelectedDuration) extracted.durationMinutes = preSelectedDuration;
      if (preSelectedSpar !== undefined && preSelectedSpar !== null) extracted.didSpar = preSelectedSpar;
    }

    // --- Response ---
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
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('Extract session error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
