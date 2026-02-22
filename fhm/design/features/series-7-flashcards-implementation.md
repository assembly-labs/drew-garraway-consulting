# Series 7 Flashcards - Technical Implementation Plan

_Building on SIE flashcard infrastructure with spaced repetition from day one_

---

## Architecture Overview

### Approach: Extend, Don't Duplicate

The SIE flashcard system has solid foundations. Rather than duplicating code, we'll:

1. Create Series 7-specific modules that extend/override SIE modules
2. Share common utilities (gestures, animations, localStorage helpers)
3. Add new capabilities: topic filtering, true spaced repetition, streak tracking

```
assets/js/flashcards/
├── flashcard-data.js           # SIE data loader
├── flashcard-progress.js       # SIE progress (basic)
├── flashcard-session.js        # SIE session management
├── flashcard-ui.js             # SIE UI
│
└── series7/                    # NEW - Series 7 enhancements
    ├── s7-data.js              # Topic-aware data loader
    ├── s7-spaced-rep.js        # Leitner algorithm
    ├── s7-progress.js          # Enhanced progress with SRS
    ├── s7-session.js           # Topic-filtered sessions
    ├── s7-ui.js                # UI with topic picker
    └── s7-streak.js            # Streak tracking
```

---

## File Structure

### New Files to Create

```
fhm/
├── pages/series-7/
│   └── series-7-flashcards.html        # Main flashcard page
│
├── assets/
│   ├── css/
│   │   └── series-7-flashcards.css     # Extend SIE styles
│   │
│   ├── js/flashcards/series7/
│   │   ├── s7-data.js                  # Data with topic hierarchy
│   │   ├── s7-spaced-rep.js            # Spaced repetition algorithm
│   │   ├── s7-progress.js              # Progress with SRS tracking
│   │   ├── s7-session.js               # Session with topic filter
│   │   ├── s7-ui.js                    # UI components
│   │   └── s7-streak.js                # Streak management
│   │
│   └── data/
│       └── series-7-flashcards.json    # Card data
│
└── content/series-7/
    └── flashcards/                     # Source flashcard content
        ├── section-01/
        ├── section-02/
        ├── section-03/
        │   ├── options/
        │   ├── munis/
        │   └── ...
        └── section-04/
```

---

## Module Specifications

### 1. s7-spaced-rep.js - Leitner Spaced Repetition

```javascript
/**
 * Leitner Spaced Repetition System
 *
 * 5-box system with intervals:
 * Box 0: New/Reset     → Review immediately
 * Box 1: Learning      → Review in 1 day
 * Box 2: Familiar      → Review in 3 days
 * Box 3: Proficient    → Review in 7 days
 * Box 4: Mastered      → Review in 14 days
 * Box 5: Expert        → Review in 30 days
 */

const S7SpacedRep = (function () {
  // Review intervals in days for each box level
  const INTERVALS = [0, 1, 3, 7, 14, 30];

  /**
   * Calculate next review date based on current box
   * @param {number} box - Current box level (0-5)
   * @returns {string} ISO date string for next review
   */
  function getNextReviewDate(box) {
    const days = INTERVALS[Math.min(box, 5)];
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  /**
   * Process "Got It" response
   * Move card up one box (max 5)
   * @param {Object} cardProgress - Current card progress
   * @returns {Object} Updated progress
   */
  function onCorrect(cardProgress) {
    const newBox = Math.min((cardProgress.box || 0) + 1, 5);
    return {
      ...cardProgress,
      box: newBox,
      nextReview: getNextReviewDate(newBox),
      lastSeen: new Date().toISOString(),
      correctCount: (cardProgress.correctCount || 0) + 1,
      streak: (cardProgress.streak || 0) + 1,
    };
  }

  /**
   * Process "Don't Know" response
   * Move card back to box 0 or 1 (configurable)
   * @param {Object} cardProgress - Current card progress
   * @returns {Object} Updated progress
   */
  function onIncorrect(cardProgress) {
    // Drop to box 1 (not 0) to avoid frustration
    // But reset streak
    return {
      ...cardProgress,
      box: Math.max((cardProgress.box || 0) - 2, 0),
      nextReview: getNextReviewDate(0), // Review soon
      lastSeen: new Date().toISOString(),
      incorrectCount: (cardProgress.incorrectCount || 0) + 1,
      streak: 0,
    };
  }

  /**
   * Check if a card is due for review
   * @param {Object} cardProgress - Card progress data
   * @returns {boolean} True if card should be reviewed
   */
  function isDue(cardProgress) {
    if (!cardProgress.nextReview) return true; // Never seen

    const today = new Date().toISOString().split('T')[0];
    return cardProgress.nextReview <= today;
  }

  /**
   * Get cards due for review from a deck
   * @param {Array} cards - All cards
   * @param {Object} progressData - All progress data
   * @returns {Array} Cards due for review
   */
  function getDueCards(cards, progressData) {
    return cards.filter(card => {
      const progress = progressData[card.id];
      return !progress || isDue(progress);
    });
  }

  /**
   * Get mastery level label
   * @param {number} box - Box level
   * @returns {string} Human-readable level
   */
  function getMasteryLabel(box) {
    const labels = ['New', 'Learning', 'Familiar', 'Proficient', 'Mastered', 'Expert'];
    return labels[Math.min(box || 0, 5)];
  }

  return {
    INTERVALS,
    getNextReviewDate,
    onCorrect,
    onIncorrect,
    isDue,
    getDueCards,
    getMasteryLabel,
  };
})();
```

