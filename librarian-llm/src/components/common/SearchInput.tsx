import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  disabledMessage?: string;
}

const exampleQueries = [
  "Something funny for the beach",
  "Books like Educated",
  "Mystery novels set in Paris",
  "Science books for kids"
];

// Hook to detect mobile viewport
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with actual window size to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640; // Tailwind sm breakpoint
    }
    return false; // SSR fallback
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    const checkMobile = () => {
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setIsMobile(window.innerWidth < 640);
      }
    };

    // Re-check on mount in case initial state was SSR fallback
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      mountedRef.current = false; // Mark as unmounted
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return isMobile;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  onSubmit,
  isLoading,
  placeholder,
  isDisabled = false,
  disabledMessage
}) => {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute responsive placeholder
  const effectivePlaceholder = placeholder || (
    isMobile
      ? "Ask me about books..."
      : "Ask me about books... (e.g., 'I want a mystery set in Paris')"
  );

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
      {/* Session limit message */}
      {isDisabled && disabledMessage && (
        <div className="mb-3 text-center">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {disabledMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isDisabled ? "Session limit reached" : effectivePlaceholder}
            disabled={isLoading || isDisabled}
            rows={1}
            className="w-full px-5 py-3.5 pr-14 rounded-full border-2 border-gray-300 dark:border-gray-600
                     focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 resize-none overflow-auto scrollbar-hide
                     disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                     bg-white dark:bg-gray-800 focus-enhanced"
            style={{ minHeight: '48px', maxHeight: '120px', lineHeight: '1.5' }}
            aria-label="Search for books"
            aria-describedby="search-help"
          />

          <button
            type="submit"
            disabled={!query.trim() || isLoading || isDisabled}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full flex items-center justify-center
                     bg-primary-600 text-white hover:bg-primary-700 transition-colors
                     disabled:bg-gray-300 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     ${!isLoading && query.trim() && !isDisabled ? 'search-btn-pulse' : ''}`}
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

      {/* Example queries - only show when empty and not disabled */}
      {!query && !isDisabled && (
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
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};