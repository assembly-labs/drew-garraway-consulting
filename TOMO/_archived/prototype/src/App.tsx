import { useState, useEffect } from 'react'
import './index.css'
import { DesignSystem } from './components/DesignSystem'
import { Header } from './components/layout/Header'
import { TabBar, type TabId } from './components/layout/TabBar'
import { Dashboard } from './components/features/Dashboard'
import { SessionLogger } from './components/features/SessionLogger'
import { SessionHistory } from './components/features/SessionHistory'
import { SessionDetail } from './components/features/SessionDetail'
import { TechniqueLibrary } from './components/features/TechniqueLibrary'
import { TrainingFeedback } from './components/features/TrainingFeedback'
import { ProfileScreen } from './components/features/ProfileScreen'
import { Settings } from './components/features/Settings'
import { IconShowcase } from './components/features/IconShowcase'
import { Onboarding } from './components/features/Onboarding'
import { LoginScreen } from './components/features/LoginScreen'
import { useUserProfile, type OnboardingData } from './context/UserProfileContext'
import { authService } from './services/auth'
import type { JournalEntry } from './components/features/JournalEntryCard'
import type { Session } from './components/features/SessionCard'

type View = 'stats' | 'journal' | 'library' | 'insights' | 'profile' | 'settings' | 'design-system' | 'icons' | 'session-detail'

// Transform JournalEntry (V2 format) to Session (legacy format for SessionDetail)
function journalEntryToSession(entry: JournalEntry): Session {
  // Map training_type to trainingType (handle 'both' as 'openmat')
  const trainingTypeMap: Record<JournalEntry['training_type'], Session['trainingType']> = {
    gi: 'gi',
    nogi: 'nogi',
    both: 'openmat',
  };

  return {
    id: entry.id,
    date: new Date(entry.date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
    time: entry.time || '19:00',
    trainingType: trainingTypeMap[entry.training_type],
    durationMinutes: entry.duration_minutes || 60,
    techniques: entry.techniques_drilled,
    submissionsGiven: entry.submissions_given.length,
    submissionsReceived: entry.submissions_received.length,
    struggles: entry.struggles,
    workedWell: entry.worked_well,
    sparringRounds: entry.sparring_rounds || 0,
    lessonTopic: entry.lesson_topic || undefined,
    techniquesDrilled: entry.techniques_drilled,
  };
}

function App() {
  // Get user profile for header avatar
  const { profile, completeOnboarding, isLoading } = useUserProfile()
  const userInitial = profile.name ? profile.name.charAt(0).toUpperCase() : 'U'

  // Auth state: check localStorage directly for initial state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // For prototype: auto-authenticate on first visit
    // Only show LoginScreen if user has explicitly signed out
    return localStorage.getItem('bjj-signed-out') !== 'true'
  })

  // Handle successful authentication
  const handleAuthenticated = () => {
    localStorage.removeItem('bjj-signed-out')
    setIsAuthenticated(true)
  }

  // Handle sign out (called from Settings)
  const handleSignOut = async () => {
    await authService.signOut()
    localStorage.setItem('bjj-signed-out', 'true')
    setIsAuthenticated(false)
  }

  // Track if session logger should be shown (overlay)
  const [showSessionLogger, setShowSessionLogger] = useState(false)

  // Track if we should open session logger after onboarding
  const [openLoggerAfterOnboarding, setOpenLoggerAfterOnboarding] = useState(false)

  // Track selected session for detail view
  const [selectedSession, setSelectedSession] = useState<JournalEntry | null>(null)

  // Check URL for design system mode or icons
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#design-system') return 'design-system'
      if (window.location.hash === '#icons') return 'icons'
    }
    return 'stats'
  })

  // Track last tab view for back navigation from profile
  const [lastTabView, setLastTabView] = useState<TabId>('stats')

  // Update URL hash when switching to/from design system or icons
  useEffect(() => {
    if (currentView === 'design-system') {
      window.location.hash = 'design-system'
    } else if (currentView === 'icons') {
      window.location.hash = 'icons'
    } else if (window.location.hash === '#design-system' || window.location.hash === '#icons') {
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

  // Handle onboarding completion
  const handleOnboardingComplete = (data: OnboardingData) => {
    completeOnboarding(data)
    if (openLoggerAfterOnboarding) {
      setShowSessionLogger(true)
      setOpenLoggerAfterOnboarding(false)
    }
  }

  // Handle starting session logger from onboarding
  const handleStartLoggingFromOnboarding = () => {
    setOpenLoggerAfterOnboarding(true)
  }

  // Show login screen if not authenticated
  if (isAuthenticated === false) {
    return <LoginScreen onAuthenticated={handleAuthenticated} />
  }

  // Show loading state
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          color: 'var(--color-accent)',
        }}>
          TOMO
        </div>
      </div>
    )
  }

  // Show Onboarding if not complete
  if (!profile.onboardingComplete) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onStartLogging={handleStartLoggingFromOnboarding}
      />
    )
  }

  // Show Icon Showcase page
  if (currentView === 'icons') {
    return <IconShowcase onBack={() => setCurrentView('stats')} />
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
      {/* Hide header on session-detail (it has its own header) */}
      {currentView !== 'session-detail' && (
        <Header
          title={currentView === 'profile' ? 'PROFILE' : currentView === 'settings' ? 'SETTINGS' : 'TOMO'}
          showBackButton={currentView === 'profile' || currentView === 'settings'}
          onBack={() => currentView === 'settings' ? setCurrentView('profile') : setCurrentView(lastTabView)}
          userInitial={currentView !== 'profile' && currentView !== 'settings' ? userInitial : undefined}
          onProfileClick={currentView !== 'profile' && currentView !== 'settings' ? handleProfileClick : undefined}
        />
      )}

      {/* Main Content */}
      <main style={{ paddingBottom: 'calc(120px + env(safe-area-inset-bottom))' }}>
        {currentView === 'stats' && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'journal' && (
          <SessionHistory
            onLogNew={() => setShowSessionLogger(true)}
            onSelectSession={(session) => {
              setSelectedSession(session)
              setCurrentView('session-detail')
            }}
          />
        )}

        {currentView === 'session-detail' && selectedSession && (
          <SessionDetail
            session={journalEntryToSession(selectedSession)}
            onBack={() => {
              setSelectedSession(null)
              setCurrentView('journal')
            }}
          />
        )}

        {currentView === 'library' && (
          <TechniqueLibrary onOpenFeedback={() => setCurrentView('insights')} />
        )}

        {currentView === 'insights' && (
          <TrainingFeedback onLogSession={() => setShowSessionLogger(true)} />
        )}

        {currentView === 'profile' && (
          <div style={{ padding: 'var(--space-lg)' }}>
            <ProfileScreen onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'settings' && (
          <Settings onBack={() => setCurrentView('profile')} onSignOut={handleSignOut} />
        )}
      </main>

      {/* Bottom Navigation - show last valid tab when on profile/settings/session-detail screen */}
      {currentView !== 'session-detail' && (
        <TabBar
          activeTab={currentView === 'profile' || currentView === 'settings' ? lastTabView : currentView as TabId}
          onTabChange={(tab) => setCurrentView(tab)}
        />
      )}

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