### 2. s7-progress.js - Enhanced Progress Tracking

```javascript
/**
 * Series 7 Progress Module
 * Extends SIE progress with spaced repetition and topic tracking
 */

const S7Progress = (function () {
  const STORAGE_KEY = 'fhm-series7-flashcards';

  const DEFAULT_DATA = {
    version: 1,
    cards: {}, // Per-card SRS data
    topics: {}, // Per-topic stats
    streak: {
      current: 0,
      longest: 0,
      lastStudyDate: null,
    },
    sessions: [], // Session history (last 30)
    settings: {
      cardsPerSession: 20,
      includeNewCards: true,
      prioritizeWeakTopics: true,
    },
  };

  function getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { ...DEFAULT_DATA };
    } catch (e) {
      console.error('Progress load error:', e);
      return { ...DEFAULT_DATA };
    }
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Progress save error:', e);
    }
  }

  /**
   * Update card progress after response
   */
  function updateCard(cardId, isCorrect) {
    const data = getData();
    const current = data.cards[cardId] || { box: 0 };

    data.cards[cardId] = isCorrect
      ? S7SpacedRep.onCorrect(current)
      : S7SpacedRep.onIncorrect(current);

    saveData(data);
    return data.cards[cardId];
  }

  /**
   * Get all card progress
   */
  function getAllCardProgress() {
    return getData().cards;
  }

  /**
   * Get stats for a specific topic
   */
  function getTopicStats(topicId, cards) {
    const data = getData();
    const topicCards = cards.filter(c => c.topic === topicId || c.subsection === topicId);

    let mastered = 0,
      learning = 0,
      newCards = 0;

    topicCards.forEach(card => {
      const progress = data.cards[card.id];
      if (!progress) {
        newCards++;
      } else if (progress.box >= 4) {
        mastered++;
      } else {
        learning++;
      }
    });

    return {
      total: topicCards.length,
      mastered,
      learning,
      new: newCards,
      percentage: topicCards.length > 0 ? Math.round((mastered / topicCards.length) * 100) : 0,
    };
  }

  /**
   * Update study streak
   */
  function updateStreak() {
    const data = getData();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = data.streak.lastStudyDate;

    if (lastDate === today) {
      // Already studied today
      return data.streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      // Continuing streak
      data.streak.current++;
    } else {
      // Streak broken, start fresh
      data.streak.current = 1;
    }

    data.streak.longest = Math.max(data.streak.longest, data.streak.current);
    data.streak.lastStudyDate = today;

    saveData(data);
    return data.streak;
  }

  /**
   * Get overall statistics
   */
  function getOverallStats(allCards) {
    const data = getData();
    let mastered = 0,
      learning = 0,
      newCards = 0,
      due = 0;

    allCards.forEach(card => {
      const progress = data.cards[card.id];
      if (!progress) {
        newCards++;
        due++;
      } else {
        if (progress.box >= 4) mastered++;
        else learning++;

        if (S7SpacedRep.isDue(progress)) due++;
      }
    });

    return {
      total: allCards.length,
      mastered,
      learning,
      new: newCards,
      due,
      streak: data.streak,
    };
  }

  /**
   * Save session to history
   */
  function saveSession(sessionData) {
    const data = getData();

    data.sessions.unshift({
      date: new Date().toISOString(),
      ...sessionData,
    });

    // Keep last 30 sessions
    data.sessions = data.sessions.slice(0, 30);

    saveData(data);
  }

  /**
   * Export progress (for backup)
   */
  function exportProgress() {
    return JSON.stringify(getData(), null, 2);
  }

  /**
   * Import progress (from backup)
   */
  function importProgress(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.version) {
        saveData(data);
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  }

  /**
   * Reset all progress
   */
  function reset() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    updateCard,
    getAllCardProgress,
    getTopicStats,
    updateStreak,
    getOverallStats,
    saveSession,
    exportProgress,
    importProgress,
    reset,
  };
})();
```

