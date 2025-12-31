/**
 * Settings Component
 *
 * App settings including:
 * - Preferences (logging, notifications)
 * - Account management
 * - App info (version, legal, support)
 * - Demo profile switcher for prototype approval
 */

import { useState } from 'react';
import { useUserProfile, type LoggingPreference } from '../../context/UserProfileContext';
import { PERSONA_OPTIONS } from '../../data/personas';

interface SettingsProps {
  onBack: () => void;
}

// Belt color mapping for persona display
const BELT_COLORS: Record<string, string> = {
  white: 'var(--color-belt-white)',
  blue: 'var(--color-belt-blue)',
  purple: 'var(--color-belt-purple)',
  brown: 'var(--color-belt-brown)',
};

// Risk level colors
const RISK_COLORS: Record<string, string> = {
  'very-low': 'var(--color-success)',
  'low': 'var(--color-success)',
  'moderate': 'var(--color-warning)',
  'high': 'var(--color-error)',
  'critical': 'var(--color-error)',
};

export function Settings({ onBack }: SettingsProps) {
  const { profile, setLoggingPreference, isDemoMode, activeDemoProfile, activePersona, switchPersona, exitDemoMode } = useUserProfile();

  // Local state for toggles (would connect to a settings context in production)
  const [notifications, setNotifications] = useState({
    trainingReminders: true,
    progressUpdates: true,
    coachFeedback: true,
  });

  const handleLoggingPrefChange = (pref: LoggingPreference) => {
    setLoggingPreference(pref);
  };

  const handleExportData = () => {
    // In production, this would trigger a data export
    const data = {
      profile: profile,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bjjj-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-gray-100)',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        padding: 'var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-white)',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
            margin: 'calc(-1 * var(--space-sm))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-lg)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Settings
        </h1>
      </header>

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

        {/* Preferences Section */}
        <section>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-md)',
          }}>
            Preferences
          </h2>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Logging Preference */}
            <SettingsRow
              label="Default Logging Method"
              description="How you prefer to log training sessions"
            >
              <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                <ToggleChip
                  label="Voice"
                  selected={profile.loggingPreference === 'voice'}
                  onClick={() => handleLoggingPrefChange('voice')}
                />
                <ToggleChip
                  label="Text"
                  selected={profile.loggingPreference === 'text'}
                  onClick={() => handleLoggingPrefChange('text')}
                />
              </div>
            </SettingsRow>

            <Divider />

            {/* Training Reminders */}
            <SettingsRow
              label="Training Reminders"
              description="Get reminded to log your sessions"
            >
              <Toggle
                checked={notifications.trainingReminders}
                onChange={(checked) => setNotifications(prev => ({ ...prev, trainingReminders: checked }))}
              />
            </SettingsRow>

            <Divider />

            {/* Progress Updates */}
            <SettingsRow
              label="Progress Updates"
              description="Weekly summaries and milestone alerts"
            >
              <Toggle
                checked={notifications.progressUpdates}
                onChange={(checked) => setNotifications(prev => ({ ...prev, progressUpdates: checked }))}
              />
            </SettingsRow>

            <Divider />

            {/* Coach Feedback */}
            <SettingsRow
              label="Coach Feedback"
              description="Notifications when coach leaves feedback"
            >
              <Toggle
                checked={notifications.coachFeedback}
                onChange={(checked) => setNotifications(prev => ({ ...prev, coachFeedback: checked }))}
              />
            </SettingsRow>
          </div>
        </section>

        {/* Account Section */}
        <section>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-md)',
          }}>
            Account
          </h2>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <SettingsButton
              label="Export Your Data"
              description="Download all your training data"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              }
              onClick={handleExportData}
            />

            <Divider />

            <SettingsButton
              label="Delete Account"
              description="Permanently remove all your data"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              }
              onClick={() => {
                if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                  alert('Account deletion would be processed here in production.');
                }
              }}
              danger
            />
          </div>
        </section>

        {/* App Info Section */}
        <section>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-md)',
          }}>
            App Info
          </h2>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <SettingsButton
              label="Privacy Policy"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              onClick={() => alert('Privacy policy would open here.')}
            />

            <Divider />

            <SettingsButton
              label="Terms of Service"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              }
              onClick={() => alert('Terms of service would open here.')}
            />

            <Divider />

            <SettingsButton
              label="Contact Support"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
              onClick={() => alert('Support contact would open here.')}
            />

            <Divider />

            <div style={{
              padding: 'var(--space-md) var(--space-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-sm)' }}>
                Version
              </span>
              <span style={{ color: 'var(--color-gray-700)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                1.0.0 (Prototype)
              </span>
            </div>
          </div>
        </section>

        {/* Demo Mode Section */}
        <section>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-widest)',
            color: 'var(--color-gray-500)',
            marginBottom: 'var(--space-md)',
          }}>
            Demo Mode
          </h2>

          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            border: isDemoMode ? '2px solid var(--color-accent)' : '1px dashed var(--color-gray-600)',
          }}>
            {/* Demo Mode Status Banner */}
            {isDemoMode && (
              <div style={{
                backgroundColor: activePersona?.riskLevel === 'critical' || activePersona?.riskLevel === 'high'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(252, 211, 77, 0.15)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: activePersona?.riskLevel === 'critical' || activePersona?.riskLevel === 'high'
                      ? 'var(--color-error)'
                      : 'var(--color-accent)',
                  }}>
                    {activePersona ? `${activePersona.archetype}` : 'Demo Mode Active'}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: 2 }}>
                    Viewing as {activePersona?.displayName || activeDemoProfile?.displayName}
                  </div>
                </div>
                <button
                  onClick={exitDemoMode}
                  style={{
                    padding: 'var(--space-xs) var(--space-sm)',
                    backgroundColor: 'var(--color-gray-700)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-white)',
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                  }}
                >
                  Exit Demo
                </button>
              </div>
            )}

            <div style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-white)',
              fontWeight: 500,
              marginBottom: 'var(--space-xs)',
            }}>
              Preview Persona Experiences
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginBottom: 'var(--space-lg)',
            }}>
              Load complete mock profiles to preview personalization for different user archetypes and risk levels
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-sm)',
            }}>
              {PERSONA_OPTIONS.map((option) => {
                const isSelected = isDemoMode && activePersona?.key === option.value;
                const isWhiteBelt = option.belt === 'white';
                const isAtRisk = option.riskLevel === 'high' || option.riskLevel === 'critical';

                return (
                  <button
                    key={option.value}
                    onClick={() => switchPersona(option.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-xs)',
                      padding: 'var(--space-md)',
                      backgroundColor: isSelected ? 'rgba(252, 211, 77, 0.15)' : 'var(--color-gray-800)',
                      border: isSelected
                        ? '2px solid var(--color-accent)'
                        : isAtRisk
                          ? '1px solid rgba(239, 68, 68, 0.4)'
                          : '2px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={`Preview ${option.label} persona: ${option.name}`}
                    aria-pressed={isSelected}
                  >
                    {/* Belt visual */}
                    <div style={{
                      width: 56,
                      height: 14,
                      backgroundColor: BELT_COLORS[option.belt],
                      borderRadius: 2,
                      border: isWhiteBelt ? '1px solid var(--color-gray-400)' : 'none',
                      boxShadow: isSelected ? '0 0 8px rgba(252, 211, 77, 0.4)' : 'none',
                    }} />

                    {/* Status Label */}
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? 'var(--color-accent)' : 'var(--color-white)',
                      letterSpacing: '0.02em',
                    }}>
                      {option.label}
                    </span>

                    {/* Persona Name */}
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-gray-400)',
                    }}>
                      {option.name}
                    </span>

                    {/* Risk indicator */}
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: RISK_COLORS[option.riskLevel] || 'var(--color-gray-500)',
                      marginTop: 'var(--space-xs)',
                      fontWeight: 500,
                    }}>
                      {option.riskLevel === 'critical' ? 'Critical Risk' :
                       option.riskLevel === 'high' ? 'High Risk' :
                       option.riskLevel === 'moderate' ? 'Moderate Risk' :
                       option.riskLevel === 'low' ? 'Low Risk' : 'Very Low Risk'}
                    </div>

                    {/* Selected indicator */}
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="3"
                        style={{ marginTop: 2 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Profile Details */}
            {isDemoMode && activeDemoProfile && (
              <div style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-gray-800)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Active Persona
                  </div>
                  {activePersona && (
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: RISK_COLORS[activePersona.riskLevel] || 'var(--color-gray-400)',
                      fontWeight: 600,
                      padding: '2px 8px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      {activePersona.archetype}
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)', fontSize: 'var(--text-sm)' }}>
                  <div>
                    <span style={{ color: 'var(--color-gray-400)' }}>Sessions: </span>
                    <span style={{ color: 'var(--color-white)' }}>{activeDemoProfile.trainingStats.totalSessions}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-gray-400)' }}>Hours: </span>
                    <span style={{ color: 'var(--color-white)' }}>{activeDemoProfile.trainingStats.totalHours}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-gray-400)' }}>Streak: </span>
                    <span style={{ color: activeDemoProfile.trainingStats.currentStreak === 0 ? 'var(--color-error)' : 'var(--color-white)' }}>
                      {activeDemoProfile.trainingStats.currentStreak} {activeDemoProfile.trainingStats.currentStreak === 0 ? '(broken)' : 'days'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-gray-400)' }}>Win Rate: </span>
                    <span style={{ color: 'var(--color-white)' }}>
                      {Math.round((activeDemoProfile.trainingStats.sparringRecord.wins /
                        (activeDemoProfile.trainingStats.sparringRecord.wins +
                         activeDemoProfile.trainingStats.sparringRecord.losses +
                         activeDemoProfile.trainingStats.sparringRecord.draws)) * 100)}%
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>
                  {activeDemoProfile.journalEntries.length} journal entries loaded
                </div>
              </div>
            )}

            <div style={{
              marginTop: 'var(--space-lg)',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-gray-800)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textAlign: 'center',
            }}>
              {isDemoMode && activePersona ? (
                <>Viewing as: <strong style={{ color: 'var(--color-accent)' }}>{activePersona.displayName}</strong> ({profile.belt.charAt(0).toUpperCase() + profile.belt.slice(1)} Belt, {activePersona.status})</>
              ) : isDemoMode ? (
                <>Currently viewing as: <strong style={{ color: 'var(--color-accent)' }}>{activeDemoProfile?.user.firstName} {activeDemoProfile?.user.lastName}</strong> ({profile.belt.charAt(0).toUpperCase() + profile.belt.slice(1)} Belt {profile.stripes} Stripes)</>
              ) : (
                <>Your profile: <strong style={{ color: 'var(--color-white)' }}>{profile.name || 'Not set'}</strong> ({profile.belt.charAt(0).toUpperCase() + profile.belt.slice(1)} Belt)</>
              )}
            </div>
          </div>
        </section>

        {/* Bottom spacing */}
        <div style={{ height: 'var(--space-xl)' }} />
      </div>
    </div>
  );
}

