/**
 * TOMO — Monthly Insight Generation (Sonnet)
 *
 * "The Coach" — structured monthly review, evaluative.
 * Receives pre-computed monthly patterns from client, generates a 6-section review.
 *
 * Model: claude-sonnet-4-6-20250514
 * Trigger: Monthly (1st of month or on-demand)
 *
 * SETUP:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *   supabase functions deploy generate-monthly --no-verify-jwt
 *   (then re-deploy WITH JWT: supabase functions deploy generate-monthly)
 *
 * See docs/insights/models/ for full spec.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

// --- Configuration ---
const MODEL = 'claude-sonnet-4-6-20250514';
const SCHEMA_VERSION = 1;
const ANTHROPIC_TIMEOUT_MS = 60_000; // 60s — Sonnet is slower than Haiku

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// --- Types ---

interface MonthlyInsightOutput {
  overview: string;
  developing: string;
  sparring: string | null;
  consistency: string;
  watch: string | null;
  focusNextMonth: string;
}

interface MonthlyInsightResponse {
  success: boolean;
  data: MonthlyInsightOutput | null;
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

// --- Belt-Adapted Tone (richer descriptions for Sonnet's depth) ---

const BELT_TONE: Record<string, { tone: string; depth: string; encouragement: string; vocabulary: string }> = {
  white: {
    tone: 'warm, supportive, encouraging — like a coach who remembers what it was like to start',
    depth: 'keep analysis simple, highlight progress over perfection, frame everything as growth',
    encouragement: 'high — celebrate showing up consistently, normalize the struggle, acknowledge courage',
    vocabulary: 'basic BJJ terms with brief clarifications where helpful',
  },
  blue: {
    tone: 'coaching, balanced, forward-looking — recognize the grind of blue belt',
    depth: 'connect techniques to emerging game patterns, note developmental arcs',
    encouragement: 'moderate — validate the hard middle, acknowledge plateaus as normal, highlight breakthroughs',
    vocabulary: 'intermediate BJJ terms, positional concepts, basic game theory',
  },
  purple: {
    tone: 'collaborative, analytical, direct — peer-level coaching conversation',
    depth: 'deeper pattern analysis, game identity evolution, strategic observations',
    encouragement: 'minimal — analytical observations, note refinement and depth over breadth',
    vocabulary: 'advanced BJJ terms, chain concepts, meta-game language',
  },
  brown: {
    tone: 'peer, professional, precise — like a respected senior training partner',
    depth: 'nuanced tactical review, teaching development, competition readiness',
    encouragement: 'minimal — highlight edge refinement, system completeness',
    vocabulary: 'expert BJJ terms, micro-adjustments, system-level language',
  },
  black: {
    tone: 'peer, professional, precise — collegial and respectful',
    depth: 'strategic-level review, legacy development, teaching and mentoring patterns',
    encouragement: 'minimal — focus on mastery refinement and giving back',
    vocabulary: 'expert BJJ terms, conceptual frameworks, pedagogical observations',
  },
};

// --- Prompt Builders ---

function buildSystemPrompt(belt: string, hasQuarterlyPriorities: boolean): string {
  const beltConfig = BELT_TONE[belt] || BELT_TONE.white;

  return `You are an experienced BJJ coach writing a structured monthly training review.

TONE: ${beltConfig.tone}
DEPTH: ${beltConfig.depth}
ENCOURAGEMENT: ${beltConfig.encouragement}
VOCABULARY: Use ${beltConfig.vocabulary}

RULES:
- Write a monthly review with exactly 6 sections. Keep total output under 300 words.
- OVERVIEW: One sentence capturing the month's story arc. What defined this month of training?
- WHAT'S DEVELOPING (developing): Emerging game identity, connect techniques to larger patterns. 2-3 sentences. Reference specific techniques by name.
- SPARRING PROGRESS (sparring): Submission trends, positional progress. 2 sentences. If no sparring data exists, return null for this field.
- CONSISTENCY: Training adherence vs their goal. Streaks, gaps, momentum. 1-2 sentences.
- WATCH: Injuries, burnout signals, technique gaps, overtraining risk. 1-2 sentences. If no concerns exist, return null for this field.
- FOCUS FOR NEXT MONTH (focusNextMonth): One specific, actionable recommendation. Be concrete — name a technique, position, or habit.
${hasQuarterlyPriorities ? `
- Quarterly priorities are provided. Evaluate the month's training against them. Note progress toward priorities or drift away from them. Be specific.` : ''}
- Reference specific techniques by name when available. Don't generalize when you have data.
- Never contradict or replace their coach. Frame as observations, not instructions.
- Never give medical advice for injuries — flag them and recommend talking to their coach or a doctor.
- Never use emojis.

OUTPUT: Return valid JSON matching this exact structure:
{
  "overview": "One sentence — the month's story arc",
  "developing": "2-3 sentences — emerging game/identity, technique connections",
  "sparring": "2 sentences — submission trends, positional progress (or null if no sparring data)",
  "consistency": "1-2 sentences — adherence vs goal, streaks, gaps",
  "watch": "1-2 sentences — injuries, burnout, gaps (or null if no concerns)",
  "focusNextMonth": "One specific, actionable recommendation"
}

Return ONLY the JSON object. No other text.`;
}

function buildUserMessage(input: Record<string, unknown>): string {
  const parts: string[] = [];

  // User context
  if (input.userContext) {
    parts.push(`USER CONTEXT:\n${input.userContext}`);
  }

  // Month period
  const month = input.month as { start: string; end: string };
  parts.push(`\nMONTH: ${month.start} to ${month.end}`);

  // Monthly stats
  const stats = input.monthlyStats as Record<string, unknown>;
  if (stats) {
    parts.push(`\nMONTHLY STATS:`);
    parts.push(`Total sessions: ${stats.totalSessions}`);
    parts.push(`Total minutes: ${stats.totalMinutes}`);
    if (stats.adherence !== undefined) {
      parts.push(`Adherence: ${stats.adherence}% of target`);
    }
    if (stats.modes) {
      parts.push(`Training modes: ${JSON.stringify(stats.modes)}`);
    }
    if (stats.kinds) {
      parts.push(`Session kinds: ${JSON.stringify(stats.kinds)}`);
    }
    if (stats.sparringRounds !== undefined) {
      parts.push(`Sparring rounds: ${stats.sparringRounds}`);
    }
  }

  // Technique analysis
  const techniques = input.techniqueAnalysis as Record<string, unknown>;
  if (techniques) {
    parts.push(`\nTECHNIQUE ANALYSIS:`);
    const mostDrilled = techniques.mostDrilled as string[];
    if (mostDrilled && mostDrilled.length > 0) {
      parts.push(`Most drilled: ${mostDrilled.join(', ')}`);
    }
    const newTechniques = techniques.new as string[];
    if (newTechniques && newTechniques.length > 0) {
      parts.push(`New this month: ${newTechniques.join(', ')}`);
    }
    const dropped = techniques.dropped as string[];
    if (dropped && dropped.length > 0) {
      parts.push(`Dropped (trained last month, not this month): ${dropped.join(', ')}`);
    }
  }

  // Submission profile
  const submissions = input.submissionProfile as Record<string, unknown>;
  if (submissions) {
    parts.push(`\nSUBMISSION PROFILE:`);
    const given = submissions.given as { type: string; count: number }[];
    if (given && given.length > 0) {
      parts.push(`Submissions landed: ${given.map((s) => `${s.type} (${s.count}x)`).join(', ')}`);
    }
    const received = submissions.received as { type: string; count: number }[];
    if (received && received.length > 0) {
      parts.push(`Submissions caught in: ${received.map((s) => `${s.type} (${s.count}x)`).join(', ')}`);
    }
    if (submissions.ratio !== undefined) {
      parts.push(`Submission ratio (given:received): ${submissions.ratio}`);
    }
    if (submissions.trend) {
      parts.push(`Trend vs last month: ${submissions.trend}`);
    }
  }

  // Injury log
  const injuries = input.injuryLog as Record<string, unknown>;
  if (injuries) {
    parts.push(`\nINJURY LOG:`);
    const mentions = injuries.mentions as string[];
    if (mentions && mentions.length > 0) {
      parts.push(`Injury mentions: ${mentions.join(', ')}`);
    }
    const recurring = injuries.recurring as string[];
    if (recurring && recurring.length > 0) {
      parts.push(`Recurring injuries: ${recurring.join(', ')}`);
    }
    if (injuries.weeksWithInjury !== undefined) {
      parts.push(`Weeks with injury mentioned: ${injuries.weeksWithInjury}`);
    }
  }

  // Consistency pattern
  const consistency = input.consistencyPattern as Record<string, unknown>;
  if (consistency) {
    parts.push(`\nCONSISTENCY PATTERN:`);
    const weekByWeek = consistency.weekByWeek as { week: string; sessions: number }[];
    if (weekByWeek && weekByWeek.length > 0) {
      parts.push(`Week-by-week: ${weekByWeek.map((w) => `${w.week}: ${w.sessions} sessions`).join(', ')}`);
    }
    if (consistency.streak !== undefined) {
      parts.push(`Current streak: ${consistency.streak} days`);
    }
    if (consistency.gaps !== undefined) {
      parts.push(`Gaps (7+ days without training): ${consistency.gaps}`);
    }
  }

  // Sentiment trend
  const sentiment = input.sentimentTrend as { week: string; sentiment: string }[];
  if (sentiment && sentiment.length > 0) {
    parts.push(`\nSENTIMENT TREND BY WEEK:`);
    sentiment.forEach((s) => {
      parts.push(`${s.week}: ${s.sentiment}`);
    });
  }

  // Weekly insights summary
  const weeklyInsights = input.weeklyInsightsSummary as { week: string; summary: string }[];
  if (weeklyInsights && weeklyInsights.length > 0) {
    parts.push(`\nWEEKLY INSIGHTS SUMMARY (Haiku output, 1 line each):`);
    weeklyInsights.forEach((w) => {
      parts.push(`${w.week}: ${w.summary}`);
    });
  }

  // Quarterly priorities
  const quarterlyPriorities = input.quarterlyPriorities as string[];
  if (quarterlyPriorities && quarterlyPriorities.length > 0) {
    parts.push(`\nQUARTERLY PRIORITIES:`);
    quarterlyPriorities.forEach((p: string, i: number) => {
      parts.push(`${i + 1}. ${p}`);
    });
  }

  // Last month's focus area
  if (input.lastMonthFocus) {
    parts.push(`\nLAST MONTH'S FOCUS AREA: ${input.lastMonthFocus}`);
  }

  return parts.join('\n');
}

// --- Validation ---

function validateOutput(raw: unknown): MonthlyInsightOutput {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('output is not an object');
  }
  const obj = raw as Record<string, unknown>;

  if (typeof obj.overview !== 'string' || obj.overview.length === 0) {
    throw new Error('missing or empty overview');
  }
  if (typeof obj.developing !== 'string' || obj.developing.length === 0) {
    throw new Error('missing or empty developing');
  }
  // sparring can be null or string
  if (obj.sparring !== null && typeof obj.sparring !== 'string') {
    throw new Error('sparring must be a string or null');
  }
  if (typeof obj.consistency !== 'string' || obj.consistency.length === 0) {
    throw new Error('missing or empty consistency');
  }
  // watch can be null or string
  if (obj.watch !== null && typeof obj.watch !== 'string') {
    throw new Error('watch must be a string or null');
  }
  if (typeof obj.focusNextMonth !== 'string' || obj.focusNextMonth.length === 0) {
    throw new Error('missing or empty focusNextMonth');
  }

  return {
    overview: obj.overview as string,
    developing: obj.developing as string,
    sparring: (obj.sparring as string | null) || null,
    consistency: obj.consistency as string,
    watch: (obj.watch as string | null) || null,
    focusNextMonth: obj.focusNextMonth as string,
  };
}

// --- Context Extraction ---

function extractGameIdentity(developing: string): string {
  // Extract the first sentence or key phrase from the developing section
  const firstSentence = developing.split(/[.!?]/)[0];
  return firstSentence ? firstSentence.trim() : developing.trim();
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

    if (!input.belt || !input.month || !input.monthlyStats) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: belt, month, monthlyStats' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const month = input.month as { start: string; end: string };

    // --- Check for Existing Insight This Month ---
    const { data: existing } = await supabase
      .from('insights')
      .select('id')
      .eq('user_id', user.id)
      .eq('tier', 'monthly')
      .eq('period_start', month.start)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Monthly insight already exists for this period' }),
        { status: 409, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Build Prompts ---
    const belt = input.belt as string;
    const hasQuarterlyPriorities = !!(input.quarterlyPriorities && (input.quarterlyPriorities as string[]).length > 0);
    const systemPrompt = buildSystemPrompt(belt, hasQuarterlyPriorities);
    const userMessage = buildUserMessage(input);

    // --- Call Claude ---
    let insightData: MonthlyInsightOutput | null = null;
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
            max_tokens: 1000,
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

    // --- Extract Context for Lower Tiers ---
    const contextForLowerTiers = {
      focusArea: insightData.focusNextMonth,
      gameIdentity: extractGameIdentity(insightData.developing),
      watchItem: insightData.watch || null,
    };

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
        tier: 'monthly',
        period_start: month.start,
        period_end: month.end,
        insight_data: insightData,
        context_for_lower_tiers: contextForLowerTiers,
        model: MODEL,
        input_tokens: inputTokens || null,
        output_tokens: outputTokens || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      // Still return the insight even if storage fails
      const response: MonthlyInsightResponse = {
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
    const response: MonthlyInsightResponse = {
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
    console.error('Monthly insight generation error:', err);
    return new Response(
      JSON.stringify({ error: `Internal error: ${(err as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
