/**
 * TechniqueLibrary Component
 * Browse, search, and learn BJJ techniques with curated video instruction
 *
 * Mobile-first design with two primary views:
 * - "For You" - Personalized video recommendations
 * - "Browse" - Category-based technique exploration
 *
 * Integrates curated YouTube videos from priority instructors:
 * John Danaher, Gordon Ryan, Lachlan Giles, Craig Jones
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  mockTechniques,
  mockTechniqueProgress,
  type Technique,
  type TechniqueProgress,
} from '../../data/techniques';
import {
  techniqueVideos,
  getBeltSpecificRecommendations,
  positionNames,
  getVideoStats,
  getMindsetVideosByCategory,
  getMindsetVideos,
} from '../../data/techniqueVideos';
import { YouTubeEmbed, VideoThumbnail } from '../ui/YouTubeEmbed';
import { useBeltPersonalization } from '../../hooks';
import type { TechniqueVideo, VideoRecommendation, PositionCategory } from '../../types/techniqueVideos';

// ===========================================
// CONFIGURATION
// ===========================================

// Position configuration for browse grid
const POSITIONS: {
  id: PositionCategory;
  name: string;
  description: string;
}[] = [
  { id: 'closed_guard', name: 'Closed Guard', description: 'Bottom with legs wrapped' },
  { id: 'half_guard', name: 'Half Guard', description: 'Control one leg' },
  { id: 'open_guard', name: 'Open Guard', description: 'Butterfly, DLR, spider' },
  { id: 'mount', name: 'Mount', description: 'Top position dominance' },
  { id: 'side_control', name: 'Side Control', description: 'Chest-to-chest control' },
  { id: 'back_control', name: 'Back Control', description: 'Hooks and seatbelt' },
  { id: 'guard_passing', name: 'Guard Passing', description: 'Get past the legs' },
  { id: 'takedowns', name: 'Takedowns', description: 'Wrestling and judo' },
  { id: 'turtle', name: 'Turtle', description: 'Attack and defend' },
  { id: 'clinch', name: 'Clinch', description: 'Standing control' },
  { id: 'submissions', name: 'Submissions', description: 'Finishing attacks' },
];

// Mindset & Lifestyle categories
type MindsetCategoryId = 'belt_journey' | 'mental_game' | 'age_longevity' | 'lifestyle' | 'injury_recovery';
const MINDSET_CATEGORIES: {
  id: MindsetCategoryId;
  name: string;
  description: string;
}[] = [
  { id: 'belt_journey', name: 'Belt Journey', description: 'White belt to black belt psychology' },
  { id: 'mental_game', name: 'Mental Game', description: 'Competition, ego, flow state' },
  { id: 'age_longevity', name: 'Age & Longevity', description: 'Training over 40, recovery' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Work-life balance, motivation' },
  { id: 'injury_recovery', name: 'Injury & Recovery', description: 'Coming back, prehab' },
];

// Proficiency display config (supports all ProficiencyLevel values)
const PROFICIENCY_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  learning: { label: 'Learning', color: 'var(--color-warning)', bgColor: 'rgba(245, 158, 11, 0.15)' },
  developing: { label: 'Developing', color: 'var(--color-gold)', bgColor: 'var(--color-gold-dim)' },
  proficient: { label: 'Proficient', color: 'var(--color-positive)', bgColor: 'var(--color-positive-dim)' },
  advanced: { label: 'Advanced', color: 'var(--color-positive)', bgColor: 'var(--color-positive-dim)' },
};

type ViewMode = 'for_you' | 'browse';
type DetailView = 'position' | 'technique' | 'mindset' | null;

// ===========================================
// MAIN COMPONENT
// ===========================================

interface TechniqueLibraryProps {
  onOpenFeedback?: () => void;
}

export function TechniqueLibrary({ onOpenFeedback }: TechniqueLibraryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('for_you');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionCategory | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<TechniqueVideo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMindsetCategory, setSelectedMindsetCategory] = useState<MindsetCategoryId | null>(null);

  // Belt personalization for video recommendations
  const { videoTutorials, chatbot, profile } = useBeltPersonalization();

  // Generate belt-specific recommendations
  const beltRecommendations = useMemo(
    () => getBeltSpecificRecommendations(profile.belt as 'white' | 'blue' | 'purple' | 'brown' | 'black'),
    [profile.belt]
  );

  // Scroll to top when component mounts (user taps Techniques tab)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Progress map for quick lookup
  const progressMap = useMemo(() => {
    const map = new Map<string, TechniqueProgress>();
    mockTechniqueProgress.forEach(p => map.set(p.techniqueId, p));
    return map;
  }, []);

  // Video stats
  const videoStats = useMemo(() => getVideoStats(), []);

  // Search results - techniques
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return mockTechniques.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.position.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [searchQuery]);

  // Search results - mindset videos
  const mindsetSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const mindsetVideos = getMindsetVideos();
    return mindsetVideos.filter(v =>
      v.title.toLowerCase().includes(query) ||
      v.instructor.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  // Navigation handlers
  const openPosition = useCallback((position: PositionCategory) => {
    setSelectedPosition(position);
    setDetailView('position');
    setSearchQuery('');
  }, []);

  const openTechnique = useCallback((technique: Technique) => {
    setSelectedTechnique(technique);
    setDetailView('technique');
  }, []);

  const openMindsetCategory = useCallback((category: MindsetCategoryId) => {
    setSelectedMindsetCategory(category);
    setDetailView('mindset');
    setSearchQuery('');
  }, []);

  const goBack = useCallback(() => {
    if (detailView === 'technique') {
      setSelectedTechnique(null);
      setSelectedVideo(null);
      setDetailView(selectedPosition ? 'position' : null);
    } else if (detailView === 'position') {
      setSelectedPosition(null);
      setDetailView(null);
    } else if (detailView === 'mindset') {
      setSelectedMindsetCategory(null);
      setDetailView(null);
    }
  }, [detailView, selectedPosition]);

  // Render position detail view
  if (detailView === 'position' && selectedPosition) {
    const positionTechniques = mockTechniques.filter(t => {
      const techPosition = t.position.replace('-', '_');
      return techPosition === selectedPosition ||
        (selectedPosition === 'submissions' && t.category === 'submission');
    });

    return (
      <PositionDetail
        position={selectedPosition}
        techniques={positionTechniques}
        progressMap={progressMap}
        onBack={goBack}
        onSelectTechnique={openTechnique}
      />
    );
  }

  // Render mindset category detail view
  if (detailView === 'mindset' && selectedMindsetCategory) {
    const category = MINDSET_CATEGORIES.find(c => c.id === selectedMindsetCategory);
    const videos = getMindsetVideosByCategory(selectedMindsetCategory);
    return (
      <MindsetDetail
        category={category!}
        videos={videos}
        onBack={goBack}
      />
    );
  }

  // Render technique detail view
  if (detailView === 'technique' && selectedTechnique) {
    const progress = progressMap.get(selectedTechnique.id);
    return (
      <TechniqueDetail
        technique={selectedTechnique}
        progress={progress}
        selectedVideo={selectedVideo}
        onBack={goBack}
        onSelectVideo={setSelectedVideo}
      />
    );
  }

  // Main view with tabs
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Search Bar */}
      <div style={{ padding: '0 0 var(--space-md) 0' }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Search Results */}
      {searchQuery && (searchResults.length > 0 || mindsetSearchResults.length > 0) && (
        <div style={{
          backgroundColor: 'var(--color-gray-900)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-md)',
          overflow: 'hidden',
        }}>
          {/* Technique Results */}
          {searchResults.length > 0 && (
            <>
              <div style={{
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'var(--color-gray-800)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wider)',
                  color: 'var(--color-gray-400)',
                }}>
                  Techniques
                </span>
              </div>
              {searchResults.map(technique => (
                <button
                  key={technique.id}
                  onClick={() => openTechnique(technique)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--color-gray-800)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{
                      color: 'var(--color-white)',
                      fontWeight: 600,
                      marginBottom: '2px',
                    }}>
                      {technique.name}
                    </div>
                    <div style={{
                      color: 'var(--color-gray-400)',
                      fontSize: 'var(--text-xs)',
                      textTransform: 'capitalize',
                    }}>
                      {technique.position.replace('-', ' ')}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </>
          )}

          {/* Mindset Video Results */}
          {mindsetSearchResults.length > 0 && (
            <>
              <div style={{
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: 'var(--color-gray-800)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wider)',
                  color: 'var(--color-gold)',
                }}>
                  Mindset & Lifestyle
                </span>
              </div>
              {mindsetSearchResults.map((video, index) => (
                <button
                  key={`${video.youtube_id}-${index}`}
                  onClick={() => {
                    // Find the category for this video
                    const prefix = video.technique_id.split('_')[0];
                    const categoryMap: Record<string, MindsetCategoryId> = {
                      'BJ': 'belt_journey',
                      'MG': 'mental_game',
                      'AL': 'age_longevity',
                      'LB': 'lifestyle',
                      'IR': 'injury_recovery',
                    };
                    const category = categoryMap[prefix];
                    if (category) {
                      openMindsetCategory(category);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: 'var(--space-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--color-gray-800)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: 'var(--color-white)',
                      fontWeight: 600,
                      marginBottom: '2px',
                      lineHeight: 1.3,
                    }}>
                      {video.title}
                    </div>
                    <div style={{
                      color: 'var(--color-gray-400)',
                      fontSize: 'var(--text-xs)',
                    }}>
                      {video.instructor}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-500)" strokeWidth="2" style={{ flexShrink: 0, marginLeft: 'var(--space-sm)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* Tab Switcher */}
      {!searchQuery && (
        <>
          <div style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'var(--color-gray-800)',
            borderRadius: 'var(--radius-lg)',
            padding: '4px',
            marginBottom: 'var(--space-xl)',
          }}>
            <TabButton
              active={viewMode === 'for_you'}
              onClick={() => setViewMode('for_you')}
              label="For You"
            />
            <TabButton
              active={viewMode === 'browse'}
              onClick={() => setViewMode('browse')}
              label="Browse"
            />
          </div>

          {/* For You View */}
          {viewMode === 'for_you' && (
            <ForYouView
              recommendations={beltRecommendations.recommendations}
              onOpenFeedback={onOpenFeedback}
              playlistName={videoTutorials.personalizedPlaylistName}
              emphasizeTopics={chatbot.emphasizeTopics}
            />
          )}

          {/* Browse View */}
          {viewMode === 'browse' && (
            <>
              {/* Belt-specific suggestions at top */}
              <BeltSuggestedTechniques
                belt={profile.belt}
                onSelectPosition={openPosition}
              />
              <BrowseView
                positions={POSITIONS}
                mindsetCategories={MINDSET_CATEGORIES}
                videoStats={videoStats}
                onSelectPosition={openPosition}
                onSelectMindsetCategory={openMindsetCategory}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

// ===========================================
// TAB BUTTON
// Larger touch targets (56px min), clearer active states
// ===========================================

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: 52,
        minHeight: 52,
        padding: '0 var(--space-lg)',
        backgroundColor: active ? 'var(--color-gray-900)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--color-gold)' : 'var(--color-gray-500)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wider)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

// ===========================================
// SEARCH BAR
// Larger touch targets, more whitespace for exhausted users
// ===========================================

function SearchBar({
  value,
  onChange,
  onClear,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        left: 'var(--space-lg)',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--color-gray-500)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search techniques..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          height: 56,
          padding: '0 56px 0 56px',
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          border: '1px solid var(--color-gray-700)',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-gray-900)',
          color: 'var(--color-white)',
        }}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: 'var(--space-sm)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--color-gray-700)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: 40,
            height: 40,
            minWidth: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-gray-300)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ===========================================
// BELT SUGGESTIONS EMPTY STATE
// Shows suggested techniques based on user's belt level when search is empty
// ===========================================

// Belt-specific focus areas for suggestions
const BELT_FOCUS_AREAS: Record<string, { positions: PositionCategory[]; message: string }> = {
  white: {
    positions: ['closed_guard', 'mount', 'side_control', 'back_control'],
    message: 'Start with the fundamentals. Master these positions first.',
  },
  blue: {
    positions: ['half_guard', 'open_guard', 'guard_passing', 'submissions'],
    message: 'Expand your game. Build on your foundation.',
  },
  purple: {
    positions: ['open_guard', 'guard_passing', 'takedowns', 'submissions'],
    message: 'Refine your A-game. Develop your signature style.',
  },
  brown: {
    positions: ['clinch', 'takedowns', 'turtle', 'submissions'],
    message: 'Polish the details. Fill gaps in your game.',
  },
  black: {
    positions: ['submissions', 'clinch', 'takedowns', 'turtle'],
    message: 'Master the subtle details. Share your knowledge.',
  },
};

function BeltSuggestedTechniques({
  belt,
  onSelectPosition,
}: {
  belt: string;
  onSelectPosition: (position: PositionCategory) => void;
}) {
  const focusAreas = BELT_FOCUS_AREAS[belt] || BELT_FOCUS_AREAS.white;
  const suggestedPositions = POSITIONS.filter(p => focusAreas.positions.includes(p.id));

  return (
    <div style={{
      backgroundColor: 'var(--color-gray-900)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      marginBottom: 'var(--space-lg)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-sm)',
      }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: 'var(--radius-full)',
          backgroundColor: `var(--color-belt-${belt})`,
          border: belt === 'white' ? '1px solid var(--color-gray-600)' : 'none',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gold)',
        }}>
          Suggested for {belt} belt
        </span>
      </div>

      {/* Message */}
      <p style={{
        color: 'var(--color-gray-300)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.5,
        margin: 0,
        marginBottom: 'var(--space-lg)',
      }}>
        {focusAreas.message}
      </p>

      {/* Quick access cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-sm)',
      }}>
        {suggestedPositions.slice(0, 4).map(position => (
          <button
            key={position.id}
            onClick={() => onSelectPosition(position.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-gray-800)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              minHeight: 56,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{
              color: 'var(--color-white)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}>
              {position.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===========================================
// SECTION HEADER
// Creates clear visual breaks between content sections
// ===========================================

function SectionHeader({
  title,
  subtitle,
  count,
  accentColor = 'var(--color-gold)',
}: {
  title: string;
  subtitle?: string;
  count?: number;
  accentColor?: string;
}) {
  return (
    <div style={{
      marginBottom: 'var(--space-lg)',
      paddingTop: 'var(--space-lg)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: subtitle ? 'var(--space-xs)' : 0,
      }}>
        <div style={{
          width: 3,
          height: 16,
          backgroundColor: accentColor,
          borderRadius: 2,
        }} />
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: accentColor,
          margin: 0,
        }}>
          {title}
        </h3>
        {count !== undefined && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-gray-500)',
          }}>
            {count}
          </span>
        )}
      </div>
      {subtitle && (
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-gray-400)',
          margin: 0,
          marginLeft: 'calc(3px + var(--space-sm))',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ===========================================
// FOR YOU VIEW
// Clean, reduced density, better spacing
// ===========================================

function ForYouView({
  recommendations,
  onOpenFeedback,
  playlistName,
  emphasizeTopics,
}: {
  recommendations: VideoRecommendation[];
  onOpenFeedback?: () => void;
  playlistName: string;
  emphasizeTopics: string[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Section Header - Belt-Personalized */}
      <SectionHeader
        title={playlistName}
        subtitle={`Focus: ${emphasizeTopics.slice(0, 3).join(', ')}`}
      />

      {/* Recommendation Cards - More whitespace */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {recommendations.map((rec, index) => (
          <div
            key={`${rec.video.youtube_id}-${index}`}
            style={{
              backgroundColor: 'var(--color-gray-900)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: rec.priority === 'high' ? '1px solid var(--color-gold-dim)' : '1px solid var(--color-gray-800)',
            }}
          >
            {/* Priority Badge - Cleaner */}
            {rec.priority === 'high' && (
              <div style={{
                padding: 'var(--space-sm) var(--space-lg)',
                backgroundColor: 'var(--color-gold-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wider)',
                  color: 'var(--color-gold)',
                }}>
                  Priority Focus
                </span>
              </div>
            )}

            {/* Video Player / Thumbnail - More padding */}
            <div style={{ padding: 'var(--space-lg)' }}>
              <YouTubeEmbed
                videoId={rec.video.youtube_id}
                title={rec.video.title}
                instructor={rec.video.instructor}
                duration={rec.video.duration_seconds}
              />
            </div>

            {/* Recommendation Reason - Cleaner layout */}
            <div style={{ padding: '0 var(--space-lg) var(--space-lg)' }}>
              <p style={{
                color: 'var(--color-gray-300)',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {rec.reason_text}
              </p>

              {/* User Progress Indicator - Only show if exists */}
              {rec.user_proficiency && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  marginTop: 'var(--space-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  backgroundColor: PROFICIENCY_CONFIG[rec.user_proficiency].bgColor,
                  borderRadius: 'var(--radius-md)',
                  width: 'fit-content',
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: PROFICIENCY_CONFIG[rec.user_proficiency].color,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: PROFICIENCY_CONFIG[rec.user_proficiency].color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {PROFICIENCY_CONFIG[rec.user_proficiency].label}
                  </span>
                  {rec.times_practiced > 0 && (
                    <span style={{
                      color: 'var(--color-gray-400)',
                      fontSize: 'var(--text-xs)',
                    }}>
                      {rec.times_practiced}x practiced
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        backgroundColor: 'var(--color-gray-800)',
        margin: 'var(--space-xl) calc(var(--space-md) * -1)',
      }} />

      {/* Training Feedback CTA - Larger touch target */}
      {onOpenFeedback && (
        <button
          onClick={onOpenFeedback}
          style={{
            width: '100%',
            padding: 'var(--space-lg)',
            backgroundColor: 'var(--color-gray-900)',
            border: '1px solid var(--color-gold-dim)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-lg)',
            minHeight: 80,
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-gold-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--color-white)',
              marginBottom: 'var(--space-xs)',
            }}>
              Get Training Feedback
            </div>
            <div style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.4,
            }}>
              AI-powered insights based on your history
            </div>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-gray-500)"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Ask Coach Reminder - More prominent */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '4px solid var(--color-info)',
        marginTop: 'var(--space-lg)',
        marginBottom: 'var(--space-xl)',
      }}>
        <p style={{
          color: 'var(--color-gray-300)',
          fontSize: 'var(--text-sm)',
          margin: 0,
          lineHeight: 1.6,
        }}>
          These recommendations are based on general patterns. Your coach knows your game best.
        </p>
      </div>
    </div>
  );
}

// ===========================================
// BROWSE VIEW
// Clean layout with clear section breaks, larger touch targets
// ===========================================

function BrowseView({
  positions,
  mindsetCategories,
  videoStats,
  onSelectPosition,
  onSelectMindsetCategory,
}: {
  positions: typeof POSITIONS;
  mindsetCategories: typeof MINDSET_CATEGORIES;
  videoStats: ReturnType<typeof getVideoStats>;
  onSelectPosition: (position: PositionCategory) => void;
  onSelectMindsetCategory: (category: MindsetCategoryId) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Stats Hero - Clean, prominent */}
      <div style={{
        textAlign: 'center',
        paddingBottom: 'var(--space-xl)',
        marginBottom: 'var(--space-md)',
        borderBottom: '1px solid var(--color-gray-800)',
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(48px, 15vw, 72px)',
          fontWeight: 700,
          color: 'var(--color-white)',
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
        }}>
          {videoStats.techniquesWithVideos}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--color-gray-500)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          marginTop: 'var(--space-sm)',
        }}>
          Techniques with videos
        </div>
      </div>

      {/* Techniques Section */}
      <SectionHeader
        title="Positions"
        count={positions.length}
      />

      {/* Position Grid - Larger cards, more whitespace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
      }}>
        {positions.map(position => (
          <button
            key={position.id}
            onClick={() => onSelectPosition(position.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-800)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s ease, transform 0.1s ease',
              minHeight: 120,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-white)',
              lineHeight: 1.2,
            }}>
              {position.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              lineHeight: 1.4,
              marginTop: 'var(--space-sm)',
            }}>
              {position.description}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        backgroundColor: 'var(--color-gray-800)',
        margin: '0 calc(var(--space-md) * -1)',
        marginBottom: 'var(--space-md)',
      }} />

      {/* Mindset & Lifestyle Section */}
      <SectionHeader
        title="Mindset & Lifestyle"
        count={mindsetCategories.length}
        subtitle="Training psychology and lifestyle"
      />

      {/* Mindset Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
      }}>
        {mindsetCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectMindsetCategory(category.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--space-lg)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-800)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s ease, transform 0.1s ease',
              minHeight: 120,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-white)',
              lineHeight: 1.2,
            }}>
              {category.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              lineHeight: 1.4,
              marginTop: 'var(--space-sm)',
            }}>
              {category.description}
            </span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        backgroundColor: 'var(--color-gray-800)',
        margin: '0 calc(var(--space-md) * -1)',
        marginBottom: 'var(--space-md)',
      }} />

      {/* Instructor Stats - Clean card */}
      <SectionHeader
        title="Featured Instructors"
        accentColor="var(--color-gray-400)"
      />
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--space-xl)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}>
          {Object.entries(videoStats.byInstructor)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([instructor, count]) => (
              <div
                key={instructor}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 'var(--space-md)',
                  borderBottom: '1px solid var(--color-gray-800)',
                }}
              >
                <span style={{
                  color: 'var(--color-white)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                }}>
                  {instructor}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--color-gray-400)',
                }}>
                  {count}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// MINDSET DETAIL
// ===========================================

function MindsetDetail({
  category,
  videos,
  onBack,
}: {
  category: { id: string; name: string; description: string };
  videos: TechniqueVideo[];
  onBack: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button
          onClick={onBack}
          aria-label="Go back"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-gray-400)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: 0,
          }}>
            {category.name}
          </h2>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-400)',
            margin: 0,
            marginTop: '4px',
          }}>
            {videos.length} videos
          </p>
        </div>
      </div>

      {/* Category Description */}
      <p style={{
        color: 'var(--color-gray-300)',
        fontSize: 'var(--text-sm)',
        margin: 0,
        lineHeight: 1.5,
      }}>
        {category.description}
      </p>

      {/* Video List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {videos.map((video, index) => (
          <div
            key={`${video.youtube_id}-${index}`}
            style={{
              backgroundColor: 'var(--color-gray-900)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-gray-800)',
            }}
          >
            <div style={{ padding: 'var(--space-md)' }}>
              <YouTubeEmbed
                videoId={video.youtube_id}
                title={video.title}
                instructor={video.instructor}
                duration={video.duration_seconds}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {videos.length === 0 && (
        <div style={{
          padding: 'var(--space-xl)',
          textAlign: 'center',
          color: 'var(--color-gray-400)',
        }}>
          <p style={{ margin: 0 }}>No videos in this category yet.</p>
        </div>
      )}
    </div>
  );
}

// ===========================================
// POSITION DETAIL
// ===========================================

function PositionDetail({
  position,
  techniques,
  progressMap,
  onBack,
  onSelectTechnique,
}: {
  position: PositionCategory;
  techniques: Technique[];
  progressMap: Map<string, TechniqueProgress>;
  onBack: () => void;
  onSelectTechnique: (technique: Technique) => void;
}) {
  const positionName = positionNames[position] || position;

  // Group by belt level
  const grouped = useMemo(() => {
    const groups: Record<string, Technique[]> = {};
    techniques.forEach(t => {
      if (!groups[t.beltLevel]) groups[t.beltLevel] = [];
      groups[t.beltLevel].push(t);
    });
    return groups;
  }, [techniques]);

  const beltOrder = ['white', 'blue', 'purple', 'brown', 'black'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-gray-400)',
          }}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: 0,
          }}>
            {positionName}
          </h2>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-gray-500)',
          }}>
            {techniques.length} techniques
          </span>
        </div>
      </div>

      {/* Techniques by Belt */}
      {beltOrder.map(belt => {
        const techs = grouped[belt];
        if (!techs || techs.length === 0) return null;

        return (
          <div key={belt}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-sm)',
            }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: 'var(--radius-full)',
                backgroundColor: `var(--color-belt-${belt})`,
                border: belt === 'white' ? '1px solid var(--color-gray-600)' : 'none',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-400)',
              }}>
                {belt} belt
              </span>
            </div>

            <div style={{
              backgroundColor: 'var(--color-gray-900)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              {techs.map((technique, idx) => {
                const progress = progressMap.get(technique.id);
                const profConfig = progress ? PROFICIENCY_CONFIG[progress.proficiency] : null;

                return (
                  <button
                    key={technique.id}
                    onClick={() => onSelectTechnique(technique)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-md)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: idx < techs.length - 1 ? '1px solid var(--color-gray-800)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        color: 'var(--color-white)',
                        fontWeight: 600,
                        marginBottom: '2px',
                      }}>
                        {technique.name}
                      </div>
                      <div style={{
                        color: 'var(--color-gray-500)',
                        fontSize: 'var(--text-xs)',
                        textTransform: 'capitalize',
                      }}>
                        {technique.category} • {technique.gipiNogi === 'both' ? 'Gi & No-Gi' : technique.gipiNogi}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)',
                    }}>
                      {profConfig && (
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: profConfig.color,
                        }} />
                      )}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-600)" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===========================================
