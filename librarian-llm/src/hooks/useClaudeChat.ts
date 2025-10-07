import { useState, useCallback } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { Book, Message } from '../types';
import {
  buildSystemPrompt,
  formatConversationForAPI,
  extractBookRecommendations
} from '../utils/promptBuilder';

interface UseClaudeChatOptions {
  catalog: Book[];
  onError?: (error: string) => void;
}

export const useClaudeChat = ({ catalog, onError }: UseClaudeChatOptions) => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (
    userMessage: string,
    conversationHistory: Message[],
    retryCount = 0
  ): Promise<{ content: string; books: Book[] }> => {
    setIsLoading(true);

    try {
      // Check if API key exists
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      if (!apiKey) {
        throw new Error('Claude API key not configured. Please add VITE_CLAUDE_API_KEY to your .env file.');
      }

      // Initialize Claude client
      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true // Acceptable for prototype
      });

      // Build the system prompt with catalog context
      const systemPrompt = buildSystemPrompt(catalog);

      // Format conversation history for API
      const formattedMessages = formatConversationForAPI(conversationHistory);

      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: userMessage
      });

      // Make API call to Claude
      const response = await client.messages.create({
        model: 'claude-3-haiku-20240307', // Testing with Haiku model
        max_tokens: 1500,
        temperature: 0.3, // Lower temperature for more consistent responses
        system: systemPrompt,
        messages: formattedMessages,
      });

      // Extract the text content from response
      const content = response.content[0].type === 'text'
        ? response.content[0].text
        : '';

      // Extract book recommendations from the response
      const recommendedBooks = extractBookRecommendations(content, catalog);

      setIsLoading(false);
      return { content, books: recommendedBooks };

    } catch (error) {
      setIsLoading(false);

      let errorMessage = 'An unexpected error occurred';
      let shouldRetry = false;

      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'API key issue: ' + error.message;
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          shouldRetry = retryCount < 2;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.';
          shouldRetry = retryCount < 2;
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
          shouldRetry = retryCount < 2;
        } else {
          errorMessage = error.message;
        }
      }

      // Retry logic for transient errors
      if (shouldRetry && retryCount < 2) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));

        // Retry the request
        return sendMessage(userMessage, conversationHistory, retryCount + 1);
      }

      // Log error for debugging (kept for production debugging)
      console.error('Claude API Error:', error);
      onError?.(errorMessage);

      throw new Error(errorMessage);
    }
  }, [catalog, onError]);

  // Stream response for better UX (optional enhancement)
  const streamMessage = useCallback(async (
    userMessage: string,
    conversationHistory: Message[],
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;
      if (!apiKey) {
        throw new Error('Claude API key not configured');
      }

      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      const systemPrompt = buildSystemPrompt(catalog);
      const formattedMessages = formatConversationForAPI(conversationHistory);
      formattedMessages.push({ role: 'user', content: userMessage });

      const stream = await client.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        temperature: 0.3,
        system: systemPrompt,
        messages: formattedMessages,
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          const text = chunk.delta.text;
          fullContent += text;
          onChunk(text);
        }
      }

      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);
      console.error('Claude streaming error:', error);
      onError?.(error instanceof Error ? error.message : 'Streaming failed');
      throw error;
    }
  }, [catalog, onError]);

  return {
    sendMessage,
    streamMessage,
    isLoading
  };
};