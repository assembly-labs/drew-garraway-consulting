/**
 * Cloudflare Pages Function: Secure Claude API Proxy
 *
 * This serverless function acts as a secure proxy between the frontend
 * and the Anthropic Claude API. The API key is stored securely in
 * Cloudflare's environment variables and never exposed to the client.
 *
 * Replaces: netlify/functions/claude-chat.js
 */

interface Env {
  CLAUDE_API_KEY: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: Message[];
  systemPrompt: string;
}

// Response cache configuration
const responseCache = new Map<string, { response: CacheEntry; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  content: string;
  usage: { input_tokens: number; output_tokens: number };
}

function getCacheKey(messages: Message[], systemPrompt: string): string {
  return JSON.stringify({ messages, systemPrompt });
}

function getCachedResponse(cacheKey: string): CacheEntry | null {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL) {
    responseCache.delete(cacheKey);
    return null;
  }

  return cached.response;
}

function setCachedResponse(cacheKey: string, response: CacheEntry): void {
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
  });

  // Simple cache size limit (keep last 100 entries)
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Handle OPTIONS preflight request
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders });
};

// Handle POST request
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as RequestBody;
    const { messages, systemPrompt } = body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid request: messages array required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!systemPrompt || typeof systemPrompt !== 'string') {
      return Response.json(
        { error: 'Invalid request: systemPrompt string required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for API key
    const apiKey = context.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('CLAUDE_API_KEY environment variable is not set');
      return Response.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Check cache first
    const cacheKey = getCacheKey(messages, systemPrompt);
    const cachedResponse = getCachedResponse(cacheKey);

    if (cachedResponse) {
      console.log('Cache hit - returning cached response');
      return Response.json(cachedResponse, { headers: corsHeaders });
    }

    console.log('Cache miss - calling Claude API');

    // Call Anthropic API directly using fetch
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        temperature: 0.2,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);

      // Handle rate limiting
      if (anthropicResponse.status === 429) {
        return Response.json(
          { error: 'Rate limit exceeded. Please try again in a moment.', fallback: true },
          { status: 429, headers: corsHeaders }
        );
      }

      return Response.json(
        { error: 'Failed to get response from AI', fallback: true },
        { status: anthropicResponse.status, headers: corsHeaders }
      );
    }

    const data = await anthropicResponse.json();

    // Extract response
    const content =
      data.content?.[0]?.type === 'text' ? data.content[0].text : '';

    const result: CacheEntry = {
      content,
      usage: {
        input_tokens: data.usage?.input_tokens || 0,
        output_tokens: data.usage?.output_tokens || 0,
      },
    };

    // Cache the response
    setCachedResponse(cacheKey, result);
    console.log('Successfully processed Claude API request and cached response');

    return Response.json(result, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Claude API Error:', error);

    let errorMessage = 'An unexpected error occurred';
    if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (error.message?.includes('API key')) {
      errorMessage = 'API authentication error';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again.';
    }

    return Response.json(
      { error: errorMessage, fallback: true },
      { status: 500, headers: corsHeaders }
    );
  }
};
