/**
 * Flashcard Data Factory
 *
 * Creates a configured data module for loading and querying flashcard JSON.
 *
 * @param {Object} config
 * @param {string} config.jsonPath - Path to the flashcard JSON file (relative to HTML page)
 * @param {string} config.label - Display label for console logging
 * @returns {Object} Data module with load, getAll, getMeta, filtering, and stats methods
 */
function createFlashcardData(config) {
    const { jsonPath, label } = config;

    let cards = [];
    let meta = {};
    let loaded = false;

    async function load() {
        if (loaded && cards.length > 0) return cards;

        try {
            const response = await fetch(jsonPath);
            if (!response.ok) throw new Error(`Failed to load flashcards: ${response.status}`);

            const data = await response.json();
            cards = data.cards || [];
            meta = data.meta || {};
            loaded = true;

            // cards loaded successfully
            return cards;
        } catch (error) {
            console.error(`Error loading ${label} flashcards:`, error);
            return [];
        }
    }

    function getAll() {
        return cards;
    }

    function getMeta() {
        return meta;
    }

    function getBySection(section) {
        return cards.filter(card => card.section === section);
    }

    function getBySubsection(subsection) {
        return cards.filter(card => card.subsection === subsection);
    }

    function getByTag(tag) {
        return cards.filter(card => card.tags && card.tags.includes(tag));
    }

    function getByDifficulty(difficulty) {
        return cards.filter(card => card.difficulty === difficulty);
    }

    function getById(id) {
        return cards.find(card => card.id === id) || null;
    }

    function getCount() {
        return cards.length;
    }

    function getStats() {
        const bySection = {};
        const bySubsection = {};
        const byDifficulty = { easy: 0, medium: 0, hard: 0 };
        const byTag = {};

        for (const card of cards) {
            if (card.section) bySection[card.section] = (bySection[card.section] || 0) + 1;
            if (card.subsection)
                bySubsection[card.subsection] = (bySubsection[card.subsection] || 0) + 1;
            if (card.difficulty)
                byDifficulty[card.difficulty] = (byDifficulty[card.difficulty] || 0) + 1;
            if (card.tags) {
                for (const tag of card.tags) byTag[tag] = (byTag[tag] || 0) + 1;
            }
        }

        return { total: cards.length, bySection, bySubsection, byDifficulty, byTag };
    }

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
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = createFlashcardData;
}
