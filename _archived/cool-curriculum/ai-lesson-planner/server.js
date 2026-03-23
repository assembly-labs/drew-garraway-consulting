// Simple proxy server to handle Anthropic API calls
// This prevents CORS issues and keeps the API key secure

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Proxy endpoint for Anthropic API
app.post('/api/generate', async (req, res) => {
  const { systemPrompt, userPrompt } = req.body;

  if (!systemPrompt || !userPrompt) {
    return res.status(400).json({
      error: 'Missing required fields: systemPrompt and userPrompt'
    });
  }

  const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: 'API key not configured on server'
    });
  }

  try {
    console.log('📝 Generating lesson material...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ API Error:', response.status, errorData);
      return res.status(response.status).json({
        error: `API request failed: ${response.status} ${response.statusText}`,
        details: errorData
      });
    }

    const data = await response.json();
    console.log('✅ Generation successful');

    res.json(data);

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`
🚀 Proxy server running on http://localhost:${PORT}
📡 Accepting requests from http://localhost:3000
🔑 API key configured: ${process.env.REACT_APP_ANTHROPIC_API_KEY ? 'Yes ✅' : 'No ❌'}
  `);
});
