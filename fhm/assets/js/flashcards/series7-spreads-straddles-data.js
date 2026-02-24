/**
 * Series 7 Spreads & Straddles Flashcard Data Module
 *
 * Handles loading and accessing Spreads & Straddles flashcard data.
 * Mirrors the Series 7 flashcard-data.js structure.
 */

const SpreadsStraddlesData = (function () {
    let cards = [];
    let meta = {};
    let loaded = false;

    /**
     * Load flashcard data from JSON file
     * @returns {Promise<Array>} Array of flashcard objects
     */
    async function load() {
        if (loaded && cards.length > 0) {
            return cards;
        }

        try {
            // Path relative to the HTML page (pages/series-7/series-7-spreads-straddles-flashcards.html)
            const response = await fetch('../../assets/data/series-7-spreads-straddles-flashcards.json');
            if (!response.ok) {
                throw new Error(`Failed to load flashcards: ${response.status}`);
            }

            const data = await response.json();
            cards = data.cards || [];
            meta = data.meta || {};
            loaded = true;

            console.log(`Loaded ${cards.length} Spreads & Straddles flashcards`);
            return cards;
        } catch (error) {
            console.error('Error loading Spreads & Straddles flashcards:', error);
            return [];
        }
    }

    /**
     * Get all cards
     * @returns {Array} All flashcards
     */
    function getAll() {
        return cards;
    }

    /**
     * Get metadata about the flashcard set
     * @returns {Object} Metadata object
     */
    function getMeta() {
        return meta;
    }

    /**
     * Get cards by section (1-4 for Series 7)
     * @param {number} section - Section number (1-4)
     * @returns {Array} Cards from that section
     */
    function getBySection(section) {
        return cards.filter(card => card.section === section);
    }

    /**
     * Get cards by subsection
     * @param {string} subsection - Subsection ID
     * @returns {Array} Cards from that subsection
     */
    function getBySubsection(subsection) {
        return cards.filter(card => card.subsection === subsection);
    }

    /**
     * Get cards by tag
     * @param {string} tag - Tag to filter by (e.g., 'credit-spread', 'straddles')
     * @returns {Array} Cards with that tag
     */
    function getByTag(tag) {
        return cards.filter(card => card.tags && card.tags.includes(tag));
    }

    /**
     * Get cards by difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     * @returns {Array} Cards of that difficulty
     */
    function getByDifficulty(difficulty) {
        return cards.filter(card => card.difficulty === difficulty);
    }

    /**
     * Get a card by ID
     * @param {string} id - Card ID
     * @returns {Object|null} Card object or null
     */
    function getById(id) {
        return cards.find(card => card.id === id) || null;
    }

    /**
     * Get card count
     * @returns {number} Total number of cards
     */
    function getCount() {
        return cards.length;
    }

    /**
     * Get statistics about the card collection
     * @returns {Object} Statistics object
     */
    function getStats() {
        const bySection = {};
        const bySubsection = {};
        const byDifficulty = { easy: 0, medium: 0, hard: 0 };
        const byTag = {};

        for (const card of cards) {
            if (card.section) {
                bySection[card.section] = (bySection[card.section] || 0) + 1;
            }

            if (card.subsection) {
                bySubsection[card.subsection] = (bySubsection[card.subsection] || 0) + 1;
            }

            if (card.difficulty) {
                byDifficulty[card.difficulty] = (byDifficulty[card.difficulty] || 0) + 1;
            }

            if (card.tags) {
                for (const tag of card.tags) {
                    byTag[tag] = (byTag[tag] || 0) + 1;
                }
            }
        }

        return {
            total: cards.length,
            bySection,
            bySubsection,
            byDifficulty,
            byTag,
        };
    }

    /**
     * Get high-yield cards (weighted for exam importance)
     * @returns {Array} Cards tagged as high-yield or with weight >= 1.4
     */
    function getHighYield() {
        return cards.filter(
            card =>
                (card.tags && card.tags.includes('high-yield')) ||
                (card.weight && card.weight >= 1.4)
        );
    }

    return {
        load,
        getAll,
        getMeta,
        getBySection,
        getBySubsection,
        getByTag,
        getByDifficulty,
        getById,
        getCount,
        getStats,
        getHighYield,
    };
})();

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpreadsStraddlesData;
}
