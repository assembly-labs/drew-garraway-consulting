/**
 * TOMO — Weekly Insight Generation (Haiku)
 *
 * "The Training Partner" — casual weekly debrief based on this week's training data.
 * Receives pre-computed patterns from client, generates 2-3 tactical observations.
 *
 * Model: claude-haiku-4-5-20251001
 * Trigger: Weekly (Sunday or on-demand)
 * Cost: ~$0.0003 per generation
 *
 * SETUP:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *   supabase functions deploy generate-weekly --no-verify-jwt
 *   (then re-deploy WITH JWT: supabase functions deploy generate-weekly)
 *
 * See docs/insights/models/HAIKU_WEEKLY.md for full spec.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

// --- Configuration ---
const MODEL = 'claude-haiku-4-5-20251001';
const SCHEMA_VERSION = 1;
const ANTHROPIC_TIMEOUT_MS = 30_000; // 30s — fail fast if Claude is slow

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// --- Types ---

interface WeeklyInsight {
  type: 'technique' | 'consistency' | 'sparring' | 'risk' | 'milestone' | 'game_development';
  title: string;
  body: string;
}

interface WeeklyInsightOutput {
  insights: WeeklyInsight[];
  focusNext: string;
}

interface WeeklyInsightResponse {
  success: boolean;
  data: WeeklyInsightOutput | null;
  stored: boolean;
  insightId?: string;
  error?: string;
  metadata: {
    model: string;
    schema_version: number;
    input_tokens?: number;
    output_tokens?: number;
  };
}

// --- Belt-Adapted Tone (inlined for Deno edge function — subset of chatbot adaptation) ---

const BELT_TONE: Record<string, { tone: string; depth: string; encouragement: string; vocabulary: string }> = {
  white: {
    tone: 'warm, supportive',
    depth: '1-2 sentences per insight',
    encouragement: 'high — celebrate showing up',
    vocabulary: 'basic BJJ terms',
  },
  blue: {
    tone: 'coaching, balanced',
    depth: '1-2 sentences per insight',
    encouragement: 'moderate — validate development',
    vocabulary: 'intermediate BJJ terms',
  },
  purple: {
    tone: 'collaborative, direct',
    depth: '1-2 sentences per insight',
    encouragement: 'minimal — analytical observations',
    vocabulary: 'advanced BJJ terms',
  },
  brown: {
    tone: 'peer, professional',
    depth: '1-2 sentences per insight',
    encouragement: 'minimal',
    vocabulary: 'expert BJJ terms',
  },
  black: {
    tone: 'peer, professional',
    depth: '1-2 sentences per insight',
    encouragement: 'minimal',
    vocabulary: 'expert BJJ terms',
  },
};

// --- Prompt Builders ---

function buildSystemPrompt(belt: string, hasMonthlyContext: boolean, hasQuarterlyContext: boolean): string {
  const beltConfig = BELT_TONE[belt] || BELT_TONE.white;

  return `You are a knowledgeable BJJ training partner giving a casual weekly debrief.

TONE: ${beltConfig.tone}
DEPTH: ${beltConfig.depth}
ENCOURAGEMENT: ${beltConfig.encouragement}
VOCABULARY: Use ${beltConfig.vocabulary}

RULES:
- Give 2-3 short observations. Lead with the most interesting pattern you see.
- Each insight: a short title (3-6 words) and body (1-2 sentences max). No filler.
- If an injury is recurring (mentioned in priorWeekDelta.recurringInjuries), mention it directly. Tell them to talk to their coach. Never give medical advice.
- Compare to last week only if the delta is meaningful (2+ sessions difference, new technique, etc.).
- End with one concrete thing to focus on next week (focusNext field).
${hasMonthlyContext ? `
- You have context from their monthly review. Frame your observations against the bigger picture — connect this week's training to their monthly focus area and game identity. If they're making progress on the focus, note it. If drifting, gently flag it. Don't repeat the monthly insight verbatim.` : ''}
${hasQuarterlyContext ? `
- You have their quarterly priorities. Reference them naturally when relevant — like a training partner who knows what they're working on this quarter. If a priority is being advanced, acknowledge it. If ignored for 2+ weeks, mention it once.` : ''}
${!hasMonthlyContext && !hasQuarterlyContext ? `
- No monthly or quarterly context yet (newer user). Focus purely on this week's patterns and belt-appropriate encouragement.` : ''}
- Never contradict or replace their coach. Frame as observations, not instructions.
- Never use emojis.

OUTPUT: Return valid JSON matching this exact structure:
{
  "insights": [
    { "type": "technique|consistency|sparring|risk|milestone|game_development", "title": "3-6 words", "body": "1-2 sentences" }
  ],
  "focusNext": "1 sentence — what to focus on next week"
}

Return 2-3 insights. No more than 3.`;
}

function buildUserMessage(input: Record<string, unknown>): string {
  const parts: string[] = [];

  if (input.userContext) {
    parts.push(`USER CONTEXT:\n${input.userContext}`);
  }

  const week = input.week as { start: string; end: string };
  parts.push(`WEEK: ${week.start} to ${week.end}`);
  parts.push(`Sessions this week: ${input.sessionsThisWeek} (target: ${input.targetFrequency}/week)`);
  parts.push(`Total sessions all time: ${input.totalSessionsAllTime}`);

  const wd = input.weekData as Record<string, unknown>;
  parts.push(`Streak: ${wd.streakDays} days`);

  parts.push(`\nTRAINING DATA:`);
  parts.push(`Total minutes: ${wd.totalMinutes}`);
  parts.push(`Modes: ${JSON.stringify(wd.modes)}`);
  parts.push(`Types: ${JSON.stringify(wd.kinds)}`);

  const techniquesDrilled = wd.techniquesDrilled as string[];
  if (techniquesDrilled && techniquesDrilled.length > 0) {
    parts.push(`Techniques drilled: ${techniquesDrilled.join(', ')}`);
  }

  parts.push(`Sparring rounds: ${wd.sparringRounds}`);

  const submissionsGiven = wd.submissionsGiven as { type: string; count: number }[];
  if (submissionsGiven && submissionsGiven.length > 0) {
    parts.push(`Submissions landed: ${submissionsGiven.map((s) => `${s.type} (${s.count}x)`).join(', ')}`);
  }

  const submissionsReceived = wd.submissionsReceived as { type: string; count: number }[];
  if (submissionsReceived && submissionsReceived.length > 0) {
    parts.push(`Submissions caught in: ${submissionsReceived.map((s) => `${s.type} (${s.count}x)`).join(', ')}`);
  }

  const injuries = wd.injuries as string[];
  if (injuries && injuries.length > 0) {
    parts.push(`Injuries mentioned: ${injuries.join(', ')}`);
  }

  parts.push(`Overall sentiment: ${wd.sentiment}`);

  const detectedPatterns = wd.detectedPatterns as string[];
  if (detectedPatterns && detectedPatterns.length > 0) {
    parts.push(`Detected patterns: ${detectedPatterns.join(', ')}`);
  }

  if (input.priorWeekDelta) {
    const d = input.priorWeekDelta as Record<string, unknown>;
    parts.push(`\nCOMPARED TO LAST WEEK:`);
    const sessionsDelta = d.sessionsDelta as number;
    parts.push(`Sessions: ${sessionsDelta >= 0 ? '+' : ''}${sessionsDelta}`);
    const sparringDelta = d.sparringDelta as number;
    parts.push(`Sparring rounds: ${sparringDelta >= 0 ? '+' : ''}${sparringDelta}`);
    const newTechniques = d.newTechniques as string[];
    if (newTechniques && newTechniques.length > 0) {
      parts.push(`New techniques this week: ${newTechniques.join(', ')}`);
    }
    const recurringInjuries = d.recurringInjuries as string[];
    if (recurringInjuries && recurringInjuries.length > 0) {
      parts.push(`Recurring injuries (2+ weeks): ${recurringInjuries.join(', ')}`);
    }
  }

  if (input.monthlyContext) {
    const mc = input.monthlyContext as Record<string, unknown>;
    parts.push(`\nMONTHLY CONTEXT (from coach check-in):`);
    parts.push(`Focus area: ${mc.focusArea}`);
    parts.push(`Game identity: ${mc.gameIdentity}`);
    if (mc.watchItem) {
      parts.push(`Watch item: ${mc.watchItem}`);
    }
  }

  const quarterlyPriorities = input.quarterlyPriorities as string[];
  if (quarterlyPriorities && quarterlyPriorities.length > 0) {
    parts.push(`\nQUARTERLY PRIORITIES:`);
    quarterlyPriorities.forEach((p: string, i: number) => {
      parts.push(`${i + 1}. ${p}`);
    });
  }

  return parts.join('\n');
}

// --- Validation ---

const VALID_INSIGHT_TYPES = ['technique', 'consistency', 'sparring', 'risk', 'milestone', 'game_development'];

function validateOutput(raw: unknown): WeeklyInsightOutput {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('output is not an object');
  }
  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.insights)) {
    throw new Error('missing or invalid insights array');
  }
  if (obj.insights.length === 0 || obj.insights.length > 3) {
    throw new Error(`expected 1-3 insights, got ${obj.insights.length}`);
  }
  if (typeof obj.focusNext !== 'string' || obj.focusNext.length === 0) {
    throw new Error('missing or empty focusNext');
  }

  const insights: WeeklyInsight[] = obj.insights.map((item: unknown, i: number) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`insight[${i}] is not an object`);
    }
    const insight = item as Record<string, unknown>;
    if (!insight.type || !insight.title || !insight.body) {
      throw new Error(`insight[${i}] missing required fields (type, title, body)`);
    }
    if (!VALID_INSIGHT_TYPES.includes(insight.type as string)) {
      throw new Error(`insight[${i}] invalid type: ${insight.type}`);
    }
    return {
      type: insight.type as WeeklyInsight['type'],
      title: insight.title as string,
      body: insight.body as string,
    };
  });

  return {
    insights,
    focusNext: obj.focusNext as string,
  };
}

// --- Main Handler ---

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
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
    let input: Record<string, unknown>;
    try {
      input = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!input.belt || !input.weekData || !input.week) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: belt, week, weekData' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const week = input.week as { start: string; end: string };

    // --- Check for Existing Insight This Week ---
    const { data: existing } = await supabase
      .from('insights')
      .select('id')
      .eq('user_id', user.id)
      .eq('tier', 'weekly')
      .eq('period_start', week.start)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Weekly insight already exists for this period' }),
        { status: 409, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Build Prompts ---
    const belt = input.belt as string;
    const systemPrompt = buildSystemPrompt(
      belt,
      !!input.monthlyContext,
      !!(input.quarterlyPriorities && (input.quarterlyPriorities as string[]).length > 0)
    );
    const userMessage = buildUserMessage(input);

    // --- Call Claude ---
    let insightData: WeeklyInsightOutput | null = null;
    let error: string | null = null;
    let inputTokens: number | undefined;
    let outputTokens: number | undefined;

    try {
      const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

      // Use AbortController for timeout — fail fast if Claude is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);

      let message;
      try {
        message = await anthropic.messages.create(
          {
            model: MODEL,
            max_tokens: 500,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }],
          },
          { signal: controller.signal }
        );
      } finally {
        clearTimeout(timeoutId);
      }

      inputTokens = message.usage?.input_tokens;
      outputTokens = message.usage?.output_tokens;

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
        insightData = validateOutput(parsed);
      } catch (parseErr) {
        error = `insight_parse_failed: ${(parseErr as Error).message} | raw: ${rawText.slice(0, 200)}`;
      }
    } catch (apiErr) {
      const isTimeout = apiErr instanceof DOMException && apiErr.name === 'AbortError';
      if (isTimeout) {
        return new Response(
          JSON.stringify({ success: false, error: 'Generation timed out' }),
          { status: 504, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      error = `insight_api_failed: ${(apiErr as Error).message}`;
    }

    // --- Handle Parse/Validation Failures ---
    if (!insightData) {
      return new Response(
        JSON.stringify({
          success: false,
          data: null,
          stored: false,
          error,
          metadata: { model: MODEL, schema_version: SCHEMA_VERSION },
        }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Store in Database ---
    // Use service role for insert to bypass RLS — user was already verified above
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: insight, error: insertError } = await supabaseAdmin
      .from('insights')
      .insert({
        user_id: user.id,
        tier: 'weekly',
        period_start: week.start,
        period_end: week.end,
        insight_data: insightData,
        context_for_lower_tiers: null, // weekly doesn't cascade down
        model: MODEL,
        input_tokens: inputTokens || null,
        output_tokens: outputTokens || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      // Still return the insight even if storage fails
      const response: WeeklyInsightResponse = {
        success: true,
        data: insightData,
        stored: false,
        error: `storage_failed: ${insertError.message}`,
        metadata: {
          model: MODEL,
          schema_version: SCHEMA_VERSION,
          input_tokens: inputTokens,
          output_tokens: outputTokens,
        },
      };
      return new Response(JSON.stringify(response), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // --- Success Response ---
    const response: WeeklyInsightResponse = {
      success: true,
      data: insightData,
      stored: true,
      insightId: insight.id,
      metadata: {
        model: MODEL,
        schema_version: SCHEMA_VERSION,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    // Top-level catch for any unhandled errors
    console.error('Weekly insight generation error:', err);
    return new Response(
      JSON.stringify({ error: `Internal error: ${(err as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
