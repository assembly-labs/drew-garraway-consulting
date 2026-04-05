/**
 * GymPicker Component
 *
 * A searchable gym selector for onboarding with:
 * - Search mode: Type to filter gyms in real-time
 * - Browse mode: Scroll through gyms grouped by affiliation
 * - Manual entry: "My gym isn't listed" opens form for custom entry
 */

import { useState, useMemo } from 'react';
import { Icons } from './Icons';
import {
  type Gym,
  type GymSelection,
  GYM_DATABASE,
  AFFILIATIONS,
  searchGyms,
  selectGym,
  createCustomGym,
} from '../../data/gyms';

interface GymPickerProps {
  value: GymSelection | null;
  onChange: (gym: GymSelection | null) => void;
}

type PickerMode = 'browse' | 'search' | 'manual';

export function GymPicker({ value, onChange }: GymPickerProps) {
  const [mode, setMode] = useState<PickerMode>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualState, setManualState] = useState('');

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchGyms(searchQuery);
  }, [searchQuery]);

  // Gyms grouped by affiliation for browse mode
  const gymsByAffiliation = useMemo(() => {
    const grouped: Record<string, Gym[]> = {};

    for (const affiliation of AFFILIATIONS) {
      const gyms = GYM_DATABASE.filter(g => g.affiliation === affiliation);
      if (gyms.length > 0) {
        grouped[affiliation] = gyms.slice(0, 3); // Show only first 3 per affiliation in browse
      }
    }

    // Add popular independents
    const famousIds = ['aoj', 'unity', 'bteam', 'newwave', 'marcelo', 'cobrinha'];
    const independents = GYM_DATABASE.filter(g => g.affiliation === null && famousIds.includes(g.id));
    if (independents.length > 0) {
      grouped['Independent'] = independents;
    }

    return grouped;
  }, []);

  // Handle gym selection
  const handleSelectGym = (gym: Gym) => {
    onChange(selectGym(gym));
    setSearchQuery('');
    setMode('browse');
  };

  // Handle manual entry submission
  const handleManualSubmit = () => {
    if (manualName.trim()) {
      onChange(createCustomGym(
        manualName.trim(),
        manualCity.trim() || undefined,
        manualState.trim() || undefined
      ));
      setManualName('');
      setManualCity('');
      setManualState('');
      setMode('browse');
    }
  };

  // Handle clearing selection
  const handleClear = () => {
    onChange(null);
  };

  // If a gym is selected, show the selected state
  if (value) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-md) var(--space-lg)',
        backgroundColor: 'var(--color-gray-800)',
        borderRadius: 'var(--radius-md)',
        border: '2px solid var(--color-accent)',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-white)',
          }}>
            {value.gymName}
          </div>
          {(value.city || value.affiliation) && (
            <div style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-gray-400)',
              marginTop: 2,
            }}>
              {[value.city, value.stateOrCountry].filter(Boolean).join(', ')}
              {value.affiliation && ` \u2022 ${value.affiliation}`}
              {value.isCustom && ' \u2022 Custom'}
            </div>
          )}
        </div>
        <button
          onClick={handleClear}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-gray-400)',
          }}
          aria-label="Clear gym selection"
        >
          <Icons.Close size={20} />
        </button>
      </div>
    );
  }

  // Manual entry mode
  if (mode === 'manual') {
    return (
      <div style={{
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-gray-700)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--space-md)',
          borderBottom: '1px solid var(--color-gray-700)',
        }}>
          <button
            onClick={() => setMode('browse')}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-400)',
              marginRight: 'var(--space-sm)',
            }}
            aria-label="Back"
          >
            <Icons.ChevronLeft size={20} />
          </button>
          <span style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-white)',
          }}>
            Add Your Gym
          </span>
        </div>

        {/* Form */}
        <div style={{ padding: 'var(--space-md)' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-gray-400)',
              marginBottom: 'var(--space-xs)',
            }}>
              Gym Name *
            </label>
            <input
              type="text"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="e.g. Gracie Barra Philadelphia"
              autoFocus
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                backgroundColor: 'var(--color-gray-800)',
                border: '1px solid var(--color-gray-700)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-white)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-xs)',
              }}>
                City
              </label>
              <input
                type="text"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  backgroundColor: 'var(--color-gray-800)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-white)',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-xs)',
              }}>
                State/Country
              </label>
              <input
                type="text"
                value={manualState}
                onChange={(e) => setManualState(e.target.value)}
                placeholder="Optional"
                style={{
                  width: '100%',
                  padding: 'var(--space-md)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  backgroundColor: 'var(--color-gray-800)',
                  border: '1px solid var(--color-gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-white)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            onClick={handleManualSubmit}
            disabled={!manualName.trim()}
            style={{
              width: '100%',
              padding: 'var(--space-md)',
              backgroundColor: manualName.trim() ? 'var(--color-accent)' : 'var(--color-gray-700)',
              color: manualName.trim() ? 'var(--color-primary)' : 'var(--color-gray-500)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              cursor: manualName.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Add Gym
          </button>
        </div>
      </div>
    );
  }

  // Search/Browse mode
  return (
    <div style={{
      backgroundColor: 'var(--color-gray-900)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-gray-700)',
      overflow: 'hidden',
    }}>
      {/* Search Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: 'var(--space-sm) var(--space-md)',
        borderBottom: '1px solid var(--color-gray-700)',
        backgroundColor: 'var(--color-gray-800)',
      }}>
        <Icons.Search size={18} color="var(--color-gray-500)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setMode(e.target.value.trim() ? 'search' : 'browse');
          }}
          placeholder="Search gyms..."
          style={{
            flex: 1,
            padding: 'var(--space-sm) var(--space-md)',
            fontSize: 'var(--text-base)',
            fontWeight: 500,
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-white)',
            outline: 'none',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setMode('browse');
            }}
            style={{
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-500)',
            }}
            aria-label="Clear search"
          >
            <Icons.Close size={16} />
          </button>
        )}
      </div>

      {/* Results/Browse List */}
      <div style={{
        maxHeight: 280,
        overflowY: 'auto',
      }}>
        {mode === 'search' && searchQuery ? (
          // Search Results
          <>
            {searchResults.length > 0 ? (
              searchResults.map(gym => (
                <GymRow key={gym.id} gym={gym} onSelect={handleSelectGym} />
              ))
            ) : (
              <div style={{
                padding: 'var(--space-lg)',
                textAlign: 'center',
                color: 'var(--color-gray-500)',
                fontSize: 'var(--text-sm)',
              }}>
                No gyms found matching "{searchQuery}"
              </div>
            )}
            {/* Add custom option */}
            <button
              onClick={() => {
                setManualName(searchQuery);
                setMode('manual');
              }}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                backgroundColor: 'var(--color-gray-800)',
                border: 'none',
                borderTop: '1px solid var(--color-gray-700)',
                cursor: 'pointer',
                color: 'var(--color-accent)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              <Icons.Plus size={16} />
              Add "{searchQuery}" as my gym
            </button>
          </>
        ) : (
          // Browse Mode - Grouped by Affiliation
          <>
            {Object.entries(gymsByAffiliation).map(([affiliation, gyms]) => (
              <div key={affiliation}>
                <div style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: 'var(--color-gray-800)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--color-gray-500)',
                  position: 'sticky',
                  top: 0,
                }}>
                  {affiliation}
                </div>
                {gyms.map(gym => (
                  <GymRow key={gym.id} gym={gym} onSelect={handleSelectGym} />
                ))}
              </div>
            ))}

            {/* My gym isn't listed */}
            <button
              onClick={() => setMode('manual')}
              style={{
                width: '100%',
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                backgroundColor: 'var(--color-gray-800)',
                border: 'none',
                borderTop: '1px solid var(--color-gray-700)',
                cursor: 'pointer',
                color: 'var(--color-accent)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
              }}
            >
              <Icons.Plus size={16} />
              My gym isn't listed
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Individual gym row component
function GymRow({ gym, onSelect }: { gym: Gym; onSelect: (gym: Gym) => void }) {
  return (
    <button
      onClick={() => onSelect(gym)}
      style={{
        width: '100%',
        padding: 'var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        backgroundColor: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--color-gray-800)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{
        fontSize: 'var(--text-base)',
        fontWeight: 600,
        color: 'var(--color-white)',
      }}>
        {gym.name}
      </span>
      <span style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-gray-500)',
      }}>
        {gym.city}, {gym.stateOrCountry}
        {gym.affiliation && ` \u2022 ${gym.affiliation}`}
      </span>
    </button>
  );
}

export default GymPicker;
