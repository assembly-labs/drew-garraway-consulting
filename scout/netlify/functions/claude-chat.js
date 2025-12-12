/**
 * Netlify Function: Secure Claude API Proxy
 *
 * This serverless function acts as a secure proxy between your frontend
 * and the Anthropic Claude API. The API key is stored securely in
 * Netlify's environment variables and never exposed to the client.
 */

import Anthropic from '@anthropic-ai/sdk';

// Retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // Start with 1 second

// Response cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const responseCache = new Map(); // In-memory cache: key -> {response, timestamp}

// Cache helper functions
function getCacheKey(messages, systemPrompt) {
  // Create a unique key from the request
  return JSON.stringify({ messages, systemPrompt });
}

function getCachedResponse(cacheKey) {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;

  const age = Date.now() - cached.timestamp;
  if (age > CACHE_TTL) {
    // Cache expired, remove it
    responseCache.delete(cacheKey);
    return null;
  }

  return cached.response;
}

function setCachedResponse(cacheKey, response) {
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });

  // Simple cache size limit (keep last 100 entries)
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}

async function callClaudeWithRetry(client, params, retries = 0) {
  try {
    return await client.messages.create(params);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      // Check if error is retryable
      if (error.status === 429 || error.status === 503 || error.status === 504) {
        const delay = RETRY_DELAY * Math.pow(2, retries); // Exponential backoff
        console.log(`Retrying Claude API call after ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callClaudeWithRetry(client, params, retries + 1);
      }
    }
    throw error;
  }
}

export async function handler(event, context) {
  // Enable CORS for your domain
  const headers = {
    'Access-Control-Allow-Origin': '*', // Update to your domain in production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    // Validate request body exists
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'No request body provided',
          fallback: true
        })
      };
    }

    // Parse request body
    let messages, systemPrompt;
    try {
      const parsed = JSON.parse(event.body);
      messages = parsed.messages;
      systemPrompt = parsed.systemPrompt;
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Invalid JSON in request body',
          fallback: true
        })
      };
    }

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request: messages array required' })
      };
    }

    if (!systemPrompt || typeof systemPrompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request: systemPrompt string required' })
      };
    }

    // Check for API key (support both uppercase and lowercase)
    const apiKey = process.env.CLAUDE_API_KEY || process.env.claude_api_key;
    if (!apiKey) {
      console.error('Neither CLAUDE_API_KEY nor claude_api_key environment variable is set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Server configuration error. Please contact administrator.'
        })
      };
    }

    // Initialize Anthropic client (secure - runs only on server)
    const client = new Anthropic({
      apiKey: apiKey
    });

    console.log(`Initializing Anthropic with model: claude-3-haiku-20240307`);
    console.log(`API Key present: ${apiKey ? 'Yes' : 'No'}`);
    console.log(`Processing request with ${messages.length} messages`);

    // Check cache first
    const cacheKey = getCacheKey(messages, systemPrompt);
    const cachedResponse = getCachedResponse(cacheKey);

    let content, usage;

    if (cachedResponse) {
      // Return cached response
      console.log('Cache hit - returning cached response');
      content = cachedResponse.content;
      usage = cachedResponse.usage;
    } else {
      // Call Claude API with retry logic
      console.log('Cache miss - calling Claude API');
      const response = await callClaudeWithRetry(client, {
        model: 'claude-3-haiku-20240307', // Using Haiku - fast, reliable model
        max_tokens: 1500,
        temperature: 0.2, // Lower temperature for more focused, catalog-only responses
        system: systemPrompt,
        messages: messages
      });

      // Extract text content (defensive: handle missing text property)
      content = response.content[0]?.type === 'text'
        ? (response.content[0].text || '')
        : '';

      usage = {
        input_tokens: response.usage?.input_tokens || 0,
        output_tokens: response.usage?.output_tokens || 0
      };

      // Cache the response
      setCachedResponse(cacheKey, { content, usage });
      console.log('Successfully processed Claude API request and cached response');
    }

    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: content,
        usage: usage
      })
    };

  } catch (error) {
    console.error('Claude API Error:', error);

    // Handle specific error types
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

    return {
      statusCode: statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
        fallback: true // Signal to frontend to use fallback
      })
    };
  }
}
