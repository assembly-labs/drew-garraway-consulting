import { useState, useEffect } from 'react'
import './index.css'
import { DesignSystem } from './components/DesignSystem'
import { Header } from './components/layout/Header'
import { TabBar, type TabId } from './components/layout/TabBar'
import { Dashboard } from './components/features/Dashboard'
import { SessionLogger } from './components/features/SessionLogger'
import { SessionHistory } from './components/features/SessionHistory'
import { TechniqueLibrary } from './components/features/TechniqueLibrary'
import { TrainingFeedback } from './components/features/TrainingFeedback'
import { ProfileScreen } from './components/features/ProfileScreen'
import { useUserProfile } from './context/UserProfileContext'

type View = 'stats' | 'journal' | 'library' | 'insights' | 'profile' | 'design-system'

function App() {
  // Get user profile for header avatar
  const { profile } = useUserProfile()
  const userInitial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U'

  // Track if session logger should be shown (overlay)
  const [showSessionLogger, setShowSessionLogger] = useState(true) // Auto-open on load

  // Check URL for design system mode
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#design-system') {
      return 'design-system'
    }
    return 'stats'
  })

  // Track last tab view for back navigation from profile
  const [lastTabView, setLastTabView] = useState<TabId>('stats')

  // Update URL hash when switching to/from design system
  useEffect(() => {
    if (currentView === 'design-system') {
      window.location.hash = 'design-system'
    } else if (window.location.hash === '#design-system') {
      window.location.hash = ''
    }
  }, [currentView])

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Handle navigation from child components
  const handleNavigate = (view: string) => {
    if (view === 'voice-logger' || view === 'session-logger') {
      setShowSessionLogger(true)
    } else {
      setCurrentView(view as View)
    }
  }

  // Handle session logger completion
  const handleLogComplete = () => {
    setShowSessionLogger(false)
    setCurrentView('journal') // Go to journal to see the logged session
  }

  // Handle session logger cancel
  const handleLogCancel = () => {
    setShowSessionLogger(false)
  }

  // Show Design System page
  if (currentView === 'design-system') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-gray-100)' }}>
        <Header
          title="DESIGN SYSTEM"
          showBackButton
          onBack={() => setCurrentView('stats')}
          rightAction={
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-300)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wider)',
            }}>
              v1.0
            </span>
          }
        />
        <main style={{ paddingBottom: 'var(--space-2xl)' }}>
          <DesignSystem />
        </main>
      </div>
    )
  }

  // Handle profile navigation
  const handleProfileClick = () => {
    // Only save tab views (not profile or design-system)
    const tabViews: TabId[] = ['stats', 'journal', 'library', 'insights']
    if (tabViews.includes(currentView as TabId)) {
      setLastTabView(currentView as TabId)
    }
    setCurrentView('profile')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-black)' }}>
      {/* Header - changes based on current view */}
      <Header
        title={currentView === 'profile' ? 'PROFILE' : 'BJJJ'}
        showBackButton={currentView === 'profile'}
        onBack={() => setCurrentView(lastTabView)}
        userInitial={currentView !== 'profile' ? userInitial : undefined}
        onProfileClick={currentView !== 'profile' ? handleProfileClick : undefined}
      />

      {/* Main Content */}
      <main style={{ paddingBottom: '100px' }}>
        {currentView === 'stats' && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'journal' && (
          <SessionHistory
            onLogNew={() => setShowSessionLogger(true)}
            onSelectSession={(session) => {
              // Session detail view would go here
              console.log('Selected session:', session)
            }}
          />
        )}

        {currentView === 'library' && (
          <TechniqueLibrary onOpenFeedback={() => setCurrentView('insights')} />
        )}

        {currentView === 'insights' && (
          <TrainingFeedback />
        )}

        {currentView === 'profile' && (
          <div style={{ padding: 'var(--space-lg)' }}>
            <ProfileScreen onNavigate={handleNavigate} />
          </div>
        )}
      </main>

      {/* Bottom Navigation - show last valid tab when on profile screen */}
      <TabBar
        activeTab={currentView === 'profile' ? lastTabView : currentView as TabId}
        onTabChange={(tab) => setCurrentView(tab)}
      />

      {/* Session Logger Overlay - Full Screen */}
      {showSessionLogger && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-primary)',
        }}>
          <SessionLogger
            onComplete={handleLogComplete}
            onCancel={handleLogCancel}
          />
        </div>
      )}
    </div>
  )
}

export default App
