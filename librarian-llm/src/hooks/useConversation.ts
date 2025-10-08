import { useState, useCallback } from 'react';
import { Message, ConversationState } from '../types';

export const useConversation = () => {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    isLoading: false,
    error: null
  });

  // Add a new message to the conversation
  const addMessage = useCallback((content: string, role: 'user' | 'assistant', books?: any[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: new Date(),
      books
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      error: null
    }));

    return newMessage;
  }, []);

  // Set loading state
  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  // Clear conversation history
  const clearConversation = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null
    });
  }, []);

  // Get the last N messages for context
  const getRecentContext = useCallback((count: number = 10) => {
    return state.messages.slice(-count);
  }, [state.messages]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    addMessage,
    setLoading,
    setError,
    clearConversation,
    getRecentContext
  };
};