/// <reference types="@cloudflare/workers-types" />
/**
 * Cloudflare Pages Function: Secure Claude API Proxy
 * Migrated from Netlify Functions
 *
 * This serverless function acts as a secure proxy between your frontend
 * and the Anthropic Claude API. The API key is stored securely in
 * Cloudflare's environment variables and never exposed to the client.
 */

import Anthropic from '@anthropic-ai/sdk';

interface Env {
  CLAUDE_API_KEY: string;
}

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

// Response cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const responseCache = new Map<string, { response: any; timestamp: number }>();

function getCacheKey(messages: any[], systemPrompt: string): string {
  return JSON.stringify({ messages, systemPrompt });
}

function getCachedResponse(cacheKey: string): any | null {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL) {
    responseCache.delete(cacheKey);
    return null;
  }

  return cached.response;
}

function setCachedResponse(cacheKey: string, response: any): void {
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });

  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
}

async function callClaudeWithRetry(
  client: Anthropic,
  params: any,
  retries = 0
): Promise<any> {
  try {
    return await client.messages.create(params);
  } catch (error: any) {
    if (retries < MAX_RETRIES) {
      if (error.status === 429 || error.status === 503 || error.status === 504) {
        const delay = RETRY_DELAY * Math.pow(2, retries);
        console.log(`Retrying Claude API call after ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callClaudeWithRetry(client, params, retries + 1);
      }
    }
    throw error;
  }
}

// Handle OPTIONS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
};

// Handle POST requests
export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.text();
    if (!body) {
      return new Response(
        JSON.stringify({ error: 'No request body provided', fallback: true }),
        { status: 400, headers }
      );
    }

    let messages: any[];
    let systemPrompt: string;

    try {
      const parsed = JSON.parse(body);
      messages = parsed.messages;
      systemPrompt = parsed.systemPrompt;
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body', fallback: true }),
        { status: 400, headers }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers }
      );
    }

    if (!systemPrompt || typeof systemPrompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid request: systemPrompt string required' }),
        { status: 400, headers }
      );
    }

    const apiKey = env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('CLAUDE_API_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Please contact administrator.' }),
        { status: 500, headers }
      );
    }

    const client = new Anthropic({ apiKey });

    console.log(`Processing request with ${messages.length} messages`);

    // Check cache first
    const cacheKey = getCacheKey(messages, systemPrompt);
    const cachedResponse = getCachedResponse(cacheKey);

    let content: string;
    let usage: { input_tokens: number; output_tokens: number };

    if (cachedResponse) {
      console.log('Cache hit - returning cached response');
      content = cachedResponse.content;
      usage = cachedResponse.usage;
    } else {
      console.log('Cache miss - calling Claude API');
      const response = await callClaudeWithRetry(client, {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        temperature: 0.2,
        system: systemPrompt,
        messages: messages,
      });

      content = response.content[0]?.type === 'text'
        ? (response.content[0].text || '')
        : '';

      usage = {
        input_tokens: response.usage?.input_tokens || 0,
        output_tokens: response.usage?.output_tokens || 0,
      };

      setCachedResponse(cacheKey, { content, usage });
      console.log('Successfully processed Claude API request and cached response');
    }

    return new Response(
      JSON.stringify({ content, usage }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Claude API Error:', error);

    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred';

    if (error.status) {
      statusCode = error.status;
    }

    if (error.message) {
      if (error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        statusCode = 429;
      } else if (error.message.includes('API key')) {
        errorMessage = 'API authentication error';
        statusCode = 401;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        statusCode = 504;
      } else {
        errorMessage = error.message;
      }
    }

    return new Response(
      JSON.stringify({ error: errorMessage, fallback: true }),
      { status: statusCode, headers }
    );
  }
};