// Sub-components

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      padding: 'var(--space-md) var(--space-lg)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-md)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-gray-800)', fontWeight: 500 }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function SettingsButton({
  label,
  description,
  icon,
  onClick,
  danger,
}: {
  label: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: 'var(--space-md) var(--space-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{ color: danger ? 'var(--color-error)' : 'var(--color-gray-500)' }}>
        {icon}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 'var(--text-base)',
          color: danger ? 'var(--color-error)' : 'var(--color-gray-800)',
          fontWeight: 500,
        }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 52,
        height: 32,
        borderRadius: 'var(--radius-full)',
        backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-gray-300)',
        border: 'none',
        padding: 4,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start',
      }}
      role="switch"
      aria-checked={checked}
    >
      <span style={{
        width: 24,
        height: 24,
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-white)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease',
      }} />
    </button>
  );
}

function ToggleChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 'var(--space-xs) var(--space-md)',
        borderRadius: 'var(--radius-full)',
        backgroundColor: selected ? 'var(--color-accent)' : 'var(--color-gray-200)',
        color: selected ? 'var(--color-primary)' : 'var(--color-gray-600)',
        border: 'none',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div style={{
      height: 1,
      backgroundColor: 'var(--color-gray-200)',
      marginLeft: 'var(--space-lg)',
    }} />
  );
}

export default Settings;
