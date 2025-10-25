// Test script to verify the Claude API function
const fetch = require('node-fetch');

async function testClaudeAPI() {
  const testMessage = "Hello, can you recommend a mystery book?";
  const systemPrompt = "You are a helpful library assistant. Only recommend books from this catalog: [{\"title\": \"Test Book\", \"author\": \"Test Author\"}]";

  const url = 'http://localhost:8888/.netlify/functions/claude-chat';

  console.log('Testing Claude API at:', url);
  console.log('Sending test message:', testMessage);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: testMessage }],
        systemPrompt: systemPrompt
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Success! Response:', data);
    } else {
      console.log('❌ Error response:', responseText);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.error('Full error:', error);
  }
}

testClaudeAPI();