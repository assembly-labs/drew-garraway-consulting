#!/usr/bin/env node

console.log('🧪 Testing local API endpoint...\n');

const testRequest = {
  systemPrompt: "You are a helpful assistant",
  messages: [{ role: "user", content: "Say hello" }]
};

async function testAPI() {
  try {
    console.log('Sending test request to http://localhost:8888/.netlify/functions/claude-chat');

    const response = await fetch('http://localhost:8888/.netlify/functions/claude-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRequest)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ API responded successfully:', data.content?.substring(0, 50) + '...');
    } else {
      console.error('❌ API error:', data);
    }
  } catch (error) {
    console.error('❌ Failed to connect. Is the dev server running?');
    console.error('Run: npm run dev:netlify');
  }
}

testAPI();