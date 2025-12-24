import { useState, useCallback, useRef } from 'react';
import { CatalogItem, Message } from '../types';
import {
  buildSystemPrompt,
  formatConversationForAPI,
  extractBookRecommendations
} from '../utils/promptBuilder';
import { semanticSearch } from '../utils/semanticSearch';
import { analyzeIntent } from '../utils/intentAnalyzer';

interface UseClaudeChatOptions {
  catalog: CatalogItem[];
  onError?: (error: string) => void;
}

// Debounce configuration
const DEBOUNCE_DELAY = 500; // 500ms between requests

export const useClaudeChat = ({ catalog, onError }: UseClaudeChatOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const lastRequestTime = useRef<number>(0);

  const generateFallbackResponse = useCallback((
    query: string,
    catalog: CatalogItem[]
  ): { content: string; books: CatalogItem[] } => {
    // Analyze user intent
    const intent = analyzeIntent(query);

    // Perform semantic search with intent awareness
    const searchResults = semanticSearch(query, catalog, 6, intent);

    if (searchResults.length === 0) {
      return {
        content: "I'm having trouble connecting to my main service, but I can still help! Could you try rephrasing your question or being more specific about what you're looking for?",
        books: []
      };
    }

    // Create diverse recommendations based on material types
    const bookResults = searchResults.filter(item => item.itemType === 'book');
    const otherResults = searchResults.filter(item => item.itemType !== 'book');

    // Build a helpful fallback message
    let fallbackMessage = "";

    if (intent.primary === 'explore') {
      fallbackMessage = `I found some great materials related to "${query}":\n\n`;
    } else if (intent.primary === 'learn') {
      fallbackMessage = `Here are some learning resources for your journey:\n\n`;
    } else if (intent.primary === 'solve') {
      fallbackMessage = `I found these helpful resources to solve your problem:\n\n`;
    } else if (intent.primary === 'enjoy') {
      fallbackMessage = `Here are some entertaining options for you:\n\n`;
    } else {
      fallbackMessage = `Based on your interest in "${query}", I recommend:\n\n`;
    }

    // Add top 3-4 diverse results
    const displayResults = [...otherResults.slice(0, 2), ...bookResults.slice(0, 2)].slice(0, 4);

    displayResults.forEach(item => {
      const icon = item.itemType === 'book' ? '📚' :
                   item.itemType === 'dvd' ? '📀' :
                   item.itemType === 'thing' || item.itemType === 'equipment' ? '🔧' :
                   item.itemType === 'game' ? '🎮' :
                   item.itemType === 'comic' ? '📖' : '📦';

      fallbackMessage += `${icon} **${item.title}**`;
      if ('author' in item && item.author) {
        fallbackMessage += ` by ${item.author}`;
      }
      if (item.description) {
        fallbackMessage += ` - ${item.description.substring(0, 100)}...`;
      }

      // Add availability info
      if (item.formats && item.formats.length > 0) {
        const available = item.formats.find(f => f.status === 'available');
        if (available) {
          fallbackMessage += ` *Available now*`;
        }
      }
      fallbackMessage += `\n\n`;
    });

    fallbackMessage += `Would you like more details about any of these items?`;

    return {
      content: fallbackMessage,
      books: searchResults.slice(0, 6)
    };
  }, []);

  const sendMessage = useCallback(async (
    userMessage: string,
    conversationHistory: Message[],
    retryCount = 0
  ): Promise<{ content: string; books: CatalogItem[] }> => {
    // Debounce: prevent rapid-fire requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime.current;

    if (timeSinceLastRequest < DEBOUNCE_DELAY && retryCount === 0) {
      console.log('Request debounced - too soon after last request');
      // Return a promise that resolves after the debounce delay
      await new Promise(resolve => setTimeout(resolve, DEBOUNCE_DELAY - timeSinceLastRequest));
    }

    lastRequestTime.current = Date.now();
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

      // Call our secure Cloudflare Pages Function instead of directly calling Anthropic
      const response = await fetch('/api/claude-chat', {
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
        const errorData = await response.json().catch(() => ({ error: 'Unknown error', fallback: true }));

        // If server indicates fallback should be used
        if (errorData.fallback) {
          console.log('API error, using intelligent fallback');
          const fallbackResult = generateFallbackResponse(userMessage, catalog);
          setIsLoading(false);
          return fallbackResult;
        }

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
      let useFallback = false;

      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'API configuration issue';
          useFallback = true;
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          shouldRetry = retryCount < 2;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection.';
          shouldRetry = retryCount < 1;
          useFallback = !shouldRetry;
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again.';
          shouldRetry = retryCount < 1;
          useFallback = !shouldRetry;
        } else {
          errorMessage = error.message;
          useFallback = true;
        }
      }

      // Retry logic for transient errors
      if (shouldRetry && retryCount < 2) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));

        // Retry the request
        return sendMessage(userMessage, conversationHistory, retryCount + 1);
      }

      // Use intelligent fallback if API is unavailable
      if (useFallback) {
        console.log('Using intelligent semantic search fallback');
        const fallbackResult = generateFallbackResponse(userMessage, catalog);

        // Still notify about the issue but return useful results
        onError?.(`Note: Using local search. ${errorMessage}`);

        return fallbackResult;
      }

      // Pass error to error handler
      onError?.(errorMessage);

      throw new Error(errorMessage);
    }
  }, [catalog, onError, generateFallbackResponse]);

  return {
    sendMessage,
    isLoading
  };
};