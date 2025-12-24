/**
 * ALLY BJJ Video Library - Main Screen
 *
 * Three Design Variants:
 * 1. DARK DOJO - Bold dark theme with neon red/gold accents
 * 2. CLEAN ACADEMY - Minimal white with gold accents (Grapplers Guide style)
 * 3. GRADIENT FLOW - Dynamic purple gradients with glass morphism
 *
 * Philosophy: Suggest videos based on techniques users need to work on.
 * The system tracks training gaps, belt level, and viewing history to
 * recommend the most relevant instructional content.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import {
  VIDEO_CATEGORIES,
  INSTRUCTORS,
  VIDEOS,
  searchVideos,
  formatDuration,
  getSuggestedVideos,
  getTrendingVideos,
  getVideosByCategory,
  getVideosByInstructor,
} from '../data/videoLibrary';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// THEME CONFIGURATIONS FOR 3 VARIANTS
// =============================================================================

const THEMES = {
  // VARIANT 1: DARK DOJO - Bold, aggressive, competition-focused
  darkDojo: {
    name: 'Dark Dojo',
    description: 'Bold dark theme with neon accents. Competition-focused, intense aesthetic inspired by elite training facilities.',
    colors: {
      background: '#0A0A0A',
      surface: '#1A1A1A',
      surfaceElevated: '#252525',
      primary: '#FF3B3B',
      secondary: '#FFD700',
      accent: '#00F5FF',
      text: '#FFFFFF',
      textSecondary: '#A0A0A0',
      textMuted: '#666666',
      border: '#333333',
      success: '#00FF88',
      cardGradient: ['#1A1A1A', '#0F0F0F'],
    },
    fonts: {
      heading: { fontWeight: '900', letterSpacing: 2, textTransform: 'uppercase' },
      body: { fontWeight: '400' },
      accent: { fontWeight: '700', letterSpacing: 1 },
    },
    cardStyle: {
      borderRadius: 4,
      borderWidth: 1,
      shadowColor: '#FF3B3B',
      shadowOpacity: 0.3,
    },
    buttonStyle: {
      borderRadius: 4,
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
  },

  // VARIANT 2: CLEAN ACADEMY - Grapplers Guide inspired, educational
  cleanAcademy: {
    name: 'Clean Academy',
    description: 'Minimal white layout with gold accents. Educational focus, clean hierarchy. Inspired by Grapplers Guide.',
    colors: {
      background: '#FAFAFA',
      surface: '#FFFFFF',
      surfaceElevated: '#FFFFFF',
      primary: '#000000',
      secondary: '#D4AF37',
      accent: '#2563EB',
      text: '#1A1A1A',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      border: '#E5E7EB',
      success: '#10B981',
      cardGradient: ['#FFFFFF', '#F9FAFB'],
    },
    fonts: {
      heading: { fontWeight: '700', letterSpacing: 0.5 },
      body: { fontWeight: '400' },
      accent: { fontWeight: '600' },
    },
    cardStyle: {
      borderRadius: 12,
      borderWidth: 1,
      shadowColor: '#000000',
      shadowOpacity: 0.08,
    },
    buttonStyle: {
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  },

  // VARIANT 3: GRADIENT FLOW - Modern, dynamic, Gen-Z appeal
  gradientFlow: {
    name: 'Gradient Flow',
    description: 'Dynamic gradients with glass morphism. Modern, app-native feel with purple-to-blue flows.',
    colors: {
      background: '#0F0F23',
      surface: 'rgba(255,255,255,0.08)',
      surfaceElevated: 'rgba(255,255,255,0.12)',
      primary: '#8B5CF6',
      secondary: '#06B6D4',
      accent: '#F472B6',
      text: '#FFFFFF',
      textSecondary: 'rgba(255,255,255,0.7)',
      textMuted: 'rgba(255,255,255,0.5)',
      border: 'rgba(255,255,255,0.1)',
      success: '#34D399',
      cardGradient: ['rgba(139,92,246,0.2)', 'rgba(6,182,212,0.1)'],
    },
    fonts: {
      heading: { fontWeight: '800', letterSpacing: -0.5 },
      body: { fontWeight: '400' },
      accent: { fontWeight: '600' },
    },
    cardStyle: {
      borderRadius: 20,
      borderWidth: 1,
      shadowColor: '#8B5CF6',
      shadowOpacity: 0.25,
    },
    buttonStyle: {
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
  },
};

// =============================================================================
// CURRENT ACTIVE THEME (Change this to switch variants)
// =============================================================================
const ACTIVE_THEME = 'cleanAcademy'; // Options: 'darkDojo', 'cleanAcademy', 'gradientFlow'

// =============================================================================
// MAIN VIDEO LIBRARY COMPONENT
// =============================================================================

export default function VideoLibraryScreen({ navigation }) {
  const { user, progress } = useAppContext();
  const [theme, setTheme] = useState(THEMES[ACTIVE_THEME]);
  const [activeTab, setActiveTab] = useState('browse'); // 'search', 'browse', 'suggested'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [playlists, setPlaylists] = useState([
    { id: 'favorites', name: 'Favorites', videos: [], icon: 'heart' },
    { id: 'watch_later', name: 'Watch Later', videos: [], icon: 'time' },
    { id: 'completed', name: 'Completed', videos: [], icon: 'checkmark-circle' },
  ]);

  const scrollY = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);

  // User's weak areas based on mock data (in production, this would come from training data)
  const weakAreas = ['escapes', 'guard passing', 'leg locks'];

  // Get suggested videos based on user's belt and gaps
  const suggestedVideos = getSuggestedVideos(
    user?.belt || 'blue',
    watchedVideos,
    weakAreas
  );

  const trendingVideos = getTrendingVideos(8);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = searchVideos(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // State for showing theme info panel
  const [showThemeInfo, setShowThemeInfo] = useState(true);

  // Render theme selector (for demo/testing purposes)
  const renderThemeSelector = () => (
    <View style={[styles.themeSelectorContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Theme Switcher Header */}
      <TouchableOpacity
        style={styles.themeSelectorHeader}
        onPress={() => setShowThemeInfo(!showThemeInfo)}
      >
        <View style={styles.themeSelectorTitleRow}>
          <Ionicons name="color-palette" size={18} color={theme.colors.primary} />
          <Text style={[styles.themeSelectorTitle, { color: theme.colors.text }]}>
            DESIGN VARIANT TESTER
          </Text>
        </View>
        <Ionicons
          name={showThemeInfo ? "chevron-up" : "chevron-down"}
          size={18}
          color={theme.colors.textMuted}
        />
      </TouchableOpacity>

      {/* Theme Buttons - Always Visible */}
      <View style={styles.themeButtonsRow}>
        {Object.entries(THEMES).map(([key, t]) => {
          const isActive = theme.name === t.name;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.themeButtonLarge,
                {
                  backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceElevated,
                  borderColor: isActive ? theme.colors.primary : theme.colors.border,
                  borderWidth: isActive ? 2 : 1,
                }
              ]}
              onPress={() => setTheme(t)}
            >
              <View style={[
                styles.themeButtonIcon,
                { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : t.colors.primary + '20' }
              ]}>
                <Ionicons
                  name={key === 'darkDojo' ? 'moon' : key === 'cleanAcademy' ? 'sunny' : 'sparkles'}
                  size={20}
                  color={isActive ? '#FFFFFF' : t.colors.primary}
                />
              </View>
              <Text style={[
                styles.themeButtonLabel,
                { color: isActive ? '#FFFFFF' : theme.colors.text }
              ]}>
                {t.name}
              </Text>
              {isActive && (
                <View style={styles.activeIndicator}>
                  <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Expandable Theme Description */}
      {showThemeInfo && (
        <View style={[styles.themeInfoPanel, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
          <Text style={[styles.themeInfoName, { color: theme.colors.primary }]}>
            {theme.name}
          </Text>
          <Text style={[styles.themeInfoDescription, { color: theme.colors.textSecondary }]}>
            {theme.description}
          </Text>
          <View style={styles.themeColorPreview}>
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.secondary }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.accent }]} />
            <View style={[styles.colorSwatch, { backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border }]} />
          </View>
        </View>
      )}
    </View>
  );

  // =============================================================================
  // HEADER WITH SEARCH, BROWSE, SUGGESTED TABS
  // =============================================================================
  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      {/* Logo & Title */}
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="videocam" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={[styles.logoText, theme.fonts.heading, { color: theme.colors.text }]}>
              ALLY
            </Text>
            <Text style={[styles.logoSubtext, { color: theme.colors.textSecondary }]}>
              BJJ VIDEO LIBRARY
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="notifications-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="bookmark-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation: Search, Browse, Suggested */}
      <View style={[styles.tabContainer, { borderBottomColor: theme.colors.border }]}>
        {[
          { id: 'search', label: 'Search', icon: 'search' },
          { id: 'browse', label: 'Browse', icon: 'grid' },
          { id: 'suggested', label: 'Suggested For You', icon: 'sparkles' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && [
                styles.tabActive,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? theme.colors.primary : theme.colors.textMuted}
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === tab.id ? theme.colors.primary : theme.colors.textMuted },
              activeTab === tab.id && theme.fonts.accent
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // =============================================================================
  // SEARCH TAB
  // =============================================================================
  const renderSearchTab = () => (
    <View style={styles.searchTab}>
      {/* Search Bar */}
      <View style={[
        styles.searchBar,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.cardStyle
        }
      ]}>
        <Ionicons name="search" size={20} color={theme.colors.textMuted} />
        <TextInput
          ref={searchInputRef}
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search techniques, instructors, positions..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchQuery(''); setSearchResults([]); }}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilters}>
        {['Guards', 'Submissions', 'Escapes', 'Passing', 'Takedowns', 'Danaher', 'Gordon Ryan'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.quickFilter,
              {
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => handleSearch(filter)}
          >
            <Text style={[styles.quickFilterText, { color: theme.colors.text }]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderVideoCard(item, 'horizontal')}
          contentContainerStyle={styles.searchResults}
        />
      ) : searchQuery.length > 1 ? (
        <View style={styles.noResults}>
          <Ionicons name="search-outline" size={48} color={theme.colors.textMuted} />
          <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
            No videos found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <View style={styles.searchSuggestions}>
          <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text }]}>
            TRENDING SEARCHES
          </Text>
          {['Triangle from closed guard', 'Side control escapes', 'Body lock passing', 'Rear naked choke finish'].map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={[styles.suggestionItem, { borderBottomColor: theme.colors.border }]}
              onPress={() => handleSearch(suggestion)}
            >
              <Ionicons name="trending-up" size={18} color={theme.colors.secondary} />
              <Text style={[styles.suggestionText, { color: theme.colors.text }]}>{suggestion}</Text>
              <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  // =============================================================================
  // BROWSE TAB - Category-based navigation (Grapplers Guide style)
  // =============================================================================
  const renderBrowseTab = () => (
    <ScrollView style={styles.browseTab} showsVerticalScrollIndicator={false}>
      {/* Category Grid */}
      <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text }]}>
        CATEGORIES
      </Text>
      <View style={styles.categoryGrid}>
        {VIDEO_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.cardStyle
              }
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              <Ionicons name={category.icon} size={28} color={category.color} />
            </View>
            <Text style={[styles.categoryName, theme.fonts.accent, { color: theme.colors.text }]}>
              {category.name}
            </Text>
            <Text style={[styles.categoryCount, { color: theme.colors.textSecondary }]}>
              {getVideosByCategory(category.id).length} videos
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Instructor Grid */}
      <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text, marginTop: 24 }]}>
        EXPERT COACHES
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.instructorRow}>
        {INSTRUCTORS.filter(i => i.featured).map((instructor) => (
          <TouchableOpacity
            key={instructor.id}
            style={[
              styles.instructorCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.cardStyle
              }
            ]}
            onPress={() => {
              // Navigate to instructor's videos
              setSearchQuery(instructor.name);
              setSearchResults(getVideosByInstructor(instructor.id));
              setActiveTab('search');
            }}
          >
            <Image
              source={{ uri: instructor.photo }}
              style={styles.instructorPhoto}
            />
            <View style={[styles.instructorBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.instructorBadgeText}>{instructor.videoCount}</Text>
            </View>
            <Text style={[styles.instructorName, theme.fonts.accent, { color: theme.colors.text }]}>
              {instructor.name}
            </Text>
            <Text style={[styles.instructorNickname, { color: theme.colors.secondary }]}>
              {instructor.nickname}
            </Text>
            <Text style={[styles.instructorSpecialty, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {instructor.specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Videos */}
      <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text, marginTop: 24 }]}>
        TRENDING NOW
      </Text>
      <FlatList
        data={trendingVideos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => renderVideoCard(item, 'compact')}
        contentContainerStyle={styles.trendingList}
      />

      {/* Playlists */}
      <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text, marginTop: 24 }]}>
        YOUR PLAYLISTS
      </Text>
      <View style={styles.playlistsRow}>
        {playlists.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={[
              styles.playlistCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.cardStyle
              }
            ]}
          >
            <View style={[styles.playlistIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Ionicons name={playlist.icon} size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.playlistName, { color: theme.colors.text }]}>{playlist.name}</Text>
            <Text style={[styles.playlistCount, { color: theme.colors.textSecondary }]}>
              {playlist.videos.length} videos
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.playlistCard,
            styles.playlistCardNew,
            { borderColor: theme.colors.primary, borderStyle: 'dashed' }
          ]}
        >
          <Ionicons name="add-circle-outline" size={32} color={theme.colors.primary} />
          <Text style={[styles.playlistName, { color: theme.colors.primary }]}>New Playlist</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // =============================================================================
  // SUGGESTED FOR YOU TAB - AI-powered recommendations
  // =============================================================================
  const renderSuggestedTab = () => (
    <ScrollView style={styles.suggestedTab} showsVerticalScrollIndicator={false}>
      {/* Philosophy Banner */}
      <View style={[
        styles.philosophyBanner,
        {
          backgroundColor: theme.name === 'Dark Dojo'
            ? 'rgba(255,59,59,0.15)'
            : theme.name === 'Gradient Flow'
            ? 'rgba(139,92,246,0.2)'
            : 'rgba(212,175,55,0.1)',
          borderColor: theme.colors.primary,
        }
      ]}>
        <View style={styles.philosophyHeader}>
          <Ionicons name="sparkles" size={24} color={theme.colors.secondary} />
          <Text style={[styles.philosophyTitle, theme.fonts.heading, { color: theme.colors.text }]}>
            YOUR TRAINING FOCUS
          </Text>
        </View>
        <Text style={[styles.philosophyText, { color: theme.colors.textSecondary }]}>
          Based on your training data, you should focus on{' '}
          <Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>escapes</Text>,{' '}
          <Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>guard passing</Text>, and{' '}
          <Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>leg lock defense</Text>.
          {'\n\n'}These videos are curated to address your specific gaps and accelerate your progress.
        </Text>
      </View>

      {/* Progress Tracker */}
      <View style={[
        styles.progressTracker,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.cardStyle
        }
      ]}>
        <Text style={[styles.progressTitle, theme.fonts.heading, { color: theme.colors.text }]}>
          WEEKLY PROGRESS
        </Text>
        <View style={styles.progressStats}>
          <View style={styles.progressStat}>
            <Text style={[styles.progressNumber, { color: theme.colors.primary }]}>12</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Videos Watched</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={[styles.progressNumber, { color: theme.colors.secondary }]}>2h 45m</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Study Time</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressStat}>
            <Text style={[styles.progressNumber, { color: theme.colors.success }]}>3</Text>
            <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>Categories</Text>
          </View>
        </View>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceElevated }]}>
          <View style={[styles.progressFill, { width: '65%', backgroundColor: theme.colors.primary }]} />
        </View>
        <Text style={[styles.progressNote, { color: theme.colors.textMuted }]}>
          65% of weekly goal completed
        </Text>
      </View>

      {/* Weak Areas Section */}
      <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text }]}>
        TECHNIQUES TO DRILL
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
        Videos targeting your identified training gaps
      </Text>

      {suggestedVideos.slice(0, 5).map((video) => renderVideoCard(video, 'horizontal'))}

      {/* Belt-Specific Recommendations */}
      <Text style={[styles.sectionTitle, theme.fonts.heading, { color: theme.colors.text, marginTop: 24 }]}>
        {user?.belt?.toUpperCase() || 'BLUE'} BELT ESSENTIALS
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
        Foundational techniques for your current level
      </Text>

      <FlatList
        data={suggestedVideos.slice(5, 10)}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => renderVideoCard(item, 'compact')}
        contentContainerStyle={styles.trendingList}
      />

      <View style={{ height: 100 }} />
    </ScrollView>
  );

  // =============================================================================
  // VIDEO CARD COMPONENT
  // =============================================================================
  const renderVideoCard = (video, layout = 'vertical') => {
    const isWatched = watchedVideos.includes(video.id);

    if (layout === 'horizontal') {
      return (
        <TouchableOpacity
          style={[
            styles.videoCardHorizontal,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              ...theme.cardStyle
            }
          ]}
          onPress={() => {
            setSelectedVideo(video);
            setShowVideoModal(true);
          }}
        >
          <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnailHorizontal} />
          <View style={styles.videoDuration}>
            <Text style={styles.videoDurationText}>{formatDuration(video.duration)}</Text>
          </View>
          {isWatched && (
            <View style={[styles.watchedBadge, { backgroundColor: theme.colors.success }]}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
          <View style={styles.videoInfoHorizontal}>
            <Text style={[styles.videoTitle, theme.fonts.accent, { color: theme.colors.text }]} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={[styles.videoInstructor, { color: theme.colors.secondary }]}>
              {video.instructor}
            </Text>
            <View style={styles.videoMeta}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(video.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(video.difficulty) }]}>
                  {video.difficulty}
                </Text>
              </View>
              <Text style={[styles.videoViews, { color: theme.colors.textMuted }]}>
                {formatViews(video.views)} views
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Compact layout for horizontal scrolling lists
    return (
      <TouchableOpacity
        style={[
          styles.videoCardCompact,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            ...theme.cardStyle
          }
        ]}
        onPress={() => {
          setSelectedVideo(video);
          setShowVideoModal(true);
        }}
      >
        <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnailCompact} />
        <View style={styles.videoDuration}>
          <Text style={styles.videoDurationText}>{formatDuration(video.duration)}</Text>
        </View>
        <View style={styles.videoInfoCompact}>
          <Text style={[styles.videoTitleCompact, { color: theme.colors.text }]} numberOfLines={2}>
            {video.title}
          </Text>
          <Text style={[styles.videoInstructorCompact, { color: theme.colors.textSecondary }]}>
            {video.instructor}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // =============================================================================
  // VIDEO DETAIL MODAL
  // =============================================================================
  const renderVideoModal = () => {
    if (!selectedVideo) return null;

    return (
      <Modal
        visible={showVideoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowVideoModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Video Player Placeholder */}
          <View style={styles.videoPlayer}>
            <Image
              source={{ uri: selectedVideo.thumbnail }}
              style={styles.videoPlayerImage}
            />
            <View style={styles.playButtonOverlay}>
              <TouchableOpacity style={[styles.playButton, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name="play" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVideoModal(false)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Video Info */}
            <Text style={[styles.modalTitle, theme.fonts.heading, { color: theme.colors.text }]}>
              {selectedVideo.title}
            </Text>
            <View style={styles.modalMeta}>
              <TouchableOpacity style={styles.instructorLink}>
                <Text style={[styles.modalInstructor, { color: theme.colors.primary }]}>
                  {selectedVideo.instructor}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.modalDuration, { color: theme.colors.textSecondary }]}>
                • {formatDuration(selectedVideo.duration)}
              </Text>
              <Text style={[styles.modalViews, { color: theme.colors.textSecondary }]}>
                • {formatViews(selectedVideo.views)} views
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surfaceElevated }]}>
                <Ionicons name="heart-outline" size={22} color={theme.colors.text} />
                <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Favorite</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surfaceElevated }]}>
                <Ionicons name="time-outline" size={22} color={theme.colors.text} />
                <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Watch Later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surfaceElevated }]}>
                <Ionicons name="share-outline" size={22} color={theme.colors.text} />
                <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surfaceElevated }]}>
                <Ionicons name="add-outline" size={22} color={theme.colors.text} />
                <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>Playlist</Text>
              </TouchableOpacity>
            </View>

            {/* Description */}
            <View style={[styles.descriptionBox, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
                {selectedVideo.description}
              </Text>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {selectedVideo.tags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.tagText, { color: theme.colors.text }]}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Belt Levels */}
            <Text style={[styles.modalSectionTitle, theme.fonts.accent, { color: theme.colors.text }]}>
              Recommended for:
            </Text>
            <View style={styles.beltLevels}>
              {selectedVideo.beltLevel.map((belt) => (
                <View key={belt} style={[styles.beltBadge, { backgroundColor: getBeltColor(belt) }]}>
                  <Text style={styles.beltBadgeText}>{belt.charAt(0).toUpperCase() + belt.slice(1)}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  // =============================================================================
  // CATEGORY DETAIL MODAL
  // =============================================================================
  const renderCategoryModal = () => {
    if (!selectedCategory) return null;

    const categoryVideos = getVideosByCategory(selectedCategory.id);

    return (
      <Modal
        visible={!!selectedCategory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.categoryModalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <View style={styles.categoryModalTitleContainer}>
              <View style={[styles.categoryModalIcon, { backgroundColor: selectedCategory.color + '20' }]}>
                <Ionicons name={selectedCategory.icon} size={24} color={selectedCategory.color} />
              </View>
              <Text style={[styles.categoryModalTitle, theme.fonts.heading, { color: theme.colors.text }]}>
                {selectedCategory.name}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="filter" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Subcategories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subcategoryRow}>
            <TouchableOpacity
              style={[styles.subcategoryChip, styles.subcategoryChipActive, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={[styles.subcategoryChipText, { color: '#FFFFFF' }]}>All</Text>
            </TouchableOpacity>
            {selectedCategory.subcategories.map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={[styles.subcategoryChip, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.subcategoryChipText, { color: theme.colors.text }]}>{sub.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Videos List */}
          <FlatList
            data={categoryVideos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderVideoCard(item, 'horizontal')}
            contentContainerStyle={styles.categoryVideosList}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  // =============================================================================
  // HELPER FUNCTIONS
  // =============================================================================
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getBeltColor = (belt) => {
    switch (belt.toLowerCase()) {
      case 'white': return '#E5E7EB';
      case 'blue': return '#2563EB';
      case 'purple': return '#7C3AED';
      case 'brown': return '#92400E';
      case 'black': return '#1F2937';
      default: return '#6B7280';
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(0) + 'K';
    return views.toString();
  };

  // =============================================================================
  // MAIN RENDER
  // =============================================================================
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <StatusBar
        barStyle={theme.name === 'Clean Academy' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.colors.background}
      />

      {renderThemeSelector()}
      {renderHeader()}

      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'browse' && renderBrowseTab()}
      {activeTab === 'suggested' && renderSuggestedTab()}

      {renderVideoModal()}
      {renderCategoryModal()}
    </SafeAreaView>
  );
}

// =============================================================================
// STYLES
// =============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Theme Selector - Enhanced for testing
  themeSelectorContainer: {
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  themeSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  themeSelectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeSelectorTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  themeButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  themeButtonLarge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    position: 'relative',
  },
  themeButtonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  themeButtonLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  themeInfoPanel: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  themeInfoName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  themeInfoDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  themeColorPreview: {
    flexDirection: 'row',
    gap: 8,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  // Header
  header: {
    paddingTop: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 20,
  },
  logoSubtext: {
    fontSize: 10,
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Search Tab
  searchTab: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  quickFilters: {
    marginBottom: 16,
  },
  quickFilter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  quickFilterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  searchResults: {
    paddingBottom: 100,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 15,
  },
  searchSuggestions: {
    marginTop: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
  },

  // Browse Tab
  browseTab: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },

  // Instructor Row
  instructorRow: {
    marginBottom: 8,
  },
  instructorCard: {
    width: 140,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  instructorPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  instructorBadge: {
    position: 'absolute',
    top: 76,
    right: 24,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructorBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  instructorName: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 2,
  },
  instructorNickname: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  instructorSpecialty: {
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Trending List
  trendingList: {
    paddingRight: 16,
  },

  // Playlists
  playlistsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  playlistCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  playlistCardNew: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  playlistName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 12,
  },

  // Suggested Tab
  suggestedTab: {
    flex: 1,
    padding: 16,
  },
  philosophyBanner: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  philosophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  philosophyTitle: {
    fontSize: 14,
  },
  philosophyText: {
    fontSize: 14,
    lineHeight: 22,
  },

  // Progress Tracker
  progressTracker: {
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  progressTitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressNote: {
    fontSize: 11,
    textAlign: 'center',
  },

  // Video Cards
  videoCardHorizontal: {
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoThumbnailHorizontal: {
    width: 140,
    height: 90,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  watchedBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfoHorizontal: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 18,
  },
  videoInstructor: {
    fontSize: 12,
    marginBottom: 6,
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  videoViews: {
    fontSize: 11,
  },

  // Compact Video Card
  videoCardCompact: {
    width: 200,
    marginRight: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoThumbnailCompact: {
    width: '100%',
    height: 112,
  },
  videoInfoCompact: {
    padding: 10,
  },
  videoTitleCompact: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 17,
  },
  videoInstructorCompact: {
    fontSize: 11,
  },

  // Video Modal
  modalContainer: {
    flex: 1,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoPlayerImage: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 8,
    lineHeight: 26,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructorLink: {},
  modalInstructor: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalDuration: {
    fontSize: 13,
    marginLeft: 8,
  },
  modalViews: {
    fontSize: 13,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 11,
    marginTop: 4,
  },
  descriptionBox: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
  },
  modalSectionTitle: {
    fontSize: 13,
    marginBottom: 10,
  },
  beltLevels: {
    flexDirection: 'row',
    gap: 8,
  },
  beltBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  beltBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Category Modal
  categoryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  categoryModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryModalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryModalTitle: {
    fontSize: 16,
  },
  subcategoryRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  subcategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  subcategoryChipActive: {
    borderWidth: 0,
  },
  subcategoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoryVideosList: {
    padding: 16,
  },
});
