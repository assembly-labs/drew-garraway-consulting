import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 p-4 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">📚</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-[300px]">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing-dot animation-delay-0"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing-dot animation-delay-200"></span>
              <span className="inline-block w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing-dot animation-delay-400"></span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 italic">
              Librarian is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};