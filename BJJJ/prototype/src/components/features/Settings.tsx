/**
 * Settings Component
 *
 * App settings including:
 * - Preferences (logging, notifications)
 * - Account management
 * - App info (version, legal, support)
 */

import { useState } from 'react';
import { useUserProfile, type LoggingPreference, type BeltLevel } from '../../context/UserProfileContext';

interface SettingsProps {
  onBack: () => void;
}

// Belt options for the demo switcher
const BELT_OPTIONS: { value: BeltLevel; label: string; color: string }[] = [
  { value: 'white', label: 'White', color: 'var(--color-belt-white)' },
  { value: 'blue', label: 'Blue', color: 'var(--color-belt-blue)' },
  { value: 'purple', label: 'Purple', color: 'var(--color-belt-purple)' },
  { value: 'brown', label: 'Brown', color: 'var(--color-belt-brown)' },
  { value: 'black', label: 'Black', color: 'var(--color-belt-black)' },
];

export function Settings({ onBack }: SettingsProps) {
  const { profile, setLoggingPreference, updateProfile } = useUserProfile();

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
    a.download = 'ally-export.json';
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
                  label="Type"
                  selected={profile.loggingPreference === 'type'}
                  onClick={() => handleLoggingPrefChange('type')}
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

        {/* Developer Tools Section */}
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
            Developer Tools
          </h2>

          <div style={{
            backgroundColor: 'var(--color-gray-900)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            border: '1px dashed var(--color-gray-600)',
          }}>
            <div style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-white)',
              fontWeight: 500,
              marginBottom: 'var(--space-xs)',
            }}>
              Demo Belt Level
            </div>
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginBottom: 'var(--space-lg)',
            }}>
              Switch belts to see how the app personalizes the experience
            </div>

            <div style={{
              display: 'flex',
              gap: 'var(--space-sm)',
              flexWrap: 'wrap',
            }}>
              {BELT_OPTIONS.map((option) => {
                const isSelected = profile.belt === option.value;
                const isWhiteBelt = option.value === 'white';

                return (
                  <button
                    key={option.value}
                    onClick={() => updateProfile({ belt: option.value })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-xs)',
                      padding: 'var(--space-md)',
                      backgroundColor: isSelected ? 'rgba(252, 211, 77, 0.15)' : 'var(--color-gray-800)',
                      border: isSelected
                        ? '2px solid var(--color-accent)'
                        : '2px solid transparent',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      minWidth: 56,
                    }}
                    aria-label={`Switch to ${option.label} belt`}
                    aria-pressed={isSelected}
                  >
                    {/* Belt visual */}
                    <div style={{
                      width: 48,
                      height: 12,
                      backgroundColor: option.color,
                      borderRadius: 2,
                      border: isWhiteBelt ? '1px solid var(--color-gray-400)' : 'none',
                      boxShadow: isSelected ? '0 0 8px rgba(252, 211, 77, 0.4)' : 'none',
                    }} />

                    {/* Label */}
                    <span style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? 'var(--color-accent)' : 'var(--color-gray-400)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {option.label}
                    </span>

                    {/* Selected indicator */}
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="3"
                        style={{ marginTop: -4 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{
              marginTop: 'var(--space-lg)',
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-gray-800)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              textAlign: 'center',
            }}>
              Currently viewing as: <strong style={{ color: 'var(--color-white)' }}>{profile.belt.charAt(0).toUpperCase() + profile.belt.slice(1)} Belt</strong>
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
