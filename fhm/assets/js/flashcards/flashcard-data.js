/**
 * Flashcard Data Module
 *
 * Handles loading and accessing flashcard data.
 */

const FlashcardData = (function () {
    let cards = [];
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
            // Path relative to the HTML page (pages/sie/sie-flashcards.html)
            const response = await fetch('../../assets/data/flashcards.json');
            if (!response.ok) {
                throw new Error(`Failed to load flashcards: ${response.status}`);
            }

            const data = await response.json();
            cards = data.cards || [];
            loaded = true;

            console.log(`Loaded ${cards.length} flashcards`);
            return cards;
        } catch (error) {
            console.error('Error loading flashcards:', error);
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
     * Get cards by chapter
     * @param {string} chapter - Chapter ID (e.g., 'chapter-05')
     * @returns {Array} Cards from that chapter
     */
    function getByChapter(chapter) {
        return cards.filter(card => card.chapter === chapter);
    }

    /**
     * Get cards by FINRA section
     * @param {number} section - Section number (1-4)
     * @returns {Array} Cards from that section
     */
    function getBySection(section) {
        return cards.filter(card => card.section === section);
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
        const bySection = { 1: 0, 2: 0, 3: 0, 4: 0 };
        const byChapter = {};

        for (const card of cards) {
            bySection[card.section]++;
            byChapter[card.chapter] = (byChapter[card.chapter] || 0) + 1;
        }

        return {
            total: cards.length,
            bySection,
            byChapter
        };
    }

    return {
        load,
        getAll,
        getByChapter,
        getBySection,
        getById,
        getCount,
        getStats
    };
})();

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlashcardData;
}
