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
const SCHEMA_VERSION = 1;

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// --- Types ---

interface ExtractionResult {
  durationMinutes: number | null;
  trainingMode: 'gi' | 'nogi' | 'mixed' | 'unknown' | null;
  sessionKind: 'class' | 'open_mat' | 'drilling' | 'competition' | 'other' | null;
  techniquesDrilled: string[];
  didSpar: boolean | null;
  sparringRounds: number | null;
  submissionsGiven: { type: string; count: number }[];
  submissionsReceived: { type: string; count: number }[];
  workedWell: string[];
  struggles: string[];
  injuries: string[];
  energyLevel: 1 | 2 | 3 | 4 | 5 | null;
  mood: 1 | 2 | 3 | 4 | 5 | null;
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

const EXTRACTION_PROMPT = `You are a BJJ training session parser. Given a transcript from a Brazilian Jiu-Jitsu practitioner describing their training session, extract structured data into the JSON schema below.

Rules:
- Map technique names to canonical forms (e.g. "knee cut" -> "knee slice pass")
- Infer duration from natural language (e.g. "hour and a half" -> 90)
- Count submissions explicitly mentioned (e.g. "got caught twice" -> count: 2)
- Only extract what is explicitly stated or clearly implied
- If a field cannot be determined, use null
- For workedWell and struggles, use the practitioner's own words
- Detect injury mentions from body part + pain/soreness language
- For trainingMode: "gi" if they mention gi/kimono, "nogi" if no-gi, "mixed" if both, "unknown" if unclear
- For sessionKind: "class" for structured instruction, "open_mat" for open rolling, "drilling" for pure drilling, "competition" for tournament/comp, "other" if unclear

JSON Schema:
{
  "durationMinutes": number | null,
  "trainingMode": "gi" | "nogi" | "mixed" | "unknown" | null,
  "sessionKind": "class" | "open_mat" | "drilling" | "competition" | "other" | null,
  "techniquesDrilled": string[],
  "didSpar": boolean | null,
  "sparringRounds": number | null,
  "submissionsGiven": [{"type": string, "count": number}],
  "submissionsReceived": [{"type": string, "count": number}],
  "workedWell": string[],
  "struggles": string[],
  "injuries": string[],
  "energyLevel": 1-5 | null,
  "mood": 1-5 | null,
  "lessonTopic": string | null,
  "rawNotes": string | null
}

Respond with ONLY the JSON object, no explanation.`;

// --- Validation ---

function validateExtraction(raw: unknown): ExtractionResult {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('extraction is not an object');
  }
  const obj = raw as Record<string, unknown>;

  return {
    durationMinutes: typeof obj.durationMinutes === 'number' ? obj.durationMinutes : null,
    trainingMode: ['gi', 'nogi', 'mixed', 'unknown'].includes(obj.trainingMode as string)
      ? (obj.trainingMode as ExtractionResult['trainingMode'])
      : null,
    sessionKind: ['class', 'open_mat', 'drilling', 'competition', 'other'].includes(obj.sessionKind as string)
      ? (obj.sessionKind as ExtractionResult['sessionKind'])
      : null,
    techniquesDrilled: Array.isArray(obj.techniquesDrilled) ? obj.techniquesDrilled : [],
    didSpar: typeof obj.didSpar === 'boolean' ? obj.didSpar : null,
    sparringRounds: typeof obj.sparringRounds === 'number' ? obj.sparringRounds : null,
    submissionsGiven: Array.isArray(obj.submissionsGiven) ? obj.submissionsGiven : [],
    submissionsReceived: Array.isArray(obj.submissionsReceived) ? obj.submissionsReceived : [],
    workedWell: Array.isArray(obj.workedWell) ? obj.workedWell : [],
    struggles: Array.isArray(obj.struggles) ? obj.struggles : [],
    injuries: Array.isArray(obj.injuries) ? obj.injuries : [],
    energyLevel:
      typeof obj.energyLevel === 'number' && obj.energyLevel >= 1 && obj.energyLevel <= 5
        ? (obj.energyLevel as 1 | 2 | 3 | 4 | 5)
        : null,
    mood:
      typeof obj.mood === 'number' && obj.mood >= 1 && obj.mood <= 5
        ? (obj.mood as 1 | 2 | 3 | 4 | 5)
        : null,
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

    // --- Call Claude ---
    let extracted: ExtractionResult | null = null;
    let error: string | null = null;

    try {
      const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

      const message = await anthropic.messages.create({
        model: EXTRACTION_MODEL,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${EXTRACTION_PROMPT}\n\nTranscript:\n"${transcript}"`,
          },
        ],
      });

      const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

      try {
        const parsed = JSON.parse(rawText);
        extracted = validateExtraction(parsed);
      } catch (parseErr) {
        error = `extraction_parse_failed: ${(parseErr as Error).message}`;
      }
    } catch (apiErr) {
      error = `extraction_api_failed: ${(apiErr as Error).message}`;
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
    // Top-level catch for any unhandled errors
    return new Response(
      JSON.stringify({ error: `Internal error: ${(err as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
