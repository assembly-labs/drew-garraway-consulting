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

interface WeeklyInsightParagraph {
  text: string;
  isWatch: boolean;
  defer?: string;
}

interface WeeklyInsightOutput {
  paragraphs: WeeklyInsightParagraph[];
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

function buildSystemPrompt(input: Record<string, unknown>): string {
  const belt = (input.belt as string) || 'white';
  const stripes = (input.stripes as number) || 0;
  const beltConfig = BELT_TONE[belt] || BELT_TONE.white;
  const trainingGoals = (input.trainingGoals as string[]) || [];
  const age = input.age as number | undefined;
  const gender = input.gender as string | undefined;
  const hasMonthlyContext = !!input.monthlyContext;
  const hasQuarterlyContext = !!(input.quarterlyPriorities && (input.quarterlyPriorities as string[]).length > 0);

  let prompt = `You are a BJJ training partner reviewing someone's week. You watched their rolls, you know what they drilled. You're knowledgeable but not their coach -- you're the friend who notices things.

NEVER give technical coaching instructions. NEVER reference belt promotions or timelines. NEVER say "great job" or "amazing" -- be specific or say nothing. NEVER give medical advice -- always defer injuries to their coach or doctor. NEVER use emojis.

TONE: ${beltConfig.tone}
VOCABULARY: ${beltConfig.vocabulary}
ENCOURAGEMENT: ${beltConfig.encouragement}`;

  // Belt-specific rules
  if (belt === 'white') {
    prompt += `

WHITE BELT RULES:
- Showing up IS the progress. Celebrate consistency above everything.
- Do NOT use the words "system," "game," "game identity," or "strategic."
- Do NOT quantify submission ratios.
- Do NOT compare to other belts.
- Name what they did, don't over-analyze it.
- Normalize getting tapped. Frame submissions received as learning.`;
    if (stripes >= 3) {
      prompt += `
- THIS USER HAS ${stripes} STRIPES. They survived the filter that kills 70-90% of practitioners. Acknowledge emerging competence. Say "becoming familiar" and "starting to recognize" -- but NOT "your system" or "your game."`;
    }
  } else if (belt === 'blue') {
    prompt += `

BLUE BELT RULES:
- Do NOT say "great job showing up" (patronizing at this level).
- Do NOT use "building a foundation" (they're past that).
- Connect techniques to each other. Name what's developing.
- Acknowledge the plateau honestly if sentiment is negative.
- Only use "game" language for 2+ stripe blue belts with clear patterns.`;
  }

  // Training motivation routing
  if (trainingGoals.length > 0) {
    prompt += `

WHY THEY TRAIN: ${trainingGoals.join(', ')}
Frame at least one observation through what matters to them:`;
    for (const goal of trainingGoals) {
      if (goal === 'Self-Defense' || goal === 'self-defense')
        prompt += `\n- Self-defense: Progress = can they protect themselves? Frame techniques as "tools that work under pressure." Celebrate escapes and survival.`;
      if (goal === 'Fitness' || goal === 'fitness')
        prompt += `\n- Fitness: Mention total minutes, session counts. "220 minutes on the mat this week" matters to them.`;
      if (goal === 'Competition' || goal === 'competition')
        prompt += `\n- Competition: Technique effectiveness, sparring results, preparation matter. Be direct about weaknesses.`;
      if (goal === 'Mental Health' || goal === 'mental-health')
        prompt += `\n- Mental health: The mat is their space. Frame sessions as self-care. "Three sessions this week -- that's three times you chose this."`;
      if (goal === 'Hobby' || goal === 'hobby')
        prompt += `\n- Hobby: Highlight new techniques tried, variety, and fun. Don't pressure performance.`;
      if (goal === 'Self-Improvement' || goal === 'self-improvement')
        prompt += `\n- Self-improvement: Consistency trends, habit streaks, long-term arcs matter.`;
      if (goal === 'Social' || goal === 'social' || goal === 'Community' || goal === 'community')
        prompt += `\n- Community: Mention training partners if noted. Acknowledge the gym culture.`;
    }
  }

  // Age context
  if (age) {
    if (age >= 46) {
      prompt += `\n\nAGE CONTEXT: ${age}. Longevity is the frame. "Sustainable training" over "more sessions." Never minimize injury. Deep respect for the commitment.`;
    } else if (age >= 36) {
      prompt += `\n\nAGE CONTEXT: ${age}. Recovery matters more at this stage. Don't push volume. Be more careful with injury language.`;
    }
  }

  // Gender context
  if (gender === 'Female' || gender === 'female') {
    prompt += `\n\nGENDER: Female. If relevant, frame size differences as leverage problems, not limitations. Never patronize.`;
  }

  // Monthly/quarterly context
  if (hasMonthlyContext) {
    prompt += `\n\nYou have context from their monthly review. Frame observations against the bigger picture. Connect this week to their monthly focus. Don't repeat the monthly insight verbatim.`;
  }
  if (hasQuarterlyContext) {
    prompt += `\n\nYou have quarterly priorities. Reference them when relevant. If a priority is being advanced, acknowledge it.`;
  }
  if (!hasMonthlyContext && !hasQuarterlyContext) {
    prompt += `\n\nNo monthly or quarterly context yet. Focus purely on this week's patterns.`;
  }

  prompt += `

OUTPUT RULES:
- Write 2-4 paragraphs. Lead with the most interesting pattern.
- Each paragraph: 1-2 sentences. No filler, no fluff.
- Vary your opening. Do NOT start with the user's name.
- Use **bold** sparingly for 1-2 key phrases, max.
- If an injury is recurring, mark that paragraph as a watch item (isWatch: true) with a defer line.
- focusNext must pass the "can they do this tomorrow" test.
- If training_goals are present, at least one paragraph should connect to WHY they train.

OUTPUT FORMAT -- valid JSON only, no markdown wrapping:
{
  "paragraphs": [
    { "text": "Paragraph text. Use **bold** for key phrases.", "isWatch": false },
    { "text": "Injury or risk paragraph.", "isWatch": true, "defer": "Worth talking to your coach about this." }
  ],
  "focusNext": "One specific, actionable recommendation."
}`;

  return prompt;
}

function buildUserMessage(input: Record<string, unknown>): string {
  const parts: string[] = [];

  // Profile context
  if (input.name) parts.push(`Name: ${input.name}`);
  parts.push(`Belt: ${input.belt}${input.stripes ? ` (${input.stripes} stripes)` : ''}`);
  if (input.totalSessionsAllTime) parts.push(`Total sessions: ${input.totalSessionsAllTime}`);
  if (input.experienceLevel) parts.push(`Experience: ${input.experienceLevel}`);
  if (input.gymName) parts.push(`Gym: ${input.gymName}`);

  if (input.userContext) {
    parts.push(`\nUSER CONTEXT:\n${input.userContext}`);
  }

  const week = input.week as { start: string; end: string };
  parts.push(`\nWEEK: ${week.start} to ${week.end}`);
  parts.push(`Sessions this week: ${input.sessionsThisWeek} (target: ${input.targetFrequency}/week)`);

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

  const instructors = wd.instructors as string[];
  if (instructors && instructors.length > 0) {
    parts.push(`Instructors this week: ${instructors.join(', ')}`);
  }

  const lessonTopics = wd.lessonTopics as string[];
  if (lessonTopics && lessonTopics.length > 0) {
    parts.push(`Lesson topics: ${lessonTopics.join(', ')}`);
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

function validateOutput(raw: unknown): WeeklyInsightOutput {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('output is not an object');
  }
  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.paragraphs)) {
    throw new Error('missing or invalid paragraphs array');
  }
  if (obj.paragraphs.length === 0 || obj.paragraphs.length > 5) {
    throw new Error(`expected 1-5 paragraphs, got ${obj.paragraphs.length}`);
  }
  if (typeof obj.focusNext !== 'string' || obj.focusNext.length === 0) {
    throw new Error('missing or empty focusNext');
  }

  const paragraphs: WeeklyInsightParagraph[] = obj.paragraphs.map((item: unknown, i: number) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`paragraph[${i}] is not an object`);
    }
    const para = item as Record<string, unknown>;
    if (typeof para.text !== 'string' || para.text.length === 0) {
      throw new Error(`paragraph[${i}] missing or empty text`);
    }
    return {
      text: para.text as string,
      isWatch: para.isWatch === true,
      defer: typeof para.defer === 'string' ? para.defer : undefined,
    };
  });

  return {
    paragraphs,
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
    const systemPrompt = buildSystemPrompt(input);
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
