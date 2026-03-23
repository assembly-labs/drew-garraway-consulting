/**
 * Flashcard Session Module
 *
 * Manages the card queue and session state.
 * Implements the weighted queue algorithm based on:
 * 1. Unseen cards from high-weight sections first
 * 2. Low proficiency cards
 * 3. Cards not seen recently
 */

const FlashcardSession = (function () {
    let queue = [];
    let currentIndex = 0;
    let originalQueueLength = 0;
    let uniqueCardsCompleted = 0;
    let cardsRequeued = 0;
    let requeuedCardIds = new Set();
    let sessionStats = {
        seen: 0,
        markedProficient: 0,
        markedLearning: 0,
    };
    let sessionActive = false;

    /**
     * Calculate priority score for a card
     * Higher score = higher priority to show
     *
     * Formula: (5 - proficiencyScore) * sectionWeight * recencyBonus
     *
     * @param {Object} card - Card object
     * @returns {number} Priority score
     */
    function calculatePriority(card) {
        const proficiency = FlashcardProgress.getCardProficiency(card.id);
        const daysSince = FlashcardProgress.daysSinceLastSeen(card.id);

        // Base score: inverse of proficiency (0-5 scale)
        const proficiencyFactor = 5 - proficiency.proficiencyScore;

        // Section weight (44% for section 2, etc.)
        const weightFactor = card.weight;

        // Recency bonus: higher for cards not seen recently
        let recencyBonus = 1;
        if (daysSince === Infinity) {
            // Never seen - highest priority
            recencyBonus = 3;
        } else if (daysSince > 7) {
            recencyBonus = 2;
        } else if (daysSince > 3) {
            recencyBonus = 1.5;
        } else if (daysSince < 1) {
            // Seen today - lower priority
            recencyBonus = 0.5;
        }

        return proficiencyFactor * weightFactor * recencyBonus;
    }

    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    function shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Build a new session queue
     * @param {Array} allCards - All available cards
     * @param {number} sessionSize - Number of cards for session (default: 20)
     * @returns {Array} Queue of cards for this session
     */
    function buildQueue(allCards, sessionSize = 20) {
        if (!allCards || allCards.length === 0) {
            return [];
        }

        const settings = FlashcardProgress.getSettings();
        const targetSize = sessionSize || settings.cardsPerSession;

        // Score all cards
        const scored = allCards.map(card => ({
            card,
            score: calculatePriority(card),
        }));

        // Sort by score (highest first)
        scored.sort((a, b) => b.score - a.score);

        // Take top cards based on session size
        const topCards = scored.slice(0, Math.min(targetSize * 2, scored.length));

        // Shuffle the top candidates
        const shuffled = shuffle(topCards);

        // Take the session size
        const sessionCards = shuffled.slice(0, targetSize).map(s => s.card);

        return sessionCards;
    }

    /**
     * Start a new session
     * @param {Array} allCards - All available cards
     * @param {number} sessionSize - Number of cards
     */
    function start(allCards, sessionSize) {
        queue = buildQueue(allCards, sessionSize);
        currentIndex = 0;
        originalQueueLength = queue.length;
        uniqueCardsCompleted = 0;
        cardsRequeued = 0;
        requeuedCardIds = new Set();
        sessionStats = {
            seen: 0,
            markedProficient: 0,
            markedLearning: 0,
        };
        sessionActive = true;

        return queue.length > 0;
    }

    /**
     * Get the current card
     * @returns {Object|null} Current card or null if session ended
     */
    function getCurrentCard() {
        if (!sessionActive || currentIndex >= queue.length) {
            return null;
        }
        return queue[currentIndex];
    }

    /**
     * Mark current card as proficient ("Got it") and advance
     */
    function markCurrentProficient() {
        const card = getCurrentCard();
        if (card) {
            FlashcardProgress.markProficient(card.id);
            sessionStats.seen++;
            sessionStats.markedProficient++;
            uniqueCardsCompleted++;
            currentIndex++;
        }
    }

    /**
     * Mark current card as still learning and move to end of queue
     */
    function markCurrentLearning() {
        const card = getCurrentCard();
        if (card) {
            FlashcardProgress.markLearning(card.id);
            sessionStats.seen++;
            sessionStats.markedLearning++;

            // Track if this is the first time this card is being requeued
            if (!requeuedCardIds.has(card.id)) {
                requeuedCardIds.add(card.id);
                cardsRequeued++;
            }

            // Move card to end of queue for another attempt
            queue.push(queue[currentIndex]);
            currentIndex++;
        }
    }

    /**
     * Skip current card without marking (for viewing only)
     */
    function skipCurrent() {
        if (currentIndex < queue.length) {
            currentIndex++;
        }
    }

    /**
     * Check if session is complete
     * @returns {boolean} True if all cards have been processed
     */
    function isComplete() {
        return !sessionActive || currentIndex >= queue.length;
    }

    /**
     * Get session progress
     * @returns {Object} Progress info
     */
    function getProgress() {
        const remaining = originalQueueLength - uniqueCardsCompleted;
        return {
            current: uniqueCardsCompleted,
            total: originalQueueLength,
            remaining: remaining,
            cardsRequeued: cardsRequeued,
            percentage:
                originalQueueLength > 0
                    ? Math.round((uniqueCardsCompleted / originalQueueLength) * 100)
                    : 0,
        };
    }

    /**
     * Get session statistics
     * @returns {Object} Session stats
     */
    function getStats() {
        return { ...sessionStats };
    }

    /**
     * End the current session
     */
    function end() {
        if (sessionActive) {
            FlashcardProgress.saveSession(sessionStats);
            sessionActive = false;
        }
    }

    /**
     * Check if a session is active
     * @returns {boolean} True if session is active
     */
    function isActive() {
        return sessionActive;
    }

    /**
     * Get the queue length
     * @returns {number} Number of cards in queue
     */
    function getQueueLength() {
        return queue.length;
    }

    return {
        start,
        getCurrentCard,
        markCurrentProficient,
        markCurrentLearning,
        skipCurrent,
        isComplete,
        getProgress,
        getStats,
        end,
        isActive,
        getQueueLength,
    };
})();

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardSession;
}
