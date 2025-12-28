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
  mockForYouSection,
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
  const { videoTutorials, chatbot } = useBeltPersonalization();

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
            gap: '2px',
            backgroundColor: 'var(--color-gray-800)',
            borderRadius: 'var(--radius-md)',
            padding: '2px',
            marginBottom: 'var(--space-lg)',
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
              recommendations={mockForYouSection.recommendations}
              onOpenFeedback={onOpenFeedback}
              playlistName={videoTutorials.personalizedPlaylistName}
              emphasizeTopics={chatbot.emphasizeTopics}
            />
          )}

          {/* Browse View */}
          {viewMode === 'browse' && (
            <BrowseView
              positions={POSITIONS}
              mindsetCategories={MINDSET_CATEGORIES}
              videoStats={videoStats}
              onSelectPosition={openPosition}
              onSelectMindsetCategory={openMindsetCategory}
            />
          )}
        </>
      )}
    </div>
  );
}

// ===========================================
// TAB BUTTON
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
        padding: 'var(--space-md)',
        backgroundColor: active ? 'var(--color-gray-900)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        color: active ? 'var(--color-white)' : 'var(--color-gray-400)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wider)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  );
}

// ===========================================
// SEARCH BAR
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
        left: 'var(--space-md)',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--color-gray-500)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          padding: 'var(--space-md) var(--space-md) var(--space-md) 48px',
          fontSize: 'var(--text-base)',
          border: '1px solid var(--color-gray-700)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-gray-900)',
          color: 'var(--color-white)',
        }}
      />
      {value && (
        <button
          onClick={onClear}
          style={{
            position: 'absolute',
            right: 'var(--space-md)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--color-gray-700)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-gray-300)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ===========================================
// FOR YOU VIEW
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Section Header - Belt-Personalized */}
      <div>
        <h2 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-widest)',
          color: 'var(--color-gold)',
          marginBottom: 'var(--space-sm)',
        }}>
          {playlistName}
        </h2>
        <p style={{
          color: 'var(--color-gray-400)',
          fontSize: 'var(--text-sm)',
          margin: 0,
        }}>
          Focus areas: {emphasizeTopics.slice(0, 3).join(', ')}
        </p>
      </div>

      {/* Recommendation Cards */}
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
          {/* Priority Badge */}
          {rec.priority === 'high' && (
            <div style={{
              padding: 'var(--space-sm) var(--space-md)',
              backgroundColor: 'var(--color-gold-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
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
                Priority
              </span>
            </div>
          )}

          {/* Video Player / Thumbnail */}
          <div style={{ padding: 'var(--space-md)' }}>
            <YouTubeEmbed
              videoId={rec.video.youtube_id}
              title={rec.video.title}
              instructor={rec.video.instructor}
              duration={rec.video.duration_seconds}
            />
          </div>

          {/* Recommendation Reason */}
          <div style={{ padding: '0 var(--space-md) var(--space-md)' }}>
            <p style={{
              color: 'var(--color-gray-300)',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.5,
              margin: 0,
              marginBottom: 'var(--space-md)',
            }}>
              {rec.reason_text}
            </p>

            {/* User Progress Indicator */}
            {rec.user_proficiency && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-md)',
                backgroundColor: PROFICIENCY_CONFIG[rec.user_proficiency].bgColor,
                borderRadius: 'var(--radius-sm)',
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
                    • {rec.times_practiced}x practiced
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Training Feedback CTA */}
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
            gap: 'var(--space-md)',
          }}
        >
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-gold-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: 'var(--color-white)',
              marginBottom: '4px',
            }}>
              Get Training Feedback
            </div>
            <div style={{
              color: 'var(--color-gray-400)',
              fontSize: 'var(--text-sm)',
            }}>
              AI-powered insights based on your training history
            </div>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-gray-500)"
            strokeWidth="2"
            style={{ marginLeft: 'auto' }}
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Ask Coach Reminder */}
      <div style={{
        padding: 'var(--space-md)',
        backgroundColor: 'var(--color-gray-900)',
        borderRadius: 'var(--radius-md)',
        borderLeft: '3px solid var(--color-info)',
      }}>
        <p style={{
          color: 'var(--color-gray-300)',
          fontSize: 'var(--text-sm)',
          margin: 0,
          lineHeight: 1.5,
        }}>
          These recommendations are based on general patterns. Your coach knows your game best - ask them to validate what to focus on next.
        </p>
      </div>
    </div>
  );
}

// ===========================================
// BROWSE VIEW
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Stats Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: 'var(--color-white)',
          }}>
            {videoStats.techniquesWithVideos}
          </span>
          <span style={{
            color: 'var(--color-gray-400)',
            fontSize: 'var(--text-sm)',
            marginLeft: 'var(--space-sm)',
          }}>
            techniques with videos
          </span>
        </div>
      </div>

      {/* Section Header: Techniques */}
      <h3 style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-widest)',
        color: 'var(--color-gold)',
        margin: 0,
      }}>
        Techniques
      </h3>

      {/* Position Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-sm)',
      }}>
        {positions.map(position => (
          <button
            key={position.id}
            onClick={() => onSelectPosition(position.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--space-lg) var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-800)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s ease',
              minHeight: 100,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-white)',
              marginBottom: 'var(--space-xs)',
            }}>
              {position.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              lineHeight: 1.4,
            }}>
              {position.description}
            </span>
          </button>
        ))}
      </div>

      {/* Instructor Stats */}
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
          Featured Instructors
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)',
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
                }}
              >
                <span style={{
                  color: 'var(--color-white)',
                  fontSize: 'var(--text-sm)',
                }}>
                  {instructor}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-gray-500)',
                }}>
                  {count} videos
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Section Header: Mindset & Lifestyle */}
      <h3 style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-widest)',
        color: 'var(--color-gold)',
        margin: 0,
        marginTop: 'var(--space-md)',
      }}>
        Mindset & Lifestyle
      </h3>

      {/* Mindset Categories Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--space-sm)',
      }}>
        {mindsetCategories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectMindsetCategory(category.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 'var(--space-lg) var(--space-md)',
              backgroundColor: 'var(--color-gray-900)',
              border: '1px solid var(--color-gray-800)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s ease',
              minHeight: 100,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: 'var(--color-white)',
              marginBottom: 'var(--space-xs)',
            }}>
              {category.name}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-gray-500)',
              lineHeight: 1.4,
            }}>
              {category.description}
            </span>
          </button>
        ))}
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
