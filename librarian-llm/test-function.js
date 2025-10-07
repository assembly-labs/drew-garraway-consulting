import Anthropic from '@anthropic-ai/sdk';

// Test the import works
console.log('Anthropic imported:', typeof Anthropic);

const testApiKey = process.env.CLAUDE_API_KEY || 'test-key';
console.log('API Key present:', !!testApiKey);

try {
  const client = new Anthropic({
    apiKey: testApiKey
  });
  console.log('Client created successfully');
} catch (error) {
  console.error('Error creating client:', error);
}
