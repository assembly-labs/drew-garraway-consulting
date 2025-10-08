import React, { useState, useRef, KeyboardEvent } from 'react';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const exampleQueries = [
  "Something funny for the beach",
  "Books like Educated",
  "Mystery novels set in Paris",
  "Science books for kids"
];

export const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  isLoading,
  placeholder = "Ask me anything about books..."
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery && !isLoading) {
      onSubmit(trimmedQuery);
      setQuery('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all ${isFocused ? 'ring-2 ring-primary-500' : ''} rounded-full`}>
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full px-5 py-3 pr-12 rounded-full border-2 border-gray-300 dark:border-gray-600
                     focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 resize-none
                     disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                     bg-white dark:bg-gray-800 focus-enhanced"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            aria-label="Search for books"
            aria-describedby="search-help"
          />

          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                     bg-primary-600 text-white hover:bg-primary-700 transition-colors
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     ${!isLoading && query.trim() ? 'search-btn-pulse' : ''}`}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        <div id="search-help" className="sr-only">
          Type a natural language query to search for books. Press Enter to send or Shift+Enter for a new line.
        </div>
      </form>

      {/* Example queries - only show when empty */}
      {!query && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-300 rounded-full transition-colors
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
              type="button"
            >
              "{example}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
};