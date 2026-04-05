/**
 * TOMO — Quarterly Insight Generation (Opus)
 *
 * "The Black Belt" — comprehensive quarterly assessment, strategic private lesson review.
 * Receives pre-computed quarterly patterns from client, generates a 6-section deep review.
 *
 * Model: claude-opus-4-6-20250514
 * Trigger: Quarterly (or on-demand)
 * Cost: ~$0.05-0.10 per generation
 *
 * SETUP:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *   supabase functions deploy generate-quarterly --no-verify-jwt
 *   (then re-deploy WITH JWT: supabase functions deploy generate-quarterly)
 *
 * See docs/insights/models/ for full spec.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

// --- Configuration ---
const MODEL = 'claude-opus-4-6-20250514';
const SCHEMA_VERSION = 1;
const ANTHROPIC_TIMEOUT_MS = 90_000; // 90s — Opus takes longer

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// --- Types ---

interface QuarterlyInsightOutput {
  quarterSentence: string;
  gameForming: string;
  progression: string;
  consistency: string;
  bodyCheck: string | null;
  nextQuarterPriorities: string[];
}

interface ContextForLowerTiers {
  priorities: string[];
  gameIdentity: string;
  escalatingConcerns: string[];
}

interface QuarterlyInsightResponse {
  success: boolean;
  data: QuarterlyInsightOutput | null;
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

// --- Belt-Adapted Tone (inlined for Deno edge function) ---

const BELT_TONE: Record<string, { tone: string; depth: string; encouragement: string; vocabulary: string }> = {
  white: {
    tone: 'warm, encouraging, mentor-like',
    depth: 'accessible — explain concepts, celebrate commitment',
    encouragement: 'high — three months of BJJ is a real accomplishment',
    vocabulary: 'basic BJJ terms with brief context',
  },
  blue: {
    tone: 'coaching, developmental, honest',
    depth: 'moderate — name patterns, connect training to game development',
    encouragement: 'balanced — validate growth, name the hard truths gently',
    vocabulary: 'intermediate BJJ terms',
  },
  purple: {
    tone: 'analytical, collaborative, peer-level',
    depth: 'deep — systems-level observations, strategic connections',
    encouragement: 'minimal — they want insight, not praise',
    vocabulary: 'advanced BJJ terms, positional systems language',
  },
  brown: {
    tone: 'peer, professional, strategic',
    depth: 'deep — refinement observations, meta-game analysis',
    encouragement: 'minimal — acknowledge mastery trajectory',
    vocabulary: 'expert BJJ terms, competition strategy language',
  },
  black: {
    tone: 'peer, professional, strategic',
    depth: 'deep — refinement observations, meta-game analysis',
    encouragement: 'minimal — peer-level discourse',
    vocabulary: 'expert BJJ terms, coaching and competition language',
  },
};

// --- Prompt Builders ---

function buildSystemPrompt(belt: string): string {
  const beltConfig = BELT_TONE[belt] || BELT_TONE.white;

  return `You are a black belt conducting a quarterly private lesson review. This is not a dashboard summary — it is a sit-down, meaningful assessment of their last three months of training. Write with weight.

TONE: ${beltConfig.tone}
DEPTH: ${beltConfig.depth}
ENCOURAGEMENT: ${beltConfig.encouragement}
VOCABULARY: Use ${beltConfig.vocabulary}

YOUR TASK: Produce a 6-section quarterly review.

SECTIONS:

1. "quarterSentence" — THE QUARTER IN ONE SENTENCE. Capture the arc of their last three months. Not a stat line — a narrative sentence that names the trajectory.

2. "gameForming" — YOUR GAME IS FORMING. This is the most valuable section. Name the emerging system you see. Connect dots they cannot see themselves — which techniques cluster together, what positions they gravitate toward, where their A-game is crystallizing. If their game is already defined, name how it evolved. Be specific: name techniques, positions, and submission chains.

3. "progression" — PROGRESSION. Month-over-month evolution with specific numbers pulled from the monthly reviews. Name what got better, what plateaued, what regressed. Be concrete.

4. "consistency" — CONSISTENCY & COMMITMENT. Honest assessment of their training frequency and adherence against their stated goals. If they want to compete but train 2.9 times per week, name that gap respectfully. If they are exceeding goals, acknowledge it without hollow praise.

5. "bodyCheck" — BODY CHECK. Injury trends over the quarter. If a nagging injury escalated or a pattern is concerning, be direct about it — they need to hear it. If no injury issues, return null for this field.

6. "nextQuarterPriorities" — NEXT QUARTER PRIORITIES. 2-3 ranked priorities, actionable and specific. Frame as "areas to explore with your coach" — never prescribe drills or techniques directly. Each priority should connect back to observations from earlier sections.

RULES:
- Reference actual techniques, submissions, positions, and patterns by name. Never be vague.
- Frame everything as observation — their coach has final say on training direction.
- Keep total output under 500 words across all sections.
- Never use emojis.
- Never give medical advice. If bodyCheck names a concern, tell them to talk to their coach or a medical professional.

OUTPUT: Return valid JSON matching this exact structure:
{
  "quarterSentence": "string",
  "gameForming": "string",
  "progression": "string",
  "consistency": "string",
  "bodyCheck": "string or null",
  "nextQuarterPriorities": ["string", "string"]
}

Return 2-3 items in nextQuarterPriorities. No more than 3.`;
}

function buildUserMessage(input: Record<string, unknown>): string {
  const parts: string[] = [];

  // User context (UCD text)
  if (input.userContext) {
    parts.push(`USER CONTEXT:\n${input.userContext}`);
  }

  // Quarter identifier and stats
  const quarter = input.quarter as { start: string; end: string; label: string };
  parts.push(`\nQUARTER: ${quarter.label} (${quarter.start} to ${quarter.end})`);
  parts.push(`Total sessions this quarter: ${input.totalSessionsQuarter}`);
  parts.push(`Average sessions per week: ${input.avgSessionsPerWeek}`);
  parts.push(`Target frequency: ${input.targetFrequency}/week`);

  // Technique evolution
  if (input.techniqueEvolution) {
    const te = input.techniqueEvolution as Record<string, unknown>;
    parts.push(`\nTECHNIQUE EVOLUTION:`);
    if (te.emergingSystem) {
      parts.push(`Emerging system: ${te.emergingSystem}`);
    }
    if (te.diversityTrend) {
      parts.push(`Diversity trend: ${te.diversityTrend}`);
    }
    const added = te.techniquesAdded as string[];
    if (added && added.length > 0) {
      parts.push(`Techniques added this quarter: ${added.join(', ')}`);
    }
    const dropped = te.techniquesDropped as string[];
    if (dropped && dropped.length > 0) {
      parts.push(`Techniques dropped this quarter: ${dropped.join(', ')}`);
    }
  }

  // Submission evolution by month
  if (input.submissionEvolution) {
    const se = input.submissionEvolution as Record<string, unknown>[];
    parts.push(`\nSUBMISSION EVOLUTION BY MONTH:`);
    se.forEach((month) => {
      parts.push(`  ${month.month}: ratio ${month.ratio}, top given: ${month.topGiven}, top received: ${month.topReceived}`);
    });
  }

  // Injury arc by month
  if (input.injuryArc) {
    const ia = input.injuryArc as Record<string, unknown>[];
    parts.push(`\nINJURY ARC BY MONTH:`);
    ia.forEach((month) => {
      const injuries = month.injuries as string[];
      if (injuries && injuries.length > 0) {
        parts.push(`  ${month.month}: ${injuries.join(', ')}`);
      } else {
        parts.push(`  ${month.month}: none reported`);
      }
    });
  }

  if (input.escalatingInjuries) {
    const ei = input.escalatingInjuries as string[];
    if (ei.length > 0) {
      parts.push(`ESCALATING INJURIES (appeared in 2+ months): ${ei.join(', ')}`);
    }
  }

  // Consistency arc by month
  if (input.consistencyArc) {
    const ca = input.consistencyArc as Record<string, unknown>[];
    parts.push(`\nCONSISTENCY ARC BY MONTH:`);
    ca.forEach((month) => {
      parts.push(`  ${month.month}: ${month.sessions} sessions (adherence: ${month.adherence}%)`);
    });
  }

  // Monthly reviews (summaries + focus areas from Sonnet outputs)
  if (input.monthlyReviews) {
    const mr = input.monthlyReviews as Record<string, unknown>[];
    parts.push(`\nMONTHLY REVIEWS (from coach check-ins):`);
    mr.forEach((review) => {
      parts.push(`  ${review.month}:`);
      if (review.summary) {
        parts.push(`    Summary: ${review.summary}`);
      }
      if (review.focusArea) {
        parts.push(`    Focus area: ${review.focusArea}`);
      }
      if (review.gameIdentity) {
        parts.push(`    Game identity: ${review.gameIdentity}`);
      }
    });
  }

  // Sentiment arc by month
  if (input.sentimentArc) {
    const sa = input.sentimentArc as Record<string, unknown>[];
    parts.push(`\nSENTIMENT ARC BY MONTH:`);
    sa.forEach((month) => {
      parts.push(`  ${month.month}: ${month.sentiment}`);
    });
  }

  // Profile context
  if (input.profileContext) {
    const pc = input.profileContext as Record<string, unknown>;
    parts.push(`\nPROFILE CONTEXT:`);
    parts.push(`Belt: ${pc.belt}`);
    if (pc.stripes) parts.push(`Stripes: ${pc.stripes}`);
    if (pc.experience) parts.push(`Experience: ${pc.experience}`);
    if (pc.goals) parts.push(`Goals: ${pc.goals}`);
    if (pc.gym) parts.push(`Gym: ${pc.gym}`);
  }

  // Prior quarter priorities
  const priorPriorities = input.priorQuarterPriorities as string[];
  if (priorPriorities && priorPriorities.length > 0) {
    parts.push(`\nPRIOR QUARTER PRIORITIES (from last quarterly review):`);
    priorPriorities.forEach((p: string, i: number) => {
      parts.push(`${i + 1}. ${p}`);
    });
  }

  return parts.join('\n');
}

// --- Context Extraction for Lower Tiers ---

function extractGameIdentity(gameForming: string): string {
  // Take the first sentence as a concise game identity summary
  const firstSentence = gameForming.split(/[.!]/).filter((s) => s.trim().length > 0)[0];
  return firstSentence ? firstSentence.trim() : gameForming.slice(0, 150).trim();
}

function buildContextForLowerTiers(insightData: QuarterlyInsightOutput): ContextForLowerTiers {
  return {
    priorities: insightData.nextQuarterPriorities,
    gameIdentity: extractGameIdentity(insightData.gameForming),
    escalatingConcerns: insightData.bodyCheck ? [insightData.bodyCheck] : [],
  };
}

// --- Validation ---

function validateOutput(raw: unknown): QuarterlyInsightOutput {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('output is not an object');
  }
  const obj = raw as Record<string, unknown>;

  if (typeof obj.quarterSentence !== 'string' || obj.quarterSentence.length === 0) {
    throw new Error('missing or empty quarterSentence');
  }
  if (typeof obj.gameForming !== 'string' || obj.gameForming.length === 0) {
    throw new Error('missing or empty gameForming');
  }
  if (typeof obj.progression !== 'string' || obj.progression.length === 0) {
    throw new Error('missing or empty progression');
  }
  if (typeof obj.consistency !== 'string' || obj.consistency.length === 0) {
    throw new Error('missing or empty consistency');
  }
  if (obj.bodyCheck !== null && typeof obj.bodyCheck !== 'string') {
    throw new Error('bodyCheck must be a string or null');
  }
  if (!Array.isArray(obj.nextQuarterPriorities)) {
    throw new Error('missing or invalid nextQuarterPriorities array');
  }
  if (obj.nextQuarterPriorities.length < 2 || obj.nextQuarterPriorities.length > 3) {
    throw new Error(`expected 2-3 nextQuarterPriorities, got ${obj.nextQuarterPriorities.length}`);
  }
  for (let i = 0; i < obj.nextQuarterPriorities.length; i++) {
    if (typeof obj.nextQuarterPriorities[i] !== 'string' || (obj.nextQuarterPriorities[i] as string).length === 0) {
      throw new Error(`nextQuarterPriorities[${i}] must be a non-empty string`);
    }
  }

  return {
    quarterSentence: obj.quarterSentence as string,
    gameForming: obj.gameForming as string,
    progression: obj.progression as string,
    consistency: obj.consistency as string,
    bodyCheck: (obj.bodyCheck as string | null) || null,
    nextQuarterPriorities: obj.nextQuarterPriorities as string[],
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

    if (!input.belt || !input.quarter) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: belt, quarter' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const quarter = input.quarter as { start: string; end: string; label: string };

    // --- Check for Existing Insight This Quarter ---
    const { data: existing } = await supabase
      .from('insights')
      .select('id')
      .eq('user_id', user.id)
      .eq('tier', 'quarterly')
      .eq('period_start', quarter.start)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Quarterly insight already exists for this period' }),
        { status: 409, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Build Prompts ---
    const belt = input.belt as string;
    const systemPrompt = buildSystemPrompt(belt);
    const userMessage = buildUserMessage(input);

    // --- Call Claude ---
    let insightData: QuarterlyInsightOutput | null = null;
    let error: string | null = null;
    let inputTokens: number | undefined;
    let outputTokens: number | undefined;

    try {
      const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

      // Use AbortController for timeout — Opus takes longer, 90s limit
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS);

      let message;
      try {
        message = await anthropic.messages.create(
          {
            model: MODEL,
            max_tokens: 1500,
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

    // --- Build Context for Lower Tiers (cascades to Sonnet and Haiku) ---
    const contextForLowerTiers = buildContextForLowerTiers(insightData);

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
        tier: 'quarterly',
        period_start: quarter.start,
        period_end: quarter.end,
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
      const response: QuarterlyInsightResponse = {
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
    const response: QuarterlyInsightResponse = {
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
    console.error('Quarterly insight generation error:', err);
    return new Response(
      JSON.stringify({ error: `Internal error: ${(err as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
