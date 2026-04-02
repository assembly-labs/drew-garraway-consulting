/**
 * TOMO — Chat With Insight (Conversational Follow-Up)
 *
 * Enables users to ask follow-up questions about any generated insight.
 * Routes to the correct model based on insight tier. Enforces 5-exchange max.
 *
 * Models:
 *   weekly    → claude-haiku-4-5-20251001   (30s timeout, 200 max_tokens)
 *   monthly   → claude-sonnet-4-6-20250514  (60s timeout, 400 max_tokens)
 *   quarterly → claude-opus-4-6-20250514    (90s timeout, 500 max_tokens)
 *
 * SETUP:
 *   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
 *   supabase functions deploy chat-with-insight --no-verify-jwt
 *   (then re-deploy WITH JWT: supabase functions deploy chat-with-insight)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.39.0';

// --- Configuration ---

const MAX_EXCHANGES = 5;

const TIER_CONFIG: Record<string, { model: string; timeoutMs: number; maxTokens: number }> = {
  weekly: {
    model: 'claude-haiku-4-5-20251001',
    timeoutMs: 30_000,
    maxTokens: 200,
  },
  monthly: {
    model: 'claude-sonnet-4-6-20250514',
    timeoutMs: 60_000,
    maxTokens: 400,
  },
  quarterly: {
    model: 'claude-opus-4-6-20250514',
    timeoutMs: 90_000,
    maxTokens: 500,
  },
};

const CLOSE_MESSAGE =
  "That's our 5 for this one. Bring these questions to your next session with your coach — they'll have the best answers for your specific game.";

// CORS headers — applied to ALL responses (errors included)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// --- Types ---

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  insightId: string;
  tier: string;
  userMessage: string;
  context?: string;
}

interface ChatResponse {
  success: boolean;
  reply: string | null;
  exchangeCount: number;
  complete: boolean;
  closeMessage?: string;
  error?: string;
  metadata: {
    model: string;
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

// --- System Prompts Per Tier ---

const CHAT_SYSTEM_PROMPTS: Record<string, string> = {
  weekly: `You are continuing a conversation about a weekly training debrief.
You are a knowledgeable BJJ training partner.
Keep answers tactical and specific — 1-3 sentences max.
Suggest specific drills, positions, or things to try next session.
You're a training partner, not a coach. Stay in your lane.
Reference the weekly insight data when relevant.
Never give medical advice. Always suggest talking to their coach for injuries.
Never use emojis.`,

  monthly: `You are continuing a conversation about a monthly training review.
You are an experienced BJJ coach doing a check-in.
Provide development-oriented answers — 2-4 sentences.
Connect answers to the bigger picture of their game development.
Reference their technique patterns, sparring trends, or consistency data when relevant.
Frame guidance as observations and suggestions, not commands.
Never give medical advice. Never use emojis.`,

  quarterly: `You are continuing a conversation about a quarterly assessment.
You are a black belt conducting a private lesson review.
Provide strategic, analytical answers. This is a private lesson — give it weight.
Reference their quarterly progression, game identity, and priorities.
Help them see connections and systems they might not see themselves.
Frame everything as "consider exploring with your coach" not "you should do this."
Never give medical advice. Never use emojis.`,
};

// --- Prompt Builders ---

function buildSystemPrompt(tier: string, belt: string): string {
  const beltConfig = BELT_TONE[belt] || BELT_TONE.white;
  const tierPrompt = CHAT_SYSTEM_PROMPTS[tier] || CHAT_SYSTEM_PROMPTS.weekly;

  return `${tierPrompt}

TONE: ${beltConfig.tone}
VOCABULARY: Use ${beltConfig.vocabulary}
ENCOURAGEMENT: ${beltConfig.encouragement}`;
}

function buildFirstUserMessage(userMessage: string, context: string): string {
  return `${context}

USER QUESTION:
${userMessage}`;
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
    let input: ChatRequest;
    try {
      input = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (!input.insightId || !input.tier || !input.userMessage) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: insightId, tier, userMessage' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const tierConfig = TIER_CONFIG[input.tier];
    if (!tierConfig) {
      return new Response(
        JSON.stringify({ error: `Invalid tier: ${input.tier}. Must be weekly, monthly, or quarterly.` }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Service Role Client for DB Operations ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // --- Look Up Existing Conversation ---
    const { data: existingConvo, error: convoError } = await supabaseAdmin
      .from('insight_conversations')
      .select('*')
      .eq('insight_id', input.insightId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (convoError) {
      console.error('Conversation lookup error:', convoError);
      return new Response(
        JSON.stringify({ error: `Database error: ${convoError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Check if Conversation is Complete ---
    if (existingConvo && (existingConvo.complete || existingConvo.exchange_count >= MAX_EXCHANGES)) {
      return new Response(
        JSON.stringify({
          success: false,
          reply: null,
          exchangeCount: existingConvo.exchange_count,
          complete: true,
          closeMessage: CLOSE_MESSAGE,
          error: 'conversation_complete',
          metadata: { model: tierConfig.model },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Validate First Message Has Context ---
    if (!existingConvo && !input.context) {
      return new Response(
        JSON.stringify({ error: 'Context is required for the first message in a conversation' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Fetch Belt from Insight's User Profile ---
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('belt')
      .eq('id', user.id)
      .maybeSingle();

    const belt = (profile?.belt as string) || 'white';

    // --- Build Messages Array ---
    const systemPrompt = buildSystemPrompt(input.tier, belt);
    const messages: ConversationMessage[] = [];

    if (existingConvo) {
      // Existing conversation — replay history + append new user message
      const history = (existingConvo.messages as ConversationMessage[]) || [];
      messages.push(...history);
      messages.push({ role: 'user', content: input.userMessage });
    } else {
      // New conversation — first user message includes context
      const firstMessage = buildFirstUserMessage(input.userMessage, input.context!);
      messages.push({ role: 'user', content: firstMessage });
    }

    // --- Call Claude ---
    let replyText: string | null = null;
    let inputTokens: number | undefined;
    let outputTokens: number | undefined;

    try {
      const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

      // Use AbortController for timeout — fail fast if Claude is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), tierConfig.timeoutMs);

      let message;
      try {
        message = await anthropic.messages.create(
          {
            model: tierConfig.model,
            max_tokens: tierConfig.maxTokens,
            system: systemPrompt,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
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

      replyText = message.content[0].type === 'text' ? message.content[0].text : '';
    } catch (apiErr) {
      const isTimeout = apiErr instanceof DOMException && apiErr.name === 'AbortError';
      if (isTimeout) {
        return new Response(
          JSON.stringify({ success: false, error: 'Chat response timed out' }),
          { status: 504, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: `API error: ${(apiErr as Error).message}` }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (!replyText) {
      return new Response(
        JSON.stringify({ success: false, error: 'Empty response from model' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // --- Append Assistant Reply to Messages ---
    messages.push({ role: 'assistant', content: replyText });

    const newExchangeCount = existingConvo ? existingConvo.exchange_count + 1 : 1;
    const isComplete = newExchangeCount >= MAX_EXCHANGES;

    // --- Store Conversation State ---
    if (existingConvo) {
      // UPDATE existing conversation
      const { error: updateError } = await supabaseAdmin
        .from('insight_conversations')
        .update({
          messages: messages,
          exchange_count: newExchangeCount,
          complete: isComplete,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingConvo.id);

      if (updateError) {
        console.error('Conversation update error:', updateError);
        // Still return the reply even if storage fails
      }
    } else {
      // INSERT new conversation
      const { error: insertError } = await supabaseAdmin
        .from('insight_conversations')
        .insert({
          insight_id: input.insightId,
          user_id: user.id,
          messages: messages,
          exchange_count: newExchangeCount,
          complete: isComplete,
        });

      if (insertError) {
        console.error('Conversation insert error:', insertError);
        // Still return the reply even if storage fails
      }
    }

    // --- Build Response ---
    const response: ChatResponse = {
      success: true,
      reply: replyText,
      exchangeCount: newExchangeCount,
      complete: isComplete,
      metadata: {
        model: tierConfig.model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
      },
    };

    if (isComplete) {
      response.closeMessage = CLOSE_MESSAGE;
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    // Top-level catch for any unhandled errors
    console.error('Chat with insight error:', err);
    return new Response(
      JSON.stringify({ error: `Internal error: ${(err as Error).message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