### 3. s7-data.js - Topic-Aware Data Loader

```javascript
/**
 * Series 7 Data Module
 * Loads and organizes flashcard data with topic hierarchy
 */

const S7Data = (function () {
  let allCards = [];
  let topicHierarchy = {};
  let loaded = false;

  const DATA_URL = '../../assets/data/series-7-flashcards.json';

  /**
   * Load flashcard data
   */
  async function load() {
    if (loaded) return true;

    try {
      const response = await fetch(DATA_URL);
      const data = await response.json();

      allCards = data.cards || [];
      topicHierarchy = buildHierarchy(allCards);
      loaded = true;

      return true;
    } catch (error) {
      console.error('Failed to load flashcard data:', error);
      return false;
    }
  }

  /**
   * Build topic hierarchy from cards
   */
  function buildHierarchy(cards) {
    const hierarchy = {
      sections: {},
    };

    cards.forEach(card => {
      const sectionId = `section-${card.section}`;

      if (!hierarchy.sections[sectionId]) {
        hierarchy.sections[sectionId] = {
          id: sectionId,
          name: getSectionName(card.section),
          weight: getSectionWeight(card.section),
          subsections: {},
          cardCount: 0,
        };
      }

      hierarchy.sections[sectionId].cardCount++;

      if (card.subsection) {
        const subsectionId = card.subsection;
        if (!hierarchy.sections[sectionId].subsections[subsectionId]) {
          hierarchy.sections[sectionId].subsections[subsectionId] = {
            id: subsectionId,
            name: formatSubsectionName(subsectionId),
            cardCount: 0,
          };
        }
        hierarchy.sections[sectionId].subsections[subsectionId].cardCount++;
      }
    });

    return hierarchy;
  }

  function getSectionName(num) {
    const names = {
      1: 'Seeks Business',
      2: 'Opens Accounts',
      3: 'Provides Information',
      4: 'Processes Transactions',
    };
    return names[num] || `Section ${num}`;
  }

  function getSectionWeight(num) {
    const weights = { 1: 9, 2: 11, 3: 73, 4: 7 };
    return weights[num] || 0;
  }

  function formatSubsectionName(id) {
    return id
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get all cards
   */
  function getAll() {
    return allCards;
  }

  /**
   * Get cards filtered by topic
   */
  function getByTopic(topicFilter) {
    if (!topicFilter || topicFilter === 'all') {
      return allCards;
    }

    if (topicFilter.startsWith('section-')) {
      const sectionNum = parseInt(topicFilter.split('-')[1]);
      return allCards.filter(c => c.section === sectionNum);
    }

    // Subsection filter
    return allCards.filter(c => c.subsection === topicFilter);
  }

  /**
   * Get cards due for review (with optional topic filter)
   */
  function getDueCards(topicFilter = 'all') {
    const progress = S7Progress.getAllCardProgress();
    const filtered = getByTopic(topicFilter);
    return S7SpacedRep.getDueCards(filtered, progress);
  }

  /**
   * Get topic hierarchy
   */
  function getHierarchy() {
    return topicHierarchy;
  }

  /**
   * Get card by ID
   */
  function getById(id) {
    return allCards.find(c => c.id === id);
  }

  return {
    load,
    getAll,
    getByTopic,
    getDueCards,
    getHierarchy,
    getById,
  };
})();
```

