import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { queryCareerBot } from '../services/claudeApi';

interface ChatInterfaceProps {
  resumeContent: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ resumeContent }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! Ask me anything about Drew's career experience, skills, or background.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for API (exclude initial greeting)
      const conversationHistory = messages
        .slice(1) // Skip initial greeting
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Call API with conversation history
      const response = await queryCareerBot(content, resumeContent, conversationHistory);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};
