import { useState, useEffect } from 'react'
import './index.css'
import { DesignSystem } from './components/DesignSystem'
import { Header } from './components/layout/Header'
import { TabBar, type TabId } from './components/layout/TabBar'
import { Dashboard } from './components/features/Dashboard'
import { VoiceLogger } from './components/features/VoiceLogger'
import { SessionHistory } from './components/features/SessionHistory'

type View = 'dashboard' | 'journal' | 'progress' | 'library' | 'profile' | 'design-system'

function App() {
  // Track if voice logger should be shown (overlay)
  const [showVoiceLogger, setShowVoiceLogger] = useState(true) // Auto-open on load

  // Check URL for design system mode
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#design-system') {
      return 'design-system'
    }
    return 'dashboard'
  })

  // Update URL hash when switching to/from design system
  useEffect(() => {
    if (currentView === 'design-system') {
      window.location.hash = 'design-system'
    } else if (window.location.hash === '#design-system') {
      window.location.hash = ''
    }
  }, [currentView])

  // Handle navigation from child components
  const handleNavigate = (view: string) => {
    if (view === 'voice-logger') {
      setShowVoiceLogger(true)
    } else {
      setCurrentView(view as View)
    }
  }

  // Handle voice logger completion
  const handleLogComplete = () => {
    setShowVoiceLogger(false)
    setCurrentView('journal') // Go to journal to see the logged session
  }

  // Handle voice logger cancel
  const handleLogCancel = () => {
    setShowVoiceLogger(false)
  }

  // Show Design System page
  if (currentView === 'design-system') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-gray-100)' }}>
        <Header
          title="DESIGN SYSTEM"
          showBackButton
          onBack={() => setCurrentView('dashboard')}
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-gray-100)' }}>
      {/* Header */}
      <Header
        title="BJJ JOURNAL"
        rightAction={
          <button
            onClick={() => setCurrentView('design-system')}
            style={{
              background: 'none',
              border: '1px solid var(--color-gray-600)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 8px',
              color: 'var(--color-gray-300)',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: 'var(--tracking-wide)',
            }}
            title="View Design System"
          >
            DS
          </button>
        }
      />

      {/* Main Content */}
      <main style={{ padding: 'var(--space-lg)', paddingBottom: '100px' }}>
        {currentView === 'dashboard' && (
          <Dashboard onNavigate={handleNavigate} />
        )}

        {currentView === 'journal' && (
          <SessionHistory
            onLogNew={() => setShowVoiceLogger(true)}
            onSelectSession={(session) => {
              // Session detail view would go here
              console.log('Selected session:', session)
            }}
          />
        )}

        {currentView === 'progress' && (
          <div className="card">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>BELT PROGRESS</h2>
            <p className="text-muted">Belt progress tracking coming soon...</p>
            <p className="text-small text-muted">This screen will show IBJJF requirements, technique proficiency, and coach feedback.</p>
          </div>
        )}

        {currentView === 'library' && (
          <div className="card">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>TECHNIQUE LIBRARY</h2>
            <p className="text-muted">Technique library coming soon...</p>
            <p className="text-small text-muted">Browse, search, and track your proficiency across all techniques.</p>
          </div>
        )}

        {currentView === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* Profile Header */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-gray-300)',
                margin: '0 auto var(--space-md)'
              }}></div>
              <h2 style={{ marginBottom: 'var(--space-xs)' }}>TONY CHEN</h2>
              <div className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>Training since March 2022</div>
              <span className="belt-badge belt-blue" style={{ margin: '0 auto' }}>
                <span className="belt-stripes">
                  <span className="belt-stripe"></span>
                  <span className="belt-stripe"></span>
                </span>
              </span>
            </div>

            {/* Stats */}
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Training Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-md)' }}>
                <div>
                  <div className="stat-label">Total Sessions</div>
                  <div className="stat-value">247</div>
                </div>
                <div>
                  <div className="stat-label">Total Hours</div>
                  <div className="stat-value">312</div>
                </div>
              </div>
            </div>

            {/* Belt System */}
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Belt Journey</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  { name: 'White', class: 'belt-white', stripes: 4, completed: true },
                  { name: 'Blue', class: 'belt-blue', stripes: 2, current: true },
                  { name: 'Purple', class: 'belt-purple', stripes: 0, future: true },
                  { name: 'Brown', class: 'belt-brown', stripes: 0, future: true },
                  { name: 'Black', class: 'belt-black', stripes: 0, future: true },
                ].map((belt) => (
                  <div key={belt.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    opacity: belt.future ? 0.4 : 1,
                  }}>
                    <span className={`belt-badge ${belt.class}`}>
                      {belt.stripes > 0 && (
                        <span className="belt-stripes">
                          {Array.from({ length: belt.stripes }).map((_, i) => (
                            <span key={i} className="belt-stripe"></span>
                          ))}
                        </span>
                      )}
                    </span>
                    <span>{belt.name} Belt</span>
                    {belt.current && (
                      <span className="status-badge status-success" style={{ marginLeft: 'auto' }}>Current</span>
                    )}
                    {belt.completed && !belt.current && (
                      <span className="text-small text-muted" style={{ marginLeft: 'auto' }}>Sep 2023</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <TabBar
        activeTab={currentView as TabId}
        onTabChange={(tab) => setCurrentView(tab)}
      />

      {/* Voice Logger Overlay - Full Screen */}
      {showVoiceLogger && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          backgroundColor: 'var(--color-primary)',
        }}>
          <VoiceLogger
            onComplete={handleLogComplete}
            onCancel={handleLogCancel}
          />
        </div>
      )}
    </div>
  )
}

export default App
