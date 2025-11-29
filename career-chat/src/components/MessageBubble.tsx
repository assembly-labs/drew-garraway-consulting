import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`message-container ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-bubble">
        <p>{message.content}</p>
        <span className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};
