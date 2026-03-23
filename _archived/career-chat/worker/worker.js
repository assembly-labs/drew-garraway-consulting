/**
 * Cloudflare Worker - CareerChat API Proxy
 * Securely proxies requests to Anthropic API
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Parse incoming request
      const { message, history, resumeContent } = await request.json();

      // Validate input
      if (!message || !resumeContent) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Build strict system prompt
      const systemPrompt = `You are Drew Garraway's career assistant.

STRICT RULES:
1. ONLY answer questions about Drew's professional career (work history, skills, projects, education, roles, companies, achievements)
2. ANY off-topic question gets this EXACT response: "I only discuss Drew's career. Ask me about his experience, skills, or projects!"
3. Maximum 60 words per response - be concise
4. ALWAYS cite which section you're referencing (e.g., "In the Assembly Labs section..." or "According to his skills list...")
5. Never speculate or infer beyond what's explicitly written
6. If the answer isn't in the resume, say: "That specific detail isn't in my knowledge base. Ask about [suggest related topic from resume]."

Be aggressive about filtering off-topic questions. Only discuss career.

Resume:
${resumeContent}`;

      // Prepare messages (only send recent history to save tokens)
      const recentHistory = history.slice(-10); // Last 10 messages max
      const messages = [
        ...recentHistory,
        { role: 'user', content: message }
      ];

      // Call Anthropic API
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 150, // Strict token limit
          system: systemPrompt,
          messages: messages,
        }),
      });

      if (!anthropicResponse.ok) {
        const error = await anthropicResponse.text();
        console.error('Anthropic API error:', error);
        return new Response(JSON.stringify({ error: 'Failed to get response from AI' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await anthropicResponse.json();
      const responseText = data.content[0].text;

      // Return response with CORS headers
      return new Response(JSON.stringify({ response: responseText }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};
