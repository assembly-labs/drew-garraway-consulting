import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { formatDate } from '../utils/formatters';
import { ResultsList } from './ResultsList';

interface ConversationHistoryProps {
  messages: Message[];
  isLoading?: boolean;
  onBookAction?: (action: 'hold' | 'details', book: any) => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  isLoading,
  onBookAction
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Parse assistant messages to extract book recommendations
  const parseMessage = (message: Message) => {
    // For now, just return the content
    // In a real implementation, we'd parse the book recommendations
    return (
      <div className="whitespace-pre-wrap">{message.content}</div>
    );
  };

  return (
    <div
      className="flex flex-col space-y-4 pb-4"
      role="log"
      aria-label="Conversation history"
      aria-live="polite"
    >
      {/* Welcome message if no messages */}
      {messages.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="mb-4">
            <span className="text-6xl">👋</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome to Library Book Discovery!
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            I'm here to help you find your next great read. Just describe what you're looking for,
            and I'll recommend books from our catalog.
          </p>
        </div>
      )}

      {/* Message history */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
        >
          <div
            className={`relative max-w-[85%] md:max-w-[70%] ${
              message.role === 'user'
                ? 'message-user'
                : 'message-assistant'
            } message-bubble`}
          >
            {/* Message header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium">
                {message.role === 'user' ? 'You' : '📚 Library Assistant'}
              </span>
              <time className="text-xs text-gray-500" dateTime={message.timestamp.toISOString()}>
                {formatDate(message.timestamp)}
              </time>
            </div>

            {/* Message content */}
            <div className="text-sm md:text-base">
              {message.role === 'assistant' && message.books && message.books.length > 0 ? (
                <div>
                  <div className="mb-4">{message.content}</div>
                  <ResultsList
                    books={message.books}
                    onBookAction={onBookAction}
                    title=""
                  />
                </div>
              ) : (
                parseMessage(message)
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Loading indicator with typing effect */}
      {isLoading && (
        <div className="flex justify-start animate-slide-up">
          <div className="message-assistant message-bubble relative">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">📚 Library Assistant</span>
              <div className="flex space-x-1">
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Searching through the catalog...</div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};