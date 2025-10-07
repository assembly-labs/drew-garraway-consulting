/**
 * Netlify Function: Secure Claude API Proxy
 *
 * This serverless function acts as a secure proxy between your frontend
 * and the Anthropic Claude API. The API key is stored securely in
 * Netlify's environment variables and never exposed to the client.
 */

const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
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
    // Parse request body
    const { messages, systemPrompt } = JSON.parse(event.body);

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

    console.log(`Initializing Anthropic with model: claude-3-5-sonnet-20241022`);
    console.log(`API Key present: ${apiKey ? 'Yes' : 'No'}`);
    console.log(`Processing request with ${messages.length} messages`);

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      temperature: 0.3,
      system: systemPrompt,
      messages: messages
    });

    // Extract text content
    const content = response.content[0]?.type === 'text'
      ? response.content[0].text
      : '';

    console.log('Successfully processed Claude API request');

    // Return successful response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        content: content,
        usage: {
          input_tokens: response.usage?.input_tokens || 0,
          output_tokens: response.usage?.output_tokens || 0
        }
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
        error: errorMessage
      })
    };
  }
};
