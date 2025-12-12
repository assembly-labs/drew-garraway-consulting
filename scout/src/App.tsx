import { useCallback, useState, useRef } from 'react';
import { SearchInput } from './components/common/SearchInput';
import { ConversationHistory } from './components/features/ConversationHistory';
import { ErrorMessage } from './components/common/ErrorMessage';
import { ThemeToggle } from './components/common/ThemeToggle';
import { HamburgerButton } from './components/common/HamburgerButton';
import { Sidebar } from './components/layout/Sidebar';
import { DigitalLibraryCardModal } from './components/modals/DigitalLibraryCardModal';
import { QueryLimitWarning } from './components/modals/QueryLimitWarning';
import { ItemDetailsModal } from './components/modals/ItemDetailsModal';
import { MyCheckoutsPage } from './components/pages/MyCheckoutsPage';
import { MyHoldsPage } from './components/pages/MyHoldsPage';
import { EventsPage } from './components/pages/EventsPage';
import { MyReadingHistoryPage } from './components/pages/MyReadingHistoryPage';
import { MyFinesPage } from './components/pages/MyFinesPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer } from './components/common/ToastContainer';
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

function AppContent(): JSX.Element {
  // Sidebar and modal state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLibraryCardModal, setShowLibraryCardModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>('search');
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Query limit state (resets on page refresh)
  const [queryCount, setQueryCount] = useState(0);
  const [showQueryWarning, setShowQueryWarning] = useState(false);
  const [isSessionLimitReached, setIsSessionLimitReached] = useState(false);

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
    // Check if session limit has been reached
    if (isSessionLimitReached) {
      return; // Don't process if limit reached
    }

    // Check if this is the 5th query (show warning)
    if (queryCount === 4) {
      setShowQueryWarning(true);
    }

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

      // Increment query count after successful response
      const newCount = queryCount + 1;
      setQueryCount(newCount);

      // Check if we've reached the session limit (6 queries)
      if (newCount >= 6) {
        setIsSessionLimitReached(true);
      }
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
  }, [addMessage, setLoading, setError, getRecentContext, sendMessage, queryCount, isSessionLimitReached]);

  // Handle book actions
  const handleBookAction = useCallback((action: 'hold' | 'details', book: CatalogItem) => {
    // In a real app, this would integrate with library systems
    if (action === 'hold') {
      toast.success('Hold Placed!', {
        description: `You've placed a hold on "${book.title}". You'll be notified when it's available.`
      });
    } else if (action === 'details') {
      setSelectedItem(book);
    }
  }, [toast]);

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
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-navy mb-4"></div>
          <p className="text-neutral-text">Loading library catalog...</p>
        </div>
      </div>
    );
  }

  // Show error if catalog fails to load
  if (catalogError) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-page flex flex-col">
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

      {/* Query Limit Warning Modal */}
      <QueryLimitWarning
        isOpen={showQueryWarning}
        onClose={() => setShowQueryWarning(false)}
      />

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onHold={(item) => {
          setSelectedItem(null);
          toast.success('Hold Placed!', {
            description: `You've placed a hold on "${item.title}".`
          });
        }}
      />

      {/* Header */}
      <header className="bg-navy shadow-sm border-b border-navy-700">
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
                <h1 className="text-xl font-bold text-white">
                  Scout
                </h1>
                <p className="text-xs text-navy-100">
                  Your AI Library Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />

              {messages.length > 0 && (
                <>
                <div className="text-xs text-navy-100" title="Messages in conversation context">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                    messages.length > 20 ? 'bg-coral-50 text-coral-dark border border-coral' :
                    messages.length > 10 ? 'bg-navy-50 text-navy-dark border border-navy-300' :
                    'bg-neutral-100 text-neutral-800'
                  }`}>
                    💬 {messages.length} message{messages.length !== 1 ? 's' : ''}
                    {messages.length > 20 && ' (max context)'}
                  </span>
                </div>
                <button
                  onClick={clearConversation}
                  className="px-3 py-1.5 text-sm text-white hover:text-navy-100
                           border border-navy-400 rounded-md hover:bg-navy-600
                           transition-colors focus:outline-none focus:ring-2
                           focus:ring-white focus:ring-offset-2 focus:ring-offset-navy btn-enhanced"
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
            <div className="bg-surface rounded-2xl shadow-2xl border border-neutral-300 p-4 dark:bg-navy-800 dark:border-navy-700 glass-effect backdrop-blur-xl">
              <SearchInput
                onSubmit={handleSearch}
                isLoading={conversationLoading}
                isDisabled={isSessionLimitReached}
                disabledMessage="Session limit reached."
              />

              {/* Catalog Info */}
              <p className="text-center text-xs text-neutral-text mt-3 dark:text-neutral-400">
                {catalog.length} items in catalog • Powered by Claude AI
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main App component wrapped with ToastProvider
function App(): JSX.Element {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;