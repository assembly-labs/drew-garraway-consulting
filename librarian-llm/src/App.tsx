import { useCallback } from 'react';
import { SearchInput } from './components/SearchInput';
import { ConversationHistory } from './components/ConversationHistory';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ThemeToggle } from './components/ThemeToggle';
import { useCatalog } from './hooks/useCatalog';
import { useConversation } from './hooks/useConversation';
import { useClaudeChat } from './hooks/useClaudeChat';
import { Book } from './types';

function App() {
  // Load the book catalog
  const {
    catalog,
    isLoading: catalogLoading,
    error: catalogError,
    refetch: refetchCatalog
  } = useCatalog();

  // Manage conversation state
  const {
    messages,
    isLoading: conversationLoading,
    error: conversationError,
    addMessage,
    setLoading,
    setError,
    clearConversation,
    getRecentContext
  } = useConversation();

  // Claude API integration
  const { sendMessage } = useClaudeChat({
    catalog,
    onError: setError
  });

  // Handle search submission
  const handleSearch = useCallback(async (query: string) => {
    // Add user message to conversation
    addMessage(query, 'user');
    setLoading(true);

    try {
      // Get recent context for multi-turn conversation
      const context = getRecentContext(10);

      // Send to Claude API
      const { content, books } = await sendMessage(query, context);

      // Add assistant response with book recommendations
      addMessage(content, 'assistant', books);
    } catch (error) {
      // Error is already handled by the onError callback
      // Just add a fallback message
      addMessage(
        "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        'assistant'
      );
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading, setError, getRecentContext, sendMessage]);

  // Handle book actions
  const handleBookAction = useCallback((action: 'hold' | 'details', book: Book) => {
    // In a real app, this would integrate with library systems
    if (action === 'hold') {
      alert(`Demo: Placing hold on "${book.title}".\n\nIn a production system, this would connect to your library's hold system.`);
    } else if (action === 'details') {
      alert(`Demo: Viewing details for "${book.title}"\n\nTitle: ${book.title}\nAuthor: ${book.author}\nISBN: ${book.isbn}\nYear: ${book.publication_year}\n\nIn production, this would open a detailed view.`);
    }
  }, []);

  // Show loading state while catalog loads
  if (catalogLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading library catalog..." />
      </div>
    );
  }

  // Show error if catalog fails to load
  if (catalogError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md">
          <ErrorMessage
            title="Failed to load catalog"
            message={catalogError.message || "We couldn't load the book catalog. Please try again."}
            onRetry={refetchCatalog}
            type="error"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📚</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Librarian LLM
                </h1>
                <p className="text-xs text-gray-600">
                  AI-Powered Book Discovery (Prototype)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />

              {messages.length > 0 && (
                <>
                <div className="text-xs text-gray-500" title="Messages in conversation context">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                    messages.length > 20 ? 'bg-yellow-100 text-yellow-800' :
                    messages.length > 10 ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100'
                  }`}>
                    💬 {messages.length} message{messages.length !== 1 ? 's' : ''}
                    {messages.length > 20 && ' (max context)'}
                  </span>
                </div>
                <button
                  onClick={clearConversation}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900
                           border border-gray-300 rounded-md hover:bg-gray-50
                           transition-colors focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:ring-offset-2"
                  aria-label="Start new conversation"
                >
                  New Chat
                </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Conversation History */}
          <ConversationHistory
            messages={messages}
            isLoading={conversationLoading}
            onBookAction={handleBookAction}
          />

          {/* Error Message */}
          {conversationError && (
            <div className="mt-4">
              <ErrorMessage
                title="Connection Issue"
                message={conversationError}
                type="warning"
              />
            </div>
          )}
        </div>
      </main>

      {/* Search Input - Sticky Footer */}
      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <SearchInput
            onSubmit={handleSearch}
            isLoading={conversationLoading}
            placeholder="Ask me about books... (e.g., 'I want a mystery set in Paris')"
          />

          {/* Catalog Info */}
          <p className="text-center text-xs text-gray-500 mt-3">
            {catalog.length} books in mock catalog • Powered by Claude AI
          </p>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
        <p className="text-center text-xs text-yellow-800">
          ⚠️ This is a prototype demonstration. Not connected to real library systems.
        </p>
      </div>
    </div>
  );
}

export default App;