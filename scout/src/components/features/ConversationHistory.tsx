import React, { useEffect, useRef } from 'react';
import { Message, CatalogItem } from '../../types';
import { formatDate } from '../../utils/formatters';
import { ResultsList } from './ResultsList';
import { TypingIndicator } from '../common/TypingIndicator';

interface ConversationHistoryProps {
  messages: Message[];
  isLoading?: boolean;
  onBookAction?: (action: 'hold' | 'details', book: CatalogItem) => void;
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
          <h2 className="text-2xl font-semibold text-navy-900 dark:text-neutral-100 mb-2">
            Welcome to Library Book Discovery!
          </h2>
          <p className="text-neutral-text dark:text-neutral-300 max-w-md mx-auto">
            I'm here to help you find your next great read. Just describe what you're looking for,
            and I'll recommend books from our catalog.
          </p>
        </div>
      )}

      {/* Message history */}
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
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
              <time className="text-xs text-neutral-500 dark:text-neutral-400" dateTime={message.timestamp.toISOString()}>
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
      {isLoading && <TypingIndicator />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};