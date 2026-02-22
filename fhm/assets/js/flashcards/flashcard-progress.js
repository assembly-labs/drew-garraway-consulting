/**
 * Flashcard Progress Module
 *
 * Handles persistence of user progress via localStorage.
 */

const FlashcardProgress = (function () {
    const STORAGE_KEY = 'sie-flashcard-progress';

    const DEFAULT_SETTINGS = {
        cardsPerSession: 20,
        prioritizeWeakCards: true,
    };

    /**
     * Get the full progress data from localStorage
     * @returns {Object} Progress data
     */
    function getData() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error reading progress data:', error);
        }

        return {
            cardProficiency: {},
            settings: { ...DEFAULT_SETTINGS },
            lastSession: null,
        };
    }

    /**
     * Save progress data to localStorage
     * @param {Object} data - Progress data to save
     */
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving progress data:', error);
        }
    }

    /**
     * Get proficiency data for a specific card
     * @param {string} cardId - Card ID
     * @returns {Object} Proficiency data
     */
    function getCardProficiency(cardId) {
        const data = getData();
        return (
            data.cardProficiency[cardId] || {
                proficiencyScore: 0,
                lastSeen: null,
                timesMarkedProficient: 0,
                timesMarkedLearning: 0,
            }
        );
    }

    /**
     * Update proficiency for a card marked as "Got it"
     * @param {string} cardId - Card ID
     */
    function markProficient(cardId) {
        const data = getData();

        if (!data.cardProficiency[cardId]) {
            data.cardProficiency[cardId] = {
                proficiencyScore: 0,
                lastSeen: null,
                timesMarkedProficient: 0,
                timesMarkedLearning: 0,
            };
        }

        const card = data.cardProficiency[cardId];
        card.proficiencyScore = Math.min(5, card.proficiencyScore + 1);
        card.lastSeen = new Date().toISOString();
        card.timesMarkedProficient++;

        saveData(data);
    }

    /**
     * Update proficiency for a card marked as "Still learning"
     * @param {string} cardId - Card ID
     */
    function markLearning(cardId) {
        const data = getData();

        if (!data.cardProficiency[cardId]) {
            data.cardProficiency[cardId] = {
                proficiencyScore: 0,
                lastSeen: null,
                timesMarkedProficient: 0,
                timesMarkedLearning: 0,
            };
        }

        const card = data.cardProficiency[cardId];
        card.proficiencyScore = Math.max(0, card.proficiencyScore - 0.5);
        card.lastSeen = new Date().toISOString();
        card.timesMarkedLearning++;

        saveData(data);
    }

    /**
     * Get user settings
     * @returns {Object} Settings object
     */
    function getSettings() {
        const data = getData();
        return { ...DEFAULT_SETTINGS, ...data.settings };
    }

    /**
     * Update user settings
     * @param {Object} newSettings - Settings to update
     */
    function updateSettings(newSettings) {
        const data = getData();
        data.settings = { ...data.settings, ...newSettings };
        saveData(data);
    }

    /**
     * Calculate days since a card was last seen
     * @param {string} cardId - Card ID
     * @returns {number} Days since last seen, or Infinity if never seen
     */
    function daysSinceLastSeen(cardId) {
        const proficiency = getCardProficiency(cardId);

        if (!proficiency.lastSeen) {
            return Infinity;
        }

        const lastSeen = new Date(proficiency.lastSeen);
        const now = new Date();
        const diffTime = Math.abs(now - lastSeen);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    /**
     * Check if a card has been seen
     * @param {string} cardId - Card ID
     * @returns {boolean} True if card has been seen
     */
    function hasBeenSeen(cardId) {
        const proficiency = getCardProficiency(cardId);
        return proficiency.lastSeen !== null;
    }

    /**
     * Get overall progress statistics
     * @param {Array} allCards - All available cards
     * @returns {Object} Progress statistics
     */
    function getOverallStats(allCards) {
        const data = getData();
        let seen = 0;
        let mastered = 0;
        let learning = 0;

        for (const card of allCards) {
            const proficiency = data.cardProficiency[card.id];
            if (proficiency && proficiency.lastSeen) {
                seen++;
                if (proficiency.proficiencyScore >= 4) {
                    mastered++;
                } else {
                    learning++;
                }
            }
        }

        return {
            total: allCards.length,
            seen,
            unseen: allCards.length - seen,
            mastered,
            learning,
            masteryPercentage:
                allCards.length > 0 ? Math.round((mastered / allCards.length) * 100) : 0,
        };
    }

    /**
     * Save session results
     * @param {Object} sessionStats - Session statistics
     */
    function saveSession(sessionStats) {
        const data = getData();
        data.lastSession = {
            date: new Date().toISOString(),
            ...sessionStats,
        };
        saveData(data);
    }

    /**
     * Get last session info
     * @returns {Object|null} Last session data
     */
    function getLastSession() {
        const data = getData();
        return data.lastSession;
    }

    /**
     * Reset all progress
     */
    function reset() {
        localStorage.removeItem(STORAGE_KEY);
    }

    return {
        getCardProficiency,
        markProficient,
        markLearning,
        getSettings,
        updateSettings,
        daysSinceLastSeen,
        hasBeenSeen,
        getOverallStats,
        saveSession,
        getLastSession,
        reset,
    };
})();

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardProgress;
}