### 4. s7-session.js - Topic-Filtered Sessions

```javascript
/**
 * Series 7 Session Module
 * Manages study sessions with topic filtering and SRS integration
 */

const S7Session = (function () {
  let queue = [];
  let currentIndex = 0;
  let sessionConfig = {};
  let stats = {
    total: 0,
    correct: 0,
    incorrect: 0,
    newCards: 0,
  };
  let active = false;

  /**
   * Start a new session
   * @param {Object} config - Session configuration
   * @param {string} config.mode - 'all' | 'due' | 'new' | 'weak'
   * @param {string} config.topic - Topic filter
   * @param {number} config.limit - Max cards
   */
  function start(config = {}) {
    sessionConfig = {
      mode: config.mode || 'due',
      topic: config.topic || 'all',
      limit: config.limit || 20,
    };

    queue = buildQueue(sessionConfig);
    currentIndex = 0;
    stats = { total: queue.length, correct: 0, incorrect: 0, newCards: 0 };
    active = queue.length > 0;

    if (active) {
      S7Progress.updateStreak();
    }

    return active;
  }

  function buildQueue(config) {
    let cards = [];
    const progress = S7Progress.getAllCardProgress();

    switch (config.mode) {
      case 'due':
        cards = S7Data.getDueCards(config.topic);
        break;
      case 'new':
        cards = S7Data.getByTopic(config.topic).filter(c => !progress[c.id]);
        break;
      case 'weak':
        cards = S7Data.getByTopic(config.topic).filter(
          c => progress[c.id] && progress[c.id].box < 3
        );
        break;
      default:
        cards = S7Data.getByTopic(config.topic);
    }

    // Shuffle and limit
    cards = shuffleArray(cards).slice(0, config.limit);

    // Count new cards
    cards.forEach(c => {
      if (!progress[c.id]) stats.newCards++;
    });

    return cards;
  }

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function getCurrentCard() {
    if (!active || currentIndex >= queue.length) return null;
    return queue[currentIndex];
  }

  function markCorrect() {
    const card = getCurrentCard();
    if (!card) return;

    S7Progress.updateCard(card.id, true);
    stats.correct++;
    currentIndex++;
  }

  function markIncorrect() {
    const card = getCurrentCard();
    if (!card) return;

    S7Progress.updateCard(card.id, false);
    stats.incorrect++;

    // Requeue at end for retry
    queue.push(card);
    currentIndex++;
  }

  function getProgress() {
    return {
      current: currentIndex + 1,
      total: stats.total,
      remaining: queue.length - currentIndex,
      percentage: stats.total > 0 ? Math.round((currentIndex / stats.total) * 100) : 0,
    };
  }

  function getStats() {
    return { ...stats };
  }

  function end() {
    if (!active) return;

    S7Progress.saveSession({
      topic: sessionConfig.topic,
      mode: sessionConfig.mode,
      ...stats,
    });

    active = false;
  }

  function isActive() {
    return active;
  }

  function isComplete() {
    return !active || currentIndex >= queue.length;
  }

  return {
    start,
    getCurrentCard,
    markCorrect,
    markIncorrect,
    getProgress,
    getStats,
    end,
    isActive,
    isComplete,
  };
})();
```

