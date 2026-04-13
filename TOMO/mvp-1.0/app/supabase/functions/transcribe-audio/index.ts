/**
 * TOMO — Audio Transcription Edge Function
 *
 * Proxies audio transcription through the server so the AssemblyAI API key
 * never ships in the mobile app binary.
 *
 * HOW IT WORKS:
 * 1. App uploads audio to private Supabase Storage bucket
 * 2. App calls this function with the storage path
 * 3. This function generates a signed URL and sends it to AssemblyAI
 * 4. Polls AssemblyAI until transcription completes
 * 5. Returns the transcript text to the app
 *
 * SECURITY: Requires valid Supabase JWT. Uses service role key to generate
 * signed URLs (the user's anon key can read their own files via RLS, but
 * signed URLs require the service role).
 *
 * SETUP:
 *   supabase secrets set ASSEMBLYAI_API_KEY=...
 *   supabase functions deploy transcribe-audio
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// --- Configuration ---
const ASSEMBLYAI_BASE_URL = 'https://api.assemblyai.com/v2';
const SIGNED_URL_EXPIRY_SECONDS = 900; // 15 minutes
const POLL_INTERVAL_MS = 3000; // Check every 3 seconds
const MAX_POLL_ATTEMPTS = 45; // Give up after ~135s (under Supabase free-tier 150s limit)

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// ~180 BJJ-specific terms for improved transcription accuracy.
// Full list lives in docs/data-and-ai/VOICE_TRANSCRIPTION_SPEC.md
const BJJ_VOCABULARY = [
  // Chokes
  'rear naked choke', 'guillotine', 'darce', 'bow and arrow', 'ezekiel',
  'baseball bat choke', 'loop choke', 'clock choke', 'brabo', 'anaconda',
  'arm triangle', 'north south choke', 'von flue', 'peruvian necktie',
  'cross collar choke', 'paper cutter', 'gogoplata',
  // Joint locks
  'armbar', 'kimura', 'americana', 'omoplata', 'wrist lock', 'heel hook',
  'ankle lock', 'toe hold', 'kneebar', 'calf slicer', 'estima lock',
  'straight ankle lock', 'inside heel hook', 'outside heel hook',
  'bicep slicer', 'tarikoplata', 'baratoplata',
  // Guards
  'closed guard', 'half guard', 'deep half', 'z guard', 'butterfly guard',
  'spider guard', 'lasso guard', 'de la riva', 'reverse de la riva',
  'x guard', 'single leg x', 'rubber guard', 'k guard', 'fifty fifty',
  'quarter guard', 'lockdown',
  // Top positions
  'mount', 'side control', 'knee on belly', 'back control', 'north south',
  'turtle', 'crucifix', 'kesa gatame', 'back mount', 'S mount',
  // Sweeps
  'scissor sweep', 'hip bump', 'flower sweep', 'pendulum sweep',
  'elevator sweep', 'berimbolo', 'waiter sweep', 'tripod sweep',
  'overhead sweep', 'sickle sweep',
  // Escapes
  'hip escape', 'shrimp', 'trap and roll', 'upa', 'frame', 'underhook',
  'granby roll', 'elbow escape', 'bridge', 'back escape',
  // Takedowns
  'double leg', 'single leg', 'arm drag', 'snap down', 'osoto gari',
  'uchi mata', 'seoi nage', 'body lock', 'ankle pick', 'fireman carry',
  'harai goshi', 'ouchi gari', 'kouchi gari',
  // Passes
  'knee slice', 'knee cut', 'toreando', 'leg drag', 'x pass',
  'stack pass', 'body lock pass', 'smash pass', 'over under pass',
  'long step', 'headquarters', 'leg weave',
  // General terms
  'gi', 'no gi', 'nogi', 'rolling', 'tapped', 'drilling', 'flow rolling',
  'positional sparring', 'professor', 'coach', 'open mat', 'warm up',
  'technique', 'submission', 'guard pull', 'takedown defense',
  'jiu jitsu', 'BJJ', 'grappling',
];

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

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Parse Request ---
    let audioPath: string;
    try {
      const body = await req.json();
      audioPath = body.audioPath;
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!audioPath || typeof audioPath !== 'string') {
      return new Response(JSON.stringify({ error: 'audioPath is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Verify the audio path belongs to this user (path format: userId/sessionId.m4a)
    if (!audioPath.startsWith(`${user.id}/`)) {
      return new Response(JSON.stringify({ error: 'Access denied: not your audio file' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Check Audio File Size (max 100 MB) ---
    const MAX_AUDIO_BYTES = 100 * 1024 * 1024; // 100 MB
    const supabaseCheck = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const { data: fileList, error: listError } = await supabaseCheck.storage
      .from('audio-recordings')
      .list(audioPath.split('/').slice(0, -1).join('/'), {
        search: audioPath.split('/').pop(),
      });
    if (!listError && fileList && fileList.length > 0) {
      const fileSize = (fileList[0] as any).metadata?.size ?? 0;
      if (fileSize > MAX_AUDIO_BYTES) {
        return new Response(
          JSON.stringify({ error: `Audio file too large (${Math.round(fileSize / 1024 / 1024)}MB). Max 100MB.` }),
          { status: 413, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // --- Generate Signed URL ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('audio-recordings')
      .createSignedUrl(audioPath, SIGNED_URL_EXPIRY_SECONDS);

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Signed URL generation failed:', signedUrlError);
      return new Response(
        JSON.stringify({ error: 'Failed to access audio file. Please try again.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Send to AssemblyAI ---
    const assemblyAiKey = Deno.env.get('ASSEMBLYAI_API_KEY');
    if (!assemblyAiKey) {
      console.error('ASSEMBLYAI_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Transcription service not available. Please try again later.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    let transcriptId: string;
    try {
      const submitResponse = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript`, {
        method: 'POST',
        headers: {
          Authorization: assemblyAiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: signedUrlData.signedUrl,
          speech_models: ['universal'],
          word_boost: BJJ_VOCABULARY,
          boost_param: 'high',
          language_code: 'en_us',
          punctuate: true,
          format_text: true,
        }),
      });

      if (!submitResponse.ok) {
        const errorBody = await submitResponse.text();
        console.error('[transcribe-audio] AssemblyAI submit failed:', submitResponse.status, errorBody);
        return new Response(
          JSON.stringify({ error: `Transcription service error (${submitResponse.status}). Please try again.` }),
          { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const submitData = await submitResponse.json();
      transcriptId = submitData.id;
    } catch (err) {
      console.error('Transcription request failed:', err);
      return new Response(
        JSON.stringify({ error: 'Transcription request failed. Please try again.' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Poll for Completion ---
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      const pollResponse = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript/${transcriptId}`, {
        headers: { Authorization: assemblyAiKey },
      });

      if (!pollResponse.ok) continue;

      const pollData = await pollResponse.json();

      if (pollData.status === 'completed') {
        return new Response(
          JSON.stringify({
            success: true,
            transcript: pollData.text,
            confidence: pollData.confidence,
            words: pollData.words?.length ?? 0,
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      if (pollData.status === 'error') {
        console.error('Transcription failed:', pollData.error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Transcription failed. Please try recording again.',
          }),
          { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Timed out
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Transcription timed out — please try again',
      }),
      { status: 504, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (err) {
    console.error('Transcribe audio error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