// TECHNIQUE DETAIL
// ===========================================

function TechniqueDetail({
  technique,
  progress,
  selectedVideo,
  onBack,
  onSelectVideo,
}: {
  technique: Technique;
  progress?: TechniqueProgress;
  selectedVideo: TechniqueVideo | null;
  onBack: () => void;
  onSelectVideo: (video: TechniqueVideo | null) => void;
}) {
  // Get videos for this technique (mock - would map IDs properly in production)
  const videos = useMemo(() => {
    // Try to find videos that might match this technique
    const possibleIds = techniqueVideos
      .filter(v =>
        v.title.toLowerCase().includes(technique.name.toLowerCase().split(' ')[0]) ||
        v.title.toLowerCase().includes(technique.position.replace('-', ' '))
      )
      .slice(0, 3);

    // If no direct matches, get some from the same category
    if (possibleIds.length === 0) {
      return techniqueVideos.slice(0, 2);
    }
    return possibleIds;
  }, [technique]);

  const profConfig = progress ? PROFICIENCY_CONFIG[progress.proficiency] : null;
  const currentVideo = selectedVideo || videos[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--space-sm)',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-gray-400)',
          }}
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span style={{
          color: 'var(--color-gray-400)',
          fontSize: 'var(--text-sm)',
        }}>
          Back
        </span>
      </div>

      {/* Technique Title */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-sm)',
        }}>
          <span style={{
            width: 10,
            height: 10,
            borderRadius: 'var(--radius-full)',
            backgroundColor: `var(--color-belt-${technique.beltLevel})`,
            border: technique.beltLevel === 'white' ? '1px solid var(--color-gray-600)' : 'none',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)',
            color: 'var(--color-gray-400)',
          }}>
            {technique.beltLevel} belt • {technique.category}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--color-white)',
          margin: 0,
          marginBottom: 'var(--space-sm)',
        }}>
          {technique.name}
        </h1>

        <p style={{
          color: 'var(--color-gray-300)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {technique.description}
        </p>
      </div>

      {/* Video Section */}
      {currentVideo && (
        <div>
          <YouTubeEmbed
            videoId={currentVideo.youtube_id}
            title={currentVideo.title}
            instructor={currentVideo.instructor}
            duration={currentVideo.duration_seconds}
          />

          {/* Other videos */}
          {videos.length > 1 && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <h3 style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-widest)',
                color: 'var(--color-gray-400)',
                marginBottom: 'var(--space-sm)',
              }}>
                More Videos
              </h3>
              {videos.filter(v => v !== currentVideo).map(video => (
                <VideoThumbnail
                  key={video.youtube_id}
                  videoId={video.youtube_id}
                  title={video.title}
                  instructor={video.instructor}
                  duration={video.duration_seconds}
                  onClick={() => onSelectVideo(video)}
                  isActive={video === currentVideo}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Videos Message */}
      {videos.length === 0 && (
        <div style={{
          padding: 'var(--space-xl)',
          backgroundColor: 'var(--color-gray-900)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
        }}>
          <p style={{
            color: 'var(--color-gray-400)',
            margin: 0,
          }}>
            No videos available yet. Contact us to submit one.
          </p>
        </div>
      )}

      {/* Progress Card */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-md)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-md)',
        }}>
          Your Progress
        </h3>

        {progress ? (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-md)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
              }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: profConfig?.color,
                }} />
                <span style={{
                  fontWeight: 600,
                  color: profConfig?.color,
                }}>
                  {profConfig?.label}
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-gray-500)',
              }}>
                Drilled {progress.timesDrilled}x
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-sm)',
            }}>
              <div>
                <div style={{ color: 'var(--color-gray-500)', marginBottom: '2px' }}>Last practiced</div>
                <div style={{ color: 'var(--color-white)' }}>
                  {new Date(progress.lastDrilled).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              {progress.coachEndorsed && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  color: 'var(--color-positive)',
                  fontSize: 'var(--text-sm)',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Coach verified
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: 'var(--color-gray-500)',
              margin: 0,
              marginBottom: 'var(--space-md)',
            }}>
              Not started yet
            </p>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Log Practice
            </button>
          </div>
        )}
      </div>

      {/* Key Points */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-md)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gray-400)',
          marginBottom: 'var(--space-md)',
        }}>
          Key Points
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}>
          {technique.keyPoints.map((point, i) => (
            <li key={i} style={{
              color: 'var(--color-gray-300)',
              lineHeight: 1.5,
            }}>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Common Mistakes */}
      <div style={{
        padding: 'var(--space-lg)',
        backgroundColor: 'var(--color-negative-dim)',
        borderRadius: 'var(--radius-md)',
        borderLeft: '3px solid var(--color-negative)',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-negative)',
          marginBottom: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Common Mistakes
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: 'var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
        }}>
          {technique.commonMistakes.map((mistake, i) => (
            <li key={i} style={{
              color: 'var(--color-gray-300)',
              lineHeight: 1.5,
            }}>
              {mistake}
            </li>
          ))}
        </ul>
      </div>

      {/* Spacer for tab bar */}
      <div style={{ height: 80 }} />
    </div>
  );
}

export default TechniqueLibrary;