---

## Data Schema

### series-7-flashcards.json

```json
{
  "meta": {
    "version": 1,
    "generated": "2024-01-15T00:00:00Z",
    "totalCards": 420,
    "sections": {
      "1": { "name": "Seeks Business", "weight": 9, "cardCount": 25 },
      "2": { "name": "Opens Accounts", "weight": 11, "cardCount": 45 },
      "3": { "name": "Provides Information", "weight": 73, "cardCount": 320 },
      "4": { "name": "Processes Transactions", "weight": 7, "cardCount": 30 }
    }
  },
  "cards": [
    {
      "id": "s7-opt-001",
      "front": "What is a protective put?",
      "back": "Buying a put option on stock you already own to limit downside risk while maintaining upside potential.",
      "type": "term",
      "section": 3,
      "subsection": "options",
      "chapter": "strategies",
      "difficulty": "medium",
      "tags": ["options", "strategies", "hedging"],
      "weight": 1.2,
      "memoryAid": "Think 'insurance policy' - paying premium for protection",
      "example": "Own 100 XYZ at $50. Buy XYZ 50 Put @ $3. Max loss = $300."
    },
    {
      "id": "s7-opt-002",
      "front": "How do you calculate breakeven for a LONG CALL?",
      "back": "Breakeven = Strike Price + Premium Paid",
      "type": "formula",
      "section": 3,
      "subsection": "options",
      "chapter": "calculations",
      "difficulty": "medium",
      "tags": ["options", "formulas", "breakeven"],
      "weight": 1.5,
      "memoryAid": "Call UP - add premium to strike to go UP to breakeven",
      "example": "Buy ABC Jan 50 Call @ $3. BE = $50 + $3 = $53"
    }
  ]
}
```

### Card Type Definitions

| Type         | Description        | Back Format                             |
| ------------ | ------------------ | --------------------------------------- |
| `term`       | Definition/concept | Direct answer + brief explanation       |
| `formula`    | Calculation        | Formula + worked example                |
| `comparison` | A vs B             | Bullet points for each + key difference |
| `rule`       | Regulation         | Rule statement + example + consequence  |
| `scenario`   | What-if question   | Answer + reasoning + why it works       |

---

## UI Components

### Topic Picker (New Component)

```html
<div class="topic-picker" id="topic-picker">
  <div class="topic-picker__header">
    <h3>Select Topic</h3>
    <button class="topic-picker__close">&times;</button>
  </div>

  <div class="topic-picker__search">
    <input type="search" placeholder="Search topics..." />
  </div>

  <div class="topic-picker__list">
    <!-- Section 1 -->
    <div class="topic-section">
      <button class="topic-section__header" data-section="1">
        <span class="topic-section__name">Section 1: Seeks Business</span>
        <span class="topic-section__meta">9% • 25 cards</span>
        <span class="topic-section__progress">████████░░ 80%</span>
      </button>
      <div class="topic-section__items">
        <button class="topic-item" data-topic="prospecting">
          <span>Prospecting</span>
          <span class="topic-item__count">15</span>
        </button>
        <!-- more items -->
      </div>
    </div>

    <!-- Section 3 (expanded by default - 73%) -->
    <div class="topic-section topic-section--expanded">
      <button class="topic-section__header" data-section="3">
        <span class="topic-section__name">Section 3: Provides Info</span>
        <span class="topic-section__meta">73% • 320 cards</span>
      </button>
      <div class="topic-section__items">
        <button class="topic-item topic-item--weak" data-topic="options">
          <span>Options</span>
          <span class="topic-item__progress">███░░░░░░░ 30%</span>
          <span class="topic-item__count">80</span>
        </button>
        <!-- nested subsections -->
      </div>
    </div>
  </div>
</div>
```

### Session Mode Selector

