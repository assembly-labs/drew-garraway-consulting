import { useCallback, useState, useRef } from 'react';
import { SearchInput } from './components/SearchInput';
import { ConversationHistory } from './components/ConversationHistory';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ThemeToggle } from './components/ThemeToggle';
import { HamburgerButton } from './components/HamburgerButton';
import { Sidebar } from './components/Sidebar';
import { DigitalLibraryCardModal } from './components/DigitalLibraryCardModal';
import { MyCheckoutsPage } from './components/MyCheckoutsPage';
import { MyHoldsPage } from './components/MyHoldsPage';
import { EventsPage } from './components/EventsPage';
import { MyReadingHistoryPage } from './components/MyReadingHistoryPage';
import { MyFinesPage } from './components/MyFinesPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { ToastProvider } from './contexts/ToastContext';
import { useToast } from './hooks/useToast';
import { useCatalog } from './hooks/useCatalog';
import { useConversation } from './hooks/useConversation';
import { useClaudeChat } from './hooks/useClaudeChat';
import { useHolds } from './hooks/useHolds';
import { useFines } from './hooks/useFines';
import { CatalogItem } from './types';
import { mockCheckouts } from './data/mockCheckouts';

type PageView = 'search' | 'checkouts' | 'holds' | 'events' | 'history' | 'fines';

function AppContent() {
  // Sidebar and modal state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLibraryCardModal, setShowLibraryCardModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('search');
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Dynamic badge counts
  const { totalCount: holdsCount } = useHolds();
  const { totalOutstanding: finesAmount } = useFines();

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
  const handleBookAction = useCallback((action: 'hold' | 'details', book: CatalogItem) => {
    // In a real app, this would integrate with library systems
    if (action === 'hold') {
      alert(`Demo: Placing hold on "${book.title}".\n\nIn a production system, this would connect to your library's hold system.`);
    } else if (action === 'details') {
      const creator = 'author' in book ? book.author :
                       'director' in book ? book.director :
                       'developer' in book ? book.developer : 'Unknown';
      const year = 'publication_year' in book ? book.publication_year :
                   'release_year' in book ? book.release_year : 'N/A';
      const isbn = 'isbn' in book ? book.isbn : 'N/A';
      alert(`Demo: Viewing details for "${book.title}"\n\nTitle: ${book.title}\nCreator: ${creator}\nISBN/ID: ${isbn}\nYear: ${year}\nType: ${book.itemType}\n\nIn production, this would open a detailed view.`);
    }
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Handle sidebar close - return focus to hamburger button
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
    // Return focus to hamburger button
    setTimeout(() => hamburgerButtonRef.current?.focus(), 100);
  }, []);

  // Handle sidebar menu item clicks
  const handleSidebarMenuClick = useCallback((itemId: string) => {
    // Handle specific menu items
    switch (itemId) {
      case 'digital-library-card':
        setShowLibraryCardModal(true);
        break;
      case 'search':
        setCurrentPage('search');
        break;
      case 'my-checkouts':
        setCurrentPage('checkouts');
        break;
      case 'my-reading-history':
        setCurrentPage('history');
        break;
      case 'my-holds':
        setCurrentPage('holds');
        break;
      case 'my-fines':
        setCurrentPage('fines');
        break;
      case 'events-calendar':
        setCurrentPage('events');
        break;
      case 'settings':
        toast.info('Settings', {
          description: 'Settings coming soon. This will allow you to customize your library experience.'
        });
        break;
      case 'help':
        toast.info('Help', {
          description: 'Help documentation coming soon. This will provide guides and FAQs.'
        });
        break;
      default:
        // Unknown menu item - no action needed
    }
  }, [toast]);

  // Handle library card modal actions
  const handleLibraryCardAction = useCallback((action: string) => {
    if (action === 'save') {
      toast.info('Feature coming soon!', {
        description: 'Save to device will be available in production.'
      });
    } else if (action === 'wallet') {
      toast.info('Feature coming soon!', {
        description: 'Apple Wallet integration will be available in production.'
      });
    }
  }, [toast]);

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

  // Helper function to return to search
  const resetToSearch = () => {
    setCurrentPage('search');
  };

  // If showing any specialized page, render it instead of main app
  if (currentPage === 'checkouts') {
    return (
      <>
        <ErrorBoundary>
          <MyCheckoutsPage onClose={resetToSearch} />
        </ErrorBoundary>
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'holds') {
    return (
      <>
        <ErrorBoundary>
          <MyHoldsPage onClose={resetToSearch} />
        </ErrorBoundary>
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'events') {
    return (
      <>
        <ErrorBoundary>
          <EventsPage onClose={resetToSearch} />
        </ErrorBoundary>
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'history') {
    return (
      <>
        <ErrorBoundary>
          <MyReadingHistoryPage onClose={resetToSearch} />
        </ErrorBoundary>
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'fines') {
    return (
      <>
        <ErrorBoundary>
          <MyFinesPage onClose={resetToSearch} />
        </ErrorBoundary>
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast Container */}
      <ToastContainer />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        onMenuItemClick={handleSidebarMenuClick}
        checkoutsCount={mockCheckouts.length}
        holdsCount={holdsCount}
        finesAmount={finesAmount}
      />

      {/* Digital Library Card Modal */}
      <DigitalLibraryCardModal
        isOpen={showLibraryCardModal}
        onClose={() => setShowLibraryCardModal(false)}
        onAction={handleLibraryCardAction}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div ref={hamburgerButtonRef as any}>
                <HamburgerButton
                  isOpen={sidebarOpen}
                  onClick={toggleSidebar}
                />
              </div>
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
                           focus:ring-primary-500 focus:ring-offset-2 btn-enhanced"
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

          {/* Search Module - flows with content */}
          <div className="mt-6 mb-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700 glass-effect backdrop-blur-xl">
              <SearchInput
                onSubmit={handleSearch}
                isLoading={conversationLoading}
              />

              {/* Catalog Info */}
              <p className="text-center text-xs text-gray-500 mt-3 dark:text-gray-400">
                {catalog.length} books in mock catalog • Powered by Claude AI
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App component wrapped with ToastProvider
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;