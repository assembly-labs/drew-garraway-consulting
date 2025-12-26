import React, { useState, useMemo } from 'react';
import { AnimationRegistryEntry } from '../../registry/types';
import { allAnimations, getAllCategories, searchAnimations, getAnimationsByCategory } from '../../registry';
import styles from './AnimationGallery.module.css';

export interface AnimationGalleryProps {
  /** Callback when an animation card is clicked */
  onSelectAnimation?: (animation: AnimationRegistryEntry) => void;
}

/**
 * AnimationGallery - Visual grid for browsing all animations
 *
 * Features:
 * - Search by name, description, or keywords
 * - Filter by category
 * - Visual preview cards
 * - Click to navigate to editing booth
 */
export const AnimationGallery: React.FC<AnimationGalleryProps> = ({ onSelectAnimation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => getAllCategories(), []);

  // Filter animations based on search and category
  const filteredAnimations = useMemo(() => {
    let results = allAnimations;

    // Apply search filter
    if (searchQuery.trim()) {
      results = searchAnimations(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      results = results.filter((a) => a.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);

  // Group by category for display
  const groupedAnimations = useMemo(() => {
    const groups: Record<string, AnimationRegistryEntry[]> = {};
    filteredAnimations.forEach((animation) => {
      if (!groups[animation.category]) {
        groups[animation.category] = [];
      }
      groups[animation.category].push(animation);
    });
    return groups;
  }, [filteredAnimations]);

  const handleCardClick = (animation: AnimationRegistryEntry) => {
    if (onSelectAnimation) {
      onSelectAnimation(animation);
    }
  };

  return (
    <div className={styles.gallery}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Animation Gallery</h1>
        <p className={styles.subtitle}>
          Browse {allAnimations.length} animations across {categories.length} categories.
          Click any animation to open the Editing Booth and customize it.
        </p>
      </header>

      {/* Search and Filters */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search animations... (e.g., fade, bounce, loading)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.categoryFilters}>
          <button
            className={`${styles.categoryButton} ${!selectedCategory ? styles.active : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsCount}>
        Showing {filteredAnimations.length} of {allAnimations.length} animations
      </div>

      {/* Empty state */}
      {filteredAnimations.length === 0 && (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <p className={styles.emptyText}>No animations found for "{searchQuery}"</p>
        </div>
      )}

      {/* Animation cards grouped by category */}
      {Object.entries(groupedAnimations).map(([category, animations]) => (
        <section key={category} className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <svg className={styles.categoryIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <span className={styles.categoryCount}>({animations.length})</span>
          </div>

          <div className={styles.grid}>
            {animations.map((animation) => (
              <article
                key={animation.id}
                className={styles.card}
                onClick={() => handleCardClick(animation)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(animation);
                  }
                }}
              >
                <div className={styles.cardPreview}>
                  <div className={styles.cardPreviewBox} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardName}>{animation.name}</h3>
                  <p className={styles.cardDescription}>{animation.description}</p>
                  <div className={styles.cardKeywords}>
                    {animation.keywords.slice(0, 4).map((keyword) => (
                      <span key={keyword} className={styles.cardKeyword}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default AnimationGallery;