```html
<div class="session-modes">
  <button class="session-mode session-mode--active" data-mode="due">
    <span class="session-mode__icon">⏰</span>
    <span class="session-mode__label">Due for Review</span>
    <span class="session-mode__count">23</span>
  </button>

  <button class="session-mode" data-mode="all">
    <span class="session-mode__icon">📚</span>
    <span class="session-mode__label">All Cards</span>
    <span class="session-mode__count">420</span>
  </button>

  <button class="session-mode" data-mode="new">
    <span class="session-mode__icon">✨</span>
    <span class="session-mode__label">New Cards</span>
    <span class="session-mode__count">45</span>
  </button>

  <button class="session-mode" data-mode="weak">
    <span class="session-mode__icon">🎯</span>
    <span class="session-mode__label">Weak Areas</span>
    <span class="session-mode__count">18</span>
  </button>
</div>
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (Days 1-2)

| Task                    | File                            | Priority |
| ----------------------- | ------------------------------- | -------- |
| Create s7-spaced-rep.js | `assets/js/flashcards/series7/` | P0       |
| Create s7-progress.js   | `assets/js/flashcards/series7/` | P0       |
| Create s7-data.js       | `assets/js/flashcards/series7/` | P0       |
| Create s7-session.js    | `assets/js/flashcards/series7/` | P0       |
| Create card JSON schema | `assets/data/`                  | P0       |
| Create 20 test cards    | `assets/data/`                  | P0       |

### Phase 2: UI & Integration (Days 3-4)

| Task                   | File                            | Priority |
| ---------------------- | ------------------------------- | -------- |
| Create HTML page       | `pages/series-7/`               | P0       |
| Create/extend CSS      | `assets/css/`                   | P0       |
| Create s7-ui.js        | `assets/js/flashcards/series7/` | P0       |
| Topic picker component | In s7-ui.js                     | P0       |
| Session mode selector  | In s7-ui.js                     | P0       |
| Card type badges       | CSS                             | P1       |

### Phase 3: Content & Polish (Days 5-7)

| Task                         | File           | Priority |
| ---------------------------- | -------------- | -------- |
| Generate Section 3 cards     | `assets/data/` | P0       |
| Generate Section 1-2-4 cards | `assets/data/` | P1       |
| Streak display               | UI             | P1       |
| Weak area summary            | UI             | P1       |
| Formula card styling         | CSS            | P1       |
| Mobile testing               | -              | P0       |

---

## Testing Checklist

### Functional Tests

- [ ] Spaced repetition intervals calculate correctly
- [ ] Cards due today appear in "Due for Review"
- [ ] Topic filter shows correct cards
- [ ] Progress persists across sessions
- [ ] Streak increments daily, resets on skip
- [ ] Incorrect cards requeue in session
- [ ] Export/import progress works

### Mobile Tests

- [ ] Swipe gestures work on iOS Safari
- [ ] Swipe gestures work on Android Chrome
- [ ] Safe area insets render correctly
- [ ] No rubber-banding on scroll
- [ ] Touch targets are 44px minimum
- [ ] Night mode activates correctly

### Edge Cases

- [ ] Empty state (no cards)
- [ ] All cards mastered
- [ ] No cards due for review
- [ ] LocalStorage full/unavailable
- [ ] Offline access (future)

---

## Migration Notes

### From SIE System

- Can reuse: gesture handling, animations, night mode
- Must separate: localStorage keys, data URLs
- Consider: shared utility module for common code

### localStorage Keys

```javascript
// SIE (existing)
'sie-flashcard-progress';

// Series 7 (new)
'fhm-series7-flashcards';
```

---

## Open Implementation Questions

1. **Formula rendering**: Plain text with monospace, or implement basic math formatting?
2. **Card generation**: Manual JSON creation or build script from markdown?
3. **Hint system**: Implement long-press for memory aids now or later?
4. **Stats dashboard**: Separate page or inline on start screen?

---

## Success Criteria

MVP is complete when:

- [ ] User can select topic and start session
- [ ] Spaced repetition schedules reviews correctly
- [ ] Progress persists and streak tracks
- [ ] Works on iPhone 12+ and Android
- [ ] 100+ cards available for study

---

_Implementation Plan v1.0 - January 2024_
