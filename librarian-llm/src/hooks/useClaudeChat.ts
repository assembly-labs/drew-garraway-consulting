import { useState, useCallback } from 'react';
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
      // Build the system prompt with catalog context
      const systemPrompt = buildSystemPrompt(catalog);

      // Format conversation history for API
      const formattedMessages = formatConversationForAPI(conversationHistory);

      // Add the new user message
      formattedMessages.push({
        role: 'user',
        content: userMessage
      });

      // Call our secure Netlify function instead of directly calling Anthropic
      const response = await fetch('/.netlify/functions/claude-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: formattedMessages,
          systemPrompt: systemPrompt
        })
      });

      // Check if request was successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Parse the response
      const data = await response.json();
      const content = data.content || '';

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

  return {
    sendMessage,
    isLoading
  };
};